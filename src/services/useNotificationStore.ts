import { defineStore } from "pinia";
import type { notificationType } from "../@types/notification.type";

const useNotificationStore=defineStore("notifications",{
    state:()=>({
        data:[] as notificationType[]
    }),
    getters:{
        getData:(state)=>state.data
    },
    actions:{
        add(value:notificationType):void{
            this.$state.data.unshift(value)
        },
        viewed(){
            this.$state.data.forEach(item=>{
                item.viewed=true
            }) 
            
        },
        deleteOne(index:number){
            this.$state.data.splice(index,1)
        }
    }
})
export {
    useNotificationStore
}