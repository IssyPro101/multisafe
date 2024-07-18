import { StaticImageData } from "next/image";
import usdcLogo from '../../app/media/usdc.png';
import usdtLogo from '../../app/media/usdt.png';
import bitcoinLogo from '../../app/media/btc.png';

const TOKEN_METADATA: {
    [contractName: string]: { ticker: string, logo: StaticImageData, address: `0x${string}` };
} = {
    'USDC': { ticker: 'USDC', logo: usdcLogo, address: '0x94a9d9ac8a22534e3faca9f4e7f2e2cf85d5e4c8' },
    'USDT': { ticker: 'USDT', logo: usdtLogo, address: '0x88A01D90459CEB056C7581F6DC1D45F85c10690D' },
    'BTC': { ticker: 'BTC', logo: bitcoinLogo, address: '0xa16E02E87b7454126E5E10d957A927A7F5B5d2be' },
};

const TOKEN_LIST: string[] = ["USDC", "USDT", "BTC"];

export { TOKEN_METADATA, TOKEN_LIST };