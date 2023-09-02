import { createStore } from 'vuex';

export default createStore({
  state: {
    maintenanceItemId: window.sessionStorage.getItem('state')!=null ?
    window.sessionStorage.getItem('state'):null, // 初始化
  },
  mutations: {
    setMaintenanceItemId(state, id) {
      state.maintenanceItemId = id;
    },
  },
});