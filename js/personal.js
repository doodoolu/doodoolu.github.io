var user = localStorage['User'];
const HW_NO = 6

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
        ac_rate_max.textContent = ('0' + ac_hour[1]).slice(-2) + ':00 ~ ' + ('0' + ac_hour[2]).slice(-2) + ':00'
        let submit_hour = user_info['most_submission_period'].match(/(\d+),\s(\d+)/)
        most_submit_times.textContent = ('0' + submit_hour[1]).slice(-2) + ':00 ~ ' + ('0' + submit_hour[2]).slice(-2) + ':00'
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
            let labels = ['精確度', '細心度', '難題大師', '完成度', '效率']
            let data = Object.values(user_info)
            let data_weighted = []
            for (let i = 0; i < 5; i++) {
                data[i] = ((1 - parseFloat(data[i])) * 100)
            }
            createRadarChart(ctx, labels, data)
            resolve(data.reduce((a, b) => parseFloat(a) + parseFloat(b), 0))
        })
    })
}

async function displayRank() {
    let total_score = await initalizeRadarChart();
    let img = document.getElementById('rank_image');
    let description = document.getElementById('rank_description');
    let header = document.getElementById('rank_header');
    if (/Android|webOS|iPhone|iPad/i.test(navigator.userAgent)) {
        header.style.fontSize = '2rem';
        description.style.fontSize = '1rem';
    }

    if (total_score >= 350) {
        img.setAttribute('src', './img/dynamax_charizard.png')
        header.textContent = '你是...\n超極巨化噴火龍！'
        description.textContent = '挖挖挖挖靠！是超極巨化噴火龍欸，同學你是天才吧～可以跟我說你都吃什麼長大的嗎?'


    } else if (total_score >= 300) {
        img.setAttribute('src', './img/mega_charizard.png')
        header.textContent = '你是...\nMega噴火龍！'
        description.textContent = '挖賽！是Mega噴火龍欸，同學你是第一次學程式嗎？作業不可能難倒你吧'

    } else if (total_score >= 250) {
        img.setAttribute('src', './img/charizard.png')
        header.textContent = '你是...噴火龍！'
        description.textContent = '挖～是噴火龍欸，同學不用謙虛，你已經掌握到Python的精隨了～'

    } else if (total_score >= 100) {
        img.setAttribute('src', './img/charmeleon.png')
        header.textContent = '你是...火恐龍！'
        description.textContent = 'Hmmm～你是火恐龍，同學你的修練之路還很長，要再加把勁阿～'

    } else if (total_score < 100) {
        img.setAttribute('src', './img/charmander.png')
        header.textContent = '你是...小火龍！'
        description.textContent = '啊喔…你還是小火龍，同學可以多和教授、助教討論喔～'
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
        labels.push('HW ' + (i + 1).toString())
    }
    let barChart = createBarChart(ctx, labels, data_all)
    try_name.textContent = '所有題目';

    let dropdown = document.getElementById('try_dropdown');
    let questions = dropdown.getElementsByTagName('button')
    for (let i = 0; i < questions.length; i++) {
        if (i == 0) {
            questions[i].onclick = function() {
                try_name.textContent = '所有題目';

                updateBarChart(data_all, labels, barChart)
            }
        } else {
            questions[i].onclick = function() {
                try_name.textContent = 'HW' + i.toString();
                let labels_q = [];
                for (let j = 1; j < 6; j++) {
                    labels_q.push('HW ' + i.toString() + '-' + j.toString())

                }
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

    for (let i = 0; i < HW_NO; i++) {
        progress_bar[i].style.width = user_percent['HW' + (i + 1).toString() + ' Total Score'].toString() + '%';
        progress_percentage[i].textContent = user_percent['HW' + (i + 1).toString() + ' Total Score'].toString() + '分'
        hw_name[i].childNodes[0].textContent = 'HW ' + (i + 1).toString();

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
                    hw_name[j].childNodes[0].textContent = 'HW ' + (j + 1).toString();

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
                    hw_name[j].childNodes[0].textContent = 'HW ' + i.toString() + '-' + (j + 1).toString();

                }
            }

        }
    }

}
initializeProgressBar();