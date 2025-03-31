"use client"
import styles from "@/styles/Navbar.module.css"
import Image from "next/image"
import { useRouter } from "next/navigation"

const NavBar = ()=>{
   
    const router = useRouter()
    return(
        <div className={styles.navDiv}>
            <div className={styles.imgWrapper} onClick={()=>{router.push("/")}}>
                <Image src={"/mecareLogo.svg"}  alt="logo" fill objectFit="contain" ></Image>
            </div>

        </div>
    )
}

export default NavBar