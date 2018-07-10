import '../styles/index.scss';
import layout from '../layout.html';
import modal from '../modal.html';


$(document).ready(() => {
      $("#layout").html(layout);
      $("#modal").html(modal);
      $("#saveButton").click(handleSave);
});

var chartCounter = 0;
function handleSave() {
      chartCounter++;
      let columns = $("#chartForm input[name='columns']").val();
      if (!columns) {
            columns = 12;
      }
      $('#exampleModal').modal('hide');
      console.log($("#chartForm").serializeArray());
      $("#charts").append(`
      <div class=" col-sm-${columns}" >
    <canvas id="line-chart${chartCounter}" ></canvas>
  </div>
      `)

      let chart = new Chart.Line(document.getElementById(`line-chart${chartCounter}`).getContext("2d"), {
            type: 'line',
            data: {
                  labels: [],
                  datasets: [{
                        data: [],
                        label: "Africa",
                        borderColor: "#3e95cd",
                        fill: false
                  }
                  ]
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
                        enabled: false
                  },
                  title: {
                        display: true,
                        text: 'World population per region (in millions)'
                  }, legend: { display: false }
            }
      });
      var i = 0;
      setInterval(() => {
            i = i + 1;
            var na = chart.data.labels.slice(-200);
            na.push(i);
            chart.data.labels = na;
            chart.data.datasets.forEach(function (dataset) {
                  let nd = dataset.data.slice(-200);
                  nd.push((Math.floor(Math.random() * 1000) + i));
                  dataset.data = nd;
            });

            chart.update();
      }, 1000);

}
