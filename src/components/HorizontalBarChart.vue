<template>
    <Bar :data="chartData" :options="options" />
  </template>
  
  <script setup>
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, Title, Tooltip, BarElement, CategoryScale, LinearScale } from 'chart.js'
import { toRefs, defineProps, reactive, onMounted } from 'vue'
  
  
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip
  )
  
  const options = reactive({
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
        legend: {
      display: false,
    },
      filler: {
        propagate: false,
      },
  
    }
  
  })
  
  const props = defineProps({
    chartData: Object
  
  })
  
  const { chartData } = toRefs(props);
  
  
  </script>