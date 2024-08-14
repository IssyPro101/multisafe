'use client'
import "@/app/globals.css";
import { useAccount } from 'wagmi'
import { useEffect, useState } from "react";
import { ABIS } from "@/app/constants/abis";
import { useWriteContract, useWaitForTransactionReceipt, useReadContract } from "wagmi";
import { Button, message, Space, Input, Upload, Spin, DatePicker, Tooltip } from 'antd';
import { ethers } from 'ethers';
import Link from 'next/link';
import { Divider, Select } from 'antd';
import Image from 'next/image';
import { TOKEN_METADATA, TOKEN_LIST } from "@/app/constants/tokens";
import { getERC20TransferCalldata } from "@/app/utils/getERC20TransferCalldata";
import { QuestionCircleOutlined } from '@ant-design/icons';

const { Option } = Select;


export function CreateTx({ params }: { params: { address: `0x${string}` } }) {

    const {
        data: hash,
        error,
        isLoading: isPending,
        writeContract
    } = useWriteContract()

    const account = useAccount();

    const [recipient, setRecipient] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [deadline, setDeadline] = useState<string>('');
    const [isClient, setIsClient] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [selectedToken, setSelectedToken] = useState<string>("");

    const handleChange = (value: string) => {
        setSelectedToken(value);
    };

    const { data: txData, isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        });

    const { data: name, isLoading: nameIsLoading }: any = useReadContract({
        abi: ABIS["name"],
        address: params.address,
        functionName: "name",
        args: []
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
                content: <p>Transaction created. <Link href={`/wallet/${params.address}/pending-txs`}>View Transactions</Link></p>,
                duration: 0
            });
        }

    }, [error, isPending, isConfirmed]);

    useEffect(() => {
        setIsClient(true)
    }, [])

    async function submit() {

        var someDate = new Date(deadline);
        const epochDeadline = someDate.getTime();

        const date = new Date();

        if (!ethers.utils.isAddress(recipient)) {
            messageApi.destroy();
            messageApi.open({
                type: 'error',
                content: 'Invalid Ethereum address provided.',
            });
            return;
        }

        if (someDate <= date) {
            messageApi.destroy();
            messageApi.open({
                type: 'error',
                content: 'Date needs to be at a later time.',
            });
            return;
        }

        if (amount === null || amount.match(/^ *$/) !== null) {
            messageApi.destroy();
            messageApi.open({
                type: 'error',
                content: 'Transfer amount not specified.',
            });
            return;
        }

        if (!amount.match(/^\d+$/)) {
            messageApi.destroy();
            messageApi.open({
                type: 'error',
                content: 'Transfer amount is not a number.',
            });
            return;            
        }

        if (Number(amount) < 1) {
            messageApi.destroy();
            messageApi.open({
                type: 'error',
                content: 'Transfer amount must be at least 1.',
            });
            return;
        }

        const calldata = getERC20TransferCalldata(recipient, amount);

        writeContract({
            address: params.address,
            abi: ABIS["submitTransaction"],
            functionName: "submitTransaction",
            args: [TOKEN_METADATA[selectedToken].address, 0, epochDeadline, calldata],
        })
    }

    return (
        <main className="text-center mx-auto w-1/2">
            {contextHolder}


            {isClient && !nameIsLoading && account.address ? <><div className="flex justify-center">
                <h1 className='text-center text-2xl'>Create Outgoing Transaction for {name}</h1>
                <Tooltip title="Here you can create a new transaction by selecting a cryptocurrency to transfer to a specificed address. Transactions are executable upto the specified expiry date." className='ml-2 mb-10'>
                    <QuestionCircleOutlined />
                </Tooltip>
            </div>
                <Space className="w-1/2" direction="vertical">
                    <Select
                        placeholder="Select a crypto token"
                        className="w-full"
                        onChange={handleChange}>
                        {TOKEN_LIST.map((name) => {
                            const token = TOKEN_METADATA[name]
                            return (
                                <Option key={token.ticker} value={token.ticker}>
                                    {token.ticker}
                                </Option>
                            )
                        })}
                    </Select>
                    <Input
                        placeholder="To"
                        autoComplete="off"
                        name="to"
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        allowClear
                    />
                    <Input
                        placeholder="Amount"
                        autoComplete="off"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        allowClear
                    />
                    <DatePicker
                        name="deadline"
                        value={deadline}
                        onChange={(e) => setDeadline(e)}
                        showTime
                        placeholder="Expiry date"
                        className="w-full"
                    />

                    <Button
                        disabled={isPending}
                        type="primary"
                        onClick={submit}
                        className="mt-5"
                    >
                        Create Transaction
                    </Button>

                </Space>
            </> : isClient ? <p className="text-center">Please connect your wallet to continue.</p> : <div className="mx-auto w-1/2 text-center mt-10"><Spin tip="Loading" size="large"><></></Spin></div>}
        </main>
    );
}