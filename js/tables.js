var user = localStorage['User'];
const HW_NO = 5

if (user == null) {
    window.location.href = './login.html';

} else {
    var body = document.getElementsByTagName('body')[0];
    body.style.visibility = 'visible';
}
var username_display = document.getElementById('username_display');
username_display.textContent = user;
var logout = document.getElementById('logout');
logout.onclick = function() {
    localStorage.removeItem('User');
    window.location.href = './login.html'
}


var current_time = Date.now()

function getTable() {
    var table = document.createElement("tbody");
    var title = ['When', 'ID', 'Status', 'Problem', 'Time', 'Memory', 'Language', 'Author', 'HW']


    return new Promise((resolve, reject) => {

        firebase.database().ref().once("value").then(function(snapshot) {
            var trValues = Object.values(snapshot.val())
            for (var i = 0; i < trValues.length; i++) {
                var tr = document.createElement("tr");

                for (var j = 0; j < title.length; j++) {
                    var td = document.createElement("td");
                    td.textContent = trValues[i][title[j]];
                    tr.appendChild(td);
                }
                table.appendChild(tr);
            }
            resolve(table)
        })
    })
}

async function displayTable() {
    var fragment = document.getElementById("dataTable")
    var load = document.getElementById('loading')


    let table_data = await getTable();
    fragment.appendChild(table_data);

    $(document).ready(function() {
        $('#dataTable').DataTable({});
        var passed = Date.now() - current_time
        load.textContent = '準備完畢! 花了 ' + (passed / 1000).toString() + '秒. \n這個訊息五秒後就會自動消失'
        load.style.color = 'green'
        var timer = setInterval(function() {
            load.parentNode.removeChild(load)
            clearInterval(timer)
        }, 5000);
    });
}
displayTable();