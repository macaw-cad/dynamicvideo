/**
 *
 * test
 *
 *
 */
let xhttp = new XMLHttpRequest();

const questionContainer = document.getElementById("question_container");
const answersContainer = document.getElementById("answers_container");

init();

/**
 * Get the video URL and first question with answers
 */
function init() {
    xhttp.open("GET", "/api/v1/init", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // When there is an ajax call, the xhrChangeListener will be fired
    xhttp.onreadystatechange = xhrChangeListener;
    xhttp.send();
}


/**
 * Listen to the button
 */
function buttonListener() {
    xhttp.open("POST", "/api/v1/send-answer", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("answer=" + this.dataset.id);
}

/**
 * If there is a change in the XHTTP, this function will be fired
 * Init the video & append question with answers
 */
function xhrChangeListener() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const json = JSON.parse(this.response);
        const videoId = json.video_id;
        const question = json.question;
        const success = json.success;
        const message = json.message;

        if (videoId) {
            initVideo(videoId);
        }

        clearFields();

        if (typeof question !== 'undefined' && success) {

            // Show question
            appendQuestion(question._description);
            console.log(question._answers);

            // Show answers
            for (let i in question._answers) {
                appendAnswer(question._answers[i].id, question._answers[i].desc).onclick = buttonListener;
            }

        } else {
            // Alert the user with the error
            alert(message);
        }
    }
}


/**
 * Append the question in the HTML
 *
 * @param description
 * @returns {HTMLParagraphElement}
 */
function appendQuestion(description) {
    let q = document.createElement('p');
    q.innerText = description;

    return questionContainer.appendChild(q);
}

/**
 * Append the answers in the HTML
 *
 * @param id
 * @param title
 * @returns {HTMLButtonElement}
 */
function appendAnswer(id, title) {
    let a = document.createElement('button');
    a.className = 'answer__button';
    a.innerText = title;
    a.dataset.id = id;

    return answersContainer.appendChild(a);
}

/**
 * Clear all the fields
 */
function clearFields() {
    questionContainer.innerHTML = '';
    answersContainer.innerHTML = '';
}

/**
 * Initialize the video element
 */
function initVideo(videoId) {
    if (flvjs.isSupported()) {
        console.log('FLV is supported');
        const videoElement = document.getElementById('video_element');
        const flvPlayer = flvjs.createPlayer({
            type: 'flv',
            isLive: true,
            url: window.location.protocol + '//' + window.location.hostname + ':8000/live/' + videoId + '.flv'
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
    } else {
        alert('Video player could not be initialized.');
    }
}

