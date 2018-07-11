import {clearCurrentCharts, createChart} from './chart';

let dirtyCharts = [];

export function initFormHandlers() {
    $("#chartForm").submit(handleSave);
    $("#chartForm input[name='link']").blur(checkLink);
    $("#saveAs").click(saveAs);
    restoreSavedCharts();
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
    showLastPanel();
}

function showLastPanel() {
    $(".dropdown-menu.saveAs a:last").click();
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
        $("#subname").text(` (${name})`);
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
