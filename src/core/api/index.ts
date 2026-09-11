import axios, { AxiosError } from "axios";
import { toast } from "vue3-toastify";
import i18n from '../../@lang'
import { router } from "../../router";
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 30000,

    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});
let lastErrorStatus: number | null = null
let lastErrorTime = 0

function showError(status: number) {
    const now = Date.now()

    if (
        lastErrorStatus === status &&
        now - lastErrorTime < 1000
    ) {
        return
    }

    lastErrorStatus = status
    lastErrorTime = now

    toast.error(i18n.global.t(`errors.${status}`))
}
api.interceptors.request.use(
    (config) => {

        const token = sessionStorage.getItem("gestion-hsse-token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,

    (error:AxiosError) => {
        console.log(error.status)
        if (error?.response) {
            const status = error.response.status
            switch (status) {
                
                case 401:
                    sessionStorage.removeItem("gestion-hsse-token");
                    showError(status)
                    setTimeout(()=>{
                        router.replace({
                            name:"LOGIN"
                        })
                    },1000)
                    break;

                case 403:
                    showError(status)
                    break;
                case 404:
                    showError(status)
                    break;

               

                case 500:
                    showError(status)
                    break;
            }
        }
        if(error.code=="ERR_NETWORK"){
            toast.error(i18n.global.t("errors.ERR_NETWORK"));
        }

        return Promise.reject(error);
    }
);

export default api;