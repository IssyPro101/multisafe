'use client'
import Link from 'next/link'
import "@/app/globals.css";
import { useBalance } from 'wagmi'
import { formatUnits } from 'viem'
import { useRouter } from 'next/navigation'
import { useReadContract, useReadContracts } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/app/constants/contract'
import { useAccount } from 'wagmi'
import { UseReadContractParameters } from 'wagmi'
import { ABIS } from '@/app/constants/abis'



export default function Home({ params }: { params: { address: `0x${string}` } }) {

  const account = useAccount()

  const { data: userWalletsLength, isLoading: isUserWalletsLengthLoading } = useReadContract({
    abi: ABIS["getNumUserWallets"],
    address: CONTRACT_ADDRESSES["MultiSafeFactory"],
    functionName: "getNumUserWallets",
    args: account.address ? [account.address] : undefined,
  })

  const { data: wallets } = useReadContracts({
    contracts: !isUserWalletsLengthLoading ? [...Array(Number(userWalletsLength))].map((item, key): any => {
      return {
        abi: ABIS["userWallets"],
        address: CONTRACT_ADDRESSES["MultiSafeFactory"],
        functionName: "userWallets",
        args: [account.address, key]
      }
    }) : []
  })

  console.log(wallets);

  return (
    <main className="text-center">
      <h1 className='mt-10 text-xl'>
        My Wallets
      </h1>
      <div className="">
        {wallets ? wallets.map((item, key) => {
          return (
            <div className="mx-auto mt-5 border border-white">
              <Link href={`/wallet/${item.result}`}>
                <div>
                  <p>{item.result as string}</p>
                </div>
              </Link>
            </div>
          )
        }) : <></>}
      </div>
    </main>

  );
}
