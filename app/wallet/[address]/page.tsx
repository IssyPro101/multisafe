'use client'
import Link from 'next/link'
import "@/app/globals.css";
import { useBalance } from 'wagmi'
import { formatUnits } from 'viem'
import { MediaRenderer } from '@thirdweb-dev/react';
import { useReadContract, useReadContracts, useAccount } from 'wagmi';
import { ABIS } from '@/app/constants/abis';
import { useState, useEffect } from 'react';
import { Button, Spin, message, Tooltip } from 'antd';
import { LivePricingFeed } from "@/components/priceWidgets";
import { TOKEN_ADDRESS_TO_NAME, TOKEN_METADATA, TOKEN_LIST, TOKEN_PRICE_DATA_LIST } from "@/app/constants/tokens";
import { formatNumber } from '@/app/utils/formatNumber';
import { CopyOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import { AddressIcon } from '@/components/addressIcon';

export default function Wallet({ params }: { params: { address: `0x${string}` } }) {

  const [isClient, setIsClient] = useState(false)
  const [messageApi, contextHolder] = message.useMessage();

  const { data: walletBalance, isLoading: walletBalanceIsLoading } = useBalance({
    address: params.address,
  })

  const { data: name, isLoading: nameIsLoading }: any = useReadContract({
    abi: ABIS["name"],
    address: params.address,
    functionName: "name",
    args: []
  })

  const { data: image, isLoading: imageIsLoading }: any = useReadContract({
    abi: ABIS["image"],
    address: params.address,
    functionName: "image",
    args: []
  })

  const { data: balances } = useReadContracts({
    contracts: TOKEN_LIST.map((item, key): any => {
      return {
        abi: ABIS["balanceOf"],
        address: TOKEN_METADATA[item].address,
        functionName: "balanceOf",
        args: [params.address]
      }
    })
  })

  const account = useAccount();

  useEffect(() => {
    setIsClient(true)
  }, [])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(params.address).then(
      () => {
        messageApi.destroy();
        messageApi.open({
          type: 'success',
          content: 'Copied to clipboard!',
        });
      },
      (err) => {
        messageApi.destroy();
        messageApi.open({
          type: 'error',
          content: 'Failed to copy.',
        });
      }
    );
  };

  return (
    <main className="text-center">
      {contextHolder}

      {isClient && !imageIsLoading && !nameIsLoading && account.address ? <>

        <div className="flex justify-center">
          <h1 className='text-center text-2xl'>{name}</h1>
          <Tooltip title="Here you can view the portfolio of your multisig wallet and send funds to the address below." className='ml-2 mb-10'>
            <QuestionCircleOutlined />
          </Tooltip>
        </div>

        <div className="flex items-center justify-center">
          <span className="truncate tracking-tighter text-gray-600">{params.address}</span>
          <CopyOutlined onClick={copyToClipboard} />
        </div>

        <div className="flex items-center justify-center text-white p-4 rounded-lg mx-auto mb-10">
          {image ? <MediaRenderer style={{
            width: '100px',
            height: '100px',
            borderRadius: '50%',
            objectFit: 'cover',
          }} src={image as string} /> : <AddressIcon address={params.address as `0x${string}`} />}
          <div className="ml-4">
            <div className="text-sm">MY BALANCE</div>
            <div className="text-2xl font-bold">${formatNumber((Number(balances?.[0].result) * TOKEN_PRICE_DATA_LIST[0].price) + (Number(balances?.[1].result) * TOKEN_PRICE_DATA_LIST[1].price) + (Number(balances?.[2].result) * TOKEN_PRICE_DATA_LIST[2].price))} USD</div>
          </div>
        </div>


        {/* <p>Balance: <>{!walletBalanceIsLoading && formatUnits(walletBalance!.value, walletBalance!.decimals)}</> ETH</p> */}
        <div className='flex mx-auto w-3/4 gap-4'>

          {balances && TOKEN_PRICE_DATA_LIST.map((item, key) => {
            return (<LivePricingFeed {...item} balance={Number(balances[key].result)} />)
          })}

        </div>

        <div className="mx-auto mt-10 w-1/4">
          <Link href={`/wallet/${params.address}/pending-txs`}>
            <Button type="primary">
              View Outgoing Transactions
            </Button>
          </Link>
        </div></> : isClient ? <p className="text-center">Please connect your wallet to continue.</p> : <div className="mx-auto w-1/2 text-center mt-10"><Spin tip="Loading" size="large"><></></Spin></div>}
    </main>
  );
}
