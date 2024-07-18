const ABIS: {
    [functionName: string]: any;
} = {
    "userWallets": [{
        name: "userWallets",
        type: "function",
        stateMutability: "view",
        inputs: [{ "name": "", "type": "address", "internalType": "address" }, { "name": "", "type": "uint256", "internalType": "uint256" }],
        outputs: [{ "name": "", "type": "address", "internalType": "address" }]
    }],
    "getNumUserWallets": [{
        name: "getNumUserWallets",
        type: "function",
        stateMutability: "view",
        inputs: [{ "name": "", "type": "address", "internalType": "address" }],
        outputs: [{ "name": "", "type": "uint256", "internalType": "uint256" }]
    }],
    "deployMultiSafeWallet": [{
        name: "deployMultiSafeWallet",
        type: "function",
        stateMutability: "nonpayable",
        inputs: [{ internalType: "address[]", name: "_owners", type: "address[]" }, { internalType: "uint256", name: "_numConfirmationsRequired", type: "uint256" }, { internalType: "string", name: "_name", type: "string" }, { internalType: "string", name: "_image", type: "string" }],
        outputs: [{ internalType: "address", type: "address" }],
    }],
    "submitTransaction": [{
        name: "submitTransaction", 
        type: "function",
        inputs: [{ "name": "_to", "type": "address", "internalType": "address" }, { "name": "_value", "type": "uint256", "internalType": "uint256" }, { "name": "_deadline", "type": "uint256", "internalType": "uint256" }, { "name": "_data", "type": "bytes", "internalType": "bytes" }], 
        outputs: [{ "name": "", "type": "uint256", "internalType": "uint256" }], "stateMutability": "nonpayable"
    }],
    "getTransactionCount": [{
        name:"getTransactionCount",
        type:"function",
        inputs:[],
        outputs:[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"
    }],
    "getTransactionAtIndex": [{
        name:"getTransactionAtIndex",
        type:"function",
        inputs:[{"name":"_transactionIndex","type":"uint256","internalType":"uint256"}],
        outputs:[{"name":"to","type":"address","internalType":"address"},{"name":"value","type":"uint256","internalType":"uint256"},{"name":"deadline","type":"uint256","internalType":"uint256"},{"name":"data","type":"bytes","internalType":"bytes"},{"name":"executed","type":"bool","internalType":"bool"},{"name":"numConfirmations","type":"uint256","internalType":"uint256"}],"stateMutability":"view"
    }],
    "getOwnersLength": [{
        name:"getOwnersLength",
        type:"function",
        inputs:[],
        outputs:[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"
    }],
    "image": [{"type":"function","name":"image","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"}],
    "name": [{"type":"function","name":"name","inputs":[],"outputs":[{"name":"","type":"string","internalType":"string"}],"stateMutability":"view"}]
};

export { ABIS };