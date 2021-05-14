var user = localStorage['User'];
var user = 'b06302352'
console.log(localStorage['User']);
const HW_NO = 5

if (user == null) {
    //window.location.href = './login.html';

} else {
    var body = document.getElementsByTagName('body')[0];
    body.style.visibility = 'visible';
}

var username_display = document.getElementById('username_display');
var student_id = document.getElementById('student_id');
username_display.textContent = user;
student_id.textContent = user;


var logout = document.getElementById('logout');
logout.onclick = function() {
    localStorage.removeItem('User');
    window.location.href = './login.html'
}


function createDoughnutChart(ctx, labels, data) {
    var submit_chart = new Chart(ctx, {
        type: 'doughnut',
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
            maintainAspectRatio: false,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
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
                hw_name + '\nAccepted Rate:\n' + data[0].toString() + '/' + data.reduce((a, b) => a + b, 0)
            resolve(doughnut)
        })


    })

}

function updateDoughnutChart(ctx, hw_name, chartx) {
    submit_db.database().ref().on('value', snapshot => {
        let snap = snapshot.val()
        let data = Object.values(snap[hw_name])
        chartx.data.datasets[0].data = data;
        if (hw_name.slice(0, 3) == 'PWS') {
            document.getElementById('datalabel' + hw_name.slice(-1)).textContent =
                hw_name + '\nAccepted Rate:\n' + data[0].toString() + '/' + data.reduce((a, b) => a + b, 0)

        } else {
            document.getElementById('datalabel' + hw_name.slice(-3, -2)).textContent =
                hw_name + '\nAccepted Rate:\n' + data[0].toString() + '/' + data.reduce((a, b) => a + b, 0)

        }
        chartx.update()

    })

}
async function initalizeCharts() {
    let charts = [];

    for (let i = 0; i < HW_NO; i++) {
        let ctx = document.getElementById('hw' + (i + 1).toString() + '_submit')
        let doughnut = await displayChart(ctx, 'PWS Homework ' + (i + 1).toString())
        charts.push(doughnut)
    }
    for (let i = 0; i < HW_NO; i++) {
        let dropdown = document.getElementById('hw' + (i + 1).toString() + '_dropdown')
        let questions = dropdown.getElementsByTagName('button')
        let ctx = document.getElementById('hw' + (i + 1).toString() + '_submit')
        for (let j = 0; j < questions.length; j++) {
            questions[j].onclick = function() {
                if (questions[j].textContent === '所有題目') {
                    updateDoughnutChart(ctx, 'PWS Homework ' + (i + 1).toString(), charts[i])

                } else {
                    updateDoughnutChart(ctx, 'HW' + (i + 1).toString() + '-' + questions[j].textContent.slice(-1), charts[i])

                }
            }
        }
    }
}
initalizeCharts()


function createMultiChart(ctx, labels, data) {
    var multi = new Chart(ctx, {
        type: 'bar',

        data: {
            labels: labels,
            datasets: [{
                    label: "AC_Rate",
                    type: 'line',
                    yAxisID: 'B',
                    fill: false,
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: data[0]
                },
                {
                    label: 'AC_Times',
                    barPercentage: 0.4,
                    lineTension: 0.3,
                    yAxisID: 'A',
                    backgroundColor: 'brown',
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: data[1]
                },
                {
                    label: 'WA_Times',
                    barPercentage: 0.4,
                    lineTension: 0.3,
                    yAxisID: 'A',
                    backgroundColor: 'gold',
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 3,
                    pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: data[2]
                },
            ],
        },
        options: {
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },
            scales: {
                xAxes: [{
                    stacked: true,
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },

                }],
                yAxes: [{
                    id: 'A',
                    type: 'linear',
                    position: 'left',

                    gridLines: {
                        display: false,
                    },

                }, {
                    id: 'B',
                    type: 'linear',
                    position: 'right',

                    gridLines: {
                        display: false,
                    }

                }],
            },
            legend: {
                display: false
            },
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
            }
        }

    });
    return multi;

}
var multiChart = document.getElementById('multiChart');
time_db.database().ref().on('value', snapshot => {
    let snap = snapshot.val()
    let ac_rate = Object.values(snap['AC Rate'])
    ac_rate = ac_rate.map(function(e) {
        return e.toFixed(4)
    })
    let ac = Object.values(snap['Accepted'])
    let wa = Object.values(snap['Wrong Answer'])
    let labels = Object.keys(snap['Accepted'])
    labels = labels.map(function(e) {
        return ('0' + e).slice(-2) + ':00'
    })
    createMultiChart(multiChart, labels, [ac_rate, ac, wa])
})

function getPercentData() {
    return new Promise((resolve, reject) => {
        rankings_db.database().ref().on('value', snapshot => {
            let snap = snapshot.val();
            resolve(snap[user]);
        })
    })
}
async function initializeProgressBar() {
    let percentage_chart = document.getElementById('hw_percentage')
    let progress_bar = percentage_chart.querySelectorAll('[role="progressbar"]');
    let progress_percentage = percentage_chart.getElementsByTagName('span');
    let hw_name = percentage_chart.getElementsByTagName('h4');

    let progress_dropdown = document.getElementById('progress_dropdown').getElementsByTagName('button');
    let dropdown_button_name = document.getElementById('percent_button');
    let user_percent = await getPercentData();
    let bar_6_exist = true;

    for (let i = 0; i < 5; i++) {
        progress_bar[i].style.width = user_percent['HW' + (i + 1).toString() + ' Total Score'].toString() + '%';
        progress_percentage[i].textContent = user_percent['HW' + (i + 1).toString() + ' Total Score'].toString() + '%'
        hw_name[i].childNodes[0].textContent = 'HW' + (i + 1).toString();

    }
    for (let i = 0; i < progress_dropdown.length; i++) {
        if (i == 0) {
            progress_dropdown[i].onclick = function() {
                if (!bar_6_exist) {
                    let h4 = document.createElement('h4');
                    h4.classList.add('small', 'font-weight-bold');
                    h4.textContent = 'HW6';
                    let span = document.createElement('span');
                    span.classList.add('float-right');
                    span.textContent = 'XXX%'
                    h4.appendChild(span);
                    let div = document.createElement('div');
                    div.classList.add('progress');
                    let childDiv = document.createElement('div');
                    childDiv.setAttribute('role', 'progressbar');
                    childDiv.classList.add('progress-bar', 'bg-success');
                    div.appendChild(childDiv);
                    progress_bar[4].parentNode.parentNode.appendChild(h4);
                    progress_bar[4].parentNode.parentNode.appendChild(div);
                    progress_bar[4].parentNode.classList.add('mb-4');
                    bar_6_exist = true;
                }
                for (let j = 0; j < HW_NO; j++) {
                    progress_bar = percentage_chart.querySelectorAll('[role="progressbar"]');
                    progress_bar[j].style.width = user_percent['HW' + (j + 1).toString() + ' Total Score'].toString() + '%';
                    progress_percentage[j].textContent = user_percent['HW' + (j + 1).toString() + ' Total Score'].toString() + '%'
                    dropdown_button_name.textContent = '所有題目';
                    hw_name[j].childNodes[0].textContent = 'HW' + (j + 1).toString();

                }
            }

        } else {
            progress_dropdown[i].onclick = function() {
                if (bar_6_exist) {
                    let bars = percentage_chart.querySelectorAll('[role="progressbar"]');
                    let bar_6_name = percentage_chart.getElementsByTagName('h4')[5];
                    bars[5].parentNode.parentNode.removeChild(bars[5].parentNode);
                    bars[4].parentNode.classList.remove('mb-4');
                    bar_6_name.parentNode.removeChild(bar_6_name)
                    bar_6_exist = false;
                }
                for (let j = 0; j < 5; j++) {
                    progress_bar[j].style.width = (user_percent['HW' + (i).toString() + '-' + (j + 1).toString()] * 5).toString() + '%';
                    progress_percentage[j].textContent = user_percent['HW' + (i).toString() + '-' + (j + 1).toString()].toString() + '%'
                    dropdown_button_name.textContent = 'HW ' + i.toString();
                    hw_name[j].childNodes[0].textContent = 'Problem ' + i.toString() + '-' + (j + 1).toString();

                }
            }

        }
    }

}
initializeProgressBar();

function initalizeRadarChart() {
    let ctx = document.getElementById('radar');
    let labels = ['1', '2', '3', '4', '5'];
    let data = ['44', '66', '23', '97', '50']
    var radar = new Chart(ctx, {
        type: 'radar',

        data: {
            labels: labels,
            datasets: [{
                    lineTension: 0.3,
                    backgroundColor: "rgba(78, 115, 223, 0.05)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    data: data
                },

            ],
        },
        options: {
            scale: {
                ticks: {
                    beginAtZero: true,
                }
            },
            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 25,
                    bottom: 0
                }
            },

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
                    title: (tooltipItem, data) => data.labels[tooltipItem[0].index]
                }

            },

        }

    });
    return radar;
}
initalizeRadarChart();