'use client'
import { CreateTx } from "@/components/createTx";
import "@/app/globals.css";

export default function CreateTxPage({ params }: { params: { address: `0x${string}` } }) {
    return (
        <main>
            <CreateTx params={params}></CreateTx>
        </main>

    );
}