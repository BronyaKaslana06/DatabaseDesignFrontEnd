<template>
  <div class="firstline">
    <div class="welcome">
      <div class="left-section">
        <div class="left-content">
          <img src="@/assets/UserAvatar.svg" alt="" class="profile-image">
          <p class="greeting">
            {{ getGreeting() }}
          </p>
        </div>
      </div>
      <div class="right-section">
        <el-button type="info" size="large" round @click="gotoPersonal">查看资料</el-button>
      </div>
    </div>

    <div class="canvas-container" v-loading="battery" 
    :class="{ 'low-capacity': CarInfo.current_capacity < 30, 'high-capacity': CarInfo.current_capacity >= 30 }">
      <div class="canvas-wrapper">
        <canvas ref="mycanvas" :width="cWidth+20" :height="cHeight"></canvas>
        <div class="percentage">{{ CarInfo.current_capacity }}%</div>
      </div>
      <div class="license">{{ CarInfo.plate_number }}</div>
    </div>
  </div>


  <div class="info-card">
    <div class="info-card-item">
      <p class="info-card-label">待评价的换电订单</p>
      <h2 class="info-card-value">{{ OwnerInfo.unscored_switchlog }}</h2>
    </div>

    <div class="info-card-item">
      <p class="info-card-label">待评价的维修订单</p>
      <h2 class="info-card-value">{{ OwnerInfo.unscored_maintenance }}</h2>
    </div>

    <div class="info-card-item">
      <p class="info-card-label">累计里程数</p>
      <h2 class="info-card-value">{{ OwnerInfo.mileage }}km</h2>
    </div>

    <div class="info-card-item">
      <p class="info-card-label">总换电次数</p>
      <h2 class="info-card-value">{{ OwnerInfo.dealCount }}</h2>
    </div>
  </div>

  <div style="width:100%;">
    <div style="display: flex;flex-direction: row;width: 100%;">
      <div style="height: 400px; flex: 6;" class="chart-item">
          <div style="color:#8e8e8e">换电消费统计</div>
          <el-select v-model="select" style="    position: relative;
    transform: translateX(-100%);
    left: 100%;width:100px">
            <el-option value="近一月" @click="changeChart">近一月</el-option>
            <el-option value="近一年" @click="changeChart">近一年</el-option>
          </el-select>
          <div style="height: 350px;">
            <line-chart :chartData="chartData" :key="chartKey" />
          </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="js">
import cmRequest from '../../service/index.js'
import { ElMessage } from 'element-plus'
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import LineChart from '../../components/LineChart.vue'


const battery= ref(false);
const OwnerInfo = ref({});
const CarInfo = ref({});
const select = ref("近一年");

/*  画电池  */
const mycanvas = ref(null);
const ctx = ref(null);
const cWidth = 132;
const cHeight = 56;

const drawRoundedRect = (ctx, x, y, width, height, radius) => {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.arcTo(x + width, y, x + width, y + radius, radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius);
  ctx.lineTo(x + radius, y + height);
  ctx.arcTo(x, y + height, x, y + height - radius, radius);
  ctx.lineTo(x, y + radius);
  ctx.arcTo(x, y, x + radius, y, radius);
  ctx.closePath();
};

const drawRoundedBattery = (ctx, quantity) => {
  const radius = 6; // 圆角半径
  const borderWidth = 6;
  const batteryWidth = cWidth - borderWidth;
  const batteryHeight = cHeight - borderWidth;
  const batteryX = borderWidth / 2;
  const batteryY = borderWidth / 2;

  // 绘制电池的背景
  ctx.fillStyle = 'rgba(0,0,0,0.2)';
  drawRoundedRect(ctx, batteryX, batteryY, batteryWidth, batteryHeight, radius);
  ctx.fill();

  // 绘制电池的电量部分
  if (quantity < 30) {
    ctx.fillStyle = 'red';
  } else {
    ctx.fillStyle = 'green';
  }
  const chargeWidth = (batteryWidth - 2 * radius) * quantity / 100;
  drawRoundedRect(ctx, batteryX + radius, batteryY, chargeWidth, batteryHeight, radius);
  ctx.fill();

  // 绘制电池的外框
  ctx.strokeStyle = 'white';
  ctx.lineWidth = borderWidth;
  drawRoundedRect(ctx, batteryX, batteryY, batteryWidth, batteryHeight, radius);
  ctx.stroke();

  // 绘制电池的正极标志
  const positiveWidth = 10;
const positiveHeight = batteryHeight * 0.4;
const positiveX = batteryX + batteryWidth+5;
const positiveRadius = 3; // 正极标志的圆角半径

ctx.fillStyle = 'white';

// 绘制圆角矩形
ctx.beginPath();
ctx.moveTo(positiveX + positiveRadius, batteryY + (batteryHeight - positiveHeight) / 2);
ctx.lineTo(positiveX + positiveWidth - positiveRadius, batteryY + (batteryHeight - positiveHeight) / 2);
ctx.arcTo(positiveX + positiveWidth, batteryY + (batteryHeight - positiveHeight) / 2, positiveX + positiveWidth, batteryY + (batteryHeight - positiveHeight) / 2 + positiveRadius, positiveRadius);
ctx.lineTo(positiveX + positiveWidth, batteryY + (batteryHeight - positiveHeight) / 2 + positiveHeight - positiveRadius);
ctx.arcTo(positiveX + positiveWidth, batteryY + (batteryHeight - positiveHeight) / 2 + positiveHeight, positiveX + positiveWidth - positiveRadius, batteryY + (batteryHeight - positiveHeight) / 2 + positiveHeight, positiveRadius);
ctx.lineTo(positiveX + positiveRadius, batteryY + (batteryHeight - positiveHeight) / 2 + positiveHeight);
ctx.arcTo(positiveX, batteryY + (batteryHeight - positiveHeight) / 2 + positiveHeight, positiveX, batteryY + (batteryHeight - positiveHeight) / 2 + positiveHeight - positiveRadius, positiveRadius);
ctx.lineTo(positiveX, batteryY + (batteryHeight - positiveHeight) / 2 + positiveRadius);
ctx.arcTo(positiveX, batteryY + (batteryHeight - positiveHeight) / 2, positiveX + positiveRadius, batteryY + (batteryHeight - positiveHeight) / 2, positiveRadius);
ctx.closePath();

ctx.fill();
};


const getGreeting = () => {
  const now = new Date();
  const hour = now.getHours();

  if (hour >= 5 && hour < 11) {
    return "早上好," + localStorage.getItem("username");
  } else if (hour >= 11 && hour < 15) {
    return "中午好，" + localStorage.getItem("username");
  } else if (hour >= 15 && hour < 20) {
    return "下午好，" + localStorage.getItem("username");
  } else {
    return "晚上好，" + localStorage.getItem("username");
  }
}

const router = useRouter();
const gotoPersonal = () => {
  router.push('personal-info');
}

let option="year";
const changeChart = () => {
  if (select.value === "近一月")
    option = "month";
  else
    option = "year"

    getChartInfo();
}

const getCarInfo = () => {
  battery.value = true;
  cmRequest.request({
    url: 'api/owner/dashboard/min_capacity',
    method: 'GET',
    params: {
      user_id: localStorage.getItem('user_id').toString()
    }
  }).then((res) => {
    if (!res.code) {
      
      CarInfo.value = res.data;
      mycanvas.value = mycanvas.value || null;
      ctx.value = mycanvas.value.getContext('2d');
      //改成对应的变量
      drawRoundedBattery(ctx.value, res.data.current_capacity);
    }
    else {
      ElMessage({
        type: 'error',
        message: '刷新失败',
      })
    }
    battery.value = false;
  })
};


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

const chartKey = ref(0);
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
        console.log("backgroundColor function is called!");
        return getGradient(ctx, chartArea);
      },
      pointBackgroundColor: 'rgba(75, 192, 192)',
      pointBorderColor: 'rgba(75, 192, 192)'

    }
  ]
})

const getChartInfo = () => {
  cmRequest.request({
    url: 'api/owner/dashboard/monthlyswitch',
    method: 'GET',
    params: {
      user_id: localStorage.getItem('user_id').toString(),
      query_range:option
    }
  }).then((res) => {
    chartData.labels = [];
    const monthNames = ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'];
    if (!res.code) {
      
      let data = [];
      for (let i = 0; i < res.data.length; i++) {
        if(option === "year")
          chartData.labels.push(monthNames[i]);
        else
        chartData.labels.push(i+1);
        data.push(res.data[i]);
      }
      chartData.datasets[0].data = data;
      console.log(chartData);
      chartKey.value++;
    }
    else {
      ElMessage({
        type: 'error',
        message: '刷新失败',
      })
    }
  })
};

const getOwnerInfo = () => {
  cmRequest.request({
    url: 'api/owner/dashboard/base_info',
    method: 'GET',
    params: {
      user_id: localStorage.getItem('user_id').toString()
    }
  }).then((res) => {
    if (!res.code) {
      
      OwnerInfo.value = res.data;
    }
    else {
      ElMessage({
        type: 'error',
        message: '刷新失败',
      })
    }
  })
  getCarInfo();
  getChartInfo();
};
getOwnerInfo();



</script>

<style scoped>
.firstline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 5px;
  margin-left: 10px;
  margin-right: 10px;
}

.welcome {
  background-color: #44c9b5;
  color: #ffffff;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 66.66%;
  margin-top: 10px;
  border-radius: 10px;
  background-image: linear-gradient(45deg, transparent 25%, rgba(255, 255, 255, 0.2) 25%, rgba(255, 255, 255, 0.2) 50%, transparent 50%, transparent 75%, rgba(255, 255, 255, 0.2) 75%);
}
.canvas-container {
  width: 33.33%;
  padding: 20px;
  border-radius: 10px;
  margin-left: 20px;
  margin-right: 3em;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.profile-image {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 30px;
}

.left-section {
  display: flex;
  align-items: center;
  /* 垂直居中对齐 */
}

.left-content {
  display: flex;
  align-items: center;
  /* 垂直居中对齐 */
}

.greeting {
  font-size: 36px;
  font-weight: bold;
  margin-right: 10px;
  /* 右侧间距，根据需求调整 */
}

.right-section {
  font-weight: bold;
}


.low-capacity {
  background-color: rgb(243, 195, 195); /* 低电量时的背景颜色 */
}

.high-capacity {
  background-color: rgb(181, 245, 181); /* 高电量时的背景颜色 */
}
.canvas-wrapper {
  display: flex;
  align-items: center;
}

.percentage {
  font-size: 24px;
  margin-left: 1em;
  /* 添加左侧的间距 */
}

.license {
  font-size: 30px;
  margin-top: 25px;
  font-weight: bold;
}


.info-card {
  display: flex;
  gap: 20px;
  margin-top: 20px;
  margin-left: 10px;
  margin-right: 3em;
}

.info-card-item {
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
}
.chart-item{
  flex: 1;
  padding: 20px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  margin-top: 20px;
  margin-left: 10px;
  margin-right: 3em;
}
.info-card-item:hover {
  transform: translateY(-5px);
}

.info-card-value {
  font-size: 28px;
  margin: 0;
  color: #35495e;
}

.info-card-label {
  font-size: 16px;
  color: #8e8e8e;
  margin-top: 5px;
}
</style>