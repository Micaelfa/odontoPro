import { getPermissionUserToAnalytics } from "./_data-access/get-permission-analitcs"


export default async function Analytics(){

    const user = await getPermissionUserToAnalytics()
    if(!user){
        <p>Sem permissão, APENAS PARA USUÁRIOS PROFISSIONAIS</p>
    }
    return(
        <main>
            <h1>Analytics</h1>
        </main>
    )
}