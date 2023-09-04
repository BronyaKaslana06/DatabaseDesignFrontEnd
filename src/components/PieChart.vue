<template>
  <Pie :data="chartData" :options="options" />
</template>

<script setup>

import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { toRefs, defineProps, reactive } from 'vue'

ChartJS.register(ArcElement, Tooltip, Legend)

const options = reactive({
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'right',
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
