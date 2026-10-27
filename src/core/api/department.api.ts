import api from "."

export default {
    getName(){
        return api.get('/home/departments/names')
    }
}