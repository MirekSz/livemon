var chartCounter = 0;

export function createChart(data) {
    $.ajax({
        url: 'http://localhost:3000/livemon?link=' + data.link,
        success: function (json) {
            if (isNumber(json)) {
                createChartInternal(data, [data.name])
            } else {
                for (let key of Object.keys(json)) {
                    if (isNumber(json[key])) {
                        createChartInternal(data, Object.keys(json));
                        return;
                    }
                }
            }
        }
    });
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

function createChartInternal(data, datasetNames) {
    chartCounter++;
    $("#charts").append(`
      <div class=" col-sm-${data.columns}" >
    <canvas id="line-chart${chartCounter}" ></canvas>
  </div>
      `);
    let datasets = [];
    for (let name of datasetNames) {
        datasets.push({label: name, data: [], borderColor: getRandomColor(), fill: false});
    }
    let chart = new Chart.Line(document.getElementById(`line-chart${chartCounter}`).getContext("2d"), {
        type: 'line',
        data: {
            labels: [],
            datasets: datasets
        },
        options: {
            scales:
                {
                    xAxes: [{
                        display: false
                    }]
                },
            responsive: true,
            tooltips: {
                enabled: true
            },
            title: {
                display: true,
                text: data.name
            }, legend: {display: true}
        }
    });
    setInterval(() => {
        debugger;
        $.ajax({
            url: 'http://localhost:3000/livemon?link=' + data.link,
            success: function (json) {
                var na = chart.data.labels.slice(-200);
                na.push(new Date());
                chart.data.labels = na;
                if (isNumber(json)) {
                    chart.data.datasets.forEach(function (dataset) {
                        let nd = dataset.data.slice(-200);
                        nd.push(json);
                        dataset.data = nd;
                    });
                } else {
                    chart.data.datasets.forEach(function (dataset) {
                        let nd = dataset.data.slice(-200);
                        nd.push(json[dataset.label]);
                        dataset.data = nd;
                    });
                }
                chart.update();
            },
        });


    }, data.refreshPeriod * 1000);

}


function getRandomColor() {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
