
'use client'

import { ConnectKitButton } from "connectkit";
import styles from "./Navbar.module.css";
export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <a href="/">
        <p className="text-white text-lg font-bold" >MultiSafe</p>
      </a>
      <ConnectKitButton />
    </nav>
  );
}