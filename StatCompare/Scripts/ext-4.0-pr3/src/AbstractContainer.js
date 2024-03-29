/**
 * @class Ext.AbstractContainer
 * @extends Ext.Component
 * Please refer to sub classes documentation
 */
Ext.define('Ext.AbstractContainer', {

    /* Begin Definitions */

    extend: 'Ext.Component',

    requires: [
        'Ext.util.MixedCollection',
        'Ext.layout.Manager',
        'Ext.layout.container.Auto',
        'Ext.ComponentMgr',
        'Ext.ComponentQuery',
        'Ext.ZIndexManager'
    ],

    /* End Definitions */
    /**
     * @cfg {String/Object} layout
     * <p><b>*Important</b>: In order for child items to be correctly sized and
     * positioned, typically a layout manager <b>must</b> be specified through
     * the <code>layout</code> configuration option.</p>
     * <br><p>The sizing and positioning of child {@link items} is the responsibility of
     * the Container's layout manager which creates and manages the type of layout
     * you have in mind.  For example:</p>
     * <p>If the {@link #layout} configuration is not explicitly specified for
     * a general purpose container (e.g. Container or Panel) the
     * {@link Ext.layout.container.Auto default layout manager} will be used
     * which does nothing but render child components sequentially into the
     * Container (no sizing or positioning will be performed in this situation).</p>
     * <br><p><b><code>layout</code></b> may be specified as either as an Object or
     * as a String:</p><div><ul class="mdetail-params">
     *
     * <li><u>Specify as an Object</u></li>
     * <div><ul class="mdetail-params">
     * <li>Example usage:</li>
     * <pre><code>
layout: {
    type: 'vbox',
    align: 'left'
}
       </code></pre>
     *
     * <li><code><b>type</b></code></li>
     * <br/><p>The layout type to be used for this container.  If not specified,
     * a default {@link Ext.layout.container.Auto} will be created and used.</p>
     * <br/><p>Valid layout <code>type</code> values are:</p>
     * <div class="sub-desc"><ul class="mdetail-params">
     * <li><code><b>{@link Ext.layout.container.Auto Auto}</b></code> &nbsp;&nbsp;&nbsp; <b>Default</b></li>
     * <li><code><b>{@link Ext.layout.container.Card card}</b></code></li>
     * <li><code><b>{@link Ext.layout.container.Fit fit}</b></code></li>
     * <li><code><b>{@link Ext.layout.container.HBox hbox}</b></code></li>
     * <li><code><b>{@link Ext.layout.container.VBox vbox}</b></code></li>
     * <li><code><b>{@link Ext.layout.container.Anchor anchor}</b></code></li>
     * <li><code><b>{@link Ext.layout.container.Table table}</b></code></li>
     * </ul></div>
     *
     * <li>Layout specific configuration properties</li>
     * <br/><p>Additional layout specific configuration properties may also be
     * specified. For complete details regarding the valid config options for
     * each layout type, see the layout class corresponding to the <code>type</code>
     * specified.</p>
     *
     * </ul></div>
     *
     * <li><u>Specify as a String</u></li>
     * <div><ul class="mdetail-params">
     * <li>Example usage:</li>
     * <pre><code>
layout: {
    type: 'vbox',
    padding: '5',
    align: 'left'
}
       </code></pre>
     * <li><code><b>layout</b></code></li>
     * <br/><p>The layout <code>type</code> to be used for this container (see list
     * of valid layout type values above).</p><br/>
     * <br/><p>Additional layout specific configuration properties. For complete
     * details regarding the valid config options for each layout type, see the
     * layout class corresponding to the <code>layout</code> specified.</p>
     * </ul></div></ul></div>
     */

    /**
     * @cfg {String/Number} activeItem
     * A string component id or the numeric index of the component that should be initially activated within the
     * container's layout on render.  For example, activeItem: 'item-1' or activeItem: 0 (index 0 = the first
     * item in the container's collection).  activeItem only applies to layout styles that can display
     * items one at a time (like {@link Ext.layout.container.Card} and {@link Ext.layout.container.Fit}).
     */
    /**
     * @cfg {Object/Array} items
     * <pre><b>** IMPORTANT</b>: be sure to <b>{@link #layout specify a <code>layout</code>} if needed ! **</b></pre>
     * <p>A single item, or an array of child Components to be added to this container,
     * for example:</p>
     * <pre><code>
// specifying a single item
items: {...},
layout: 'fit',    // specify a layout!

// specifying multiple items
items: [{...}, {...}],
layout: 'hbox', // specify a layout!
       </code></pre>
     * <p>Each item may be:</p>
     * <div><ul class="mdetail-params">
     * <li>any type of object based on {@link Ext.Component}</li>
     * <li>a fully instanciated object or</li>
     * <li>an object literal that:</li>
     * <div><ul class="mdetail-params">
     * <li>has a specified <code>{@link Ext.Component#xtype xtype}</code></li>
     * <li>the {@link Ext.Component#xtype} specified is associated with the Component
     * desired and should be chosen from one of the available xtypes as listed
     * in {@link Ext.Component}.</li>
     * <li>If an <code>{@link Ext.Component#xtype xtype}</code> is not explicitly
     * specified, the {@link #defaultType} for that Container is used.</li>
     * <li>will be "lazily instanciated", avoiding the overhead of constructing a fully
     * instanciated Component object</li>
     * </ul></div></ul></div>
     * <p><b>Notes</b>:</p>
     * <div><ul class="mdetail-params">
     * <li>Ext uses lazy rendering. Child Components will only be rendered
     * should it become necessary. Items are automatically laid out when they are first
     * shown (no sizing is done while hidden), or in response to a {@link #doLayout} call.</li>
     * <li>Do not specify <code>{@link Ext.panel.Panel#contentEl contentEl}</code>/
     * <code>{@link Ext.panel.Panel#html html}</code> with <code>items</code>.</li>
     * </ul></div>
     */
    /**
     * @cfg {Object|Function} defaults
     * <p>This option is a means of applying default settings to all added items whether added through the {@link #items}
     * config or via the {@link #add} or {@link #insert} methods.</p>
     * <p>If an added item is a config object, and <b>not</b> an instantiated Component, then the default properties are
     * unconditionally applied. If the added item <b>is</b> an instantiated Component, then the default properties are
     * applied conditionally so as not to override existing properties in the item.</p>
     * <p>If the defaults option is specified as a function, then the function will be called using this Container as the
     * scope (<code>this</code> reference) and passing the added item as the first parameter. Any resulting object
     * from that call is then applied to the item as default properties.</p>
     * <p>For example, to automatically apply padding to the body of each of a set of
     * contained {@link Ext.panel.Panel} items, you could pass: <code>defaults: {bodyStyle:'padding:15px'}</code>.</p>
     * <p>Usage:</p><pre><code>
defaults: {               // defaults are applied to items, not the container
    autoScroll:true
},
items: [
    {
        xtype: 'panel',   // defaults <b>do not</b> have precedence over
        id: 'panel1',     // options in config objects, so the defaults
        autoScroll: false // will not be applied here, panel1 will be autoScroll:false
    },
    new Ext.panel.Panel({       // defaults <b>do</b> have precedence over options
        id: 'panel2',     // options in components, so the defaults
        autoScroll: false // will be applied here, panel2 will be autoScroll:true.
    })
]</code></pre>
     */

    /** @cfg {Boolean} suspendLayout
     * If true, suspend calls to doLayout.  Usefule when batching multiple adds to a container and not passing them
     * as multiple arguments or an array.
     */
    suspendLayout : false,

    /** @cfg {Boolean} autoDestroy
     * If true the container will automatically destroy any contained component that is removed from it, else
     * destruction must be handled manually.
     * Defaults to true.
     */
    autoDestroy : true,

     /** @cfg {String} defaultType
      * <p>The default {@link Ext.Component xtype} of child Components to create in this Container when
      * a child item is specified as a raw configuration object, rather than as an instantiated Component.</p>
      * <p>Defaults to <code>'panel'</code>.</p>
      */
    defaultType: 'panel',

    isContainer : true,

    baseCls: Ext.baseCSSPrefix + 'container',

    /**
     * @cfg {Array} bubbleEvents
     * <p>An array of events that, when fired, should be bubbled to any parent container.
     * See {@link Ext.util.Observable#enableBubble}.
     * Defaults to <code>['add', 'remove']</code>.
     */
    bubbleEvents: ['add', 'remove'],

    // @private
    initComponent : function(){
        var me = this;
        me.addEvents(
            /**
             * @event afterlayout
             * Fires when the components in this container are arranged by the associated layout manager.
             * @param {Ext.container.Container} this
             * @param {ContainerLayout} layout The ContainerLayout implementation for this container
             */
            'afterlayout',
            /**
             * @event beforeadd
             * Fires before any {@link Ext.Component} is added or inserted into the container.
             * A handler can return false to cancel the add.
             * @param {Ext.container.Container} this
             * @param {Ext.Component} component The component being added
             * @param {Number} index The index at which the component will be added to the container's items collection
             */
            'beforeadd',
            /**
             * @event beforeremove
             * Fires before any {@link Ext.Component} is removed from the container.  A handler can return
             * false to cancel the remove.
             * @param {Ext.container.Container} this
             * @param {Ext.Component} component The component being removed
             */
            'beforeremove',
            /**
             * @event add
             * @bubbles
             * Fires after any {@link Ext.Component} is added or inserted into the container.
             * @param {Ext.container.Container} this
             * @param {Ext.Component} component The component that was added
             * @param {Number} index The index at which the component was added to the container's items collection
             */
            'add',
            /**
             * @event remove
             * @bubbles
             * Fires after any {@link Ext.Component} is removed from the container.
             * @param {Ext.container.Container} this
             * @param {Ext.Component} component The component that was removed
             */
            'remove',
            /**
             * @event beforecardswitch
             * Fires before this container switches the active card. This event
             * is only available if this container uses a CardLayout. Note that
             * TabPanel and Carousel both get a CardLayout by default, so both
             * will have this event.
             * A handler can return false to cancel the card switch.
             * @param {Ext.container.Container} this
             * @param {Ext.Component} newCard The card that will be switched to
             * @param {Ext.Component} oldCard The card that will be switched from
             * @param {Number} index The index of the card that will be switched to
             * @param {Boolean} animated True if this cardswitch will be animated
             */
            'beforecardswitch',
            /**
             * @event cardswitch
             * Fires after this container switches the active card. If the card
             * is switched using an animation, this event will fire after the
             * animation has finished. This event is only available if this container
             * uses a CardLayout. Note that TabPanel and Carousel both get a CardLayout
             * by default, so both will have this event.
             * @param {Ext.container.Container} this
             * @param {Ext.Component} newCard The card that has been switched to
             * @param {Ext.Component} oldCard The card that has been switched from
             * @param {Number} index The index of the card that has been switched to
             * @param {Boolean} animated True if this cardswitch was animated
             */
            'cardswitch'
        );

        // layoutOnShow stack
        me.layoutOnShow = new Ext.util.MixedCollection();
        me.callParent();
        me.initItems();
    },

    // @private
    initItems : function() {
        var me = this,
            items = me.items;

        /**
         * The MixedCollection containing all the child items of this container.
         * @property items
         * @type Ext.util.MixedCollection
         */
        me.items = Ext.create('Ext.util.MixedCollection', false, me.getComponentId);

        if (items) {
            if (!Ext.isArray(items)) {
                items = [items];
            }

            me.add(items);
        }
    },

    // @private
    afterRender : function() {
        this.getLayout();
        this.callParent();
    },

    // @private
    setLayout : function(layout) {
        var currentLayout = this.layout;

        if (currentLayout && currentLayout.isLayout && currentLayout != layout) {
            currentLayout.setOwner(null);
        }

        this.layout = layout;
        layout.setOwner(this);
    },

    /**
     * Returns the {@link Ext.layout.AbstractContainer layout} instance currently associated with this Container.
     * If a layout has not been instantiated yet, that is done first
     * @return {Ext.layout.AbstractContainer} The layout
     */
    getLayout : function() {
        var me = this;
        if (!me.layout || !me.layout.isLayout) {
            me.setLayout(Ext.layout.Manager.create(me.layout, 'autocontainer'));
        }

        return me.layout;
    },

    /**
     * Manually force this container's layout to be recalculated.  The framwork uses this internally to refresh layouts
     * form most cases.
     * @return {Ext.container.Container} this
     */
    doLayout : function() {
        var me = this,
            layout = me.getLayout();

        if (me.rendered && layout && !me.suspendLayout) {
            layout.layout();
        }

        return me;
    },

    // @private
    afterLayout : function(layout) {
        this.fireEvent('afterlayout', this, layout);
    },

    // @private
    prepareItems : function(items, applyDefaults) {
        if (!Ext.isArray(items)) {
            items = [items];
        }

        // Make sure defaults are applied and item is initialized
        var i = 0,
            len = items.length,
            item;

        for (; i < len; i++) {
            item = items[i];
            if (applyDefaults) {
                item = this.applyDefaults(item);
            }
            items[i] = this.lookupComponent(item);
        }
        return items;
    },

    // @private
    applyDefaults : function(config) {
        var defaults = this.defaults;

        if (defaults) {
            if (Ext.isFunction(defaults)) {
                defaults = defaults.call(this, config);
            }

            if (Ext.isString(config)) {
                config = Ext.ComponentMgr.get(config);
                Ext.applyIf(config, defaults);
            } else if (!config.isComponent) {
                Ext.applyIf(config, defaults);
            } else {
                Ext.applyIf(config, defaults);
            }
        }

        return config;
    },

    // @private
    lookupComponent : function(comp) {
        if (Ext.isString(comp)) {
            return Ext.ComponentMgr.get(comp);
        } else {
            return this.createComponent(comp);
        }
        return comp;
    },

    // @private
    createComponent : function(config, defaultType) {
        // // add in ownerCt at creation time but then immediately
        // // remove so that onBeforeAdd can handle it
        // var component = Ext.create(Ext.apply({ownerCt: this}, config), defaultType || this.defaultType);
        //
        // delete component.initialConfig.ownerCt;
        // delete component.ownerCt;

        return Ext.ComponentMgr.create(config, defaultType || this.defaultType);
    },

    // @private - used as the key lookup function for the items collection
    getComponentId : function(comp) {
        return comp.getItemId();
    },

    /**

Adds {@link Ext.Component Component}(s) to this Container.

##Description:##

- Fires the {@link #beforeadd} event before adding.
- The Container's {@link #defaults default config values} will be applied
  accordingly (see `{@link #defaults}` for details).
- Fires the `{@link #add}` event after the component has been added.

##Notes:##

If the Container is __already rendered__ when `add`
is called, you may need to call {@link #doLayout} to refresh the view which causes
any unrendered child Components to be rendered. This is required so that you can
`add` multiple child components if needed while only refreshing the layout
once. For example:

    r tb = new {@link Ext.toolbar.Toolbar}();
    .render(document.body);  // toolbar is rendered
    .add({text:'Button 1'}); // add multiple items ({@link #defaultType} for {@link Ext.toolbar.Toolbar Toolbar} is 'button')
    .add({text:'Button 2'});

##Warning:## 

Containers directly managed by the BorderLayout layout manager
may not be removed or added.  See the Notes for {@link Ext.layout.container.Border BorderLayout}
for more details.

     * @param {...Object/Array} component
     * Either one or more Components to add or an Array of Components to add.
     * See `{@link #items}` for additional information.
     *
     * @return {Ext.Component/Array} The Components that were added.
     * @markdown
     */
    add : function() {
        var me = this,
            args = Array.prototype.slice.call(arguments),
            hasMultipleArgs,
            items,
            results = [],
            i,
            ln,
            item,
            index = -1,
            cmp;

        if (typeof args[0] == 'number') {
            index = args.shift();
        }

        hasMultipleArgs = args.length > 1;
        if (hasMultipleArgs || Ext.isArray(args[0])) {

            items = hasMultipleArgs ? args : args[0];
            // Suspend Layouts while we add multiple items to the container
            me.suspendLayout = true;
            for (i = 0, ln = items.length; i < ln; i++) {
                item = items[i];
                if (!item) {
                    throw "Trying to add a null item as a child of Container with itemId/id: " + me.getItemId();
                }

                if (index != -1) {
                    item = me.add(index + i, item);
                } else {
                    item = me.add(item);
                }
                results.push(item);
            }
            // Resume Layouts now that all items have been added and do a single layout for all the items just added
            me.suspendLayout = false;
            me.doLayout();
            return results;
        }

        cmp = me.prepareItems(args[0], true)[0];

        // Floating Components are not added into the items collection
        // But they do get an upward ownerCt link so that they can traverse
        // up to their z-index parent.
        if (cmp.floating) {
            cmp.onAdded(me, index);
        } else {
            index = (index !== -1) ? index : me.items.length;
            if (me.fireEvent('beforeadd', me, cmp, index) !== false && me.onBeforeAdd(cmp) !== false) {
                me.items.insert(index, cmp);
                cmp.onAdded(me, index);
                me.onAdd(cmp, index);
                me.fireEvent('add', me, cmp, index);
            }
            me.doLayout();
        }
        return cmp;
    },

    /**
     * @private
     * <p>Called by Component#doAutoRender</p>
     * <p>Register a Container configured <code>floating: true</code> with this Container's {@link Ext.ZIndexManager ZIndexManager}.</p>
     * <p>Components added in ths way will not participate in the layout, but will be rendered
     * upon first show in the way that {@link Ext.window.Window Window}s are.</p>
     * <p></p>
     */
    registerFloatingItem: function(cmp) {
        var me = this;
        if (!me.floatingItems) {
            me.floatingItems = new Ext.ZIndexManager(me);
        }
        me.floatingItems.register(cmp);
    },

    onAdd : Ext.emptyFn,
    onRemove : Ext.emptyFn,

    /**
     * Inserts a Component into this Container at a specified index. Fires the
     * {@link #beforeadd} event before inserting, then fires the {@link #add} event after the
     * Component has been inserted.
     * @param {Number} index The index at which the Component will be inserted
     * into the Container's items collection
     * @param {Ext.Component} component The child Component to insert.<br><br>
     * Ext uses lazy rendering, and will only render the inserted Component should
     * it become necessary.<br><br>
     * A Component config object may be passed in order to avoid the overhead of
     * constructing a real Component object if lazy rendering might mean that the
     * inserted Component will not be rendered immediately. To take advantage of
     * this 'lazy instantiation', set the {@link Ext.Component#xtype} config
     * property to the registered type of the Component wanted.<br><br>
     * For a list of all available xtypes, see {@link Ext.Component}.
     * @return {Ext.Component} component The Component (or config object) that was
     * inserted with the Container's default config values applied.
     */
    insert : function(index, comp) {
        return this.add(index, comp);
    },

    /**
     * Moves a Component within the Container
     * @param {Number} fromIdx The index the Component you wish to move is currently at.
     * @param {Number} toIdx The new index for the Component.
     * @return {Ext.Component} component The Component (or config object) that was moved.
     */
    move : function(fromIdx, toIdx) {
        var items = this.items,
            item;
        item = items.removeAt(fromIdx);
        if (item === false) {
            return false;
        }
        items.insert(toIdx, item);
        this.doLayout();
        return item;
    },

    // @private
    onBeforeAdd : function(item) {
        if (item.ownerCt) {
            item.ownerCt.remove(item, false);
        }

        if (this.hideBorders === true){
            item.border = (item.border === true);
        }
    },

    /**
     * Removes a component from this container.  Fires the {@link #beforeremove} event before removing, then fires
     * the {@link #remove} event after the component has been removed.
     * @param {Component/String} component The component reference or id to remove.
     * @param {Boolean} autoDestroy (optional) True to automatically invoke the removed Component's {@link Ext.Component#destroy} function.
     * Defaults to the value of this Container's {@link #autoDestroy} config.
     * @return {Ext.Component} component The Component that was removed.
     */
    remove : function(comp, autoDestroy) {
        var me = this,
            c = me.getComponent(comp);
        //<debug>
            if (Ext.isDefined(Ext.global.console) && !c) {
                console.warn("Attempted to remove a component that does not exist. Ext.container.Container: remove takes an argument of the component to remove. cmp.remove() is incorrect usage.");
            }
        //</debug>

        if (c && me.fireEvent('beforeremove', me, c) !== false) {
            me.doRemove(c, autoDestroy);
            me.fireEvent('remove', me, c);
        }

        return c;
    },

    // @private
    doRemove : function(component, autoDestroy) {
        var me = this,
            layout = me.layout,
            hasLayout = layout && me.rendered;

        me.items.remove(component);
        component.onRemoved();

        if (hasLayout) {
            layout.onRemove(component);
        }

        me.onRemove(component, autoDestroy);

        if (autoDestroy === true || (autoDestroy !== false && me.autoDestroy)) {
            component.destroy();
        }

        if (hasLayout && !autoDestroy) {
            layout.afterRemove(component);
        }

        if (!me.destroying) {
            me.doLayout();
        }
    },

    /**
     * Removes all components from this container.
     * @param {Boolean} autoDestroy (optional) True to automatically invoke the removed Component's {@link Ext.Component#destroy} function.
     * Defaults to the value of this Container's {@link #autoDestroy} config.
     * @return {Array} Array of the destroyed components
     */
    removeAll : function(autoDestroy) {
        var me = this,
            removeItems = me.items.items.slice(),
            items = [],
            i = 0,
            len = removeItems.length,
            item;

        // Suspend Layouts while we remove multiple items from the container
        me.suspendLayout = true;
        for (; i < len; i++) {
            item = removeItems[i];
            me.remove(item, autoDestroy);

            if (item.ownerCt !== me) {
                items.push(item);
            }
        }

        // Resume Layouts now that all items have been removed and do a single layout
        me.suspendLayout = false;
        me.doLayout();
        return items;
    },

    // Used by ComponentQuery to retrieve all of the items
    // which can potentially be considered a child of this Container.
    // This should be overriden by components which have child items
    // that are not contained in items. For example dockedItems, menu, etc
    getRefItems : function(deep) {
        var items = this.items.items.slice(),
            len = items.length,
            i = 0,
            item;

        // Include floating items in the list.
        // These will only be present after they are rendered.
        if (this.floatingItems) {
            items = items.concat(this.floatingItems.accessList);
            len = items.length;
        }

        if (deep) {
            for (; i < len; i++) {
                item = items[i];
                if (item.getRefItems) {
                    items = items.concat(item.getRefItems(true));
                }
            }
        }

        return items;
    },

    /**
     * Examines this container's <code>{@link #items}</code> <b>property</b>
     * and gets a direct child component of this container.
     * @param {String/Number} comp This parameter may be any of the following:
     * <div><ul class="mdetail-params">
     * <li>a <b><code>String</code></b> : representing the <code>{@link Ext.Component#itemId itemId}</code>
     * or <code>{@link Ext.Component#id id}</code> of the child component </li>
     * <li>a <b><code>Number</code></b> : representing the position of the child component
     * within the <code>{@link #items}</code> <b>property</b></li>
     * </ul></div>
     * <p>For additional information see {@link Ext.util.MixedCollection#get}.
     * @return Ext.Component The component (if found).
     */
    getComponent : function(comp) {
        if (Ext.isObject(comp)) {
            comp = comp.getItemId();
        }

        return this.items.get(comp);
    },

    /**
     * Retrieves all descendant components which match the passed selector.
     * Executes an Ext.ComponentQuery.query using this container as its root.
     * @param {String} selector Selector complying to an Ext.ComponentQuery selector
     * @return {Array} Ext.Component's which matched the selector
     */
    query : function(selector) {
        return Ext.ComponentQuery.query(selector, this);
    },

    /**
     * Retrieves the first direct child of this container which matches the passed selector.
     * The passed in selector must comply with an Ext.ComponentQuery selector.
     * @param {String} selector An Ext.ComponentQuery selector
     * @return Ext.Component
     */
    child : function(selector) {
        return this.query('> ' + selector)[0] || null;
    },

    /**
     * Retrieves the first descendant of this container which matches the passed selector.
     * The passed in selector must comply with an Ext.ComponentQuery selector.
     * @param {String} selector An Ext.ComponentQuery selector
     * @return Ext.Component
     */
    down : function(selector) {
        return this.query(selector)[0] || null;
    },

    // inherit docs
    show : function() {
        this.callParent(arguments);
        this.performDeferredLayouts();
    },

    // Lay out any descendant containers who queued a layout operation during the time this was hidden
    // This is also called by Panel after it expands because descendants of a collapsed Panel allso queue any layout ops.
    performDeferredLayouts: function() {
        var layoutCollection = this.layoutOnShow,
            ln = layoutCollection.getCount(),
            i = 0,
            needsLayout,
            item;

        for (; i < ln; i++) {
            item = layoutCollection.get(i);
            needsLayout = item.needsLayout;

            if (Ext.isObject(needsLayout)) {
                item.doComponentLayout(needsLayout.width, needsLayout.height, needsLayout.isSetSize, needsLayout.ownerCt);
            }
        }
        layoutCollection.clear();
    },

    // @private
    beforeDestroy : function() {
        var me = this,
            items = me.items,
            c;

        if (items) {
            while ((c = items.first())) {
                me.doRemove(c, true);
            }
        }

        Ext.destroy(
            me.layout,
            me.floatingItems
        );
        me.callParent();
    }
});