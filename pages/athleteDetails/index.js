import React, { useEffect, useState } from "react";
import Link from "next/link";
import RulesList from "components/RulesList";
import axiosInstance from "../axiosInstance";
import { collapsibleDivs } from "../../utils";
import AthleteDetail from "components/AthleteDetail";
import { useRouter } from "next/router";
import athlet from "backend/models/athlet.model";
import styles from '../../styles/Athlete.module.scss'
import Head from "next/head";

const Rules = () => {
  const [currentAthlete, setCurrentAthlete] = useState(null);
  const [currentRules, setCurrentRules] = useState(null);

  const router = useRouter();
  const { athleteId } = router.query;

  useEffect(() => {
    if (athleteId != null) {
      axiosInstance
        .get("/athletes/" + athleteId)
        .then((response) => {
          setCurrentAthlete({
            id: response.data._id,
            name: response.data.name,
            weight: response.data.weight,
            height: response.data.height,
            dob: response.data.dob,
            activity: response.data.activity,
            activityToPass: response.data.activity,
            mfp: response.data.mfp,
            mfpToPass: response.data.mfp,
            body: response.data.body,
            bodyToPass: response.data.body,
            sleep: response.data.sleep,
            sleepToPass: response.data.sleep,
            mood: response.data.mood,
            moodToPass: response.data.mood,
          });
          collapsibleDivs();
        })
        .catch(function (error) {
          console.log(error);
        });

      axiosInstance
        .get("/rules/")
        .then((response) => {
          setCurrentRules({rules: response.data });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [athleteId]);
  return (
    <div className={styles.container}>
      <Head>
        <title>Athlete details</title>
        <meta name="description" content="Athlete details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        {currentAthlete != null && currentRules != null && athleteId != null && (
          <AthleteDetail
            athleteId={athleteId}
            currentAthlete={currentAthlete}
            setCurrentAthlete={setCurrentAthlete}
            currentRules={currentRules}
            setCurrentRules={setCurrentRules}
          ></AthleteDetail>
        )}
      </main>
    </div>
  );
};

export default Rules;
