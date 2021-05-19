var user = localStorage['User'];
//var user = 'b06703012'
console.log(localStorage['User']);
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
    let student_id = document.getElementById('student_id');
    let submit_box = document.getElementById('submit_box');
    let ac_times_box = document.getElementById('ac_times_box');
    let try_times_box = document.getElementById('try_times_box');
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
                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc', 'red', 'gold', 'DodgerBlue', 'Navy'],
                //hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
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
                    label: "AC_Rate",
                    type: 'line',
                    yAxisID: 'B',
                    fill: false,
                    lineTension: 0,
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
                    barPercentage: 0.8,
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
                    barPercentage: 0.8,
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
                    }


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



function createRadarChart(ctx, labels, data) {
    var radar = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: labels,
            datasets: [{
                    lineTension: 0,
                    backgroundColor: "rgba(78, 115, 223, 0.2)",
                    borderColor: "rgba(78, 115, 223, 1)",
                    pointRadius: 5,
                    pointBackgroundColor: "rgba(78, 115, 223, 1)",
                    pointBorderColor: "rgba(78, 115, 223, 1)",
                    pointHoverRadius: 3,
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
                        return context.value + '分';
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
            data = data.map(currentValue => ((1 - parseFloat(currentValue)).toFixed(4) * 100).toString())
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

    if (total_score >= 4) {
        img.setAttribute('src', './img/dynamax_charizard.png')
        header.textContent = '你是...\n超極巨化噴火龍！'
        description.textContent = '你超強的啦，怎麼會來上這種課勒，不要一直電好不好'

    } else if (total_score >= 3) {
        img.setAttribute('src', './img/mega_charizard.png')
        header.textContent = '你是...\nMega噴火龍！'
        description.textContent = '你很強欸，怎麼會來上這種課勒，不要一直電好不好'



    } else if (total_score >= 2) {
        img.setAttribute('src', './img/charizard.png')
        header.textContent = '你是...噴火龍！'
        description.textContent = '你有點強欸，怎麼會來上這種課勒，不要一直電好不好'



    } else if (total_score >= 1) {
        img.setAttribute('src', './img/charmeleon.png')
        header.textContent = '你是...火恐龍！'
        description.textContent = '你不錯欸，怎麼會來上這種課勒，不要一直電好不好'



    } else if (total_score < 1) {
        img.setAttribute('src', './img/charmander.png')
        header.textContent = '你是...小火龍！'
        description.textContent = '無話可說'



    }
    console.log(total_score)

}
displayRank()