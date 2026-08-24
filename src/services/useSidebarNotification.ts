import { defineStore } from "pinia";
type SidebarCountsType = {
    DASHBOARD: number
   
    USERS: number
    ACTIVITY: number
    
    TEMPLATE: number
    CHECKLIST: number
    ACTION: number,
    EQUIPMENT_MONITORING:number
}
const useSidebarNotification = defineStore("sidebar-notification", {
    state: () => ({
        counts: {
            DASHBOARD: 0,
        
            USERS: 5,
            ACTIVITY: 0,
           
            TEMPLATE: 0,
            CHECKLIST: 0,
            ACTION: 7,
            EQUIPMENT_MONITORING:0

        }
    }), getters: {
        getCount: (state)=>{
            return (name: keyof SidebarCountsType)=>state.counts[name]
        }
    }, actions: {
        setCount(name: keyof SidebarCountsType, value: number) {
            this.$state.counts[name] = value
        }
    }
})
export {
    useSidebarNotification,
    type SidebarCountsType
}