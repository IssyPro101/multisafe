import { Image } from 'antd';
import { blo } from "blo";

export function AddressIcon({ address }: { address: `0x${string}` }) {
    return (
      <Image
        alt={address}
        src={blo(address)}
        style={{
          width: '100px',
          height: '100px',
          borderRadius: '50%',
          objectFit: 'cover',
          marginRight: "10px"
        }}
      />
    );
  }
  