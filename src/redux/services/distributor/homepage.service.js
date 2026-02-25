import { api } from "../../../utils/api"


export const get_all_activity = async () => {
    try {
        const response = await api.get(`/distributor/order_activities`)
        return response
        
    } catch (error) {
        console.log("error:", error)
        
    }
}