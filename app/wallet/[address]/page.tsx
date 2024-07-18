'use client'
import Link from 'next/link'
import "@/app/globals.css";
import { useBalance } from 'wagmi'
import { formatUnits } from 'viem'
import { MediaRenderer } from '@thirdweb-dev/react';
import { useReadContract, useAccount } from 'wagmi';
import { ABIS } from '@/app/constants/abis';
import { useState, useEffect } from 'react';
import { Button } from 'antd';

export default function Wallet({ params }: { params: { address: `0x${string}` } }) {

  const [isClient, setIsClient] = useState(false)

  const { data: walletBalance, isLoading: walletBalanceIsLoading } = useBalance({
    address: params.address,
  })

  const { data: name }: any = useReadContract({
    abi: ABIS["name"],
    address: params.address,
    functionName: "name",
    args: []
  })

  const { data: image }: any = useReadContract({
    abi: ABIS["image"],
    address: params.address,
    functionName: "image",
    args: []
  })

  const account = useAccount();

  useEffect(() => {
    setIsClient(true)
  }, [])

  console.log(walletBalance?.value)
  console.log(walletBalance);
  console.log(name);
  console.log(image);

  return (
    <main className="text-center">
      {isClient && image && name && account.address && <><MediaRenderer style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
        margin: "0 auto"
      }} src={image as string} />
        <p>{name}</p>
        <p>Balance: <>{!walletBalanceIsLoading && formatUnits(walletBalance!.value, walletBalance!.decimals)}</> ETH</p>
        <div className="mx-auto mt-5 w-1/4">
          <Link href={`/wallet/${params.address}/create-tx`}>
            <Button type="primary">
              Create New Transaction
            </Button>
          </Link>
        </div>
        <div className="mx-auto mt-5 w-1/4">
          <Link href={`/wallet/${params.address}/pending-txs`}>
            <Button type="primary">
              View Pending Transactions
            </Button>
          </Link>
        </div></>}
    </main>
  );
}
