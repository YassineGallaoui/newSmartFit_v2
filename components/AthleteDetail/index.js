import React, { Component, useEffect, useState } from 'react'
import axios from 'axios'
import Emoji from 'a11y-react-emoji'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css' // Import the CSS file for styling
import { collapsibleDivs } from 'utils'
import Link from 'next/link'
import ChartCustom from 'components/ChartCustom'

const DataRow = props => (
    <th className="tabellaMoodDate py-4">
        <span className="tabellaMoodDateText">
            {props.mood.Data}
        </span>
    </th>
)


const MoodRow = props => (
    <td className="tabellaMoodDate2">
        {props.onSetEmoticon(props.mood.Mood)}
    </td>
)

let currentYear = new Date().getFullYear(), years = [];
let startYear = 2000;
while (startYear <= currentYear) {
    years.push(startYear++);
}
let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
];


const AthleteDetail = (props) => {

    const showMyRulesPartOne = () => {
        let firstTime = true;
        return props.currentRules.rules.map(currentRule => {
            let arr = [...currentRule.athletesId]
            for (let i = 0; i < arr.length; i++) {
                if (arr[i] === props.athleteId) {
                    let containerTarget = document.getElementById("textMyAthleteRules");
                    if (firstTime === true && containerTarget != null)
                        containerTarget.innerHTML = props.currentAthlete.name + " has got the following rules:"
                    firstTime = false;
                    return <div className="card my-3 card-body" key={currentRule._id}>
                        <mark className="h6">
                            <Link href={"/rules/update/" + currentRule._id}>
                                &gt; {currentRule.name}
                            </Link>
                        </mark>
                        <div>
                            <label>Conditions</label>
                            <ul>
                                {
                                    currentRule.conditions.map((currentCondition, index) => {
                                        return <li key={index}><b>{currentCondition.link + " "}</b>{currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}</li>;
                                    })
                                }
                            </ul>
                            <label>Temporal Conditions</label>
                            <ul>
                                {
                                    currentRule.temporalConditions.map((currentTemporalCondition, index) => {
                                        return <li key={index}><b>{currentTemporalCondition.temporalLink}</b>{` "` + currentTemporalCondition.temporalItem + `" `}<b>{currentTemporalCondition.temporalOperator}</b>{` "` + currentTemporalCondition.temporalValue1 + `" ` + (currentTemporalCondition.temporalValue2 === "" ? "" : (`and "` + currentTemporalCondition.temporalValue2 + `"`))}</li>;
                                    })
                                }
                            </ul>
                            <label>Message</label><br />
                            <span>
                                {currentRule.message}
                            </span>
                        </div>
                    </div>;
                }
            }
            if (firstTime === true) {
                let containerTarget = document.getElementById("textMyAthleteRules");
                if(containerTarget != null)
                    containerTarget.innerHTML = props.currentAthlete.name + " has got no rules."
            }
        })
    }

    const showMyRulesPartTwo = () => {
        return props.currentRules.rules.map(currentRule => {
            let firstTime = true;
            let arr2 = [...currentRule.suggestedAthletesId];
            arr2 = (arr2.filter(el => currentRule.athletesId.indexOf(el.substring(el.indexOf("~ ") + 2)) === -1))
            for (let i = 0; i < arr2.length; i++) {
                if (arr2[i].substring(arr2[i].indexOf("~ ") + 2) === props.athleteId) {
                    let containerTarget = document.getElementById("textMySuggestedAthleteRules")
                    if (firstTime === true && containerTarget != null) {
                        containerTarget.innerHTML = "Think about adding the following rules to " + props.currentAthlete.name + ":"
                    }
                    firstTime = false;
                    return <div className="card my-3 card-body" key={currentRule._id}>

                        <mark className="h6">
                            <Link href={"/rules/update/" + currentRule._id}>
                                &gt; {currentRule.name}
                            </Link>
                        </mark>
                        <div>
                            <label>Conditions</label>
                            <ul>
                                {
                                    currentRule.conditions.map((currentCondition, index) => {
                                        return <li key={index}><b>{currentCondition.link + " "}</b>{currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}</li>;
                                    })
                                }
                            </ul>
                            <label>Temporal Conditions</label>
                            <ul>
                                {
                                    currentRule.temporalConditions.map((currentTemporalCondition, index) => {
                                        return <li key={index}><b>{currentTemporalCondition.temporalLink}</b>{` "` + currentTemporalCondition.temporalItem + `" `}<b>{currentTemporalCondition.temporalOperator}</b>{` "` + currentTemporalCondition.temporalValue1 + `" ` + (currentTemporalCondition.temporalValue2 === "" ? "" : (`and "` + currentTemporalCondition.temporalValue2 + `"`))}</li>;
                                    })
                                }
                            </ul>
                            <label>Message</label><br />
                            <span>
                                {currentRule.message}
                            </span>
                        </div>
                    </div>;
                }
            }
            if (firstTime === true){
                let containerTarget = document.getElementById("textMySuggestedAthleteRules")
                if(containerTarget != null){
                    containerTarget.innerHTML = "No suggested rules for " + props.currentAthlete.name
                }
            }

        })
    }

    const onChangeStartDate = (date) => {
        props.currentAthlete.activityToPass = [...props.currentAthlete.activity];
        props.currentAthlete.mfpToPass = [...props.currentAthlete.mfp];
        props.currentAthlete.bodyToPass = [...props.currentAthlete.body];
        props.currentAthlete.sleepToPass = [...props.currentAthlete.sleep];
        let arrInfo = [];
        for (let j = 0; j < 4; j++) {
            switch (j) {
                case 0: arrInfo = props.currentAthlete.activityToPass; break;
                case 1: arrInfo = props.currentAthlete.mfpToPass; break;
                case 2: arrInfo = props.currentAthlete.bodyToPass; break;
                case 3: arrInfo = props.currentAthlete.sleepToPass; break;
            }
            if (arrInfo.length > 0) {
                for (let i = 0; i < arrInfo.length; i++) {
                    let parts = arrInfo[i].Data.split("/")
                    let dateInfo = parts[2] + "-" + parts[1] + "-" + parts[0];
                    if (date != null && Date.parse(dateInfo) < Date.parse(date.toLocaleDateString('ko-KR'))) {
                        arrInfo.splice(i, 1);
                        i--
                    }
                    dateInfo = new Date(dateInfo) + '';
                    if (props.currentAthlete.endDate != null && Date.parse(dateInfo) > Date.parse(props.currentAthlete.endDate.toLocaleDateString('ko-KR'))) {
                        arrInfo.splice(i, 1);
                        i--
                    }
                }
            }
            switch (j) {
                case 0: props.setCurrentState({ activityToPass: arrInfo }); break;
                case 1: props.setCurrentState({ mfpToPass: arrInfo }); break;
                case 2: props.setCurrentState({ bodyToPass: arrInfo }); break;
                case 3: props.setCurrentState({ sleepToPass: arrInfo }); break;
            }
        }
        props.setCurrentState({
            startDate: date
        })
    }

    const onChangeEndDate = (date) => {
        props.currentAthlete.activityToPass = [...props.currentAthlete.activity];
        props.currentAthlete.mfpToPass = [...props.currentAthlete.mfp];
        props.currentAthlete.bodyToPass = [...props.currentAthlete.body];
        props.currentAthlete.sleepToPass = [...props.currentAthlete.sleep];
        let arrInfo = [];
        for (let j = 0; j < 4; j++) {
            switch (j) {
                case 0: arrInfo = props.currentAthlete.activityToPass; break;
                case 1: arrInfo = props.currentAthlete.mfpToPass; break;
                case 2: arrInfo = props.currentAthlete.bodyToPass; break;
                case 3: arrInfo = props.currentAthlete.sleepToPass; break;
            }
            if (arrInfo.length > 0) {
                for (let i = 0; i < arrInfo.length; i++) {
                    let parts = arrInfo[i].Data.split("/")
                    let dateInfo = parts[2] + "-" + parts[1] + "-" + parts[0];
                    dateInfo = new Date(dateInfo + "T00:00:00") + '';
                    if (date != null && Date.parse(dateInfo) > Date.parse(date.toLocaleDateString('ko-KR'))) {
                        arrInfo.splice(i, 1);
                        i--
                    }
                    if (props.currentAthlete.startDate != null && Date.parse(dateInfo) < Date.parse(props.currentAthlete.startDate.toLocaleDateString('ko-KR'))) {
                        arrInfo.splice(i, 1);
                        i--
                    }
                }
            }
            switch (j) {
                case 0: props.setCurrentState({ activityToPass: arrInfo }); break;
                case 1: props.setCurrentState({ mfpToPass: arrInfo }); break;
                case 2: props.setCurrentState({ bodyToPass: arrInfo }); break;
                case 3: props.setCurrentState({ sleepToPass: arrInfo }); break;
            }
        }
        props.setCurrentState({
            endDate: date
        })
    }

    const setDate = () => {
        if (props.currentAthlete.startDate === null && props.currentAthlete.endDate === null) {
            return props.currentAthlete.mood.map(currentmood => {
                return <DataRow mood={currentmood} key={currentmood.Data}></DataRow>;
            })
        }
        if (props.currentAthlete.startDate != null && props.currentAthlete.endDate === null) {
            return props.currentAthlete.mood.map(currentmood => {
                let parts = currentmood.Data.split("/")
                let correctDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                if (Date.parse(correctDate) >= Date.parse(props.currentAthlete.startDate.toLocaleDateString('ko-KR'))) {
                    return <DataRow mood={currentmood} key={currentmood.Data}></DataRow>;
                }
            })
        }
        if (props.currentAthlete.startDate === null && props.currentAthlete.endDate != null) {
            return props.currentAthlete.mood.map(currentmood => {
                let parts = currentmood.Data.split("/")
                let correctDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                correctDate = new Date(correctDate + "T00:00:00") + '';
                if (Date.parse(correctDate) <= Date.parse(props.currentAthlete.endDate.toLocaleDateString('ko-KR'))) {
                    return <DataRow mood={currentmood} key={currentmood.Data}></DataRow>;
                }
            })
        }
        if (props.currentAthlete.startDate != null && props.currentAthlete.endDate != null) {
            return props.currentAthlete.mood.map(currentmood => {
                let parts = currentmood.Data.split("/")
                let correctDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                correctDate = new Date(correctDate + "T00:00:00") + '';
                if (Date.parse(correctDate) >= Date.parse(props.currentAthlete.startDate.toLocaleDateString('ko-KR')) && Date.parse(correctDate) <= Date.parse(props.currentAthlete.endDate.toLocaleDateString('ko-KR'))) {
                    return <DataRow mood={currentmood} key={currentmood.Data}></DataRow>;
                }
            })
        }
    }

    const setMood = () => {
        if (props.currentAthlete.startDate === null && props.currentAthlete.endDate === null) {
            return props.currentAthlete.mood.map(currentmood => {
                return <MoodRow mood={currentmood} onSetEmoticon={setEmoticon} key={currentmood.Data}></MoodRow>;
            })
        }
        if (props.currentAthlete.startDate != null && props.currentAthlete.endDate === null) {
            return props.currentAthlete.mood.map(currentmood => {
                let parts = currentmood.Data.split("/")
                let correctDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                if (Date.parse(correctDate) >= Date.parse(props.currentAthlete.startDate.toLocaleDateString('ko-KR'))) {
                    return <MoodRow mood={currentmood} onSetEmoticon={setEmoticon} key={currentmood.Data}></MoodRow>;
                }
            })
        }
        if (props.currentAthlete.startDate === null && props.currentAthlete.endDate != null) {
            return props.currentAthlete.mood.map(currentmood => {
                let parts = currentmood.Data.split("/")
                let correctDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                correctDate = new Date(correctDate + "T00:00:00")+'';
                if (Date.parse(correctDate) <= Date.parse(props.currentAthlete.endDate.toLocaleDateString('ko-KR'))) {
                    return <MoodRow mood={currentmood} onSetEmoticon={setEmoticon} key={currentmood.Data}></MoodRow>;
                }
            })
        }
        if (props.currentAthlete.startDate != null && props.currentAthlete.endDate != null) {
            return props.currentAthlete.mood.map(currentmood => {
                let parts = currentmood.Data.split("/")
                let correctDate = parts[2] + "-" + parts[1] + "-" + parts[0];
                correctDate = new Date(correctDate + "T00:00:00") + '';
                if (Date.parse(correctDate) >= Date.parse(props.currentAthlete.startDate.toLocaleDateString('ko-KR')) && Date.parse(correctDate) <= Date.parse(props.currentAthlete.endDate.toLocaleDateString('ko-KR'))) {
                    return <MoodRow mood={currentmood} onSetEmoticon={setEmoticon} key={currentmood.Data}></MoodRow>;
                }
            })
        }
    }

    const setEmoticon = (number) => {
        if (number === 0) return <Emoji symbol="☹️" label="Really Bad" />;
        if (number === 1) return <Emoji symbol="😕" label="Bad" />;
        if (number === 2) return <Emoji symbol="😐" label="Normal" />;
        if (number === 3) return <Emoji symbol="🙂" label="Good" />;
        if (number === 4) return <Emoji symbol="😃" label="Really Good" />;
    }

    return (
        <div>
            <h1 className="d-flex justify-content-between align-center">
                Athlete details
                <Link href={"/addRule"}>
                    <button type="button" className="float-right btn btn-outline-primary">
                        Add Rule
                    </button>
                </Link>
            </h1>
            <div className="row">
                <div className="col-sm-12 col-md-5 col-lg-5 col-xl-4 my-3">
                    <div className="card">
                        <div className="accordion" id="accordionGeneralInfo">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseGeneralInfo" aria-expanded="true" aria-controls="collapseGeneralInfo">
                                        General Info
                                    </button>
                                </h2>
                                <div id="collapseGeneralInfo" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionGeneralInfo">
                                    <div className="accordion-body">
                                        <div className="content">
                                            <div className="card-body">
                                                <p className="card-text">
                                                    <span className="text-muted"><em>AthleteID: {props.currentAthlete.id}</em></span><br />
                                                    <span>Name: {props.currentAthlete.name}</span><br />
                                                    <span>Birthday: {props.currentAthlete.dob}</span><br />
                                                    <span>Weight: {props.currentAthlete.weight} cm</span><br />
                                                    <span>Height: {props.currentAthlete.height} kg</span><br />
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-sm-12 col-md-7 col-lg-7 col-xl-8 my-3">
                    <div className="card">
                        <div className="accordion" id="accordionSettedRules">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingSettedRules">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSettedRules" aria-expanded="true" aria-controls="collapseSettedRules">
                                        Setted Rules
                                    </button>
                                </h2>
                                <div id="collapseSettedRules" className="accordion-collapse collapse show" aria-labelledby="headingSettedRules" data-bs-parent="#accordionSettedRules">
                                    <div className="accordion-body">
                                        <div className="content">
                                            <div className="card-body">
                                                <div className="card-text">
                                                    <div id="textMyAthleteRules"></div>
                                                    {showMyRulesPartOne()}
                                                    <div id="textMySuggestedAthleteRules"></div>
                                                    {showMyRulesPartTwo()}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                    <div className="card bg-light">
                        <div className="card-body py-3">
                            <div className="row">
                                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                                    <span className="mx-3 d-block d-md-inline mb-2">If you want, filter graphs by date range:</span>
                                    <span className="d-inline-block">
                                        <DatePicker
                                            renderCustomHeader={({
                                                date,
                                                changeYear,
                                                changeMonth,
                                                decreaseMonth,
                                                increaseMonth,
                                                prevMonthButtonDisabled,
                                                nextMonthButtonDisabled
                                            }) => (
                                                <div
                                                    style={{
                                                        margin: 10,
                                                        display: "flex",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    <button type="button" className="btn btn-light btn-sm" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                                        {"<"}
                                                    </button>
                                                    <select
                                                        className="form-control form-control-sm"
                                                        value={date.getFullYear()}
                                                        onChange={({ target: { value } }) => changeYear(+value)}
                                                    >
                                                        {years.map(option => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <select
                                                        className="form-control form-control-sm"
                                                        value={months[date.getMonth()]}
                                                        onChange={({ target: { value } }) =>
                                                            changeMonth(months.indexOf(value))
                                                        }
                                                    >
                                                        {months.map(option => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <button type="button" className="btn btn-light btn-sm" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                                        {">"}
                                                    </button>
                                                </div>
                                            )}
                                            dateFormat="dd/MM/yyyy"
                                            selected={props.currentAthlete.startDate}
                                            onChange={date => onChangeStartDate(date)}
                                            maxDate={props.currentAthlete.endDate}
                                            isClearable
                                            placeholderText=" No start date selected"
                                            className="d-inline-block mx-3"
                                        />
                                    </span>
                                    <span className="d-inline-block">
                                        <DatePicker
                                            renderCustomHeader={({
                                                date,
                                                changeYear,
                                                changeMonth,
                                                decreaseMonth,
                                                increaseMonth,
                                                prevMonthButtonDisabled,
                                                nextMonthButtonDisabled
                                            }) => (
                                                <div
                                                    style={{
                                                        margin: 10,
                                                        display: "flex",
                                                        justifyContent: "center"
                                                    }}
                                                >
                                                    <button type="button" className="btn btn-light btn-sm" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                                                        {"<"}
                                                    </button>
                                                    <select
                                                        className="form-control form-control-sm"
                                                        value={date.getFullYear()}
                                                        onChange={({ target: { value } }) => changeYear(+value)}
                                                    >
                                                        {years.map(option => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <select
                                                        className="form-control form-control-sm"
                                                        value={months[date.getMonth()]}
                                                        onChange={({ target: { value } }) =>
                                                            changeMonth(months.indexOf(value))
                                                        }
                                                    >
                                                        {months.map(option => (
                                                            <option key={option} value={option}>
                                                                {option}
                                                            </option>
                                                        ))}
                                                    </select>

                                                    <button type="button" className="btn btn-light btn-sm" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                                                        {">"}
                                                    </button>
                                                </div>
                                            )}
                                            dateFormat="dd/MM/yyyy"
                                            selected={props.currentAthlete.endDate}
                                            onChange={date => onChangeEndDate(date)}
                                            minDate={props.currentAthlete.startDate}
                                            maxDate={new Date()}
                                            isClearable
                                            placeholderText=" No end date selected"
                                            className="d-inline-block mx-3"
                                        />
                                    </span>
                                    <br />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                    <div className="card">
                        <div className="accordion" id="accordionMood">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseMood" aria-expanded="true" aria-controls="collapseMood">
                                        Mood
                                    </button>
                                </h2>
                                <div id="collapseMood" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionMood">
                                    <div className="accordion-body">
                                        <div className="content">
                                            <div className="card-body">
                                                <div className="row" id="moodSection">
                                                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                                        <div className="card">
                                                            <div className="card-body overflow-auto">
                                                                <div className="card-text">
                                                                    <table className="table m2-4 small">
                                                                        <thead>
                                                                            <tr>
                                                                                {setDate()}
                                                                            </tr>
                                                                        </thead>
                                                                        <tbody>
                                                                            <tr>
                                                                                {setMood()}
                                                                            </tr>
                                                                        </tbody>
                                                                    </table>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                    <div className="card">
                        <div className="accordion" id="accordionActivity">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseActivity" aria-expanded="true" aria-controls="collapseActivity">
                                        Activity
                                    </button>
                                </h2>
                                <div id="collapseActivity" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionActivity">
                                    <div className="accordion-body">
                                        <div className="content">
                                            <div className="card-body">
                                                <div className="row" id="activitySection">
                                                    <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 my-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div className="card-text">
                                                                    <ChartCustom
                                                                        target="calorieBruciate"
                                                                        chartData={props.currentAthlete.activityToPass}
                                                                    >
                                                                    </ChartCustom>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 my-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div className="card-text">
                                                                    <ChartCustom
                                                                        target="passi"
                                                                        chartData={props.currentAthlete.activityToPass}
                                                                    >
                                                                    </ChartCustom>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 my-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div className="card-text">
                                                                    <ChartCustom
                                                                        target="distanza"
                                                                        chartData={props.currentAthlete.activityToPass}
                                                                    >
                                                                    </ChartCustom>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 my-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div className="card-text">
                                                                    <ChartCustom
                                                                        target="piani"
                                                                        chartData={props.currentAthlete.activityToPass}
                                                                    >
                                                                    </ChartCustom>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div className="card-text">
                                                                    <ChartCustom
                                                                        target="minuti"
                                                                        chartData={props.currentAthlete.activityToPass}
                                                                    >
                                                                    </ChartCustom>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                    <div className="card">
                        <div className="accordion" id="accordionBody">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseBody" aria-expanded="true" aria-controls="collapseBody">
                                        Body
                                    </button>
                                </h2>
                                <div id="collapseBody" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionBody">
                                    <div className="accordion-body">
                                        <div className="content">
                                            <div className="card-body">
                                                <div className="row" id="activitySection">
                                                    <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 my-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div className="card-text">
                                                                    <ChartCustom
                                                                        target="peso"
                                                                        chartData={props.currentAthlete.bodyToPass}
                                                                    >
                                                                    </ChartCustom>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 my-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div className="card-text">
                                                                    <ChartCustom
                                                                        target="massaGrassa"
                                                                        chartData={props.currentAthlete.bodyToPass}
                                                                    >
                                                                    </ChartCustom>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div className="card-text">
                                                                    <ChartCustom
                                                                        target="imc"
                                                                        chartData={props.currentAthlete.bodyToPass}
                                                                    >
                                                                    </ChartCustom>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                    <div className="card">
                        <div className="accordion" id="accordionNutrition">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseNutrition" aria-expanded="true" aria-controls="collapseNutrition">
                                        Nutrition
                                    </button>
                                </h2>
                                <div id="collapseNutrition" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionNutrition">
                                    <div className="accordion-body">
                                        <div className="content">
                                            <div className="card-body">
                                                <div className="row" id="activitySection">
                                                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div className="card-text">
                                                                    <ChartCustom
                                                                        target="caloriesXMeal"
                                                                        chartData={props.currentAthlete.mfpToPass}
                                                                    >
                                                                    </ChartCustom>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div className="card-text">
                                                                    <ChartCustom
                                                                        target="nutrientiColazione"
                                                                        chartData={props.currentAthlete.mfpToPass}
                                                                    >
                                                                    </ChartCustom>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div className="card-text">
                                                                    <ChartCustom
                                                                        target="nutrientiPranzo"
                                                                        chartData={props.currentAthlete.mfpToPass}
                                                                    >
                                                                    </ChartCustom>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div className="card-text">
                                                                    <ChartCustom
                                                                        target="nutrientiCena"
                                                                        chartData={props.currentAthlete.mfpToPass}
                                                                    >
                                                                    </ChartCustom>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div className="card-text">
                                                                    <ChartCustom
                                                                        target="nutrientiSnack"
                                                                        chartData={props.currentAthlete.mfpToPass}
                                                                    >
                                                                    </ChartCustom>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="row">
                <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                    <div className="card">
                        <div className="accordion" id="accordionSleep">
                            <div className="accordion-item">
                                <h2 className="accordion-header" id="headingOne">
                                    <button className="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseSleep" aria-expanded="true" aria-controls="collapseSleep">
                                        Sleep
                                    </button>
                                </h2>
                                <div id="collapseSleep" className="accordion-collapse collapse show" aria-labelledby="headingOne" data-bs-parent="#accordionSleep">
                                    <div className="accordion-body">
                                        <div className="content">
                                            <div className="card-body">
                                                <div className="row" id="activitySection">
                                                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div className="card-text">
                                                                    <ChartCustom
                                                                        target="minutiSleeping"
                                                                        chartData={props.currentAthlete.sleepToPass}
                                                                    >
                                                                    </ChartCustom>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm-12 col-md-12 col-lg-12 col-xl-12 my-3">
                                                        <div className="card">
                                                            <div className="card-body">
                                                                <div className="card-text">
                                                                    <ChartCustom
                                                                        target="numeroRisvegli"
                                                                        chartData={props.currentAthlete.sleepToPass}
                                                                    >
                                                                    </ChartCustom>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default AthleteDetail