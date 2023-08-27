<template>
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
</template>

<script setup>
import mySlNav from '../components/sliderbar-nav.vue'
import { ref, computed,getCurrentInstance,onBeforeMount } from 'vue';
import { useRouter, createRouter } from 'vue-router';

const router = useRouter();
const shouldChangeOverflow = ref(false);
const instance = getCurrentInstance();
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
  console.log(to.name);
  shouldChangeOverflow.value = to.name === 'reservation-page';
  next();
});



</script>

<style scoped>
.el-aside {
  width: 20%;
  position: fixed; /* 添加固定定位 */
}

.content {
  margin-left: 20%; /* 设置内容区域左边距以避免被导航栏遮挡 */
}

.el-main{
  height: 100vh;
  padding: 0;
}
</style>
