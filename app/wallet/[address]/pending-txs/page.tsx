'use client'
import "@/app/globals.css";
import { useReadContract, useReadContracts } from "wagmi";
import { ABIS } from "@/app/constants/abis";
import { Button } from "antd";
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import { useEffect, useState } from "react";
import { ethers } from 'ethers'

interface DataType {
  key: string;
  txInfo: string;
  date: number;
  confirmation: number;
  status: string;
}

export default function PendingTxs({ params }: { params: { address: `0x${string}` } }) {

  const { data: transactionsLength, isLoading: isTransactionsLengthLoading } = useReadContract({
    abi: ABIS["getTransactionCount"],
    address: params.address,
    functionName: "getTransactionCount",
    args: [],
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
      render: (text) => <a>{text}</a>,
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
        <Tag color={status === "PENDING" ? 'volcano' : (status === "AWAITING EXECUTION" ? 'gold' : 'green')} key={status}>
          {status.toUpperCase()}
        </Tag>
      ,
    }
  ];

  console.log(transactionsLength);
  const [data, setData] = useState<DataType[]>([])

  const { data: ownerCounts } = useReadContract({
    abi: ABIS["getOwnersLength"],
    address: params.address,
    functionName: "getOwnersLength",
    args: []
  })

  console.log(ownerCounts);



  // const decodeERC20TransferCalldata = (calldata) => {
  //   // ERC20 transfer function signature
  //   const transferFunctionSignature = 'transfer(address,uint256)';

  //   // Create the interface for the ERC20 transfer function
  //   const iface = new ethers.utils.Interface([`function ${transferFunctionSignature}`]);

  //   // Decode the calldata
  //   const decodedData = iface.decodeFunctionData('transfer', calldata);

  //   // Return the decoded parameters
  //   return {
  //     to: decodedData[0],
  //     value: decodedData[1].toString()
  //   };
  // }

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

  useEffect(() => {
    if (transactions && ownerCounts) {
      const pendingTxs: DataType[] = []
      for (let i = 0; i < transactions.length; i++) {
        console.log(transactions[i]);
        let status = "";
        const confirmations = Number((transactions[i].result as any[])[5]);
        if (1 === Number((transactions[i].result as any[])[4])) {
          status = "EXECUTED"
        } else if (confirmations === ownerCounts) {
          status = "AWAITING EXECUTION"
        } else {
          status = "PENDING"
        }

        pendingTxs.push({
          key: (i + 1).toString(),
          txInfo: '-',
          date: Number((transactions[i].result as any[])[2]),
          confirmation: confirmations,
          status: status,
        });
      }

      setData(pendingTxs);
    }
  }, [transactions, ownerCounts])

  const expandedRowRender = (record: DataType) => {
    return (
      <p style={{ margin: 0 }}>
        Details for {record.txInfo}
      </p>
    );
  };


  return (
    <main>
      <h1 className='text-center text-xl'>Pending Transactions</h1>
      <Table
        columns={columns}
        dataSource={data}
        expandable={{
          expandedRowRender,
          expandRowByClick: true,
          rowExpandable: record => true,
        }}
        className="mx-auto w-3/4"
      />
      {/* <div className="">
        {transactions ? transactions.map((item, key) => {
          const to = (item.result as any[])[0];
          const value = (item.result as any[])[1];
          const deadline = (item.result as any[])[2];
          const data = (item.result as any[])[3];
          const executed = (item.result as any[])[4];
          const numConfirmations = (item.result as any[])[5];

          return (
            <div className="max-w-lg mx-auto mt-5 border border-white rounded-lg p-6 bg-gray-800 text-white">
            <div className="mb-4">
              <p><span className="text-gray-400">To:</span> {to}</p>
              <p><span className="text-gray-400">Value:</span> {Number(value)}</p>
              <p><span className="text-gray-400">Deadline:</span> {Number(deadline)}</p>
              <p><span className="text-gray-400">Data:</span> {data}</p>
              <p><span className="text-gray-400">Executed:</span> {String(executed)}</p>
              <p><span className="text-gray-400">Num confirmations:</span> {Number(numConfirmations)}</p>
            </div>
            <div className="flex justify-between mt-6">
              <Button type="primary" className="bg-green-500 border-green-500 hover:bg-green-600">Confirm</Button>
              <Button type="primary" className="bg-red-500 border-red-500 hover:bg-red-600">Revoke</Button>
              <Button type="primary" className="bg-blue-500 border-blue-500 hover:bg-blue-600">Execute</Button>
            </div>
          </div>
          )
        }) : <></>}
      </div> */}
    </main>

  );
}
