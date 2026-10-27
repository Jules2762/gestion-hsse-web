import { defineStore } from "pinia";

const useSidebarStore=defineStore("sidebar",{
    state:()=>({
        show:false,
        last_index:0
    }),
    getters:{
        isShow:(state)=>state.show,
        getLastIndex:(state)=>state.last_index
    },
    actions:{
        toggle(value:boolean){
            this.$state.show=value
        },
        setLastIndex(index:number){
            this.$state.last_index=index
        }
    }
})
export {
    useSidebarStore
}