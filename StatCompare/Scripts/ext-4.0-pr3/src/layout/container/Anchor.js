/**
 * @class Ext.layout.container.Anchor
 * @extends Ext.layout.Container
 * <p>This is a layout that enables anchoring of contained elements relative to the container's dimensions.
 * If the container is resized, all anchored items are automatically rerendered according to their
 * <b><tt>{@link #anchor}</tt></b> rules.</p>
 * <p>This class is intended to be extended or created via the layout: 'anchor' {@link Ext.layout.AbstractContainer#layout}
 * config, and should generally not need to be created directly via the new keyword.</p>
 * <p>AnchorLayout does not have any direct config options (other than inherited ones). By default,
 * AnchorLayout will calculate anchor measurements based on the size of the container itself. However, the
 * container using the AnchorLayout can supply an anchoring-specific config property of <b>anchorSize</b>.
 * If anchorSize is specifed, the layout will use it as a virtual container for the purposes of calculating
 * anchor measurements based on it instead, allowing the container to be sized independently of the anchoring
 * logic if necessary.  For example:</p>
 * <pre><code>
 * TODO: Make a real world example.
 * </code></pre>
 */

Ext.define('Ext.layout.container.Anchor', {

    /* Begin Definitions */

    alias: 'layout.anchor',

    extend: 'Ext.layout.Container',

    /* End Definitions */

    /**
     * @cfg {String} anchor
     * <p>This configuation option is to be applied to <b>child <tt>items</tt></b> of a container managed by
     * this layout (ie. configured with <tt>layout:'anchor'</tt>).</p><br/>
     *
     * <p>This value is what tells the layout how an item should be anchored to the container. <tt>items</tt>
     * added to an AnchorLayout accept an anchoring-specific config property of <b>anchor</b> which is a string
     * containing two values: the horizontal anchor value and the vertical anchor value (for example, '100% 50%').
     * The following types of anchor values are supported:<div class="mdetail-params"><ul>
     *
     * <li><b>Percentage</b> : Any value between 1 and 100, expressed as a percentage.<div class="sub-desc">
     * The first anchor is the percentage width that the item should take up within the container, and the
     * second is the percentage height.  For example:<pre><code>
// two values specified
anchor: '100% 50%' // render item complete width of the container and
                   // 1/2 height of the container
// one value specified
anchor: '100%'     // the width value; the height will default to auto
     * </code></pre></div></li>
     *
     * <li><b>Offsets</b> : Any positive or negative integer value.<div class="sub-desc">
     * This is a raw adjustment where the first anchor is the offset from the right edge of the container,
     * and the second is the offset from the bottom edge. For example:<pre><code>
// two values specified
anchor: '-50 -100' // render item the complete width of the container
                   // minus 50 pixels and
                   // the complete height minus 100 pixels.
// one value specified
anchor: '-50'      // anchor value is assumed to be the right offset value
                   // bottom offset will default to 0
     * </code></pre></div></li>
     *
     * <li><b>Sides</b> : Valid values are <tt>'right'</tt> (or <tt>'r'</tt>) and <tt>'bottom'</tt>
     * (or <tt>'b'</tt>).<div class="sub-desc">
     * Either the container must have a fixed size or an anchorSize config value defined at render time in
     * order for these to have any effect.</div></li>
     *
     * <li><b>Mixed</b> : <div class="sub-desc">
     * Anchor values can also be mixed as needed.  For example, to render the width offset from the container
     * right edge by 50 pixels and 75% of the container's height use:
     * <pre><code>
anchor: '-50 75%'
     * </code></pre></div></li>
     *
     *
     * </ul></div>
     */

    type: 'anchor',

    /**
     * @cfg {String} defaultAnchor
     *
     * default anchor for all child container items applied if no anchor or specific width is set on the child item.  Defaults to '100%'.
     *
     */
    defaultAnchor: '100%',

    parseAnchorRE: /^(r|right|b|bottom)$/i,

    // private
    onLayout: function() {
        Ext.layout.container.Anchor.superclass.onLayout.call(this, arguments);

        var me = this,
            size = me.getLayoutTargetSize(),
            owner = me.owner,
            target = me.getTarget(),
            ownerWidth = size.width,
            ownerHeight = size.height,
            overflow = target.getStyle('overflow'),
            components = me.getVisibleItems(owner),
            len = components.length,
            boxes = [],
            box, newTargetSize, anchorWidth, anchorHeight, component, anchorSpec, calcWidth, calcHeight,
            anchorsArray, anchor, i, el, undefined;

        if (ownerWidth < 20 && ownerHeight < 20) {
            return;
        }

        // find the container anchoring size
        if (owner.anchorSize) {
            if (typeof owner.anchorSize == 'number') {
                anchorWidth = owner.anchorSize;
            }
            else {
                anchorWidth = owner.anchorSize.width;
                anchorHeight = owner.anchorSize.height;
            }
        }
        else {
            anchorWidth = owner.initialConfig.width;
            anchorHeight = owner.initialConfig.height;
        }

        for (i = 0; i < len; i++) {
            component = components[i];
            el = component.el;
            anchor = component.anchor;

            if (!component.anchor && component.items && !Ext.isNumber(component.width) && !(Ext.isIE6 && Ext.isStrict)) {
                component.anchor = anchor = me.defaultAnchor;
            }

            if (anchor) {
                anchorSpec = component.anchorSpec;
                // cache all anchor values
                if (!anchorSpec) {
                    anchorsArray = anchor.split(' ');
                    component.anchorSpec = anchorSpec = {
                        right: me.parseAnchor(anchorsArray[0], component.initialConfig.width, anchorWidth),
                        bottom: me.parseAnchor(anchorsArray[1], component.initialConfig.height, anchorHeight)
                    };
                }
                calcWidth = anchorSpec.right ? me.adjustWidthAnchor(anchorSpec.right(ownerWidth) - el.getMargin('lr'), component) : undefined;
                calcHeight = anchorSpec.bottom ? me.adjustHeightAnchor(anchorSpec.bottom(ownerHeight) - el.getMargin('tb'), component) : undefined;

                boxes.push({
                    component: component,
                    anchor: true,
                    width: calcWidth || undefined,
                    height: calcHeight || undefined
                });
            } else {
                boxes.push({
                    component: component,
                    anchor: false
                });
            }
        }

        for (i = 0; i < len; i++) {
            box = boxes[i];
            if (box.anchor) {
                me.setItemSize(box.component, box.width, box.height);
            }
            else {
                me.layoutItem(box.component);
            }
        }

        if (overflow && overflow != 'hidden' && !me.adjustmentPass) {
            newTargetSize = me.getLayoutTargetSize();
            if (newTargetSize.width != size.width || newTargetSize.height != size.height) {
                me.adjustmentPass = true;
                me.onLayout();
            }
        }

        delete me.adjustmentPass;
    },

    // private
    parseAnchor: function(a, start, cstart) {
        if (a && a != 'none') {
            var ratio;
            // standard anchor
            if (this.parseAnchorRE.test(a)) {
                var diff = cstart - start;
                return function(v) {
                    return v - diff;
                };
            }    
            // percentage
            else if (a.indexOf('%') != -1) {
                ratio = parseFloat(a.replace('%', '')) * 0.01;
                return function(v) {
                    return Math.floor(v * ratio);
                };
            }    
            // simple offset adjustment
            else {
                a = parseInt(a, 10);
                if (!isNaN(a)) {
                    return function(v) {
                        return v + a;
                    };
                }
            }
        }
        return null;
    },

    // private
    adjustWidthAnchor: function(value, comp) {
        return value;
    },

    // private
    adjustHeightAnchor: function(value, comp) {
        return value;
    }

});