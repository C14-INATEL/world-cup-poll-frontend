import axios from "axios";
import type { AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { toast } from "sonner";

interface ApiSuccessResponse<T> {
  error: null;
  data: T;
}

interface ApiErrorResponse {
  error: string;
  data: null;
}

export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

type LogoutFn = () => void;
let logoutCallback: LogoutFn | null = null;

export function registerLogoutCallback(fn: LogoutFn) {
  logoutCallback = fn;
}

declare module "axios" {
  interface AxiosInstance {
    get<T = unknown>(url: string, config?: import("axios").AxiosRequestConfig): Promise<T>;
    post<T = unknown>(
      url: string,
      data?: unknown,
      config?: import("axios").AxiosRequestConfig,
    ): Promise<T>;
    put<T = unknown>(
      url: string,
      data?: unknown,
      config?: import("axios").AxiosRequestConfig,
    ): Promise<T>;
    patch<T = unknown>(
      url: string,
      data?: unknown,
      config?: import("axios").AxiosRequestConfig,
    ): Promise<T>;
    delete<T = unknown>(url: string, config?: import("axios").AxiosRequestConfig): Promise<T>;
  }
}

const defaultApiBaseUrl = "http://localhost:3333";
const apiBaseUrl = (import.meta.env.VITE_API_URL ?? defaultApiBaseUrl).replace(/\/$/, "");

export const api = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (config.params) {
    config.params = Object.fromEntries(
      Object.entries(config.params as Record<string, unknown>).filter(
        ([, v]) =>
          v !== null &&
          v !== undefined &&
          v !== "" &&
          !(typeof v === "object" && v !== null && Object.keys(v).length === 0),
      ),
    );
  }
  return config;
});

api.interceptors.response.use(
  (response: AxiosResponse<ApiResponse>) => {
    const body = response.data;

    if (body?.error) {
      toast.error(body.error);
      return Promise.reject(new Error(body.error));
    }

    return (body?.data ?? body) as never;
  },
  (error: unknown) => {
    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const body = error.response?.data as ApiResponse | undefined;

      if (status === 401) {
        logoutCallback?.();
      }

      const message = body?.error ?? error.message ?? "Erro desconhecido";
      toast.error(message);
    } else {
      toast.error("Erro desconhecido");
    }

    return Promise.reject(error);
  },
);
