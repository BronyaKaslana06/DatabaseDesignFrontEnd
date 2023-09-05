<template>
  <div v-loading="loadTableData">
    <div class="information_background">
      <div class="username-container">
        <el-avatar
          class="extra-large-avatar"
          :src="require('../../assets/staffAvatar.svg')"
        ></el-avatar>
        <p class="username">欢迎,{{ user_name }}</p>
        <p class="userid">id:{{ storedUserInfo }}</p>
      </div>
    </div>
    <div class="information-item-container">
      <div class="information-item">
        <div class="information-item-all">
          <p class="car-information-left-top-text">个人资料</p>
          <div class="information-item-left">
            <div class="information-item-line">
              <p><strong>姓名：</strong>{{ userInfo.personalInfo.name }}</p>
              <p><strong>联系方式：</strong>{{ userInfo.personalInfo.phone_number }}</p>
              <p><strong>职位：</strong>{{ userInfo.personalInfo.postions }}</p>
            </div>
            <div class="information-item-line">
              <p><strong>性别：</strong>{{ userInfo.personalInfo.gender }}</p>
              <p><strong>评语：</strong>{{ userInfo.performance.total_performance }}</p>
              <p><strong>绩效：</strong>{{ userInfo.performance.score }}</p>
            </div>
            <div class="information-item-right">
              <Text class="edit-button" @click="showEditDialog(userInfo)"
                >编辑</Text
              >
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="block">
      <div class="inner-block">
        <div class="title-and-left">
          <div class="mytitle">
            <p class="car-information-left-top-text">我的换电站</p>
          </div>
          <div class="left-section">
            <div class="text-section">
              <el-form label-width="150px">
                <el-form-item label="换电站名字 :" style="font-weight: bold">
                  {{ stationInfo.station_name }}
                </el-form-item>
                <el-form-item label="换电站ID :" style="font-weight: bold">
                  {{ stationInfo.station_id }}
                </el-form-item>
                <el-form-item label="换电站地址 :" style="font-weight: bold">
                  {{ stationInfo.station_name }}
                </el-form-item>
                <el-form-item label="电池情况 :" style="font-weight: bold">
                  {{ stationInfo.available_battery_count }} /
                  {{ stationInfo.battery_capacity }}
                </el-form-item>
              </el-form>
            </div>
          </div>
        </div>
        <div class="right-section">
          <div id="myMap" style="width: 100%; height: 260px"></div>
        </div>
      </div>
    </div>

    <el-dialog v-model="editDialogVisible" title="编辑信息" width="30%">
      <el-form :model="editedUserInfo" ref="editForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="editedUserInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="联系方式">
          <el-input v-model="editedUserInfo.phone_number"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-select v-model="editedUserInfo.gender">
            <el-option key="1" value="男" label="男"> </el-option>
            <el-option key="2" value="女" label="女"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveEditedInfo">保存</el-button>
          <el-button @click="editDialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>
  
  <script setup>
import { ref, reactive, onMounted } from "vue";
import cmRequest from "../../service/index.js";
import { ElMessage } from "element-plus";

const userInfo = reactive({
  personalInfo: {
    name: "",
    postions: "",
    gender: "",
    phone_number: "",
  },
  performance: {
    total_performance: "",
    service_frequency: "",
    score: "",
  },
});

const storedUserInfo = JSON.parse(localStorage.getItem("user_id")); //获取用户ID
const user_name = ref(localStorage.getItem("username"));
const loadTableData = ref(false);

const queryData = () => {
  loadTableData.value = true;
  cmRequest
    .request({
      url: "api/staff/my-info/" + storedUserInfo,
      method: "GET",
    })
    .then((res) => {
      console.log(res.data);
      if (!res.code) {
        const userData = res.data; // 假设响应数据就是用户信息
        Object.assign(userInfo, userData); // 将获取的用户信息赋值给 userInfo
        console.log(res);
        loadTableData.value = false;
      } else {
        ElMessage({
          type: "error",
          message: "未找到内容",
        });
        console.log(res);
        loadTableData.value = false;
      }
    })
    .catch((error) => {
      console.error("获取用户信息失败：", error);
      ElMessage({
        type: "error",
        message: "获取用户信息失败，请稍后再试",
      });
      loadTableData.value = false;
    });
};

const editDialogVisible = ref(false);

const editedUserInfo = reactive({
  name: "",
  gender: "",
  phone_number: "",
});

const showEditDialog = (userInfo) => {
  editedUserInfo.name = userInfo.personalInfo.name;
  editedUserInfo.gender = userInfo.personalInfo.gender;
  editedUserInfo.phone_number = userInfo.personalInfo.phone_number;
  editDialogVisible.value = true;
};

const saveEditedInfo = () => {
  cmRequest
    .request({
      url: "api/staff/my-info/" + storedUserInfo + "/edit",
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

const stationInfo = ref({});

const pullData = () => {
  cmRequest
    .request({
      url: "api/staff/switchstation/station_info",
      method: "GET",
      params: {
        employee_id: localStorage.getItem("user_id").toString(),
      },
    })
    .then((res) => {
      if (!res.code) {
        ElMessage({
          type: "success",
          message: "刷新成功",
        });
        stationInfo.value = res.data;
        mapOpen(res.data.longitude,res.data.latitude);
      } else {
        ElMessage({
          type: "error",
          message: "刷新失败",
        });
      }
    });
};
pullData();

const mapOpen = (lng,lat) => {
  const BMap = window.BMap;
  var map = new BMap.Map("myMap");
  console.log(lng)
  console.log(lat)
  var point = new BMap.Point(
    lng,
    lat
  ); //?
  map.centerAndZoom(
    new BMap.Point(lng, lat),
    11
  ); //?
  map.enableScrollWheelZoom(true);
  var marker = new BMap.Marker(point);
  map.addOverlay(marker);
};
// onMounted(() => {
//   mapOpen();
// });

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
  height: 300px;
  border-radius: 15.000000953674316px;
  background-color: #fff;
  display: flex;
  align-items: center;
  position: relative;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 修改阴影效果 */
}

.information-item-all {
  margin-left: 40px;
  margin-top: 40px;
}

.information-item-left {
  display: flex;
  margin-left: 50px;
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

.extra-large-avatar {
  width: 80px; /* 设置更大的宽度 */
  height: 80px; /* 设置更大的高度 */
}

.block {
  border: 1px white solid;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1); /* 修改阴影效果 */
  overflow: auto;
  background-color: white;
  margin: 30px 20px;
  width: 1050px;
  margin-left: 50px;
}

.mytitle {
  margin-left: 30px;
}

.text-section {
  border: 2px solid transparent;
  /* 透明边框，确保阴影显示 */
  box-shadow: 0px 12px 24px rgba(0, 0, 0, 0.1);
  /* 上下阴影 */
  padding: 5px;
  /* 调整内边距 */
  border-radius: 20px;
  /* 圆角 */
  padding-right: 40px;
  /* 调整距离 */
}

.text-section .el-form-item {
  border-bottom: 2px solid #ddd;
  /* 底部横线分隔线 */
  margin-bottom: 20px;
  /* 控制间距 */
  padding-bottom: 10px;
  /* 控制底部内边距 */
}

.text-section .el-form-item:last-child {
  border-bottom: none;
  /* 移除最后一个元素的底部边框 */
}

.inner-block {
  display: flex;
  align-items: flex-start;
  padding: 20px 20px 60px 20px;
}
.left-section {
  flex: 1;
  margin-right: 70px;
  margin-left: 30px;
  width: 400px;
}

.right-section {
  width: 60%;
  margin-top: 100px;
  margin-right: 50px;
}

.title-and-left {
  display: flex;
  flex-direction: column;
}

.car-information-left-top-text {
  font-weight: bold;
  width: 200px;
  color: #4fd1c5;
  font-size: 30px;
}
</style>


