Ext.define('Ext.ux.BoxReorderer', {
    mixins: {
        observable: 'Ext.util.Observable'
    },

    /**
     * @cfg {String} itemSelector
     * <p>Optional. Defaults to <code>'.x-box-item'</code>
     * <p>A {@link Ext.DomQuery DomQuery} selector which identifies the encapsulating elements of child Components which participate in reordering.</p>
     */
    itemSelector: '.x-box-item',

    /**
     * @cfg {Mixed} animate
     * <p>Defaults to 300.</p>
     * <p>If truthy, child reordering is animated so that moved boxes slide smoothly into position.
     * If this option is numeric, it is used as the animation duration <b>in milliseconds</b>.</p>
     */
    animate: 300,

    constructor: function() {
        this.addEvents(
            /**
             * @event StartDrag
             * Fires when dragging of a child Component begins.
             * @param {BoxReorder} this
             * @param {Container} container The owning Container
             * @param {Component} dragCmp The Component being dragged
             * @param {Number} idx The start index of the Component being dragged.
             */
             'StartDrag',
            /**
             * @event Drag
             * Fires during dragging of a child Component.
             * @param {BoxReorder} this
             * @param {Container} container The owning Container
             * @param {Component} dragCmp The Component being dragged
             * @param {Number} startIdx The index position from which the Component was initially dragged.
             * @param {Number} idx The current closest index to which the Component would drop.
             */
             'Drag',
            /**
             * @event ChangeIndex
             * Fires when dragging of a child Component causes its drop index to change.
             * @param {BoxReorder} this
             * @param {Container} container The owning Container
             * @param {Component} dragCmp The Component being dragged
             * @param {Number} startIdx The index position from which the Component was initially dragged.
             * @param {Number} idx The current closest index to which the Component would drop.
             */
             'ChangeIndex',
            /**
             * @event Drop
             * Fires when a child Component is dropped at a new index position.
             * @param {BoxReorder} this
             * @param {Container} container The owning Container
             * @param {Component} dragCmp The Component being dropped
             * @param {Number} startIdx The index position from which the Component was initially dragged.
             * @param {Number} idx The index at which the Component is being dropped.
             */
             'Drop'
        );
        this.mixins.observable.constructor.apply(this, arguments);
    },

    init: function(container) {
        var l = container.getLayout();
        this.container = container;

        // Initialize the DD on first layout, when the innerCt has been created.
        this.container.afterLayout = Ext.Function.createSequence(this.container.afterLayout, this.afterFirstLayout, this);

        container.destroy = Ext.Function.createSequence(container.destroy, this.onContainerDestroy, this);
    },

    /**
     * @private Clear up on Container destroy
     */
    onContainerDestroy: function() {
        if (this.dd) {
            this.dd.unreg();
        }
    },

    afterFirstLayout: function() {
        var me = this,
            l = me.container.getLayout();

        // delete the sequence
        delete me.container.afterLayout;

        // Create a DD instance. Poke the handlers in.
        // TODO: Ext5's DD classes should apply config to themselves.
        // TODO: Ext5's DD classes should not use init internally because it collides with use as a plugin
        // TODO: Ext5's DD classes should be Observable.
        // TODO: When all the above are trus, this plugin should extend the DD class.
        me.dd = new Ext.dd.DD(l.innerCt, me.container.id + '-reorderer');
        Ext.apply(me.dd, {
            animate: me.animate,
            reorderer: me,
            container: me.container,
            getDragCmp: this.getDragCmp,
            clickValidator: Ext.Function.createInterceptor(me.dd.clickValidator, me.clickValidator, me.dd, false),
            onMouseDown: me.onMouseDown,
            startDrag: me.startDrag,
            onDrag: me.onDrag,
            endDrag: me.endDrag,
            getNewIndex: me.getNewIndex
        });

        // Decide which dimension we are measuring, and which measurement metric defines
        // the *start* of the box depending upon orientation.
        me.dd.dim = l.parallelPrefix;
        me.dd.startAttr = l.parallelBefore;
        me.dd.endAttr = l.parallelAfter;
    },

    getDragCmp: function(e) {
        return this.container.getChildByElement(e.getTarget(this.itemSelector, 10));
    },

    // check if the clicked component is reorderable
    clickValidator: function(e) {
        var cmp = this.getDragCmp(e);
        return (cmp && cmp.reorderable !== false);
    },

    onMouseDown: function(e) {
        var me = this,
            container = me.container,
            containerBox,
            cmpEl,
            cmpBox;

        // Ascertain which child Component is being mousedowned
        me.dragCmp = me.getDragCmp(e);
        if (me.dragCmp) {
            cmpEl = me.dragCmp.getEl();
            me.startIndex = me.curIndex = container.items.indexOf(me.dragCmp);

            // Start position of dragged Component
            cmpBox = cmpEl.getPageBox();

            // Last tracked start position
            me.lastPos = cmpBox[this.startAttr];

            // Calculate constraints depending upon orientation
            // Calculate offset from mouse to dragEl position
            containerBox = container.el.getPageBox();
            if (me.dim == 'width') {
                me.minX = containerBox.left;
                me.maxX = containerBox.right - cmpBox.width;
                me.minY = me.maxY = cmpBox.top;
                me.deltaX = e.getPageX() - cmpBox.left;
            } else {
                me.minY = containerBox.top;
                me.maxY = containerBox.bottom - cmpBox.height;
                me.minX = me.maxX = cmpBox.left;
                me.deltaY = e.getPageY() - cmpBox.top;
            }
            me.constrainY = me.constrainX = true;
        } 
    },

    startDrag: function() {
        var me = this;
        if (me.dragCmp) {
            // If the BoxLayout is not animated, animate it just for the duration of the drag operation.
            if (!me.container.layout.animate && me.animate) {
                me.container.layout.animate = me.animate;
                me.removeAnimate = true;
            }
            // We drag the Component element
            me.dragElId = me.dragCmp.getEl().id;
            me.reorderer.fireEvent('StartDrag', me, me.container, me.dragCmp, me.curIndex);
            // Suspend events, and et the disabled flag so that the mousedown and mouseup events
            // that are going to take place do not cause any other UI interaction.
            me.dragCmp.suspendEvents();
            me.dragCmp.disabled = true;
            me.dragCmp.el.setStyle('zIndex', 100);
        } else {
            me.dragElId = null;
        }
    },

    onDrag: function(e) {
        var me = this,
            newIndex;

        me.reorderer.fireEvent('Drag', me, me.container, me.dragCmp, me.startIndex, me.curIndex);
        newIndex = me.getNewIndex(e.getPoint());

        if ((newIndex !== undefined) && (newIndex != me.curIndex) && me.container.items.getAt(newIndex).reorderable !== false) {
            me.reorderer.fireEvent('ChangeIndex', me, me.container, me.dragCmp, me.startIndex, newIndex);
            // Defeat the layout's positioning
            me.dragCmp.setPosition = Ext.emptyFn;
            me.container.move(me.curIndex, newIndex);
            delete me.dragCmp.setPosition;
            me.curIndex = newIndex;
        }
    },

    endDrag: function() {
        var me = this;
        if (me.dragCmp) {
            delete me.dragElId;
            if (me.animate) {
                me.container.layout.animate = {
                    callback: me.reorderer.afterBoxReflow.bind(me)
                };
            }
            me.container.doLayout();
            if (me.removeAnimate) {
                delete me.removeAnimate;
                delete me.container.layout.animate;
            } else {
                me.reorderer.afterBoxReflow.call(me);
            }
            me.reorderer.fireEvent('drop', me, me.container, me.dragCmp, me.startIndex, me.curIndex);
        }
    },

    /**
     * @private
     * Called after the boxes have been reflowed after the drop.
     */
    afterBoxReflow: function() {
        var me = this;
        me.dragCmp.el.setStyle('zIndex', '');
        me.dragCmp.disabled = false;
        me.dragCmp.resumeEvents();
    },

    /**
     * @private
     * Calculate drop index based upon the dragEl's position.
     */
    getNewIndex: function(pointerPos) {
        var me = this,
            dragEl = me.getDragEl(),
            dragBox = Ext.fly(dragEl).getPageBox(),
            dragMidpoint = dragBox[me.startAttr] + (dragBox[me.dim] >> 1),
            targetEl,
            targetBox,
            targetMidpoint,
            i = 0,
            it = me.container.items.items,
            ln = it.length,
            lastPos = me.lastPos;

        me.lastPos = dragBox[me.startAttr];

        for (; i < ln; i++) {
            targetEl = it[i].getEl();

            // Only look for a drop point if this found item is an item according to our selector
            if (targetEl.is(me.reorderer.itemSelector)) {
                targetBox = targetEl.getPageBox();
                targetMidpoint = targetBox[me.startAttr] + (targetBox[me.dim] >> 1);
                if (i < me.curIndex) {
                    if ((dragBox[me.startAttr] < lastPos) && (dragBox[me.startAttr] < (targetMidpoint - 5))) {
                        return i;
                    }
                } else if (i > me.curIndex) {
                    if ((dragBox[me.startAttr] > lastPos) && (dragBox[me.endAttr] > (targetMidpoint + 5))) {
                        return i;
                    }
                }
            }
        }
    }
});