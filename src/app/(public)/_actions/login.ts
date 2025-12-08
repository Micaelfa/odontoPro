"use server"

import { signIn } from "@/src/lib/auth"

export async function handleRegister(provider:string) {
    await signIn(provider,{redirectTo: "/dashboard"})
    
}