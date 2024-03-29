/**
 * Hebrew Translations
 * By spartacus (from forums) 06-12-2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">...����</div>';

if(Ext.View){
  Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
  Ext.grid.GridPanel.prototype.ddText = "����� ������ {0}";
}

if(Ext.TabPanelItem){
  Ext.TabPanelItem.prototype.closeText = "���� ������";
}

if(Ext.form.BaseField){
  Ext.form.BaseField.prototype.invalidText = "���� ���� �� ����";
}

if(Ext.LoadMask){
  Ext.LoadMask.prototype.msg = "...����";
}

Ext.Date.monthNames = [
  "�����",
  "������",
  "���",
  "�����",
  "���",
  "����",
  "����",
  "������",
  "������",
  "�������",
  "������",
  "�����"
];

Ext.Date.getShortMonthName = function(month) {
  return Ext.Date.monthNames[month].substring(0, 3);
};

Ext.Date.monthNumbers = {
  Jan : 0,
  Feb : 1,
  Mar : 2,
  Apr : 3,
  May : 4,
  Jun : 5,
  Jul : 6,
  Aug : 7,
  Sep : 8,
  Oct : 9,
  Nov : 10,
  Dec : 11
};

Ext.Date.getMonthNumber = function(name) {
  return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};

Ext.Date.dayNames = [
  "�",
  "�",
  "�",
  "�",
  "�",
  "�",
  "�"
];

Ext.Date.getShortDayName = function(day) {
  return Ext.Date.dayNames[day].substring(0, 3);
};

if(Ext.MessageBox){
  Ext.MessageBox.buttonText = {
    ok     : "�����",
    cancel : "�����",
    yes    : "��",
    no     : "��"
  };
}

if(Ext.util.Format){
    Ext.apply(Ext.util.Format, {
        thousandSeparator: '.',
        decimalSeparator: ',',
        currencySign: '\u20aa',  // Iraeli Shekel
        dateFormat: 'd/m/Y'
    });
}

if(Ext.picker.Date){
  Ext.apply(Ext.DatePicker.prototype, {
    todayText         : "����",
    minText           : ".����� �� �� ���� ������ ������� �����",
    maxText           : ".����� �� �� ���� ������ ����� �����",
    disabledDaysText  : "",
    disabledDatesText : "",
    monthNames        : Ext.Date.monthNames,
    dayNames          : Ext.Date.dayNames,
    nextText          : '(Control+Right) ����� ���',
    prevText          : '(Control+Left) ����� �����',
    monthYearText     : '(������ ��� Control+Up/Down) ��� ����',
    todayTip          : "��� ����) {0})",
    format            : "d/m/Y",
    okText            : "&#160;�����&#160;",
    cancelText        : "�����",
    startDay          : 0
  });
}

if(Ext.toolbar.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "����",
    afterPageText  : "{0} ����",
    firstText      : "���� �����",
    prevText       : "���� ����",
    nextText       : "���� ���",
    lastText       : "���� �����",
    refreshText    : "����",
    displayMsg     : "���� {0} - {1} ���� {2}",
    emptyMsg       : '��� ���� �����'
  });
}

if(Ext.form.Text){
  Ext.apply(Ext.form.Text.prototype, {
    minLengthText : "{0} ����� ��������� ���� �� ���",
    maxLengthText : "{0} ����� ������ ���� �� ���",
    blankText     : "��� �� �����",
    regexText     : "",
    emptyText     : null
  });
}

if(Ext.form.Number){
  Ext.apply(Ext.form.Number.prototype, {
    minText : "{0} ���� ��������� ���� �� ���",
    maxText : "{0} ���� ������ ���� �� ���",
    nanText : "��� �� ���� {0}"
  });
}

if(Ext.form.Date){
  Ext.apply(Ext.form.Date.prototype, {
    disabledDaysText  : "������",
    disabledDatesText : "������",
    minText           : "{0} ������ ���� �� ���� ����� ����",
    maxText           : "{0} ������ ���� �� ���� ����� ����",
    invalidText       : "{1} ��� �� ����� ���� - ���� ����� ������ {0}",
    format            : "m/d/y",
    altFormats        : "m/d/Y|m-d-y|m-d-Y|m/d|m-d|md|mdy|mdY|d|Y-m-d"
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "...����",
    valueNotFoundText : undefined
  });
}

if(Ext.form.VTypes){
  Ext.apply(Ext.form.VTypes, {
    emailText    : '"user@example.com" ��� �� ���� ����� ����� ���� �������� ������',
    urlText      : '"http:/'+'/www.example.com" ��� �� ���� ����� ����� ������� ������',
    alphaText    : '_��� �� ���� ����� �� ������ �',
    alphanumText : '_��� �� ���� ����� �� ������, ������ �'
  });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : ':��� ���� �� ����� �������� ���� ������',
    buttonTips : {
      bold : {
        title: '(Ctrl+B) �����',
        text: '.���� �� ����� �����',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      italic : {
        title: '(Ctrl+I) ����',
        text: '.��� �� ����� �����',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      underline : {
        title: '(Ctrl+U) �� ����',
        text: '.���� �� ���� ���� ����� �����',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      increasefontsize : {
        title: '���� ����',
        text: '.���� ���� ���� ����� �����',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      decreasefontsize : {
        title: '���� ����',
        text: '.���� ���� ���� ����� �����',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      backcolor : {
        title: '��� ��� �����',
        text: '.��� �� ��� ���� ���� ����� �����',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      forecolor : {
        title: '��� ����',
        text: '.��� �� ��� ����� ���� ����� �����',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      justifyleft : {
        title: '���� �����',
        text: '.��� ����� �� ����� �����',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      justifycenter : {
        title: '���� �����',
        text: '.��� ����� �� ����� �����',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      justifyright : {
        title: '���� �����',
        text: '.��� ����� �� ����� �����',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      insertunorderedlist : {
        title: '����� ������',
        text: '.���� ����� ������',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      insertorderedlist : {
        title: '����� �������',
        text: '.���� ����� �������',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      createlink : {
        title: '�����',
        text: '.���� �� ����� ����� ������',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      sourceedit : {
        title: '����� ��� ����',
        text: '.��� ��� ����',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      }
    }
  });
}

if(Ext.grid.GridView){
  Ext.apply(Ext.grid.GridView.prototype, {
    sortAscText  : "���� ���� ����",
    sortDescText : "���� ���� ����",
    lockText     : "��� �����",
    unlockText   : "���� �����",
    columnsText  : "������"
  });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(���)',
    groupByText    : '��� ������� ��� ��� ��',
    showGroupsText : '��� �������'
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "��",
    valueText  : "���",
    dateFormat : "m/j/Y"
  });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
  Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
    splitTip            : ".���� ������ ����",
    collapsibleSplitTip : ".���� ������ ����. ����� ����� ������"
  });
}
