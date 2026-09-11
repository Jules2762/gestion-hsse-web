import { createApp } from 'vue'
import './main.css'
import App from './App.vue'
import { router } from './router/index.ts'
import { createPinia } from 'pinia';
import VueApexCharts from 'vue3-apexcharts';
import 'leaflet/dist/leaflet.css';
import { LMap, LMarker, LTileLayer } from '@vue-leaflet/vue-leaflet';
import VueAwesomePaginate from "vue-awesome-paginate";
import Vue3Toastify, { type ToastContainerOptions } from 'vue3-toastify';
import 'vue3-toastify/dist/index.css';
import "vue-awesome-paginate/dist/style.css";
import i18n from './@lang/index.ts';

const pinia=createPinia();
const app=createApp(App)

app.use(VueApexCharts);
app.use(router)
app.use(pinia)
app.use(i18n)
app.use(Vue3Toastify, {
    autoClose: 3000,
} as ToastContainerOptions)
app.use(VueAwesomePaginate)
app.component('l-map', LMap);
app.component('l-tile-layer', LTileLayer);
app.component('l-marker', LMarker);
app.mount('#app')
