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
            <p>姓名：{{ userInfo.personalInfo.name }}</p>
            <p>联系方式：{{ userInfo.personalInfo.phone_number }}</p>
          </div>
          <div class="information-item-line">
            <p>职位：{{ userInfo.personalInfo.positions }}</p>
            <p>性别：{{ userInfo.personalInfo.gender }}</p>
          </div>
          <div class="information-item-line">
            <p>评语：{{ userInfo.performance.total_performance }}</p>
            <p>服务次数：{{ userInfo.performance.service_frequency }}</p>
          </div>
          <div class="information-item-line">
            <p>评分：{{ userInfo.performance.score }}</p>
          </div>
          <div class="information-item-right">
            <Text class="edit-button" @click="showEditDialog(userInfo)"
              >编辑</Text
            >
          </div>
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
import { ref, reactive } from "vue";
import cmRequest from "../../service/index.js";
import { ElMessage } from "element-plus";

const userInfo = reactive({
  personalInfo: {
    name: "",
    positions: "",
    gender: "",
    phone_number: "",
  },
  performance: {
    total_performance: "",
    service_frequency: "",
    score: "",
  },
});

const storedUserInfo = JSON.parse(localStorage.getItem("user_id"));
const user_name = JSON.parse(localStorage.getItem("username")); //获取用户名

const queryData = () => {
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
      } else {
        ElMessage({
          type: "error",
          message: "未找到内容",
        });
        console.log(res);
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
  margin-top:40px ;
}

.information-item-container {
  display: flex;
  flex-direction: column;
  margin-left: 50px;
}

.information-item {
  width: 1050px;
  height: 350px;
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

.extra-large-avatar {
  width: 80px; /* 设置更大的宽度 */
  height: 80px; /* 设置更大的高度 */
}
</style>
