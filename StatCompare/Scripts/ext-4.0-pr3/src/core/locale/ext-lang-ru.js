﻿/*
 * Russian translation
 * By ZooKeeper (utf-8 encoding)
 * 6 November 2007
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Идет загрузка...</div>';

if(Ext.View){
  Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
  Ext.grid.GridPanel.prototype.ddText = "{0} выбранных строк";
}

if(Ext.TabPanelItem){
  Ext.TabPanelItem.prototype.closeText = "Закрыть эту вкладку";
}

if(Ext.form.BaseField){
  Ext.form.BaseField.prototype.invalidText = "Значение в этом поле неверное";
}

if(Ext.LoadMask){
  Ext.LoadMask.prototype.msg = "Загрузка...";
}

Ext.Date.monthNames = [
    "Январь",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июнь",
    "Июль",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабрь"
];

Ext.Date.shortMonthNames = [
  "Янв",
  "Февр",
  "Март",
  "Апр",
  "Май",
  "Июнь",
  "Июль",
  "Авг",
  "Сент",
  "Окт",
  "Нояб",
  "Дек"
];

Ext.Date.getShortMonthName = function(month) {
  return Ext.Date.shortMonthNames[month];
};

Ext.Date.monthNumbers = {
  'Янв': 0,
  'Фев': 1,
  'Мар': 2,
  'Апр': 3,
  'Май': 4,
  'Июн': 5,
  'Июл': 6,
  'Авг': 7,
  'Сен': 8,
  'Окт': 9,
  'Ноя': 10,
  'Дек': 11
};

Ext.Date.getMonthNumber = function(name) {
  return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};

Ext.Date.dayNames = [
  "Воскресенье",
  "Понедельник",
  "Вторник",
  "Среда",
  "Четверг",
  "Пятница",
  "Суббота"
];

Ext.Date.getShortDayName = function(day) {
  return Ext.Date.dayNames[day].substring(0, 3);
};

if(Ext.MessageBox){
  Ext.MessageBox.buttonText = {
    ok     : "OK",
    cancel : "Отмена",
    yes    : "Да",
    no     : "Нет"
  };
}

if(Ext.util.Format){
    Ext.apply(Ext.util.Format, {
        thousandSeparator: '.',
        decimalSeparator: ',',
        currencySign: '\u0440\u0443\u0431',  // Russian Ruble
        dateFormat: 'd.m.Y'
    });
}

if(Ext.picker.Date){
  Ext.apply(Ext.DatePicker.prototype, {
    todayText          : "Сегодня",
    minText            : "Эта дата раньше минимальной даты",
    maxText            : "Эта дата позже максимальной даты",
    disabledDaysText   : "",
    disabledDatesText  : "",
    monthNames         : Ext.Date.monthNames,
    dayNames           : Ext.Date.dayNames,
    nextText           : 'Следующий месяц (Control+Вправо)',
    prevText           : 'Предыдущий месяц (Control+Влево)',
    monthYearText      : 'Выбор месяца (Control+Вверх/Вниз для выбора года)',
    todayTip           : "{0} (Пробел)",
    format             : "d.m.y",
    okText             : "&#160;OK&#160;",
    cancelText         : "Отмена",
    startDay           : 1
  });
}

if(Ext.toolbar.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "Страница",
    afterPageText  : "из {0}",
    firstText      : "Первая страница",
    prevText       : "Предыдущая страница",
    nextText       : "Следующая страница",
    lastText       : "Последняя страница",
    refreshText    : "Обновить",
    displayMsg     : "Отображаются записи с {0} по {1}, всего {2}",
    emptyMsg       : 'Нет данных для отображения'
  });
}

if(Ext.form.Text){
  Ext.apply(Ext.form.Text.prototype, {
    minLengthText : "Минимальная длина этого поля {0}",
    maxLengthText : "Максимальная длина этого поля {0}",
    blankText     : "Это поле обязательно для заполнения",
    regexText     : "",
    emptyText     : null
  });
}

if(Ext.form.Number){
  Ext.apply(Ext.form.Number.prototype, {
    minText : "Значение этого поля не может быть меньше {0}",
    maxText : "Значение этого поля не может быть больше {0}",
    nanText : "{0} не является числом"
  });
}

if(Ext.form.Date){
  Ext.apply(Ext.form.Date.prototype, {
    disabledDaysText  : "Не доступно",
    disabledDatesText : "Не доступно",
    minText           : "Дата в этом поле должна быть позде {0}",
    maxText           : "Дата в этом поле должна быть раньше {0}",
    invalidText       : "{0} не является правильной датой - дата должна быть указана в формате {1}",
    format            : "d.m.y",
    altFormats        : "d.m.y|d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "Загрузка...",
    valueNotFoundText : undefined
  });
}

if(Ext.form.VTypes){
  Ext.apply(Ext.form.VTypes, {
    emailText     : 'Это поле должно содержать адрес электронной почты в формате "user@example.com"',
    urlText       : 'Это поле должно содержать URL в формате "http:/'+'/www.example.com"',
    alphaText     : 'Это поле должно содержать только латинские буквы и символ подчеркивания "_"',
    alphanumText  : 'Это поле должно содержать только латинские буквы, цифры и символ подчеркивания "_"'
  });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : 'Пожалуйста введите адрес:',
    buttonTips : {
      bold : {
        title: 'Полужирный (Ctrl+B)',
        text: 'Применение полужирного начертания к выделенному тексту.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      italic : {
        title: 'Курсив (Ctrl+I)',
        text: 'Применение курсивного начертания к выделенному тексту.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      underline : {
        title: 'Подчёркнутый (Ctrl+U)',
        text: 'Подчёркивание выделенного текста.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      increasefontsize : {
        title: 'Увеличить размер',
        text: 'Увеличение размера шрифта.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      decreasefontsize : {
        title: 'Уменьшить размер',
        text: 'Уменьшение размера шрифта.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      backcolor : {
        title: 'Заливка',
        text: 'Изменение цвета фона для выделенного текста или абзаца.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      forecolor : {
        title: 'Цвет текста',
        text: 'Измение цвета текста.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      justifyleft : {
        title: 'Выровнять текст по левому краю',
        text: 'Выровнивание текста по левому краю.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      justifycenter : {
        title: 'По центру',
        text: 'Выровнивание текста по центру.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      justifyright : {
        title: 'Выровнять текст по правому краю',
        text: 'Выровнивание текста по правому краю.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      insertunorderedlist : {
        title: 'Маркеры',
        text: 'Начать маркированный список.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      insertorderedlist : {
        title: 'Нумерация',
        text: 'Начать нумернованный список.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      createlink : {
        title: 'Вставить гиперссылку',
        text: 'Создание ссылки из выделенного текста.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      sourceedit : {
        title: 'Исходный код',
        text: 'Переключиться на исходный код.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      }
    }
  });
}

if(Ext.form.Basic){
  Ext.form.Basic.prototype.waitTitle = "Пожалуйста подождите...";
}

if(Ext.grid.GridView){
  Ext.apply(Ext.grid.GridView.prototype, {
    sortAscText  : "Сортировать по возрастанию",
    sortDescText : "Сортировать по убыванию",
    lockText     : "Закрепить столбец",
    unlockText   : "Снять закрепление столбца",
    columnsText  : "Столбцы"
  });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(Пусто)',
    groupByText    : 'Группировать по этому полю',
    showGroupsText : 'Отображать по группам'
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "Название",
    valueText  : "Значение",
    dateFormat : "d.m.Y"
  });
}

if(Ext.SplitLayoutRegion){
  Ext.apply(Ext.SplitLayoutRegion.prototype, {
    splitTip            : "Тяните для изменения размера.",
    collapsibleSplitTip : "Тяните для изменения размера. Двойной щелчок спрячет панель."
  });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
  Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
    splitTip            : "Тяните для изменения размера.",
    collapsibleSplitTip : "Тяните для изменения размера. Двойной щелчок спрячет панель."
  });
}
