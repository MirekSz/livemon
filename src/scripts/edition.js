import {createChart} from './chart';

let dirtyCharts = [];

let restoreSavedCharts = function () {
    let savedCharts = localStorage.getItem('livemon.saved');
    if (savedCharts) {
        savedCharts = JSON.parse(savedCharts);
    } else {
        savedCharts = [];
    }
    for (let save of savedCharts) {
        updateSaveAsGUI(save);
    }
};

export function initFormHandlers() {
    $("#chartForm").submit(handleSave);
    $("#chartForm input[name='link']").blur(checkLink);
    $("#saveAs").click(saveAs);
    restoreSavedCharts();
}

function checkLink(e) {
    let link = e.target.value;
    $.ajax({
        url: 'http://localhost:3000/livemon?link=' + link,
        success: function (d) {
            $("#chartForm input[name='link']").removeClass('is-invalid');
            $("#chartForm input[name='link']").addClass('is-valid');
        },
        error: function (e) {
            $("#chartForm input[name='link']").removeClass('is-valid');
            $("#chartForm input[name='link']").addClass('is-invalid');
            $(".invalid-feedback").html(e.status + ' ' + e.statusText);
        }
    });
}

function updateSaveAsGUI(name) {
    $(".dropdown-menu.saveAs").append(`<a class="dropdown-item" href="#" onclick="showPanel(${name}}">${name}</a>`);
    $("#saveAsCounter").html($(".dropdown-item").length);
}

function storeInLocalStorage(name) {
    let savedCharts = localStorage.getItem('livemon.saved');
    if (savedCharts) {
        savedCharts = JSON.parse(savedCharts);
    } else {
        savedCharts = [];
    }
    let saveddirtyCharts = localStorage.getItem('livemon.dirtyCharts');
    if (saveddirtyCharts) {
        saveddirtyCharts = JSON.parse(saveddirtyCharts);
    } else {
        saveddirtyCharts = {};
    }
    savedCharts.push(name);
    saveddirtyCharts[name] = dirtyCharts;
    localStorage.setItem('livemon.saved', JSON.stringify(savedCharts));
    localStorage.setItem('livemon.dirtyCharts', JSON.stringify(saveddirtyCharts));
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
