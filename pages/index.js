
import AthleteList from 'components/AthleteList'
import Head from '../node_modules/next/head'
import styles from '../styles/Home.module.scss'
import React, { useEffect, useState } from 'react'
import axiosInstance from './axiosInstance'

export default function Home() {

  const [athletes, setAthletes] = useState(null);

  useEffect(() => {
    axiosInstance.get('/athletes/')
      .then(response => {
        setAthletes(response.data)
      })
      .catch((error) => {
        console.log(error);
      })
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Athletes List</title>
        <meta name="description" content="Athletes List" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <AthleteList athletes={athletes}></AthleteList>
      </main>
    </div>
  )
}
