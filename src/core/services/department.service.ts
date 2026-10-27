import departmentApi from "../api/department.api"

export default {
    async getNames(){
        return await departmentApi.getName()
    }
}