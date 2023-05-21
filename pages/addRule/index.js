import React, {  } from "react";
import styles from '../../styles/Athlete.module.scss'
import Head from "next/head";
import AddRuleForm from "components/AddRuleForm";

const AddRules = () => {
    
    return (
        <div className={styles.container}>
            <Head>
                <title>Add Rule</title>
                <meta name="description" content="Add a new rule" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <AddRuleForm></AddRuleForm>
            </main>
        </div>
    );
};

export default AddRules;
