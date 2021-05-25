var user = localStorage['User'];
const HW_NO = 5;
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

function initializeBoxes() {
    let student_id = document.getElementById('student_id');
    let submit_box = document.getElementById('submit_box');
    let ac_times_box = document.getElementById('ac_times_box');
    let avg_try_times = document.getElementById('avg_try_times');
    let ac_time_bar = document.getElementById('ac_times_bar');


    page_db.database().ref().on('value', snapshot => {
        let snap = snapshot.val();
        let user_info = snap[user];
        student_id.textContent = user;

        submit_box.textContent = user_info['total_submission'] + '次';
        ac_times_box.textContent = user_info['total_AC_count'] + '題';
        let finish_percent = ((parseFloat(user_info['total_AC_count']) / 30).toFixed(2) * 100).toString() + '%';
        ac_time_bar.style.width = finish_percent;
        ac_time_bar.textContent = finish_percent;
        if (user_info['avg_SubmitToAC'] === '無限多') {
            avg_try_times.textContent = '無限多次'
        } else {
            avg_try_times.textContent = parseFloat(user_info['avg_SubmitToAC']).toFixed(2) + '次'

        }
    })
}
initializeBoxes();

function createDoughnutChart(ctx, labels, data) {
    var submit_chart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: data,
                backgroundColor: ['#F94144', '#F8961E', '#F9C74F', 'purple', '#43AA8B', '#577590', '#90BE6D'],
                hoverBorderColor: "rgba(234, 236, 244, 1)",

            }],
        },
        options: {
            maintainAspectRatio: false,
            responsive: true,
            cutout: 0,
            tooltips: {
                backgroundColor: "rgb(255,255,255)",
                bodyFontColor: "#858796",
                borderColor: '#dddfeb',
                borderWidth: 1,
                xPadding: 15,
                yPadding: 15,
                displayColors: false,
                caretPadding: 10,
                z: 100,
            },
            legend: {
                display: false
            },
            cutoutPercentage: 70,
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
                    label: "AC率",
                    type: 'line',
                    yAxisID: 'B',
                    fill: false,
                    lineTension: 0,
                    borderColor: "#43AA8B",
                    pointRadius: 3,

                    pointHoverRadius: 5,
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: data[0]
                },
                {
                    label: 'AC次數',
                    barPercentage: 0.8,
                    yAxisID: 'A',
                    backgroundColor: '#F94144',
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 3,
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: data[1]
                },
                {
                    label: 'WA次數',
                    barPercentage: 0.8,
                    yAxisID: 'A',
                    backgroundColor: '#F9C74F',
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 3,
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
                    display: !/Android|webOS|iPhone|iPad/i.test(navigator.userAgent),

                    scaleLabel: {
                        display: !/Android|webOS|iPhone|iPad/i.test(navigator.userAgent),
                        labelString: '時間'
                    }

                }],
                yAxes: [{
                    id: 'A',
                    type: 'linear',
                    position: 'left',

                    gridLines: {
                        display: false,
                    },
                    scaleLabel: {
                        display: !/Android|webOS|iPhone|iPad/i.test(navigator.userAgent),
                        labelString: '提交次數',
                        rotation: 0,
                    },
                    display: !/Android|webOS|iPhone|iPad/i.test(navigator.userAgent),

                }, {
                    id: 'B',
                    type: 'linear',
                    position: 'right',

                    gridLines: {
                        display: false,
                    },
                    scaleLabel: {
                        display: !/Android|webOS|iPhone|iPad/i.test(navigator.userAgent),
                        labelString: 'AC率',
                    },
                    display: !/Android|webOS|iPhone|iPad/i.test(navigator.userAgent),

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

function initializeMultiChart() {
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
        let chart = createMultiChart(multiChart, labels, [ac_rate, ac, wa])

    })

    // var myBarExtend = Chart.controllers.bar.prototype.draw;

    // Chart.helpers.extend(Chart.controllers.bar.prototype, {
    //     draw: function() {
    //         myBarExtend.apply(this, arguments);
    //         var xOffset = 15;
    //         var yOffset = 10
    //         multiChart.getContext('2d').fillStyle = "gray";
    //         multiChart.getContext('2d').fillText('人數', xOffset, yOffset);
    //     }
    // });

}
initializeMultiChart()