var fragment = document.getElementById("dataTable")
var table = document.createElement("tbody");


var query = firebase.database().ref();
var title = ['When', 'ID', 'Status', 'Problem', 'Time', 'Memory', 'Language', 'Author', 'HW']
var load = document.getElementById('loading')
var current_time = Date.now()

query.once("value").then(function(snapshot) {
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
    fragment.appendChild(table);

    $(document).ready(function() {
        $('#dataTable').DataTable({});
        var passed = Date.now() - current_time
        load.textContent = 'Loading complete! Used ' + (passed / 1000).toString() + ' seconds. \nThis message will disappear after 5 seconds.'
        load.style.color = 'green'
        var timer = setInterval(function() {
            load.parentNode.removeChild(load)
            clearInterval(timer)
        }, 5000);
    });



})