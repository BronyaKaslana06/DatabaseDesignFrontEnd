import axios from 'axios'
import type { InternalAxiosRequestConfig, AxiosInstance, AxiosResponse, AxiosRequestConfig } from 'axios'

interface CMRequsetInterceptors {
  requestInterceptor?: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig
  requestInterceptorCatch?: (error: any) => any
  responseInterceptor?: (res: AxiosResponse) => AxiosResponse
  responseInterceptorCatch?: (error: any) => any
}

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
        console.log("成功拦截")
        return config
      },
      (err) => {
        return err
      }
    )

    this.instance.interceptors.response.use(
      (res) => {
        // 提取axios返回的datashuju 
        return res.data
      },
      (err) => {
        return err
      }
    )
  }

  request<T>(config: CMRequestConfig): Promise<T> {
    return new Promise((resolve, reject) => {
      this.instance.request(config).then((res) => {
        console.log(res)
      })
    })
  }
}

export default CMRequset