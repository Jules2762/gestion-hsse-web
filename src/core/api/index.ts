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
        if (error.response) {
            
            switch (error.response.status) {

                case 401:
                    sessionStorage.removeItem("gestion-hsse-token");
                    toast.error(i18n.global.t("errors." + error.response.status));
                    setTimeout(()=>{
                        router.replace({
                            name:"LOGIN"
                        })
                    },1000)
                    break;

                case 403:
                    console.error("Accès interdit");
                    toast.error(i18n.global.t("errors." + error.response.status));
                    break;
                case 404:
                    
                    toast.error(i18n.global.t("errors." + error.response.status));
                    break;

               

                case 500:
                    console.error("Erreur serveur");
                    toast.error(i18n.global.t("errors." + error.response.status));
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