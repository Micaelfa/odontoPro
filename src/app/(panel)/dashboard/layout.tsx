import SideBar from "./_components/sidebar"

 
 export default function DashboardLayout({
    children,
 }: {
    children:React.ReactNode
 }) {
    return (
        <>
            <SideBar> 
             {children}  
            </SideBar>
        </>
    )
 }