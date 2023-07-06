<template>
  <el-container>
    <el-aside class="nav-class">
      <my-sl-nav/>
    </el-aside>
    <el-container>
      <div class="content">
        <router-view></router-view>
      </div>
    </el-container>
  </el-container>
</template>

<script setup>
import mySlNav from '../components/sliderbar-nav.vue'
</script>

<style scoped>
.el-aside {
  width: 20%;
  position: fixed; /* 添加固定定位 */
}

.content {
  margin-left: 20%; /* 设置内容区域左边距以避免被导航栏遮挡 */
  overflow-y: auto; /* 添加垂直滚动条 */
  height: 100vh; /* 设置内容区域高度为视口高度 */
}
</style>
