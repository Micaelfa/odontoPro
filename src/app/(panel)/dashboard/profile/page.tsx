import  getSession  from "@/src/lib/getSession"
import { redirect } from "next/navigation"
import { getUserData } from "./_data-access/get-info-user"
import ProfileContent from "./_components/profile"

export default async function Profile() {
    const session = await getSession()

    if (!session || !session.user || !session.user.id) {
        redirect("/")
    }

    const user = await getUserData({ userId: session.user?.id})

    if(!user) {
        redirect("/")
    }
    
    return(
        <ProfileContent user={user}/>
    )
}