import React from 'react'
import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { courseEndpoints } from "../api"

const { CREATE_COURSE_API, GET_ALL_COURSES_API } = courseEndpoints


export async function createCourse(credentials,token) {
    const toastId = toast.loading("Loading...")
        try {
            const response = await apiConnector("POST", CREATE_COURSE_API, {
                courseName:credentials.courseName,
                courseDescription:credentials.courseDescription,
                whatYouWillLearn:credentials.whatYouWillLearn,
                year:credentials.year,
                instructor:credentials.instructor,
                lectures:credentials.lectures,
                branch:credentials.branch
            },{
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
            })
            console.log("CREATE COURSE API RESPONSE............", response)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Course Created Successfully")
        } catch (error) {
            console.log("CREATE COURSE API ERROR............", error)
            toast.error("Could Not Create Course")
        }
        toast.dismiss(toastId)
    }

export const getAllCourses = async (branchId,token) => {
    const toastId = toast.loading("Loading...")
    let result = []
    try {
        const response = await apiConnector("POST", GET_ALL_COURSES_API, { branchId },
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            }
        )
        if (!response?.data?.success) {
            throw new Error("Could Not Fetch Courses")
        }
        console.log("GET ALL COURSES API RESPONSE............", response)
        result = response?.data?.branch?.courses
    } catch (error) {
        console.log("GET_ALL_COURSES_API API ERROR............", error)
        // toast.error(error.response?.data?.message || "Could Not Fetch Courses")
    }
    toast.dismiss(toastId)
    return result
}