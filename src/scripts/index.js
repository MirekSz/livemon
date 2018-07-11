import '../styles/index.scss';
import layout from '../layout.html';
import modal from '../modal.html';
import {initFormHandlers} from './edition';


$(document).ready(() => {
    $("#layout").html(layout);
    $("#modal").html(modal);
    initFormHandlers();
});
