var forgot_email = document.getElementById("exampleInputEmail")
var reset_button = document.getElementsByClassName("btn btn-primary btn-user btn-block")[0]
var reset_pw = document.getElementsByClassName('text-center')[1]
const email_input = document.getElementById("exampleInputEmail")

function validateEmail(email) {
    const re = /^([A-Za-z0-9_\-\.])+\@([ntu])+\.(edu)+\.(tw)$/;
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
    console.log(user_email)
    var user_name = user_email.slice(0, 9)
    if (validateEmail(user_email)) {
        firebase.database().ref().on('value', snapshot => {
                let snap = snapshot.val()
                if (snap[user_name] != null) {
                    reset_pw.textContent = ''
                    sendEmail(user_email, snap[user_name][0])

                } else {
                    reset_pw.textContent = 'You must be enrolled in PWS 2021 Spring class to retrieve your password!'
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
        From: "PWS期末第三組 <pwsfinalproject@gmail.com>",
        Subject: "Password Resend",
        Body: pw
    }).then(function() {
        reset_pw.textContent = 'Mail sent! Please check your NTU mail inbox!'
        reset_pw.style.color = 'green'
        reset_pw.style.fontSize = '0.9rem'

    });
}


reset_button.onclick = getEmail