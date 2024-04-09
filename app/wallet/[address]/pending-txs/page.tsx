'use client'
import "@/app/globals.css";
import { useReadContract, useReadContracts } from "wagmi";
import { ABIS } from "@/app/constants/abis";

export default function Home({ params }: { params: { address: `0x${string}` } }) {

  const { data: transactionsLength, isLoading: isTransactionsLengthLoading } = useReadContract({
    abi: ABIS["getTransactionCount"],
    address: params.address,
    functionName: "getTransactionCount",
    args: [],
  })

  console.log(transactionsLength);

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

  return (
    <main>
      <h1 className='text-center text-xl'>Pending Transactions</h1>
      <div className="">
        {transactions ? transactions.map((item, key) => {
          const to = (item.result as any[])[0];
          const value = (item.result as any[])[1];
          const deadline = (item.result as any[])[2];
          const data = (item.result as any[])[3];
          const executed = (item.result as any[])[4];
          const numConfirmations = (item.result as any[])[5];

          return (
            <div className="mx-auto mt-5 border border-white">
              <div>
                <p>To: {to}</p>
                <p>Value: {Number(value)}</p>
                <p>Deadline: {Number(deadline)}</p>
                <p>Data: {data}</p>
                <p>Executed: {String(executed)}</p>
                <p>Num confirmations: {Number(numConfirmations)}</p>
              </div>
            </div>
          )
        }) : <></>}
      </div>
    </main>

  );
}
