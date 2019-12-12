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
 *
 */
function init() {
    xhttp.open("GET", "/api/v1/init", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    // When there is an ajax call, the xhrChangeListener will be fired
    xhttp.onreadystatechange = xhrChangeListener;
    xhttp.send();
}


/**
 *
 */
function buttonListener() {
    xhttp.open("POST", "/api/v1/send-answer", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send("answer=" + this.dataset.id);
}

/**
 *
 */
function xhrChangeListener() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        const json = JSON.parse(this.response);
        const startedStream = json.started_stream;
        const videoId = json.video_id;
        const question = json.question;
        const answers = json.answers;
        const success = json.success;
        const message = json.message;

        if (videoId) {
            initVideo(videoId);
        }

        // todo check if json is valid


        clearFields();


        if (typeof question !== 'undefined' && success) {

            appendQuestion(question._description);

            for (let i in question._answers) {
                appendAnswer(answers[i]._id, answers[i]._description).onclick = buttonListener;
            }

        } else {
            // TODO Make this user friendly
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
 * Video
 */
function initVideo(videoId) {

    // TODO make this robust
    // TODO fix URL
    if (flvjs.isSupported()) {
        console.log('FLV is supported');
        const videoElement = document.getElementById('video_element');
        const flvPlayer = flvjs.createPlayer({
            type: 'flv',
            isLive: true,
            url: 'http://localhost:8000/live/' + videoId + '.flv'
        });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
    }
}

