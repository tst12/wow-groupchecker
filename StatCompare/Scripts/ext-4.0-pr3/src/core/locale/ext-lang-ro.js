/**
 * Romanian translations for ExtJS 2.1
 * First released by Lucian Lature on 2007-04-24
 * Changed locale for Romania (date formats) as suggested by keypoint
 * on ExtJS forums: http://www.extjs.com/forum/showthread.php?p=129524#post129524
 * Removed some useless parts
 * Changed by: Emil Cazamir, 2008-04-24
 * Fixed some errors left behind
 * Changed by: Emil Cazamir, 2008-09-01
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Încărcare...</div>';

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} rând(uri) selectate";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "Închide acest tab";
}

if(Ext.form.BaseField){
   Ext.form.BaseField.prototype.invalidText = "Valoarea acestui câmp este invalidă";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "Încărcare...";
}

Ext.Date.monthNames = [
   "Ianuarie",
   "Februarie",
   "Martie",
   "Aprilie",
   "Mai",
   "Iunie",
   "Iulie",
   "August",
   "Septembrie",
   "Octombrie",
   "Noiembrie",
   "Decembrie"
];

Ext.Date.getShortMonthName = function(month) {
  return Ext.Date.monthNames[month].substring(0, 3);
};

Ext.Date.monthNumbers = {
  Ian : 0,
  Feb : 1,
  Mar : 2,
  Apr : 3,
  Mai : 4,
  Iun : 5,
  Iul : 6,
  Aug : 7,
  Sep : 8,
  Oct : 9,
  Noi : 10,
  Dec : 11
};

Ext.Date.getMonthNumber = function(name) {
  return Ext.Date.monthNumbers[name.substring(0, 1).toUpperCase() + name.substring(1, 3).toLowerCase()];
};

Ext.Date.dayNames = [
   "Duminică",
   "Luni",
   "Marţi",
   "Miercuri",
   "Joi",
   "Vineri",
   "Sâmbătă"
];

Ext.Date.getShortDayName = function(day) {
  return Ext.Date.dayNames[day].substring(0, 3);
};

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "OK",
      cancel : "Renunţă",
      yes    : "Da",
      no     : "Nu"
   };
}

if(Ext.util.Format){
    Ext.apply(Ext.util.Format, {
        thousandSeparator: '.',
        decimalSeparator: ',',
        currencySign: 'Lei',  // Romanian Lei
        dateFormat: 'd.m.Y'
    });
}

if(Ext.picker.Date){
  Ext.apply(Ext.DatePicker.prototype, {
    todayText         : "Astăzi",
    minText           : "Această dată este anterioară datei minime",
    maxText           : "Această dată este ulterioară datei maxime",
    disabledDaysText  : "",
    disabledDatesText : "",
    monthNames        : Ext.Date.monthNames,
    dayNames          : Ext.Date.dayNames,
    nextText          : 'Luna următoare (Control+Dreapta)',
    prevText          : 'Luna precedentă (Control+Stânga)',
    monthYearText     : 'Alege o lună (Control+Sus/Jos pentru a parcurge anii)',
    todayTip          : "{0} (Bara spațiu)",
    format            : "d.m.Y",
    okText            : "&#160;OK&#160;",
    cancelText        : "Renunță",
    startDay          : 0
  });
}

if(Ext.toolbar.PagingToolbar){
  Ext.apply(Ext.PagingToolbar.prototype, {
    beforePageText : "Pagina",
    afterPageText  : "din {0}",
    firstText      : "Prima pagină",
    prevText       : "Pagina anterioară",
    nextText       : "Pagina următoare",
    lastText       : "Ultima pagină",
    refreshText    : "Împrospătează",
    displayMsg     : "Afișare înregistrările {0} - {1} din {2}",
    emptyMsg       : 'Nu sunt date de afișat'
  });
}

if(Ext.form.Text){
   Ext.apply(Ext.form.Text.prototype, {
      minLengthText : "Lungimea minimă pentru acest câmp este de {0}",
      maxLengthText : "Lungimea maximă pentru acest câmp este {0}",
      blankText     : "Acest câmp este obligatoriu",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.Number){
   Ext.apply(Ext.form.Number.prototype, {
      minText : "Valoarea minimă permisă a acestui câmp este {0}",
      maxText : "Valaorea maximă permisă a acestui câmp este {0}",
      nanText : "{0} nu este un număr valid"
   });
}

if(Ext.form.Date){
  Ext.apply(Ext.form.Date.prototype, {
    disabledDaysText  : "Indisponibil",
    disabledDatesText : "Indisponibil",
    minText           : "Data din această casetă trebuie să fie după {0}",
    maxText           : "Data din această casetă trebuie să fie inainte de {0}",
    invalidText       : "{0} nu este o dată validă, trebuie să fie în formatul {1}",
    format            : "d.m.Y",
    altFormats        : "d-m-Y|d.m.y|d-m-y|d.m|d-m|dm|d|Y-m-d"
  });
}

if(Ext.form.ComboBox){
  Ext.apply(Ext.form.ComboBox.prototype, {
    loadingText       : "Încărcare...",
    valueNotFoundText : undefined
  });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'Acest câmp trebuie să conţină o adresă de e-mail în formatul "user@domeniu.com"',
      urlText      : 'Acest câmp trebuie să conţină o adresă URL în formatul "http:/'+'/www.domeniu.com"',
      alphaText    : 'Acest câmp trebuie să conţină doar litere şi _',
      alphanumText : 'Acest câmp trebuie să conţină doar litere, cifre şi _'
   });
}

if(Ext.form.HtmlEditor){
  Ext.apply(Ext.form.HtmlEditor.prototype, {
    createLinkText : 'Vă rugăm introduceti un URL pentru această legătură web:',
    buttonTips : {
      bold : {
        title: 'Îngroşat (Ctrl+B)',
        text: 'Îngroşati caracterele textului selectat.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      italic : {
        title: 'Înclinat (Ctrl+I)',
        text: 'Înclinaţi caracterele textului selectat.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      underline : {
        title: 'Subliniat (Ctrl+U)',
        text: 'Subliniaţi caracterele textului selectat.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      increasefontsize : {
        title: 'Mărit',
        text: 'Măreşte dimensiunea fontului.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      decreasefontsize : {
        title: 'Micşorat',
        text: 'Micşorează dimensiunea textului.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      backcolor : {
        title: 'Culoarea fundalului',
        text: 'Schimbă culoarea fundalului pentru textul selectat.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      forecolor : {
        title: 'Culoarea textului',
        text: 'Schimbă culoarea textului selectat.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      justifyleft : {
        title: 'Aliniat la stânga',
        text: 'Aliniază textul la stânga.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      justifycenter : {
        title: 'Centrat',
        text: 'Centrează textul în editor.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      justifyright : {
        title: 'Aliniat la dreapta',
        text: 'Aliniază textul la dreapta.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      insertunorderedlist : {
        title: 'Listă cu puncte',
        text: 'Inserează listă cu puncte.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      insertorderedlist : {
        title: 'Listă numerotată',
        text: 'Inserează o listă numerotată.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      createlink : {
        title: 'Legătură web',
        text: 'Transformă textul selectat în legătură web.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      },
      sourceedit : {
        title: 'Editare sursă',
        text: 'Schimbă pe modul de editare al codului HTML.',
        cls: Ext.baseCSSPrefix + 'html-editor-tip'
      }
    }
  });
}


if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "Sortare ascendentă",
      sortDescText : "Sortare descendentă",
      lockText     : "Blochează coloana",
      unlockText   : "Deblochează coloana",
      columnsText  : "Coloane"
   });
}

if(Ext.grid.GroupingView){
  Ext.apply(Ext.grid.GroupingView.prototype, {
    emptyGroupText : '(Fără)',
    groupByText    : 'Grupează după această coloană',
    showGroupsText : 'Afișează grupat'
  });
}

if(Ext.grid.PropertyColumnModel){
  Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
    nameText   : "Nume",
    valueText  : "Valoare",
    dateFormat : "d.m.Y"
  });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "Trage pentru redimensionare.",
      collapsibleSplitTip : "Trage pentru redimensionare. Dublu-click pentru ascundere."
   });
}