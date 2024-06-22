'use server'

import { cookies } from "next/headers"
import { ID } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { parseStringify } from "../utils"

export const signIn = async (data: signInProps) => {
    try {
        const { email, password } = data;
        const { account } = await createAdminClient();
        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });

        return session;

    } catch (error) {
        console.error("Error signing in user", error)
    }
}

export const signUp = async (userData: SignUpParams) => {
    try {
        const { email, password, firstName, lastName } = userData;
        const { account } = await createAdminClient();

        const newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`
        );

        const session = await signIn({ email, password });

        return parseStringify(newUserAccount);

    } catch (error) {
        console.error("Error signing in user", error)
    }
}

export const getLoggedInUser = async () => {
    try {
        const { account } = await createSessionClient();
        return await account.get();
    } catch (error) {
        return null;
    }
}


export const signOut = async () => {
    try {
        const {account} = await createAdminClient();
        cookies().delete("appwrite-session");

        await account.deleteSession('current');

        
    } catch (error) {
        
    }
}