'use client'
import "@/app/globals.css";
import { useAccount } from 'wagmi'
import { useEffect, useState } from "react";
import { ABIS } from "@/app/constants/abis";
import { useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { Button, message, Space, Input, Upload, Spin, DatePicker } from 'antd';
import { ethers } from 'ethers'
import Link from 'next/link';
import { Divider, Select } from 'antd';
import Image from 'next/image';
import { TOKEN_METADATA, TOKEN_LIST } from "@/app/constants/tokens";

const { Option } = Select;


export function CreateTx({ params }: { params: { address: `0x${string}` } }) {

    const {
        data: hash,
        error,
        isLoading: isPending,
        writeContract
    } = useWriteContract()

    const account = useAccount();

    const [to, setTo] = useState<string>('');
    const [value, setValue] = useState<string>('');
    const [deadline, setDeadline] = useState<string>('');
    const [data, setData] = useState<string>('');
    const [isClient, setIsClient] = useState(false);
    const [messageApi, contextHolder] = message.useMessage();

    const [recipient, setRecipient] = useState<string>('');
    const [amount, setAmount] = useState<string>('');
    const [transferFilled, setTransferFilled] = useState<boolean>();

    const [selectedToken, setSelectedToken] = useState<string>("");

    const handleChange = (value: string) => {
        console.log(value);
        setSelectedToken(value);
    };

    const fillTransferData = () => {

        if (!ethers.utils.isAddress(recipient)) {
            messageApi.destroy();
            messageApi.open({
                type: 'error',
                content: 'Invalid token transfer recipient provided.',
            });
            return;
        }

        if (amount === null || amount.match(/^ *$/) !== null) {
            messageApi.destroy();
            messageApi.open({
                type: 'error',
                content: 'Token transfer amount not specified.',
            });
            return;
        }

        getERC20TransferCalldata();
        setAmount("");
        setTransferFilled(true);
    }

    const unfillTransferData = () => {

        if (!transferFilled) {
            messageApi.destroy();
            messageApi.open({
                type: 'error',
                content: 'Transfer data not filled.',
            });
            return;
        }

        setTo("");
        setData("");
        setTransferFilled(false);
    }

    const getERC20TransferCalldata = () => {

        // ERC20 transfer function signature
        const transferFunctionSignature = 'transfer(address,uint256)';

        // Create the interface for the ERC20 transfer function
        const iface = new ethers.utils.Interface([`function ${transferFunctionSignature}`]);

        // Encode the function call with the provided parameters
        const calldata = iface.encodeFunctionData('transfer', [recipient, amount]);

        setData(calldata);
        setTo(TOKEN_METADATA[selectedToken].address);
        setValue("0");

        return calldata;
    }

    const { data: txData, isLoading: isConfirming, isSuccess: isConfirmed } =
        useWaitForTransactionReceipt({
            hash,
        });

    useEffect(() => {
        if (error) {
            messageApi.destroy();
            messageApi.open({
                type: 'error',
                content: 'Transaction error. Please try again later.',
            });
        }

        console.log(isConfirming);
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
                content: <p>Transaction created. <Link href={`/wallet/${params.address}/pending-txs`}>Go To Transactions Page</Link></p>,
                duration: 0
            });
        }

    }, [error, isPending, isConfirmed]);

    useEffect(() => {
        setIsClient(true)
    }, [])

    async function submit() {

        console.log(deadline);

        var someDate = new Date(deadline);
        const epochDeadline = someDate.getTime();

        const date = new Date();
        console.log(date);

        if (!ethers.utils.isAddress(to)) {
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

        if (value === null || value.match(/^ *$/) !== null) {
            messageApi.destroy();
            messageApi.open({
                type: 'error',
                content: 'ETH value not specified.',
            });
            return;
        }

        writeContract({
            address: params.address,
            abi: ABIS["submitTransaction"],
            functionName: "submitTransaction",
            args: [to as string, value, epochDeadline, data as string],
        })
    }

    return (
        <main className="text-center mx-auto w-1/2">
            {contextHolder}
            <h1 className='text-center text-2xl'>Create Transaction</h1>
            {isClient && account.address ? <Space className="w-1/2" direction="vertical">
                <Input
                    placeholder="To"
                    autoComplete="off"
                    name="to"
                    value={to}
                    onChange={(e) => setTo(e.target.value)}
                    allowClear
                    disabled={transferFilled}
                />
                <Input
                    placeholder="Value (in ETH)"
                    autoComplete="off"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    allowClear
                    disabled={transferFilled}
                />
                <DatePicker
                    name="deadline"
                    value={deadline}
                    onChange={(e) => setDeadline(e)}
                    placeholder="Expiry date"
                    allowClear
                    className="w-full"
                />
                <Input
                    placeholder="Data"
                    autoComplete="off"
                    name="data"
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    allowClear
                    disabled={transferFilled}
                />

                <Button
                    disabled={isPending}
                    type="primary"
                    onClick={submit}
                    className="mt-5"
                >
                    Create Transaction
                </Button>

                <Divider />

                <h1 className='text-center text-xl'>Prefill Form Data for Crypto Transfer</h1>

                <Select
                    placeholder="Select a crypto token"
                    onChange={handleChange}
                >
                    {TOKEN_LIST.map((name) => {
                        const token = TOKEN_METADATA[name]

                        return (
                            <Option key={token.ticker} value={token.ticker}>
                                <Image
                                    src={token.logo}
                                    alt={token.ticker}
                                    style={{ width: '20px', marginRight: '8px' }}
                                />
                                {token.ticker}
                            </Option>
                        )
                    })}
                </Select>

                <Input
                    placeholder="Recipient"
                    autoComplete="off"
                    name="data"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    allowClear
                />
                <Input
                    placeholder="Amount"
                    autoComplete="off"
                    name="data"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    allowClear
                />

                <div className="flex mx-auto">
                    <Button
                        type="primary"
                        onClick={fillTransferData}
                        className="mt-5 mx-auto"
                    >
                        Prefill Form Data
                    </Button>

                    <Button
                        type="primary"
                        onClick={unfillTransferData}
                        className="mt-5 mx-auto"
                    >
                        Unfill Form Data
                    </Button>
                </div>



            </Space> : isClient ? <p className="text-center">Please connect your wallet to continue.</p> : <div className="mx-auto w-1/2 text-center mt-10"><Spin tip="Loading" size="large"><></></Spin></div>}
        </main>

    );
}