/**
 * @class Ext.layout.component.AbstractDock
 * @extends Ext.layout.Component
 * @private
 * This ComponentLayout handles docking for Panels. It takes care of panels that are
 * part of a ContainerLayout that sets this Panel's size and Panels that are part of
 * an AutoContainerLayout in which this panel get his height based of the CSS or
 * or its content.
 */

Ext.define('Ext.layout.component.AbstractDock', {

    /* Begin Definitions */

    extend: 'Ext.layout.Component',

    /* End Definitions */

    type: 'dock',

    /**
     * @private
     * @property autoSizing
     * @type boolean
     * This flag is set to indicate this layout may have an autoHeight/autoWidth.
     */
    autoSizing: true,

    /**
     * @property itemCls
     * @type String
     * This class is automatically added to each docked item within this layout.
     * We also use this as a prefix for the position class e.g. x-docked-bottom
     */
    itemCls: Ext.baseCSSPrefix + 'docked',

    /**
     * @protected
     * @param {Ext.Component} owner The Panel that owns this DockLayout
     * @param {Ext.core.Element} target The target in which we are going to render the docked items
     * @param {Array} args The arguments passed to the ComponentLayout.layout method
     */
    onLayout: function(width, height) {
        var me = this,
            owner = me.owner,
            body = owner.body,
            layout = owner.layout,
            target = me.getTarget(),
            autoWidth = false,
            autoHeight = false,
            padding,
            border,
            frameSize;

        // We start of by resetting all the layouts info
        var info = me.info = {
            boxes: [],
            size: {
                width: width,
                height: height
            },
            bodyBox: {}
        };
        
        Ext.applyIf(info, me.getTargetInfo());

        // Determine if we have an autoHeight or autoWidth.
        if (height === undefined || height === null || width === undefined || width === null) {
            padding = info.padding;
            border = info.border;
            frameSize = me.frameSize;

            // Auto-everything, clear out any style height/width and read from css
            if ((height === undefined || height === null) && (width === undefined || width === null)) {
                autoHeight = true;
                autoWidth = true;
                me.setTargetSize(null, null);
                me.setBodyBox({width: null, height: null});
            }
            // Auto-height
            else if (height === undefined || height === null) {
                autoHeight = true;
                // Clear any sizing that we already set in a previous layout
                me.setTargetSize(width, null);
                me.setBodyBox({width: width - padding.left - border.left - padding.right - border.right - frameSize.left - frameSize.right, height: null});
            // Auto-width
            }
            else {
                autoWidth = true;
                // Clear any sizing that we already set in a previous layout
                me.setTargetSize(null, height);
                me.setBodyBox({width: null, height: height - padding.top - padding.bottom - border.top - border.bottom - frameSize.top - frameSize.bottom});
            }

            // Run the container
            if (layout && layout.isLayout) {
                // Auto-Sized so have the container layout notify the component layout.
                layout.bindToOwnerCtComponent = true;
                layout.layout();
                
                // If this is an autosized container layout, then we must compensate for a
                // body that is being autosized.  We do not want to adjust the body's size
                // to accommodate the dock items, but rather we will want to adjust the
                // target's size.
                //
                // This is necessary because, particularly in a Box layout, all child items
                // are set with absolute dimensions that are not flexible to the size of its
                // innerCt/target.  So once they are laid out, they are sized for good. By
                // shrinking the body box to accommodate dock items, we're merely cutting off
                // parts of the body.  Not good.  Instead, the target's size should expand
                // to fit the dock items in.  This is valid because the target container is
                // suppose to be autosized to fit everything accordingly.
                info.autoSizedCtLayout = layout.autoSize === true;
            }

            // The dockItems method will add all the top and bottom docked items height
            // to the info.panelSize height. That's why we have to call setSize after
            // we dock all the items to actually set the panel's width and height.
            // We have to do this because the panel body and docked items will be position
            // absolute which doesn't stretch the panel.
            me.dockItems(autoWidth, autoHeight);
            me.setTargetSize(info.size.width, info.size.height);
        }
        else {
            me.setTargetSize(width, height);
            me.dockItems();
        }
        me.callParent(arguments);
    },

    /**
     * @protected
     * This method will first update all the information about the docked items,
     * body dimensions and position, the panel's total size. It will then
     * set all these values on the docked items and panel body.
     * @param {Array} items Array containing all the docked items
     * @param {Boolean} autoBoxes Set this to true if the Panel is part of an
     * AutoContainerLayout
     */
    dockItems : function(autoWidth, autoHeight) {
        this.calculateDockBoxes(autoWidth, autoHeight);

        // Both calculateAutoBoxes and calculateSizedBoxes are changing the
        // information about the body, panel size, and boxes for docked items
        // inside a property called info.
        var info = this.info,
            boxes = info.boxes,
            ln = boxes.length,
            dock, i;

        // We are going to loop over all the boxes that were calculated
        // and set the position of each item the box belongs to.
        for (i = 0; i < ln; i++) {
            dock = boxes[i];
            dock.item.setPosition(dock.x, dock.y);
            if ((autoWidth || autoHeight) && dock.layout && dock.layout.isLayout) {
                // Auto-Sized so have the container layout notify the component layout.
                dock.layout.bindToOwnerCtComponent = true;
            }
        }

        // Don't adjust body width/height if the target is using an auto container layout.
        // But, we do want to adjust the body size if the container layout is auto sized.
        if (!info.autoSizedCtLayout) {
            if (autoWidth) {
                info.bodyBox.width = null;
            }
            if (autoHeight) {
                info.bodyBox.height = null;
            }
        }
        
        // If the bodyBox has been adjusted because of the docked items
        // we will update the dimensions and position of the panel's body.
        this.setBodyBox(info.bodyBox);
    },

    /**
     * @protected
     * This method will set up some initial information about the panel size and bodybox
     * and then loop over all the items you pass it to take care of stretching, aligning,
     * dock position and all calculations involved with adjusting the body box.
     * @param {Array} items Array containing all the docked items we have to layout
     */
    calculateDockBoxes : function(autoWidth, autoHeight) {
        // We want to use the Panel's el width, and the Panel's body height as the initial
        // size we are going to use in calculateDockBoxes. We also want to account for
        // the border of the panel.
        var me = this,
            target = me.getTarget(),
            items = me.getLayoutItems(),
            owner = me.owner,
            bodyEl = owner.body,
            info = me.info,
            size = info.size,
            ln = items.length,
            padding = info.padding,
            border = info.border,
            frameSize = me.frameSize,
            item, i, box, rect, w;
        
        // If this Panel is inside an AutoContainerLayout, we will base all the calculations
        // around the height of the body and the width of the panel.
        if (autoHeight) {
            size.height = bodyEl.getHeight() + padding.top + border.top + padding.bottom + border.bottom + frameSize.top + frameSize.bottom;
        }
        else {
            size.height = target.getHeight();
        }
        if (autoWidth) {
            // Gecko will in some cases report an offsetWidth that is actually less than the width of the
            // text contents, because it measures fonts with sub-pixel precision but rounds the calculated
            // value down. Using getBoundingClientRect instead of offsetWidth allows us to get the precise
            // subpixel measurements so we can force them to always be rounded up. See
            // https://bugzilla.mozilla.org/show_bug.cgi?id=458617
            if (Ext.supports.BoundingClientRect) {
                rect = bodyEl.dom.getBoundingClientRect();
                w = Math.ceil(rect.right - rect.left);
            } else {
                w = bodyEl.getWidth();
            }
            size.width = w + padding.left + border.left + padding.right + border.right + frameSize.left + frameSize.right;
        }
        else {
            size.width = target.getWidth();
        }

        info.bodyBox = {
            x: padding.left + frameSize.left,
            y: padding.top + frameSize.top,
            width: size.width - padding.left - border.left - padding.right - border.right - frameSize.left - frameSize.right,
            height: size.height - border.top - padding.top - border.bottom - padding.bottom - frameSize.top - frameSize.bottom
        };

        // Loop over all the docked items
        for (i = 0; i < ln; i++) {
            item = items[i];
            // The initBox method will take care of stretching and alignment
            // In some cases it will also layout the dock items to be able to
            // get a width or height measurement
            box = me.initBox(item);

            if (autoHeight === true) {
                box = me.adjustAutoBox(box, i);
            }
            else {
                box = me.adjustSizedBox(box, i);
            }

            // Save our box. This allows us to loop over all docked items and do all
            // calculations first. Then in one loop we will actually size and position
            // all the docked items that have changed.
            info.boxes.push(box);
        }
    },

    /**
     * @protected
     * This method will adjust the position of the docked item and adjust the body box
     * accordingly.
     * @param {Object} box The box containing information about the width and height
     * of this docked item
     * @param {Number} index The index position of this docked item
     * @return {Object} The adjusted box
     */
    adjustSizedBox : function(box, index) {
        var bodyBox = this.info.bodyBox,
            frameSize = this.frameSize,
            info = this.info,
            padding = info.padding,
            pos = box.type,
            border = info.border;
            
        switch (pos) {
            case 'top':
                box.y = bodyBox.y;
                break;

            case 'left':
                box.x = bodyBox.x;
                break;

            case 'bottom':
                box.y = (bodyBox.y + bodyBox.height) - box.height;
                break;

            case 'right':
                box.x = (bodyBox.x + bodyBox.width) - box.width;
                break;
        }
        
        if (box.ignoreFrame) {
            if (pos == 'bottom') {
                box.y += (frameSize.bottom + padding.bottom + border.bottom);
            }
            else {
                box.y -= (frameSize.top + padding.top + border.top);
            }
            if (pos == 'right') {
                box.x += (frameSize.right + padding.right + border.right);
            }
            else {
                box.x -= (frameSize.left + padding.left + border.left);
            }
        }
        
        // If this is not an overlaying docked item, we have to adjust the body box
        if (!box.overlay) {
            switch (pos) {
                case 'top':
                    bodyBox.y += box.height;
                    bodyBox.height -= box.height;
                    break;

                case 'left':
                    bodyBox.x += box.width;
                    bodyBox.width -= box.width;
                    break;

                case 'bottom':
                    bodyBox.height -= box.height;
                    break;

                case 'right':
                    bodyBox.width -= box.width;
                    break;
            }
        }
        return box;
    },

    /**
     * @protected
     * This method will adjust the position of the docked item inside an AutoContainerLayout
     * and adjust the body box accordingly.
     * @param {Object} box The box containing information about the width and height
     * of this docked item
     * @param {Number} index The index position of this docked item
     * @return {Object} The adjusted box
     */
    adjustAutoBox : function (box, index) {
        var info = this.info,
            bodyBox = info.bodyBox,
            size = info.size,
            boxes = info.boxes,
            pos = box.type,
            frameSize = this.frameSize,
            padding = info.padding,
            border = info.border,
            autoSizedCtLayout = info.autoSizedCtLayout,
            i, adjustBox;

        if (pos == 'top' || pos == 'bottom') {
            // This can affect the previously set left and right and bottom docked items
            for (i = 0; i < index; i++) {
                adjustBox = boxes[i];
                if (adjustBox.stretched && adjustBox.type == 'left' || adjustBox.type == 'right') {
                    adjustBox.height += box.height;
                }
                else if (adjustBox.type == 'bottom') {
                    adjustBox.y += box.height;
                }
            }
        }
        
        switch (pos) {
            case 'top':
                box.y = bodyBox.y;
                if (!box.overlay) {
                    bodyBox.y += box.height;
                }
                size.height += box.height;
                break;

            case 'bottom':
                box.y = (bodyBox.y + bodyBox.height);
                size.height += box.height;
                break;

            case 'left':
                box.x = bodyBox.x;
                if (!box.overlay) {
                    bodyBox.x += box.width;
                    if (autoSizedCtLayout) {
                        size.width += box.width;
                    } else {
                        bodyBox.width -= box.width;
                    }
                }
                break;

            case 'right':
                if (!box.overlay) {
                    if (autoSizedCtLayout) {
                        size.width += box.width;
                    } else {
                        bodyBox.width -= box.width;
                    }
                }
                box.x = (bodyBox.x + bodyBox.width);
                break;
        }

        if (box.ignoreFrame) {
            if (pos == 'bottom') {
                box.y += (frameSize.bottom + padding.bottom + border.bottom);
            }
            else {
                box.y -= (frameSize.top + padding.top + border.top);
            }
            if (pos == 'right') {
                box.x += (frameSize.right + padding.right + border.right);
            }
            else {
                box.x -= (frameSize.left + padding.left + border.left);
            }
        }
        
        return box;
    },

    /**
     * @protected
     * This method will create a box object, with a reference to the item, the type of dock
     * (top, left, bottom, right). It will also take care of stretching and aligning of the
     * docked items.
     * @param {Ext.Component} item The docked item we want to initialize the box for
     * @return {Object} The initial box containing width and height and other useful information
     */
    initBox : function(item) {
        var bodyBox = this.info.bodyBox,
            horizontal = (item.dock == 'top' || item.dock == 'bottom'),
            owner = this.owner,
            frameSize = this.frameSize,
            info = this.info,
            padding = info.padding,
            border = info.border,
            box = {
                item: item,
                overlay: item.overlay,
                type: item.dock,
                offsets: Ext.core.Element.parseBox(item.offsets || {}),
                ignoreFrame: item.ignoreParentFrame
            };
        // First we are going to take care of stretch and align properties for all four dock scenarios.
        if (item.stretch !== false) {
            box.stretched = true;
            if (horizontal) {
                box.x = bodyBox.x + box.offsets.left;
                box.width = bodyBox.width - (box.offsets.left + box.offsets.right);
                if (box.ignoreFrame) {
                    box.width += (frameSize.left + frameSize.right + border.left + border.right + padding.left + padding.right);
                }
                item.setCalculatedSize(box.width - item.el.getMargin('lr'), undefined, owner);
            }
            else {
                box.y = bodyBox.y + box.offsets.top;
                box.height = bodyBox.height- (box.offsets.bottom + box.offsets.top);
                if (box.ignoreFrame) {
                    box.height += (frameSize.top + frameSize.bottom + border.top + border.bottom + padding.top + padding.bottom);
                }
                item.setCalculatedSize(undefined, box.height - item.el.getMargin('tb'), owner);

                // At this point IE will report the left/right-docked toolbar as having a width equal to the
                // container's full width. Forcing a repaint kicks it into shape so it reports the correct width.
                if (!Ext.supports.ComputedStyle) {
                    item.el.repaint();
                }
            }
        }
        else {
            item.doComponentLayout();
            box.width = item.getWidth() - (box.offsets.left + box.offsets.right);
            box.height = item.getHeight() - (box.offsets.bottom + box.offsets.top);
            box.y += box.offsets.top;
            if (horizontal) {
                box.x = (item.align == 'right') ? bodyBox.width - box.width : bodyBox.x;
                box.x += box.offsets.left;
            }
        }

        // If we haven't calculated the width or height of the docked item yet
        // do so, since we need this for our upcoming calculations
        if (box.width == undefined) {
            box.width = item.getWidth() + item.el.getMargin('lr');
        }
        if (box.height == undefined) {
            box.height = item.getHeight() + item.el.getMargin('tb');
        }
        
        return box;
    },

    /**
     * @protected
     * Returns an array containing all the <b>visible</b> docked items inside this layout's owner Panel
     * @return {Array} An array containing all the <b>visible</b> docked items of the Panel
     */
    getLayoutItems : function() {
        var it = this.owner.getDockedItems(),
            ln = it.length,
            i = 0,
            result = [];
        for (; i < ln; i++) {
            if (it[i].isVisible(true)) {
                result.push(it[i]);
            }
        }
        return result;
    },

    /**
     * @protected
     * This function will be called by the dockItems method. Since the body is positioned absolute,
     * we need to give it dimensions and a position so that it is in the middle surrounded by
     * docked items
     * @param {Object} box An object containing new x, y, width and height values for the
     * Panel's body
     */
    setBodyBox : function(box) {
        var me = this,
            owner = me.owner,
            body = owner.body,
            info = me.info,
            bodyMargin = info.bodyMargin,
            padding = info.padding,
            border = info.border,
            frameSize = me.frameSize;

        // Panel collapse effectively hides the Panel's body, so this is a no-op.
        if (owner.collapsed) {
            return;
        }

        if (Ext.isNumber(box.width)) {
            box.width -= bodyMargin.left + bodyMargin.right;
        }
        if (Ext.isNumber(box.height)) {
            box.height -= bodyMargin.top + bodyMargin.bottom;
        }

        me.setElementSize(body, box.width, box.height);
        if (Ext.isNumber(box.x)) {
            body.setLeft(box.x - padding.left - frameSize.left);
        }
        if (Ext.isNumber(box.y)) {
            body.setTop(box.y - padding.top - frameSize.top);
        }
    },

    /**
     * @protected
     * We are overriding the Ext.layout.Layout configureItem method to also add a class that
     * indicates the position of the docked item. We use the itemCls (x-docked) as a prefix.
     * An example of a class added to a dock: right item is x-docked-right
     * @param {Ext.Component} item The item we are configuring
     */
    configureItem : function(item, pos) {
        this.callParent(arguments);
        var el = item.el || Ext.get(item);
        if (this.itemCls) {
            el.addCls(this.itemCls + '-' + item.dock);
        }
    },

    afterRemove : function(item) {
        this.callParent(arguments);
        if (this.itemCls) {
            item.el.removeCls(this.itemCls + '-' + item.dock);
        }
        var dom = item.el.dom;

        if (dom) {
            dom.parentNode.removeChild(dom);
        }

        this.childrenChanged = true;
    }
});