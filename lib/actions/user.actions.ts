'use server'

import { cookies } from "next/headers"
import { ID, Query } from "node-appwrite"
import { createAdminClient, createSessionClient } from "../appwrite"
import { encryptId, extractCustomerIdFromUrl, parseStringify } from "../utils"
import { CountryCode, ProcessorTokenCreateRequest, ProcessorTokenCreateRequestProcessorEnum, Products } from "plaid"
import { plaidClient } from "../plaid"
import { revalidatePath } from "next/cache"
import { addFundingSource, createDwollaCustomer } from "./dwolla.actions"

const {
    APPWRITE_DATABASE_ID: DB_ID,
    APPWRITE_USER_COLLECTION_ID: USER_COLLECTION_ID,
    APPWRITE_BANK_COLLECTION_ID: BANK_CPOLLECTION_ID,
   
} = process.env;


export const getUserInfo = async ({ userId }: getUserInfoProps) => {
    try {
        const { db } = await createAdminClient();
        const user = await db.listDocuments(
            DB_ID!,
            USER_COLLECTION_ID!,
            [Query.equal("userId", [userId])]


        );
        return parseStringify(user.documents[0]);
    } catch (error) {
        console.error("Error getting user info", error);
    }
}


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

        const user = await getUserInfo({ userId: session.userId });
        return user;

    } catch (error) {
        console.error("Error signing in user", error)
    }
}

export const signUp = async ({ password, ...userData }: SignUpParams) => {
    let newUserAccount;
    try {
        const { email, firstName, lastName } = userData;
        const { account, db } = await createAdminClient();
        
        newUserAccount = await account.create(
            ID.unique(),
            email,
            password,
            `${firstName} ${lastName}`
        );

        

        if (!newUserAccount) throw Error("Error creating user account");

        const dwollaCustomerUrl = await createDwollaCustomer({
            ...userData,
            type: "personal"
        });

        if (!dwollaCustomerUrl) throw Error("Error creating dwolla customer");

        const dwollaCustomerId = extractCustomerIdFromUrl(dwollaCustomerUrl);
        const newUser = await db.createDocument(
            DB_ID!,
            USER_COLLECTION_ID!,
            ID.unique(),
            {
                ...userData,
                userId: newUserAccount.$id,
                dwollaCustomerUrl,
                dwollaCustomerId
            }
        )

        const session = await account.createEmailPasswordSession(email, password);

        cookies().set("appwrite-session", session.secret, {
            path: "/",
            httpOnly: true,
            sameSite: "strict",
            secure: true,
        });



        return parseStringify(newUser);

    } catch (error) {
        console.error("Error signing in user", error)
    }
}

export const getLoggedInUser = async () => {
    try {
        const { account } = await createSessionClient();
        const res =  await account.get();
        const user = await getUserInfo({ userId: res.$id });

        return user;
    } catch (error) {
        return null;
    }
}


export const signOut = async () => {
    try {
        const { account } = await createAdminClient();
        cookies().delete("appwrite-session");

        await account.deleteSession('current');


    } catch (error) {

    }
}

export const createLinkToken = async (user: User) => {
    try {
        const tokenParams = {
            user: {
                client_user_id: user.$id,
            },
            client_name: `${user.firstName} ${user.lastName}`,
            products: ["auth"] as Products[],
            language: "en",
            country_codes: ["US"] as CountryCode[],
        };

        const res = await plaidClient.linkTokenCreate(tokenParams);
        return parseStringify({ linkToken: res.data.link_token })



    } catch (error) {
        console.log(error);

    }

}

export const createBankAccount = async ({ userId,
    bankId,
    accessToken,
    accountId,
    fundingSourceUrl,
    sharableId
}: createBankAccountProps) => {
    try {
        const { db } = await createAdminClient();

        const bankAccount = await db.createDocument(
            DB_ID!,
            BANK_CPOLLECTION_ID!,
            ID.unique(),
            {
                userId,
                bankId,
                accessToken,
                accountId,
                fundingSourceUrl,
                sharableId
            });

        return parseStringify(bankAccount)
    } catch (error) {

    }

}

export const exchangePublicToken = async ({ publicToken, user }: exchangePublicTokenProps) => {
    try {
        const res = await plaidClient.itemPublicTokenExchange({
            public_token: publicToken
        });

        const { access_token, item_id } = res.data;
        const accRes = await plaidClient.accountsGet({
            access_token
        });
        const { account_id, name } = accRes.data.accounts[0];

        const request: ProcessorTokenCreateRequest = {
            access_token,
            account_id,
            processor: "dwolla" as ProcessorTokenCreateRequestProcessorEnum,

        };

        const processorTokenRes = await plaidClient.processorTokenCreate(request);
        const { processor_token } = processorTokenRes.data;

        const fundingSourceUrl = await addFundingSource({
            dwollaCustomerId: user.dwollaCustomerId,
            processorToken: processor_token,
            bankName: name
        });

        if (!fundingSourceUrl) throw Error("Error adding funding source");
        await createBankAccount({
            userId: user.$id,
            bankId: item_id,
            accountId: account_id,
            accessToken: access_token,
            fundingSourceUrl,
            sharableId: encryptId(account_id)
        })

        revalidatePath('/');

        return parseStringify({ publicTokenExchange: "complete" })
    }


    catch (error) {
        console.error("Error exchanging public token", error);
    }
}


export const getBanks = async ({ userId }: getBanksProps) => {
    try {
        const { db } = await createAdminClient();
        const banks = await db.listDocuments(
            DB_ID!,
            BANK_CPOLLECTION_ID!,
            [Query.equal("userId", [userId])]

        );
        return parseStringify(banks.documents);
    } catch (error) {
        throw new Error("Error getting banks");
    }

}

export const getBank = async ({ documentId }: getBankProps) => {
    try {
        const { db } = await createAdminClient();

        const bank = await db.listDocuments(
            DB_ID!,
            BANK_CPOLLECTION_ID!,
            [Query.equal("$id", [documentId])]

        );
        return parseStringify(bank.documents[0]);
    } catch (error) {
        throw new Error("Error getting bank");
    }

}

export const getBankByAccountId = async ({ accountId }: getBankByAccountIdProps) => {
    try {
        const { db } = await createAdminClient();

        const bank = await db.listDocuments(
            DB_ID!,
            BANK_CPOLLECTION_ID!,
            [Query.equal("accountId", [accountId])]

        );

        if(bank.total !== 1) return null;
        return parseStringify(bank.documents[0]);
    } catch (error) {
        throw new Error("Error getting bank");
    }

}