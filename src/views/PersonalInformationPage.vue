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
            <p>姓名：{{ userInfo.user_name }}</p>
            <p>昵称：{{ userInfo.user_nickname }}</p>
            <p>生日：{{ userInfo.birthday }}</p>
          </div>
          <div class="information-item-line">
            <p>性别：{{ userInfo.gender }}</p>
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
          <h2>住址及联系方式</h2>
          <div class="information-item-line">
            <p>手机号码：{{ userInfo.phone_number }}</p>
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
      <div class="information-item">
        <div class="inner-block">
          <el-form label-width="100px" class="form-item-margin">
            <el-form-item label="当前车辆">
              <el-select
                v-model="selectedValue"
                filterable
                placeholder="请选择"
                @change="updateSelected"
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="车型:">
              <div class="value">{{ infoForm.vehicle_model }}</div>
            </el-form-item>
            <el-form-item label="购车时间:">
              <div class="value">{{ infoForm.purchase_date }}</div>
            </el-form-item>
            <el-form-item label="当前电池电量:">
              <div class="value">{{ infoForm.current_capacity }}</div>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <el-dialog v-model="editDialogVisible" title="编辑信息" width="30%">
      <el-form :model="editedUserInfo" ref="editForm" label-width="80px">
        <el-form-item label="姓名">
          <el-input v-model="editedUserInfo.user_name"></el-input>
        </el-form-item>
        <el-form-item label="昵称">
          <el-input v-model="editedUserInfo.user_nickname"></el-input>
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
import cmRequest from "../service/index.js";
import { ElMessage } from "element-plus";

/* 车辆组件区开始 */

const options = [
  { value: "1", label: "沪A12345" },
  { value: "2", label: "沪B12345" },
  { value: "3", label: "沪C12345" },
  { value: "4", label: "沪D12345" },
  { value: "5", label: "沪E12345" },
];

const selectedValue = ref("");

const infoForm = reactive({
  vehicle_id: "",
  vehicle_model: "",
  purchase_date: "",
  current_capacity: "",
});

const updateSelected = () => {
  // 根据选择器的选择更新相关变量的值
  infoForm.vehicle_id = selectedValue;
  //写接口
  infoForm.vehicle_model = "更新后的车型";
  infoForm.purchase_date = "更新后的购车时间";
  infoForm.current_capacity = "更新后的电池电量";
  //获取当前的维修订单的接口
  //更新repairRoughItem的值
};

/* 车辆组件区结束 */

const userInfo = reactive({
  user_name: "",
  user_nickname: "",
  gender: "",
  birthday: "",
  address: "",
  phone_number: "",
  email: "",
});

const queryData = () => {
  cmRequest
    .request({
      url: "http://127.0.0.1:4523/m2/3058331-0-default/103497189",
      method: "GET",
    })
    .then((res) => {
      if (!res.code) {
        const userData = res; // 假设响应数据就是用户信息
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
  user_nickname: "",
  gender: "",
  birthday: "",
  address: "",
  phone_number: "",
  email: "",
});

const showEditDialog = (userInfo) => {
  editedUserInfo.user_name = userInfo.user_name;
  editedUserInfo.user_nickname = userInfo.user_nickname;
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
      url: "http://127.0.0.1:4523/m2/3058331-0-default/98567695",
      method: "PATCH",
      data: editedUserInfo, // 使用编辑后的用户信息作为请求数据
    })
    .then((res) => {
      console.log(editedUserInfo);
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

/* 车辆组件区开始 */

.inner-block {
  padding: 20px 20px 30px 20px;
}

.form-item-margin {
  margin-top: 40px;
  /* 添加上边框间距 */
  margin-left: 30px;
  /* 添加左边框间距 */
}
/* 车辆组件区结束 */
</style>