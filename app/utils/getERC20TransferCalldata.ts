import { ethers } from 'ethers';

export const getERC20TransferCalldata = (recipient: string, amount: string) => {

    // ERC20 transfer function signature
    const transferFunctionSignature = 'transfer(address,uint256)';

    // Create the interface for the ERC20 transfer function
    const iface = new ethers.utils.Interface([`function ${transferFunctionSignature}`]);

    // Encode the function call with the provided parameters
    const calldata = iface.encodeFunctionData('transfer', [recipient, amount]);

    return calldata;
}