/**
 * @class Ext.tip.Tip
 * @extends Ext.panel.Panel
 * This is the base class for {@link Ext.tip.QuickTip} and {@link Ext.tip.ToolTip} that provides the basic layout and
 * positioning that all tip-based classes require. This class can be used directly for simple, statically-positioned
 * tips that are displayed programmatically, or it can be extended to provide custom tip implementations.
 * @constructor
 * Create a new Tip
 * @param {Object} config The configuration options
 * @xtype tip
 */
Ext.define('Ext.tip.Tip', {
    extend: 'Ext.panel.Panel',
    requires: [ 'Ext.layout.component.Tip' ],
    alias: 'widget.tip',
    alternateClassName: 'Ext.Tip',
    /**
     * @cfg {Boolean} closable True to render a close tool button into the tooltip header (defaults to false).
     */
    /**
     * @cfg {Number} width
     * Width in pixels of the tip (defaults to auto).  Width will be ignored if it exceeds the bounds of
     * {@link #minWidth} or {@link #maxWidth}.  The maximum supported value is 500.
     */
    /**
     * @cfg {Number} minWidth The minimum width of the tip in pixels (defaults to 40).
     */
    minWidth : 40,
    /**
     * @cfg {Number} maxWidth The maximum width of the tip in pixels (defaults to 300).  The maximum supported value is 500.
     */
    maxWidth : 300,
    /**
     * @cfg {Boolean/String} shadow True or "sides" for the default effect, "frame" for 4-way shadow, and "drop"
     * for bottom-right shadow (defaults to "sides").
     */
    shadow : "sides",
    
    /**
     * @cfg {String} defaultAlign <b>Experimental</b>. The default {@link Ext.core.Element#alignTo} anchor position value
     * for this tip relative to its element of origin (defaults to "tl-bl?").
     */
    defaultAlign : "tl-bl?",
    /**
     * @cfg {Boolean} constrainPosition If true, then the tooltip will be automatically constrained to stay within
     * the browser viewport. Defaults to false.
     */
    constrainPosition : false,

    // private panel overrides
    autoRender: true,
    hidden: true,
    baseCls: Ext.baseCSSPrefix + 'tip',
    floating: {
        shadow: true,
        shim: true,
        constrain: false
    },
    componentLayout: 'tip',

    closeAction: 'hide',

    ariaRole: 'tooltip',

    /**
     * Shows this tip at the specified XY position.  Example usage:
     * <pre><code>
// Show the tip at x:50 and y:100
tip.showAt([50,100]);
</code></pre>
     * @param {Array} xy An array containing the x and y coordinates
     */
    showAt : function(xy){
        var me = this;
        Ext.tip.Tip.superclass.show.call(me);
        // Show may have been vetoed.
        if (me.isVisible()) {
            if (me.constrainPosition) {
                xy = me.el.adjustForConstraints(xy, me.el.dom.parentNode);
            }
            me.setPagePosition(xy[0], xy[1]);
            me.toFront(true);
        }
    },

    /**
     * <b>Experimental</b>. Shows this tip at a position relative to another element using a standard {@link Ext.core.Element#alignTo}
     * anchor position value.  Example usage:
     * <pre><code>
// Show the tip at the default position ('tl-br?')
tip.showBy('my-el');

// Show the tip's top-left corner anchored to the element's top-right corner
tip.showBy('my-el', 'tl-tr');
</code></pre>
     * @param {Mixed} el An HTMLElement, Ext.core.Element or string id of the target element to align to
     * @param {String} position (optional) A valid {@link Ext.core.Element#alignTo} anchor position (defaults to 'tl-br?' or
     * {@link #defaultAlign} if specified).
     */
    showBy : function(el, pos) {
        this.showAt(this.el.getAlignToXY(el, pos || this.defaultAlign));
    },
    
    // override the superclass method, don't want to focus the tip
    afterShow: function() {
        var me = this;
        
        if (me.floating) {
            me.toFront(true);
        }
        me.fireEvent('show', me);
    },

    /**
     * @private
     * @override
     * Set Tip draggable using base Component's draggability
     */
    initDraggable : function(){
        var me = this;
        me.draggable = {
            el: me.getDragEl(),
            delegate: me.header.el,
            constrain: me,
            constrainTo: me.el.dom.parentNode
        };
        // Important: Bypass Panel's initDraggable. Call direct to Component's implementation.
        Ext.Component.prototype.initDraggable.call(me);
    },

    // Tip does not ghost. Drag is "live"
    ghost: undefined,
    unghost: undefined
});