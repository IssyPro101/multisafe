import * as React from 'react'
import { useState, useEffect } from 'react'
import { create } from 'ipfs-http-client';
import {
    type BaseError,
    useWaitForTransactionReceipt,
    useWriteContract
} from 'wagmi'
import { CONTRACT_ADDRESSES } from '@/app/constants/contract'
import { ABIS } from '@/app/constants/abis'
import { Button, message, Space, Input, Upload, Spin, Image, Tooltip } from 'antd';
import { UploadOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { ethers } from 'ethers'
import { useAccount } from 'wagmi'
import { useStorageUpload } from '@thirdweb-dev/react';
import Link from 'next/link';

function hasDuplicateAddresses(arr: string[]): boolean {
    const uniqueStrings = new Set<string>();

    for (const str of arr) {
        if (uniqueStrings.has(str.toLowerCase())) {
            return true;
        }
        uniqueStrings.add(str.toLowerCase());
    }
    return false;
}

function areAllValidEthereumAddresses(addresses: string[]): boolean {
    for (const address of addresses) {
        if (!ethers.utils.isAddress(address)) {
            return false;
        }
    }
    return true;
}

export function CreateWallet() {

    const [isClient, setIsClient] = useState(false);

    const { mutateAsync: upload } = useStorageUpload();

    const [messageApi, contextHolder] = message.useMessage();
    const account = useAccount();


    useEffect(() => {
        setIsClient(true)
    }, [])

    const {
        data: hash,
        error,
        isLoading: isPending,
        writeContract
    } = useWriteContract();


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
                content: <p>Wallet created. <Link href={`/wallet/${ethers.utils.defaultAbiCoder.decode(['address'], txData.logs[0].topics[2] as string)}`}>View New Wallet</Link></p>,
                duration: 0
            });
        }

    }, [error, isPending, isConfirmed]);

    const [walletAddresses, setWalletAddresses] = useState<Array<`0x${string}` | undefined | "">>([account.address as `0x${string}`]);
    const [walletName, setWalletName] = useState<string>('');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const addWalletAddress = () => {
        setWalletAddresses([...walletAddresses, '']);
    };

    const removeWalletAddress = (index: number) => {
        if (walletAddresses.length === 1) {
            messageApi.destroy();
            messageApi.open({
                type: 'error',
                content: 'You need to have at least 1 wallet owner.',
            });
            return;
        }

        const newWalletAddresses = walletAddresses.filter((_, i) => i !== index);
        setWalletAddresses(newWalletAddresses);
    };

    const handleInputChange = (index: number, value: string) => {
        const newWalletAddresses = [...walletAddresses];
        newWalletAddresses[index] = value as `0x${string}`;
        setWalletAddresses(newWalletAddresses);
    };

    const handleImageChange = (file: File) => {
        setProfileImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const uploadImageToIPFS = async (file: File) => {
        try {
            const uris = await upload({ data: [file] });
            return uris[0];
        } catch (error) {
            console.error('Error uploading file to IPFS: ', error);
            throw new Error('Failed to upload image to IPFS');
        }
    };

    async function submit() {
        messageApi.open({
            type: 'loading',
            content: 'Processing form data...',
            duration: 0
        });

        if (walletAddresses.includes("")) {
            messageApi.destroy();
            messageApi.open({
                type: 'error',
                content: 'Empty ethereum addresses provided.',
            });
            return;
        }

        if (!areAllValidEthereumAddresses(walletAddresses as string[])) {
            messageApi.destroy();
            messageApi.open({
                type: 'error',
                content: 'Invalid Ethereum addresses provided.',
            });
            return;
        }

        if (hasDuplicateAddresses(walletAddresses as string[])) {
            messageApi.destroy();
            messageApi.open({
                type: 'error',
                content: 'Duplicate addresses provided.',
            });
            return;
        }

        if (walletName === null || walletName.match(/^ *$/) !== null) {
            messageApi.destroy();
            messageApi.open({
                type: 'error',
                content: 'Please provide a wallet name.',
            });
            return;
        }

        let profileImageUrl: string = '';

        if (profileImage) {
            messageApi.destroy();
            messageApi.open({
                type: 'loading',
                content: 'Uploading profile image to IPFS...',
                duration: 0
            });
            try {
                profileImageUrl = await uploadImageToIPFS(profileImage);
            } catch (error) {
                messageApi.destroy();
                messageApi.open({
                    type: 'error',
                    content: 'Failed to upload profile image to IPFS.',
                });
                return;
            }
        }

        messageApi.destroy();
        messageApi.open({
            type: 'loading',
            content: 'Creating wallet. Please confirm...',
            duration: 0
        });

        writeContract({
            address: CONTRACT_ADDRESSES["MultiSafeFactory"],
            abi: ABIS["deployMultiSafeWallet"],
            functionName: "deployMultiSafeWallet",
            args: [walletAddresses as string[], walletAddresses.length, walletName, profileImageUrl],
        });


    }


    return (
        <main className='text-center mx-auto w-1/2'>
            {contextHolder}

            <div className="flex justify-center">
                <h1 className='text-center text-2xl'>Create New Wallet</h1>
                <Tooltip title="Here you can create a new multisig wallet with custom owners by clicking the 'Add Owner' button. You can remove an owner by clicking the 'Remove' button next to a specific owner." className='ml-2 mb-10'>
                    <QuestionCircleOutlined />
                </Tooltip>
            </div>


            {isClient && account.address ? <Space className="w-1/2" direction="vertical">

                {imagePreview &&
                    <Image src={imagePreview} alt="Profile Preview"
                        width={100}
                        height={100}
                        className="mx-auto"
                        style={{
                            borderRadius: '50%',
                            objectFit: 'cover'
                        }} />
                }
                <Upload
                    beforeUpload={(file) => {
                        handleImageChange(file);
                        return false;
                    }}
                    showUploadList={false}
                >
                    <Button icon={<UploadOutlined />}>Select Wallet Profile Image</Button>
                </Upload>
                {profileImage && <span className="ml-2">{profileImage.name}</span>}



                <Input
                    className="mt-2"
                    placeholder="Wallet Name"
                    autoComplete="off"
                    value={walletName}
                    onChange={(e) => setWalletName(e.target.value)}
                    allowClear
                />

                {walletAddresses.map((item, index) => {
                    return (
                        <div className="flex mt-2" key={index}>
                            <Input
                                className=""
                                placeholder="Owner address"
                                autoComplete="off"
                                value={item}

                                onChange={(e) => handleInputChange(index, e.target.value)}
                                allowClear
                            />
                            <Button
                                onClick={() => removeWalletAddress(index)} className='ml-2' danger>
                                Remove
                            </Button>
                        </div>
                    )
                })}
                <div className="mt-5">
                    <Button onClick={addWalletAddress} className='bg-blue-500 hover:bg-blue-700 font-bold text-white py-2 px-4 rounded mx-auto mr-2'>
                        Add Owner
                    </Button>
                    <Button
                        disabled={isPending}
                        type="primary"
                        onClick={submit}
                    >
                        Create Wallet
                    </Button>
                </div>
            </Space> : isClient ? <p className="text-center">Please connect your wallet to continue.</p> : <div className="mx-auto w-1/2 text-center mt-10"><Spin tip="Loading" size="large"><></></Spin></div>}
        </main>
    )

}
