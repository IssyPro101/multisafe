import Link from 'next/link'
import { Button, Spin } from 'antd';
import { useAccount } from 'wagmi';
import { useState, useEffect } from 'react';
export default function MainComponent() {

  const [isClient, setIsClient] = useState(false)
  const account = useAccount()

  useEffect(() => {
    setIsClient(true)
  }, [])

  return (
    <div className="mx-auto w-1/2 text-center">
      {isClient && account.address ? <><div className="mx-auto w-1/2">
        <h1 className='text-2xl'>
          MultiSafe
        </h1>
        <h3>The most secure wallet in crypto.</h3>
      </div>

        <div className="mx-auto mt-5">
          <Link href="/my-wallets">
            <Button type="primary">
              My Wallets
            </Button>
          </Link>
        </div></> : isClient ? <p className="text-center">Please connect your wallet to continue.</p> : <div className="mx-auto w-1/2 text-center mt-10"><Spin tip="Loading" size="large"><></></Spin></div>}
    </div>
  );
}
