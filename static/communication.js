// Fetch and display questions with replies
function loadQuestions() {
    fetch('/get_questions_with_replies')
    .then(response => response.json())
    .then(data => {
        let questionsContainer = document.getElementById('questions-container');
        questionsContainer.innerHTML = '';  // Clear previous content

        data.forEach(item => {
            let question = item.question;
            let replies = item.replies;

            // Display the question
            let questionDiv = document.createElement('div');
            questionDiv.classList.add('question');
            questionDiv.innerHTML = `
                <p>${question[1]}</p>
                <i class="fas fa-thumbs-up" onclick="vote(${question[0]}, 'like')"></i> 
                <span>${question[2]}</span>
                <i class="fas fa-thumbs-down" onclick="vote(${question[0]}, 'dislike')"></i> 
                <span>${question[3]}</span>
                <button onclick="submitReply(${question[0]})">Reply</button>
                <button onclick="deleteQuestion(${question[0]})">Delete</button>
                <div id="replies-${question[0]}"></div>
            `;
            
            // Display replies
            let repliesDiv = questionDiv.querySelector(`#replies-${question[0]}`);
            replies.forEach(reply => {
                let replyDiv = document.createElement('div');
                replyDiv.classList.add('reply');
                replyDiv.innerHTML = `<p>Reply: ${reply[2]}</p>`;
                repliesDiv.appendChild(replyDiv);
            });

            questionsContainer.appendChild(questionDiv);
        });
    });
}

// Submit a reply
function submitReply(questionId) {
    let replyText = prompt('Enter your reply:');
    if (replyText) {
        fetch(`/submit_reply/${questionId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `reply=${encodeURIComponent(replyText)}`
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            loadQuestions();  // Reload questions and replies
        });
    }
}

// Like or dislike a question
function vote(questionId, action) {
    fetch(`/vote/${questionId}/${action}`, {
        method: 'POST'
    })
    .then(response => response.text())
    .then(data => {
        alert(data);
        loadQuestions();  // Reload questions and votes
    });
}

// Delete a question (developer only)
function deleteQuestion(questionId) {
    if (confirm('Are you sure you want to delete this question?')) {
        fetch(`/delete_question/${questionId}`, {
            method: 'POST'
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            loadQuestions();  // Reload questions after deletion
        });
    }
}

// Initial load of questions
loadQuestions();