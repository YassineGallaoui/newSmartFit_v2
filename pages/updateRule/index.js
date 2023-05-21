import React, { } from "react";
import styles from '../../styles/Athlete.module.scss'
import Head from "next/head";
import AddRuleForm from "components/AddRuleForm";
import EditRuleForm from "components/EditRuleForm";

const AddRules = () => {

    return (
        <div className={styles.container}>
            <Head>
                <title>Update Rule</title>
                <meta name="description" content="Update an already existing rule" />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className={styles.main}>
                <EditRuleForm></EditRuleForm>
            </main>
        </div>
    );
};

export default AddRules;
