function exp() {
  newtable();
  tableToExcel('tabEx', 'tabEx');
}

function button() {
  var table = document.getElementById("tab1");
  var anfang = document.getElementById("Start").value;
  var ende = document.getElementById("Ende").value;
  anfang = Number(anfang);
  ende = Number(ende);

  if (ende > 24 || anfang > 24) {
    M.toast({
      html: 'Zeiten über 24 nicht möglich'
    })

  } else {
    if (ende == 0) {
      M.toast({
        html: 'Eine oder mehrere Eingaben sind Null'
      })

    } else if (anfang == 0) {
      M.toast({
        html: 'Eine oder mehrere Eingaben sind Null'
      })

    } else if (anfang > ende) {
      M.toast({
        html: 'Anfang ist größer als das Ende'
      })

    } else {
      saveArbeit();
      funct1();
    }
  }
}

function funct1() {
  var btnKey = saveArbeit();
  var table = document.getElementById("tab1");
  var anfang = document.getElementById("Start").value;
  var ende = document.getElementById("Ende").value;
  anfang = Number(anfang);
  ende = Number(ende);
  document.getElementById("Ende").value = "";
  document.getElementById("Start").value = "";

  if (ende > 24 || anfang > 24) {
    M.toast({
      html: 'Zeiten über 24 nicht möglich'
    })

  } else {
    if (ende == 0) {
      M.toast({
        html: 'Eine oder mehrere Eingaben sind Null'
      })

    } else if (anfang == 0) {
      M.toast({
        html: 'Eine oder mehrere Eingaben sind Null'
      })

    } else if (anfang > ende) {
      M.toast({
        html: 'Anfang ist größer als das Ende'
      })

    } else {
      var tr = document.createElement('tr');
      var td1 = document.createElement('td');
      var td2 = document.createElement('td');
      var td3 = document.createElement('td');
      var td4 = document.createElement('td');
      var text1 = document.createTextNode(anfang);
      var text2 = document.createTextNode(ende);
      var text3 = document.createTextNode(ende - anfang);
      // Löschen-Button erzeugen
      var löschen = document.createElement("a");
      löschen.className = "btn waves-effect waves-light red";
      löschen.innerHTML = "Löschen";
      löschen.id = btnKey;
      löschen.onclick = function() {
        var deleteRef = firebase.database().ref("postsArbeit/" + this.id);
        deleteRef.remove();
        location.reload(true);
      };
      td1.appendChild(text1);
      td2.appendChild(text2);
      td3.appendChild(text3);
      td4.appendChild(löschen);
      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);
      table.appendChild(tr);
    }
  }
}


//firebase
//Save Data in firebase
function saveArbeit() {
  var StartT = document.getElementById("Start").value;
  var Keks = parseInt(StartT);
  var endeT = document.getElementById('Ende').value;
  var Kuchen = parseInt(endeT);
  // neuen Key erzeugen
  // Der Key wird gespeichert
  var newPostKey = firebase.database().ref().child('postsArbeit').push().key;

  var postData = {
    key: newPostKey,
    Start: document.getElementById("Start").value,
    Ende: document.getElementById("Ende").value,
    Summe: (Kuchen - Keks)
  };


  var updates = {};
  updates['/postsArbeit/' + newPostKey] = postData;
  updates['/user-postsArbeit/' + newPostKey] = postData;

  firebase.database().ref().update(updates);
  return postData.key;

}

//Tabelle laden bei aktualisieren
window.onload = function() {

  // Get a reference to the database service
  var database = firebase.database();

  var rootRef = firebase.database().ref("postsArbeit");


  rootRef.once("value").then(function(snapshot) {

    var zeit = snapshot.val();

    var tab = document.getElementById("tab1");
    var exportTab = document.getElementById("tabEx");

    for (i in zeit) {

      //Tabellenelemente erstellen und füllen
      var tr = document.createElement('tr');
      var extr = document.createElement('tr');
      var td1 = document.createElement('td');
      var td2 = document.createElement('td');
      var td3 = document.createElement('td');
      var extd1 = document.createElement('td');
      var extd2 = document.createElement('td');
      var extd3 = document.createElement('td');
      var td4 = document.createElement('td');
      var txtStart = document.createTextNode(zeit[i].Start);
      var exStart = document.createTextNode(zeit[i].Start);

      // Löschen-Button erzeugen
      var löschen = document.createElement("a");
      löschen.className = "btn waves-effect waves-light red";
      löschen.innerHTML = "Löschen";
      löschen.id = i;
      löschen.onclick = function() {
        var deleteRef = firebase.database().ref("postsArbeit/" + this.id);
        deleteRef.remove();
        location.reload(true);
      };

      //Inhalte anhängen
      td1.appendChild(txtStart);
      extd1.appendChild(exStart);
      var txtEnde = document.createTextNode(zeit[i].Ende);
      var exEnde = document.createTextNode(zeit[i].Ende);
      var txtSum = document.createTextNode(zeit[i].Summe);
      var exSum = document.createTextNode(zeit[i].Summe);
      td2.appendChild(txtEnde);
      extd2.appendChild(exEnde);
      td3.appendChild(txtSum);
      extd3.appendChild(exSum)
      td4.appendChild(löschen);

      tr.appendChild(td1);
      tr.appendChild(td2);
      tr.appendChild(td3);
      tr.appendChild(td4);

      extr.appendChild(extd1);
      extr.appendChild(extd2);
      extr.appendChild(extd3);

      tab.appendChild(tr);
      exportTab.appendChild(extr); //Buchen zeilen anhängen

      // Löschen-Button erzeugen
      //var löschen = document.createElement("a");
      //löschen.className = "btn waves-effect waves-light red";
      //löschen.innerHTML = "Löschen";
      //löschen.onclick = function() {
      //  var deleteRef = firebase.database().ref("posts/" + projekte[i].key);
      //  deleteRef.remove();
      //  location.reload(true);
      //};
    }

  });
}

//Key aus firebase löschen
function deleteZeit(key) {
  var deleteRef = firebase.database().ref("posts/" + key);
  console.log("posts/" + key);
  delete(deleteRef);
}

function resetTable() {
  var deleteRef = firebase.database().ref("postsArbeit");
  deleteRef.remove();
  location.reload(true);

  beschreibung.focus();
}

function reload(tag1, tag2) {
  setTimeout(function() {
    location.reload()
  }, 100);
  tableToExcel(tag1, tag2);
}
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
    location.reload();
    if (!table.nodeType) table = document.getElementById("tabEx")
    var ctx = {
      worksheet: name || 'Worksheet',
      table: table.innerHTML
    }
    window.location.href = uri + base64(format(template, ctx))
  }
})()