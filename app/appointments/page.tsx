"use client"

import axios from "axios"
import Cookies from "js-cookie"
import { useState, useEffect } from "react"
import styles from "@/styles/Appointment.module.css"
import toast from "react-hot-toast"

const Appointments = () => {
    const [loading, setLoading] = useState(false)
    // const [loading, setLoading] = useState(false)
    const [appointments, setAppointments] = useState([])
    const token = Cookies.get("admin-token")


    const fetchApp = async () => {
        try {
            setLoading(true)
            const response = await axios.get("http://localhost:5000/appointment/getAll", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log("appointments : ", response.data)

            setAppointments(response.data)
            setLoading(false)
        } catch (error: any) {
            console.log("error at doctor fetching", error.message)

            setAppointments([])
            setLoading(false)
        }
    }

    useEffect(() => {

        if (!token) return

        if (token) {
            fetchApp()
        }
    }, [token])

    const handleStatusChange = async(id:number , type:string)=>{
        try {
            setLoading(true)
            console.log("id from status " , id)
            const payload = {
                status : type
            }

            const response = await axios.put(`http://localhost:5000/appointment/${id}/status`,payload,{
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type":"application/json"
                }
            })

            if(response.status == 200){
                toast.success("status approved")
                setLoading(false)
                fetchApp()
                return
            }
            setLoading(false)
            

        } catch (error:any) {
            console.log("error while updating status" , error.message)
            toast.error("error while updating the status")
            setLoading(false)
        }
    }

    console.log("appointments " , appointments)

    return (
        <div className={styles.appDiv}>
            {/* <div className={styles.appStat}>
                <div>Appointment's Count</div>
                <div>{appointments?.length}</div>
            </div> */}

            <div className={styles.tableWrapper}>
                {appointments?.length ? (
                    <table className={styles.appTable}>
                        <thead>
                            <tr>
                                <th>Doctor Name</th>
                                <th>Slot Type</th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Patient Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {appointments.map((item, index) => (
                                <tr key={index}>
                                    <td>Dr. {item.doctor_name}</td>
                                    <td>{item.appointment_type}</td>
                                    <td>{item.appointment_date.split("T")[0]}</td>
                                    <td>{item.start_time}</td>
                                    <td>{item.end_time}</td>
                                    <td>{item.patient_name}</td>
                                    <td>
                                        <div className={`${styles.cardStatus} ${styles[item.appointment_status]}`}>
                                        {item.appointment_status}
                                        </div>
                                        
                                    </td>
                                    <td>
                                        <button className={`${styles.appButton} ${styles.approveBtn}`} onClick={() => handleStatusChange(item.appointment_id, 'approved')} disabled={loading}>
                                            Approve
                                        </button>
                                        <button className={`${styles.appButton} ${styles.declineBtn}`} onClick={() => handleStatusChange(item.appointment_id, 'declined')} disabled={loading}>
                                            Decline
                                        </button>
                                        <button className={`${styles.appButton} ${styles.completeBtn}`} onClick={() => handleStatusChange(item.appointment_id, 'completed')} disabled={loading}>
                                            Complete
                                        </button>
                                    </td>

                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <div>Loading...</div>
                )}
            </div>
        </div>

    )
}

export default Appointments