var forgot_email = document.getElementById("exampleInputEmail")
var reset_button = document.getElementById('forgot');
var reset_pw = document.getElementsByClassName('text-center')[1]
const email_input = document.getElementById("exampleInputEmail")

function validateEmail(email) {
    const re = /^([A-Za-z0-9_\-\.])+\@(ntu)+\.(edu)+\.(tw)$/;
    return re.test(email);
}

email_input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        getEmail();
        e.preventDefault()
    }
});

function getEmail() {
    var user_email = forgot_email.value
    var user_name = user_email.slice(0, 9)
    if (validateEmail(user_email)) {
        firebase.database().ref(user_name).on('value', snapshot => {
                let snap = snapshot.val()
                if (snap != null) {
                    reset_pw.textContent = ''
                    sendEmail(user_email, snap['Password']);


                } else {
                    reset_pw.textContent = 'You must be enrolled in PWS 109-2 to retrieve your password!'
                    reset_pw.style.color = 'red'
                    reset_pw.style.fontSize = '0.9rem'

                }
            }

        )
    } else {
        reset_pw.textContent = 'Please enter your NTU mail!'
        reset_pw.style.color = 'red'
        reset_pw.style.fontSize = '0.9rem'
    }
}

function sendEmail(email, pw) {
    Email.send({
        Host: "smtp.gmail.com",
        Username: "pwsfinalproject@gmail.com",
        Password: "pwsfinal2021",
        To: email,
        From: "PWS期末第三組 pwsfinalproject@gmail.com",
        Subject: "[PWS Final Project] 找回密碼",
        Body: email.slice(0, 9) + "您好，<br /><br />您的使用者密碼是： " + pw + "<br />請妥善保存喔～<br /><br />誰是佼佼者團隊 敬上"
    }).then(function() {
            reset_pw.textContent = 'Mail sent! Please check your NTU mail inbox!'
            reset_pw.style.color = 'green'
            reset_pw.style.fontSize = '0.9rem'
        }
        //message => alert(message) 
    )
};



reset_button.onclick = getEmail