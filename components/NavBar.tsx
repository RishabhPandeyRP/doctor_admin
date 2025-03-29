"use client"
import styles from "@/styles/Navbar.module.css"
import Image from "next/image"
// import { usePathname } from "next/navigation"
import { useRouter } from "next/navigation"

const NavBar = ()=>{
    // const pathname = usePathname()
    // const isLoginPage = pathname == "/login"
    const router = useRouter()
    return(
        <div className={styles.navDiv}>
            <div className={styles.imgWrapper} onClick={()=>{router.push("/")}}>
                <Image src={"/mecareLogo.svg"}  alt="logo" fill objectFit="contain" ></Image>
            </div>

            {/* {!isLoginPage && <div className={styles.docBtn} onClick={()=>router.push("/createDoc")}>
                + Add doctor
            </div>} */}
        </div>
    )
}

export default NavBar