// EventListener auf die Suchleiste legen
document.addEventListener('DOMContentLoaded', function() {

  var inputForm = document.getElementById("inputForm");

  if(inputForm){
    inputForm.addEventListener('submit', function(e) {
        e.preventDefault();
        search();
      }, false);
    }
});

// Wird die Seite aufgerufen, werden alle verfügbaren Projekte angezeigt.
window.onload = function() {

  // Eine Referenz zur Firebase erstellen
  var database = firebase.database();
  var rootRef = firebase.database().ref("postsProjekte");

  // Die Funktion zum Auflisten der Projekte aufrufen; dazu die Referenz übergeben
  listProjects(rootRef);
}


function search() {

  // Alle bisherigen Einträge löschen
  var li = document.getElementById("list");
  while(li.firstChild){
    li.removeChild(li.firstChild);
  }

  // Eine Referenz zur Firebase erstellen
  var database = firebase.database();

  // Elemente, die den eingegebenen Suchebgriff haben, aus Firebase filtern
  var suchBegriff = document.getElementById("search").value;
  var rootRef = firebase.database().ref("postsProjekte").orderByChild("name").equalTo(suchBegriff);

  // Die Funktion zum Auflisten der Projekte aufrufen; dazu die Referenz übergeben
  listProjects(rootRef);

}
// Funktion zum Auflisten der Projekte
function listProjects(rootRef) {

  // Den Snapshot auf der Website anzeigen
  rootRef.once("value").then(function(snapshot) {

    var projekte = snapshot.val();

    // Solange Projekte mit diesem Namen vorhanden sind
    for (i in projekte) {

      // Neue Elemente erstellen
      var li = document.createElement("li");
      var div1 = document.createElement("div");
      var div2 = document.createElement("div");
      var iconheader = document.createElement("i");

      // Projektname als Überschrift auf Collapsible festlegen
      var überschrift = document.createTextNode(projekte[i].name);

      // Download-Button erzeugen, falls eine Datei angehängt wurde
      if(projekte[i].datei == true){

        var fileDownload = document.createElement("a");
        fileDownload.type = "submit";
        fileDownload.className = "btn waves-effect waves-light";
        fileDownload.innerHTML = "Datei-Download";
        fileDownload.id = projekte[i].key;

        // Funktion für den Download-Button definieren
        fileDownload.onclick = function(){

          var storage = firebase.storage().ref();
          var storageRef = storage.child(this.id).getDownloadURL().then(function(url){

            var xhr = new XMLHttpRequest();
            xhr.responseType = 'blob';
            xhr.onload = function(event) {
              var blob = xhr.response;
            };

            xhr.open('GET', url);
            xhr.send();

            // Möglichkeiten für den Download
            // 1. Download-Dialog öffnen, jedoch müsste das PDF-Dokument dann gestreamt werden
            // download(url, fileDownload.id, "application/pdf");
            // 2. Dokument in Browser öffnen. Soll aber in neuem Tab geöffnet werden
            //fileDownload.href = url;
            //fileDownload.download ="Scheiße";
            // 3. Dokument in neuem Tab öffnen
            window.open(url ,'_blank');

            // Fehler abfangen
            }).catch(function(error) {

              switch (error.code) {
                case 'storage/object-not-found':
                console.log("Nicht gefunden");
                break;

                case 'storage/unauthorized':
                console.log("Nicht autorisiert");
                break;

                case 'storage/canceled':
                console.log("Abgebrochen");
                break;

                case 'storage/unknown':
                console.log("Unbekannt");
                break;
              }
            });
        }
      }

      // Löschen-Button erzeugen
      var löschen = document.createElement("a");
      löschen.className = "btn waves-effect waves-light red";
      löschen.innerHTML = "Löschen";
      löschen.id = projekte[i].key;

      // Funktion für den Löschen-Button erzgeugen
      löschen.onclick = function() {
        // Firebase-Daten löschen
        var deleteRef = firebase.database().ref("postsProjekte/" + this.id);
        deleteRef.remove();

        // falls vorhanden Firestore-Daten löschen (Dokument)
        var storage = firebase.storage().ref();
        var storageRef = storage.child(this.id);
        storageRef.delete();

        // Die Seite neu laden
        location.reload(false);
      };

      // 1. Elemente für einzelne Paragraphen erzeugen
      // 2. Variablen mit Werten (Projektdaten) des aktuellen JSON-Objekts füllen
      // 3. Zu p-Elementen die benötigten Inhalte hinzufügen
      var nameP = document.createElement("p");
      var name = document.createTextNode("Projektname: " + projekte[i].name);
      nameP.appendChild(name);

      var dauerP = document.createElement("p");
      var dauer = document.createTextNode("Projektdauer: " + projekte[i].dauer);
      dauerP.appendChild(dauer);

      var verantwortlicherP = document.createElement("p");
      var verantwortlicher = document.createTextNode("Projektverantwortlicher: " + projekte[i].verantwortlicher);
      verantwortlicherP.appendChild(verantwortlicher);

      var kuerzelP = document.createElement("p");
      var kuerzel = document.createTextNode("Projektkürzel: " + projekte[i].kuerzel);
      kuerzelP.appendChild(kuerzel);

      var kundeP = document.createElement("p");
      var kunde = document.createTextNode("Kunde: " + projekte[i].Kunde);
      kundeP.appendChild(kunde);

      var kostenP = document.createElement("p");
      var kosten = document.createTextNode("Kosten: " + projekte[i].Kosten);
      kostenP.appendChild(kosten);

      var ansprechpartnerP = document.createElement("p");
      var ansprechpartner = document.createTextNode("Ansprechpartner: " + projekte[i].ansprechpartner);
      ansprechpartnerP.appendChild(ansprechpartner);

      var startP = document.createElement("p");
      var start = document.createTextNode("Projektstart: " + projekte[i].start);
      startP.appendChild(start);

      var endeP = document.createElement("p");
      var ende = document.createTextNode("Projektende: " + projekte[i].ende);
      endeP.appendChild(ende);

      var beschreibungP = document.createElement("p");
      var beschreibung = document.createTextNode("Ausführliche Beschreibung: " + projekte[i].beschreibung);
      beschreibungP.appendChild(beschreibung);

      // Icon festlegen
      var iconName = document.createTextNode("show_chart");

      // Klassen festlegen
      div1.className = "collapsible-header";
      div2.className = "collapsible-body";
      iconheader.className = "material-icons";

      iconheader.appendChild(iconName);
      // Zu Element "div1" die benötigten Komponenten hinzufügen
      div1.appendChild(überschrift);
      div1.appendChild(iconheader);
      // Zu Element "div2" die benötigten Komponenten hinzufügen
      div2.appendChild(nameP);
      div2.appendChild(dauerP);
      div2.appendChild(verantwortlicherP);
      div2.appendChild(kuerzelP);
      div2.appendChild(kundeP);
      div2.appendChild(kostenP);
      div2.appendChild(ansprechpartnerP);
      div2.appendChild(startP);
      div2.appendChild(endeP);
      div2.appendChild(beschreibungP);
      if(projekte[i].datei == true){
          div2.appendChild(fileDownload);
      }
      div2.appendChild(löschen);

      // Zu Element "li" die benötigten Komponenten hinzufügen
      li.appendChild(div1);
      li.appendChild(div2);

      var element = document.getElementById("list");
      element.appendChild(li);
    }
  });
}
