
'use client'

import { ConnectKitButton } from "connectkit";
import styles from "./Navbar.module.css";
import Link from "next/link";

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/">
        <p className="text-white text-lg font-bold" >MultiSafe</p>
      </Link>

      <ConnectKitButton />
    </nav>
  );
}