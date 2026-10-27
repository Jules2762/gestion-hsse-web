import jobApi from "../api/job.api"

export default {
    async getNames(){
        return await jobApi.getNames()
    }
}