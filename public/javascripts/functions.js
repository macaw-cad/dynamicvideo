/**
 *
 * test
 *
 *
 */
let xhttp = new XMLHttpRequest();



const questionField = document.getElementById("question_field");

// todo make this flexible (for example: there may be a possibility where there are three answers)
const answerField = document.getElementById('answers');

console.log(questionField);

xhttp.open("POST", "/api/v1/send-answer", true);
xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
xhttp.onreadystatechange = function() {
    if (this.readyState === XMLHttpRequest.DONE && this.status === 200) {
        let j = JSON.parse(this.response);


        console.log(questionField);
        console.log(j._description);
        questionField.innerText = j._description;

        answerField.innerHTML = '';
        for(let id in j._answers) {
            let e = document.createElement('button');
            e.innerText = j._answers[id];

            answerField.appendChild(e);
        }



    }
}
xhttp.send("answer=4");