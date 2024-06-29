"use server"
import { createAdminClient } from "../appwrite";
import { parseStringify } from "../utils";
import { ID, Query } from "node-appwrite"

const {
    APPWRITE_DATABASE_ID: DB_ID,
    APPWRITE_TRANSACTION_COLLECTION_ID: TRANSACTION_COLLECTION_ID,
} = process.env;

export const getTransactionsByBankId = async ({ bankId }: getTransactionsByBankIdProps) => {
    try {
        const { db } = await createAdminClient();
        const senderTransactions = await db.listDocuments(
            DB_ID!,
            TRANSACTION_COLLECTION_ID!,
            [Query.equal("senderBankId", bankId)]
        );

        const receiverTransactions = await db.listDocuments(
            DB_ID!,
            TRANSACTION_COLLECTION_ID!,
            [Query.equal("receiverBankId", bankId)]
        );

        const transactions = {
            total : senderTransactions.total + receiverTransactions.total,
            documents: [...senderTransactions.documents, ...receiverTransactions.documents]
        }

        return parseStringify(transactions);
    } catch (error) {
        console.error("Error getting transactions by bank id", error);
    }
}

export const createTransaction = async (transactions: CreateTransactionProps) => {
    try {
        const { db } = await createAdminClient();

        const newTransaction = await db.createDocument(
            DB_ID!,
            TRANSACTION_COLLECTION_ID!,
            ID.unique(),
            {
                channel: "online",
                category: "Transfer",
                ...transactions
            }


        )
        if (!newTransaction) throw new Error("Error Sending Amount");
        return parseStringify(newTransaction);

    } catch (error) {
        throw new Error("Error creating transaction");

    }


}