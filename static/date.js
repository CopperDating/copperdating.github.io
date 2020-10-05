const DATE_LENGTH_MINS = 3
const SKIP_DATE_TIMEOUT = 5 * 1000

const chatIframe    = document.getElementById("chatIframe")
const nameSpan      = document.getElementById("dateName")
const statusMessage = document.getElementById("statusMessage")
const submitMatch   = document.getElementById("submitMatch")


let endTime


function closeIframe()
{
    document.getElementById("time_end_date").classList.add("d-none")
    document.getElementById("date_title").classList.remove("d-none")
    document.getElementById("date_row_padding").classList.add("row","padding-top-copper")

    chatIframe.style.display = "none"
    // document.getElementById("always-show").style.display = "block"
    chatIframe.setAttribute("src", "")
}

function enableEndDate()
{
    document.getElementById("endDate").disabled = false
}

function endDate()
{
    closeIframe()

    for(const element of submitMatch.elements) element.required = false

    submitMatch.match.value = 'h'
    submitMatch.submitButton.click()
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function onreadystatechange_sendAliveSignal() {
    if (this.readyState != 4) return;

    if (this.status < 200 || this.status >= 400)
        return console.error(this.status)

    console.log(this.responseText);
    result = JSON.parse(this.responseText);

    if (result.hanged_date)
        window.location.href = "/lobby?hanged=true"

    else if (result.pairing_submitted)
        endTime = 0

    else if (result.lost_connection)
        window.location.href = "/lobby?abort=true"
}

function runChat() {
    console.log("running")

    const d = new Date()

    // Date timed out
    if (d >= endTime) return showForm()

    console.log("still before")

    const seconds = Math.floor(Math.abs((d - endTime) / 1000))
    statusMessage.textContent = seconds + "s"

    sendAliveSignal()
    setTimeout(runChat, 1000)
}

function sendAliveSignal() {
    const postData = {
        "pairing_id": getCookie("pairing-id"),
        "user_id": getCookie("user_id")
    }
    // console.log(postData)

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/date-check", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(JSON.stringify(postData));
    xhr.onreadystatechange = onreadystatechange_sendAliveSignal
}

function showForm()
{
    closeIframe()

    submitMatch.classList.remove("d-none")
    nameSpan.textContent = getCookie("date-name")
}


document.getElementById("endDate").addEventListener('click', endDate)

var url = getCookie("date-url")
if (url == "") {
    window.location.href = "/lobby"
}
else
{
    document.getElementById("date_title").classList.add("d-none")

    chatIframe.style.display = "inline"
    // document.getElementById("always-show").style.display = "none"
    chatIframe.setAttribute("src", url)

    endTime = new Date()
    endTime.setSeconds(endTime.getSeconds() + 15)
    endTime.setMinutes(endTime.getMinutes() + DATE_LENGTH_MINS)

    runChat()

    setTimeout(enableEndDate, SKIP_DATE_TIMEOUT)
}
