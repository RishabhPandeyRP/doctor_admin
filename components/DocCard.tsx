import React from "react"
import styles from "@/styles/DocCard.module.css"
import { Doctor } from "@/data/doctors.types"
import { DoctorBackend } from "@/data/doctors.types"

interface DocCardParams{
    doc: DoctorBackend
    // onClick : (docId:number)=>void
}

const DocCard = ({doc }:DocCardParams)=>{
    return(
        <div className={styles.docCardDiv}
            // onClick={()=>onClick(doc.id)}
            >
            <div className={styles.docImgContainer}>
                <div className={styles.docImg}></div>
            </div>

            <div className={styles.docInfo}>
                <h3>Dr. {doc.doctor_name}</h3>

                <div className={styles.docDetails}>
                    <p className={styles.docSpec}>{doc.specialty}</p>
                    <span className={styles.docExp}>{doc.experience}</span>
                </div>

                <div className={styles.docRatingBox}>
                    <span>Rating :</span>
                    <span className={styles.docRating}>
                        {Array(doc.rating).fill('★').join('')}
                        {Array(5 - doc.rating).fill('☆').join('')}
                    </span>
                </div>

                <div className={styles.docDisease}>
                    {doc.diseases.join(' , ')}
                </div>
                {/* <button className={styles.docBookBtn} onClick={(e)=>{
                    e.stopPropagation();
                    // onClick(doc.id)
                }}>
                    Book Appointement
                </button> */}
            </div>
        </div>
    )
}

export default DocCard