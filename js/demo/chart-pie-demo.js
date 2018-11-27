// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#292b2c';

// Pie Chart Example
var ctx = document.getElementById("myPieChart");
let x = {
  type: 'pie',
  data: {
    labels: ["Losses", "Draws", "Wins"],
    datasets: [{
      data: [],
      backgroundColor: ['#dc3545', '#ffc107', '#28a745'],
    }],
  },
};
// x.data.datasets[0].data = [clubTableJSON[0].overall_league_L, clubTableJSON[0].overall_league_D, clubTableJSON[0].overall_league_W];
x.data.datasets[0].data = [3, 3, 3];
var myPieChart = new Chart(ctx, x);
