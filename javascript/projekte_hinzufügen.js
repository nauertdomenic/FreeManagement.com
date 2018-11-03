// Initialisierung des Dateselectors
$(document).ready(function() {
  $('.datepicker').pickadate({
  selectMonths: true,
  selectYears: 15
  });
});

// Funktion zum Speichern eines Projekts
function saveProject() {

  // Testen, ob eine oder mehrere Felder nicht ausgefüllt wurden
  if(document.getElementById("name").value === ""
    || document.getElementById("dauer").value === ""
    || document.getElementById("verantwortlicher").value === ""
    || document.getElementById("kuerzel").value === ""
    || document.getElementById("kunde").value === ""
    || document.getElementById("kosten").value === ""
    || document.getElementById("ansprechpartner").value === ""
    || document.getElementById("start").value === ""
    || document.getElementById("ende").value === ""
    || document.getElementById("beschreibung").value === ""){

    // Falls zutreffend, wird eine entsprechende Fehlermeldung ausgegeben
    swal({
      type: 'error',
      title: 'Unvollständige Eingabe...',
      text: "Ein oder mehrere Felder sind nicht ausgefüllt. Bitte füllen Sie die leeren Felder aus und betätigen Sie den Button 'Hinzufügen' erneut.",
      footer: '<a href="projekte_tutorial.html">Tutorial</a>'
    })

    return;
  }

  // Testen, ob eine oder mehrere fehlerhafte Eingaben getätigt wurden
  if(document.getElementById("name").checkValidity() == false
    || document.getElementById("verantwortlicher").checkValidity() == false
    || document.getElementById("kunde").checkValidity() == false
    || document.getElementById("ansprechpartner").checkValidity() == false
    || document.getElementById("beschreibung").checkValidity() == false){

    // Falls zutreffend, wird eine entsprechende Fehlermeldung ausgegeben
    swal({
      type: 'error',
      title: 'Fehlerhafte Eingabe...',
      text: "Ein oder mehrere Felder sind nicht korrekt ausgefüllt. Bitte füllen Sie die rot markierten Felder mit gültigen Werten und betätigen Sie den Button 'Hinzufügen' erneut.",
      footer: '<a href="projekte_tutorial.html">Tutorial</a>'
    })

    return;
  }

  // Testen, ob das Start-Datum vor dem Ende-Datum liegt
  if(document.getElementById("start").value > document.getElementById("ende").value){

    // Falls zutreffend, wird eine entsprechende Fehlermeldung ausgegeben
    swal({
      type: 'error',
      title: 'Ende-Datum vor Start-Datum',
      text: "Das Ende-Datum liegt vor dem Start-Datum. Bitte ändern Sie entweder das Start-Datum oder das Ende-Datum und betätigen Sie den Button 'Hinzufügen' erneut.",
      footer: '<a href="projekte_tutorial.html">Tutorial</a>'
    })

    return;
  }

  // Wenn keine Fehler vorliegt, wird das Projekt im Folgenden gespeichert
  // neuen Key erzeugen und den Key in newPostKey speichern
  var newPostKey = firebase.database().ref().child('postsProjekte').push().key;

  var datei = false;
  // Prüfen, ob Datei ausgewählt wurde und boolean setzen
  // Der Boolean wird weiter unten in postData gespeichert
  if(document.getElementById("file").value != ""){
    datei = true;
  }

  // Die relevanten Nutzereingaben in das JSON-Objekt speichern
  var postData = {
    datei: Boolean(datei),
    key: newPostKey,
    name: document.getElementById("name").value,
    dauer: document.getElementById("dauer").value,
    verantwortlicher: document.getElementById("verantwortlicher").value,
    kuerzel: document.getElementById("kuerzel").value,
    Kunde: document.getElementById("kunde").value,
    Kosten: document.getElementById("kosten").value,
    ansprechpartner: document.getElementById("ansprechpartner").value,
    start: document.getElementById("start").value,
    ende: document.getElementById("ende").value,
    beschreibung: document.getElementById("beschreibung").value
  };

  // den erzeugten Key dem JSON-Objekt in der Variable updates zuordnen
  var updates = {};
  updates['/postsProjekte/' + newPostKey] = postData;
  updates['/user-postsProjekte/' + newPostKey] = postData;

  // Methodenaufruf: der Inhalt aller Felder wird gelöscht
  deleteValues();

  // Dem Nutzer wird das Hinzufügen bestätigt
  swal(
  'Projekte hinzugefügt',
  'Das Projekt wurde erfolgreich in die Datenbank gespeichert.',
  'success'
  )

  // Falls eine Datei ausgewählt wurde, diese Datei hochladen über einen Methodenaufruf
  if(datei == true){
      uploadFile(newPostKey);
  }

  // Die Daten speichern und die Methode somit beenden
  return firebase.database().ref().update(updates);

}

// Diese Funktion löscht die Inhalte aller Felder
function deleteValues(){
  document.getElementById("name").value="";
  document.getElementById("dauer").value="";
  document.getElementById("verantwortlicher").value="";
  document.getElementById("kuerzel").value="";
  document.getElementById("kunde").value="";
  document.getElementById("kosten").value="";
  document.getElementById("ansprechpartner").value="";
  document.getElementById("start").value="";
  document.getElementById("ende").value="";
  document.getElementById("beschreibung").value="";
}

// Diese Funktion lädt eine ausgewählte Datei in den Google-Firestore hoch
function uploadFile(key){

  // Eine Referenz zum Firestore erzeugen
  var storage = firebase.storage().ref();

  // Eine Referenz zur hochzuladender Datei erzeugen
  selectedFile = document.getElementById("file").files[0];

  // Die Datei hochladen
  storage.child(key).put(selectedFile).then(function(snapshot) {
  });

}
