<template>
  <div class="block">
    <div class="search-bar">
      <el-form :inline="true" class="search-form">
        <el-row>
          <el-col :span="8">
            <el-form-item label="标题">
              <el-input v-model="searchFormData.title" class="input-box"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发布者">
              <el-input v-model="searchFormData.publisher" class="input-box"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item label="发布时间">
              <el-date-picker v-model="searchFormData.publish_time" type="date" placeholder="选择日期"
                style="width: 100%"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="50">
            <el-form-item label="发布内容">
              <el-input v-model="searchFormData.contents" class="input-box"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <div class="button-wrapper">
          <el-button @click="searchData">搜索</el-button>
        </div>
      </el-form>
    </div>
  </div>

  <!-- 原始的公告展示内容从这里开始 -->
  
  <div class="down-block">
    <div class="inner-block2">
      <div class="top-right">
        <div class="maintenance-title">
          信息公告
        </div>
      </div>
      <div class="infinite-list-wrapper" style="overflow:auto flex:1;" v-loading="loading">
        <ul class="list" :infinite-scroll-disabled="disabled">
          <li v-for="announcement in announcementArray" :key="announcement.announcement_id" class="list-item">
            <div class="list-item-content">
              <div class="list-item-image">
                <img src="@/assets/notice.png" alt="Image" />
              </div>
              <div class="list-item-text">
                <p class="title">{{ announcement.title }}</p>
                <p class="publisher-publish_pos">{{ announcement.publisher }} - {{ announcement.publish_pos
                }}-{{ announcement.publish_time }}</p>
                <p class="announcement-content">
                  {{ somecontents(announcement.contents) }}......
                </p>
              </div>
              <div class="list-item-button">
                <el-button text :icon="Document" @click="openPopup(announcement)">查看详情</el-button>
              </div>
            </div>
          </li>
        </ul>
        <p v-if="noMore">没有更多了</p>
      </div>
    </div>
  </div>

  <!-- 原始的公告展示内容从这里结束 -->

  <!-- 弹窗 -->
  <el-dialog v-model="showPopup" title="公告内容" width="55%" @update:visible="closePopup">

    <p class="title">{{ popupNotice.title }}</p>
    <p class="publisher-publish_pos">发布者：{{ popupNotice.publisher }}</p>
    <p class="publisher-publish_pos">发布对象：{{ popupNotice.publish_pos }}</p>
    <span>发布时间：{{ deletetime(popupNotice.publish_time) }}</span>
    <p class="announcement-content">{{ popupContent }}</p>
    <template #footer>
      <span class="dialog-footer">
        <el-button type="primary" @click="showPopup = false">
          确定
        </el-button>
      </span>
    </template>



  </el-dialog>
</template>
    
<script setup>
import { ref, onMounted, reactive } from "vue";
import cmRequest from "../../service/index.js";
import { ElMessage } from "element-plus";
import { ElLoading } from 'element-plus'
import { Loading } from "element-plus/es/components/loading/src/service";
import { computed } from 'vue'
import { Document } from '@element-plus/icons-vue';

const announcementArray = ref([]);
const loading = ref(true);
const count = ref(4)
const noMore = computed(() => count.value >= announcementArray.value.length)
const disabled = computed(() => loading.value || noMore.value)

const load = () => {
  loading.value = false

}


const searchFormData = reactive({
  title: "",
  publisher: "",
  publish_time: "",
  publish_pos: "深圳",
  contents: "",
});

const queryData = () => {
  const queryParams = {
    title: "",
    publisher: "",
    publish_pos: "",
    contents: "",
    publish_time: ""
  };
  cmRequest
    .request({
      url: "api/administrator/announcement/query",
      method: "GET",
      params: queryParams, // 将搜索参数作为查询参数传递
    })
    .then((res) => {
      if (!res.code) {
        announcementArray.value = res.announcementArray;
      } else {
        ElMessage({
          type: "error",
          message: "未找到内容",
        });
      }
    })
    .catch((error) => {
      console.error("获取数据失败：", error);
      ElMessage({
        type: "error",
        message: "获取数据失败，请稍后再试",
      });
    });
  console.log(loading.value)
};

onMounted(() => {
  queryData(); // 在组件挂载后调用queryData函数获取公告数据
});

const formatDate = (dateString) => {

  if (dateString === "") {
    return "";
  }
  if (dateString === null) {
    return "";
  }
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const somecontents = (dateString) => {
  load();
  if (dateString === null) {
    return "";
  }
  return dateString.slice(0, 80);
};

const deletetime = (dateString) => {

  if (dateString === "") {
    return "";
  }
  if (dateString === null) {
    return "";
  }
  return dateString.slice(0, 10);

};

const searchData = () => {
  // 根据输入的数据准备搜索参数
  const searchParams = {
    title: searchFormData.title,
    publisher: searchFormData.publisher,
    publish_pos: searchFormData.publish_pos,
    contents: searchFormData.contents,
    publish_time: formatDate(searchFormData.publish_time), // 转换日期格式
  };

  cmRequest
    .request({
      //url: "administrator/announcement/query",
      url: "api/administrator/announcement/query",
      method: "GET",
      params: searchParams, // 将搜索参数作为查询参数传递
    })
    .then((res) => {
      console.log(res);
      if (!res.code) {
        announcementArray.value = res.announcementArray;
      } else {
        ElMessage({
          type: "error",
          message: "未找到内容",
        });
      }
    })
    .catch((error) => {
      console.error("获取数据失败：", error);
      ElMessage({
        type: "error",
        message: "获取数据失败，请稍后再试",
      });
    });

};

// 响应式变量用于控制弹窗显示与隐藏
const showPopup = ref(false);

// 弹窗内容
const popupContent = ref("");

// 在弹窗中展示的公告详情
const popupNotice = ref(null);

// 打开弹窗，显示公告的全文内容
const openPopup = (notice) => {
  popupNotice.value = notice; // 设置弹窗中要展示的公告详情
  popupContent.value = notice.contents; // 设置弹窗中要展示的公告内容
  showPopup.value = true; // 显示弹窗
};

const closePopup = () => {
  showPopup.value = false;
};
</script>
  
<style scoped>
.block {
  border: 1px white solid;
  border-radius: 10px;
  box-shadow: 0px 3.500000238418579px 5.500000476837158px 0px rgba(0, 0, 0, 0.066);
  overflow: auto;
  background-color: white;
  margin: 30px 20px;
}

.announcement-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.announcement {
  background-color: #f0f0f0;
  width: 97%;
  margin: 5px 5px;
  border-radius: 30px;
  display: flex;
  align-items: center;
  position: relative;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  /* 修改阴影效果 */
}

.announcement-left {
  padding: 20px;
  flex: 0.9;
  /* 占据剩余空间 */
}

.edit-button {
  position: absolute;
  top: 0;
  right: 0;
  margin: 20px;
  color: #4fd1c5;
}

.view-more-button {
  position: absolute;
  bottom: 0;
  right: 0;
  margin: 20px;
  color: #a7d14f;
}

.meta-info {
  display: flex;
  justify-content: space-between;
  font-size: 14px;
  color: #666;
}

/* 搜索栏的样式 */
.search-bar {
  padding: 20px;
  margin-bottom: 20px;
}

.search-row {
  margin-bottom: 20px;
}

.input-box {
  width: 100%;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

/* 弹窗的样式 */
.el-dialog {
  /* 增加弹窗的宽度 */
  width: 70% !important;
}

.el-dialog__body {
  padding: 20px;
  max-height: 400px;
  overflow-y: auto;
}

.down-block {
  border: 1px white solid;
  border-radius: 10px;
  box-shadow: 0px 3.500000238418579px 5.500000476837158px 0px rgba(0, 0, 0, 0.066);
  overflow: auto;
  background-color: white;
  margin: 1em 1em;
  height: 65vh;
  display: flex;
  /* 使用Flex布局 */
  flex-direction: column;
  /* 纵向排列 */
}

.inner-block {
  padding: 1em 1em 1em 1em;
}

.inner-block2 {
  padding: 1em 1em 1em 1em;
  flex: 1;
}

.maintenance-title {
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 10px;
}

.date-picker-wrapper {
  text-align: right;
}


.infinite-list-wrapper {
  /*height: 300px;*/
}

.infinite-list-wrapper .list {
  padding: 0;
  margin: 0;
  list-style: none;
}

.infinite-list-wrapper .list-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100px;
  border-bottom: 1px solid #ddd;
}

.infinite-list-wrapper .list-item+.list-item {
  margin-top: 10px;
}

.infinite-list-wrapper .list-item-content {
  display: flex;
  align-items: center;
  width: 100%;
}

.infinite-list-wrapper .list-item-image {
  margin-right: 10px;
}

.infinite-list-wrapper .list-item-image img {
  width: 75px;
  height: 75px;
  object-fit: cover;
}

.infinite-list-wrapper .list-item-text {
  flex: 1;
  margin-left: 10px;
}

.infinite-list-wrapper .title {
  font-weight: bold;
}

.infinite-list-wrapper .publisher-publish_pos {
  font-size: 14px;
  color: #999;
}

.container-vertical {
  display: flex;
  flex-direction: row;
  align-items: stretch;
}

.left-info-part {
  display: flex;
  flex: 70%;
  border-right: 1px solid #ccc;
  padding-right: 1em;
}

.detail-info {
  flex: 70%;
}

.form-item-margin {
  margin-top: 40px;
  /* 添加上边框间距 */
  margin-left: 30px;
  /* 添加左边框间距 */
}

.top-right {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end;
}

.button-wrapper2 {
  display: flex;
  justify-content: flex-start;
}

/* 如果需要，可以在这里添加更多的样式 */
</style>
  
