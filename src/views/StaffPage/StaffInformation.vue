<template>
  <div>
    <div class="information-item-container">
      <el-page-header :icon="ArrowLeft">
        <template #content>
          <span class="text-large font-600 mr-3"> 个人信息 </span>
        </template>
      </el-page-header>
      <div class="information-item">
        <div class="information-item-left">
          <h2>个人资料</h2>
          <div class="information-item-line">
            <p>姓名：{{ userInfo.personalInfo.name }}</p>
            <p>联系方式：{{ userInfo.personalInfo.phone_number }}</p>
            <p>职位：{{ userInfo.personalInfo.positions }}</p>
          </div>
          <div class="information-item-line">
            <p>性别：{{ userInfo.personalInfo.gender }}</p>
          </div>
          <div class="information-item-right">
            <Text class="edit-button" @click="showEditDialog(userInfo)"
              >编辑</Text
            >
          </div>
        </div>
      </div>
      <div class="information-item">
        <div class="information-item-left">
          <h2>绩效</h2>
          <div class="information-item-line">
            <p>评语：{{ userInfo.performance.total_performance }}</p>
            <p>服务次数：{{ userInfo.performance.service_frequency }}</p>
            <p>评分：{{ userInfo.performance.score }}</p>
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
        <el-form-item label="职位">
          <el-input v-model="editedUserInfo.positions"></el-input>
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

const queryData = () => {
  cmRequest
    .request({
      url: "api/staff/my-info",
      params:{
        staff_id: localStorage.getItem("user_id")
      },
      method: "GET",
    })
    .then((res) => {
      console.log(res);
      if (res) {
        const userData = res; // 假设响应数据就是用户信息
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
  positions: "",
  gender: "",
  phone_number: "",
});

const showEditDialog = (userInfo) => {
  editedUserInfo.name = userInfo.personalInfo.name;
  editedUserInfo.positions = userInfo.personalInfo.positions;
  editedUserInfo.gender = userInfo.personalInfo.gender;
  editedUserInfo.phone_number = userInfo.personalInfo.phone_number;
  editDialogVisible.value = true;
};

const saveEditedInfo = () => {
  cmRequest
    .request({
      url: "http://127.0.0.1:4523/m2/3058331-0-default/98567695",
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
.information-item-container {
  display: flex;
  flex-direction: column;
  gap: 20px; /* 添加间隔 */
  padding-bottom: 100px; /* 调整数值以设置所需的空白大小 */
}

.information-item {
  background-color: #f0f0f0;
  width: 97%;
  margin: 5px 5px;
  border-radius: 30px;
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
  font-size: 16px;
}
</style>