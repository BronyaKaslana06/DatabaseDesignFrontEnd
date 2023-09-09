<template>
  <div style="margin-right: 40px;display: flex;flex-direction: column;height: 100%;">
    <div class="info-card">
      <div class="info-card-item">
        <div class="info-card-value">{{ infoSet.owner_count }}</div>
        <div :class="growthRcd.owner_growth === true ? 'up' : 'down'">{{ growthSet.owner_growth }}</div>
        <div class="info-card-label">总用户数</div>
      </div>

      <div class="info-card-item">
        <div class="info-card-value">{{ infoSet.switch_count }}</div>
        <div :class="growthRcd.request_growth === true ? 'up' : 'down'">{{ growthSet.request_growth }}</div>
        <div class="info-card-label">总订单数</div>
      </div>
      <div class="info-card-item">
        <div class="info-card-value">{{ infoSet.staff_count }}</div>
        <div :class="growthRcd.staff_growth === true ? 'up' : 'down'">{{ growthSet.staff_growth }}</div>
        <div class="info-card-label">总员工数</div>
      </div>
      <div class="info-card-item">
        <div class="info-card-value">{{ infoSet.switch_benefit }}</div>
        <div :class="growthRcd.benefit_growth === true ? 'up' : 'down'" style="text-wrap: nowrap;">{{ growthSet.benefit_growth }}</div>
        <div class="info-card-label">总收益</div>
      </div>
      <div class="info-card-item">
        <div class="info-card-value">{{ infoSet.station_count }}</div>
        <div class="info-card-label">总换电站数</div>
      </div>
    </div>
    <div style="width:100%;">
      <div style="display: flex;flex-direction: row;gap:20px;width: 100%;">
        <div style="height: 350px; flex: 6;" class="chart-card">
          <div style="color:#8e8e8e">换电订单数量统计</div>
          <el-select v-model="select1" style="    position: relative;
    transform: translateX(-100%);
    left: 100%;width:100px">
            <el-option value="近一天" @click="changeChart1">近一天</el-option>
            <el-option value="近一月" @click="changeChart1">近一月</el-option>
            <el-option value="近一年" @click="changeChart1">近一年</el-option>
          </el-select>
          <div style="height: 300px;">
            <line-chart :chartData="chartData" :key="chartKey" />
          </div>
        </div>
        <div style="height: 350px;flex: 4;" class="chart-card">
          <div style="color:#8e8e8e;height: 30px;">
            车型数量统计
          </div>
          <div style="height: 90%;;">
            <horizontal-bar-chart :chartData="chartData2" :key="chartKey2" />
          </div>
        </div>
        <div style="height: 350px;flex: 1;display: flex;flex-direction: column;" class="info-card-item">
          <div style="flex: 1;display: flex;flex-direction: column;justify-content: center;">
            <div
              style="font-size: 40px;font-weight: 290;text-align: center;background-color: #5bbeb5;color:white;border-radius: 20px;padding: 10px 10px;">
              {{ infoSet.avg_switch_score }}
            </div>
            <div style="color:#8e8e8e;margin-top: 10px;font-size: 15px;">
              换电服务均分
            </div>
          </div>
          <div style="flex: 1;display: flex;flex-direction: column;justify-content: center;">
            <div
              style="font-size: 40px;font-weight: 290;text-align: center;background-color: #5bbeb5;color:white;border-radius: 20px;padding: 10px 10px;">
              {{ infoSet.avg_repair_score }}
            </div>
            <div style="color:#8e8e8e;margin-top: 10px;font-size: 15px;">
              维修服务均分
            </div>
          </div>
        </div>
      </div>

    </div>
    <div style="display: flex;gap: 20px;margin-top: 20px;height: 100%;margin-bottom: 20px;">
      <div class="chart-card" style="flex:1;display:flex;flex-direction: column;max-height: 100%;">
        <div>
          <div style="color:#8e8e8e;">
            电池情况统计
          </div>
          <el-select v-model="batteryType" style="width: 150px;position: relative;transform: translateX(-100%);
    left: 100%;">
            <el-option value="标准续航型" @click="changeChart3">
              标准续航型
            </el-option>
            <el-option value="长续航型" @click="changeChart3">
              长续航型
            </el-option>
          </el-select>
        </div>
        <div style="height: 70%;margin-top:10px;">
          <pie-chart :chartData="chartData3" :key="chartKey3"></pie-chart>
        </div>
      </div>
      <div class="chart-card" style="flex:1;">
        <div style="color:#8e8e8e;">
          近七日收益
        </div>
        <div style="height: 90%;">
          <bar-chart :chartData="chartData4" :key="chartKey4"></bar-chart>
        </div>
      </div>
      <div class="chart-card" style="flex:1;display:flex;flex-direction: column;cursor: pointer;" @click="toNoticePage">
        <div style="color:#8e8e8e">
          最新公告
        </div>
        <div style="margin-top: 10px;">
          <div v-for="item in noticeSet" style="padding-bottom: 5px;border-bottom: 1px solid #E2E8F0;">
            <div style="font-weight: bolder;padding: 2px 0;  white-space: nowrap; 
    overflow: hidden;
    text-overflow: ellipsis;margin-top: 4px;color:#3b3b3b ">
              {{ item.title }}
            </div>
            <div style="display: flex;">
              <div style="width: fit-content;font-size: 5px;color:#8e8e8e;margin-top: 5px;">
                {{ "时间：" + item.publish_time.split('T')[0] }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import cmRequest from '../../service/index.js'
import { ElMessage } from 'element-plus'
import { reactive, ref } from 'vue'
import LineChart from '../../components/LineChart.vue'
import HorizontalBarChart from '../../components/HorizontalBarChart.vue'
import { useRouter } from 'vue-router';
import PieChart from '../../components/PieChart.vue'
import BarChart from '../../components/BarChart.vue'
import cmrequest from '../../service/index.js'

let width, height, gradient;
const getGradient = (ctx, chartArea) => {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;
  if (!gradient || width !== chartWidth || height !== chartHeight) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    width = chartWidth;
    height = chartHeight;
    gradient = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
    gradient.addColorStop(1, "rgba(79,209,197,0.54)");
    gradient.addColorStop(0.05, "rgba(75, 192, 192, 0.08)");
  }

  return gradient;
}

const router = useRouter();

const infoSet = ref([]);
const chartKey = ref(0);
const chartKey2 = ref(0);
const chartKey3 = ref(0);
const chartKey4 = ref(0);
const noticeSet = ref([]);
const growthSet = ref({});
const select1 = ref("近一年")
const batteryType = ref("标准续航型");
let select1Value = "year";
let standardStas = [];
let longStas = [];
const growthRcd = reactive({
  "owner_growth": true,
  "staff_growth": true,
  "request_growth": true,
  "benefit_growth": true
})


const chartData = reactive({
  labels: [],
  datasets: [
    {
      data: [],
      borderColor: '#4FD1C5',
      pointHoverRadius: 5,
      tension: 0.25,
      fill: true,
      backgroundColor: function (context) {
        const chart = context.chart;
        const { ctx, chartArea } = chart;

        if (!chartArea) {
          // This case happens on initial chart load
          return;
        }
        return getGradient(ctx, chartArea);
      },
      pointBackgroundColor: 'rgba(75, 192, 192)',
      pointBorderColor: 'rgba(75, 192, 192)'

    }
  ]
})

const chartData2 = reactive({
  labels: [],
  datasets: [
    {
      axis: 'y',
      data: [],
      fill: true,
      backgroundColor: "rgba(75, 192, 192,0.3)",
      borderRadius: 100,
    }
  ]
})

const chartData3 = reactive({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: ['rgba(75, 192, 192,1)', 'rgba(75, 192, 192,0.75)', 'rgba(75, 192, 192,0.5)', 'rgba(255, 129, 0,0.45)', 'rgba(255,0,0,0.25)', 'rgba(0,0,0,0.2)']
    }
  ]
})

const chartData4 = reactive({
  labels: [],
  datasets: [
    {
      data: [],
      backgroundColor: ['rgba(75, 192, 192,0.28)', 'rgba(75, 192, 192,0.28)', 'rgba(75, 192, 192,0.42)', 'rgba(75, 192, 192,0.56)', 'rgba(75, 192, 192,0.70)', 'rgba(75, 192, 192,0.84)', 'rgba(75, 192, 192,0.98)']
    }
  ]
})

const pullChart1Data = () => {
  cmRequest.request({
    // baseURL: 'https://mock.apifox.cn/m1/3058331-0-default',
    url: 'api/administrator/dashboard/time_span_stats',
    method: 'GET',
    params: {
      query_range: select1Value
    }
  }).then((res) => {
    chartData.labels = [];
    if (!res.code) {
      let data = [];
      for (let item of res.data) {
        if (select1.value == '近一天') {
          item.time_span = parseInt(item.time_span.substring(0, 2));
        }
        chartData.labels.push(item.time_span);
        data.push(item.switch_count);
      }
      chartData.datasets[0].data = data;
      chartKey.value++;
    }
    else {
    }
  })
}

const pullChart2Data = () => {
  cmRequest.request({
    url: 'api/administrator/dashboard/vehicles',
    method: 'GET',
  }).then((res) => {
    if (!res.code) {
      let labels = [];
      let data = [];
      for (let item of res.data) {
        labels.push(item.vehicle_type);
        data.push(item.vehicle_num);
      }
      chartData2.labels = labels;
      chartData2.datasets[0].data = data;
      chartKey2.value++;
    }
  })
}

const pullChart3Data = () => {
  cmRequest.request({
    // baseURL:'https://mock.apifox.cn/m1/3058331-0-default',
    url: 'api/administrator/dashboard/batteries',
    method: 'GET'
  }).then((res) => {
    if (!res.code) {
      for (let item of res.data) {
        let group = item.battery_type.split(" ");
        if (group[1] == '标准续航型') {
          chartData3.labels.push(group[0]);
          standardStas.push(item.battery_num);
        }
        else if (group[1] == '长续航型') {
          longStas.push(item.battery_num);
        }
        chartData3.datasets[0].data = standardStas;
        chartKey3.value++;
      }
    }
  })
}

const pullChart4Data = () => {
  cmRequest.request({
    // baseURL:'https://mock.apifox.cn/m2/3058331-0-default/107756661?apifoxApiId=107756661',
    url: 'api/administrator/dashboard/week_benefits',
    method: 'GET'
  }).then((res) => {
    if (!res.code) {
      let labels = [];
      let benefits = [];
      for (let item of res.data) {
        let date = item.day;
        date = date.replace(/\//g, '-');
        date = date.substring(5);
        labels.push(date);
        benefits.push(item.benefits);
      }
      chartData4.labels = labels;
      chartData4.datasets[0].data = benefits;
      chartKey4.value++;
    }
  })
}

const pullGrowthData = () => {
  cmRequest.request({
    url: 'api/administrator/dashboard/growth',
    method: 'GET'
  }).then((res) => {


    if (res.data.owner_growth < 0)
      growthRcd.owner_growth = false;
    if (res.data.request_growth < 0)
      growthRcd.request_growth = false;
    if (res.data.staff_growth < 0)
      growthRcd.staff_growth = false;
    if (res.data.benefit_growth < 0)
      growthRcd.benefit_growth = false;

    for (let key in res.data) {
      if (res.data.hasOwnProperty(key)) {
        let minusFlag = false;
        if (res.data[key] < -1000) {
          minusFlag = true;
        }
        const value = Math.abs(res.data[key]);

        if (value >= 1000 && value < 10000) {
          const formattedValue = (value / 1000).toFixed(1) + 'k';
          res.data[key] = formattedValue;
        } else if (value >= 10000) {
          const formattedValue = (value / 10000).toFixed(1) + 'w';
          res.data[key] = formattedValue;
        }
        if (minusFlag) {
          res.data[key] = "-" + res.data[key];
        }
      }
    }
    growthSet.value.owner_growth = res.data.owner_growth;
    growthSet.value.request_growth = res.data.request_growth;
    growthSet.value.staff_growth = res.data.staff_growth;
    growthSet.value.benefit_growth = res.data.benefit_growth;

  })
}

const pullNoticeData = () => {
  cmRequest.request({
    url: 'api/administrator/announcement/newest',
    method: 'GET',
  }).then((res) => {
    if (!res.code) {
      noticeSet.value = res.data.slice(0, 4);

    }
  })
}

const changeChart1 = () => {
  if (select1.value === "近一天")
    select1Value = "day";
  else if (select1.value === "近一月")
    select1Value = "month";
  else
    select1Value = "year"

  pullChart1Data();
}

const changeChart3 = () => {
  if (batteryType.value === '标准续航型')
    chartData3.datasets[0].data = standardStas;
  else
    chartData3.datasets[0].data = longStas;

  chartKey3.value++;
}

const toNoticePage = () => {
  router.push('/notice-info')
}

const pullData = () => {
  cmRequest.request({
    // url: 'api/administrator/dashboard/message',
    url: 'api/administrator/dashboard/stats',// 我的本地api地址
    method: 'GET',

  }).then((res) => {
    if (!res.code) {
      for (let key in res.data) {
        if (res.data.hasOwnProperty(key)) {
          const value = res.data[key];

          if (value >= 1000 && value < 10000) {
            const formattedValue = (value / 1000).toFixed(1) + 'k';
            res.data[key] = formattedValue;
          } else if (value >= 10000) {
            const formattedValue = (value / 10000).toFixed(1) + 'w';
            res.data[key] = formattedValue;
          }
        }
      }
      infoSet.value = res.data;
    }
    else {
      ElMessage({
        type: 'error',
        message: '刷新失败',
      })
    }
  })
  pullChart1Data();
  pullChart2Data();
  pullChart3Data();
  pullChart4Data();
  pullNoticeData();
  pullGrowthData();

}
pullData();

</script>

<style scoped>
.dashboard-header {
  background-color: #35495e;
  color: #ffffff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dashboard-title {
  font-size: 28px;
  margin: 0;
}

.info-card {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

.info-card-item {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
}

.chart-card {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}


.info-card-value {
  font-size: 28px;
  margin: 0;
  color: #35495e;
  width: fit-content;
  display: inline;
}

.info-card-label {
  font-size: 16px;
  color: #8e8e8e;
  margin-top: 5px;
  display: inline;
  margin-left: 20px;
  text-wrap: nowrap;
}

.chart-container {
  width: 100%;
  display: flex;
  justify-content: center;
}

.chart {
  width: 100%;
  height: 400px;
}

.up {
  color: red;
  text-wrap: nowrap;

}

.down {
  color: green;
  text-wrap: nowrap;
}

.up::before {
  content: url(../../assets/up.svg);
  margin: 0 2px;
  margin-left: 10px;
}

.down::before {
  content: url(../../assets/down.svg);
  margin: 0 2px;
  margin-left: 10px;
}
</style>