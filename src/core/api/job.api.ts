import api from "."

export default {
    getNames(){
        return api.get('/home/jobs/names')
    }
}