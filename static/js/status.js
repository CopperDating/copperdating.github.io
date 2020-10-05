document.getElementById("resetDatabase").addEventListener("click", function () {
  var xhr = new XMLHttpRequest();
      xhr.open("POST", "", true);
      xhr.setRequestHeader('Content-Type', 'application/json');
      var postData = {"delete": true}
      console.log(postData)
      xhr.send(JSON.stringify(postData));
})

var checkingBeat = window.setInterval(checkStatus, 5 * 1000)
checkStatus()


function checkStatus() {
  var toClearIds = ["inProgressDates", "completedDates", "matchedDates"]
  for (var i = 0; i < toClearIds.length; i++) {
      var toClear = document.getElementById(toClearIds[i])
      toClear.textContent = ""
  }

  var postData = { "status": true }
  console.log(postData)

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "", true);
  xhr.setRequestHeader('Content-Type', 'application/json');
  xhr.send(JSON.stringify(postData));

  xhr.onreadystatechange = onreadystatechange
}

function onreadystatechange() {
    if (this.readyState != 4) return;

    if (this.status != 200) return

    console.log(this.responseText);
    var result = JSON.parse(this.responseText);
    var users = result.users
    document.getElementById("malesTable").innerHTML = ""
    document.getElementById("femalesTable").innerHTML = ""
    for (var i = 0; i < users.length; i++) {
        var user = users[i]
        var rowElement = document.createElement("tr")
        var id = document.createElement("td")
        id.appendChild(document.createTextNode(user.id))
        var firstColumn = document.createElement("td")
        firstColumn.appendChild(document.createTextNode(user.username))
        var secondColumn = document.createElement("td")
        secondColumn.appendChild(document.createTextNode(user.age))
        var thirdColumn = document.createElement("td")
        thirdColumn.appendChild(document.createTextNode(user.engaged))
        var fourthColumn = document.createElement("td")
        fourthColumn.appendChild(document.createTextNode(user.checks))
        var fifthColumn = document.createElement("td")
        fifthColumn.appendChild(document.createTextNode(user.last_active))
        rowElement.appendChild(id)
        rowElement.appendChild(firstColumn)
        rowElement.appendChild(secondColumn)
        rowElement.appendChild(thirdColumn)
        rowElement.appendChild(fourthColumn)
        rowElement.appendChild(fifthColumn)
        if (user.male) {
            document.getElementById("malesTable").appendChild(rowElement)
        } else {
            document.getElementById("femalesTable").appendChild(rowElement)
        }
    }
    document.getElementById("pairingTableBody").innerHTML = ""
    var pairings = result.pairings
    for (var i = 0; i < pairings.length; i++) {
        var pairing = pairings[i]
        var rowElement = document.createElement("tr")
        var columns = [
            "id", "created_at", "male_username", "male_email",
            "female_username", "female_email", "male_tick", "female_tick",
            "complete"
        ]
        for (var j = 0; j < columns.length; j++) {
            var columnElement = document.createElement("td")
            columnElement.appendChild(document.createTextNode(pairing[columns[j]]))
            rowElement.appendChild(columnElement)
        }
        document.getElementById("pairingTableBody").appendChild(rowElement)
    }

    document.getElementById("totalDates").textContent = pairings.length
    document.getElementById("inProgressDates").textContent = result.in_progress
    document.getElementById("submittedDates").textContent = result.submitted
    document.getElementById("completedDates").textContent = result.completed
    document.getElementById("matchedDates").textContent = result.matched
    document.getElementById("notMatchedDates").textContent = result.notMatched
    document.getElementById("hungedUpDates").textContent = result.hungedUp
}
