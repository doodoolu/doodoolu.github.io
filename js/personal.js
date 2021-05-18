var user = localStorage['User'];
var user = 'b06702055'
console.log(localStorage['User'])
const HW_NO = 5

if (user == null) {
    //window.location.href = './login.html';

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


function createBarChart(ctx, labels, data) {
    var submit_chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', 'red', 'gold', 'DodgerBlue', 'Navy'],
                //hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
                hoverBorderColor: "rgba(234, 236, 244, 1)",
            }],
        },
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            },
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                titleMarginBottom: 10,
                titleFontColor: '#6e707e',
                titleFontSize: 14,
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                intersect: false,
                mode: 'index',
                caretPadding: 10,
                callbacks: {
                    label: function(tooltipItem, data) {
                        return "Submit Times: " + tooltipItem.yLabel;
                    },
                }
            },
            legend: {
                display: false
            },
            cutoutPercentage: 80,
        },

    });
    return submit_chart
}

function displayChart(ctx, hw_name) {
    return new Promise((resolve, reject) => {
        submit_db.database().ref().on('value', snapshot => {
            let snap = snapshot.val()
            let labels = Object.keys(snap[hw_name])
            let data = Object.values(snap[hw_name])
            let doughnut = createDoughnutChart(ctx, labels, data)
            document.getElementById('datalabel' + hw_name.slice(-1)).textContent =
                hw_name + '\nTotal Submit Times:\n' + data.reduce((a, b) => a + b, 0)
            resolve(doughnut)
        })


    })

}

function updateBarChart(data, labels, barChart) {
    console.log(barChart)
    barChart.data.datasets[0].data = data;
    barChart.data.labels = labels;
    barChart.update();
}

function getSubmitTimes() {
    return new Promise((resolve, reject) => {

        try_db.database().ref().on('value', snapshot => {
            let snap = snapshot.val()
            let user_info = snap[user]
            let data = []
            let data_all = []

            for (let i = 0; i < HW_NO; i++) {
                let temp = []
                for (let j = 0; j < 5; j++) {
                    temp.push(user_info['HW' + (i + 1).toString() + '-' + (j + 1).toString() +
                        ' Submit count_0'])
                }
                data_all.push(temp.reduce((a, b) => a + b, 0))
                data.push(temp)
            }
            resolve([data, data_all])
        })

    })
}

async function initializeChart() {
    let ctx = document.getElementById('submit_chart');
    let try_name = document.getElementById('try_hw');
    let data_ary = await getSubmitTimes();
    let data = data_ary[0];
    let data_all = data_ary[1];
    console.log(data, data_all)
    let labels = []
    for (let i = 0; i < HW_NO; i++) {
        labels.push('Homework ' + (i + 1).toString())
    }
    let barChart = createBarChart(ctx, labels, data_all)
    try_name.textContent = '所有問題';

    let dropdown = document.getElementById('try_dropdown');
    let questions = dropdown.getElementsByTagName('button')
    for (let i = 0; i < questions.length; i++) {
        if (i == 0) {
            questions[i].onclick = function() {
                try_name.textContent = '所有問題';

                updateBarChart(data_all, labels, barChart)
            }
        } else {
            questions[i].onclick = function() {
                try_name.textContent = 'HW' + i.toString();
                let labels_q = ['Q1', 'Q2', 'Q3', 'Q4', 'Q5'];
                updateBarChart(data[i - 1], labels_q, barChart);
            }
        }
    }
}

initializeChart()


// function createMultiChart(ctx, labels, data) {
//     var multi = new Chart(ctx, {
//         type: 'bar',

//         data: {
//             labels: labels,
//             datasets: [{
//                     label: "AC_Rate",
//                     type: 'line',
//                     yAxisID: 'B',
//                     fill: false,
//                     lineTension: 0.3,
//                     backgroundColor: "rgba(78, 115, 223, 0.05)",
//                     borderColor: "rgba(78, 115, 223, 1)",
//                     pointRadius: 3,
//                     pointBackgroundColor: "rgba(78, 115, 223, 1)",
//                     pointBorderColor: "rgba(78, 115, 223, 1)",
//                     pointHoverRadius: 3,
//                     pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
//                     pointHoverBorderColor: "rgba(78, 115, 223, 1)",
//                     pointHitRadius: 10,
//                     pointBorderWidth: 2,
//                     data: data[0]
//                 },
//                 {
//                     label: 'AC_Times',
//                     barPercentage: 0.4,
//                     lineTension: 0.3,
//                     yAxisID: 'A',
//                     backgroundColor: 'brown',
//                     borderColor: "rgba(78, 115, 223, 1)",
//                     pointRadius: 3,
//                     pointBackgroundColor: "rgba(78, 115, 223, 1)",
//                     pointBorderColor: "rgba(78, 115, 223, 1)",
//                     pointHoverRadius: 3,
//                     pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
//                     pointHoverBorderColor: "rgba(78, 115, 223, 1)",
//                     pointHitRadius: 10,
//                     pointBorderWidth: 2,
//                     data: data[1]
//                 },
//                 {
//                     label: 'WA_Times',
//                     barPercentage: 0.4,
//                     lineTension: 0.3,
//                     yAxisID: 'A',
//                     backgroundColor: 'gold',
//                     borderColor: "rgba(78, 115, 223, 1)",
//                     pointRadius: 3,
//                     pointBackgroundColor: "rgba(78, 115, 223, 1)",
//                     pointBorderColor: "rgba(78, 115, 223, 1)",
//                     pointHoverRadius: 3,
//                     pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
//                     pointHoverBorderColor: "rgba(78, 115, 223, 1)",
//                     pointHitRadius: 10,
//                     pointBorderWidth: 2,
//                     data: data[2]
//                 },
//             ],
//         },
//         options: {
//             maintainAspectRatio: false,
//             layout: {
//                 padding: {
//                     left: 10,
//                     right: 25,
//                     top: 25,
//                     bottom: 0
//                 }
//             },
//             scales: {
//                 xAxes: [{
//                     stacked: true,
//                     gridLines: {
//                         display: false,
//                         drawBorder: false
//                     },
//                     ticks: {
//                         userCallback: function(value, index, values) {
//                             return ('0' + value).slice(-2) + ':00'

//                         },
//                     }

//                 }],
//                 yAxes: [{
//                     id: 'A',
//                     type: 'linear',
//                     position: 'left',

//                     gridLines: {
//                         display: false,
//                     },

//                 }, {
//                     id: 'B',
//                     type: 'linear',
//                     position: 'right',

//                     gridLines: {
//                         display: false,
//                     }

//                 }],
//             },
//             legend: {
//                 display: false
//             },
//             tooltips: {
//                 backgroundColor: "rgb(255,255,255)",
//                 bodyFontColor: "#858796",
//                 titleMarginBottom: 10,
//                 titleFontColor: '#6e707e',
//                 titleFontSize: 14,
//                 borderColor: '#dddfeb',
//                 borderWidth: 1,
//                 xPadding: 15,
//                 yPadding: 15,
//                 displayColors: false,
//                 intersect: false,
//                 mode: 'index',
//                 caretPadding: 10,
//             }
//         }

//     });
//     return multi;

// }
// var multiChart = document.getElementById('multiChart');
// time_db.database().ref().on('value', snapshot => {
//     let snap = snapshot.val()
//     console.log(snap)
//     let ac_rate = Object.values(snap['AC Rate'])
//     ac_rate = ac_rate.map(function(e) {
//         return e.toFixed(4)
//     })
//     let ac = Object.values(snap['Accepted'])
//     let wa = Object.values(snap['Wrong Answer'])
//     let labels = Object.keys(snap['Accepted'])
//     labels = labels.map(function(e) {
//         return ('0' + e).slice(-2) + ':00'
//     })
//     createMultiChart(multiChart, labels, [ac_rate, ac, wa])
// })