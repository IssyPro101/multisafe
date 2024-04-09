import * as React from 'react'
import { useState } from 'react'
import {
    type BaseError,
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/app/constants/contract'
import { ABIS } from '@/app/constants/abis'

export function CreateWallet() {
    const {
        data: hash,
        error,
        isPending,
        writeContract
    } = useWriteContract()

    const [numOfOwners, setNumOfOwners] = useState<number>(3);

    async function submit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.target as HTMLFormElement)

        const owners = []
        for (let i = 0; i < numOfOwners; i++) {
            const owner = formData.get(`owner${i}`) as string
            owners.push(owner);
        }

        writeContract({
            address: CONTRACT_ADDRESSES["MultiSafeFactory"],
            abi: ABIS["deployMultiSafeWallet"],
            functionName: "deployMultiSafeWallet",
            args: [owners, numOfOwners],
        })
    }

    const { isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        })

    return (
        <div className='mx-auto w-1/2'>
            <h1 className='text-center text-xl'>Create Wallet</h1>
            <form onSubmit={submit} className='mx-auto w-1/2 text-center' >
                <div>
                {
                    [...Array(numOfOwners)].map((item, key) => {
                        return (
                            <>
                            <input
                                className="h-11 w-full appearance-none rounded-lg border-2 border-gray-200 bg-transparent py-1 text-sm tracking-tighter text-gray-900 outline-none transition-all placeholder:text-gray-600 focus:border-gray-900 ltr:pl-10 ltr:pr-5 rtl:pr-10 dark:border-gray-600 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-gray-500"
                                placeholder="Owner address"
                                autoComplete="off"
                                name={`owner${key}`}
                            />
                            <br/>
                            </>
                        )
                    })
                }
                </div>
                <br/>
                <button
                    disabled={isPending}
                    type="submit"
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto"
                >
                    <p>{isPending ? 'Confirming...' : 'Create'} </p>
                </button>
                {/* {hash && <div>Transaction Hash: {hash}</div>}
                {isConfirming && <div>Waiting for confirmation...</div>}
                {isConfirmed && <div>Transaction confirmed.</div>}
                {error && (
                    <div>Error: {(error as BaseError).shortMessage || error.message}</div>
                )} */}
            </form>
        </div>
    )
}
