// const startHour = 20
// const endMinutes = 30
const CHECKING_BEAT_TIMEOUT = 1 * 1000
const MAX_CHECKS = 300

const dateStatusContainer = document.getElementById("dateStatusContainer")
const pendingDates = document.getElementById("pendingDates")

const minutesLabel = document.getElementById("minutes");
const secondsLabel = document.getElementById("seconds");

let checkingBeat
let checksCount = 0


function addDate(dateStatusContainer, i, statusSuffix, username)
{
    const textContent = username
        ? `Cita ${i} con ${username}: ${statusSuffix}`
        : `Cita ${i}: ${statusSuffix}`

    const newStatus = document.createElement("p")
    newStatus.textContent = textContent
    dateStatusContainer.appendChild(newStatus)
}

function check() {
    if (checksCount >= MAX_CHECKS) {
        return window.location.href = "/complete"
    }

    const postData = {
        "checks": checksCount
    }
    // console.log(postData)

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/check", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.withCredentials = true;
    xhr.send(JSON.stringify(postData));
    xhr.onreadystatechange = onreadystatechange
}

function onreadystatechange() {
    if (this.readyState != 4) return;

    checkingBeat = setTimeout(check, CHECKING_BEAT_TIMEOUT)

    if (this.status != 200) return

    console.log(this.responseText);

    const {
        date_id, date_url, date_username, no_pairings, num_pending_dates,
        pairing_id, pairing_statuses
    } = JSON.parse(this.responseText);

    // No dates, update list of previous and current ones
    if (no_pairings) {
        checksCount += 1
        setTime()

        pendingDates.innerHTML = num_pending_dates || 0
        dateStatusContainer.innerHTML = ""

        let i = 1

        if(pairing_statuses)
            for (; i <= pairing_statuses.length; i++) {
                const {status, username} = pairing_statuses[i-1]

                addDate(dateStatusContainer, i, status, username)
            }

        return addDate(dateStatusContainer, i, "Buscando...")
    }

    // Found a date
    // TOOO move to date using temporal room ID
    clearTimeout(checkingBeat)

    const now = new Date();
    now.setTime(now.getTime() + 60 * 60 * 1000)

    const expires = "; expires=" + now.toUTCString() + "; path=/"

    document.cookie = "date-name="  + date_username + expires
    document.cookie = "date-id="    + date_id       + expires
    document.cookie = "date-url="   + date_url      + expires
    document.cookie = "pairing-id=" + pairing_id    + expires

    window.location.href = "/date"
}

function pad(val) {
  let valString = val + "";

  if (valString.length < 2) valString = "0" + valString;

  return valString;
}

function setTime() {
  minutesLabel.innerHTML = pad(parseInt(checksCount / 60));
  secondsLabel.innerHTML = pad(checksCount % 60);
}


const urlParams = new URLSearchParams(window.location.search);
if (urlParams.get('abort')) {
    document.getElementById("abortedCallMessage").style.display = "block"
}
if (urlParams.get('hanged')) {
    document.getElementById("hangedCallMessage").style.display = "block"
}

check()
setTime()
