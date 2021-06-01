var login_button = document.getElementById('reset')
var student_id = document.getElementById('studentID')
var old_pw = document.getElementById('oldPassword')
var new_pw = document.getElementById('newPassword')
var confirm_pw = document.getElementById('confirmPassword')
var message = document.getElementById('displayMessage')


function checkPasswordValid() {
    if (student_id.value.length == 0) {
        message.textContent = 'Please enter StudentID!'
        message.style.color = 'red'
        message.style.fontSize = '0.9rem'

    } else
        firebase.database().ref(student_id.value).on('value', snapshot => {
            var snap = snapshot.val()
            if (old_pw.value.length == 0) {
                message.textContent = 'Please enter old password!'
                message.style.color = 'red'
                message.style.fontSize = '0.9rem'

            } else if (new_pw.value.length == 0) {
                message.textContent = 'Please enter new password!'
                message.style.color = 'red'
                message.style.fontSize = '0.9rem'

            } else if (confirm_pw.value.length == 0) {
                message.textContent = 'Please confirm new password!'
                message.style.color = 'red'
                message.style.fontSize = '0.9rem'

            } else {
                if (new_pw.value.length < 6) {

                    message.textContent = 'New password must be at least 6 characters!'
                    message.style.color = 'red'
                    message.style.fontSize = '0.9rem'
                } else {
                    if (new_pw.value != old_pw.value) {
                        if (new_pw.value == confirm_pw.value) {
                            if (snap['Password'] == old_pw.value) {
                                var updates = {}
                                updates['Password'] = new_pw.value
                                firebase.database().ref(student_id.value).update(updates)
                                message.textContent = 'Password reset successful!\n Please use new password to login.'
                                message.style.color = 'green'
                                message.style.fontSize = '0.9rem'
                                setInterval(function() {
                                    window.location.href = './login.html'
                                }, 5000)
                            } else {
                                message.style.fontSize = '0.9rem'
                                message.textContent = 'Wrong Username or Password, Please Try Again!'
                            }
                        } else {
                            message.textContent = 'New password and confirm password does not match, please check again!'
                            message.style.color = 'red'
                            message.style.fontSize = '0.9rem'

                        }
                    } else {
                        message.textContent = 'New password cannot be the same as old password!'
                        message.style.color = 'red'
                        message.style.fontSize = '0.9rem'

                    }
                }
            }
        })
}



login_button.onclick = checkPasswordValid