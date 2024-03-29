/**
 * @class Ext.form.Labelable
 * <p>A mixin which allows a component to be configured and decorated with a label and/or error message
 * like a form field. This is used by {@link Ext.form.BaseField} and {@link Ext.form.FieldContainer}
 * to let them be managed by the field layout.</p>
 * <p>Component classes which use this mixin should use the Field layout
 * or a derivation thereof to properly size and position the label and message according to the component config.
 * They must also call the {@link #initLabelable} method during component initialization to ensure the mixin gets
 * set up correctly.</p>
 */
Ext.define("Ext.form.Labelable", {

    /**
     * @property isFieldLabelable
     * @type Boolean
     * Flag denoting that this object is labelable as a field. Always true.
     */
    isFieldLabelable: true,

    /**
     * @cfg {String} formItemCls
     * A CSS class to be applied to the outermost element to denote that it is participating in the form
     * field layout. Defaults to 'x-form-item'.
     */
    formItemCls: Ext.baseCSSPrefix + 'form-item',

    /**
     * @cfg {String} labelCls
     * The CSS class to be applied to the label element. Defaults to 'x-form-item-label'.
     */
    labelCls: Ext.baseCSSPrefix + 'form-item-label',

    /**
     * @cfg {String} errorMsgCls
     * The CSS class to be applied to the error message element. Defaults to 'x-form-error-msg'.
     */
    errorMsgCls: Ext.baseCSSPrefix + 'form-error-msg',

    /**
     * @cfg {String} baseBodyCls
     * The CSS class to be applied to the body content element. Defaults to 'x-form-item-body'.
     */
    baseBodyCls: Ext.baseCSSPrefix + 'form-item-body',

    /**
     * @cfg {String} fieldBodyCls
     * An extra CSS class to be applied to the body content element in addition to {@link #fieldBodyCls}.
     * Defaults to empty.
     */
    fieldBodyCls: '',

    /**
     * @cfg {String} clearCls
     * The CSS class to be applied to the special clearing div rendered directly after the field
     * contents wrapper to provide field clearing (defaults to <tt>'x-clear'</tt>).
     */
    clearCls: Ext.baseCSSPrefix + 'clear',

    /**
     * @cfg {String} invalidCls
     * The CSS class to use when marking the component invalid (defaults to 'x-form-invalid')
     */
    invalidCls : Ext.baseCSSPrefix + 'form-invalid',

    /**
     * @cfg {String} fieldLabel
     * The label for the field. It gets appended with the {@link #labelSeparator}, and its position
     * and sizing is determined by the {@link #labelAlign}, {@link #labelWidth}, and {@link #labelPad}
     * configs. Defaults to undefined.
     */
    fieldLabel: undefined,

    /**
     * @cfg {String} labelAlign
     * <p>Controls the position and alignment of the {@link #fieldLabel}. Valid values are:</p>
     * <ul>
     * <li><tt>"left"</tt> (the default) - The label is positioned to the left of the field, with its text
     * aligned to the left. Its width is determined by the {@link #labelWidth} config.</li>
     * <li><tt>"top"</tt> - The label is positioned above the field.</li>
     * <li><tt>"right"</tt> - The label is positioned to the left of the field, with its text aligned
     * to the right. Its width is determined by the {@link #labelWidth} config.</li>
     * </ul>
     */
    labelAlign : 'left',

    /**
     * @cfg {Number} labelWidth
     * The width of the {@link #fieldLabel} in pixels. Only applicable if the {@link #labelAlign} is set
     * to "left" or "right". Defaults to <tt>100</tt>.
     */
    labelWidth: 100,

    /**
     * @cfg {Number} labelPad
     * The amount of space in pixels between the {@link #fieldLabel} and the input field. Defaults to <tt>5</tt>.
     */
    labelPad : 5,

    /**
     * @cfg {String} labelSeparator
     * Character(s) to be inserted at the end of the {@link #fieldLabel label text}.
     */
    labelSeparator : ':',

    /**
     * @cfg {String} labelStyle
     * <p>A CSS style specification string to apply directly to this field's label. Defaults to undefined.</p>
     */

    /**
     * @cfg {Boolean} hideLabel
     * <p>Set to <tt>true</tt> to completely hide the label element (label and separator). Defaults to <tt>false</tt>.</p>
     * <p>By default, even if you do not specify a {@link #fieldLabel} the space will still be reserved so that the
     * field will line up with other fields that do have labels. Setting hideLabel to <tt>true</tt> will cause the field
     * to not reserve that space.</p>
     */
    hideLabel: false,

    /**
     * @cfg {Boolean} preventMark
     * <tt>true</tt> to disable displaying any {@link #setActiveError error message} set on this object.
     * Defaults to <tt>false</tt>.
     */
    preventMark: false,

    /**
     * @cfg {Boolean} autoFitErrors
     * Whether to adjust the component's body area to make room for 'side' or 'under'
     * {@link #msgTarget error messages}. Defaults to <tt>true</tt>.
     */
    autoFitErrors: true,

    /**
     * @cfg {String} msgTarget <p>The location where the error message text should display.
     * Must be one of the following values:</p>
     * <div class="mdetail-params"><ul>
     * <li><code>qtip</code> Display a quick tip containing the message when the user hovers over the field. This is the default.
     * <div class="subdesc"><b>{@link Ext.tip.QuickTips#init Ext.tip.QuickTips.init} must have been called for this setting to work.</b></div</li>
     * <li><code>title</code> Display the message in a default browser title attribute popup.</li>
     * <li><code>under</code> Add a block div beneath the field containing the error message.</li>
     * <li><code>side</code> Add an error icon to the right of the field, displaying the message in a popup on hover.</li>
     * <li><code>[element id]</code> Add the error message directly to the innerHTML of the specified element.</li>
     * </ul></div>
     */
    msgTarget: 'qtip',

    /**
     * @cfg {String} activeError
     * If specified, then the component will be displayed with this value as its active error when
     * first rendered. Defaults to undefined. Use {@link #setActiveError} or {@link #unsetActiveError} to
     * change it after component creation.
     */


    /**
     * @cfg {Array/String/Ext.XTemplate} labelableRenderTpl
     * The rendering template for the field decorations. Component classes using this mixin should include
     * logic to use this as their {@link Ext.AbstractComponent#renderTpl renderTpl}.
     */
    labelableRenderTpl: [
        '<tpl if="!hideLabel">',
            '<label<tpl if="inputId"> for="{inputId}"</tpl> class="{labelCls}"<tpl if="labelStyle"> style="{labelStyle}"</tpl>>',
                '<tpl if="fieldLabel">{fieldLabel}{labelSeparator}</tpl>',
            '</label>',
        '</tpl>',
        '<div class="{baseBodyCls} {fieldBodyCls}"<tpl if="inputId"> id="{baseBodyCls}-{inputId}"</tpl> role="presentation">{subTplMarkup}</div>',
        '<div class="{errorMsgCls}"></div>',
        '<div class="{clearCls}" role="presentation"></div>'
    ],


    /**
     * Performs initialization of this mixin. Component classes using this mixin should call this method
     * during their own initialization.
     */
    initLabelable: function() {
        this.addCls(this.formItemCls);

        this.addEvents(
            /**
             * @event errorchange
             * Fires when the active error message is changed via {@link #setActiveError}.
             * @param {Ext.form.Labelable} this
             * @param {String} error The active error message
             */
            'errorchange'
        );
    },

    /**
     * Returns the label for the field. Defaults to simply returning the {@link #fieldLabel} config. Can be
     * overridden to provide 
     * @return {String} The configured field label, or empty string if not defined
     */
    getFieldLabel: function() {
        return this.fieldLabel || '';
    },

    /**
     * @protected
     * Generates the arguments for the field decorations {@link #labelableRenderTpl rendering template}.
     * @return {Object} The template arguments
     */
    getLabelableRenderData: function() {
        var me = this;
        return Ext.copyTo(
            {
                inputId: me.getInputId(),
                fieldLabel: me.getFieldLabel(),
                subTplMarkup: me.getSubTplMarkup()
            },
            me,
            'hideLabel,labelCls,fieldBodyCls,baseBodyCls,errorMsgCls,clearCls,labelStyle,labelSeparator',
            true
        );
    },

    /**
     * @protected
     * Returns the additional {@link Ext.AbstractComponent#renderSelectors} for selecting the field
     * decoration elements from the rendered {@link #labelableRenderTpl}. Component classes using this mixin should
     * be sure and merge this method's result into the component's {@link Ext.AbstractComponent#renderSelectors}
     * before rendering.
     */
    getLabelableSelectors: function() {
        return {
            /**
             * @property labelEl
             * @type Ext.core.Element
             * The label Element for this component. Only available after the component has been rendered.
             */
            labelEl: 'label.' + this.labelCls,

            /**
             * @property bodyEl
             * @type Ext.core.Element
             * The div Element wrapping the component's contents. Only available after the component has been rendered.
             */
            bodyEl: '.' + this.baseBodyCls,

            /**
             * @property errorEl
             * @type Ext.core.Element
             * The div Element that will contain the component's error message(s). Note that depending on the
             * configured {@link #msgTarget}, this element may be hidden in favor of some other form of
             * presentation, but will always be present in the DOM for use by assistive technologies.
             */
            errorEl: '.' + this.errorMsgCls
        };
    },

    /**
     * @protected
     * Gets the markup to be inserted into the outer template's bodyEl. Defaults to empty string, should
     * be implemented by classes including this mixin as needed.
     * @return {String} The markup to be inserted
     */
    getSubTplMarkup: function() {
        return '';
    },

    /**
     * Get the input id, if any, for this component. This is used as the "for" attribute on the label element.
     * Implementing subclasses may also use this as e.g. the id for their own <tt>input</tt> element.
     * @return {String} The input id
     */
    getInputId: function() {
        return '';
    },

    /**
     * Gets the active error message for this component, if any. This does not trigger
     * validation on its own, it merely returns any message that the component may already hold.
     * @return {String} The active error message on the component; if there is no error, an empty string is returned.
     */
    getActiveError : function() {
        return this.activeError || '';
    },

    /**
     * Tells whether the field currently has an active error message. This does not trigger
     * validation on its own, it merely looks for any message that the component may already hold.
     * @return {Boolean}
     */
    hasActiveError: function() {
        return !!this.getActiveError();
    },

    /**
     * Sets the active error message to the given string.
     * @param {String} msg The error message
     */
    setActiveError: function(msg) {
        this.activeError = msg;
        this.renderActiveError();
    },

    /**
     * Clears the active error.
     */
    unsetActiveError: function() {
        delete this.activeError;
        this.renderActiveError();
    },

    /**
     * @private
     * Updates the rendered DOM to match the current activeError. This only updates the content and
     * attributes, you'll have to call doComponentLayout to actually update the display.
     */
    renderActiveError: function() {
        var me = this,
            activeError = me.getActiveError(),
            hasError = !!activeError;

        me.fireEvent('errorchange', me, activeError);

        if (me.rendered && !me.isDestroyed && !me.preventMark) {
            // Add/remove invalid class
            me.el[hasError ? 'addCls' : 'removeCls'](me.invalidCls);

            // Update the aria-invalid attribute
            me.getActionEl().dom.setAttribute('aria-invalid', hasError);

            // Update the errorEl with the error message text
            me.errorEl.dom.innerHTML = activeError;
        }
    },

    /**
     * Applies a set of default configuration values to this Labelable instance. For each of the
     * properties in the given object, check if this component hasOwnProperty that config; if not
     * then it's inheriting a default value from its prototype and we should apply the default value.
     * @param {Object} defaults The defaults to apply to the object.
     */
    applyFieldDefaults: function(defaults) {
        var me = this;
        Ext.iterate(defaults, function(key, val) {
            if (!me.hasOwnProperty(key)) {
                me[key] = val;
            }
        });
    }

});
