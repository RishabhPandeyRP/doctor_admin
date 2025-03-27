"use client"
import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import Cookies from "js-cookie"
import { notFound } from "next/navigation"
import styles from "@/styles/CreateDoc.module.css"

const CreateDoc = () => {
    const [image, setImage] = useState<File | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [formData, setFormdata] = useState<any>({})

    const token = Cookies.get("admin-token")


    if (!token) {
        return notFound()
    }

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        // setProfile({ ...profile, [e.target.name]: e.target.value });
        const { name, value } = e.target;

        setFormdata((prev: any) => ({
            ...prev,
            [name]: name === "diseases" ? value.split(",").map((d) => d.trim()) : value,
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleRegister = async (e: React.FormEvent) => {
        try {
            e.preventDefault()
            setLoading(true)
            console.log("payload from register doc", formData)
            //user register

            const userPayload = {
                email: formData.email,
                password: formData.password,
                name: formData.name
            }

            console.log("payload for register user", userPayload)

            const userResponse = await axios.post("http://localhost:5000/auth/register", userPayload, { headers: { "Content-Type": "application/json" } })

            if (userResponse.status == 200) {
                if (userResponse.data.message == "user already exists") {
                    toast.error("user already exists")
                    setLoading(false)
                    return
                }
                console.log(userResponse.data)
                toast.success("user registered")
                // setLoading(false)

            }

            //get userid

            const userId = userResponse.data.id;
            let imageUrl = null


            //upload image if there is an image
            if (image) {
                const formDataImage = new FormData();
                if (image) formDataImage.append("image", image);

                const imageRes = await axios.post(`http://localhost:5000/api/upload`, formDataImage, {
                    headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
                });

                if (imageRes.status !== 200) {
                    // setIsEdit(false);
                    toast.error("error while updating the image")
                    // setLoading(false)

                }

                imageUrl = imageRes.url
            }


            //register doctor
            const docPayload = {
                user_id: userId,
                specialty: formData.specialty,
                experience: formData.experience,
                photo_url: imageUrl,
                location: formData.location,
                gender: formData.gender,
                diseases: formData.diseases,
                rating: userId % 5
            }

            console.log("payload for register doc", docPayload)

            const docResponse = await axios.post("http://localhost:5000/doctors/register", docPayload, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } })

            if (docResponse.status == 200) {
                console.log(docResponse.data)
                toast.success("doc registered")

                const mailPayload = {
                    toMail: formData.email,
                    subject: "Doctor profile created on Medcare",
                    text: `Hey Doc, You are registered on MedCare with username as ${formData.name} and email as ${formData.email}`
                }

                const mailResponse = await axios.post("http://localhost:5000/api/mail", mailPayload, { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } })

                if(mailResponse.status == 200){
                    toast.success("Mail sent to doctor")
                }

                setLoading(false)
                return
            }

        } catch (error: any) {
            console.log("error while registering doc ", error.message)
            toast.error("error while registering doc")
        }
    }

    return (
        <div className={styles.docDiv}>
            <form className={styles.docForm}>

                <div className={styles.inputWrapper}>
                    <label htmlFor="image" className={styles.label}>Choose image file</label>
                    <input type="file" name="image" accept="image/*" onChange={handleImageChange} className={styles.input} />
                </div>

                <div className={styles.inputWrapper}>
                    <label htmlFor="name" className={styles.label}>Name</label>
                    <input type="text" name="name" placeholder="Enter name" value={formData.name} onChange={changeHandler} id="name" className={styles.inputBox} />
                </div>

                <div className={styles.inputWrapper}>
                    <label htmlFor="email" className={styles.label}>Email</label>
                    <input type="email" name="email" placeholder="Enter email" value={formData.email} onChange={changeHandler} id="" className={styles.input} />
                </div>

                <div className={styles.inputWrapper}>
                    <label htmlFor="specialty" className={styles.label}>Specialty</label>
                    <input type="text" name="specialty" placeholder="Enter specialty" value={formData.specialty} onChange={changeHandler} id="" className={styles.input} />
                </div>

                <div className={styles.inputWrapper}>
                    <label htmlFor="experience" className={styles.label}>experience</label>
                    <select name="experience" value={formData.experience} onChange={changeHandler} className={styles.select}>
                        <option value="15+ years">15+ years</option>
                        <option value="10-15 years">10-15 years</option>
                        <option value="5-10 years">5-10 years</option>
                        <option value="3-5 years">3-5 years</option>
                        <option value="1-3 years">1-3 years</option>
                        <option value="0-1 years">0-1 years</option>
                    </select>
                </div>

                <div className={styles.inputWrapper}>
                    <label htmlFor="location" className={styles.label}>Location</label>
                    <input type="text" name="location" placeholder="Enter location" value={formData.location} onChange={changeHandler} id="" className={styles.input} />
                </div>

                <div className={styles.inputWrapper}>
                    <label htmlFor="gender" className={styles.label}>Gender</label>
                    <select name="gender" value={formData.gender} onChange={changeHandler} className={styles.select}>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                    </select>
                </div>

                <div className={styles.inputWrapper}>
                    <label htmlFor="password" className={styles.label}>Password</label>
                    <input type="password" name="password" placeholder="Enter password" value={formData.password} onChange={changeHandler} id="" className={styles.input} />
                </div>

                <div className={styles.inputWrapper}>
                    <label htmlFor="diseases" className={styles.label}>Treats</label>
                    <input
                        type="text"
                        name="diseases"
                        value={formData.diseases ? formData?.diseases?.join(", ") : ""}
                        onChange={changeHandler}
                        placeholder="Enter diseases separated by commas"
                        className={styles.input}
                    />
                </div>


                <div>
                    <button onClick={handleRegister}>Register Doctor</button>
                </div>
            </form>
        </div>
    )
}

export default CreateDoc