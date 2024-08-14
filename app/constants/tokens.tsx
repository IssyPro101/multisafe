import { StaticImageData } from "next/image";
import usdcLogo from '../../app/media/usdc.png';
import usdtLogo from '../../app/media/usdt.png';
import bitcoinLogo from '../../app/media/btc.png';
import ethLogo from '../../app/media/eth.png';
import { Bitcoin } from "@/components/icons/bitcoin";
import { Usdc } from "@/components/icons/usdc";
import { Tether } from "@/components/icons/tether";
import { Ethereum } from "@/components/icons/ethereum";

type Price = {
  name: number;
  value: number;
};

type LivePriceFeedProps = {
  id: string;
  name: string;
  symbol: string;
  icon: React.ReactElement;
  price: number;
  change: string;
  isChangePositive: boolean;
  isBorder?: boolean;
  prices: Price[];
};


const TOKEN_METADATA: {
  [contractName: string]: { ticker: string, logo: StaticImageData, address: string };
} = {
  'USDC': { ticker: 'USDC', logo: usdcLogo, address: '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512' },
  'USDT': { ticker: 'USDT', logo: usdtLogo, address: '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0' },
  'BTC': { ticker: 'BTC', logo: bitcoinLogo, address: '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9' },
  'ETH': { ticker: 'ETH', logo: ethLogo, address: '0xdc64a140aa3e981100a9beca4e685f962f0cf6c9' },
};

const TOKEN_ADDRESS_TO_NAME: {
  [name: string]: string;
} = {
  '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512': 'USDC',
  '0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0': 'USDT',
  '0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9': 'BTC',
  '0xdc64a140aa3e981100a9beca4e685f962f0cf6c9': 'ETH'
};


const TOKEN_LIST: string[] = ["USDC", "USDT", "BTC", "ETH"];

const TOKEN_PRICE_DATA_LIST: LivePriceFeedProps[] = [

  {
    id: '0',
    name: 'USD-Coin',
    symbol: 'USDC',
    price: 1,
    change: '+0.5%',
    isChangePositive: true,
    icon: <Usdc />,
    prices: [
      { name: 1, value: 18877.4 },
      { name: 2, value: 18277.4 },
      { name: 3, value: 18577.4 },
      { name: 4, value: 18577.4 },
      { name: 5, value: 18977.4 },
      { name: 6, value: 18577.4 },
      { name: 7, value: 18777.4 },
      { name: 8, value: 18477.4 },
      { name: 9, value: 18677.4 },
    ],
  },
  {
    id: '1',
    name: 'Tether',
    symbol: 'USDT',
    price: 1,
    change: '+0.23%',
    isChangePositive: true,
    icon: <Tether />,
    prices: [
      { name: 1, value: 18377.4 },
      { name: 2, value: 18677.4 },
      { name: 3, value: 18377.4 },
      { name: 4, value: 18977.4 },
      { name: 5, value: 18677.4 },
      { name: 6, value: 18537.4 },
      { name: 7, value: 18577.4 },
      { name: 8, value: 18597.4 },
      { name: 9, value: 18517.4 },
    ],
  },
  {
    id: '2',
    name: 'Bitcoin',
    symbol: 'BTC',
    price: 50000,
    change: '+12.5%',
    isChangePositive: true,
    icon: <Bitcoin />,
    prices: [
      { name: 1, value: 15187.44 },
      { name: 2, value: 21356.99 },
      { name: 3, value: 34698.98 },
      { name: 4, value: 37587.55 },
      { name: 5, value: 17577.4 },
      { name: 6, value: 26577.4 },
      { name: 7, value: 23577.4 },
      { name: 8, value: 18577.4 },
      { name: 9, value: 28577.4 },
    ],
  },
  {
    id: '3',
    name: 'Ethereum',
    symbol: 'ETH',
    price: 50000,
    change: '+12.5%',
    isChangePositive: true,
    icon: <Ethereum />,
    prices: [
      { name: 1, value: 15187.44 },
      { name: 2, value: 21356.99 },
      { name: 3, value: 34698.98 },
      { name: 4, value: 37587.55 },
      { name: 5, value: 17577.4 },
      { name: 6, value: 26577.4 },
      { name: 7, value: 23577.4 },
      { name: 8, value: 18577.4 },
      { name: 9, value: 28577.4 },
    ],
  }
];

export { TOKEN_METADATA, TOKEN_LIST, TOKEN_ADDRESS_TO_NAME, TOKEN_PRICE_DATA_LIST };