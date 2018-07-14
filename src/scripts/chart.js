var chartCounter = 0;
let currentIntervals = [];
const MAX_ROWS = 1000;

export function clearCurrentCharts() {
    $("#charts").empty();
    for (let i of currentIntervals) {
        clearInterval(i);
    }
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
                createChartInternal(data, Object.keys(json).filter(el => isNumber(json[el])), segment);
                return;
            }
        }
    }
}

function isNumber(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

let SKIP = ['memorySizeInBytes', 'hitCount', 'missCount'];
const LP = 'LP';
let createDataSets = function (datasetNames) {
    let datasets = [LP];
    for (let name of datasetNames) {
        if (SKIP.indexOf(name) !== -1) {
            continue;
        }
        datasets.push(name);
    }
    return datasets;
};

function drawChart() {
    var data = google.visualization.arrayToDataTable([
        ['x', 'Sales', 'Expenses', 'Year', 'Sales', 'Expenses', 'Sales', 'Expenses', 'Year', 'Sales', 'Expenses'],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]);

    var options = {
        vAxis: {gridlines: {count: 100}},
        title: 'Company Performance',
        curveType: 'function',
        legend: {position: 'bottom'}
    };

    var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));

    chart.draw(data, options);
}

google.charts.setOnLoadCallback(drawChart);

function createChartInternal(data, datasetNames, segment) {
    chartCounter++;
    $("#charts").append(`
     <div class=" col-sm-${data.columns}" >
        <div id="line-chart${chartCounter}" ></div>
     </div>`);

    let dataSets = createDataSets(datasetNames);
    var dataStore = google.visualization.arrayToDataTable([dataSets, dataSets.map(e => 0)]);
    var options = {
        hAxis: {
            gridlineColor: 'transparent'
        },
        title: data.name,
        curveType: 'function',
        legend: {position: 'bottom'},
        animation: {
            duration: 1000,
            easing: 'out',
        },
    };

    var chart = new google.visualization.LineChart(document.getElementById(`line-chart${chartCounter}`));
    chart.draw(dataStore, options);

    let datanumber = 0;
    currentIntervals.push(setInterval(() => {
        getBacEndDataCached(data.link).then(function (json) {
            let numberOfRows = dataStore.getNumberOfRows();
            if (numberOfRows > MAX_ROWS) {
                dataStore.removeRow(0)
            }
            if (segment) {
                json = json[segment];
            }
            if (isNumber(json)) {
                dataStore.addRow([datanumber++, json]);
            } else {
                let row = [datanumber++];
                for (let data of dataSets) {
                    if (data !== LP) {
                        if (isNumber(json[data])) {
                            row.push(Number(json[data]));
                        } else {
                            row.push(datanumber++)
                        }

                    }
                }
                dataStore.addRow(row);
            }
            chart.draw(dataStore, options);
        });
    }, data.refreshPeriod * 1000));

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
