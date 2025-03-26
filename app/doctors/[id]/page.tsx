"use client"
import styles from "@/styles/DocProfile.module.css"
import React from "react"
import { notFound } from "next/navigation"
import { redirect } from "next/navigation"
import Link from "next/link"
import axios from "axios"
// import { cookies } from "next/headers"
import Cookies from "js-cookie"
import Image from "next/image"
import { useState, useEffect } from "react"
import { use } from "react";
import { useParams } from "next/navigation"
import toast from "react-hot-toast"


export default function DocProfile() {
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [profile, setProfile] = useState<any>(null)
    const [image, setImage] = useState<File | null>(null)
    const [loading , setLoading] = useState<boolean>(false)

    // const Cookie = await cookies()
    // const token = Cookie.get("token")?.value;
    const params = useParams()
    const id = params?.id
    const token = Cookies.get("admin-token")


    if (!token || !id) {
        return notFound()
    }

    const fetcher = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/doctors/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })

            console.log("response from profile is ", response.data.docname)

            setProfile(response.data.docname)
        } catch (error: any) {
            console.log("Error occured : ", error.message)
        }
    }

    useEffect(() => {
        fetcher()
    }, [])

    if (!profile) return <div>Loading...</div>

    const editToggle = () => { setIsEdit(!isEdit) }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        // setProfile({ ...profile, [e.target.name]: e.target.value });
        const { name, value } = e.target;

        setProfile((prev: any) => ({
            ...prev,
            [name]: name === "diseases" ? value.split(",").map((d) => d.trim()) : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleSave = async () => {
        try {
            setLoading(true)
            let imageUrl = profile.photo_url;

            if (image) {
                const formData = new FormData();
                if (image) formData.append("image", image);

                const imageRes = await axios.post(`http://localhost:5000/api/upload`, formData, {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
                });

                if (imageRes.status !== 200) {
                    setIsEdit(false);
                    toast.error("error while updating the image")
                    setLoading(false)
                    return
                }

                imageUrl = imageRes.url
            }

            const payload = {
                specialty: profile.specialty,
                photo_url: imageUrl || null,
                // rating: ,
                // location: ,
                gender: profile.gender,
                experience: profile.experience,
                diseases: (profile.diseases)
            }

            console.log("this is payload " , payload)

            const detailsRes = await axios.put(`http://localhost:5000/doctors/${id}`, payload, {
                headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
            });

            setIsEdit(false);
            fetcher();
            setLoading(false)
        } catch (error: any) {
            console.log("from doc profile update", error.message)
            toast.error("Error while updating the data")
            setLoading(false)
        }
    };




    const bookingNavigate = () => {
        redirect(`/doctors2/${id}/bookSlot`)
    }
    console.log("profile , ", profile)

    return (
        <div className={styles.profileDiv}>
            <div className={styles.profileHeader}>
                <div className={styles.profileTitle}>
                    Doctor Profile
                </div>
                <div className={styles.profileDesc}>
                    View detailed information and book an appointment
                </div>
                <button className={styles.editButton} onClick={editToggle}>
                    {isEdit ? "Cancel" : "Edit Profile"}
                </button>
            </div>

            <div className={styles.profileContent}>
                <div className={styles.profileContentLeft}>
                    <div className={styles.profileImg}>
                        <Image src={profile.photo_url || "/WhatsApp (1).svg"} alt="profile image" fill></Image>

                    </div>
                    {isEdit && <input type="file" accept="image/*" onChange={handleImageChange} />}
                    <div className={styles.profileRatingBox}>
                        <div className={styles.profileRatingTitle}>Rating</div>
                        <div className={styles.profileRatingStars}>{Array(Math.max(0, Math.floor(profile.rating || 0)))
                            .fill('★')
                            .join('')}
                            {Array(Math.max(0, 5 - Math.floor(profile.rating || 0)))
                                .fill('☆')
                                .join('')}</div>
                    </div>
                </div>

                <div className={styles.profileContentRight}>
                    <div className={styles.profileName}>{profile?.doctor_name}</div>

                    <div className={styles.profileData}>
                        <div className={styles.profileDataKeys}>
                            <div>Specialization :</div>
                            <div>Experience :</div>
                            <div>Gender :</div>
                            <div>Treats :</div>
                            <div className={styles.about}>About :</div>
                        </div>

                        <div className={styles.profileDataValues}>
                            {isEdit ? (
                                <input type="text" name="specialty" value={profile.specialty} onChange={handleChange} />
                            ) : (
                                <div>{profile.specialty}</div>
                            )}

                            {isEdit ? (
                                <select name="experience" value={profile.experience} onChange={handleChange}>
                                    <option value="15+ years">15+ years</option>
                                    <option value="10-15 years">10-15 years</option>
                                    <option value="5-10 years">5-10 years</option>
                                    <option value="3-5 years">3-5 years</option>
                                    <option value="1-3 years">1-3 years</option>
                                    <option value="0-1 years">0-1 years</option>
                                </select>
                            ) : (
                                <div>{profile.experience}</div>
                            )}

                            {isEdit ? (
                                <select name="gender" value={profile.gender} onChange={handleChange}>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                            ) : (
                                <div>{profile.gender}</div>
                            )}


                            {isEdit ? (
                                <input
                                    type="text"
                                    name="diseases"
                                    value={profile.diseases.join(", ")}
                                    onChange={handleChange}
                                    placeholder="Enter diseases separated by commas"
                                />
                            ) : (
                                <div className={styles.profileDiseases}>
                                    {profile.diseases.map((disease: string, index: number) => (
                                        <div className={styles.profileDiseasesCard} key={index}>{disease}</div>
                                    ))}
                                </div>
                            )}



                            <div>{profile.doctor_name} is a highly skilled {profile.specialty} with {profile.experience}  of experience. They specialize in treating {profile?.diseases && profile?.diseases?.map((disease: string) => disease)}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <Link href={`/doctors2/${id}/bookSlot`}>
                <button className={styles.profileBtn}>Book an Appointment</button>
            </Link> */}

            {isEdit && <button className={styles.saveButton} onClick={handleSave}>
                {loading ? "saving..." : "Save Changes"}
                </button>}


        </div>
    )
}
