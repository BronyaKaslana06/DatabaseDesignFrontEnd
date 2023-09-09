<!-- eslint-disable no-unused-vars -->
<template>
  <!-- <el-container class="main-container"> -->
    <el-header class="custom-header">
      <div class="logo-text-container">
        <div class="logo">
          <img src="@/assets/logo.png" alt="Logo">
        </div>
        <span class="logo-text">智能电动汽车服务系统</span>
      </div>
      <div class="user-info">
        <div @click="goToSelfCenter" style="cursor: pointer; display:flex;">
          <el-avatar v-if="userType === '0'" :src="require('../assets/UserAvatar.svg')" size="default"></el-avatar>
          <el-avatar v-else-if="userType === '1'" :src="require('../assets/staffAvatar.svg')" size="default"></el-avatar>
          <el-avatar v-else-if="userType === '2'" :src="require('../assets/AdminAvatar.svg')" size="default"></el-avatar>
          <el-avatar v-else size="default"></el-avatar>
          <span class="welcome-text">欢迎，{{ user_name }}</span>
        </div>
        <el-icon class="home-icon" size="1.5em" @click="goToHomes"><HomeFilled /></el-icon>
        <el-icon class="logout-icon" size="1.5em" @click="logout"><CloseBold /></el-icon>
      </div>
    </el-header>
    <el-container>
      <el-aside class="nav-class">
        <my-sl-nav/>
      </el-aside>
      <el-main :style="mainStyle">
        <div class="content">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  <!-- </el-container> -->
  
</template>

<script setup>
import mySlNav from '@/components/sliderbar-nav.vue'
//import mySlNav from '../../components/sliderbar-nav.vue'
import { ref, computed,getCurrentInstance,onBeforeMount,onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { CloseBold, HomeFilled } from '@element-plus/icons-vue';
import { ElMessageBox } from 'element-plus'

const router = useRouter();
const shouldChangeOverflow = ref(false);
const instance = getCurrentInstance();
const userType = localStorage.getItem('user_type');

const mainStyle = computed(() => {
  return {
    overflow: shouldChangeOverflow.value ? 'hidden' : 'auto',
    height: shouldChangeOverflow.value? "110hv" : '100hv',
    // 其他样式属性
  };
});

onBeforeMount(() => {
  // 在组件挂载前，检查是否在 reservation.vue 文件中
  shouldChangeOverflow.value = instance.proxy.$route.name === 'reservation-page';
});
// 使用 beforeEach 导航守卫来检查路由
router.beforeEach((to, from, next) => {
  shouldChangeOverflow.value = to.name === 'reservation-page';
  next();
});

const user_id = ref(localStorage.getItem('user_id'));
const user_name = ref(localStorage.getItem('username'));
const defaultAvatar = '../assets/defaultAvatar.jpg'; // 设置默认头像路径

// localStorage.setItem('user_type', '0');


const goToHomes = () => {
  if(localStorage.getItem('user_type') == 2){
    router.push('/admin-dashboard')
  }
  else if(localStorage.getItem('user_type') == 1){
    router.push('/staff-dashboard')
  }
  else if(localStorage.getItem('user_type') == 0){
    router.push('/owner-dashboard')
  }
};

const goToSelfCenter = () => {
  if(localStorage.getItem('user_type') == 2){
    router.push('/admin-dashboard')
  }
  else if(localStorage.getItem('user_type') == 1){
    router.push('/staff-dashboard')
  }
  else if(localStorage.getItem('user_type') == 0){
    router.push('/personal-info')
  }
}
const cleanLocalStorage = () =>{
  if(localStorage.getItem('user_type') == 1){
    localStorage.removeItem("staff_type");
    localStorage.removeItem("station_id");
  }
  localStorage.removeItem("user_type");
  localStorage.removeItem("user_id");
  localStorage.removeItem("username");
}

const logout = () => {
  ElMessageBox.confirm(
    '您确定要退出吗',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      cleanLocalStorage();
      router.push('/login');
    })
    .catch(() => {
      // ElMessage({
      //   type: 'info',
      //   message: '退出取消',
      // })
    })
}
</script>

<style scoped>
.main-content {
  background-color: #F9FAFB;
}
.setting-icon,
.logout-icon {
  /*font-size: 2em;*/
  cursor: pointer;
  margin-left: 0.5em; 
}
.content{
  margin-left: 40px;
  height: 100%;
}
.home-icon:hover,
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
  height: 90vh;
  width: 15%;
  background-color: #f5f5f5; /* 较浅的灰色 */
}

.el-main {
  height: 90vh;
  padding: 0;
}

.custom-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.2em 2em; /* 增加顶栏的上下内边距 */
  height: 10vh; /* 增加顶栏的高度 */
  border-bottom: 1px solid #A0AEC0; 
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
  align-items: center;
  display: flex;
}

.el-container{
  height: 90vh;
}
</style>
