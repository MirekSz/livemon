import {createChart} from './chart';

export function initFormHandlers() {
    $("#chartForm").submit(handleSave);
    $("#chartForm input[name='link']").blur(checkLink);
    $("#saveAs").click(saveAs);
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

export function saveAs() {
    let name = prompt("Please enter name");
    $(".dropdown-menu.saveAs").append(`<a class="dropdown-item" href="#">${name}</a>`);

    $("#saveAsCounter").html($(".dropdown-item").length);

}

export function handleSave(e) {
    e.preventDefault();
    let data = $("#chartForm").serializeArray().reduce(function (previousValue, currentValue) {
        previousValue[currentValue.name] = currentValue.value;
        return previousValue;
    }, {});
    createChart(data);
    $('#chartFormModal').modal('hide');
}
