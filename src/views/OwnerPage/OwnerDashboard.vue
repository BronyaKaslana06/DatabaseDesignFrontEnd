<template>
  <div class="firstline">
    <div class="welcome">
      <div class="left-section">
        <div class="left-content">
          <img :src="temp_img || ''" alt="" class="profile-image">
          <p class="greeting">
            {{ getGreeting() }}
          </p>
        </div>
      </div>
      <div class="right-section">
        <el-button type="info" size="large" round @click="gotoPersonal">查看资料</el-button>
      </div>
    </div>

    <div class="canvas-container" v-loading="battery">
      <div class="canvas-wrapper">
        <canvas ref="mycanvas" :width="cWidth" :height="cHeight"></canvas>
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
      <div style="height: 400px; width: 50%;" class="chart-item">
        <line-chart :chartData="chartData" :key="chartKey" />
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

/*  画电池  */
const mycanvas = ref(null);
const ctx = ref(null);
const cWidth = 132;
const cHeight = 56;

const drawBg = () => {
  ctx.value.strokeStyle = 'white';
  ctx.value.lineWidth = 6;
  ctx.value.strokeRect(0, 0, 120, 56);
  ctx.value.fillStyle = 'rgba(0,0,0,0.2)';
  ctx.value.fillRect(0, 0, 120, 56);
  ctx.value.fillStyle = 'rgba(255,255,255,1)';
  ctx.value.fillRect(121, 14, 12, 28);
};

const drawPath = (quantity) => {
  if (quantity < 20) {
    ctx.value.fillStyle = 'red';
  } else {
    ctx.value.fillStyle = 'green';
  }
  ctx.value.fillRect(6, 6, (120 - 12) * quantity / 100, 44);
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
  router.push('personal-information-page');
}
const getOwnerInfo = () => {
  cmRequest.request({
    url: 'api/owner/dashboard/base_info',
    method: 'GET',
    params: {
      user_id: localStorage.getItem('user_id').toString()
    }
  }).then((res) => {
    if (!res.code) {
      ElMessage({
        type: 'success',
        message: '刷新成功',
      })
      OwnerInfo.value = res.data;
    }
    else {
      ElMessage({
        type: 'error',
        message: '刷新失败',
      })
    }
  })
};
getOwnerInfo();

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
      ElMessage({
        type: 'success',
        message: '刷新成功',
      })
      CarInfo.value = res.data;
      mycanvas.value = mycanvas.value || null;
      ctx.value = mycanvas.value.getContext('2d');
      drawBg();
      //改成对应的变量
      drawPath(res.data.current_capacity);
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
getCarInfo();

const chartData = reactive({
  labels: [],
  datasets: [
    {
      data: [],
    }
  ]
})

const getChartInfo = () => {
  cmRequest.request({
    url: 'api/owner/dashboard/monthlyswitch',
    method: 'GET',
    params: {
      user_id: localStorage.getItem('user_id').toString()
    }
  }).then((res) => {
    chartData.labels = [];
    chartData.datasets = [{}];
    if (!res.code) {
      /*
      let data = [];
      res.data.forEach((item, index) => {
        chartData.labels.push(index);
        data.push(item);
        });
      chartData.datasets[0].data = data;
      console.log(chartData);
      chartKey.value++;*/
    }
    else {
      ElMessage({
        type: 'error',
        message: '刷新失败',
      })
    }
  })
};
getChartInfo();

const temp_img = 'data:image/png;base64,' + OwnerInfo.avater;



</script>

<style scoped>
.firstline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
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

.canvas-container {
  width: 33.33%;
  background-color: rgb(237, 235, 235);
  /* 设置背景色为灰色 */
  padding: 20px;
  border-radius: 10px;
  margin-left: 3em;
  margin-right: 3em;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  margin-top: 15px;
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
  margin-top: 10px;
  margin-left: 10px;
  margin-right: 3em;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease-in-out;
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