<template>
  <Line :data="chartData" :options="options" />
</template>

<script setup>
import { Line } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, Legend, PointElement,CategoryScale, LinearScale,LineElement  } from 'chart.js'
import{toRefs, defineProps,reactive,onMounted} from 'vue'
import { stringifyQuery } from 'vue-router';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const options =reactive({
  responsive: true,
  maintainAspectRatio: false
})

const props = defineProps({
  chartData: Object

})

const {chartData} = toRefs(props);


</script>