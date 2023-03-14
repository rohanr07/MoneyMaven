var salesData = {
  labels: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ],
  datasets: [
    {
      label: "Front",
      fillColor: "rgba(247, 80, 90, 0.0)",
      strokeColor: "#F7505A",
      pointColor: "#F7505A",
      pointStrokeColor: "rgba(0,0,0,0.2)",
      pointHighlightStroke: "rgba(225,225,225,0.75)",
      data: [
        3300, 2000, 3500, 1500, 2500, 3300, 1000, 2342, 2132, 456, 4377, 3234,
      ],
    },
    {
      label: "Middle",
      fillColor: "rgba(255, 172, 100, 0.0)",
      strokeColor: "rgba(255, 172, 100, 1)",
      pointColor: "rgba(255, 172, 100, 1)",
      pointStrokeColor: "rgba(0,0,0,0.2)",
      pointHighlightStroke: "rgba(225,225,225,0.75)",
      data: [
        3900, 2700, 4100, 1600, 2200, 2400, 3000, 2332, 4212, 1234, 3215, 2110,
      ],
    },
    {
      label: "Back",
      fillColor: "rgba(19, 71, 34, 0.0)",
      strokeColor: "rgba(88, 188, 116, 1)",
      pointColor: "rgba(88, 188, 116, 1)",
      pointStrokeColor: "rgba(0,0,0,0.2)",
      pointHighlightStroke: "rgba(225,225,225,0.75)",
      data: [
        3000, 2400, 2100, 3600, 3000, 2200, 3400, 3212, 332, 1232, 1253, 3252,
      ],
    },
  ],
};
var dashboard_btn = document.querySelector(".dashboard_btn");
var gdpr_btn = document.querySelector("#gdpr_btn");

dashboard_btn.addEventListener("click", refreshpage);
function refreshpage() {
  location.reload();
}

var ctx = document.getElementById("salesData").getContext("2d");

window.myLineChart = new Chart(ctx).Line(salesData, {
  pointDotRadius: 6,
  pointDotStrokeWidth: 2,
  datasetStrokeWidth: 3,
  scaleShowVerticalLines: false,
  scaleGridLineWidth: 2,
  scaleShowGridLines: true,
  scaleGridLineColor: "rgba(225, 255, 255, 0.015)",
  scaleOverride: true,
  scaleSteps: 9,
  scaleStepWidth: 500,
  scaleStartValue: 0,

  responsive: true,
});

var creditSales = new ProgressBar.Circle("#creditSales", {
  color: "#F7505A",
  strokeWidth: 5,
  trailWidth: 3,
  duration: 1000,
  text: {
    value: "0%",
  },
  step: function (state, bar) {
    bar.setText((bar.value() * 100).toFixed(0) + "%");
  },
});
var channelSales = new ProgressBar.Circle("#channelSales", {
  color: "#e88e3c",
  strokeWidth: 5,
  trailWidth: 3,
  duration: 1000,
  text: {
    value: "0%",
  },
  step: function (state, bar) {
    bar.setText((bar.value() * 100).toFixed(0) + "%");
  },
});
var directSales = new ProgressBar.Circle("#directSales", {
  color: "#2bab51",
  strokeWidth: 5,
  trailWidth: 3,
  duration: 1000,
  text: {
    value: "0%",
  },
  step: function (state, bar) {
    bar.setText((bar.value() * 100).toFixed(0) + "%");
  },
});
creditSales.animate(0.8);
channelSales.animate(0.64);
directSales.animate(0.34);
