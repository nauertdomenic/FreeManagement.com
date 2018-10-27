//keyEvent funktion
window.addEventListener("keydown", keyEventWindow, false);

function keyEventWindow(key) {
  if (key.keyCode === 13) { //Bei Enter-Taste "Buchen"
    document.getElementById("rowButton").click();
  } else if (key.keyCode == 17) { //Bei Strg-Taste "Buchungsart"
    if (document.getElementById("einnahme").checked) {
      document.getElementById("ausgabe").checked = true;
    } else {
      document.getElementById("einnahme").checked = true;
    }
  }
}

//tooltip funktion
$(document).ready(function() {
  $('.tooltipped').tooltip();
});

//Neue Zeile der Tabelle hinzufügen und mit eingegebenen Werten füllen
function addRow() {
  //Textfelder holen
  var beschreibung = document.getElementById("beschreibung");
  var betrag = document.getElementById("betrag");
  var einnahme = document.getElementById("einnahme").checked;

  if (betrag.value <= 0) { //Wenn Betrag kleiner 0 -> Warunung + Abbrechen
    M.toast({
      html: 'Betrag muss > 0 sein!'
    })
    retrun;
  }

  M.toast({
    html: 'Eingabe erfolgreich!'
  })

  var btnKey = saveFinanzen();

  //Tabellenelemente erstellen und füllen
  var table = document.getElementById("tabelle");
  var tr = document.createElement('tr');
  var td1 = document.createElement('td');
  var td2 = document.createElement('td');
  var td3 = document.createElement('td');
  var td4 = document.createElement('td');
  var txtBeschreibung = document.createTextNode(beschreibung.value);
  var txtLeer = document.createTextNode(" ");

  // Löschen-Button erzeugen
  var löschen = document.createElement("a");
  löschen.className = "btn waves-effect waves-light red";
  löschen.innerHTML = "Löschen";
  löschen.id = btnKey;
  löschen.onclick = function() {
    var deleteRef = firebase.database().ref("postsFinanzen/" + this.id);
    deleteRef.remove();
    location.reload(true);
  };

  //Inhalte anhängen
  td1.appendChild(txtBeschreibung);
  if (einnahme) {
    var txtBetrag = document.createTextNode(betrag.value);
    td2.appendChild(txtBetrag);
    td3.appendChild(txtLeer);
  } else {
    var txtBetrag = document.createTextNode(-betrag.value);
    td2.appendChild(txtLeer);
    td3.appendChild(txtBetrag);
  }

  td4.appendChild(löschen);

  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);
  tr.appendChild(td4);

  if (table.rows.length > 1) { // Wenn Einträge da sind, Ergebniszeile löschen
    deleteErgebniszeile();
  }

  table.appendChild(tr); //Buchen zeilen anhängen

  //Inhalte zurücksetzen und Fokus setzen
  betrag.value = "";
  beschreibung.value = "";
  beschreibung.focus();

  berechneSum();
}

function berechneSum() {
  //Summe der Werte
  var table = document.getElementById("tabelle"),
    sumEinahmen = 0,
    sumAusgaben = 0,
    differenz = 0;

  for (var i = 1; i < table.rows.length; i++) //Werte summieren
  {
    if (table.rows[i].cells[1].innerHTML != " ") {
      sumEinahmen = sumEinahmen + parseInt(table.rows[i].cells[1].innerHTML);
    }
    if (table.rows[i].cells[2].innerHTML != " ") {
      sumAusgaben = sumAusgaben + parseInt(table.rows[i].cells[2].innerHTML);
    }
  }

  //Ergebnisse
  differenz = sumEinahmen + sumAusgaben;
  ergebnisTabelle(sumEinahmen, sumAusgaben, differenz)
}

//Ergebnistabelle erstellen
function ergebnisTabelle(ein, aus, erg) {
  var table = document.getElementById("tabelle");
  if (table.rows.length == 1) {
    return;
  }
  var tr = document.createElement('tr');
  var td1 = document.createElement('th');
  var td2 = document.createElement('th');
  var td3 = document.createElement('th');
  var txtDifferenz = document.createTextNode("∆ Einnahmen und Ausgaben =  " + erg);
  var txtEinahmen = document.createTextNode("Σ Einnahmen =  " + ein);
  var txtAusgaben = document.createTextNode("Σ Ausgaben =  " + aus);

  //Inhalte anhängen
  td1.appendChild(txtDifferenz);
  td2.appendChild(txtEinahmen);
  td3.appendChild(txtAusgaben);

  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);

  table.appendChild(tr);
}

//letzte Zeile löschen
function deleteErgebniszeile() {
  var table = document.getElementById("tabelle");
  table.removeChild(table.lastChild);
  beschreibung.focus();
}

//Alle Zeilen Löschen
function resetTable() {
  var deleteRef = firebase.database().ref("postsFinanzen");
  deleteRef.remove();
  location.reload(true);

  beschreibung.focus();
}

//Save Data in firebase
function saveFinanzen() {

  // neuen Key erzeugen
  // Der Key wird gespeichert
  var newPostKey = firebase.database().ref().child('postsFinanzen').push().key;

  var postData = {
    key: newPostKey,
    beschreibung: document.getElementById("beschreibung").value,
    betrag: document.getElementById("betrag").value,
    einnahme: document.getElementById("einnahme").checked
  };

  var updates = {};
  updates['/postsFinanzen/' + newPostKey] = postData;
  updates['/user-postsFinanzen/' + newPostKey] = postData;

  firebase.database().ref().update(updates);

  return postData.key;
}

//Tabelle laden bei aktualisieren
window.onload = function() {

  // Get a reference to the database service
  var database = firebase.database();

  var rootRef = firebase.database().ref("postsFinanzen");

  rootRef.once("value").then(function(snapshot) {

    var anzahlChild = snapshot.numChildren();
    var finanzen = snapshot.val();

    var table = document.getElementById("tabelle");

    for (i in finanzen) {

      //Tabellenelemente erstellen und füllen
      var tr = document.createElement('tr');
      var td1 = document.createElement('td');
      var td2 = document.createElement('td');
      var td3 = document.createElement('td');
      var td4 = document.createElement('td');
      var txtBeschreibung = document.createTextNode(finanzen[i].beschreibung);
      var txtLeer = document.createTextNode(" ");

      // Löschen-Button erzeugen
      var löschen = document.createElement("a");
      löschen.className = "btn waves-effect waves-light red";
      löschen.innerHTML = "Löschen";
      löschen.id = i;
      löschen.onclick = function() {
        var deleteRef = firebase.database().ref("postsFinanzen/" + this.id);
        deleteRef.remove();
        location.reload(true);
      };

      //Inhalte anhängen
      td1.appendChild(txtBeschreibung);
      if (finanzen[i].einnahme) {
        var txtBetrag = document.createTextNode(finanzen[i].betrag);
        td2.appendChild(txtBetrag);
        td3.appendChild(txtLeer);
      } else {
        var txtBetrag = document.createTextNode(-finanzen[i].betrag);
        td2.appendChild(txtLeer);
        td3.appendChild(txtBetrag);
      }

      td4.appendChild(löschen);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);

      table.appendChild(tr); //Buchen zeilen anhängen
    }
    berechneSum();

  });
}

//Key aus firebase löschen
function deleteFinanzen(key) {
  var deleteRef = firebase.database().ref("postsFinanzen/" + key);
  console.log("postsFinanzen/" + key);
  delete(deleteRef);
}