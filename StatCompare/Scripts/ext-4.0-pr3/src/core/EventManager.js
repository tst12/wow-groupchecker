/**
 * @class Ext.EventManager
 * Registers event handlers that want to receive a normalized EventObject instead of the standard browser event and provides
 * several useful events directly.
 * See {@link Ext.EventObject} for more details on normalized event objects.
 * @singleton
 */
Ext.EventManager = {

    // --------------------- onReady ---------------------

    /**
     * Check if we have bound our global onReady listener
     * @private
     */
    hasBoundOnReady: false,

    /**
     * Check if fireDocReady has been called
     * @private
     */
    hasFiredReady: false,

    /**
     * Timer for the document ready event in old IE versions
     * @private
     */
    readyTimeout: null,

    /**
     * Checks if we have bound an onreadystatechange event
     * @private
     */
    hasOnReadyStateChange: false,

    /**
     * Holds references to any onReady functions
     * @private
     */
    readyEvent: new Ext.util.Event(),

    /**
     * Check the ready state for old IE versions
     * @private
     * @return {Boolean} True if the document is ready
     */
    checkReadyState: function(){
        var me = Ext.EventManager;

        if(window.attachEvent){
            // See here for reference: http://javascript.nwbox.com/IEContentLoaded/
            if (window != top) {
                return false;
            }
            try{
                document.documentElement.doScroll('left');
            }catch(e){
                return false;
            }
            me.fireDocReady();
            return true;
        }
        if (document.readyState == 'complete') {
            me.fireDocReady();
            return true;
        }
        me.readyTimeout = setTimeout(arguments.callee, 2);
        return false;
    },

    /**
     * Binds the appropriate browser event for checking if the DOM has loaded.
     * @private
     */
    bindReadyEvent: function(){
        var me = Ext.EventManager;
        if (me.hasBoundOnReady) {
            return;
        }

        if (document.addEventListener) {
            document.addEventListener('DOMContentLoaded', me.fireDocReady, false);
            // fallback, load will ~always~ fire
            window.addEventListener('load', me.fireDocReady, false);
        } else {
            // Important: commented out since this hack causes issues with our new framing
            // There's no need to apply hacks anyway, the native window onload event on IEs works
            // just fine for us since we don't care about initial DOM

            // check if the document is ready, this will also kick off the scroll checking timer
            //if (!me.checkReadyState()) {
            //    document.attachEvent('onreadystatechange', me.checkReadyState);
            //    me.hasOnReadyStateChange = true;
            //}
            // fallback, onload will ~always~ fire
            window.attachEvent('onload', me.fireDocReady, false);
        }
        me.hasBoundOnReady = true;
    },

    /**
     * We know the document is loaded, so trigger any onReady events.
     * @private
     */
    fireDocReady: function(){
        var me = Ext.EventManager;

        // only unbind these events once
        if (!me.hasFiredReady) {
            me.hasFiredReady = true;

            if (document.addEventListener) {
                document.removeEventListener('DOMContentLoaded', me.fireDocReady, false);
                window.removeEventListener('load', me.fireDocReady, false);
            } else {
                if (me.readyTimeout != null) {
                    clearTimeout(me.readyTimeout);
                }
                if (me.hasOnReadyStateChange) {
                    document.detachEvent('onreadystatechange', me.checkReadyState);
                }
                window.detachEvent('onload', me.fireDocReady);
            }
            Ext.supports.init();
        }
        if (!Ext.isReady) {
            Ext.isReady = true;

            me.readyEvent.fire();
        }
    },

    /**
     * Adds a listener to be notified when the document is ready (before onload and before images are loaded). Can be
     * accessed shorthanded as Ext.onReady().
     * @param {Function} fn The method the event invokes.
     * @param {Object} scope (optional) The scope (<code>this</code> reference) in which the handler function executes. Defaults to the browser window.
     * @param {boolean} options (optional) Options object as passed to {@link Ext.core.Element#addListener}.
     */
    onDocumentReady: function(fn, scope, options){
        options = options || {};
        var me = Ext.EventManager,
            readyEvent = me.readyEvent;

        // force single to be true so our event is only ever fired once.
        options.single = true;

        // Document already loaded, let's just fire it
        if (Ext.isReady) {
            readyEvent.addListener(fn, scope, options);
            readyEvent.fire();
        } else {
            options.delay = options.delay || 1;
            readyEvent.addListener(fn, scope, options);
            me.bindReadyEvent();
        }
    },


    // --------------------- event binding ---------------------

    /**
     * Contains a list of all document mouse downs, so we can ensure they fire even when stopEvent is called.
     * @private
     */
    stoppedMouseDownEvent: new Ext.util.Event(),

    /**
     * Options to parse for the 4th argument to addListener.
     * @private
     */
    propRe: /^(?:scope|delay|buffer|single|stopEvent|preventDefault|stopPropagation|normalized|args|delegate)$/,

    /**
     * Get the id of the element. If one has not been assigned, automatically assign it.
     * @param {Mixed} element The element to get the id for.
     * @return {String} id
     */
    getId : function(element) {
        var skip = false,
            id;

        element = Ext.getDom(element);

        if (element === document || element === window) {
            id = element === document ? Ext.documentId : Ext.windowId;
            skip = true;
        } else {
            id = Ext.id(element);
        }

        if (!Ext.cache[id]){
            Ext.core.Element.addToCache(new Ext.core.Element(element), id);
            if(skip){
                Ext.cache[id].skipGarbageCollection = true;
            }
        }
        return id;
    },

    /**
     * Convert a "config style" listener into a set of flat arguments so they can be passed to addListener
     * @private
     * @param {Object} element The element the event is for
     * @param {Object} event The event configuration
     * @param {Object} isRemove True if a removal should be performed, otherwise an add will be done.
     */
    prepareListenerConfig: function(element, config, isRemove){
        var me = this,
            propRe = me.propRe,
            key, value, args;

        // loop over all the keys in the object
        for (key in config) {
            if (!config.hasOwnProperty(key)) {
                continue;
            }
            // if the key is something else then an event option
            if (!propRe.test(key)) {
                value = config[key];
                // if the value is a function it must be something like click: function(){}, scope: this
                // which means that there might be multiple event listeners with shared options
                if (Ext.isFunction(value)) {
                    // shared options
                    args = [element, key, value, config.scope, config];
                } else {
                    // if its not a function, it must be an object like click: {fn: function(){}, scope: this}
                    args = [element, key, value.fn, value.scope, value];
                }

                if (isRemove === true) {
                    me.removeListener.apply(this, args);
                } else {
                    me.addListener.apply(me, args);
                }
            }
        }
    },

    /**
     * Normalize cross browser event differences
     * @private
     * @param {Object} eventName The event name
     * @param {Object} fn The function to execute
     * @return {Object} The new event name/function
     */
    normalizeEvent: function(eventName, fn){
        if (/mouseenter|mouseleave/.test(eventName) && !Ext.supports.MouseEnterLeave) {
            if (fn) {
                fn = Ext.Function.createInterceptor(fn, this.contains, this);
            }
            eventName = eventName == 'mouseenter' ? 'mouseover' : 'mouseout';
        } else if (eventName == 'mousewheel' && !Ext.supports.MouseWheel){
            eventName = 'DOMMouseScroll';
        }
        return {
            eventName: eventName,
            fn: fn
        };
    },

    /**
     * Checks whether the event's relatedTarget is contained inside (or <b>is</b>) the element.
     * @private
     * @param {Object} event
     */
    contains: function(event){
        var parent = event.browserEvent.currentTarget,
            child = this.getRelatedTarget(event);

        if (parent && parent.firstChild) {
            while (child) {
                if (child === parent) {
                    return true;
                }
                child = child.parentNode;
                if (child && (child.nodeType != 1)) {
                    child = null;
                }
            }
        }
        return true;
    },

    /**
    * Appends an event handler to an element.  The shorthand version {@link #on} is equivalent.  Typically you will
    * use {@link Ext.core.Element#addListener} directly on an Element in favor of calling this version.
    * @param {String/HTMLElement} el The html element or id to assign the event handler to.
    * @param {String} eventName The name of the event to listen for.
    * @param {Function} handler The handler function the event invokes. This function is passed
    * the following parameters:<ul>
    * <li>evt : EventObject<div class="sub-desc">The {@link Ext.EventObject EventObject} describing the event.</div></li>
    * <li>t : Element<div class="sub-desc">The {@link Ext.core.Element Element} which was the target of the event.
    * Note that this may be filtered by using the <tt>delegate</tt> option.</div></li>
    * <li>o : Object<div class="sub-desc">The options object from the addListener call.</div></li>
    * </ul>
    * @param {Object} scope (optional) The scope (<b><code>this</code></b> reference) in which the handler function is executed. <b>Defaults to the Element</b>.
    * @param {Object} options (optional) An object containing handler configuration properties.
    * This may contain any of the following properties:<ul>
    * <li>scope : Object<div class="sub-desc">The scope (<b><code>this</code></b> reference) in which the handler function is executed. <b>Defaults to the Element</b>.</div></li>
    * <li>delegate : String<div class="sub-desc">A simple selector to filter the target or look for a descendant of the target</div></li>
    * <li>stopEvent : Boolean<div class="sub-desc">True to stop the event. That is stop propagation, and prevent the default action.</div></li>
    * <li>preventDefault : Boolean<div class="sub-desc">True to prevent the default action</div></li>
    * <li>stopPropagation : Boolean<div class="sub-desc">True to prevent event propagation</div></li>
    * <li>normalized : Boolean<div class="sub-desc">False to pass a browser event to the handler function instead of an Ext.EventObject</div></li>
    * <li>delay : Number<div class="sub-desc">The number of milliseconds to delay the invocation of the handler after te event fires.</div></li>
    * <li>single : Boolean<div class="sub-desc">True to add a handler to handle just the next firing of the event, and then remove itself.</div></li>
    * <li>buffer : Number<div class="sub-desc">Causes the handler to be scheduled to run in an {@link Ext.util.DelayedTask} delayed
    * by the specified number of milliseconds. If the event fires again within that time, the original
    * handler is <em>not</em> invoked, but the new handler is scheduled in its place.</div></li>
    * <li>target : Element<div class="sub-desc">Only call the handler if the event was fired on the target Element, <i>not</i> if the event was bubbled up from a child node.</div></li>
    * </ul><br>
    * <p>See {@link Ext.core.Element#addListener} for examples of how to use these options.</p>
    */
    addListener: function(element, eventName, fn, scope, options){
        // Check if we've been passed a "config style" event.
        if (Ext.isObject(eventName)) {
            this.prepareListenerConfig(element, eventName);
            return;
        }

        var dom = Ext.getDom(element),
            bind,
            wrap;

        // if the element doesnt exist throw an error
        if (!dom){
            throw 'Error listening for "' + eventName + '\". Element "' + element + '" doesn\'t exist.';
        }

        if (!fn) {
            throw 'Error listening for "' + eventName + '". No handler function specified';
        }

        // create the wrapper function
        options = options || {};

        bind = this.normalizeEvent(eventName, fn);
        wrap = this.createListenerWrap(dom, eventName, bind.fn, scope, options);


        if (window.addEventListener) {
            dom.addEventListener(bind.eventName, wrap, options.capture || false);
        } else {
            dom.attachEvent('on' + bind.eventName, wrap);
        }

        if (dom == document && eventName == 'mousedown') {
            this.stoppedMouseDownEvent.addListener(wrap);
        }

        // add all required data into the event cache
        this.getEventListenerCache(dom, eventName).push({
            fn: fn,
            wrap: wrap,
            scope: scope
        });
    },

    /**
    * Removes an event handler from an element.  The shorthand version {@link #un} is equivalent.  Typically
    * you will use {@link Ext.core.Element#removeListener} directly on an Element in favor of calling this version.
    * @param {String/HTMLElement} el The id or html element from which to remove the listener.
    * @param {String} eventName The name of the event.
    * @param {Function} fn The handler function to remove. <b>This must be a reference to the function passed into the {@link #addListener} call.</b>
    * @param {Object} scope If a scope (<b><code>this</code></b> reference) was specified when the listener was added,
    * then this must refer to the same object.
    */
    removeListener : function(element, eventName, fn, scope) {
        // handle our listener config object syntax
        if (Ext.isObject(eventName)) {
            this.prepareListenerConfig(element, eventName, true);
            return;
        }

        var dom = Ext.getDom(element),
            cache = this.getEventListenerCache(dom, eventName),
            bindName = this.normalizeEvent(eventName).eventName,
            i = cache.length, j,
            listener, wrap, tasks;


        while (i--) {
            listener = cache[i];

            if (listener && (!fn || listener.fn == fn) && (!scope || listener.scope === scope)) {
                wrap = listener.wrap;

                // clear buffered calls
                if (wrap.task) {
                    clearTimeout(wrap.task);
                    delete wrap.task;
                }

                // clear delayed calls
                j = wrap.tasks && wrap.tasks.length;
                if (j) {
                    while (j--) {
                        clearTimeout(wrap.tasks[j]);
                    }
                    delete wrap.tasks;
                }

                if (window.removeEventListener) {
                    dom.removeEventListener(bindName, wrap, false);
                } else {
                    dom.detachEvent('on' + bindName, wrap);
                }

                if (wrap && dom == document && eventName == 'mousedown') {
                    this.stoppedMouseDownEvent.removeListener(wrap);
                }

                // remove listener from cache
                cache.splice(i, 1);
            }
        }
    },

    /**
    * Removes all event handers from an element.  Typically you will use {@link Ext.core.Element#removeAllListeners}
    * directly on an Element in favor of calling this version.
    * @param {String/HTMLElement} el The id or html element from which to remove all event handlers.
    */
    removeAll : function(element){
        var dom = Ext.getDom(element),
            cache = this.getElementEventCache(dom),
            ev;

        for (ev in cache) {
            if (!cache.hasOwnProperty(ev)) {
                continue;
            }
            this.removeListener(dom, ev);
        }
        Ext.cache[dom.id].events = {};
    },

    /**
     * Recursively removes all previous added listeners from an element and its children. Typically you will use {@link Ext.core.Element#purgeAllListeners}
     * directly on an Element in favor of calling this version.
     * @param {String/HTMLElement} el The id or html element from which to remove all event handlers.
     * @param {String} eventName (optional) The name of the event.
     */
    purgeElement : function(element, eventName) {
        var dom = Ext.getDom(element),
            i = 0, len;

        if(eventName) {
            this.removeListener(dom, eventName);
        }
        else {
            this.removeAll(dom);
        }

        if(dom && dom.childNodes) {
            for(len = element.childNodes.length; i < len; i++) {
                this.purgeElement(element.childNodes[i], eventName);
            }
        }
    },

    /**
     * Create the wrapper function for the event
     * @private
     * @param {HTMLElement} dom The dom element
     * @param {String} ename The event name
     * @param {Function} fn The function to execute
     * @param {Object} scope The scope to execute callback in
     * @param {Object} o The options
     */
    createListenerWrap : function(dom, ename, fn, scope, options) {
        options = !Ext.isObject(options) ? {} : options;

        var f = ['if(!Ext) {return;}'],
            gen;

        if(options.buffer || options.delay) {
            f.push('e = new Ext.EventObjectImpl(e);');
        } else {
            f.push('e = Ext.EventObject.setEvent(e);');
        }

        if (options.delegate) {
            f.push('var t = e.getTarget("' + options.delegate + '", this);');
            f.push('if(!t) {return;}');
        } else {
            f.push('var t = e.target;');
        }

        if (options.target) {
            f.push('if(e.target !== options.target) {return;}');
        }

        if(options.stopEvent) {
            f.push('e.stopEvent();');
        } else {
            if(options.preventDefault) {
                f.push('e.preventDefault();');
            }
            if(options.stopPropagation) {
                f.push('e.stopPropagation();');
            }
        }

        if(options.normalized === false) {
            f.push('e = e.browserEvent;');
        }

        if(options.buffer) {
            f.push('(wrap.task && clearTimeout(wrap.task));');
            f.push('wrap.task = setTimeout(function(){');
        }

        if(options.delay) {
            f.push('wrap.tasks = wrap.tasks || [];');
            f.push('wrap.tasks.push(setTimeout(function(){');
        }

        // finally call the actual handler fn
        f.push('fn.call(scope || dom, e, t, options);');

        if(options.single) {
            f.push('Ext.EventManager.removeListener(dom, ename, fn, scope);');
        }

        if(options.delay) {
            f.push('}, ' + options.delay + '));');
        }

        if(options.buffer) {
            f.push('}, ' + options.buffer + ');');
        }

        gen = Ext.functionFactory('e', 'options', 'fn', 'scope', 'ename', 'dom', 'wrap', 'args', f.join('\n'));

        return function(e, args) {
            gen.call(dom, e, options, fn, scope, ename, dom, arguments.callee, args);
        };
    },

    /**
     * Get the event cache for a particular element for a particular event
     * @private
     * @param {HTMLElement} element The element
     * @param {Object} eventName The event name
     * @return {Array} The events for the element
     */
    getEventListenerCache : function(element, eventName) {
        var eventCache = this.getElementEventCache(element);
        return eventCache[eventName] || (eventCache[eventName] = []);
    },

    /**
     * Gets the event cache for the object
     * @private
     * @param {HTMLElement} element The element
     * @return {Object} The event cache for the object
     */
    getElementEventCache : function(element) {
        var elementCache = Ext.cache[this.getId(element)];
        return elementCache.events || (elementCache.events = {});
    },

    // --------------------- utility methods ---------------------
    mouseLeaveRe: /(mouseout|mouseleave)/,
    mouseEnterRe: /(mouseover|mouseenter)/,

    /**
     * Stop the event (preventDefault and stopPropagation)
     * @param {Event} The event to stop
     */
    stopEvent: function(event) {
        this.stopPropagation(event);
        this.preventDefault(event);
    },

    /**
     * Cancels bubbling of the event.
     * @param {Event} The event to stop bubbling.
     */
    stopPropagation: function(event) {
        event = event.browserEvent || event;
        if (event.stopPropagation) {
            event.stopPropagation();
        } else {
            event.cancelBubble = true;
        }
    },

    /**
     * Prevents the browsers default handling of the event.
     * @param {Event} The event to prevent the default
     */
    preventDefault: function(event) {
        event = event.browserEvent || event;
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
            // Some keys events require setting the keyCode to -1 to be prevented
            try {
              // all ctrl + X and F1 -> F12
              if (event.ctrlKey || event.keyCode > 111 && event.keyCode < 124) {
                  event.keyCode = -1;
              }
            } catch (e) {
                // see this outdated document http://support.microsoft.com/kb/934364/en-us for more info
            }
        }
    },

    /**
     * Gets the related target from the event.
     * @param {Object} event The event
     * @return {HTMLElement} The related target.
     */
    getRelatedTarget: function(event) {
        event = event.browserEvent || event;
        var target = event.relatedTarget;
        if (!target) {
            if (this.mouseLeaveRe.test(event.type)) {
                target = event.toElement;
            } else if (this.mouseEnterRe.test(event.type)) {
                target = event.fromElement;
            }
        }
        return this.resolveTextNode(target);
    },

    /**
     * Gets the x coordinate from the event
     * @param {Object} event The event
     * @return {Number} The x coordinate
     */
    getPageX: function(event) {
        return this.getXY(event)[0];
    },

    /**
     * Gets the y coordinate from the event
     * @param {Object} event The event
     * @return {Number} The y coordinate
     */
    getPageY: function(event) {
        return this.getXY(event)[1];
    },

    /**
     * Gets the x & ycoordinate from the event
     * @param {Object} event The event
     * @return {Array} The x/y coordinate
     */
    getPageXY: function(event) {
        event = event.browserEvent || event;
        var x = event.pageX,
            y = event.pageY,
            doc = document.documentElement,
            body = document.body;

        // pageX/pageY not available (undefined, not null), use clientX/clientY instead
        if (!x && x !== 0) {
            x = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc && doc.clientLeft || body && body.clientLeft || 0);
            y = event.clientY + (doc && doc.scrollTop  || body && body.scrollTop  || 0) - (doc && doc.clientTop  || body && body.clientTop  || 0);
        }
        return [x, y];
    },

    /**
     * Gets the target of the event.
     * @param {Object} event The event
     * @return {HTMLElement} target
     */
    getTarget: function(event) {
        event = event.browserEvent || event;
        return this.resolveTextNode(event.target || event.srcElement);
    },

    /**
     * Resolve any text nodes accounting for browser differences.
     * @private
     * @param {HTMLElement} node The node
     * @return {HTMLElement} The resolved node
     */
    // technically no need to browser sniff this, however it makes no sense to check this every time, for every event, whether the string is equal.
    resolveTextNode: Ext.isGecko ?
        function(node) {
            if (!node) {
                return;
            }
            // work around firefox bug, https://bugzilla.mozilla.org/show_bug.cgi?id=101197
            var s = HTMLElement.prototype.toString.call(node);
            if (s == '[xpconnect wrapped native prototype]' || s == '[object XULElement]') {
                return;
            }
                return node.nodeType == 3 ? node.parentNode: node;
            }: function(node) {
                return node && node.nodeType == 3 ? node.parentNode: node;
            },

    // --------------------- custom event binding ---------------------

    // Keep track of the current width/height
    curWidth: 0,
    curHeight: 0,

    /**
     * Adds a listener to be notified when the browser window is resized and provides resize event buffering (100 milliseconds),
     * passes new viewport width and height to handlers.
     * @param {Function} fn      The handler function the window resize event invokes.
     * @param {Object}   scope   The scope (<code>this</code> reference) in which the handler function executes. Defaults to the browser window.
     * @param {boolean}  options Options object as passed to {@link Ext.core.Element#addListener}
     */
    onWindowResize: function(fn, scope, options){
        var resize = this.resizeEvent;
        if(!resize){
            this.resizeEvent = resize = new Ext.util.Event();
            this.on(window, 'resize', this.fireResize, this, {buffer: 100});
        }
        resize.addListener(fn, scope, options);
    },

    /**
     * Fire the resize event.
     * @private
     */
    fireResize: function(){
        var me = this,
            w = Ext.core.Element.getViewWidth(),
            h = Ext.core.Element.getViewHeight();

         //whacky problem in IE where the resize event will sometimes fire even though the w/h are the same.
         if(me.curHeight != h || me.curWidth != w){
             me.curHeight = h;
             me.curWidth = w;
             me.resizeEvent.fire(w, h);
         }
    },

    /**
     * Removes the passed window resize listener.
     * @param {Function} fn        The method the event invokes
     * @param {Object}   scope    The scope of handler
     */
    removeResizeListener: function(fn, scope){
        if (this.resizeEvent) {
            this.resizeEvent.removeListener(fn, scope);
        }
    },

    onWindowUnload: function(){
        var unload = this.unloadEvent;
        if(!resize){
            this.unloadEvent = unload = new Ext.util.Event();
            this.on(window, 'unload', this.fireUnload, this);
        }
        unload.addListener(fn, scope, options);
    },

    /**
     * Fires the unload event for items bound with onWindowUnload
     * @private
     */
    fireUnload: function(){
        // wrap in a try catch, could have some problems during unload
        try {
            me.unloadEvent.fire();
        } catch(e) {

        }
    },

    /**
     * Removes the passed window unload listener.
     * @param {Function} fn        The method the event invokes
     * @param {Object}   scope    The scope of handler
     */
    removeUnloadListener: function(){
        if (this.unloadEvent) {
            this.unloadEvent.removeListener(fn, scope);
        }
    },

    /**
     * note 1: IE fires ONLY the keydown event on specialkey autorepeat
     * note 2: Safari < 3.1, Gecko (Mac/Linux) & Opera fire only the keypress event on specialkey autorepeat
     * (research done by @Jan Wolter at http://unixpapa.com/js/key.html)
     * @private
     */
    useKeyDown: Ext.isWebKit ?
                   parseInt(navigator.userAgent.match(/AppleWebKit\/(\d+)/)[1], 10) >= 525 :
                   !((Ext.isGecko && !Ext.isWindows) || Ext.isOpera),

    /**
     * Indicates which event to use for getting key presses.
     * @return {String} The appropriate event name.
     */
    getKeyEvent: function(){
        return this.useKeyDown ? 'keydown' : 'keypress';
    }
};

Ext.onReady = function(fn, scope, options) {
    Ext.Loader.onReady(fn, scope, true, options);
};

Ext.onDocumentReady = Ext.EventManager.onDocumentReady;

Ext.EventManager.on = Ext.EventManager.addListener;
Ext.EventManager.un = Ext.EventManager.removeListener;

(function(){
    var initExtCss = function() {
        // find the body element
        var bd = document.body || document.getElementsByTagName('body')[0],
            baseCSSPrefix = Ext.baseCSSPrefix,
            html;

        if (!bd) {
            return false;
        }

        html = bd.parentNode;

        var cls = [];

        //Let's keep this human readable!
        if (Ext.isIE) {
            cls.push(baseCSSPrefix + 'ie');
        }
        if (Ext.isIE6) {
            cls.push(baseCSSPrefix + 'ie6');
        }
        if (Ext.isIE7) {
            cls.push(baseCSSPrefix + 'ie7');
        }
        if (Ext.isIE8) {
            cls.push(baseCSSPrefix + 'ie8');
        }
        if (Ext.isIE9) {
            cls.push(baseCSSPrefix + 'ie9');
        }
        if (Ext.isGecko) {
            cls.push(baseCSSPrefix + 'gecko');
        }
        if (Ext.isGecko3) {
            cls.push(baseCSSPrefix + 'gecko3');
        }
        if (Ext.isGecko4) {
            cls.push(baseCSSPrefix + 'gecko4');
        }
        if (Ext.isOpera) {
            cls.push(baseCSSPrefix + 'opera');
        }
        if (Ext.isWebKit) {
            cls.push(baseCSSPrefix + 'webkit');
        }
        if (Ext.isSafari) {
            cls.push(baseCSSPrefix + 'safari');
        }
        if (Ext.isSafari2) {
            cls.push(baseCSSPrefix + 'safari2');
        }
        if (Ext.isSafari3) {
            cls.push(baseCSSPrefix + 'safari3');
        }
        if (Ext.isSafari4) {
            cls.push(baseCSSPrefix + 'safari4');
        }
        if (Ext.isChrome) {
            cls.push(baseCSSPrefix + 'chrome');
        }
        if (Ext.isMac) {
            cls.push(baseCSSPrefix + 'mac');
        }
        if (Ext.isLinux) {
            cls.push(baseCSSPrefix + 'linux');
        }
        if (!Ext.supports.CSS3BorderRadius) {
            cls.push(baseCSSPrefix + 'nbr');
        }
        if (!Ext.supports.CSS3LinearGradient) {
            cls.push(baseCSSPrefix + 'nlg');
        }
        if (!Ext.scopeResetCSS) {
            cls.push(baseCSSPrefix + 'reset');
        }

        // add to the parent to allow for selectors x-strict x-border-box, also set the isBorderBox property correctly
        if (html) {
            if (Ext.isStrict && (Ext.isIE6 || Ext.isIE7)) {
                Ext.isBorderBox = false;
            }
            else {
                Ext.isBorderBox = true;
            }
            Ext.fly(html, '_internal').addCls(baseCSSPrefix + (Ext.isBorderBox ? 'border-box' : 'strict'));
        }

        Ext.fly(bd, '_internal').addCls(cls);
        return true;
    };

    if (!initExtCss()) {
        Ext.onReady(initExtCss);
    }
})();
