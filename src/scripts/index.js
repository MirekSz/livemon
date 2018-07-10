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
      <div class=" col-sm-${columns}">
    <canvas id="line-chart${chartCounter}" ></canvas>
  </div>
      `)

      let chart = new Chart.Line(document.getElementById(`line-chart${chartCounter}`).getContext("2d"), {
            type: 'line',
            data: {
                  labels: [1500, 1600, 1700, 1750, 1800, 1850, 1900, 1950, 1999, 2050],
                  datasets: [{
                        data: [86, 114, 106, 106, 107, 111, 133, 221, 783, 2478],
                        label: "Africa",
                        borderColor: "#3e95cd",
                        fill: false
                  }, {
                        data: [282, 350, 411, 502, 635, 809, 947, 1402, 3700, 5267],
                        label: "Asia",
                        borderColor: "#8e5ea2",
                        fill: false
                  }, {
                        data: [168, 170, 178, 190, 203, 276, 408, 547, 675, 734],
                        label: "Europe",
                        borderColor: "#3cba9f",
                        fill: false
                  }
                  ]
            },
            options: {
                  responsive: true,
                  tooltips: {
                        enabled: false
                  },
                  title: {
                        display: true,
                        text: 'World population per region (in millions)'
                  }
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
