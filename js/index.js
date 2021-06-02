var user = localStorage['User'];
const HW_NO = 6;
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
                    backgroundColor: "#43AA8B",
                    pointRadius: 3,
                    pointHoverRadius: 5,
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: data[0],
                },
                {
                    label: 'AC次數',
                    type: 'bar',
                    barPercentage: 0.8,
                    yAxisID: 'A',
                    backgroundColor: '#F94144',
                    borderColor: "#F94144",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 3,
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: data[1],
                },
                {
                    label: 'WA次數',
                    type: 'bar',
                    barPercentage: 0.8,
                    yAxisID: 'A',
                    backgroundColor: '#F9C74F',
                    borderColor: "#F9C74F",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 3,
                    pointHitRadius: 10,
                    pointBorderWidth: 2,
                    data: data[2],
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
                display: !/Android|webOS|iPhone|iPad/i.test(navigator.userAgent),
                position: 'right',
                labels: {
                    usePointStyle: true,
                    boxWidth: 6
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

}
initializeMultiChart()

function createLineChart(ctx, labels, data, data_label) {
    let LineChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                fill: false,
                label: data_label[0],
                lineTension: 0,
                borderWidth: 2,
                borderColor: "#F94144",
                pointRadius: 0,
                pointBackgroundColor: "#F94144",
                pointHoverRadius: 0,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: data[0]
            }, {
                fill: false,
                label: data_label[1],
                lineTension: 0,
                borderWidth: 2,
                borderColor: "#F9C74F",
                pointRadius: 0,
                pointBackgroundColor: "#F9C74F",
                pointHoverRadius: 0,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: data[1]
            }, {
                fill: false,
                label: data_label[2],
                lineTension: 0,
                borderWidth: 2,
                borderColor: "#90BE6D",
                pointRadius: 0,
                pointBackgroundColor: "#90BE6D",
                pointHoverRadius: 0,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: data[2]
            }, {
                fill: false,
                label: data_label[3],
                lineTension: 0,
                borderWidth: 2,
                borderColor: "#43AA8B",
                pointRadius: 0,
                pointBackgroundColor: "#43AA8B",
                pointHoverRadius: 0,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: data[3]
            }, {
                fill: false,
                label: data_label[4],
                lineTension: 0,
                borderWidth: 2,
                borderColor: "#577590",
                pointRadius: 0,
                pointBackgroundColor: "#577590",
                pointHoverRadius: 0,
                pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                pointHitRadius: 10,
                pointBorderWidth: 2,
                data: data[4]
            }],
        },
        options: {
            hover: {
                intersect: false,
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
            scales: {
                xAxes: [{
                    gridLines: {
                        display: false,
                        drawBorder: false
                    },
                    scaleLabel: {
                        display: !/Android|webOS|iPhone|iPad/i.test(navigator.userAgent),
                        labelString: '日期'
                    },

                    ticks: {
                        callback: function(value, index, values) {
                            return value.slice(5, value.length).replace('-', '/');
                        },
                        maxTicksLimit: 11,
                        maxRotation: 0,
                        minRotation: 0
                    }
                }],
                yAxes: [{
                    ticks: {
                        padding: 10,

                    },
                    gridLines: {
                        color: "rgb(234, 236, 244)",
                        zeroLineColor: "rgb(234, 236, 244)",
                        drawBorder: false,
                        borderDash: [2],
                        zeroLineBorderDash: [2]
                    },
                    scaleLabel: {
                        display: !/Android|webOS|iPhone|iPad/i.test(navigator.userAgent),
                        labelString: 'AC次數'
                    }


                }],
            },
            legend: {
                display: !/Android|webOS|iPhone|iPad/i.test(navigator.userAgent),
                labels: {
                    boxWidth: 10,
                },
                position: 'right'

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
                    title: function(tooltipItems, data) {
                        return tooltipItems[0].xLabel.slice(5, tooltipItems[0].xLabel.length).replace('-', '/');
                    },
                    label: function(tooltipItem, data) {
                        return data.datasets[tooltipItem.datasetIndex].label.slice(0, 2) + ' ' + data.datasets[tooltipItem.datasetIndex].label.slice(2) + ': ' + tooltipItem.yLabel + '次'
                    }
                }
            }
        }

    })
    return LineChart;
};

function updateLineChart(data, labels, lineChart, hw_name) {
    lineChart.data.labels = labels;
    for (let i = 0; i < 5; i++) {
        lineChart.data.datasets[i].data = data[i];
        lineChart.data.datasets[i].label = hw_name[i];
    }
    lineChart.update();

}

function getIndex(arr) {
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] != -1) {
            var top = i
            break
        }
    }
    for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i] != -1) {
            var bottom = i
            break
        }
    }
    return [top, bottom]
}

function getLineChartData() {
    return new Promise((resolve, reject) => {
        chart_db.database().ref().on('value', snapshot => {
            let snap = snapshot.val();
            resolve(snap);
        })
    })
}

async function initializeLineChart() {
    let submit_canvas = document.getElementById('submit_canvas');
    let submit_dropdown = document.getElementById('submit_dropdown').getElementsByTagName('button');
    let info = await getLineChartData();
    let data_label = Object.keys(info)

    let hw1_index = getIndex(Object.values(info['HW1-1']))
    let hw1_data = []
    let hw1_labels = Object.keys(info['HW1-1']).slice(hw1_index[0], hw1_index[1] + 1)
    for (let j = 1; j < 6; j++) {
        hw1_data.push(Object.values(info['HW1-' + j.toString()]).slice(hw1_index[0], hw1_index[1] + 1))
    }
    var lineChart = createLineChart(submit_canvas, hw1_labels, hw1_data, data_label.slice(0, 5))
    for (let i = 0; i < HW_NO; i++) {
        let data = []
        let index = getIndex(Object.values(info['HW' + (i + 1).toString() + '-1']))
        let labels = Object.keys(info['HW' + (i + 1).toString() + '-1']).slice(index[0], index[1] + 1)

        for (let j = 1; j < 6; j++) {
            data.push(Object.values(info['HW' + (i + 1).toString() + '-' + j.toString()]).slice(index[0], index[1] + 1))
        }
        submit_dropdown[i].onclick = function() {
            document.getElementById('submit_dropdown').parentNode.getElementsByTagName('button')[0].textContent = 'HW' + (i + 1).toString()
            updateLineChart(data, labels, lineChart, data_label.slice(i * 5, i * 5 + 5));

        }

    }
}
initializeLineChart();

var gslides = document.getElementById('google_slides');
gslides.onclick = function() {
    alert('滑鼠左鍵可下一頁\n鍵盤左右鍵可上/下一頁\nCtrl+Shift+F 可全螢幕播放')
}