'use client'
import "@/app/globals.css";
import { useBalance } from 'wagmi'
import { formatUnits } from 'viem'
import { useState } from "react";
import { CONTRACT_ADDRESSES } from "@/app/constants/contract";
import { ABIS } from "@/app/constants/abis";
import { BaseError } from "viem";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";

export default function CreateTx({ params }: { params: { address: `0x${string}` } }) {

  const {
    data: hash,
    error,
    isPending,
    writeContract
  } = useWriteContract()

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const formData = new FormData(e.target as HTMLFormElement)

    const to = formData.get("to");
    const value = formData.get("value");
    const deadline = formData.get("deadline");
    const data = formData.get("data");

    writeContract({
      address: params.address,
      abi: ABIS["submitTransaction"],
      functionName: "submitTransaction",
      args: [to, value, deadline, data],
    })
  }

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  return (
    <main className="text-center">
      <h1 className='text-center text-xl'>Create Transaction</h1>
      <form onSubmit={submit} className='mx-auto w-1/2 text-center'>
        <div>
          <input
            className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pl-10 ltr:pr-5 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
            placeholder="To"
            autoComplete="off"
            name={`to`}
          />
          <br />
        </div>
        <div>
          <input
            className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pl-10 ltr:pr-5 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
            placeholder="Value"
            autoComplete="off"
            name={`value`}
          />
          <br />
        </div>
        <div>
          <input
            className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pl-10 ltr:pr-5 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500 dark:[color-scheme:dark]"
            placeholder="Deadline"
            autoComplete="off"
            name={`deadline`}
            type="date"
          />
          <br />
        </div>
        <div>
          <input
            className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pl-10 ltr:pr-5 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
            placeholder="Data"
            autoComplete="off"
            name={`data`}
          />
          <br />
        </div>
        <br />
        <button
          disabled={isPending}
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto"
        >
          <p>{isPending ? 'Submitting...' : 'Submit'} </p>
        </button>
        {hash && <div>Transaction Hash: {hash}</div>}
        {isConfirming && <div>Waiting for confirmation...</div>}
        {isConfirmed && <div>Transaction confirmed.</div>}
        {error && (
          <div>Error: {(error as BaseError).shortMessage || error.message}</div>
        )}
      </form>
    </main>

  );
}
