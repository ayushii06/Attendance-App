import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { branchEndpoints } from "../api"

const { CREATE_BRANCH_API, GET_ALL_BRANCHES_API, GET_BRANCH_DETAILS_API } = branchEndpoints

export async function createBranch(name, year, description,token) {
        const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector("POST", CREATE_BRANCH_API, {
                name,
                year,
                description
            },{
                Authorization:`Bearer ${token}`
            })
            console.log("CREATE BRANCH API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Branch Created Successfully")
        } catch (error) {
            console.log("CREATE BRANCH API ERROR............", error)
            toast.error("Could Not Create Branch")
        }
        toast.dismiss(toastId)
    
}

export async function getAllBranches(year,token) {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        const response = await apiConnector("POST", GET_ALL_BRANCHES_API, { year },{
            Authorization:`Bearer ${token}`
        })
        if (!response?.data?.success) {
            throw new Error("Could Not Fetch Branches")
        }

        console.log("GET ALL BRANCHES API RESPONSE............", response)
        // toast.success("Branches Fetched Successfully")
        result = response?.data?.allBranch

    } catch (error) {
        console.log("GET_ALL_BRANCHES_API API ERROR............", error)
    }
    toast.dismiss(toastId)
    return result
}

export async function getBranchDetail(branchId,token) {
        const toastId = toast.loading("Loading...")
        let result = []
        try {
            const response = await apiConnector("POST", GET_BRANCH_DETAILS_API, {
                branchId
            },{
                Authorization:`Bearer ${token}`
            })
            console.log("GET BRANCH DETAILS API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            result = response?.data?.branch
        } catch (error) {
            console.log("GET BRANCH DETAILS API ERROR............", error)
        }
        toast.dismiss(toastId)
        return result
}