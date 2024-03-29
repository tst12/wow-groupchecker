/**
 * @class Ext.form.Time
 * @extends Ext.form.Picker
 * <p>Provides a time input field with a time dropdown and automatic time validation.</p>
 * <p>This field recognizes and uses JavaScript Date objects as its main {@link #value} type (only the time
 * portion of the date is used; the month/day/year are ignored). In addition, it recognizes string values which
 * are parsed according to the {@link #format} and/or {@link #altFormats} configs. These may be reconfigured
 * to use time formats appropriate for the user's locale.</p>
 * <p>The field may be limited to a certain range of times by using the {@link #minValue} and {@link #maxValue}
 * configs, and the interval between time options in the dropdown can be changed with the {@link #increment} config.</p>
 * <p>Example usage:</p>
 * <pre><code>new Ext.form.FormPanel({
    title: 'Time Card',
    renderTo: Ext.getBody(),
    width: 300,
    bodyPadding: 10,
    items: [{
        xtype: 'timefield',
        name: 'in',
        fieldLabel: 'Time In',
        minValue: '6:00 AM',
        maxValue: '8:00 PM',
        increment: 30,
        anchor: '100%'
    }, {
        xtype: 'timefield',
        name: 'out',
        fieldLabel: 'Time Out',
        minValue: '6:00 AM',
        maxValue: '8:00 PM',
        increment: 30,
        anchor: '100%'
   }]
});</code></pre>
 * @constructor
 * Create a new Time field
 * @param {Object} config
 * @xtype timefield
 */
Ext.define('Ext.form.Time', {
    extend:'Ext.form.Picker',
    alias: 'widget.timefield',
    requires: ['Ext.form.Date', 'Ext.picker.Time', 'Ext.view.BoundListKeyNav', 'Ext.util.Date'],
    alternateClassName: 'Ext.form.TimeField',

    /**
     * @cfg {String} triggerCls
     * An additional CSS class used to style the trigger button.  The trigger will always get the
     * {@link #triggerBaseCls} by default and <tt>triggerCls</tt> will be <b>appended</b> if specified.
     * Defaults to <tt>'x-form-time-trigger'</tt> for the Time field trigger.
     */
    triggerCls: Ext.baseCSSPrefix + 'form-time-trigger',
    
    /**
     * @cfg {Date/String} minValue
     * The minimum allowed time. Can be either a Javascript date object with a valid time value or a string
     * time in a valid format -- see {@link #format} and {@link #altFormats} (defaults to undefined).
     */

    /**
     * @cfg {Date/String} maxValue
     * The maximum allowed time. Can be either a Javascript date object with a valid time value or a string
     * time in a valid format -- see {@link #format} and {@link #altFormats} (defaults to undefined).
     */

    /**
     * @cfg {String} minText
     * The error text to display when the entered time is before {@link #minValue} (defaults to
     * 'The time in this field must be equal to or after {0}').
     */
    minText : "The time in this field must be equal to or after {0}",

    /**
     * @cfg {String} maxText
     * The error text to display when the entered time is after {@link #maxValue} (defaults to
     * 'The time in this field must be equal to or before {0}').
     */
    maxText : "The time in this field must be equal to or before {0}",

    /**
     * @cfg {String} invalidText
     * The error text to display when the time in the field is invalid (defaults to
     * '{value} is not a valid time').
     */
    invalidText : "{0} is not a valid time",

    /**
     * @cfg {String} format
     * The default time format string which can be overriden for localization support.  The format must be
     * valid according to {@link Date#parseDate} (defaults to 'g:i A', e.g., '3:15 PM').  For 24-hour time
     * format try 'H:i' instead.
     */
    format : "g:i A",
    
    /**
     * @cfg {String} submitFormat The date format string which will be submitted to the server.  
     * The format must be valid according to {@link Ext.util.Date#parseDate} (defaults to <tt>{@link #format}</tt>).
     */

    /**
     * @cfg {String} altFormats
     * Multiple date formats separated by "|" to try when parsing a user input value and it doesn't match the defined
     * format (defaults to 'g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H|gi a|hi a|giA|hiA|gi A|hi A').
     */
    altFormats : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H|gi a|hi a|giA|hiA|gi A|hi A",

    /**
     * @cfg {Number} increment
     * The number of minutes between each time value in the list (defaults to 15).
     */
    increment: 15,

    /**
     * @cfg {Number} pickerMaxHeight
     * The maximum height of the {@link Ext.picker.Time} dropdown. Defaults to 300.
     */
    pickerMaxHeight: 300,

    /**
     * @cfg {Boolean} selectOnTab
     * Whether the Tab key should select the currently highlighted item. Defaults to <tt>true</tt>.
     */
    selectOnTab: true,

    /**
     * @private
     * This is the date to use when generating time values in the absence of either minValue
     * or maxValue.  Using the current date causes DST issues on DST boundary dates, so this is an
     * arbitrary "safe" date that can be any date aside from DST boundary dates.
     */
    initDate: '1/1/2008',
    initDateFormat: 'j/n/Y',


    initComponent: function() {
        var me = this,
            min = me.minValue,
            max = me.maxValue;
        if (min) {
            me.setMinValue(min);
        }
        if (max) {
            me.setMaxValue(max);
        }
        Ext.form.Time.superclass.initComponent.call(me);
    },

    /**
     * Replaces any existing {@link #minValue} with the new time and refreshes the picker's range.
     * @param {Date/String} value The minimum time that can be selected
     */
    setMinValue: function(value) {
        var me = this,
            picker = me.picker;
        me.setLimit(value, true);
        if (picker) {
            picker.setMinValue(me.minValue);
        }
    },

    /**
     * Replaces any existing {@link #maxValue} with the new time and refreshes the picker's range.
     * @param {Date/String} value The maximum time that can be selected
     */
    setMaxValue: function(value) {
        var me = this,
            picker = me.picker;
        me.setLimit(value, false);
        if (picker) {
            picker.setMaxValue(me.maxValue);
        }
    },

    /**
     * @private
     * Updates either the min or max value. Converts the user's value into a Date object whose
     * year/month/day is set to the {@link #initDate} so that only the time fields are significant.
     */
    setLimit: function(value, isMin) {
        var me = this,
            d, val;
        if (Ext.isString(value)) {
            d = me.parseDate(value);
        }
        else if (Ext.isDate(value)) {
            d = value;
        }
        if (d) {
            val = Ext.Date.clearTime(new Date(me.initDate));
            val.setHours(d.getHours(), d.getMinutes(), d.getSeconds(), d.getMilliseconds());
            me[isMin ? 'minValue' : 'maxValue'] = val;
        }
    },

    rawToValue: function(rawValue) {
        return this.parseDate(rawValue) || null;
    },

    valueToRaw: function(value) {
        return this.formatDate(this.parseDate(value));
    },

    /**
     * Runs all of Time's validations and returns an array of any errors. Note that this first
     * runs Text's validations, so the returned array is an amalgamation of all field errors.
     * The additional validation checks are testing that the time format is valid, that the chosen
     * time is within the {@link #minValue} and {@link #maxValue} constraints set.
     * @param {Mixed} value The value to get errors for (defaults to the current field value)
     * @return {Array} All validation errors for this field
     */
    getErrors: function(value) {
        var me = this,
            format = Ext.String.format,
            errors = Ext.form.Time.superclass.getErrors.apply(me, arguments),
            minValue = me.minValue,
            maxValue = me.maxValue,
            date;

        value = me.formatDate(value || me.processRawValue(me.getRawValue()));

        if (value === null || value.length < 1) { // if it's blank and textfield didn't flag it then it's valid
             return errors;
        }

        date = me.parseDate(value);
        if (!date) {
            errors.push(format(me.invalidText, value, me.format));
            return errors;
        }

        if (minValue && date < minValue) {
            errors.push(format(me.minText, me.formatDate(minValue)));
        }

        if (maxValue && date > maxValue) {
            errors.push(format(me.maxText, me.formatDate(maxValue)));
        }

        return errors;
    },

    formatDate: function() {
        return Ext.form.Date.prototype.formatDate.apply(this, arguments);
    },

    /**
     * @private
     * Parses an input value into a valid Date object.
     * @param {String/Date} value
     */
    parseDate: function(value) {
        if (!value || Ext.isDate(value)) {
            return value;
        }

        var me = this,
            val = me.safeParse(value, me.format),
            altFormats = me.altFormats,
            altFormatsArray = me.altFormatsArray,
            i = 0,
            len;

        if (!val && altFormats) {
            altFormatsArray = altFormatsArray || altFormats.split('|');
            len = altFormatsArray.length;
            for (; i < len && !val; ++i) {
                val = me.safeParse(value, altFormatsArray[i]);
            }
        }
        return val;
    },
    
    safeParse: function(value, format){
        var me = this,
            utilDate = Ext.util.Date,
            parsedDate,
            result = null;
            
        if (utilDate.formatContainsDateInfo(format)) {
            // assume we've been given a full date
            result = utilDate.parseDate(value, format);
        } else {
            // Use our initial safe date
            parsedDate = utilDate.parseDate(me.initDate + ' ' + value, me.initDateFormat + ' ' + format);
            if (parsedDate) {
                result = parsedDate;
            }
        }
        return result;
    },
    
    // @private
    getSubmitValue: function() {
        var me = this,
            format = me.submitFormat || me.format,
            value = me.getValue(),
            submitValue = value ? Ext.Date.format(value, format) : null;
            
        return (me.disabled || !me.submitValue) ? null : submitValue;
    },

    /**
     * @private
     * Creates the {@link Ext.picker.Time}
     */
    createPicker: function() {
        var me = this,
            picker = new Ext.picker.Time({
                selModel: {
                    mode: 'SINGLE'
                },
                floating: true,
                hidden: true,
                minValue: me.minValue,
                maxValue: me.maxValue,
                increment: me.increment,
                format: me.format,
                ownerCt: this.ownerCt,
                renderTo: document.body,
                maxHeight: me.pickerMaxHeight
            });

        me.mon(picker.getSelectionModel(), {
            selectionchange: me.onListSelect,
            scope: me
        });

        return picker;
    },

    /**
     * @private
     * Enables the key nav for the Time picker when it is expanded.
     * TODO this is exactly the same logic as ComboBox, should factor out.
     */
    onExpand: function() {
        var me = this,
            keyNav = me.pickerKeyNav,
            picker = me.getPicker(),
            lastSelected = picker.getSelectionModel().lastSelected,
            itemNode;

        if (!keyNav) {
            keyNav = me.pickerKeyNav = new Ext.view.BoundListKeyNav(this.inputEl, {
                boundList: picker,
                selectOnTab: me.selectOnTab,
                forceKeyDown: true
            });
        }
        Ext.defer(keyNav.enable, 1, keyNav); //wait a bit so it doesn't react to the down arrow opening the picker

        // Highlight the last selected item and scroll it into view
        if (lastSelected) {
            itemNode = picker.getNode(lastSelected);
            if (itemNode) {
                picker.highlightItem(itemNode);
                picker.el.scrollChildIntoView(itemNode, false);
            }
        }
    },

    /**
     * @private
     * Disables the key nav for the Time picker when it is collapsed.
     */
    onCollapse: function() {
        var keyNav = this.pickerKeyNav;
        if (keyNav) {
            keyNav.disable();
        }
    },

    /**
     * @private
     * Handles a time being selected from the Time picker.
     */
    onListSelect: function(list, recordArray) {
        var me = this,
            record = recordArray[0],
            val = record ? record.get('date') : null;
        me.setValue(val);
        me.fireEvent('select', me, val);
        me.picker.clearHighlight();
        me.collapse();
        me.inputEl.focus();
    }
});

