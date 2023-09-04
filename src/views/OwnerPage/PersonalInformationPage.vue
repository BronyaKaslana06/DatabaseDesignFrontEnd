<template >
  <div v-loading="loadTableData">
    <div class="information_background">
      <div class="username-container">
        <el-avatar
          class="extra-large-avatar"
          :src="userAvatar || defaultAvatar"
        ></el-avatar>
        <p class="username">欢迎,{{ user_name }}</p>
        <p class="userid">id:{{ storedUserInfo }}</p>
      </div>
    </div>
    <div class="information-item-container">
      <div class="information-item">
        <div class="information-item-all">
          <p class="car-information-left-top-text">个人信息</p>
          <div class="information-item-left">
            <div class="information-item-line">
              <p><strong>姓名：</strong>{{ userInfo.user_name }}</p>
              <p><strong>生日：</strong>{{ userInfo.birthday }}</p>
              <p><strong>性别：</strong>{{ userInfo.gender }}</p>
            </div>
            <div class="information-item-line">
              <p><strong>家庭住址：</strong>{{ userInfo.address }}</p>
              <p><strong>手机号码：</strong>{{ userInfo.phone_number }}</p>
              <p><strong>邮箱：</strong>{{ userInfo.email }}</p>
            </div>
            <div class="information-item-right">
              <Text class="edit-button" @click="showEditDialog(userInfo)"
                >编辑</Text
              >
            </div>
          </div>
        </div>
      </div>
      <div class="car-information">
        <div class="car-information-left">
          <div class="car-information-left-top">
            <p class="car-information-left-top-text">
              {{ car_information.vehicle_model }}
            </p>
            <el-select v-model="selectedPlateNumber" placeholder="选择车牌号">
              <el-option
                v-for="plate in plateNumbers"
                :key="plate.vehicle_id"
                :label="plate.plate_number"
                :value="plate.vehicle_id"
              ></el-option>
            </el-select>
            <el-button @click="fetchvehicle_id">切换</el-button>
          </div>
          <img
            :src="car_information.snip"
            class="car_informationjpg"
            alt=""
            v-if="showCarInformation"
          />
          <div class="car-information-left-bottom" v-if="showCarInformation">
            <div class="information-item-line-other1">
              <p><strong>行驶里程数：</strong>{{ car_information.mileage }}(单位：Km)</p>
            </div>
            <div class="information-item-line-other2">
              <p>
                <strong>剩余电量：</strong>{{
                  formatScientificToPercentage(
                    car_information.current_capacity
                  )
                }}({{ car_information.battery_type }})
              </p>
            </div>
            <div class="information-item-line-other3">
              <p><strong>温度：</strong>{{ car_information.temperature }}°C</p>
            </div>
          </div>
        </div>
        <div class="car-information-right">
          <div class="car-information-right-item" v-if="showCarInformation">
            <p class="car-information-left-top-text">车辆详情信息</p>
            <div class="information-item-line-right-all">
              <div class="information-item-line-right">
                <p><strong>型号：</strong>{{ car_information.vehicle_model }}</p>
              </div>
              <div class="information-item-line-right">
                <p><strong>保修期限：</strong>{{ car_information.warrange }}</p>
              </div>
              <div class="information-item-line-right">
                <p><strong>电池id：</strong>{{ car_information.battery_id }}</p>
              </div>
              <div class="information-item-line-right">
                <p><strong>购入时间：</strong>{{ car_information.purchase_date }}</p>
              </div>
              <div class="information-item-line-right">
                <p><strong>发动机：</strong>{{ car_information.transmission }}</p>
              </div>
              <div class="information-item-line-right">
                <p><strong>最高时速：</strong>{{ car_information.mileage }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <el-dialog v-model="editDialogVisible" title="编辑信息" width="30%">
      <el-form :model="editedUserInfo" ref="editForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="editedUserInfo.user_name"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editedUserInfo.gender">
            <el-option key="1" value="男" label="男"> </el-option>
            <el-option key="2" value="女" label="女"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="生日">
          <el-date-picker
            v-model="editedUserInfo.birthday"
            type="date"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="editedUserInfo.address"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
          <el-input v-model="editedUserInfo.phone_number"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="editedUserInfo.email"></el-input>
        </el-form-item>
        <!-- 其他表单项... -->
        <el-form-item>
          <el-button type="primary" @click="saveEditedInfo">保存</el-button>
          <el-button @click="editDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import cmRequest from "../../service/index.js";
import { ElMessage } from "element-plus";

const storedUserInfo = JSON.parse(localStorage.getItem("user_id")); //获取用户ID
const user_name = ref(localStorage.getItem("username"));
const loadTableData = ref(false);

const showCarInformation = ref(false); // 初始时隐藏内容

const userInfo = reactive({
  user_name: "",
  gender: "",
  birthday: "",
  address: "",
  phone_number: "",
  email: "",
});

const queryData = () => {
  console.log(storedUserInfo);
  cmRequest
    .request({
      url: "api/owner/" + storedUserInfo + "/message",
      method: "GET",
    })
    .then((res) => {
      console.log(res);
      if (!res.code) {
        const userData = res.data; // 假设响应数据就是用户信息
        Object.assign(userInfo, userData); // 将获取的用户信息赋值给 userInfo
      } else {
        ElMessage({
          type: "error",
          message: "未找到内容",
        });
      }
    })
    .catch((error) => {
      console.error("获取用户信息失败：", error);
      ElMessage({
        type: "error",
        message: "获取用户信息失败，请稍后再试",
      });
    });
};

const editDialogVisible = ref(false);

const editedUserInfo = reactive({
  user_name: "",
  gender: "",
  birthday: "",
  address: "",
  phone_number: "",
  email: "",
});

const showEditDialog = (userInfo) => {
  editedUserInfo.user_name = userInfo.user_name;
  editedUserInfo.gender = userInfo.gender;
  editedUserInfo.birthday = userInfo.birthday;
  editedUserInfo.address = userInfo.address;
  editedUserInfo.phone_number = userInfo.phone_number;
  editedUserInfo.email = userInfo.email;
  editDialogVisible.value = true;
};

const formatDate = (date) => {
  if (date instanceof Date) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }
  return date;
};

const saveEditedInfo = () => {
  editedUserInfo.birthday = formatDate(editedUserInfo.birthday);
  cmRequest
    .request({
      url: "api/owner/" + storedUserInfo + "/information",
      method: "PATCH",
      data: editedUserInfo, // 使用编辑后的用户信息作为请求数据
    })
    .then((res) => {
      console.log(editedUserInfo);
      console.log(res);
      if (!res.code) {
        ElMessage({
          type: "success",
          message: "信息保存成功",
        });
        editDialogVisible.value = false; // 保存成功后关闭弹窗
        window.location.reload(true);
      } else {
        ElMessage({
          type: "error",
          message: "保存失败，请稍后再试",
        });
      }
    })
    .catch((error) => {
      console.error("保存用户信息失败：", error);
      ElMessage({
        type: "error",
        message: "保存用户信息失败，请稍后再试",
      });
    });
};

const plateNumbers = ref([]); // 用于存储车牌号列表
const selectedPlateNumber = ref(""); // 用于存储选中的车牌号

// 获取车牌号列表
const fetchPlateNumbers = () => {
  cmRequest
    .request({
      url: "api/owner/repair_reservation/own_query",
      method: "GET",
      params: {
        owner_id: storedUserInfo,
      },
    })
    .then((res) => {
      console.log(storedUserInfo);
      console.log(res);
      if (!res.code) {
        plateNumbers.value = res.data; // 将获取的车牌号列表赋值给 plateNumbers
        if (plateNumbers.value.length > 0) {
          selectedPlateNumber.value = res.data[0].vehicle_id; // 设置默认选中的车牌号
          console.log(selectedPlateNumber.value);
        }
      } else {
        ElMessage({
          type: "error",
          message: "未找到车牌号",
        });
      }
    })
    .catch((error) => {
      console.error("获取车牌号列表失败：", error);
      ElMessage({
        type: "error",
        message: "获取车牌号列表失败，请稍后再试",
      });
    });
};

const car_information = reactive({
  vehicle_model: "",
  current_capacity: "",
  battery_id: "",
  purchase_date: "",
  snip: "",
  mileage: "",
  max_speed: "",
  transmission: "",
  battery_type: "",
  warrange: "",
  temperature: "",
});

const fetchvehicle_id = () => {
  loadTableData.value = true;
  cmRequest
    .request({
      url: "api/owner/repair_reservation/car_information",
      method: "GET",
      params: {
        vehicle_id: selectedPlateNumber.value,
      },
    })
    .then((res) => {
      console.log(selectedPlateNumber.value);
      console.log(res);
      if (!res.code) {
        car_information.vehicle_model = res.data.vehicle_model;
        car_information.current_capacity = res.data.current_capacity;
        car_information.battery_id = res.data.battery_id;
        car_information.purchase_date = res.data.purchase_date;
        car_information.snip = "data:image/png;base64," + res.data.snip;
        car_information.mileage = res.data.mileage;
        car_information.max_speed = res.data.max_speed;
        car_information.transmission = res.data.transmission;
        car_information.battery_type = res.data.battery_type;
        car_information.warrange = res.data.warrange;
        car_information.temperature = res.data.temperature;
        showCarInformation.value = true;
        loadTableData.value = false;
      } else {
        ElMessage({
          type: "error",
          message: "未找到信息",
        });
        loadTableData.value = false;
      }
    })
    .catch((error) => {
      console.error("获取信息失败：", error);
      ElMessage({
        type: "error",
        message: "获取信息失败，请稍后再试",
      });
      loadTableData.value = false;
    });
};

function formatScientificToPercentage(scientificNotation) {
  // 将科学计数法字符串转换为浮点数
  const number = parseFloat(scientificNotation);

  // 将浮点数转换为百分比形式（保留两位小数）
  const percentage = (number * 1).toFixed(2);

  // 将百分比字符串格式化为 XY.Z%
  return `${percentage}%`;
}

const start = () => {
  fetchPlateNumbers(); // 获取车牌号列表

  setTimeout(() => {
    fetchvehicle_id();
  }, 1000); // 1秒
};

// 在查询用户信息之前调用获取车牌号列表的函数
start(); // 获取车牌号列表

queryData(); // 在组件加载时获取用户信息
</script>

<style scoped>
.information_background {
  width: 1235px;
  height: 200px;
  border-radius: 15.000000953674316px;
  margin-left: -40px;
  margin-top: -10px;
  background-image: url("@/assets/information_background.jpg"); /* 替换 'your-background-image.jpg' 为实际的背景图路径 */
  background-size: cover; /* 控制背景图的尺寸，以覆盖整个容器 */
  background-repeat: no-repeat; /* 防止背景图重复平铺 */
  background-position: center; /* 将背景图居中 */
  display: flex;
}

.username-container {
  display: flex;
  margin-top: 140px;
  margin-left: 120px;
  z-index: 1;
}

.username {
  font-size: 26px;
  color: #fff; /* 设置文本颜色为蓝色 */
  font-weight: bold; /* 设置文本为加粗 */
  margin-left: 10px;
}

.userid {
  font-size: 17px;
  color: #fff; /* 设置文本颜色为蓝色 */
  margin-left: 60px;
  margin-top: 38px;
}

.information-item-container {
  display: flex;
  flex-direction: column;
  margin-left: 50px;
}

.information-item {
  width: 1050px;
  height: 280px;
  border-radius: 15.000000953674316px;
  background-color: #fff;
  align-items: center;
  position: relative;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 修改阴影效果 */
}

.information-item-all {
  margin-top: 50px;
  margin-left: 40px;
}

.information-item-left {
  display: flex;
  margin-top: -20px;
}

.edit-button {
  position: absolute;
  top: 0;
  right: 0;
  margin: 20px;
  color: #4fd1c5;
  cursor: pointer; /* 设置光标样式为小手 */
}

.information-item-line {
  width: 450px;
  height: 250px;
  font-size: 20px;
}

.information-item-line-other1 {
  display: flex;
  align-items: center;
  flex-direction: row;
  justify-content: space-between;
  font-size: 20px;
}

.information-item-line-other2 {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
}

.information-item-line-other3 {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
}

.information-item-line-other1 p::before {
  align-items: center;
  content: "";
  display: inline-block;
  width: 24px; /* 设置图表图片的宽度 */
  height: 24px; /* 设置图表图片的高度 */
  margin-right: 5px; /* 可以根据需要调整图片与文本之间的间距 */
  background-image: url("@/assets/bar-chart.svg"); /* 图表图片的路径 */
  background-size: contain; /* 图片适应容器大小 */
  background-repeat: no-repeat;
}

.information-item-line-other2 p::before {
  content: "";
  display: inline-block;
  width: 24px; /* 设置图表图片的宽度 */
  height: 24px; /* 设置图表图片的高度 */
  margin-right: 5px; /* 可以根据需要调整图片与文本之间的间距 */
  background-image: url("@/assets/battery-half.svg"); /* 图表图片的路径 */
  background-size: contain; /* 图片适应容器大小 */
  background-repeat: no-repeat;
}

.information-item-line-other3 p::before {
  content: "";
  display: inline-block;
  width: 24px; /* 设置图表图片的宽度 */
  height: 24px; /* 设置图表图片的高度 */
  margin-right: 5px; /* 可以根据需要调整图片与文本之间的间距 */
  background-image: url("@/assets/thermometer.svg"); /* 图表图片的路径 */
  background-size: contain; /* 图片适应容器大小 */
  background-repeat: no-repeat;
}

.car-information {
  margin-top: 20px;
  width: 1050px;
  height: 650px;
  display: flex;
}

.car-information-left {
  background-color: #fff;
  width: 540px;
  height: 550px;
  border-radius: 15.000000953674316px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 修改阴影效果 */
  margin-left: 5px;
}

.car-information-right {
  background-color: #fff;
  width: 540px;
  height: 550px;
  border-radius: 15.000000953674316px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 修改阴影效果 */
  margin-left: 25px;
}

.car-information-left-top {
  margin: 30px;
  display: flex;
}

.car-information-left-top-text {
  font-weight: bold;
  width: 200px;
  color: #4fd1c5;
  font-size: 30px;
  margin-top: -5px;
  margin-right: 20px;
}

.car-information-right-title {
  margin: 40px;
  font-size: 40px;
}

.car-information-right-item {
  margin-top: 30px;
  margin-left: 50px;
}

.car-information-left-bottom {
  margin-left: 50px;
  margin-top: 37px;
}

.extra-large-avatar {
  width: 80px; /* 设置更大的宽度 */
  height: 80px; /* 设置更大的高度 */
}

.car_informationjpg {
  width: 400px; /* 设置更大的宽度 */
  height: 200px; /* 设置更大的高度 */
  margin-left: 50px;
  margin-top: -50px;
}

.information-item-line-right-all{
  margin-top: 70px;
}

.information-item-line-right {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
}
</style>

