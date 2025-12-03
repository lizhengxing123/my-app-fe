// utils/axiosInstance.ts
import { Result } from "@/types/Result";
import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { toast } from "sonner";

// 创建 Axios 实例，配置基准地址（你的后端地址）
const axiosInstance: AxiosInstance = axios.create({
  baseURL: "", // 后端接口基准地址
  timeout: 5000, // 请求超时时间（5秒）
  headers: {
    "Content-Type": "application/json", // 默认请求头（JSON 格式）
  },
});

// 请求拦截器：可添加 Token、请求参数处理等
axiosInstance.interceptors.request.use(
  (config) => {
    // 示例：添加登录 Token（根据实际场景修改，如从 localStorage 或 Cookie 获取）
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : "";
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    // 请求错误预处理
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理响应数据和错误
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // 统一错误处理（如 401 未授权、500 服务器错误等）
    console.error("请求失败：", error.message);

    // 示例：401 未授权跳转登录页（仅客户端生效）
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// 封装一层以更好的统一定义接口返回的类型
const request = <T>(config: AxiosRequestConfig): Promise<Result<T>> => {
  return new Promise((resolve, reject) => {
    axiosInstance
      .request<Result<T>>(config)
      .then((res) => {
        if (!res.data.success) {
          toast.error(res.data.msg);
        }
        resolve(res.data);
      })
      .catch((err: Error | AxiosError) => {
        reject(err);
      });
  });
};

export default request;
