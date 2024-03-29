﻿/*
 * France (Canadian) translation
 * By BernardChhun
 * 04-08-2007, 03:07 AM
 */

Ext.UpdateManager.defaults.indicatorText = '<div class="loading-indicator">En cours de chargement...</div>';

if(Ext.View){
   Ext.View.prototype.emptyText = "";
}

if(Ext.grid.GridPanel){
   Ext.grid.GridPanel.prototype.ddText = "{0} ligne(s) sélectionné(s)";
}

if(Ext.TabPanelItem){
   Ext.TabPanelItem.prototype.closeText = "Fermer cette onglet";
}

if(Ext.form.BaseField){
   Ext.form.BaseField.prototype.invalidText = "La valeur de ce champ est invalide";
}

if(Ext.LoadMask){
    Ext.LoadMask.prototype.msg = "En cours de chargement...";
}

Ext.Date.shortMonthNames = [
   "Janv",
   "Févr",
   "Mars",
   "Avr",
   "Mai",
   "Juin",
   "Juil",
   "Août",
   "Sept",
   "Oct",
   "Nov",
   "Déc"
];

Ext.Date.getShortMonthName = function(month) {
  return Ext.Date.shortMonthNames[month];
};

Ext.Date.monthNames = [
   "Janvier",
   "Février",
   "Mars",
   "Avril",
   "Mai",
   "Juin",
   "Juillet",
   "Août",
   "Septembre",
   "Octobre",
   "Novembre",
   "Décembre"
];

Ext.Date.monthNumbers = {
  "Janvier" : 0,
  "Février" : 1,
  "Mars" : 2,
  "Avril" : 3,
  "Mai" : 4,
  "Juin" : 5,
  "Juillet" : 6,
  "Août" : 7,
  "Septembre" : 8,
  "Octobre" : 9,
  "Novembre" : 10,
  "Décembre" : 11
};

Ext.Date.getMonthNumber = function(name) {
  return Ext.Date.monthNumbers[Ext.util.Format.capitalize(name)];
};

Ext.Date.dayNames = [
   "Dimanche",
   "Lundi",
   "Mardi",
   "Mercredi",
   "Jeudi",
   "Vendredi",
   "Samedi"
];

Ext.Date.getShortDayName = function(day) {
  return Ext.Date.dayNames[day].substring(0, 3);
};

if(Ext.MessageBox){
   Ext.MessageBox.buttonText = {
      ok     : "OK",
      cancel : "Annuler",
      yes    : "Oui",
      no     : "Non"
   };
}

if(Ext.util.Format){
    Ext.apply(Ext.util.Format, {
        thousandSeparator: '.',
        decimalSeparator: ',',
        currencySign: '$',  // Canadian Dollar
        dateFormat: 'd/m/Y'
    });
}

if(Ext.picker.Date){
   Ext.apply(Ext.DatePicker.prototype, {
      todayText         : "Aujourd'hui",
      minText           : "Cette date est plus petite que la date minimum",
      maxText           : "Cette date est plus grande que la date maximum",
      disabledDaysText  : "",
      disabledDatesText : "",
      monthNames	: Ext.Date.monthNames,
      dayNames		: Ext.Date.dayNames,
      nextText          : 'Prochain mois (CTRL+Fléche droite)',
      prevText          : 'Mois précédent (CTRL+Fléche gauche)',
      monthYearText     : 'Choissisez un mois (CTRL+Fléche haut ou bas pour changer d\'année.)',
      todayTip          : "{0} (Barre d'espace)",
      format            : "d/m/y"
   });
}

if(Ext.toolbar.PagingToolbar){
   Ext.apply(Ext.PagingToolbar.prototype, {
      beforePageText : "Page",
      afterPageText  : "de {0}",
      firstText      : "Première page",
      prevText       : "Page précédente",
      nextText       : "Prochaine page",
      lastText       : "Dernière page",
      refreshText    : "Recharger la page",
      displayMsg     : "Page courante {0} - {1} de {2}",
      emptyMsg       : 'Aucune donnée à afficher'
   });
}

if(Ext.form.Text){
   Ext.apply(Ext.form.Text.prototype, {
      minLengthText : "La longueur minimum de ce champ est de {0} caractères",
      maxLengthText : "La longueur maximum de ce champ est de {0} caractères",
      blankText     : "Ce champ est obligatoire",
      regexText     : "",
      emptyText     : null
   });
}

if(Ext.form.Number){
   Ext.apply(Ext.form.Number.prototype, {
      minText : "La valeur minimum de ce champ doit être de {0}",
      maxText : "La valeur maximum de ce champ doit être de {0}",
      nanText : "{0} n'est pas un nombre valide"
   });
}

if(Ext.form.Date){
   Ext.apply(Ext.form.Date.prototype, {
      disabledDaysText  : "Désactivé",
      disabledDatesText : "Désactivé",
      minText           : "La date de ce champ doit être avant le {0}",
      maxText           : "La date de ce champ doit être après le {0}",
      invalidText       : "{0} n'est pas une date valide - il doit être au format suivant: {1}",
      format            : "d/m/y"
   });
}

if(Ext.form.ComboBox){
   Ext.apply(Ext.form.ComboBox.prototype, {
      loadingText       : "En cours de chargement...",
      valueNotFoundText : undefined
   });
}

if(Ext.form.VTypes){
   Ext.apply(Ext.form.VTypes, {
      emailText    : 'Ce champ doit contenir un courriel et doit être sous ce format: "usager@example.com"',
      urlText      : 'Ce champ doit contenir une URL sous le format suivant: "http:/'+'/www.example.com"',
      alphaText    : 'Ce champ ne peut contenir que des lettres et le caractère souligné (_)',
      alphanumText : 'Ce champ ne peut contenir que des caractères alphanumériques ainsi que le caractère souligné (_)'
   });
}

if(Ext.grid.GridView){
   Ext.apply(Ext.grid.GridView.prototype, {
      sortAscText  : "Tri ascendant",
      sortDescText : "Tri descendant",
      lockText     : "Verrouillé la colonne",
      unlockText   : "Déverrouillé la colonne",
      columnsText  : "Colonnes"
   });
}

if(Ext.grid.PropertyColumnModel){
   Ext.apply(Ext.grid.PropertyColumnModel.prototype, {
      nameText   : "Propriété",
      valueText  : "Valeur",
      dateFormat : "d/m/Y"
   });
}

if(Ext.layout.BorderLayout && Ext.layout.BorderLayout.SplitRegion){
   Ext.apply(Ext.layout.BorderLayout.SplitRegion.prototype, {
      splitTip            : "Cliquer et glisser pour redimensionner le panneau.",
      collapsibleSplitTip : "Cliquer et glisser pour redimensionner le panneau. Double-cliquer pour cacher le panneau."
   });
}
