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

function initializeBoxes() {
    let ac_rate_max = document.getElementById('ac_rate_max');

}
initializeBoxes();




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
                    },
                    scaleLabel: {
                        display: !/Android|webOS|iPhone|iPad/i.test(navigator.userAgent),
                        labelString: '繳交次數'
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

async function initializeBarChart() {
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

initializeBarChart()


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
                //backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgb(68,114,196)",
                pointRadius: 0,
                pointBackgroundColor: "rgba(78, 115, 223, 0.05",
                //pointBorderColor: "rgba(78, 115, 223, 1)",
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
                //backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "red",
                pointRadius: 0,
                pointBackgroundColor: "red",
                //pointBorderColor: "rgba(78, 115, 223, 1)",
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
                // backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "green",
                pointRadius: 0,
                pointBackgroundColor: "green",
                //pointBorderColor: "rgba(78, 115, 223, 1)",
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
                //backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "rgb(237,125,49)",
                pointRadius: 0,
                pointBackgroundColor: "rgb(237,125,49)",
                // pointBorderColor: "rgba(78, 115, 223, 1)",
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
                //backgroundColor: "rgba(78, 115, 223, 0.05)",
                borderColor: "violet",
                pointRadius: 0,
                pointBackgroundColor: "violet",
                //pointBorderColor: "rgba(78, 115, 223, 1)",
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
                        }
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
                        display: true,
                        labelString: '繳交次數'
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
    console.log(top, bottom)
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
            console.log(data)
        }
    }

}
initializeLineChart();