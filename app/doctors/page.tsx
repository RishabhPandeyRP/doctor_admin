"use client"
import DocList from "@/components/DocList"
import styles from "@/styles/Doctors.module.css"
import axios from "axios"
import Cookies from "js-cookie"
import { useEffect, useState } from "react"

const Doctors = ()=>{
    const [loading , setLoading] = useState(false)
    const [doctors , setDoctor] = useState([])
    const token = Cookies.get("admin-token")
    

    const fetchDoctors = async () => {
        try {
            setLoading(true)
            const response = await axios.get("http://localhost:5000/doctors", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("doctors : ", response.data?.docname)
            
            setDoctor(Array.isArray(response.data?.docname) ? response.data?.docname : [])
            setLoading(false)
        } catch (error: any) {
            console.log("error at doctor fetching", error.message)
            
            setDoctor([])
            setLoading(false)
        }
    }

    useEffect(()=>{
        
        if(!token) return

        if(token){
            fetchDoctors()
        }
    },[token])

    return(
        <div className={styles.docDiv}>
            <div className={styles.docStat}>
                <div>
                Doctor's Count
                </div>

                <div>
                    {doctors?.length}
                </div>
                
            </div>
            
            <div className={styles.docContainer}>
            {loading ? <div>loading...</div>:<DocList doc={doctors}></DocList>}
            </div>
            
        </div>
    )
}

export default Doctors