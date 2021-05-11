var login_button = document.getElementsByClassName('btn btn-primary btn-user btn-block')[0]
var email = document.getElementsByClassName('form-control form-control-user')[0]
var pw = document.getElementsByClassName('form-control form-control-user')[1]

var retry_pw = document.getElementsByClassName('text-center')[1]

function checkPasswordValid() {
    firebase.database().ref().on('value', snapshot => {
        var snap = snapshot.val()
        if (snap[email.value]['Password'] == pw.value) {
            localStorage.setItem('User', email.value);
            window.location.href = './index.html';

        } else {
            retry_pw.style.color = 'red'
            retry_pw.style.fontSize = '0.9rem'
            retry_pw.textContent = 'Wrong Username or Password, Please Try Again!'
        }

    })
}


login_button.onclick = checkPasswordValid