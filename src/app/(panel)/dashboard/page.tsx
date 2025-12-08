import getSession from "@/src/lib/getSession"
import { redirect } from "next/navigation"

export default async function Dashboard() {
    const session = await getSession()
    if (!session) {
        redirect("/")
    }

    return(
        <div>

            <h1> Dash </h1>

        </div>
    )
}