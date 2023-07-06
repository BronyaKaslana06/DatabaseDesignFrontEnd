import CMRequset from './request/index.ts';
import { BASE_URL } from './request/config.js';

const cmrequest = new CMRequset({
  baseURL: BASE_URL,
  interceptors:{
    requestInterceptor:(config)=>{
      console.log('请求成功的拦截')
      return config
    },
    responseInterceptor:(res)=>{
      return res
    }
  }
});

export default cmrequest;
