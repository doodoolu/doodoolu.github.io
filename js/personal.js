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
    let most_submit_times = document.getElementById('most_submit_times');
    let max_interval = document.getElementById('longest_submit_interval');
    let total_debug_time = document.getElementById('total_debug_time');


    page_db.database().ref().on('value', snapshot => {
        let snap = snapshot.val()
        let user_info = snap[user]
        let interval_time = user_info['max_interval'].match(/(\d+)\s(days)\s(\d+):(\d+):(\d+)/)

        max_interval.textContent = (parseInt(interval_time[1]) * 24 + parseInt(interval_time[3]) +
                parseFloat(interval_time[4]) / 60 + parseFloat(interval_time[5]) / 3600).toFixed(0).toString() + ' hours ' // + interval_time[4] + ' minute(s) ' + interval_time[5] + ' second(s)'
        let ac_hour = (user_info['best_working_time'].match(/(\d+),\s(\d+)/))
        ac_rate_max.textContent = ('0' + ac_hour[1]).slice(-2) + ':00 ~ ' + ac_hour[2] + ':00'
        let submit_hour = user_info['most_submission_period'].match(/(\d+),\s(\d+)/)
        most_submit_times.textContent = ('0' + submit_hour[1]).slice(-2) + ':00 ~ ' + submit_hour[2] + ':00'
        let sum_debug = 0;
        for (let i = 1; i <= HW_NO; i++) {
            let hw_debug = user_info['HW' + i.toString() + '_debugtime'].match(/(\d+)\s(days)\s(\d+):(\d+):(\d+)/)
            sum_debug += (parseInt(hw_debug[1]) * 24 + parseInt(hw_debug[3]) +
                parseFloat(hw_debug[4]) / 60 + parseFloat(hw_debug[5]) / 3600)

        }
        total_debug_time.textContent = sum_debug.toFixed(0) + ' hours';
    })

}
initializeBoxes();

function createRadarChart(ctx, labels, data) {
    var radar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                    lineTension: 0,
                    backgroundColor: "rgba(78, 115, 223, 0.2)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 3,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointHoverBorderColor: "rgba(78, 115, 223, 1)",
                    data: data
                },

            ],
        },
        options: {
            scale: {
                ticks: {
                    beginAtZero: true,
                    max: 100
                },
                gridLines: {
                    //color: ['black', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'black', 'red', 'orange', 'yellow', 'green', 'blue', 'indigo']
                },

                pointLabels: {
                    display: !/Android|webOS|iPhone|iPad/i.test(navigator.userAgent),
                    fontSize: 24
                }

            },

            maintainAspectRatio: false,
            layout: {
                padding: {
                    left: 10,
                    right: 25,
                    top: 10,
                    bottom: 0
                }
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
                callbacks: {
                    title: (tooltipItem, data) => data.labels[tooltipItem[0].index],
                    label: function(context) {
                        return parseFloat(context.value).toFixed(0);
                    }
                }

            },

        }

    });
    return radar;

}

function initalizeRadarChart() {
    let ctx = document.getElementById('radar');
    return new Promise((resolve, reject) => {

        radar_db.database().ref().on('value', snapshot => {
            let snap = snapshot.val()
            let user_info = snap[user]
            let labels = ['精確度', '難題大師', '完成度', '細心度', '效率']
            let data = Object.values(user_info)
            let multiplier = [1, 1.2, 1.2, 0.8, 0.8]
            let data_weighted = []
            for (let i = 0; i < 5; i++) {
                data[i] = ((1 - parseFloat(data[i])) * 100)
                data_weighted.push(data[i] * multiplier[i])

            }
            createRadarChart(ctx, labels, data)

            resolve(data_weighted.reduce((a, b) => parseFloat(a) + parseFloat(b), 0))
        })
    })
}

async function displayRank() {
    let total_score = await initalizeRadarChart();
    console.log(total_score)
    let img = document.getElementById('rank_image');
    let description = document.getElementById('rank_description');
    let header = document.getElementById('rank_header');
    if (/Android|webOS|iPhone|iPad/i.test(navigator.userAgent)) {
        header.style.fontSize = '2rem';
        description.style.fontSize = '1rem';
    }

    if (total_score >= 400) {
        img.setAttribute('src', './img/dynamax_charizard.png')
        header.textContent = '你是...\n超極巨化噴火龍！'
        description.textContent = '挖挖挖挖靠！是超極巨化噴火龍欸，同學你是天才吧～可以跟我說你都吃什麼長大的嗎?'


    } else if (total_score >= 300) {
        img.setAttribute('src', './img/mega_charizard.png')
        header.textContent = '你是...\nMega噴火龍！'
        description.textContent = '挖賽！是Mega噴火龍欸，同學你是第一次學程式嗎？作業不可能難倒你吧'

    } else if (total_score >= 200) {
        img.setAttribute('src', './img/charizard.png')
        header.textContent = '你是...噴火龍！'
        description.textContent = '挖～是噴火龍欸，同學你不用謙虛了，你已經掌握到Python的精隨了～'

    } else if (total_score >= 100) {
        img.setAttribute('src', './img/charmeleon.png')
        header.textContent = '你是...火恐龍！'
        description.textContent = '蛤～你是火恐龍，同學你的修練之路還很長，要再加把勁阿～'

    } else if (total_score < 100) {
        img.setAttribute('src', './img/charmander.png')
        header.textContent = '你是...小火龍！'
        description.textContent = 'ㄜㄜㄜ～你還是小火龍，同學你家沒有網路嗎？可憐阿～'
    }

}
displayRank()


function createBarChart(ctx, labels, data) {
    var submit_chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                barPercentage: 0.6,
                data: data,
                backgroundColor: ['#F94144', '#F8961E', '#F9C74F', '#90BE6D', '#43AA8B', '#577590'],
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
        progress_percentage[i].textContent = user_percent['HW' + (i + 1).toString() + ' Total Score'].toString() + '分'
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
                    progress_bar[j].style.width = user_percent['HW' + (j + 1).toString() + ' Total Score'].toString() + '%'
                    progress_percentage[j].textContent = user_percent['HW' + (j + 1).toString() + ' Total Score'].toString() + '分'
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
                    progress_percentage[j].textContent = user_percent['HW' + (i).toString() + '-' + (j + 1).toString()].toString() + '分'
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
                        maxTicksLimit: 11
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
                callbacks: {
                    title: function(tooltipItems, data) {
                        return tooltipItems[0].xLabel.slice(5, tooltipItems[0].xLabel.length).replace('-', '/');;
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
            console.log(data)
        }
    }

}
initializeLineChart();