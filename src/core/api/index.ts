import axios, { AxiosError } from "axios";
import { toast } from "vue3-toastify";
import i18n from '../../@lang';
import { router } from "../../router";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 30000,
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

let lastErrorStatus: number | string | null = null;
let lastErrorTime = 0;

function showError(status: number | string) {
    const now = Date.now();

    if (
        lastErrorStatus == status &&
        now - lastErrorTime < 1000
    ) {
        return;
    }

    lastErrorStatus = status;
    lastErrorTime = now;

    const showToast: any = toast.error;
    showToast((i18n.global as any).t(`errors.${status}`));
}

api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem("gestion-hsse-token") || localStorage.getItem("gestion-hsse-token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,

    (error: AxiosError) => {
        if (error?.response) {
            const status = error.response.status;
            const data = error.response.data as { message?: string; error?: string };
            const isLoginRequest = error.config?.url?.includes('/auth/login');

            if (!isLoginRequest) {
                switch (status) {
                    case 401:
                        sessionStorage.removeItem("gestion-hsse-token");
                        localStorage.removeItem("gestion-hsse-token");
                        sessionStorage.removeItem("gestion-hsse-user");
                        localStorage.removeItem("gestion-hsse-user");
                        showError(status);
                        setTimeout(() => {
                            router.replace({
                                name: "LOGIN"
                            });
                        }, 800);
                        break;

                    case 403: {
                        const isAccountDisabled = data?.message === '403.disabled' || data?.error === 'ACCOUNT_DISABLED';
                        if (isAccountDisabled) {
                            sessionStorage.removeItem("gestion-hsse-token");
                            localStorage.removeItem("gestion-hsse-token");
                            sessionStorage.removeItem("gestion-hsse-user");
                            localStorage.removeItem("gestion-hsse-user");
                            showError("403.disabled");
                            setTimeout(() => {
                                router.replace({
                                    name: "LOGIN"
                                });
                            }, 800);
                        } else {
                            showError(data?.message || status);
                        }
                        break;
                    }

                    case 404:
                        showError(status);
                        break;

                    case 500:
                        showError(status);
                        break;
                }
            }
        }
        if (error.code == "ERR_NETWORK") {
            toast.error(i18n.global.t("errors.ERR_NETWORK"));
        }

        return Promise.reject(error);
    }
);

export default api;
