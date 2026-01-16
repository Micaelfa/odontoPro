import  getSession  from "@/src/lib/getSession"
import { redirect } from "next/navigation"
import {ServicesContent} from "./_components/service-content"

export default async function Services() {

    const session = await getSession()

   if (!session || !session.user || !session.user.id) {
           redirect("/")
       }
   
       
       
       return(

        <ServicesContent userId={session.user?.id!}/>
    )
   }
