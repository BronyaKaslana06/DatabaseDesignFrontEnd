<template>
  <div class="one">
    <div class="list">
      <div
        class="garage"
        v-for="garage in garagetArray"
        :key="garage.vehicle_id"
      >
        <div>
          <p>车牌号：{{ garage.vehicle_id }}</p>
        </div>
      </div>
    </div>
    <div class="carpage">
      <div class="right">
        <div class="car-png">
          <div class="car-container">
            <div class="car-image-container">
              <div>
                <img
                  src="@/assets/charge.jpg"
                  alt="Battery Icon"
                  class="battery-image"
                />
                <span class="battery-level">剩余电量：{{ batteryLevel }}%</span>
                <div class="mileage">
                  <span class="mileage-text-0">已行驶</span>
                  <span class="mileage-text-1">{{ mileage }}</span>
                  <span class="mileage-text-2">Km</span>
                </div>
              </div>
              <img src="@/assets/car.jpg" alt="Car Image" class="car-image" />
            </div>
          </div>
          <div class="car-details">
            <h2 class="car-name">{{ carName }}</h2>
            <div class="car-status">
              <p><strong>状态:</strong> {{ carStatus }}</p>
              <p><strong>车牌号:</strong> {{ plateNumber }}</p>
            </div>
          </div>
        </div>
        <div class="announcement">
          <img
            src="@/assets/carpagenotice.jpg"
            alt="Announcement Icon"
            class="announcement-icon"
          />
          <p class="announcement-text" @click="goToNotice">查看公告</p>
        </div>
        <div class="goto">
          <div class="goto-item">
            <p class="announcement-text" @click="goToRepairPage">维修服务</p>
          </div>
          <div class="goto-item">
            <p class="announcement-text" @click="goToReservationpage">
              换电预约
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
  
  <script setup>
import "@/assets/charge.jpg"; // 导入电池图标
import "@/assets/car.jpg"; // 导入车辆图标
import "@/assets/carpagenotice.jpg"; // 导入公告图标

import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const goToRepairPage = () => {
  router.push({ name: "Repair" });
};

const goToReservationpage = () => {
  router.push({ name: "reservation-page" });
};

const goToNotice = () => {
  router.push({ name: "owner-notice-page" });
};

const batteryLevel = 75;
const carName = "Electric Vehicle X";
const carStatus = "Charging";
const plateNumber = "ABC1234";
const mileage = "123";

const garagetArray = ref([
  {
    vehicle_id: "1",
  },
  {
    vehicle_id: "2",
  },
]);
</script>
  
  <style scoped>
.one {
  overflow: auto;
  display: flex;
  margin-bottom: 100px;
}

.list {
  width: 40%;
  display: flex;
  margin-bottom: 100px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  flex-direction: column;
  height: 875px;
  margin-top: 45px;
}

.garage {
  margin: 10px;
  width: 90%;
  border-top: 1px solid #ccc; /* 添加上边框线 */
  padding: 10px 0; /* 添加垂直内边距 */
  cursor: pointer; /* 添加指针样式以表示可点击 */
}

.garage:hover {
  background-color: #f5f5f5; /* 鼠标悬停时的背景色 */
}

.garage p {
  font-size: 18px; /* 调整字体大小 */
  font-weight: bold; /* 加粗字体 */
  margin: 5px 0; /* 调整上下边距 */
}

.carpage {
  width: 60%;
  justify-content: space-between;
  display: flex;
  margin-bottom: 100px;
}

.car-png {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  margin: 20px;
}

.right {
  margin-right: 30px;
  margin-bottom: 30px;
  margin: 20px;
}

.car-image-container {
  padding-right: 10px;
}

.car-image {
  max-width: 100%;
  height: auto;
  border-radius: 10px;
}

.battery-level {
  font-size: 30px;
}

.battery-image {
  width: 15px;
  height: 30px;
  margin-right: 10px;
}

.mileage-text-1 {
  font-size: 30px;
}

.car-details {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.car-name {
  font-size: 24px;
  color: #333;
  margin-bottom: 10px;
}

.car-status {
  text-align: center;
  color: #666;
}

.car-status p {
  margin: 5px 0;
  font-size: 16px;
}

.announcement {
  display: flex;
  align-items: center;
  background-color: #fff;
  padding: 10px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 20px;
}

.announcement-icon {
  width: 30px;
  height: 30px;
  margin-right: 10px;
}

.announcement-text {
  font-size: 20px;
  color: #00aaff;
  margin: 0;
  cursor: pointer;
  margin: 15px;
}

.goto {
  display: flex;
  align-items: center;
  margin-top: -20px;
}

.goto-item {
  display: flex;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 300px;
  margin: 20px;
}
</style>