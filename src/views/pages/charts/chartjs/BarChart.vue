<script>
import { Bar } from "vue-chartjs";

export default {
  extends: Bar,
  mounted() {
    this.renderChart(
      {
        labels: [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July"
        ],
        datasets: [
          {
            barPercentage: 0.4,
            label: "Sales Analytics",
            backgroundColor: "rgba(28, 187, 140, 0.8)",
            borderColor: "rgba(28, 187, 140, 0.8)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(28, 187, 140, 0.9)",
            hoverBorderColor: "rgba(28, 187, 140, 0.9)",
            data: [65, 59, 81, 45, 56, 80, 50, 20]
          }
        ]
      },
      {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          xAxes: [
            {
              gridLines: {
                color: "rgba(166, 176, 207, 0.1)"
              }
            }
          ],
          yAxes: [
            {
              gridLines: {
                color: "rgba(166, 176, 207, 0.1)"
              }
            }
          ]
        }
      }
    );
  }
};
</script>