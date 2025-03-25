"use client"
import { useRouter , usePathname } from "next/navigation"
import styles from "@/styles/Sidebar.module.css"

const Sidebar = ()=>{
    const navLinks = [{name:"Doctors" , link:"/doctors"},
        {name:"Appointments" , link:"/appointments"}
    ]
    const router = useRouter()
    const pathname = usePathname()

    return(
        <div className={styles.sideDiv}>
            

            <div className={styles.navList}>
                {
                    navLinks.map((item,index)=>(
                        <div key={index} onClick={()=>{
                            router.push(item.link)
                        }} className={`${styles.navItem} ${pathname == item.link? styles.active : ""} `}>
                            {item.name}
                        </div>
                    ))
                }
            </div>
        </div>
    )
}

export default Sidebar