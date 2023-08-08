<template>
    <div>
      <el-menu
        :default-active="onRoutes"
        background-color="#324157"
        text-color="#bfcbd9"
        active-text-color="#20a0ff"
        unique-opened
        router
        class="slider-bar"
      >
        <template v-for="item in items" :key="item.index">
          <el-menu-item :index="item.index">
            <!-- 
            <el-icon>
              <component :is="item.icon"></component>
            </el-icon>
            <template #title>{{ item.title }}</template>
            -->
            <template #title>{{ item.title }}</template>
          </el-menu-item>
        </template>
      </el-menu>
    </div>
  </template>
  
<script setup lang="js">
import { useRoute } from "vue-router";
import { computed } from 'vue';

const items = [
  {
    name: '员工信息',
    index: '/stuff-info-page',
    title: '员工信息'
  },
  {
    name: '换电站管理',
    index: '/switch-station-page',
    title: '换电站管理'
  },
  {
    name: 'page2',
    index: '/page2',
    title: 'page2'
  },
  {
    name: 'page3',
    index: '/page3',
    title: 'page3'
  },
  {
    name: 'page4',
    index: '/page4',
    title: 'page4'
  },
  {
    name: 'page5',
    index: '/page5',
    title: 'page5'
  }
];

const route = useRoute();
const onRoutes = computed(() => {
  return route.path;
});
</script>
  
<style>
.slider-bar{
    height: 100vh;
    left: 0%;
    width: 60%;
}
</style>
