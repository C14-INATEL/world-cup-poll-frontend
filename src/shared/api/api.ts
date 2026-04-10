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
const AUTH_TOKEN_STORAGE_KEY = "auth_token";

export function getAuthToken() {
  return localStorage.getItem(AUTH_TOKEN_STORAGE_KEY);
}

export function setAuthToken(token: string) {
  localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
}

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
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

const initialToken = getAuthToken();
if (initialToken) {
  api.defaults.headers.common.Authorization = `Bearer ${initialToken}`;
}

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = getAuthToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

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
        clearAuthToken();
        logoutCallback?.();
        return Promise.reject(error);
      }

      const message = body?.error ?? error.message;
      if (message) {
        toast.error(message);
      }
    }

    return Promise.reject(error);
  },
);
