var chartCounter = 0;

export function clearCurrentCharts() {
    $("#charts").empty();
}

export function createChart(data) {
    $.ajax({
        url: 'http://localhost:3000/livemon?link=' + data.link,
        success: function (json) {
            if (data.batch) {
                for (let segment of Object.keys(json)) {
                    createChartsBaseOnDataType(Object.assign({}, data, {name: segment}), json[segment], segment);
                }
            } else {
                createChartsBaseOnDataType(data, json);
            }
        }
    });
}

function createChartsBaseOnDataType(data, json, segment) {
    if (isNumber(json)) {
        createChartInternal(data, [data.name], segment)
    } else {
        for (let key of Object.keys(json)) {
            if (isNumber(json[key])) {
                createChartInternal(data, Object.keys(json), segment);
                return;
            }
        }
    }
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

let createDataSets = function (datasetNames) {
    let datasets = [];
    for (let name of datasetNames) {
        datasets.push({label: name, data: [], borderColor: getRandomColor(), fill: false});
    }
    return datasets;
};

function createChartInternal(data, datasetNames, segment) {
    chartCounter++;
    $("#charts").append(`
     <div class=" col-sm-${data.columns}" >
        <canvas id="line-chart${chartCounter}" ></canvas>
     </div>`);

    let chart = new Chart.Line(document.getElementById(`line-chart${chartCounter}`).getContext("2d"), {
        type: 'line',
        data: {
            labels: [],
            datasets: createDataSets(datasetNames)
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
        getBacEndDataCached(data.link).then(function (json) {
            if (segment) {
                json = json[segment];
            }
            let na = chart.data.labels.slice(-200);
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
        });
    }, data.refreshPeriod * 1000);

}


function getBackEndData(link) {
    clearCache();
    return $.when($.ajax({
        url: 'http://localhost:3000/livemon?link=' + link
    }))
}

let getBacEndDataCached = _.memoize(getBackEndData);
let clearCache = _.debounce(function () {
    getBacEndDataCached.cache.clear();
}, 5000);

function getRandomColor() {
    let letters = '0123456789ABCDEF'.split('');
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
