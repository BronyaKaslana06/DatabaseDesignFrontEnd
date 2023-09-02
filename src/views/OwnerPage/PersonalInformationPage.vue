<template>
  <div>
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
        <div class="information-item-left">
          <h2>个人资料</h2>
          <div class="information-item-line">
            <p>姓名：{{ userInfo.user_name }}</p>
            <p>生日：{{ userInfo.birthday }}</p>
          </div>
          <div class="information-item-line">
            <p>性别：{{ userInfo.gender }}</p>
            <p>手机号码：{{ userInfo.phone_number }}</p>
          </div>
          <div class="information-item-line">
            <p>家庭住址：{{ userInfo.address }}</p>
            <p>邮箱：{{ userInfo.email }}</p>
          </div>
          <div class="information-item-right">
            <Text class="edit-button" @click="showEditDialog(userInfo)"
              >编辑</Text
            >
          </div>
        </div>
      </div>
      <div class="car-information">
        <div class="car-information-left">
          <div class="car-information-left-top">
            <p class="car-information-left-top-text">蔚来</p>
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
          <img :src="car_information.snip" class="" alt="" />
          <div class="car-information-left-bottom">
            <div class="information-item-line-other1">
              <p>行驶里程数：{{ car_information.mileage }}(单位：Km)</p>
            </div>
            <div class="information-item-line-other2">
              <p>
                剩余电量：{{
                  formatScientificToPercentage(
                    car_information.current_capacity
                  )
                }}({{ car_information.battery_type }})
              </p>
            </div>
            <div class="information-item-line-other3">
              <p>温度：{{ car_information.temperature }}°C</p>
            </div>
          </div>
        </div>
        <div class="car-information-right">
          <div>
            <p class="car-information-right-title">车辆详情信息</p>
          </div>
          <div class="car-information-right-item">
            <div class="information-item-line">
              <p>型号：{{ car_information.vehicle_model }}</p>
            </div>
            <div class="information-item-line">
              <p>保修期限：{{ car_information.warrange }}</p>
            </div>
            <div class="information-item-line">
              <p>电池id：{{ car_information.battery_id }}</p>
            </div>
            <div class="information-item-line">
              <p>购入时间：{{ car_information.purchase_date }}</p>
            </div>
            <div class="information-item-line">
              <p>发动机：{{ car_information.transmission }}</p>
            </div>
            <div class="information-item-line">
              <p>最高时速：{{ car_information.mileage }}</p>
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
const user_name = JSON.parse(localStorage.getItem("username"));//获取用户名

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
          selectedPlateNumber.value = ""; // 设置默认选中的车牌号
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
        car_information.snip = res.data.snip;
        car_information.mileage = res.data.mileage;
        car_information.max_speed = res.data.max_speed;
        car_information.transmission = res.data.transmission;
        car_information.battery_type = res.data.battery_type;
        car_information.warrange = res.data.warrange;
        car_information.temperature = res.data.temperature;
      } else {
        ElMessage({
          type: "error",
          message: "未找到信息",
        });
      }
    })
    .catch((error) => {
      console.error("获取信息失败：", error);
      ElMessage({
        type: "error",
        message: "获取信息失败，请稍后再试",
      });
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

// 在查询用户信息之前调用获取车牌号列表的函数
fetchPlateNumbers(); // 获取车牌号列表

queryData(); // 在组件加载时获取用户信息
</script>

<style scoped>
.information_background {
  width: 1235px;
  height: 400px;
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
  margin-top: 340px;
  margin-left: 120px;
  z-index: 1;
}

.username{
  font-size:26px;
  color: #fff; /* 设置文本颜色为蓝色 */
  font-weight: bold; /* 设置文本为加粗 */
  margin-left:10px ;
}

.userid{
  font-size:15px;
  color: #fff; /* 设置文本颜色为蓝色 */
  margin-left:60px ;
  margin-top:45px ;
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
  display: flex;
  align-items: center;
  position: relative;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 修改阴影效果 */
}

.information-item-left {
  padding: 20px;
  flex: 0.9; /* 占据剩余空间 */
}

.edit-button {
  position: absolute;
  top: 0;
  right: 0;
  margin: 20px;
  color: #4fd1c5;
}

.information-item-line {
  display: flex;
  justify-content: space-between;
  font-size: 20px;
}

.information-item-line-other1 {
  display: flex;
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
  content: "";
  display: inline-block;
  width: 24px; /* 设置图表图片的宽度 */
  height: 24px; /* 设置图表图片的高度 */
  margin-right: 5px; /* 可以根据需要调整图片与文本之间的间距 */
  background-image: url("@/assets/bar-chart.png"); /* 图表图片的路径 */
  background-size: contain; /* 图片适应容器大小 */
  background-repeat: no-repeat;
}

.information-item-line-other2 p::before {
  content: "";
  display: inline-block;
  width: 24px; /* 设置图表图片的宽度 */
  height: 24px; /* 设置图表图片的高度 */
  margin-right: 5px; /* 可以根据需要调整图片与文本之间的间距 */
  background-image: url("@/assets/battery-half.png"); /* 图表图片的路径 */
  background-size: contain; /* 图片适应容器大小 */
  background-repeat: no-repeat;
}

.information-item-line-other3 p::before {
  content: "";
  display: inline-block;
  width: 24px; /* 设置图表图片的宽度 */
  height: 24px; /* 设置图表图片的高度 */
  margin-right: 5px; /* 可以根据需要调整图片与文本之间的间距 */
  background-image: url("@/assets/Vector.png"); /* 图表图片的路径 */
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
  width: 520px;
  height: 550px;
  border-radius: 15.000000953674316px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 修改阴影效果 */
  margin-left: 5px;
}

.car-information-right {
  background-color: #fff;
  width: 520px;
  height: 550px;
  border-radius: 15.000000953674316px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 修改阴影效果 */
  margin-left: 65px;
}

.car-information-left-top {
  margin: 30px;
  display: flex;
}

.car-information-left-top-text {
  color: #4fd1c5;
  font-size: 30px;
  margin-top: -5px;
  margin-right: 80px;
}

.car-information-right-title {
  margin: 40px;
  font-size: 40px;
}

.car-information-right-item {
  margin: 40px;
}

.car-information-left-bottom {
  margin: 50px;
}

.extra-large-avatar {
  width: 80px; /* 设置更大的宽度 */
  height: 80px; /* 设置更大的高度 */
}
</style>
