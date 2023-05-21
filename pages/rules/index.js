import React, { useEffect, useState } from "react";
import Link from "next/link";
import RulesList from "components/RulesList";
import axiosInstance from '../axiosInstance';
import { collapsibleDivs } from "../../utils";
import styles from '../../styles/Rules.module.scss'
import Head from "next/head";

const Rules = () => {
  const [athletes, setAthletes] = useState(null);
  const [rules, setRules] = useState(null);

  useEffect(() => {
    axiosInstance
      .get("/rules")
      .then((response) => {
        setRules(response.data);
        collapsibleDivs();
      })
      .catch((error) => {
        console.log(error);
      });

    axiosInstance
      .get("/athletes")
      .then((response) => {
        setAthletes(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Your Rules</title>
        <meta name="description" content="Your Rules" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {athletes != null && rules != null && (
        <RulesList
          athletes={athletes}
          rules={rules}
          athletessetAthletes={setAthletes}
          setRules={setRules}
        />
      )}
    </div>
  );
};

export default Rules;
