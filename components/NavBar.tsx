"use client"
import styles from "@/styles/Navbar.module.css"
import Image from "next/image"
import { usePathname } from "next/navigation"
const NavBar = ()=>{
    const pathname = usePathname()
    const isLoginPage = pathname == "/login"
    return(
        <div className={styles.navDiv}>
            <div className={styles.imgWrapper}>
                <Image src={"/mecareLogo.svg"}  alt="logo" fill objectFit="contain" ></Image>
            </div>

            {!isLoginPage && <div className={styles.docBtn}>
                + Add doctor
            </div>}
        </div>
    )
}

export default NavBar