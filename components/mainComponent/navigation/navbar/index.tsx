
'use client'

import { ConnectKitButton } from "connectkit";
import styles from "./Navbar.module.css";
import Link from "next/link";
import { Button } from "antd";
import { LeftOutlined } from '@ant-design/icons';
import { usePathname, useRouter } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const navigateBack = () => {
    router.back();
  }

  return (
    <nav className={styles.navbar}>
      <div className="flex">
        {pathname !== "/" && <Button
          type="primary"
          shape="circle"
          icon={<LeftOutlined />}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={navigateBack}
        />}
        <Link href="/" className="ml-4">
          <p className="text-white text-lg font-bold">MultiSafe</p>
        </Link>
      </div>

      <div className="flex">
        <Link href="/my-wallets">
          <button className={styles.walletButton}>My Wallets</button>
        </Link>
        <ConnectKitButton />
      </div>

    </nav>
  );
}