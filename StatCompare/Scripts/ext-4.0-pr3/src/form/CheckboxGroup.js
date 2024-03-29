/**
 * @class Ext.form.CheckboxGroup
 * @extends Ext.form.FieldContainer
 * <p>A {@link Ext.form.FieldContainer field container} which has a specialized layout for arranging
 * {@link Ext.form.Checkbox} controls into columns, and provides convenience {@link Ext.form.Field} methods
 * for {@link #getValue getting}, {@link #setValue setting}, and {@link #validate validating} the group
 * of checkboxes as a whole.</p>
 * <p><b>Validation:</b> Individual checkbox fields themselves have no default validation behavior, but
 * sometimes you want to require a user to select at least one of a group of checkboxes. CheckboxGroup
 * allows this by setting the config <tt>{@link #allowBlank}:false</tt>; when the user does not check at
 * least one of the checkboxes, the entire group will be highlighted as invalid and the
 * {@link #blankText error message} will be displayed according to the {@link #msgTarget} config.</p>
 * <p><b>Layout:</b> The default layout for CheckboxGroup makes it easy to arrange the checkboxes into
 * columns; see the {@link #columns} and {@link #vertical} config documentation for details. You may also
 * use a completely different layout by setting the {@link #layout} to one of the other supported layout
 * types; for instance you may wish to use a custom arrangement of hbox and vbox containers. In that case
 * the checkbox components at any depth will still be managed by the CheckboxGroup's validation.</p>
 * <p>Example usage:</p>
 * <pre><code>
var myCheckboxGroup = new Ext.form.CheckboxGroup({
    id:'myGroup',
    xtype: 'checkboxgroup',
    fieldLabel: 'Single Column',
    // Arrange checkboxes into three columns, distributed vertically
    columns: 3,
    vertical: true,
    items: [
        {boxLabel: 'Item 1', name: 'cb-1'},
        {boxLabel: 'Item 2', name: 'cb-2', checked: true},
        {boxLabel: 'Item 3', name: 'cb-3'}
        {boxLabel: 'Item 4', name: 'cb-4'}
        {boxLabel: 'Item 5', name: 'cb-5'}
        {boxLabel: 'Item 6', name: 'cb-6'}
    ]
});
 * </code></pre>
 * @constructor
 * Creates a new CheckboxGroup
 * @param {Object} config Configuration options
 * @xtype checkboxgroup
 */
Ext.define('Ext.form.CheckboxGroup', {
    extend:'Ext.form.FieldContainer',
    mixins: {
        field: 'Ext.form.Field'
    },
    alias: 'widget.checkboxgroup',
    requires: ['Ext.layout.container.CheckboxGroup'],

    /**
     * @cfg {String} name
     * @hide
     */

    /**
     * @cfg {Array} items An Array of {@link Ext.form.Checkbox Checkbox}es or Checkbox config objects
     * to arrange in the group.
     */

    /**
     * @cfg {String/Number/Array} columns Specifies the number of columns to use when displaying grouped
     * checkbox/radio controls using automatic layout.  This config can take several types of values:
     * <ul><li><b>'auto'</b> : <p class="sub-desc">The controls will be rendered one per column on one row and the width
     * of each column will be evenly distributed based on the width of the overall field container. This is the default.</p></li>
     * <li><b>Number</b> : <p class="sub-desc">If you specific a number (e.g., 3) that number of columns will be
     * created and the contained controls will be automatically distributed based on the value of {@link #vertical}.</p></li>
     * <li><b>Array</b> : Object<p class="sub-desc">You can also specify an array of column widths, mixing integer
     * (fixed width) and float (percentage width) values as needed (e.g., [100, .25, .75]). Any integer values will
     * be rendered first, then any float values will be calculated as a percentage of the remaining space. Float
     * values do not have to add up to 1 (100%) although if you want the controls to take up the entire field
     * container you should do so.</p></li></ul>
     */
    columns : 'auto',

    /**
     * @cfg {Boolean} vertical True to distribute contained controls across columns, completely filling each column
     * top to bottom before starting on the next column.  The number of controls in each column will be automatically
     * calculated to keep columns as even as possible.  The default value is false, so that controls will be added
     * to columns one at a time, completely filling each row left to right before starting on the next row.
     */
    vertical : false,

    /**
     * @cfg {Boolean} allowBlank False to validate that at least one item in the group is checked (defaults to true).
     * If no items are selected at validation time, {@link #blankText} will be used as the error text.
     */
    allowBlank : true,

    /**
     * @cfg {String} blankText Error text to display if the {@link #allowBlank} validation fails (defaults to "You must
     * select at least one item in this group")
     */
    blankText : "You must select at least one item in this group",

    // private
    defaultType : 'checkboxfield',

    // private
    groupCls : Ext.baseCSSPrefix + 'form-check-group',

    /**
     * @cfg {String} fieldBodyCls
     * An extra CSS class to be applied to the body content element in addition to {@link #baseBodyCls}.
     * Defaults to 'x-form-checkboxgroup-body'.
     */
    fieldBodyCls: Ext.baseCSSPrefix + 'form-checkboxgroup-body',

    // private
    layout: 'checkboxgroup',

    baseFieldDefaults: {
        hideLabel: true
    },

    initComponent: function() {
        var me = this;

        // Default all children to hide their main fieldLabel
        me.fieldDefaults = Ext.apply({}, me.fieldDefaults, me.baseFieldDefaults);

        me.callParent();
        me.initField();
    },

    /**
     * @protected
     * Initializes the field's value based on the initial config. If the {@link #value} config is specified
     * then we use that to set the value; otherwise we initialize the originalValue by querying the values of
     * all sub-checkboxes after they have been initialized.
     */
    initValue: function() {
        var me = this,
            valueCfg = me.value;
        me.originalValue = me.lastValue = valueCfg || me.getValue();
        if (valueCfg) {
            me.setValue(valueCfg);
        }
    },

    /**
     * @protected
     * When a checkbox is added to the group, monitor it for changes
     */
    onFieldAdded: function(field) {
        var me = this;
        if (field.isCheckbox) {
            me.mon(field, 'change', me.checkChange, me);
        }
        me.callParent(arguments);
    },

    onFieldRemoved: function(field) {
        var me = this;
        if (field.isCheckbox) {
            me.mun(field, 'change', me.checkChange, me);
        }
        me.callParent(arguments);
    },

    // private override - the group value is a complex object, compare using object serialization
    areValuesEqual: function(value1, value2) {
        var toQueryString = Ext.Object.toQueryString;
        return toQueryString(value1) === toQueryString(value2);
    },

    /**
     * Runs CheckboxGroup's validations and returns an array of any errors. The only error by default
     * is if allowBlank is set to true and no items are checked.
     * @return {Array} Array of all validation errors
     */
    getErrors: function() {
        var errors = [];
        if (!this.allowBlank && Ext.isEmpty(this.getChecked())) {
            errors.push(this.blankText);
        }
        return errors;
    },

    /**
     * @private Returns all checkbox components within the container
     */
    getBoxes: function() {
        return this.query('[isCheckbox]');
    },

    /**
     * @private Convenience function which calls the given function for every checkbox in the group
     * @param {Function} fn The function to call
     * @param {Object} scope Optional scope object
     */
    eachBox: function(fn, scope) {
        Ext.Array.forEach(this.getBoxes(), fn, scope || this);
    },

    /**
     * Returns an Array of all checkboxes in the container which are currently checked
     * @return {Array} Array of Ext.form.Checkbox components
     */
    getChecked: function() {
        return Ext.Array.filter(this.getBoxes(), function(cb) {
            return cb.getValue();
        });
    },

    // private override
    isDirty: function(){
        return Ext.Array.some(this.getBoxes(), function(cb) {
            return cb.isDirty();
        });
    },

    // private override
    setReadOnly: function(readOnly) {
        this.eachBox(function(cb) {
            cb.setReadOnly(readOnly);
        });
        this.readOnly = readOnly;
    },

    /**
     * Resets the checked state of all {@link Ext.form.Checkbox checkboxes} in the group to their
     * originally loaded values and clears any validation messages.
     * See {@link Ext.form.Basic}.{@link Ext.form.Basic#trackResetOnLoad trackResetOnLoad}
     */
    reset: function() {
        var me = this,
            hadError = me.hasActiveError(),
            preventMark = me.preventMark;
        me.preventMark = true;
        me.batchChanges(function() {
            me.eachBox(function(cb) {
                cb.reset();
            });
        });
        me.preventMark = preventMark;
        me.unsetActiveError();
        if (hadError) {
            me.doComponentLayout();
        }
    },

    // private override
    resetOriginalValue: function() {
        // Defer resetting of originalValue until after all sub-checkboxes have been reset so we get
        // the correct data from getValue()
        Ext.defer(function() {
            this.callParent();
        }, 1, this);
    },


    /**
     * <p>Sets the value(s) of all checkboxes in the group. The expected format is an Object of
     * name-value pairs corresponding to the names of the checkboxes in the group. Each pair can
     * have either a single or multiple values:</p>
     * <ul>
     *   <li>A single Boolean or String value will be passed to the <code>setValue</code> method of the
     *   checkbox with that name. See the rules in {@link Ext.form.Checkbox#setValue} for accepted values.</li>
     *   <li>An Array of String values will be matched against the {@link Ext.form.Checkbox#inputValue inputValue}
     *   of checkboxes in the group with that name; those checkboxes whose inputValue exists in the array will be
     *   checked and others will be unchecked.</li>
     * </ul>
     * <p>If a checkbox's name is not in the mapping at all, it will be unchecked.</p>
     * <p>An example:</p>
     * <pre><code>var myCheckboxGroup = new Ext.form.CheckboxGroup({
    columns: 3,
    items: [{
        name: 'cb1',
        boxLabel: 'Single 1'
    }, {
        name: 'cb2',
        boxLabel: 'Single 2'
    }, {
        name: 'cb3',
        boxLabel: 'Single 3'
    }, {
        name: 'cbGroup',
        boxLabel: 'Grouped 1'
        inputValue: 'value1'
    }, {
        name: 'cbGroup',
        boxLabel: 'Grouped 2'
        inputValue: 'value2'
    }, {
        name: 'cbGroup',
        boxLabel: 'Grouped 3'
        inputValue: 'value3'
    }]
});

myCheckboxGroup.setValue({
    cb1: true,
    cb3: false,
    cbGroup: ['value1', 'value3']
});</code></pre>
     * <p>The above code will cause the checkbox named 'cb1' to be checked, as well as the first and third
     * checkboxes named 'cbGroup'. The other three checkboxes will be unchecked.</p>
     * @param {Object} value The mapping of checkbox names to values.
     * @return {Ext.form.CheckboxGroup} this
     */
    setValue: function(value) {
        var me = this;
        me.batchChanges(function() {
            me.eachBox(function(cb) {
                var name = cb.getName(),
                    cbValue = false;
                if (value && name in value) {
                    if (Ext.isArray(value[name])) {
                        cbValue = Ext.Array.contains(value[name], cb.inputValue);
                    } else {
                        // single value, let the checkbox's own setValue handle conversion
                        cbValue = value[name];
                    }
                }
                cb.setValue(cbValue);
            });
        });
        return me;
    },


    /**
     * <p>Returns an object containing the values of all checked checkboxes within the group. Each key-value pair
     * in the object corresponds to a checkbox {@link Ext.form.Checkbox#name name}. If there is only one checked
     * checkbox with a particular name, the value of that pair will be the String
     * {@link Ext.form.Checkbox#inputValue inputValue} of that checkbox. If there are multiple checked checkboxes
     * with that name, the value of that pair will be an Array of the selected inputValues.</p>
     * <p>The object format returned from this method can also be passed directly to the {@link #setValue} method.</p>
     * <p>NOTE: In Ext 3, this method returned an array of Checkbox components; this was changed to make it more
     * consistent with other field components and with the {@link #setValue} argument signature. If you need the old
     * behavior in Ext 4+, use the {@link #getChecked} method instead.</p>
     */
    getValue: function() {
        var values = {};
        this.eachBox(function(cb) {
            var name = cb.getName(),
                inputValue = cb.inputValue,
                bucket;
            if (cb.getValue()) {
                if (name in values) {
                    bucket = values[name];
                    if (!Ext.isArray(bucket)) {
                        bucket = values[name] = [bucket];
                    }
                    bucket.push(inputValue);
                } else {
                    values[name] = inputValue;
                }
            }
        });
        return values;
    },

    /*
     * Don't return any data for submit; the form will get the info from the individual checkboxes themselves.
     */
    getSubmitData: function() {
        return null;
    },

    validate: function() {
        var me = this,
            error = me.getErrors()[0],
            undef,
            isValid = error === undef,
            wasValid = !me.hasActiveError();

        if (isValid) {
            me.unsetActiveError();
        } else {
            me.setActiveError(error);
        }
        if (isValid !== wasValid) {
            me.fireEvent('validitychange', me, isValid);
            me.doComponentLayout();
        }

        return isValid;
    }

});

