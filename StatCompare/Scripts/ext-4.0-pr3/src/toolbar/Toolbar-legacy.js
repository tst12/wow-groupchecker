/**
 * @ignore
 */
// backwards compat
Ext.toolbar.Toolbar.Button = Ext.extend(Ext.button.Button, {});
Ext.toolbar.Toolbar.SplitButton = Ext.extend(Ext.button.Split, {});
Ext.reg('tbbutton', Ext.toolbar.Toolbar.Button);
Ext.reg('tbsplit', Ext.toolbar.Toolbar.SplitButton);

Ext.toolbar.Toolbar.override({
    /**
     * Adds text to the toolbar
     * <br><p><b>Note</b>: See the notes within {@link Ext.container.Container#add}.</p>
     * @param {String} text The text to add
     * @return {Ext.Toolbar.Item} The element's item
     */
    addText : function(text){
        return this.addItem(new Ext.Toolbar.TextItem(text));
    },

    /**
     * Adds a new element to the toolbar from the passed {@link Ext.core.DomHelper} config
     * <br><p><b>Note</b>: See the notes within {@link Ext.container.Container#add}.</p>
     * @param {Object} config
     * @return {Ext.Toolbar.Item} The element's item
     */
    addDom : function(config){
        return this.add(new Ext.Toolbar.Item({autoEl: config}));
    },

    /**
     * Adds a dynamically rendered Ext.form field (Text, ComboBox, etc). Note: the field should not have
     * been rendered yet. For a field that has already been rendered, use {@link #addElement}.
     * <br><p><b>Note</b>: See the notes within {@link Ext.container.Container#add}.</p>
     * @param {Ext.form.Field} field
     * @return {Ext.Toolbar.Item}
     */
    addField : function(field){
        return this.add(field);
    },

    /**
     * Inserts any {@link Ext.Toolbar.Item}/{@link Ext.button.Button} at the specified index.
     * <br><p><b>Note</b>: See the notes within {@link Ext.container.Container#add}.</p>
     * @param {Number} index The index where the item is to be inserted
     * @param {Object/Ext.Toolbar.Item/Ext.button.Button/Array} item The button, or button config object to be
     * inserted, or an array of buttons/configs.
     * @return {Ext.button.Button/Item}
     */
    insertButton : function(index, item){
        if(Ext.isArray(item)){
            var buttons = [];
            for(var i = 0, len = item.length; i < len; i++) {
               buttons.push(this.insertButton(index + i, item[i]));
            }
            return buttons;
        }
        return Ext.toolbar.Toolbar.superclass.insert.call(this, index, item);
    },

    /**
     * Adds a separator
     * <br><p><b>Note</b>: See the notes within {@link Ext.container.Container#add}.</p>
     * @return {Ext.Toolbar.Item} The separator {@link Ext.Toolbar.Item item}
     */
    addSeparator : function(){
        return this.add(new Ext.toolbar.Separator());
    },

    /**
     * Adds a spacer element
     * <br><p><b>Note</b>: See the notes within {@link Ext.container.Container#add}.</p>
     * @return {Ext.Toolbar.Spacer} The spacer item
     */
    addSpacer : function(){
        return this.add(new Ext.Toolbar.Spacer());
    },

    /**
     * Forces subsequent additions into the float:right toolbar
     * <br><p><b>Note</b>: See the notes within {@link Ext.container.Container#add}.</p>
     */
    addFill : function(){
        this.add(new Ext.Toolbar.Fill());
    },

    /**
     * Adds any standard HTML element to the toolbar
     * <br><p><b>Note</b>: See the notes within {@link Ext.container.Container#add}.</p>
     * @param {Mixed} el The element or id of the element to add
     * @return {Ext.Toolbar.Item} The element's item
     */
    addElement : function(el){
        return this.addItem(new Ext.Toolbar.Item({el:el}));
    },

    /**
     * Adds any Toolbar.Item or subclass
     * <br><p><b>Note</b>: See the notes within {@link Ext.container.Container#add}.</p>
     * @param {Ext.Toolbar.Item} item
     * @return {Ext.Toolbar.Item} The item
     */
    addItem : function(item){
        return this.add.apply(this, arguments);
    },

    /**
     * Adds a button (or buttons). See {@link Ext.button.Button} for more info on the config.
     * <br><p><b>Note</b>: See the notes within {@link Ext.container.Container#add}.</p>
     * @param {Object/Array} config A button config or array of configs
     * @return {Ext.button.Button/Array}
     */
    addButton : function(config){
        if(Ext.isArray(config)){
            var buttons = [];
            for(var i = 0, len = config.length; i < len; i++) {
                buttons.push(this.addButton(config[i]));
            }
            return buttons;
        }
        return this.add(this.constructButton(config));
    }
});