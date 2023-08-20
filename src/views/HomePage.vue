<template>
  <el-container class="main-container">
    <el-header class="custom-header">
      <div class="logo-text-container">
        <div class="logo">
          <img src="@/assets/Logo.png" alt="Logo">
        </div>
        <span class="logo-text">智能电动汽车管理系统</span>
      </div>
      <div class="user-info">
        <el-avatar :src="userAvatar || defaultAvatar" size="default"></el-avatar>
        <span class="welcome-text">欢迎，{{ user_id }}</span>
        <el-icon class="setting-icon" size="1.5em" @click="goToSettings"><Setting /></el-icon>
        <el-icon class="logout-icon" size="1.5em" @click="logout"><CloseBold /></el-icon>
      </div>
    </el-header>
    <el-container>
      <el-aside class="nav-class">
        <my-sl-nav/>
      </el-aside>
      <el-main>
        <div class="content">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
  
</template>

<script setup>
import mySlNav from '../components/sliderbar-nav.vue'
import { ref, onMounted } from 'vue';
import { Setting, CloseBold } from '@element-plus/icons-vue';

const userAvatar = ref('');
const user_id = ref('');
const defaultAvatar = '@/assets/defaultAvatar.jpg'; // 设置默认头像路径
// localStorage.setItem('user_type', '0');

onMounted(() => {
  // 从localStorage中获取用户头像和用户名
  userAvatar.value = localStorage.getItem('userAvatar');
  console.log(localStorage.getItem('user_type'));
  user_id.value = localStorage.getItem('user_id');
});

const goToSettings = () => {
  // 处理设置按钮点击事件
  // 进行相应的操作
};

const logout = () => {
  // 处理退出登录按钮点击事件
  // 进行相应的操作
};

</script>

<style scoped>
.setting-icon,
.logout-icon {
  /*font-size: 2em;*/
  cursor: pointer;
  margin-left: 0.5
  em; 
}

.setting-icon:hover,
.logout-icon:hover {
  color: #1a9cff;
}
.main-container {
  height: 100vh; /* 设置容器高度 */
  overflow: hidden; /* 隐藏滚动条 */
}
.logo-text-container {
  display: flex;
  align-items: center; /* 垂直居中 */
}

.logo-text {
  font-size: 1.5em;
  margin-left: 1.5em;
  /*margin-right: 10px; */
}

.el-aside {
  width: 15%;
  position: fixed;
  background-color: #f5f5f5; /* 较浅的灰色 */
}

.content {
  margin-left: 20%;
  height: 100vh;
}

.el-main {
  height: 100vh;
}

.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2em 2em; /* 增加顶栏的上下内边距 */
  background: linear-gradient(to right, #f3f6f3, #51f83b);
  height: 4.5em; /* 增加顶栏的高度 */
}

.logo img {
  height: 4.5em;
}
.user-info {
  display: flex;
  align-items: center;
}
.welcome-text {
  margin-left: 10px;
  margin-right: 1.8em; 
}
</style>
