import React from "react";
import Link from "../../node_modules/next/link";
import Image from 'next/image';
import styles from "./Header.module.scss"


const Header = () => {
  return (
    <div className={styles.container}>
      <Link href="/">
        <Image src={'/img/logo.png'} alt={"header image"} fill />
      </Link>
    </div>
  );
};

export default Header;
