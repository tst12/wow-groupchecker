/**
 * @class Ext.form.BaseField
 * @extends Ext.Component
 * <p>Base class for form fields that provides default event handling, rendering, and other common functionality
 * needed by all form field types. Utilizes the {@link Ext.form.Field} mixin for value handling and validation,
 * and the {@link Ext.form.Labelable} mixin to provide label and error message display.</p>
 * <p>In most cases you will want to use a subclass, such as {@link Ext.form.Text} or {@link Ext.form.Checkbox},
 * rather than using this class directly.</p>
 * 
 * @constructor
 * Creates a new Field
 * @param {Object} config Configuration options
 *
 * @xtype field
 */
Ext.define('Ext.form.BaseField', {
    extend: 'Ext.Component',
    mixins: {
        labelable: 'Ext.form.Labelable',
        field: 'Ext.form.Field'
    },
    alias: 'widget.field',
    requires: ['Ext.util.DelayedTask', 'Ext.XTemplate', 'Ext.layout.component.form.Field'],

    /**
     * @cfg {String} name The name of the field (defaults to undefined). This is used as the parameter
     * name when including the field value in a {@link Ext.form.Basic#submit form submit()}. If no name is
     * configured, it falls back to the {@link #inputId}. To prevent the field from being included in the
     * form submit, set {@link #submitValue} to <tt>false</tt>.
     */

    /**
     * @cfg {String} inputType
     * <p>The type attribute for input fields -- e.g. radio, text, password, file (defaults to <tt>'text'</tt>).
     * The extended types supported by HTML5 inputs (url, email, etc.) may also be used, though using them
     * will cause older browsers to fall back to 'text'.</p>
     * <p>The types 'file' and 'password' must be used to render those field types currently -- there are
     * no separate Ext components for those.</p>
     */
    inputType: 'text',

    /**
     * @cfg {Number} tabIndex The tabIndex for this field. Note this only applies to fields that are rendered,
     * not those which are built via applyTo (defaults to undefined).
     */

    /**
     * @cfg {String} invalidText The error text to use when marking a field invalid and no message is provided
     * (defaults to 'The value in this field is invalid')
     */
    invalidText : 'The value in this field is invalid',

    /**
     * @cfg {String} fieldCls The default CSS class for the field input (defaults to 'x-form-field')
     */
    fieldCls : Ext.baseCSSPrefix + 'form-field',

    /**
     * @cfg {String} focusCls The CSS class to use when the field receives focus (defaults to 'x-form-focus')
     */
    focusCls : Ext.baseCSSPrefix + 'form-focus',

    /**
     * @cfg {String} dirtyCls The CSS class to use when the field value {@link #isDirty is dirty}.
     */
    dirtyCls : Ext.baseCSSPrefix + 'form-dirty',

    /**
     * @cfg {Array} checkChangeEvents
     * <p>A list of event names that will be listened for on the field's {@link #inputEl input element}, which
     * will cause the field's value to be checked for changes. If a change is detected, the
     * {@link #change change event} will be fired, followed by validation if the {@link #validateOnChange}
     * option is enabled.</p>
     * <p>Defaults to <tt>['change', 'propertychange']</tt> in Internet Explorer, and <tt>['change', 'input',
     * 'textInput', 'keyup', 'dragdrop']</tt> in other browsers. This catches all the ways that field values
     * can be changed in most supported browsers; the only known exceptions at the time of writing are:</p>
     * <ul>
     * <li>Safari 3.2 and older: cut/paste in textareas via the context menu, and dragging text into textareas</li>
     * <li>Opera 10 and 11: dragging text into text fields and textareas, and cut via the context menu in text
     * fields and textareas</li>
     * <li>Opera 9: Same as Opera 10 and 11, plus paste from context menu in text fields and textareas</li>
     * </ul>
     * <p>If you need to guarantee on-the-fly change notifications including these edge cases, you can call the
     * {@link #checkChange} method on a repeating interval, e.g. using {@link Ext.TaskMgr}, or if the field is
     * within a {@link Ext.form.FormPanel}, you can use the FormPanel's {@link Ext.form.FormPanel#pollForChanges}
     * configuration to set up such a task automatically.</p>
     */
    checkChangeEvents: Ext.isIE ? ['change', 'propertychange'] :
                                  ['change', 'input', 'textInput', 'keyup', 'dragdrop'],

    /**
     * @cfg {Number} checkChangeBuffer
     * Defines a timeout in milliseconds for buffering {@link #checkChangeEvents} that fire in rapid succession.
     * Defaults to 50 milliseconds.
     */
    checkChangeBuffer: 50,

    componentLayout: 'field',

    /**
     * @cfg {Boolean} readOnly <tt>true</tt> to mark the field as readOnly in HTML
     * (defaults to <tt>false</tt>).
     * <br><p><b>Note</b>: this only sets the element's readOnly DOM attribute.
     * Setting <code>readOnly=true</code>, for example, will not disable triggering a
     * ComboBox or Date; it gives you the option of forcing the user to choose
     * via the trigger without typing in the text box. To hide the trigger use
     * <code>{@link Ext.form.Trigger#hideTrigger hideTrigger}</code>.</p>
     */
    readOnly : false,

    /**
     * @cfg {String} inputId
     * The id that will be given to the generated input DOM element. Defaults to an automatically generated id.
     * If you configure this manually, you must make sure it is unique in the document.
     */

    // private
    hasFocus : false,

    // private
    initComponent : function() {
        var me = this;

        me.callParent();

        me.subTplData = me.subTplData || {};

        me.addEvents(
            /**
             * @event focus
             * Fires when this field receives input focus.
             * @param {Ext.form.BaseField} this
             */
            'focus',
            /**
             * @event blur
             * Fires when this field loses input focus.
             * @param {Ext.form.BaseField} this
             */
            'blur',
            /**
             * @event specialkey
             * Fires when any key related to navigation (arrows, tab, enter, esc, etc.) is pressed.
             * To handle other keys see {@link Ext.panel.Panel#keys} or {@link Ext.util.KeyMap}.
             * You can check {@link Ext.EventObject#getKey} to determine which key was pressed.
             * For example: <pre><code>
var form = new Ext.form.FormPanel({
    ...
    items: [{
            fieldLabel: 'Field 1',
            name: 'field1',
            allowBlank: false
        },{
            fieldLabel: 'Field 2',
            name: 'field2',
            listeners: {
                specialkey: function(field, e){
                    // e.HOME, e.END, e.PAGE_UP, e.PAGE_DOWN,
                    // e.TAB, e.ESC, arrow keys: e.LEFT, e.RIGHT, e.UP, e.DOWN
                    if (e.{@link Ext.EventObject#getKey getKey()} == e.ENTER) {
                        var form = field.up('form').getForm();
                        form.submit();
                    }
                }
            }
        }
    ],
    ...
});
             * </code></pre>
             * @param {Ext.form.BaseField} this
             * @param {Ext.EventObject} e The event object
             */
            'specialkey'
        );

        // Init mixins
        me.initLabelable();
        me.initField();

        // Default name to inputId
        if (!me.name) {
            me.name = me.getInputId();
        }
    },

    /**
     * Returns the input id for this field. If none was specified via the {@link #inputId} config,
     * then an id will be automatically generated.
     */
    getInputId: function() {
        return this.inputId || (this.inputId = Ext.id());
    },

    getSubTplData: function() {
        var me = this,
            type = me.inputType,
            inputId = me.getInputId();

        return Ext.applyIf(me.subTplData, {
            id: inputId,
            name: me.name || inputId,
            type: type,
            size: me.size || 20,
            cls: me.cls,
            fieldCls: me.fieldCls,
            tabIdx: me.tabIndex,
            typeCls: Ext.baseCSSPrefix + 'form-' + (type === 'password' ? 'text' : type)
        });
    },

    /**
     * @protected
     * Gets the markup to be inserted into the outer template's bodyEl. For fields this is the
     * actual input element.
     */
    getSubTplMarkup: function() {
        return this.fieldSubTpl.apply(this.getSubTplData());
    },
    
    initRenderTpl: function() {
        var me = this;
        if (!me.hasOwnProperty('renderTpl')) {
            me.renderTpl = me.labelableRenderTpl;
        }
        return me.callParent();
    },

    initRenderData: function() {
        return Ext.applyIf(this.callParent(), this.getLabelableRenderData());
    },

    // private
    onRender : function() {
        var me = this,
            renderSelectors = me.renderSelectors;

        Ext.applyIf(renderSelectors, me.getLabelableSelectors());

        Ext.applyIf(renderSelectors, {
            /**
             * @property inputEl
             * @type Ext.core.Element
             * The input Element for this Field. Only available after the field has been rendered.
             */
            inputEl: '.' + me.fieldCls
        });

        me.callParent(arguments);

        // Make the stored rawValue get set as the input element's value
        me.setRawValue(me.rawValue);

        if (me.readOnly) {
            me.setReadOnly(true);
        }
        if (me.disabled) {
            me.disable();
        }

        me.renderActiveError();
    },

    initAria: function() {
        var me = this;
        me.callParent();

        // Associate the field to the error message element
        me.getActionEl().dom.setAttribute('aria-describedby', Ext.id(me.errorEl));
    },

    getFocusEl: function() {
        return this.inputEl;
    },

    // private override to use getSubmitValue() as a convenience
    getSubmitData: function() {
        var me = this,
            data = null,
            val;
        if (!me.disabled && me.submitValue && me.inputType !== 'file') {
            data = {};
            val = me.getSubmitValue();
            if (val !== null) {
                data[me.getName()] = me.getSubmitValue();
            }
        }
        return data;
    },

    /**
     * <p>Returns the value that would be included in a standard form submit for this field. This will be combined
     * with the field's name to form a <tt>name=value</tt> pair in the {@link #getSubmitData submitted parameters}.
     * If an empty string is returned then just the <tt>name=</tt> will be submitted; if <tt>null</tt> is returned
     * then nothing will be submitted.</p>
     * <p>Note that the value returned will have been {@link #processRawValue processed} but may or may not have
     * been successfully {@link #validate validated}.</p>
     * @return {String} The value to be submitted, or <tt>null</tt>.
     */
    getSubmitValue: function() {
        return this.processRawValue(this.getRawValue());
    },

    /**
     * Returns the raw value of the field, without performing any normalization, conversion, or validation.
     * To get a normalized and converted value see {@link #getValue}.
     * @return {String} value The raw String value of the field
     */
    getRawValue: function() {
        var me = this,
            v = (me.inputEl ? me.inputEl.getValue() : Ext.value(me.rawValue, ''));
        me.rawValue = v;
        return v;
    },

    /**
     * Sets the field's raw value directly, bypassing {@link #valueToRaw value conversion}, change detection, and
     * validation. To set the value with these additional inspections see {@link #setValue}.
     * @param {Mixed} value The value to set
     * @return {Mixed} value The field value that is set
     */
    setRawValue: function(value) {
        var me = this;
        value = Ext.value(value, '');
        me.rawValue = value;

        // Some Field subclasses may not render an inputEl
        if (me.inputEl) {
            me.inputEl.dom.value = value;
        }
        return value;
    },

    /**
     * <p>Converts a mixed-type value to a raw representation suitable for displaying in the field. This allows
     * controlling how value objects passed to {@link #setValue} are shown to the user, including localization.
     * For instance, for a {@link Ext.form.Date}, this would control how a Date object passed to {@link #setValue}
     * would be converted to a String for display in the field.</p>
     * <p>See {@link #rawToValue} for the opposite conversion.</p>
     * <p>The base implementation simply does a standard toString conversion, and converts
     * {@link Ext#isEmpty empty values} to an empty string.</p>
     * @param {Mixed} value The mixed-type value to convert to the raw representation.
     * @return {Mixed} The converted raw value.
     */
    valueToRaw: function(value) {
        return '' + Ext.value(value, '');
    },

    /**
     * <p>Converts a raw input field value into a mixed-type value that is suitable for this particular field type.
     * This allows controlling the normalization and conversion of user-entered values into field-type-appropriate
     * values, e.g. a Date object for {@link Ext.form.Date}, and is invoked by {@link #getValue}.</p>
     * <p>It is up to individual implementations to decide how to handle raw values that cannot be successfully
     * converted to the desired object type.</p>
     * <p>See {@link #valueToRaw} for the opposite conversion.</p>
     * <p>The base implementation does no conversion, returning the raw value untouched.</p>
     * @param {Mixed} rawValue
     * @return {Mixed} The converted value.
     */
    rawToValue: function(rawValue) {
        return rawValue;
    },

    /**
     * Performs any necessary manipulation of a raw field value to prepare it for {@link #rawToValue conversion}
     * and/or {@link #validate validation}, for instance stripping out ignored characters. In the base implementation
     * it does nothing; individual subclasses may override this as needed.
     * @param {Mixed} value The unprocessed string value
     * @return {Mixed} The processed string value
     */
    processRawValue: function(value) {
        return value;
    },

    /**
     * Returns the current data value of the field. The type of value returned is particular to the type of the
     * particular field (e.g. a Date object for {@link Ext.form.Date}), as the result of calling {@link #rawToValue} on
     * the field's {@link #processRawValue processed} String value. To return the raw String value, see {@link #getRawValue}.
     * @return {Mixed} value The field value
     */
    getValue: function() {
        var me = this,
            val = me.rawToValue(me.processRawValue(me.getRawValue()));
        me.value = val;
        return val;
    },

    /**
     * Sets a data value into the field and runs the change detection and validation. To set the value directly
     * without these inspections see {@link #setRawValue}.
     * @param {Mixed} value The value to set
     * @return {Ext.form.Field} this
     */
    setValue: function(value) {
        var me = this;
        me.setRawValue(me.valueToRaw(value));
        return me.mixins.field.setValue.call(me, value);
    },


    //private
    onDisable: function() {
        var me = this,
            inputEl = me.inputEl;
        me.callParent();
        if (inputEl) {
            inputEl.dom.disabled = true;
        }
    },

    //private
    onEnable: function() {
        var me = this,
            inputEl = me.inputEl;
        me.callParent();
        if (inputEl) {
            inputEl.dom.disabled = false;
        }
    },

    /**
     * Sets the read only state of this field.
     * @param {Boolean} readOnly Whether the field should be read only.
     */
    setReadOnly: function(readOnly) {
        if (this.inputEl) {
            this.inputEl.dom.readOnly = readOnly;
        }
        this.readOnly = readOnly;
    },

    // private
    fireKey : function(e){
        if(e.isSpecialKey()){
            this.fireEvent('specialkey', this, e);
        }
    },

    // private
    initEvents : function(){
        var me = this,
            inputEl = me.inputEl,
            onChangeTask,
            onChangeEvent;
        if (inputEl) {
            me.mon(inputEl, Ext.EventManager.getKeyEvent(), me.fireKey,  me);
            me.mon(inputEl, 'focus', me.onFocus, me);

            // standardise buffer across all browsers + OS-es for consistent event order.
            // (the 10ms buffer for Editors fixes a weird FF/Win editor issue when changing OS window focus)
            me.mon(inputEl, 'blur', me.onBlur, me, me.inEditor ? {buffer:10} : null);

            // listen for immediate value changes
            onChangeTask = new Ext.util.DelayedTask(me.checkChange, me);
            onChangeEvent = function() {
                onChangeTask.delay(me.checkChangeBuffer);
            };
            Ext.each(me.checkChangeEvents, function(eventName) {
                me.mon(inputEl, eventName, onChangeEvent);
            }, me);
        }
    },

    // private
    preFocus: Ext.emptyFn,

    // private
    onFocus: function() {
        var me = this,
            focusCls = me.focusCls,
            inputEl = me.inputEl;
        me.preFocus();
        if (focusCls && inputEl) {
            inputEl.addCls(focusCls);
        }
        if (!me.hasFocus) {
            me.hasFocus = true;
            me.fireEvent('focus', me);
        }
    },

    // private
    beforeBlur : Ext.emptyFn,

    // private
    onBlur : function(){
        var me = this,
            focusCls = me.focusCls,
            inputEl = me.inputEl;
        me.beforeBlur();
        if (focusCls && inputEl) {
            inputEl.removeCls(focusCls);
        }
        me.hasFocus = false;
        me.fireEvent('blur', me);
        me.postBlur();
    },

    // private
    postBlur : Ext.emptyFn,


    /**
     * @private Called when the field's dirty state changes. Adds/removes the {@link #dirtyCls} on the main element.
     * @param {Boolean} isDirty
     */
    onDirtyChange: function(isDirty) {
        this[isDirty ? 'addCls' : 'removeCls'](this.dirtyCls);
    },


    /**
     * Returns whether or not the field value is currently valid by
     * {@link #getErrors validating} the {@link #processRawValue processed raw value}
     * of the field. <b>Note</b>: {@link #disabled} fields are always treated as valid.
     * @return {Boolean} True if the value is valid, else false
     */
    isValid : function() {
        var me = this;
        return me.disabled || me.validateValue(me.processRawValue(me.getRawValue()));
    },


    /**
     * <p>Uses {@link #getErrors} to build an array of validation errors. If any errors are found, {@link #markInvalid}
     * is called with the first and false is returned, otherwise true is returned.</p>
     * <p>Previously, subclasses were invited to provide an implementation of this to process validations - from 3.2
     * onwards {@link #getErrors} should be overridden instead.</p>
     * @param {Mixed} value The value to validate
     * @return {Boolean} True if all validations passed, false if one or more failed
     */
    validateValue: function(value) {
        var me = this,
            error = me.getErrors(value)[0], //currently we only show 1 error at a time for a field, so just use the first one
            undef,
            isValid = error === undef;

        if (!me.preventMark) {
            if (isValid) {
                me.clearInvalid();
            } else {
                me.markInvalid(error);
            }
        }

        return isValid;
    },

    /**
     * <p>Display an error message associated with this field, using {@link #msgTarget} to determine how to
     * display the message and applying {@link #invalidCls} to the field's UI element.</p>
     * <p><b>Note</b>: this method does not cause the Field's {@link #validate} method to return <code>false</code>
     * if the value does <i>pass</i> validation. So simply marking a Field as invalid will not prevent
     * submission of forms submitted with the {@link Ext.form.action.Submit#clientValidation} option set.</p>
     * {@link #isValid invalid}.
     * @param {String} msg (optional) The validation message (defaults to {@link #invalidText})
     */
    markInvalid : function(msg) {
        // Save the message and fire the 'invalid' event
        var me = this,
            oldMsg = me.getActiveError();
        this.setActiveError(msg);
        if (oldMsg !== msg) {
            this.doComponentLayout();
        }
    },

    /**
     * Clear any invalid styles/messages for this field
     */
    clearInvalid : function() {
        // Clear the message and fire the 'valid' event
        var me = this,
            hadError = me.hasActiveError();
        me.unsetActiveError();
        if (hadError) {
            me.doComponentLayout();
        }
    },

    /**
     * @private Overrides the method from the Ext.form.Labelable mixin to also add the invalidCls to the inputEl,
     * as that is required for proper styling in IE with nested fields (due to lack of child selector)
     */
    renderActiveError: function() {
        var me = this,
            hasError = me.hasActiveError();
        if (me.inputEl) {
            // Add/remove invalid class
            me.inputEl[hasError ? 'addCls' : 'removeCls'](me.invalidCls + '-field');
        }
        me.mixins.labelable.renderActiveError.call(me);
    },


    getActionEl: function() {
        return this.inputEl || this.el;
    }

}, function() {
    this.prototype.fieldSubTpl = new Ext.XTemplate(
        '<input id="{id}" type="{type}" ',
            '<tpl if="name">name="{name}" </tpl>',
            '<tpl if="size">size="{size}" </tpl>',
            '<tpl if="tabIdx">tabIndex="{tabIdx}" </tpl>',
            'class="{fieldCls} {typeCls}" autocomplete="off" />',
        {
            compiled: true,
            disableFormats: true
        }
    );
});
