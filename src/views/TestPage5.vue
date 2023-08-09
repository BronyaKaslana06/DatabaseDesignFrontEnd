<template>
    <el-page-header :icon="ArrowLeft">
      <template #content>
        <span class="text-large font-600 mr-3"> 公告管理 </span>
      </template>
    </el-page-header>
    <div class="block">
      <div class="search-bar">
        <el-form :inline="true" class="search-form">
          <el-row>
            <el-col :span="8">
              <el-form-item label="标题">
                <el-input
                  v-model="searchFormData.title"
                  class="input-box"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布者">
                <el-input
                  v-model="searchFormData.publisher"
                  class="input-box"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布时间">
                <el-input
                  v-model="searchFormData.publish_time"
                  class="input-box"
                ></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="8">
              <el-form-item label="浏览数">
                <el-input
                  v-model="searchFormData.view_count"
                  class="input-box"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="收藏数">
                <el-input
                  v-model="searchFormData.likes"
                  class="input-box"
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="发布对象">
                <el-input
                  v-model="searchFormData.publish_pos"
                  class="input-box"
                ></el-input>
              </el-form-item>
            </el-col>
            <!-- 如果需要，可以在这里添加更多的搜索字段 -->
          </el-row>
          <div class="button-wrapper">
            <el-button @click="searchData">搜索</el-button>
            <el-button @click="showCreatePopup = true">新建</el-button>
          </div>
        </el-form>
      </div>
    </div>
  
    <!-- 原始的公告展示内容从这里开始 -->
    <div class="announcement-container">
      <div
        class="announcement"
        v-for="announcement in announcementArray"
        :key="announcement.announcement_id"
      >
        <div class="announcement-left">
          <h3>{{ announcement.title }}</h3>
          <div class="meta-info">
            <span>发布者：{{ announcement.publisher }}</span>
            <span>发布对象：{{ announcement.publish_pos }}</span>
            <span>发布时间：{{ announcement.publish_time }}</span>
          </div>
          <div class="meta-info">
            <span>收藏数：{{ announcement.likes }}</span>
            <span>浏览数：{{ announcement.view_count }}</span>
          </div>
          <p class="announcement-content">
            {{ announcement.contents.slice(0, 80)
            }}{{ announcement.contents.length > 80 ? "..." : "" }}
          </p>
        </div>
        <!-- 在右侧显示按钮容器 -->
        <div class="announcement-right">
          <div class="announcement-buttons">
            <Text class="edit-button" @click="openEditPopup(announcement)"
              >编辑</Text
            >
            <Text class="view-more-button" @click="openPopup(announcement)"
              >查看全文</Text
            >
          </div>
        </div>
      </div>
    </div>
    <!-- 原始的公告展示内容从这里结束 -->
  
    <!-- 弹窗 -->
    <el-dialog
      v-model="showPopup"
      title="公告内容"
      width="70%"
      @update:visible="closePopup"
    >
      <div class="popup-header">
        <div class="popup-title">{{ popupNotice.title }}</div>
        <div class="popup-item">
          <div class="popup-item">发布者：{{ popupNotice.publisher }}</div>
          <div class="popup-item">发布对象：{{ popupNotice.publish_pos }}</div>
          <span>发布时间：{{ popupNotice.publish_time }}</span>
          <div class="popup-item">收藏数：{{ popupNotice.likes }}</div>
          <div class="popup-item">阅读量：{{ popupNotice.view_count }}</div>
        </div>
      </div>
      <!-- 公告的完整内容 -->
      <div class="popup-notice-content">{{ popupContent }}</div>
    </el-dialog>
  
    <el-dialog v-model="showEditPopup" title="编辑公告" width="50%">
      <div class="edit-popup">
        <el-form ref="editForm" :model="editFormData" label-width="100px">
          <el-form-item label="标题">
            <el-input v-model="editFormData.title"></el-input>
          </el-form-item>
          <el-form-item label="发布对象">
            <el-input v-model="editFormData.publish_pos"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input
              type="textarea"
              v-model="editFormData.contents"
              rows="5"
              resize="none"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="button-wrapper">
          <el-button @click="deleteAnnouncement">删除</el-button>
          <el-button @click="closeEditPopup">取消</el-button>
          <el-button type="primary" @click="saveEdit">保存</el-button>
        </div>
      </div>
    </el-dialog>
  
    <el-dialog
      v-model="showCreatePopup"
      title="新建公告"
      width="50%"
      @update:visible="closeCreatePopup"
    >
      <div class="create-popup">
        <el-form ref="createForm" :model="createFormdata" label-width="100px">
          <el-form-item label="标题">
            <el-input v-model="createFormdata.title"></el-input>
          </el-form-item>
          <el-form-item label="发布对象">
            <el-input v-model="createFormdata.publish_pos"></el-input>
          </el-form-item>
          <el-form-item label="内容">
            <el-input
              type="textarea"
              v-model="createFormdata.contents"
              rows="5"
              resize="none"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="button-wrapper">
          <el-button @click="closeCreatePopup">取消</el-button>
          <el-button type="primary" @click="saveCreate">保存</el-button>
        </div>
      </div>
    </el-dialog>
  </template>
    
    <script setup>
  import { ref, onMounted, reactive } from "vue";
  import cmRequest from "../service/index.js";
  import { ElMessage } from "element-plus"; // 从Element Plus导入ElMessage
  
  const announcementArray = ref([]);
  
  const searchFormData = reactive({
    title: "",
    publisher: "",
    publish_time: "",
    view_count: "",
    likes: "",
    publish_pos: "",
  });
  
  const queryData = () => {
    cmRequest
      .request({
        url: "administrator/announcement/message",
        method: "GET",
        // 如果需要发送其他参数，请在params中添加
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
  };
  
  onMounted(() => {
    queryData(); // 在组件挂载后调用queryData函数获取公告数据
  });
  
  const searchData = () => {
    // 根据输入的数据准备搜索参数
    const searchParams = {
      title: searchFormData.title,
      publisher: searchFormData.publisher,
      view_count: searchFormData.view_count,
      likes: searchFormData.likes,
      publish_pos: searchFormData.publish_pos,
      publish_time: searchFormData.publish_time,
    };
  
    cmRequest
      .request({
        url: "administrator/announcement/query",
        method: "GET",
        params: searchParams, // 将搜索参数作为查询参数传递
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
  
  // 控制编辑弹窗的显示
  const showEditPopup = ref(false);
  
  // 保存当前编辑的公告信息
  const editFormData = reactive({
    announcement_id: "",
    title: "",
    publisher: "",
    view_count: "",
    likes: "",
    publish_pos: "",
    contents: "",
    publish_time: "",
  });
  
  // 打开编辑弹窗，传递公告信息
  const openEditPopup = (announcement) => {
    editFormData.publish_pos = announcement.publish_pos;
    editFormData.contents = announcement.contents;
    editFormData.title = announcement.title;
    editFormData.announcement_id = announcement.announcement_id;
    editFormData.likes = announcement.likes;
    editFormData.publisher = announcement.publisher;
    editFormData.view_count = announcement.view_count;
    editFormData.publish_time = announcement.publish_time;
    showEditPopup.value = true;
  };
  
  // 关闭编辑弹窗
  const closeEditPopup = () => {
    showEditPopup.value = false;
  };
  
  // 保存编辑
  const saveEdit = () => {
    // 模拟保存编辑后的公告的 PATCH 请求
    const patchData = {
      announcement_id: editFormData.announcement_id,
      publish_time: editFormData.publish_time,
      publish_pos: editFormData.publish_pos,
      title: editFormData.title,
      contents: editFormData.contents,
      likes: editFormData.likes,
      view_count: editFormData.view_count,
      publisher: editFormData.publisher,
    };
    console.log(editFormData);
    cmRequest
      .request({
        url: "administrator/announcement",
        method: "PATCH",
        data: patchData,
      })
      .then((res) => {
        if (!res.code) {
          // 保存成功，处理相关逻辑
          ElMessage({
            type: "success",
            message: "编辑公告成功",
          });
          closeEditPopup(); // 关闭弹窗
        } else {
          // 保存失败，显示错误消息
          ElMessage({
            type: "error",
            message: "保存失败，请稍后再试",
          });
        }
      })
      .catch((error) => {
        console.error("保存数据失败：", error);
        ElMessage({
          type: "error",
          message: "保存数据失败，请稍后再试",
        });
      });
  };
  
  const showCreatePopup = ref(false);
  
  const createFormdata = reactive({
    title: "",
    publish_pos: "",
    contents: "",
  });
  
  const closeCreatePopup = () => {
    showCreatePopup.value = false;
  };
  
  const saveCreate = () => {
    // 模拟保存新建公告的POST请求
    const currentDate = new Date();
    const dateString = currentDate.toISOString().substr(0, 10);// 当前日期

    const postData = {
      title: createFormdata.title,
      publish_pos: createFormdata.publish_pos,
      contents: createFormdata.contents,
      publisher: "管理员", // 默认值
      publish_time: dateString, // 通过new Date()获取日期
      view_count: 0, // 默认值
      likes: 0, // 默认值
    };
  
    cmRequest
      .request({
        url: "administrator/announcement/addition",
        method: "POST",
        data: postData,
      })
      .then((res) => {
        console.log(postData);
        console.log(res);
        console.log(res.code);
        if (!res.code) {
          // 保存成功，处理相关逻辑
          ElMessage({
            type: "success",
            message: "新建公告成功",
          });
          closeCreatePopup(); // 关闭弹窗
        } else {
          // 保存失败，显示错误消息
          ElMessage({
            type: "error",
            message: "保存失败，请稍后再试",
          });
        }
      })
      .catch((error) => {
        console.error("保存数据失败：", error);
        ElMessage({
          type: "error",
          message: "保存数据失败，请稍后再试",
        });
      });
  };
  
  const deleteAnnouncement = () => {
    const announcementIdToDelete = editFormData.announcement_id;
  
    cmRequest
      .request({
        url: "administrator/announcement/erasure",
        method: "DELETE",
        data: { announcement_id: announcementIdToDelete },
      })
      .then((res) => {
          console.log(announcementIdToDelete);
          console.log(res);
        if (!res.code) {
          // 删除成功，处理相关逻辑
          ElMessage({
            type: "success",
            message: "删除公告成功",
          });
          closeEditPopup(); // 关闭编辑弹窗
        } else {
          // 删除失败，显示错误消息
          ElMessage({
            type: "error",
            message: "删除失败，请稍后再试",
          });
        }
      })
      .catch((error) => {
        console.error("删除数据失败：", error);
        ElMessage({
          type: "error",
          message: "删除数据失败，请稍后再试",
        });
      });
  };
  </script>
  
    <style scoped>
  .block {
    border: 1px white solid;
    border-radius: 10px;
    box-shadow: 0px 3.500000238418579px 5.500000476837158px 0px
      rgba(0, 0, 0, 0.066);
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
  }
  
  .announcement-left {
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
    /* 美化弹窗内容 - 添加内边距和设置最大高度以进行滚动 */
    padding: 20px;
    max-height: 400px;
    overflow-y: auto;
  }
  /* 如果需要，可以在这里添加更多的样式 */
  </style>
