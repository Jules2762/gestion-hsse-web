import api from "."
import type { UserFilterType, UserFormType, UserProfileUpdateFormType, UserRoleType } from "../../@types/User.type"

export default {
    //======================================
    //============== USERS =================
    //======================================
    getFilters() {
        return api.get("/home/users/filters")
    },
    index(params?: UserFilterType) {
        return api.get("/home/users/users", { params })
    },
    show(id: string | number) {
        return api.get("/home/users/users/" + id)
    },
    getProfile(id?: string | number) {
        if (!id || id === 'undefined' || id === 'null') {
            return api.get("/home/profile")
        }
        return api.get("/home/profile/" + id)
    },
    updateProfile(id: string | number,data:UserProfileUpdateFormType) {
        return api.put("/home/profile/"+id,data)
    },
    updatePassword(data: { current_password: string; password: string; password_confirmation: string }) {
        return api.put("/home/profile/password", data)
    },
    me() {
        return api.get("/home/me")
    },
    export(params?: UserFilterType) {
        return api.get("home/users/export", { params })
    },
    store(data?: UserFormType) {
        return api.post("/home/users/users", data)
    },
    update(id: string | number, data: Partial<UserFormType>) {
        return api.put("/home/users/users/"+id, data)
    },
    enable(id:string|number){
        return api.put('/home/users/enable/'+id)
    },
    disable(id:string|number){
        return api.put('/home/users/disable/'+id)
    },

    //======================================
    //============== ROLE =================
    //======================================
    updateRole(id: string | number, role: UserRoleType) {
        return api.put('/home/users/role/' + id, {
            role: role
        })
    },

    //======================================
    //=========== PERMISSION ===============
    //======================================
    getPermissions(id: number | string) {
        return api.get('/home/users/permissions/' + id)
    },
    getAllPermissions() {
        return api.get('/home/users/permissions')
    },
    updatePermissions(id: string | number, data: string[]) {
        return api.put('/home/users/permissions/' + id, {
            permissions: data
        })
    }


}