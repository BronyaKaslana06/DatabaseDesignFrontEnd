<template>
  <Line :data="chartData" :options="options" />
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement, CategoryScale, LinearScale, LineElement, Filler } from 'chart.js'
import { toRefs, defineProps, reactive } from 'vue'


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Filler,
  Title,
  Tooltip,
  Legend
)

const options = reactive({
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    filler: {
      propagate: false,
    },

  }, interaction: {
    intersect: false,
    mode: "index",
  },

})

const props = defineProps({
  chartData: Object

})

const { chartData } = toRefs(props);


</script>