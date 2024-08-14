'use client'
import "@/app/globals.css";
import { useWriteContract, useReadContract, useReadContracts, useWaitForTransactionReceipt } from "wagmi";
import { ABIS } from "@/app/constants/abis";
import { Button } from "antd";
import { Spin, Table, Tag, message, Tooltip } from 'antd';
import type { TableProps } from 'antd';
import { useEffect, useState } from "react";
import { ethers } from 'ethers'
import { TOKEN_ADDRESS_TO_NAME, TOKEN_METADATA, TOKEN_LIST } from "@/app/constants/tokens";
import { useAccount } from "wagmi";
import Image from 'next/image';
import { StaticImageData } from "next/image";
import { formatNumber } from "@/app/utils/formatNumber";
import Link from "next/link";
import { QuestionCircleOutlined } from '@ant-design/icons';

interface DataType {
  key: string;
  to: string;
  txInfo: { ticker: string; amount: any; logo: StaticImageData; data: string };
  date: number;
  confirmation: number;
  status: string;
}

export default function PendingTxs({ params }: { params: { address: `0x${string}` } }) {

  const [isClient, setIsClient] = useState(false)
  const account = useAccount()


  const {
    data: hash,
    error,
    isLoading: isPending,
    writeContract
  } = useWriteContract()

  const { data: name, isLoading: nameIsLoading }: any = useReadContract({
    abi: ABIS["name"],
    address: params.address,
    functionName: "name",
    args: []
  })

  const { data: txData, isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  const [messageApi, contextHolder] = message.useMessage();

  const { data: transactionsLength, isLoading: isTransactionsLengthLoading } = useReadContract({
    abi: ABIS["getTransactionCount"],
    address: params.address,
    functionName: "getTransactionCount",
    args: [],
  })

  useEffect(() => {
    if (error) {
      messageApi.destroy();
      messageApi.open({
        type: 'error',
        content: 'Transaction error. Please try again later.',
      });
    }

    if (isPending) {
      messageApi.destroy();
      messageApi.open({
        type: 'loading',
        content: 'Transaction pending. Please wait...',
        duration: 0
      });
    }

    if (isConfirmed) {
      messageApi.destroy();
      messageApi.open({
        type: 'success',
        content: "Transaction successful.",
      });
    }
  }, [error, isPending, isConfirmed])

  const { data: balances, isLoading: isBalancesLoading } = useReadContracts({
    contracts: TOKEN_LIST.map((item, key): any => {
      return {
        abi: ABIS["balanceOf"],
        address: TOKEN_METADATA[item].address,
        functionName: "balanceOf",
        args: [params.address]
      }
    })
  })

  const { data: ownerConfirmations, isLoading: isOwnerConfirmationsLoading } = useReadContracts({
    contracts: !isTransactionsLengthLoading ? (Number(transactionsLength) !== 0 ? [...Array(Number(transactionsLength))].map((item, key): any => {
      return {
        abi: ABIS["hasOwnerConfirmed"],
        address: params.address,
        functionName: "hasOwnerConfirmed",
        args: [key, account.address]
      }
    }) : []) : []
  })

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Index',
      dataIndex: 'key',
      key: 'key'
    },
    {
      title: 'Tx Info',
      dataIndex: 'txInfo',
      key: 'txInfo',
      render: (txInfo) => <div className="flex"><Image
        src={txInfo.logo}
        alt={txInfo.ticker}
        style={{ width: '25px', marginRight: '8px' }}
      /> SEND {formatNumber(txInfo.amount)} {txInfo.ticker} </div>,
    },
    {
      title: 'Expiry Date',
      dataIndex: 'date',
      key: 'date',
      render: (text) => <p>{(new Date(text)).toString()}</p>,
    },
    {
      title: 'Confirmations',
      dataIndex: 'confirmation',
      key: 'confirmation',
      render: (text) => <p>{text} OUT OF {Number(ownerCounts)}</p>,
    },
    {
      title: 'Status',
      key: 'status',
      dataIndex: 'status',
      render: (status) =>
        <Tag color={status === "PENDING" ? 'volcano' : (status === "AWAITING EXECUTION" ? 'gold' : (status === "EXECUTED" ? 'green' : 'purple'))} key={status}>
          {status.toUpperCase()}
        </Tag>
      ,
      filters: [
        {
          text: 'PENDING',
          value: 'PENDING',
        },
        {
          text: 'AWAITING EXECUTION',
          value: 'AWAITING EXECUTION',
        },
        {
          text: 'EXECUTED',
          value: 'EXECUTED',
        },
        {
          text: 'EXPIRED',
          value: 'EXPIRED',
        },
      ],
      onFilter: (value, record) => record.status === (value as string),
      filterSearch: true,
    }
  ];

  const [data, setData] = useState<DataType[]>([])

  const { data: ownerCounts } = useReadContract({
    abi: ABIS["getOwnersLength"],
    address: params.address,
    functionName: "getOwnersLength",
    args: []
  })

  const decodeERC20TransferCalldata = (calldata: string) => {
    // ERC20 transfer function signature
    const transferFunctionSignature = 'transfer(address,uint256)';

    // Create the interface for the ERC20 transfer function
    const iface = new ethers.utils.Interface([`function ${transferFunctionSignature}`]);

    // Decode the calldata
    const decodedData = iface.decodeFunctionData('transfer', calldata);

    // Return the decoded parameters
    return {
      to: decodedData[0],
      value: decodedData[1].toString()
    };
  }

  const { data: transactions } = useReadContracts({
    contracts: !isTransactionsLengthLoading ? [...Array(Number(transactionsLength))].map((item, key): any => {
      return {
        abi: ABIS["getTransactionAtIndex"],
        address: params.address,
        functionName: "getTransactionAtIndex",
        args: [key]
      }
    }) : []
  })

  const confirmTransaction = (index: string) => {
    if (ownerConfirmations?.[Number(index)].result) {
      messageApi.destroy();
      messageApi.open({
        type: 'error',
        content: 'Transaction already confirmed.',
      });
      return;
    }

    messageApi.open({
      type: 'loading',
      content: 'Confirming transaction...',
      duration: 0
    });

    writeContract({
      address: params.address,
      abi: ABIS["confirmTransaction"],
      functionName: "confirmTransaction",
      args: [index],
    })
  }

  const expiredError = () => {
    messageApi.destroy();
    messageApi.open({
      type: 'error',
      content: 'Transaction expired.',
    });
  }

  const revokeConfirmation = (index: string) => {
    if (!ownerConfirmations?.[Number(index)].result) {
      messageApi.destroy();
      messageApi.open({
        type: 'error',
        content: 'Transaction not confirmed.',
      });
      return;
    }

    messageApi.open({
      type: 'loading',
      content: 'Revoking confirmation...',
      duration: 0
    });

    writeContract({
      address: params.address,
      abi: ABIS["revokeConfirmation"],
      functionName: "revokeConfirmation",
      args: [index],
    })
  }

  const executeTransaction = (index: string, confirmation: number, amount: number, walletBalance: number) => {
    if (walletBalance < amount) {
      messageApi.destroy();
      messageApi.open({
        type: 'error',
        content: 'Wallet balance not sufficient to execute transaction.',
      });
      return;
    }

    if (confirmation < Number(ownerCounts)) {
      messageApi.destroy();
      messageApi.open({
        type: 'error',
        content: 'Not enough confirmations to execute transaction.',
      });
      return;
    }

    messageApi.open({
      type: 'loading',
      content: 'Executing transaction...',
      duration: 0
    });

    writeContract({
      address: params.address,
      abi: ABIS["executeTransaction"],
      functionName: "executeTransaction",
      args: [index],
    })
  }

  useEffect(() => {
    if (transactions && ownerCounts) {
      const pendingTxs: DataType[] = []
      for (let i = 0; i < transactions.length; i++) {
        let status = "";

        const to = (transactions[i].result as any[])[0];
        const confirmations = Number((transactions[i].result as any[])[5]);
        const data = (transactions[i].result as any[])[3];
        const executed = Number((transactions[i].result as any[])[4]);
        const expiryDate = Number((transactions[i].result as any[])[2]);
        const ticker = TOKEN_ADDRESS_TO_NAME[(transactions[i].result as any[])[0].toLowerCase()];

        const date = new Date();
        const expiryDateObject = new Date(expiryDate);

        if (expiryDateObject <= date) {
          status = "EXPIRED"
        } else if (1 === executed) {
          status = "EXECUTED"
        } else if (confirmations === Number(ownerCounts)) {
          status = "AWAITING EXECUTION"
        } else {
          status = "PENDING"
        }

        const txInfo = { ticker, amount: decodeERC20TransferCalldata(data).value, logo: TOKEN_METADATA[ticker].logo, data: data };

        pendingTxs.push({
          key: i.toString(),
          to: to,
          txInfo: txInfo,
          date: expiryDate,
          confirmation: confirmations,
          status: status,
        });
      }

      setData(pendingTxs);
    }
  }, [transactions, ownerCounts])

  const expandedRowRender = (record: DataType) => {

    let tokenInfo: any;
    try {
      tokenInfo = decodeERC20TransferCalldata(record.txInfo.data);
    } catch (error) {

    }
    const ticker = TOKEN_ADDRESS_TO_NAME[record.to.toLowerCase()];

    let balance: number = 0;
    if (balances) {
      balance = ticker === "USDC" ? Number(balances[0].result) : (ticker === "USDT" ? Number(balances[1].result) : (ticker === "BTC" ? Number(balances[2].result) : Number(balances[3].result)));
    }


    return (
      <div className="text-white p-6 rounded-lg mx-auto">
        <div className="flex justify-between">
          <span className="text-left">
            <div className="flex">
              <Image
                src={record.txInfo.logo}
                alt={ticker}
                style={{ width: '25px', marginRight: '8px' }}
              />SEND {formatNumber(tokenInfo?.value)} {ticker}
            </div>
            <div className="mt-2">RECIPIENT: {tokenInfo?.to}</div>
          </span>

          <span className="text-right">
            <div>WALLET BALANCE: {formatNumber(balance)} {ticker}</div>
            {/* <div>TX Hash: 0x6795...fda0</div> */}
            <div>Expiry Date: {(new Date(record.date)).toString()}</div>
          </span>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-6">
          <Button onClick={() => confirmTransaction(record.key)} className="w-full bg-gray-700 hover:bg-gray-600 text-white" disabled={record.status === "EXECUTED"}>CONFIRM</Button>
          <Button onClick={() => revokeConfirmation(record.key)} className="w-full bg-gray-700 hover:bg-gray-600 text-white" disabled={record.status === "EXECUTED"}>REVOKE</Button>
          <Button onClick={() => executeTransaction(record.key, record.confirmation, Number(tokenInfo.value), balance)} className="w-full bg-gray-700 hover:bg-gray-600 text-white col-span-2" disabled={record.status === "EXECUTED"}>EXECUTE</Button>
        </div>
      </div>
    );
  };

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <main>
      {contextHolder}

      {isClient && !isBalancesLoading && !nameIsLoading ? <>
        <div className="flex justify-center">
          <h1 className='text-center text-2xl'>Outgoing Transactions for {name}</h1>
          <Tooltip title="Here you can view all transactions that have been created through this wallet to create, confirm, revoke and execute transactions." className='ml-2 mb-10'>
            <QuestionCircleOutlined />
          </Tooltip>
        </div>

        <div className="mx-auto w-3/4 mb-5 justify-between flex">

          <Link href={`/wallet/${params.address}/create-tx`}>
            <Button type="primary">
              Create New Outgoing Transaction
            </Button>
          </Link>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          expandable={{
            expandedRowRender,
            expandRowByClick: true,
            rowExpandable: (record) => record.status !== 'EXPIRED',
          }}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => { if (record.status === "EXPIRED") expiredError(); }, // click row
            };
          }}
          className="mx-auto w-3/4"
        /></> : isClient ? <p className="text-center">Please connect your wallet to continue.</p> : <div className="mx-auto w-1/2 text-center mt-10"><Spin tip="Loading" size="large"><></></Spin></div>}
    </main>

  );
}
