'use client'
import Link from 'next/link'
import "@/app/globals.css";
import { useReadContract, useReadContracts } from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/app/constants/contract'
import { useAccount } from 'wagmi'
import { ABIS } from '@/app/constants/abis'
import { MediaRenderer } from "@thirdweb-dev/react";
import { blo } from "blo";
import { useState, useEffect } from 'react';
import { Spin, Space, Image } from 'antd';

function AddressIcon({ address }: { address: `0x${string}` }) {
  return (
    <Image
      alt={address}
      src={blo(address)}
      style={{
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        objectFit: 'cover',
        marginRight: "10px"
      }}
    />
  );
}

export default function MyWallets({ params }: { params: { address: `0x${string}` } }) {

  const [isClient, setIsClient] = useState(false)

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

  const { data: ownerCounts } = useReadContracts({
    contracts: wallets ? wallets.map((item, key): any => {
      return {
        abi: ABIS["getOwnersLength"],
        address: item.result,
        functionName: "getOwnersLength",
        args: []
      }
    }) : []
  })

  console.log(ownerCounts);

  const { data: names } = useReadContracts({
    contracts: wallets ? wallets.map((item, key): any => {
      return {
        abi: ABIS["name"],
        address: item.result,
        functionName: "name",
        args: []
      }
    }) : []
  })

  const { data: images } = useReadContracts({
    contracts: wallets ? wallets.map((item, key): any => {
      return {
        abi: ABIS["image"],
        address: item.result,
        functionName: "image",
        args: []
      }
    }) : []
  })

  console.log(wallets);
  console.log(names);
  console.log(images);

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <main className="text-center">
      <h1 className='text-center text-2xl'>My Wallets</h1>
      {isClient && account.address ? <Space direction="vertical">
        {wallets && names && images && ownerCounts ? wallets.map((item, key) => {
          return (
            <Link href={`/wallet/${item.result}`}>
              <div className="flex items-center justify-between p-4 rounded-lg shadow-md mx-auto mt-5 w-full" style={{ backgroundColor: "#404040" }}>

                <div className="flex items-center">
                  {images[key].result ? <MediaRenderer style={{
                    width: '100px',
                    height: '100px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    marginRight: "10px"
                  }} src={images[key].result as string} /> : <AddressIcon address={item.result as `0x${string}`} />}

                  <p className="text-white text-sm">{names[key].result + " : " + (item.result as string).slice(0, 10) + '...'}</p>
                </div>
                <div className="text-white text-sm">of {(ownerCounts[key].result as BigInt).toString()} owner/s</div>
              </div>
            </Link>
          )
        }) : <></>}
      </Space> : isClient ? <p className="text-center">Please connect your wallet to continue.</p> : <div className="mx-auto w-1/2 text-center mt-10"><Spin tip="Loading" size="large"><></></Spin></div>}
    </main>

  );
}
