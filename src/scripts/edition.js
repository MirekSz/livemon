import {clearCurrentCharts, createChart} from './chart';

let dirtyCharts = [];
let currentChart;

export function initFormHandlers() {
    $("#chartForm").submit(handleSave);
    $("#importForm").submit(importAction);
    $("#chartForm input[name='link']").blur(checkLink);
    $("#saveAs").click(saveAs);
    $("#exportAction").click(exportAction);
    restoreSavedCharts();
}

function exportAction() {
    let charts = getCharts(currentChart);
    $("#export").val(JSON.stringify(charts, undefined, 4));
}

function importAction(e) {
    e.preventDefault();
    let data = $("#importForm").serializeArray().reduce(function (previousValue, currentValue) {
        previousValue[currentValue.name] = currentValue.value;
        return previousValue;
    }, {});
    clearCurrentCharts();
    for (let chart of JSON.parse(data.json)) {
        createChart(chart);
    }
    $('#importModal').modal('hide');
}

function restoreSavedCharts() {
    let savedCharts = localStorage.getItem('livemon.saved');
    if (savedCharts) {
        savedCharts = JSON.parse(savedCharts);
    } else {
        savedCharts = {};
    }
    for (let save of  Object.keys(savedCharts)) {
        updateSaveAsGUI(save);
    }
    let lastSelected = localStorage.getItem('livemon.lastSelected');
    showLastPanel(lastSelected);
}

function showLastPanel(lastSelected) {
    if (!lastSelected) {
        $(".dropdown-menu.saveAs a:last").click();
    } else {
        $(`.dropdown-menu.saveAs a:contains('${lastSelected}')`).click();
    }
}

function checkLink(e) {
    let link = e.target.value;
    let linkField = $("#chartForm input[name='link']");
    $.ajax({
        url: 'http://localhost:3000/livemon?link=' + link,
        success: function (d) {
            linkField.removeClass('is-invalid');
            linkField.addClass('is-valid');
        },
        error: function (e) {
            linkField.removeClass('is-valid');
            linkField.addClass('is-invalid');
            $(".invalid-feedback").html(e.status + ' ' + e.statusText);
        }
    });
}

function updateSaveAsGUI(name) {
    $(".dropdown-menu.saveAs").append(`<a class="dropdown-item" href="#" >${name}</a>`);
    $("#saveAsCounter").html($(".dropdown-item").length);
    $(".dropdown-menu.saveAs a:last").click(() => {
        debugger;
        currentChart = name;
        $("#subname").text(` (${name})`);
        localStorage.setItem('livemon.lastSelected', name);
        let charts = getCharts(name);
        clearCurrentCharts();
        for (let chart of charts) {
            createChart(chart);
        }
    });
}

function storeInLocalStorage(name) {
    let savedCharts = localStorage.getItem('livemon.saved');
    if (savedCharts) {
        savedCharts = JSON.parse(savedCharts);
    } else {
        savedCharts = {};
    }
    savedCharts[name] = dirtyCharts;
    localStorage.setItem('livemon.saved', JSON.stringify(savedCharts));
    dirtyCharts = [];
}

function saveAs(e) {
    let name = prompt("Please enter name");
    if (name) {
        updateSaveAsGUI(name);
        storeInLocalStorage(name);
    }
}


export function handleSave(e) {
    e.preventDefault();
    let data = $("#chartForm").serializeArray().reduce(function (previousValue, currentValue) {
        previousValue[currentValue.name] = currentValue.value;
        return previousValue;
    }, {});
    createChart(data);
    dirtyCharts.push(data);
    $('#chartFormModal').modal('hide');
}

function getCharts(name) {
    let saveddirtyCharts = JSON.parse(localStorage.getItem('livemon.saved'));
    return saveddirtyCharts[name];
}
