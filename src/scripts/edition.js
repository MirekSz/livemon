import {createChart} from './chart';


export function initFormHandlers() {
    $("#chartForm").submit(handleSave);
    $("#chartForm input[name='link']").blur(checkLink);
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

export function handleSave(e) {
    e.preventDefault();
    let data = $("#chartForm").serializeArray().reduce(function (previousValue, currentValue) {
        previousValue[currentValue.name] = currentValue.value;
        return previousValue;
    }, {});
    createChart(data);
    $('#exampleModal').modal('hide');
}
