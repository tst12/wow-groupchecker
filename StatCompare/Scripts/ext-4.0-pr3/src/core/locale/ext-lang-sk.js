/**
 * List compiled by mystix on the extjs.com forums.
 * Thank you Mystix!
 */
 
 /*  Slovak Translation by Michal Thomka
  *  14 April 2007
  */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">Nahrávam...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} označených riadkov";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "Zavrieť túto záložku";
}

if(Ext.form.BaseField){
   Ext.form.BaseField.prototype.invalidText = "Hodnota v tomto poli je nesprávna";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "Nahrávam...";
}

Ext.Date.monthNames = [
   "Január",
   "Február",
   "Marec",
   "Apríl",
   "Máj",
   "Jún",
   "Júl",
   "August",
   "September",
   "Október",
   "November",
   "December"
];

Ext.Date.dayNames = [
   "Nedeľa",
   "Pondelok",
   "Utorok",
   "Streda",
   "Štvrtok",
   "Piatok",
   "Sobota"
];

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "OK",
      cancel : "Zrušiť",
      yes    : "Áno",
      no     : "Nie"
   };
}

if(Ext.util.Format){
    Ext.apply(Ext.util.Format, {
        thousandSeparator: '.',
        decimalSeparator: ',',
        currencySign: '\u20ac',  // Slovakian Euro
        dateFormat: 'd.m.Y'
    });
}

if(Ext.picker.Date){
   Ext.apply(Ext.DatePicker.prototype, {
      todayText         : "Dnes",
      minText           : "Tento dátum je menší ako minimálny možný dátum",
      maxText           : "Tento dátum je väčší ako maximálny možný dátum",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames        : Ext.Date.monthNames,
      dayNames          : Ext.Date.dayNames,
      nextText          : 'Ďalší Mesiac (Control+Doprava)',
      prevText          : 'Predch. Mesiac (Control+Doľava)',
      monthYearText     : 'Vyberte Mesiac (Control+Hore/Dole pre posun rokov)',
      todayTip          : "{0} (Medzerník)",
      format            : "d.m.Y"
   });
}


if(Ext.toolbar.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "Strana",
      afterPageText  : "z {0}",
      firstText      : "Prvá Strana",
      prevText       : "Predch. Strana",
      nextText       : "Ďalšia Strana",
      lastText       : "Posledná strana",
      refreshText    : "Obnoviť",
      displayMsg     : "Zobrazujem {0} - {1} z {2}",
      emptyMsg       : 'iadne dáta'
   });
}


if(Ext.form.Text){
   Ext.apply(Ext.form.Text.prototype, {
      minLengthText : "Minimálna dĺžka pre toto pole je {0}",
      maxLengthText : "Maximálna dĺžka pre toto pole je {0}",
      blankText     : "Toto pole je povinné",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.Number){
   Ext.apply(Ext.form.Number.prototype, {
      minText : "Minimálna hodnota pre toto pole je {0}",
      maxText : "Maximálna hodnota pre toto pole je {0}",
      nanText : "{0} je nesprávne číslo"
   });
}

if(Ext.form.Date){
   Ext.apply(Ext.form.Date.prototype, {
      disabledDaysText  : "Zablokované",
      disabledDatesText : "Zablokované",
      minText           : "Dátum v tomto poli musí byť až po {0}",
      maxText           : "Dátum v tomto poli musí byť pred {0}",
      invalidText       : "{0} nie je správny dátum - musí byť vo formáte {1}",
      format            : "d.m.Y"
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "Nahrávam...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'Toto pole musí byť e-mailová adresa vo formáte "user@example.com"',
      urlText      : 'Toto pole musí byť URL vo formáte "http:/'+'/www.example.com"',
      alphaText    : 'Toto pole može obsahovať iba písmená a znak _',
      alphanumText : 'Toto pole može obsahovať iba písmená, čísla a znak _'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "Zoradiť vzostupne",
      sortDescText : "Zoradiť zostupne",
      lockText     : "Zamknúť stľpec",
      unlockText   : "Odomknúť stľpec",
      columnsText  : "Stľpce"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "Názov",
      valueText  : "Hodnota",
      dateFormat : "d.m.Y"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "Potiahnite pre zmenu rozmeru",
      collapsibleSplitTip : "Potiahnite pre zmenu rozmeru. Dvojklikom schováte."
   });
}
