import axios from 'axios'
import { ElMessage } from 'element-plus'
import type { InternalAxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'
import { useRouter } from 'vue-router'

interface CMRequsetInterceptors {
  requestInterceptor?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  requestInterceptorCatch?: (error : any) => any
  responseInterceptor?: (res: AxiosResponse) => AxiosResponse
  responseInterceptorCatch?: (error: any) => any
}

const router = useRouter();
// 扩展属性，可以传入拦截器
interface CMRequestConfig extends AxiosRequestConfig {
  interceptors?: CMRequsetInterceptors
}

class CMRequset {
  instance: AxiosInstance
  interceptors?: CMRequsetInterceptors

  constructor(config: CMRequestConfig) {
    this.instance = axios.create(config)
    this.interceptors = config.interceptors

    // 自定义的interceptor
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    )

    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    )
    // 公共interceptor
    this.instance.interceptors.request.use(
      (config) => {        
        let token = localStorage.getItem('token');
        if(token){
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (err) => {
        return err
      }
    )

    this.instance.interceptors.response.use(
      (res) => {
        const contentType = res.headers['content-type'];
        if (contentType && contentType.startsWith('application/octet-stream')) {
          return res; // 是照片请求，返回整个响应对象
        } else {
          return res.data; // 不是照片请求，返回响应的 data 属性
        }
      },
      (err) => {
        if(err.response.status == 401){
          router.push('/login');
          ElMessage({
            type:"error",
            message: "登录过期，请重新登录"
          })
        }
        return err
      }
    )
  }

  request<T>(config: CMRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance.request<any,T>(config).then((res) => {
        resolve(res)
      })
      .catch((err)=>{
        return err
      })
    })
  }
}

export default CMRequset