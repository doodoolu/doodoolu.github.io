var login_button = document.getElementsByClassName('btn btn-primary btn-user btn-block')[0]
var student_id = document.getElementsByClassName('form-control form-control-user')[0]
var pw = document.getElementsByClassName('form-control form-control-user')[1]

var retry_pw = document.getElementsByClassName('text-center')[1]

function checkPasswordValid() {
    firebase.database().ref(student_id.value).on('value', snapshot => {
        var snap = snapshot.val()
        if (snap === null) {
            retry_pw.style.color = 'red'
            retry_pw.style.fontSize = '0.9rem'
            retry_pw.textContent = 'You must be enrolled in PWS 109-2!'

        } else {
            if (snap['Password'] == pw.value) {
                localStorage.setItem('User', student_id.value);
                window.location.href = './index.html';

            } else {
                retry_pw.style.color = 'red'
                retry_pw.style.fontSize = '0.9rem'
                retry_pw.textContent = 'Wrong Username or Password, Please Try Again!'
            }

        }

    })
}


login_button.onclick = checkPasswordValid