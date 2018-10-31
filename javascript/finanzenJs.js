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
  var i = document.createElement("i");
  i.innerHTML = "delete_forever";
  i.className = "material-icons";
  löschen.className = "btn-floating red";
  löschen.id = btnKey;
  löschen.appendChild(i);
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

    var finanzen = snapshot.val();
    var table = document.getElementById("tabelle");
    var exportTab = document.getElementById("exportTabelle");

    for (i in finanzen) {

      //Tabellenelemente erstellen und füllen
      var tr = document.createElement('tr');
      var extr = document.createElement('tr');
      var td1 = document.createElement('td');
      var td2 = document.createElement('td');
      var td3 = document.createElement('td');
      var td4 = document.createElement('td');
      var extd1 = document.createElement('td');
      var extd2 = document.createElement('td');
      var extd3 = document.createElement('td');
      var txtBeschreibung = document.createTextNode(finanzen[i].beschreibung);
      var exBeschreibung = document.createTextNode(finanzen[i].beschreibung);
      var txtLeer = document.createTextNode(" ");
      var exLeer = document.createTextNode(" ");

      // Löschen-Button erzeugen
      var löschen = document.createElement("a");
      var iEl = document.createElement("i");
      iEl.innerHTML = "delete_forever";
      iEl.className = "material-icons";
      löschen.className = "btn-floating red";
      löschen.id = i;
      löschen.appendChild(iEl);
      löschen.onclick = function() {
        var deleteRef = firebase.database().ref("postsFinanzen/" + this.id);
        deleteRef.remove();
        location.reload(true);
      };

      //Inhalte anhängen
      td1.appendChild(txtBeschreibung);
      extd1.appendChild(exBeschreibung);
      if (finanzen[i].einnahme) {
        var txtBetrag = document.createTextNode(finanzen[i].betrag);
        var exBetrag = document.createTextNode(finanzen[i].betrag);
        td2.appendChild(txtBetrag);
        extd2.appendChild(exBetrag);
        td3.appendChild(txtLeer);
        extd3.appendChild(exLeer);
      } else {
        var txtBetrag = document.createTextNode(-finanzen[i].betrag);
        var exBetrag = document.createTextNode(-finanzen[i].betrag);
        td2.appendChild(txtLeer);
        extd2.appendChild(exLeer);
        td3.appendChild(txtBetrag);
        extd3.appendChild(exBetrag);
      }

      td4.appendChild(löschen);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);

      extr.appendChild(extd1);
      extr.appendChild(extd2);
      extr.appendChild(extd3);

      table.appendChild(tr); //Buchen zeilen anhängen
      exportTab.appendChild(extr);
    }
    berechneSum();

  });
}

//Tabelle exportieren
var tableToExcel = (function() {
  var uri = 'data:application/vnd.ms-excel;base64,',
    template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
    base64 = function(s) {
      return window.btoa(unescape(encodeURIComponent(s)))
    },
    format = function(s, c) {
      return s.replace(/{(\w+)}/g, function(m, p) {
        return c[p];
      })
    }

  return function(table, name) {
    if (!table.nodeType) table = document.getElementById("exportTabelle")

    var ctx = {
      worksheet: name || 'Worksheet',
      table: table.innerHTML
    }
    window.location.href = uri + base64(format(template, ctx))
  }
})()