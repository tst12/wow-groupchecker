Ext.applyIf(Ext.core.Element.prototype, {
    // @private override base Ext.util.Animate mixin for animate for backwards compatibility
    animate: function(args, duration, onComplete, easing) {
        if (arguments.length > 1) {
            if (Ext.isDefined(Ext.global.console)) {
                console.warn("animate should only be called with a single configuration object.");
            }
        }
        var me = this;
        if (!me.id) {
            me = Ext.get(me.dom);
        }
        if (Ext.fx.Manager.hasFxBlock(me.id)) {
            return me;
        }
        args = args || {};
        if (duration) {
            args.duration = duration;
        }
        if (onComplete) {
            args.callback = onComplete;
        }
        if (easing) {
            args.easing = easing;
        }
        Ext.fx.Manager.queueFx(Ext.create('Ext.fx.Anim', me.anim(args)));
        return this;
    },

    // @private override base Ext.util.Animate mixin for animate for backwards compatibility
    anim: function(config) {
        if (arguments.length > 1) {
            if (Ext.isDefined(Ext.global.console)) {
                console.warn("anim now only accepts one configuration object.");
            }
        }

        if (!Ext.isObject(config)) {
            return (config) ? {} : false;
        }

        var me = this,
            duration = config.duration || 250,
            easing = config.easing || 'ease',
            animConfig;

        if (config.stopFx) {
            me.stopFx();
        }

        Ext.applyIf(config, Ext.fx.Manager.getFxDefaults(me.id));

        // Clear any 'paused' defaults.
        Ext.fx.Manager.setFxDefaults(me.id, {
            delay: 0
        });

        // Convert durations in seconds to milliseconds
        if (config.delay && config.delay < 10) {
            if (Ext.isDefined(Ext.global.console)) {
                console.warn("Detected an extremely small animation delay, assuming the deprecated unit 'seconds were used.  Please change to milliseconds.");
            }
            config.delay *= 1000;
        }

        // Convert durations in seconds to milliseconds
        if (duration < 10) {
            if (Ext.isDefined(Ext.global.console)) {
                console.warn("Detected an extremely small animation duration, assuming the deprecated unit seconds were used.  Please change to milliseconds.");
            }
            duration *= 1000;
        }

        // Convert endOpacity to opacity
        if (config.endOpacity) {
            if (Ext.isDefined(Ext.global.console)) {
                console.warn("Detected the deprecated endOpacity property.  Please use opacity.");
            }
            config.opacity = config.endOpacity;
            delete config.endOpacity;
        }

        animConfig = {
            target: me,
            remove: config.remove,
            alternate: config.alternate || false,
            duration: duration,
            easing: easing,
            callback: config.callback,
            listeners: config.listeners,
            iterations: config.iterations || 1,
            scope: config.scope,
            block: config.block,
            concurrent: config.concurrent,
            delay: config.delay || 0,
            paused: true,
            keyframes: config.keyframes,
            from: config.from || {},
            to: Ext.apply({}, config)
        };
        Ext.apply(animConfig.to, config.to);

        // Anim API properties - backward compat
        delete animConfig.to.to;
        delete animConfig.to.from;
        delete animConfig.to.remove;
        delete animConfig.to.alternate;
        delete animConfig.to.keyframes;
        delete animConfig.to.iterations;
        delete animConfig.to.listeners;
        delete animConfig.to.target;
        delete animConfig.to.paused;
        delete animConfig.to.callback;
        delete animConfig.to.scope;
        delete animConfig.to.duration;
        delete animConfig.to.easing;
        delete animConfig.to.concurrent;
        delete animConfig.to.block;
        delete animConfig.to.stopFx;
        delete animConfig.to.delay;
        return animConfig;
    },

    /**
     * Slides the element into view.  An anchor point can be optionally passed to set the point of
     * origin for the slide effect.  This function automatically handles wrapping the element with
     * a fixed-size container if needed.  See the Fx class overview for valid anchor point options.
     * Usage:
     *<pre><code>
// default: slide the element in from the top
el.slideIn();

// custom: slide the element in from the right with a 2-second duration
el.slideIn('r', { duration: 2 });

// common config options shown with default values
el.slideIn('t', {
    easing: 'easeOut',
    duration: .5
});
</code></pre>
     * @param {String} anchor (optional) One of the valid Fx anchor positions (defaults to top: 't')
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Ext.core.Element} The Element
     */
    slideIn: function(anchor, obj, slideOut) { 
        var me = this,
            elStyle = me.dom.style,
            beforeAnim, wrapAnim;

        anchor = anchor || "t";
        obj = obj || {};

        beforeAnim = function() {
            var animScope = this,
                listeners = obj.listeners,
                box, position, restoreSize, wrap, anim;

            if (!slideOut) {
                me.fixDisplay();
            }

            box = me.getBox();
            position = me.getPositioning();
            me.setSize(box.width, box.height);

            wrap = me.wrap({
                style: {
                    visibility: slideOut ? 'visible' : 'hidden'
                }
            });
            wrap.setPositioning(position);
            if (wrap.isStyle('position', 'static')) {
                wrap.position('relative');
            }
            me.clearPositioning('auto');
            wrap.clip();

            me.setStyle({
                visibility: 'visible',
                position: 'absolute'
            });
            if (slideOut) {
                wrap.setSize(box.width, box.height);
            }

            switch (anchor) {
                case 't':
                    anim = {
                        from: {
                            width: box.width + 'px',
                            height: '0px'
                        },
                        to: {
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    elStyle.bottom = '0px';
                    break;
                case 'l':
                    anim = {
                        from: {
                            width: '0px',
                            height: box.height + 'px'
                        },
                        to: {
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    elStyle.right = '0px';
                    break;
                case 'r':
                    anim = {
                        from: {
                            x: box.x + box.width,
                            width: '0px',
                            height: box.height + 'px'
                        },
                        to: {
                            x: box.x,
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    break;
                case 'b':
                    anim = {
                        from: {
                            y: box.y + box.height,
                            width: box.width + 'px',
                            height: '0px'
                        },
                        to: {
                            y: box.y,
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    break;
                case 'tl':
                    anim = {
                        from: {
                            x: box.x,
                            y: box.y,
                            width: '0px',
                            height: '0px'
                        },
                        to: {
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    elStyle.bottom = '0px';
                    elStyle.right = '0px';
                    break;
                case 'bl':
                    anim = {
                        from: {
                            x: box.x + box.width,
                            width: '0px',
                            height: '0px'
                        },
                        to: {
                            x: box.x,
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    elStyle.right = '0px';
                    break;
                case 'br':
                    anim = {
                        from: {
                            x: box.x + box.width,
                            y: box.y + box.height,
                            width: '0px',
                            height: '0px'
                        },
                        to: {
                            x: box.x,
                            y: box.y,
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    break;
                case 'tr':
                    anim = {
                        from: {
                            y: box.y + box.height,
                            width: '0px',
                            height: '0px'
                        },
                        to: {
                            y: box.y,
                            width: box.width + 'px',
                            height: box.height + 'px'
                        }
                    };
                    elStyle.bottom = '0px';
                    break;
            };

            wrap.show();
            wrapAnim = Ext.apply({}, obj);
            delete wrapAnim.listeners;
            wrapAnim = Ext.create('Ext.fx.Anim', Ext.applyIf(wrapAnim, {
                target: wrap,
                duration: 500,
                easing: 'ease-out',
                from: slideOut ? anim.to : anim.from,
                to: slideOut ? anim.from : anim.to
            }));

            // In the absence of a callback, this listener MUST be added first
            wrapAnim.on('afteranimate', function() {
                if (slideOut) {
                    me.setPositioning(position);
                    obj.useDisplay ? me.setDisplayed(false) : me.hide();
                }
                else {
                    me.clearPositioning();
                    me.setPositioning(position);
                }
                if (wrap.dom) {
                    wrap.dom.parentNode.insertBefore(me.dom, wrap.dom); 
                    wrap.remove();
                }
                me.setSize(box.width, box.height);
                animScope.end();
            });
            // Add configured listeners after
            if (listeners) {
                wrapAnim.on(listeners);
            }
        };

        me.animate({
            duration: (obj.duration * 2) || 1000,
            listeners: {
                beforeanimate: {
                    fn: beforeAnim
                },
                afteranimate: {
                    fn: function() {
                        if (wrapAnim.running) {
                            wrapAnim.end();
                        }
                    }
                }
            }
        });
        return me;
    },

    
    /**
     * Slides the element out of view.  An anchor point can be optionally passed to set the end point
     * for the slide effect.  When the effect is completed, the element will be hidden (visibility = 
     * 'hidden') but block elements will still take up space in the document.  The element must be removed
     * from the DOM using the 'remove' config option if desired.  This function automatically handles 
     * wrapping the element with a fixed-size container if needed.  See the Fx class overview for valid anchor point options.
     * Usage:
     *<pre><code>
// default: slide the element out to the top
el.slideOut();

// custom: slide the element out to the right with a 2-second duration
el.slideOut('r', { duration: 2 });

// common config options shown with default values
el.slideOut('t', {
    easing: 'easeOut',
    duration: .5,
    remove: false,
    useDisplay: false
});
</code></pre>
     * @param {String} anchor (optional) One of the valid Fx anchor positions (defaults to top: 't')
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Ext.core.Element} The Element
     */
    slideOut: function(anchor, o) {
        return this.slideIn(anchor, o, true);
    },

    /**
     * Fades the element out while slowly expanding it in all directions.  When the effect is completed, the 
     * element will be hidden (visibility = 'hidden') but block elements will still take up space in the document.
     * Usage:
     *<pre><code>
// default
el.puff();

// common config options shown with default values
el.puff({
    easing: 'easeOut',
    duration: .5,
    useDisplay: false
});
</code></pre>
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Ext.core.Element} The Element
     */

    puff: function(obj) {
        var me = this,
            beforeAnim;
        obj = Ext.applyIf(obj || {}, {
            easing: 'ease-out',
            duration: 500,
            useDisplay: false
        });

        beforeAnim = function() {
            me.clearOpacity();
            me.show();

            var box = me.getBox(),
                fontSize = me.getStyle('fontSize'),
                position = me.getPositioning();
            this.to = {
                width: box.width * 2,
                height: box.height * 2,
                x: box.x - (box.width / 2),
                y: box.y - (box.height /2),
                opacity: 0,
                fontSize: '200%'
            };
            this.on('afteranimate',function() {
                if (me.dom) {
                    obj.useDisplay ? me.setDisplayed(false) : me.hide();
                    me.clearOpacity();  
                    me.setPositioning(position);
                    me.setStyle({fontSize: fontSize});
                }
            });
        };

        me.animate({
            duration: obj.duration,
            easing: obj.easing,
            listeners: {
                beforeanimate: {
                    fn: beforeAnim
                }
            }
        });
        return me;
    },

    /**
     * Blinks the element as if it was clicked and then collapses on its center (similar to switching off a television).
     * When the effect is completed, the element will be hidden (visibility = 'hidden') but block elements will still 
     * take up space in the document. The element must be removed from the DOM using the 'remove' config option if desired.
     * Usage:
     *<pre><code>
// default
el.switchOff();

// all config options shown with default values
el.switchOff({
    easing: 'easeIn',
    duration: .3,
    remove: false,
    useDisplay: false
});
</code></pre>
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Ext.core.Element} The Element
     */
    switchOff: function(obj) {
        var me = this,
            beforeAnim;
        
        obj = Ext.applyIf(obj || {}, {
            easing: 'ease-in',
            duration: 500,
            remove: false,
            useDisplay: false
        });

        beforeAnim = function() {
            var animScope = this,
                size = me.getSize(),
                xy = me.getXY(),
                keyframe, position;
            me.clearOpacity();
            me.clip();
            position = me.getPositioning();

            keyframe = Ext.create('Ext.fx.Animator', {
                target: me,
                duration: obj.duration,
                easing: obj.easing,
                keyframes: {
                    33: {
                        opacity: 0.3
                    },
                    66: {
                        height: 1,
                        y: xy[1] + size.height / 2
                    },
                    100: {
                        width: 1,
                        x: xy[0] + size.width / 2
                    }
                }
            });
            keyframe.on('afteranimate', function() {
                obj.useDisplay ? me.setDisplayed(false) : me.hide();  
                me.clearOpacity();
                me.setPositioning(position);
                me.setSize(size);
                animScope.end();
            });
        };
        me.animate({
            duration: (obj.duration * 2),
            listeners: {
                beforeanimate: {
                    fn: beforeAnim
                }
            }
        });
        return me;
    },

   /**
    * Shows a ripple of exploding, attenuating borders to draw attention to an Element.
    * Usage:
<pre><code>
// default: a single light blue ripple
el.frame();

// custom: 3 red ripples lasting 3 seconds total
el.frame("#ff0000", 3, { duration: 3 });

// common config options shown with default values
el.frame("#C3DAF9", 1, {
    duration: 1 //duration of each individual ripple.
    // Note: Easing is not configurable and will be ignored if included
});
</code></pre>
    * @param {String} color (optional) The color of the border.  Should be a 6 char hex color without the leading # (defaults to light blue: 'C3DAF9').
    * @param {Number} count (optional) The number of ripples to display (defaults to 1)
    * @param {Object} options (optional) Object literal with any of the Fx config options
    * @return {Ext.core.Element} The Element
    */
    frame : function(color, count, obj){
        var me = this,
            beforeAnim;

        color = color || '#C3DAF9';
        count = count || 1;
        obj = obj || {};

        beforeAnim = function() {
            me.show();
            var animScope = this,
                box = me.getBox(),
                proxy = Ext.getBody().createChild({
                    style: {
                        position : 'absolute',
                        'pointer-events': 'none',
                        'z-index': 35000,
                        border : '0px solid ' + color
                    }
                }),
                proxyAnim;
            proxyAnim = Ext.create('Ext.fx.Anim', {
                target: proxy,
                duration: obj.duration || 1000,
                iterations: count,
                from: {
                    top: box.y,
                    left: box.x,
                    borderWidth: 0,
                    opacity: 1,
                    height: box.height,
                    width: box.width
                },
                to: {
                    top: box.y - 20,
                    left: box.x - 20,
                    borderWidth: 10,
                    opacity: 0,
                    height: box.height + 40,
                    width: box.width + 40
                }
            });
            proxyAnim.on('afteranimate', function() {
                proxy.remove();
                animScope.end();
            });
        };

        me.animate({
            duration: (obj.duration * 2) || 2000,
            listeners: {
                beforeanimate: {
                    fn: beforeAnim
                }
            }
        });
        return me;
    },

    /**
     * Slides the element while fading it out of view.  An anchor point can be optionally passed to set the 
     * ending point of the effect.
     * Usage:
     *<pre><code>
// default: slide the element downward while fading out
el.ghost();

// custom: slide the element out to the right with a 2-second duration
el.ghost('r', { duration: 2 });

// common config options shown with default values
el.ghost('b', {
    easing: 'easeOut',
    duration: .5
});
</code></pre>
     * @param {String} anchor (optional) One of the valid Fx anchor positions (defaults to bottom: 'b')
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Ext.core.Element} The Element
     */
    ghost: function(anchor, obj) {
        var me = this,
            beforeAnim;

        anchor = anchor || "b";
        beforeAnim = function() {
            var width = me.getWidth(),
                height = me.getHeight(),
                xy = me.getXY(),
                position = me.getPositioning(),
                to = {
                    opacity: 0
                };
            switch (anchor) {
                case 't':
                    to.y = xy[1] - height;
                    break;
                case 'l':
                    to.x = xy[0] - width;
                    break;
                case 'r':
                    to.x = xy[0] + width;
                    break;
                case 'b':
                    to.y = xy[1] + height;
                    break;
                case 'tl':
                    to.x = xy[0] - width;
                    to.y = xy[1] - height;
                    break;
                case 'bl':
                    to.x = xy[0] - width;
                    to.y = xy[1] + height;
                    break;
                case 'br':
                    to.x = xy[0] + width;
                    to.y = xy[1] + height;
                    break;
                case 'tr':
                    to.x = xy[0] + width;
                    to.y = xy[1] - height;
                    break;
            };
            this.to = to;
            this.on('afteranimate', function () {
                if (me.dom) {
                    me.hide();
                    me.clearOpacity();
                    me.setPositioning(position);
                }
            });
        };

        me.animate(Ext.applyIf(obj || {}, {
            duration: 500,
            easing: 'ease-out',
            listeners: {
                beforeanimate: {
                    fn: beforeAnim
                }
            }
        }));
        return me;
    },

    /**
     * Highlights the Element by setting a color (applies to the background-color by default, but can be
     * changed using the "attr" config option) and then fading back to the original color. If no original
     * color is available, you should provide the "endColor" config option which will be cleared after the animation.
     * Usage:
<pre><code>
// default: highlight background to yellow
el.highlight();

// custom: highlight foreground text to blue for 2 seconds
el.highlight("0000ff", { attr: 'color', duration: 2 });

// common config options shown with default values
el.highlight("ffff9c", {
    attr: "background-color", //can be any valid CSS property (attribute) that supports a color value
    endColor: (current color) or "ffffff",
    easing: 'easeIn',
    duration: 1
});
</code></pre>
     * @param {String} color (optional) The highlight color. Should be a 6 char hex color without the leading # (defaults to yellow: 'ffff9c')
     * @param {Object} options (optional) Object literal with any of the Fx config options
     * @return {Ext.core.Element} The Element
     */ 
    highlight: function(color, o) {
        var me = this,
            dom = me.dom,
            from = {},
            restore, to, attr;

        o = o || {};
        attr = o.attr || "backgroundColor";
        if (!o.to) {
            to = {};
            to[attr] = o.endColor || "#ffff9c";
        }
        else {
            to = o.to;
        }

        me.animate(Ext.apply({}, o, {
            duration: 1000,
            easing: 'ease-in',
            to: to,
            listeners: {
                beforeanimate: {
                    fn: function() {
                        restore = dom.style[attr];
                        me.clearOpacity();
                        me.show();
                    }
                },
                afteranimate: {
                    fn: function() {
                        if (dom) {
                            dom.style[attr] = restore;
                        }
                    }
                }
            }
        }));
        return me;
    },

   /**
    * Creates a pause before any subsequent queued effects begin.  If there are
    * no effects queued after the pause it will have no effect.
    * Usage:
<pre><code>
el.pause(1);
</code></pre>
    * @param {Number} ms The length of time to pause (in milliseconds)
    * @return {Ext.core.Element} The Element
    */

    pause: function(ms) {
        var me = this;
        if (Ext.isDefined(Ext.global.console)) {
            console.warn("Operation: Element.pause has been deprecated. Please use animate with a delay parameter.");
        }
        Ext.fx.Manager.setFxDefaults(me.id, {
            delay: ms
        });
        return me;
    },

   /**
    * Fade an element in (from transparent to opaque).  The ending opacity can be specified
    * using the <tt>{@link #endOpacity}</tt> config option.
    * Usage:
<pre><code>
// default: fade in from opacity 0 to 100%
el.fadeIn();

// custom: fade in from opacity 0 to 75% over 2 seconds
el.fadeIn({ endOpacity: .75, duration: 2});

// common config options shown with default values
el.fadeIn({
    endOpacity: 1, //can be any value between 0 and 1 (e.g. .5)
    easing: 'easeOut',
    duration: .5
});
</code></pre>
    * @param {Object} options (optional) Object literal with any of the Fx config options
    * @return {Ext.core.Element} The Element
    */

    fadeIn: function(o) {        
        if (Ext.isDefined(Ext.global.console)) {
            console.warn("Operation: Element.fadeIn has been deprecated. Please use animate with an opacity parameter.");
        }
        this.animate(Ext.apply({}, o, {
            opacity: 1
        }));
        return this;
    },

   /**
    * Fade an element out (from opaque to transparent).  The ending opacity can be specified
    * using the <tt>{@link #endOpacity}</tt> config option.  Note that IE may require
    * <tt>{@link #useDisplay}:true</tt> in order to redisplay correctly.
    * Usage:
<pre><code>
// default: fade out from the element's current opacity to 0
el.fadeOut();

// custom: fade out from the element's current opacity to 25% over 2 seconds
el.fadeOut({ endOpacity: .25, duration: 2});

// common config options shown with default values
el.fadeOut({
    endOpacity: 0, //can be any value between 0 and 1 (e.g. .5)
    easing: 'easeOut',
    duration: .5,
    remove: false,
    useDisplay: false
});
</code></pre>
    * @param {Object} options (optional) Object literal with any of the Fx config options
    * @return {Ext.core.Element} The Element
    */
    fadeOut: function(o) {        
        if (Ext.isDefined(Ext.global.console)) {
            console.warn("Operation: Element.fadeOut has been deprecated. Please use animate with an opacity parameter.");
        }
        this.animate(Ext.apply({}, o, {
            opacity: 0
        }));
        return this;
    },

   /**
    * Animates the transition of an element's dimensions from a starting height/width
    * to an ending height/width.  This method is a convenience implementation of {@link shift}.
    * Usage:
<pre><code>
// change height and width to 100x100 pixels
el.scale(100, 100);

// common config options shown with default values.  The height and width will default to
// the element&#39;s existing values if passed as null.
el.scale(
    [element&#39;s width],
    [element&#39;s height], {
        easing: 'easeOut',
        duration: .35
    }
);
</code></pre>
    * @param {Number} width  The new width (pass undefined to keep the original width)
    * @param {Number} height  The new height (pass undefined to keep the original height)
    * @param {Object} options (optional) Object literal with any of the Fx config options
    * @return {Ext.core.Element} The Element
    */
    scale: function(w, h, o) {
        if (Ext.isDefined(Ext.global.console)) {
            console.warn("Operation: Element.scale has been deprecated. Please use animate.");
        }
        this.animate(Ext.apply({}, o, {
            width: w,
            height: h
        }));
        return this;
    },

   /**
    * Animates the transition of any css property.
    * Usage:
<pre><code>
// slide the element horizontally to x position 200 while changing the height and opacity
el.shift({ x: 200, height: 50, opacity: .8 });

// common config options:
el.shift({
    width: [element&#39;s width],
    height: [element&#39;s height],
    x: [element&#39;s x position],
    y: [element&#39;s y position],
    easing: 'ease',
    duration: 250
});
</code></pre>
    * @param {Object} options  Object literal with any of the Fx config options
    * @return {Ext.core.Element} The Element
    */
    shift: function(config) {
        if (Ext.isDefined(Ext.global.console)) {
            console.warn("Operation: Element.shift has been deprecated. Please use animate.");
        }
        this.animate(config);
        return this;
    }
});