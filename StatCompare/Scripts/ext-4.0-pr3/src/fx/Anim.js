/**
 * @class Ext.fx.Anim
 * Animation instance...
 */

Ext.define('Ext.fx.Anim', {

    /* Begin Definitions */

    mixins: {
        observable: 'Ext.util.Observable'
    },

    requires: ['Ext.fx.Manager', 'Ext.fx.Animator', 'Ext.fx.Easing', 'Ext.fx.CubicBezier', 'Ext.fx.PropHandler'],

    /* End Definitions */

    isAnimation: true,
    /**
     * @cfg {Number} duration
     * Time in milliseconds for the animation to last. Defaults to 250.
     */
    duration: 250,

    /**
     * @cfg {Number} delay
     * Time to delay before starting the animation. Defaults to 0.
     */
    delay: 0,

    /* private used to track a delayed starting time */
    delayStart: 0,

    /**
     * @cfg {Boolean} dynamic
     * Currently only for Component Animation: Only set a component's outer element size bypassing layouts.  Set to true to do full layouts for every frame of the animation.  Defaults to false.
     */
    dynamic: false,

    /**
     * @cfg {String} easing
This describes how the intermediate values used during a transition will be calculated. It allows for a transition to change
speed over its duration. 

         -backIn
         -backOut
         -bounceIn
         -bounceOut
         -ease
         -easeIn
         -easeOut
         -easeInOut
         -elasticIn
         -elasticOut
         -cubic-bezier(x1, y1, x2, y2)

Note that cubic-bezier will create a custom easing curve following the CSS3 transition-timing-function specification `{@link http://www.w3.org/TR/css3-transitions/#transition-timing-function_tag}`. The four values specify points P1 and P2 of the curve
as (x1, y1, x2, y2). All values must be in the range [0, 1] or the definition is invalid.
     * @markdown
     */
    easing: 'ease',

     /**
      * @cfg {Object} keyframes
      * Animation keyframes follow the CSS3 Animation configuration pattern. 'from' is always considered '0%' and 'to'
      * is considered '100%'.<b>Every keyframe declaration must have a keyframe rule for 0% and 100%, possibly defined using
      * "from" or "to"</b>.  A keyframe declaration without these keyframe selectors is invalid and will not be available for
      * animation.  The keyframe declaration for a keyframe rule consists of properties and values. Properties that are unable to
      * be animated are ignored in these rules, with the exception of 'easing' which can be changed at each keyframe. For example:
 <pre><code>
keyframes : {
    '0%': {
        left: 100
    },
    '40%': {
        left: 150
    },
    '60%': {
        left: 75
    },
    '100%': {
        left: 100
    }
}
 </code></pre>
      */

    /**
     * @private
     */
    damper: 1,

    /**
     * @private
     */
    bezierRE: /^(?:cubic-)?bezier\(([^,]+),([^,]+),([^,]+),([^\)]+)\)/,

    /**
     * Run the animation from the end to the beginning
     * Defaults to false.
     * @cfg {Boolean} reverse
     */
    reverse: false,

    /**
     * Flag to determine if the animation has started
     * @property running
     * @type boolean
     */
    running: false,

    /**
     * Flag to determine if the animation is paused. Only set this to true if you need to
     * keep the Anim instance around to be unpaused later; otherwise call {@link #end}.
     * @property paused
     * @type boolean
     */
    paused: false,

    /**
     * Number of times to execute the animation. Defaults to 1.
     * @cfg {int} iterations
     */
    iterations: 1,

    /**
     * Used in conjunction with iterations to reverse the animation each time an iteration completes.
     * @cfg {Boolean} alternate
     * Defaults to false.
     */
    alternate: false,

    /**
     * Current iteration the animation is running.
     * @property currentIteration
     * @type int
     */
    currentIteration: 0,

    /**
     * Starting time of the animation.
     * @property startTime
     * @type Date
     */
    startTime: 0,

    /**
     * Contains a cache of the interpolators to be used.
     * @private
     * @property propHandlers
     * @type Object
     */

    /**
     * @cfg {string/object} target
     * The Ext.fx.target to apply the animation to.  This should only be specified when creating an Ext.fx.Anim directly.
     */

    /**
     * @cfg {Object} from
     * An object containing property/value pairs for the beginning of the animation.  If not specified, the current state of the
     * Ext.fx.target will be used. For example:
<pre><code>
from : {
    opactiy: 0,       // Transparent
    color: '#ffffff', // White
    left: 0
}
</code></pre>
     */

    /**
     * @cfg {Object} to
     * An object containing property/value pairs for the end of the animation. For example:
 <pre><code>
 to : {
     opactiy: 1,       // Opaque
     color: '#00ff00', // Green
     left: 500
 }
 </code></pre>
     */

    // @private
    constructor: function(config) {
        var me = this;
        config = config || {};
        // If keyframes are passed, they really want an Animator instead.
        if (config.keyframes) {
            return new Ext.fx.Animator(config);
        }
        config = Ext.apply(me, config);
        if (me.from == undefined) {
            me.from = {};
        }
        me.propHandlers = {};
        me.config = config;
        me.target = Ext.fx.Manager.createTarget(me.target);
        me.easingFn = Ext.fx.Easing[me.easing];
        me.target.dynamic = me.dynamic;

        // If not a pre-defined curve, try a cubic-bezier
        if (!me.easingFn) {
            me.easingFn = String(me.easing).match(me.bezierRE);
            if (me.easingFn && me.easingFn.length == 5) {
                var curve = me.easingFn;
                me.easingFn = Ext.fx.cubicBezier(+curve[1], +curve[2], +curve[3], +curve[4]);
            }
        }
        me.id = Ext.id(null, 'ext-anim-');
        Ext.fx.Manager.addAnim(me);
        me.addEvents(
            /**
             * @event beforeanimate
             * Fires before the animation starts. A handler can return false to cancel the animation.
             * @param {Ext.fx.Anim} this
             */
            'beforeanimate',
             /**
              * @event afteranimate
              * Fires when the animation is complete.
              * @param {Ext.fx.Anim} this
              * @param {Date} startTime
              */
            'afteranimate'
        );
        me.mixins.observable.constructor.call(me, config);
        if (config.callback) {
            me.on('afteranimate', config.callback, config.scope);
        }
        return me;
    },

    /**
     * @private
     * Helper to the target
     */
    setAttr: function(attr, value) {
        return Ext.fx.Manager.items.get(this.id).setAttr(this.target, attr, value);
    },

    /*
     * @private
     * Set up the initial currentAttrs hash.
     */
    initAttrs: function() {
        var me = this,
            from = me.from,
            to = me.to,
            initialFrom = me.initialFrom || {},
            out = {},
            start, end, propHandler, attr;

        for (attr in to) {
            if (to.hasOwnProperty(attr)) {
                start = me.target.getAttr(attr, from[attr]);
                end = to[attr];
                // Use default (numeric) property handler
                if (!Ext.fx.PropHandler[attr]) {
                    if (Ext.isObject(end)) {
                        propHandler = me.propHandlers[attr] = Ext.fx.PropHandler.object;
                    } else {
                        propHandler = me.propHandlers[attr] = Ext.fx.PropHandler.defaultHandler;
                    }
                }
                // Use custom handler
                else {
                    propHandler = me.propHandlers[attr] = Ext.fx.PropHandler[attr];
                }
                out[attr] = propHandler.get(start, end, me.damper, initialFrom[attr]);
            }
        }
        me.currentAttrs = out;
    },

    /*
     * @private
     * Fires beforeanimate and sets the running flag.
     */
    start: function(startTime) {
        var me = this,
            delay = me.delay,
            delayStart = me.delayStart,
            delayDelta;
        if (delay) {
            if (!delayStart) {
                me.delayStart = startTime;
                return;
            }
            else {
                delayDelta = startTime - delayStart;
                if (delayDelta < delay) {
                    return;
                }
                else {
                    // Compensate for frame delay;
                    startTime = new Date(delayStart.getTime() + delay);
                }
            }
        }
        if (me.fireEvent('beforeanimate', me) !== false) {
            me.startTime = startTime;
            if (!me.paused && !me.currentAttrs) {
                me.initAttrs();
            }
            me.running = true;
        }
    },

    /*
     * @private
     * Calculate attribute value at the passed timestamp.
     * @returns a hash of the new attributes.
     */
    runAnim: function(elapsedTime) {
        var me = this,
            attrs = me.currentAttrs,
            duration = me.duration,
            easingFn = me.easingFn,
            propHandlers = me.propHandlers,
            ret = {},
            easing, values, attr, lastFrame;

        if (elapsedTime >= duration) {
            elapsedTime = duration;
            lastFrame = true;
        }
        if (me.reverse) {
            elapsedTime = duration - elapsedTime;
        }

        for (attr in attrs) {
            if (attrs.hasOwnProperty(attr)) {
                values = attrs[attr];
                easing = lastFrame ? 1 : easingFn(elapsedTime / duration);
                ret[attr] = propHandlers[attr].set(values, easing);
            }
        }
        return ret;
    },

    /*
     * @private
     * Perform lastFrame cleanup and handle iterations
     * @returns a hash of the new attributes.
     */
    lastFrame: function() {
        var me = this,
            iter = me.iterations,
            iterCount = me.currentIteration;

        iterCount++;
        if (iterCount < iter) {
            if (me.alternate) {
                me.reverse = !me.reverse;
            }
            me.startTime = new Date();
            me.currentIteration = iterCount;
            // Turn off paused for CSS3 Transitions
            me.paused = false;
        }
        else {
            me.currentIteration = 0;
            me.end();
        }
    },

    /*
     * Fire afteranimate event and end the animation. Usually called automatically when the
     * animation reaches its final frame, but can also be called manually to pre-emptively
     * stop and destroy the running animation.
     */
    end: function() {
        var me = this;
        me.startTime = 0;
        me.paused = false;
        me.running = false;
        Ext.fx.Manager.removeAnim(me);
        me.fireEvent('afteranimate', me, me.startTime);
    }
});
// Set flag to indicate that Fx is available. Class might not be available immediately.
Ext.enableFx = true;
