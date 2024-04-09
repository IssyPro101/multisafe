'use client'
import Link from 'next/link'
import "@/app/globals.css";
import { useBalance } from 'wagmi'
import { formatUnits } from 'viem'

export default function Home({ params }: { params: { address: `0x${string}` } }) {

  const { data: walletBalance, isLoading: walletBalanceIsLoading } = useBalance({
    address: params.address,
  })

  console.log(walletBalance?.value)
  console.log(walletBalance);

  return (
    <main className="text-center">
      <p>{params.address}</p>
      <p>Balance: <>{!walletBalanceIsLoading && formatUnits(walletBalance!.value, walletBalance!.decimals)}</></p>
      <div className="mx-auto mt-5 w-1/4">
        <Link href={`/wallet/${params.address}/create-tx`}>
          <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto">
            <p>Create New Transaction</p>
          </div>
        </Link>
      </div>
      <div className="mx-auto mt-5 w-1/4">
        <Link href={`/wallet/${params.address}/pending-txs`}>
          <div className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-auto">
            <p>View Pending Transactions</p>
          </div>
        </Link>
      </div>
    </main>

  );
}
