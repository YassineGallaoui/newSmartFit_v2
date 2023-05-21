import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import axiosInstance from 'pages/axiosInstance';

const EditRuleForm = () => {
    const myRef = useRef(null);

    const [currentState, setCurrentState] = useState(null);

    const router = useRouter();
    const { ruleId } = router.query;

    useEffect(() => {
        if (ruleId != null) {
            axiosInstance.get('/rules/' + ruleId)
                .then(response => {
                    setCurrentState((prev) => ({
                        athletesId: response.data.athletesId,
                        /* suggestedAthletesId: response.data.suggestedAthletesId, */
                        name: response.data.name,
                        message: response.data.message,
                        conditions: response.data.conditions,
                        temporalConditions: response.data.temporalConditions
                    }))
                })
                .catch(function (error) {
                    console.log(error);
                })

            axiosInstance.get('/athletes/')
                .then(response => {
                    setCurrentState((prev) => ({ firstAthletesList: response.data, permanentAthletesList: response.data }))
                    controllaNomi();
                })
                .catch((error) => {
                    console.log(error);
                })

            axiosInstance.get('/rules/')
                .then(response => {
                    setCurrentState((prev) => ({ alreadyExistingRules: response.data }))
                })
                .catch((error) => {
                    console.log(error);
                })
        }
    }, [ruleId])

    const controllaNomi = () => {
        let arr1 = currentState.athletesId;
        let arr2 = currentState.firstAthletesList;
        if(arr1 != null && arr2 != null) {
            for (let i = 0; i < arr1.length; i++) {
                for (let j = 0; j < arr2.length; j++) {
                    if (arr1[i] === arr2[j]._id) {
                        let replaceString = arr2[j].name + " ~ " + arr1[i];
                        arr1[i] = replaceString;
                        arr2.splice(j, 1)
                        setCurrentState((prev) => ({ firstAthletesList: arr2, athletesId: arr1 }));
                    }
                }
            }
        }
    }

    ///////////////////////
    /* GENERAL  SETTINGS */
    ///////////////////////

    const onAddAthleteId =() => {
        let newUserFull = myRef.current.value;
        if (newUserFull === "noneSelected") {
            window.alert("No one is selected");
            return;
        }
        let userId = newUserFull.substring(newUserFull.indexOf("~ ") + 2);
        setCurrentState((prev)=>({
            athletesId: currentState?.athletesId?.concat(userId)
        }))
        let arr1 = currentState?.firstAthletesList;
        for (let j = 0; j < arr1.length; j++) {
            if (arr1[j]._id === userId) {
                arr1.splice(j, 1)
                break;
            }
        }
    }

    const onAddSuggestedAthleteId =(e) => {
        let newUserFull = e;
        let userId = newUserFull.substring(newUserFull.indexOf("~ ") + 2);
        setCurrentState((prev)=>({
            athletesId: currentState.athletesId.concat(newUserFull)
        }))
        //tolgo il nome dell'atleta aggiunto dalla lista degli atleti che si possono aggiungere
        let arr1 = currentState.firstAthletesList;
        for (let j = 0; j < arr1.length; j++) {
            if (arr1[j]._id === userId) {
                arr1.splice(j, 1)
                break;
            }
        }
    }

    const onAddAllAthletesId =() => {
        var arrAthletes = [...currentState?.firstAthletesList];
        var arrAthletesId = [...currentState?.athletesId];
        while (arrAthletes?.length > 0) {
            let str = arrAthletes[0]?.name + " ~ " + arrAthletes[0]?._id;
            arrAthletesId?.push(str)
            arrAthletes?.splice(0, 1);
        }
        setCurrentState((prev)=>({
            firstAthletesList: arrAthletes,
            athletesId: arrAthletesId
        }))
    }

    const onAddAllSuggestedAthletesId =() => {
        var arrAthletesFromSelect = [...currentState.firstAthletesList];
        var arrAthletesAskResult = [...currentState.askResult];
        var arrAthletesId = [...currentState.athletesId];
        while (arrAthletesAskResult.length > 0) {
            let str = arrAthletesAskResult[0].name + " ~ " + arrAthletesAskResult[0]._id;
            let trovato = false;
            for (let x = 0; x < arrAthletesId.length; x++) {
                if (arrAthletesId[x] === str)
                    trovato = true
            }
            if (trovato === false)
                arrAthletesId.push(str)
            arrAthletesAskResult.splice(0, 1);
            for (let x = 0; x < arrAthletesFromSelect.length; x++) {
                if (arrAthletesFromSelect[x].name + " ~ " + arrAthletesFromSelect[x]._id === str)
                    arrAthletesFromSelect.splice(x, 1)
            }
        }
        setCurrentState((prev)=>({
            firstAthletesList: arrAthletesFromSelect,
            athletesId: arrAthletesId
        }))
    }

const onRemoveAthleteId =(e) => {
        var athletesIDCopy = [...currentState.athletesId];
        var index = athletesIDCopy.indexOf(e)
        if (index !== -1) {
            athletesIDCopy.splice(index, 1);
            setCurrentState((prev) => ({ athletesId: athletesIDCopy }));
        }
        let f = e.substring(e.indexOf("~ ") + 2);
        axiosInstance.get('/athletes/' + f)
            .then(response => {
                setCurrentState((prev) => ({ firstAthletesList: currentState.firstAthletesList.concat(response.data) }))
            })
            .catch((error) => {
                console.log(error);
            })
    }

const onRemoveAllAthletesId =() => {
        let athletesIDCopy = [...currentState.athletesId];
        while (athletesIDCopy.length > 0) {
            let str = athletesIDCopy[0];
            athletesIDCopy.splice(0, 1);
            let athId = str.substring(str.indexOf("~ ") + 2);
            axiosInstance.get('/athletes/' + athId)
                .then(response => {
                    setCurrentState((prev) => ({ firstAthletesList: currentState.firstAthletesList.concat(response.data) }))
                })
                .catch((error) => {
                    console.log(error);
                })
        }
        setCurrentState((prev) => ({ athletesId: athletesIDCopy }));
    }

const newAthletesList =() => {
    return currentState?.athletesId?.map(currentathleteId => {
            return (
                <div
                    className="p-3 mb-2 bg-light d-flex justify-content-between align-center"
                    key={currentathleteId}>
                    <em>{currentathleteId}</em>
                    <button type="button" className="btn btn-outline-danger btn-sm ml-4" onClick={() => { onRemoveAthleteId(currentathleteId) }}>Remove</button>
                </div>
            )
        })
    }

const onChangeName =(e) =>  {
        setCurrentState((prev)=>({
            name: e.target.value
        }))
    }

const onChangeMessage =(e) =>  {
        setCurrentState((prev)=>({
            message: e.target.value
        }))
    }


    ///////////////////////
    /* NORMAL CONDITIONS */
    ///////////////////////

const onChangeType =(e) =>  {
        if (e.target.value === "Mood") {
            document.getElementById("selectVal1").style.display = "none";
            document.getElementById("selectVal2").style.display = "none";
            document.getElementById("selectValMood").style.display = "block";
            setCurrentState((prev)=>({
                currentValue1: "Really Bad"
            }))
            if (currentState.currentOp === "between") {
                document.getElementById("selectSecondValMood").style.display = "block";
                setCurrentState((prev)=>({
                    currentValue2: "Really Bad"
                }))
            }
        } else {
            document.getElementById("selectValMood").style.display = "none";
            document.getElementById("selectSecondValMood").style.display = "none";
            document.getElementById("selectVal1").style.display = "block";
            if (currentState.currentOp === "between")
                document.getElementById("selectVal2").style.display = "block";
        }
        setCurrentState((prev)=>({
            currentType: e.target.value
        }))
    }

const onChangeOperator =(e) =>  {
        if (e.target.value === "between") {
            if (currentState.currentType === "Mood") {
                document.getElementById("selectVal1").style.display = "none";
                document.getElementById("selectVal2").style.display = "none";
                document.getElementById("selectValMood").style.display = "block";
                document.getElementById("selectSecondValMood").style.display = "block";
            }
            else {
                document.getElementById("selectVal1").style.display = "block";
                document.getElementById("selectVal2").style.display = "block";
                document.getElementById("selectValMood").style.display = "none";
                document.getElementById("selectSecondValMood").style.display = "none";
            }
        } else {
            if (currentState.currentType === "Mood") {
                document.getElementById("selectVal1").style.display = "none";
                document.getElementById("selectVal2").style.display = "none";
                document.getElementById("selectValMood").style.display = "block";
                document.getElementById("selectSecondValMood").style.display = "none";
            } else {
                document.getElementById("selectVal1").style.display = "block";
                document.getElementById("selectVal2").style.display = "none";
                document.getElementById("selectValMood").style.display = "none";
                document.getElementById("selectSecondValMood").style.display = "none";
            }
            setCurrentState((prev)=>({
                currentValue2: ""
            }))
        }
        setCurrentState((prev)=>({
            currentOp: e.target.value
        }))
    }

const onChangeValue1Condition =(e) =>  {
        setCurrentState((prev)=>({
            currentValue1: e.target.value
        }))
    }

const onChangeValue2Condition =(e) =>  {
        setCurrentState((prev)=>({
            currentValue2: e.target.value
        }))
    }

const onChangelink =(e) =>  {
        setCurrentState((prev)=>({
            currentLink: e.target.value
        }))
    }

const onAddCondition =(e) =>  {
        // CREARE COMPONENTI DELLA CONDIZIONE
        if (currentState.currentValue1 === "") {
            alert("Insert at least one value in the condition!")
            return;
        }
        if (currentState.currentOp === "between" && (currentState.currentValue1 === "" || currentState.currentValue2 === "")) {
            alert("If you select between operation, you must also insert two valid values!")
            return;
        }
        let newCondition = {
            link: currentState.currentLink,
            operator: currentState.currentOp,
            type: currentState.currentType,
            value1: currentState.currentValue1,
            value2: currentState.currentValue2
        }
        //AGGIORNARE LO STATE DELLE CONDIZIONI
        setCurrentState((prev)=>({
            conditions: currentState?.conditions?.concat(newCondition)
        }))
    }

const onRemoveCondition =(a, b, c, d) => {
        var conditionsCopy = [...currentState.conditions];
        for (let i = 0; i < conditionsCopy.length; i++) {
            if (conditionsCopy[i].type === a && conditionsCopy[i].op === b && conditionsCopy[i].value1 === c && conditionsCopy[i].value2 === d) {
                conditionsCopy.splice(i, 1);
                setCurrentState((prev) => ({ conditions: conditionsCopy }));
            }
        }
        filterAthletes();
    }

    ///////////////////////
    //* ASK TO DATABASE *//
    ///////////////////////

    const componentDidUpdate = (prevProps, prevState) => {
        if (prevState.conditions !== currentState.conditions) {
            filterAthletes();
        }
    }

    const filterAthletes = () => {
        //QUA CERCO DI CAPIRE QUALI ATLETI RIENTRANO NELLE CONDIZIONI RICHIESTE.
        let condizioni = currentState.conditions;

        if (condizioni.length === 0) {
            setCurrentState((prev) => ({ askResult: [] }))
            return;
        }

        for (let p = 0; p < condizioni.length; p++) {
            let tipo = condizioni[p].type;
            let operatore = condizioni[p].operator;
            let valore1 = condizioni[p].value1;
            let valore2 = condizioni[p].value2;
            let link = condizioni[p].link;
            let whereToSearch = "";
            let comparison = "";
            // WHERE TO SEARCH
            //CASO 1
            if (tipo === "Calories Intake (Breakfast)") whereToSearch = "mfp.CaloriesBreakfast";
            if (tipo === "Calories Intake (Lunch)") whereToSearch = "mfp.CaloriesLunch";
            if (tipo === "Calories Intake (Dinner)") whereToSearch = "mfp.CaloriesDinner";
            if (tipo === "Calories Intake (Snacks)") whereToSearch = "mfp.CaloriesSnacks";
            if (tipo === "Carbs (g)") whereToSearch = "mfp.Carbs_g";
            if (tipo === "Fat (g)") whereToSearch = "mfp.Fat_g";
            if (tipo === "Protein (g)") whereToSearch = "mfp.Protein_g";
            if (tipo === "Cholesterol (mg)") whereToSearch = "mfp.Cholest_mg";
            if (tipo === "Sodium (mg)") whereToSearch = "mfp.Sodium_mg";
            if (tipo === "Sugars (g)") whereToSearch = "mfp.Sugars_g";
            if (tipo === "Fibre (g)") whereToSearch = "mfp.Fiber_g";
            //CASO 2
            if (tipo === "Mood") whereToSearch = "mood.Mood";
            //CASO 3
            if (tipo === "Bed exits") whereToSearch = "sleep.NumeroDiRisvegli";
            if (tipo === "Sleep minutes") whereToSearch = "sleep.MinutiDiSonno";
            if (tipo === "Sleep latency") whereToSearch = "sleep.DurataDelRiposo";
            if (tipo === "Sleep awakening") whereToSearch = "sleep.MinutiDiVeglia";
            //CASO 4
            if (tipo === "Burned calories") whereToSearch = "activity.CalorieBruciate";
            if (tipo === "Activity duration") whereToSearch = "activity.MinutiDiAttivitàIntensa";
            if (tipo === "Activity distance") whereToSearch = "activity.Distanza";
            if (tipo === "Steps") whereToSearch = "activity.Passi";

            // WHAT IS THE OPERATOR?
            if (operatore === "equal to") comparison = "===";
            if (operatore === "not equal to") comparison = "!==";
            if (operatore === "higher than") comparison = ">";
            if (operatore === "lower than") comparison = "<";
            if (operatore === "between") comparison = "><";

            // THE FIRST VALUE
            let val1 = null;
            if (tipo !== "Mood")
                val1 = parseFloat(valore1)
            else {
                if (valore1 === "Really Good") val1 = 4
                if (valore1 === "Good") val1 = 3
                if (valore1 === "Normal") val1 = 2
                if (valore1 === "Bad") val1 = 1
                if (valore1 === "Really Bad") val1 = 0
            }


            // THE SECOND VALUE
            let val2 = null;
            if (valore2 !== "") {
                if (tipo === "Mood") {
                    if (valore2 === "Really Good") val2 = 4
                    if (valore2 === "Good") val2 = 3
                    if (valore2 === "Normal") val2 = 2
                    if (valore2 === "Bad") val2 = 1
                    if (valore2 === "Really Bad") val2 = 0
                } else {
                    val2 = parseFloat(valore2);
                }
            }

            // ===> ORA VALUTO SE LA CONDIZIONE IN QUESTIONE È VERA O MENO! <=== //

            const condition = {
                tipo: whereToSearch,
                op: comparison,
                value1: val1,
                value2: val2
            }

            axiosInstance.post('/athletes/ask', condition)
                .then(response => {
                    if (currentState.conditions.length === 1) {
                        setCurrentState((prev) => ({ askResult: response.data }))
                        return;
                    } else if (link === "and") {
                        /* response.data = (response.data).filter(el => el === currentState.askResult) */
                        let filtered = [];
                        let arrAskResult = currentState.askResult;
                        (response.data).filter(function (newData) {
                            return arrAskResult.filter(function (oldData) {
                                if (newData._id === oldData._id) {
                                    filtered.push(newData)
                                }
                            })
                        });
                        setCurrentState((prev) => ({ askResult: filtered }))
                    } else if (link === "or") {
                        let fusion = currentState.askResult.concat(response.data);
                        for (let i = 0; i < fusion.length; i++) {
                            for (let n = 0; n < fusion.length; n++) {
                                if (i !== n && fusion[i]._id === fusion[n]._id) {
                                    fusion.splice(n, 1);
                                    n--;
                                }
                            }
                        }
                        setCurrentState((prev) => ({ askResult: fusion }))
                    }
                })
                .catch(err => console.log(err))
        }
    }

    const putButtonOrNot = (nameAndId) => {
        let arr1 = currentState.firstAthletesList;
        for (let x = 0; x < arr1.length; x++) {
            if (arr1[x].name + " ~ " + arr1[x]._id === nameAndId) {
                return (
                    <input type="button"
                        className="btn btn-outline-success ml-4"
                        value="Add"
                        onClick={() => { onAddSuggestedAthleteId(nameAndId) }} />
                )
            }
        } return;
    }

    const showSuggestedAthletes = () => {

        if (currentState?.conditions?.length === 0) return;

        if (currentState?.conditions?.length > 0 && currentState?.askResult?.length === 0) {
            return (
                <div className="container mt-3 py-3 text-dark rounded">
                    <b>No Suggested Athletes</b>
                </div>
            )
        }

        if (currentState?.askResult?.length > 0) {
            return (
                <div>
                    <div className="container mt-3 py-3 text-dark rounded d-flex justify-content-between align-center">
                        <b>Suggested Athletes:</b>
                        <button type="button"
                            className="btn btn-outline-success mt-n2 mr-3 float-right"
                            onClick={() => { onAddAllSuggestedAthletesId() }}>
                            Add All
                        </button>
                    </div>

                    {currentState?.askResult?.map((currentResult, index) => {
                        return (
                            <div className=" bg-light p-3 mb-2 d-flex justify-content-between align-center" key={currentResult._id}>
                                <em>{currentResult.name + " ~ " + currentResult._id}</em>
                                {putButtonOrNot(currentResult.name + " ~ " + currentResult._id)}
                            </div>
                        )
                    })
                    }
                </div>
            )
        }
    }

    const newConditionsList = () => {
        if (currentState?.conditions?.length === 0) {
            try {
                document.getElementById("linkSelection").style.display = "none";
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                document.getElementById("linkSelection").style.display = "block";
            } catch (error) {
                console.log(error)
            }
        }

        return currentState?.conditions?.map((currentCondition, index) => {
            return (
                <span key={index}>
                    <div
                        className="p-3 mb-2 bg-light d-flex justify-content-between align-center"
                        key={currentCondition.type + currentCondition.value1}>
                        <span>
                            {index === 0 ? ("    ") : (<b><em>{currentCondition.link + " "}</em></b>)}
                            <em>{currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}</em>
                        </span>
                        <button type="button" className="btn btn-outline-danger btn-sm ml-4" onClick={() => { onRemoveCondition(currentCondition.type, currentCondition.op, currentCondition.value1, currentCondition.value2) }}>Remove</button>
                    </div>
                </span>
            )
        })
    }


    /////////////////////////
    /* TEMPORAL CONDITIONS */
    /////////////////////////

const onChangeTemporalItem =(e) =>  {
        if (e.target.value === currentState.currentTemporalValue1) {
            setCurrentState((prev)=>({
                currentTemporalValue1: ""
            }))
        }
        setCurrentState((prev)=>({
            currentTemporalItem: e.target.value
        }))
    }

const onChangeTemporalOperator =(e) =>  {
        if (e.target.value === "starts between" || e.target.value === "ends between") {
            document.getElementById("selectTemporalVal2").style.display = "block";
        } else {
            document.getElementById("selectTemporalVal2").style.display = "none";
            setCurrentState((prev)=>({
                currentTemporalValue2: ""
            }))
        }
        setCurrentState((prev)=>({
            currentTemporalOp: e.target.value
        }))
    }

const onChangeValue1TemporalCondition =(e) =>  {
        if (e.target.value === currentState.currentTemporalValue2) {
            setCurrentState((prev)=>({
                currentTemporalValue2: ""
            }))
        }
        setCurrentState((prev)=>({
            currentTemporalValue1: e.target.value
        }))
    }

const onChangeValue2TemporalCondition =(e) =>  {
        setCurrentState((prev)=>({
            currentTemporalValue2: e.target.value
        }))
    }

const onChangeTemporalLink =(e) =>  {
        setCurrentState((prev)=>({
            currentTemporalLink: e.target.value
        }))
    }

    const onAddTemporalCondition = () => {
        // CREARE COMPONENTI DELLA CONDIZIONE TEMPORALE
        if (currentState.currentTemporalItem === "select temporal item") {
            alert("You have to choose temporal item to make comparison!")
            return;
        }
        if (currentState.currentTemporalValue1 === "") {
            alert("Insert at least one value in the temporal condition!")
            return;
        }
        if ((currentState.currentTemporalOp === "starts between" || currentState.currentTemporalOp === "ends between") && (currentState.currentTemporalValue1 === "" || currentState.currentTemporalValue2 === "")) {
            alert("If you select between operation, you must also insert two values!")
            return;
        }
        let newTemporalCondition = {
            temporalLink: currentState.currentTemporalLink,
            temporalOperator: currentState.currentTemporalOp,
            temporalItem: currentState.currentTemporalItem,
            temporalValue1: currentState.currentTemporalValue1,
            temporalValue2: currentState.currentTemporalValue2
        }
        //AGGIORNARE LO STATE DELLE CONDIZIONI
        setCurrentState((prev)=>({
            temporalConditions: currentState.temporalConditions.concat(newTemporalCondition)
        }))
    }

    const onRemoveTemporalCondition = (a, b, c, d) => {
        var temporalConditionsCopy = [...currentState.temporalConditions];
        for (let i = 0; i < temporalConditionsCopy.length; i++) {
            if (temporalConditionsCopy[i].temporalItem === a && temporalConditionsCopy[i].temporalOperator === b && temporalConditionsCopy[i].temporalValue1 === c && temporalConditionsCopy[i].temporalValue2 === d) {
                temporalConditionsCopy.splice(i, 1);
                setCurrentState((prev) => ({ temporalConditions: temporalConditionsCopy }));
            }
        }
    }

    const newTemporalConditionsList = () => {
        if (currentState?.temporalConditions?.length === 0) {
            try {
                document.getElementById("temporalLinkSelection").style.display = "none";
            } catch (error) {
                console.log(error)
            }
        } else {
            try {
                document.getElementById("temporalLinkSelection").style.display = "block";
            } catch (error) {
                console.log(error)
            }
        }

        return currentState?.temporalConditions?.map((currentTemporalCondition, index) => {
            return (
                <span key={index}>
                    <div
                        className="p-3 mb-2 bg-light d-flex justify-content-between align-center"
                        key={currentTemporalCondition.temporalItem + currentTemporalCondition.temporalOperator + currentTemporalCondition.temporalValue1 + currentTemporalCondition.temporalValue2}>
                        {index === 0 ? ("    ") : (<b><em>{currentTemporalCondition.temporalLink + " "}</em></b>)}
                        <em>{`"` + currentTemporalCondition.temporalItem + `" `}<b>{currentTemporalCondition.temporalOperator}</b>{` "` + currentTemporalCondition.temporalValue1 + `" ` + (currentTemporalCondition.temporalValue2 === "" ? "" : (`and "` + currentTemporalCondition.temporalValue2 + `"`))}</em>
                        <button type="button" className="btn btn-outline-danger btn-sm ml-4" onClick={() => { onRemoveTemporalCondition(currentTemporalCondition.temporalItem, currentTemporalCondition.temporalOperator, currentTemporalCondition.temporalValue1, currentTemporalCondition.temporalValue2) }}>Remove</button>
                    </div>
                </span>
            )
        })
    }

const onSubmit =(e) =>  {
        e.preventDefault();

        let suggestedAthletesId = [];

        if (currentState?.conditions?.length === 0) {
            alert("Insert at least one condition!");
            return;
        }

        try {
            //TOLGO IL LINK DALLA PRIMA CONDITION, PERCHÈ NON SERVE
            let conditions = [...currentState.conditions];
            let condition = conditions[0];
            condition.link = "";
            conditions[0] = condition;
            setCurrentState((prev)=>({ conditions }));

            //TOLGO IL NOME DAGLI ATHLETES ID
            let athletesId = [...currentState.athletesId];
            for (let p = 0; p < athletesId.length; p++) {
                let athID = athletesId[p];
                if (athID.indexOf("~") !== -1)
                    athID = athID.substring(athID.indexOf("~") + 2);
                athletesId[p] = athID;
            }
            currentState.athletesId = athletesId;


            for (let x = 0; x < currentState.askResult.length; x++) {
                let str = currentState.askResult[x].name + " ~ " + currentState.askResult[x]._id;
                suggestedAthletesId.push(str);
            }
            currentState.suggestedAthletesId = suggestedAthletesId;

        } catch (error) {
            console.log("errore onSubmit");
        }

        try {
            //TOLGO IL LINK DALLA PRIMA TEMPORAL CONDITION, PERCHÈ NON SERVE
            let temporalConditions = [...currentState.temporalConditions];
            let temporalCondition = temporalConditions[0];
            temporalCondition.temporalLink = "";
            temporalConditions[0] = temporalCondition;
            setCurrentState((prev)=>({ temporalConditions }));
        } catch (error) {
            console.log("errore onSubmit");
        }


        //SE IL NOME NON È GIÀ SETTATO
        if (currentState.name === "") {
            //SE VOGLIO CHE VENGA SETTATO UN NOME GENERATO AUTOMATICAMENTE
            if (window.confirm(`Name not setted. 
Do you want to automatically set name?`)) {
                let arrRules = [...currentState.alreadyExistingRules]
                let numberRule = -1;
                for (let x = 0; x < arrRules.length; x++) {
                    let nomeRule = arrRules[x].name;
                    if (nomeRule.indexOf("Automatic_Rule_Name_") > -1) {
                        let n = nomeRule.substr(20)
                        numberRule = parseInt(n) + 1;
                    }
                }
                if (numberRule === -1) numberRule = 0
                let nuovoNome = "Automatic_Rule_Name_" + numberRule;
                currentState.name = nuovoNome; //IL METODO THIS.SETSTATE PER QUALCHE MOTIVO NON FUNZIONA!!! DA RISOLVERE POSSIBILMENTE!

                const rule = {
                    name: currentState.name,
                    athletesId: currentState.athletesId,
                    suggestedAthletesId: currentState.suggestedAthletesId,
                    conditions: currentState.conditions,
                    temporalConditions: currentState.temporalConditions,
                    message: currentState.message
                }

                axiosInstance.post('/rules/update/' + ruleId, rule)
                    .then(res => alert("Rule updated!"))
            } else {//ALTRIMENTI ESCO COSÌ L'UTENTE PUÒ SETTARE IL NOME CHE VUOLE
                return;
            }
        } else {
            //SE IL NOME È GIÀ SETTATO
            const rule = {
                name: currentState.name,
                athletesId: currentState.athletesId,
                suggestedAthletesId: currentState.suggestedAthletesId,
                conditions: currentState.conditions,
                temporalConditions: currentState.temporalConditions,
                message: currentState.message
            }

            axiosInstance.post('/rules/update/' + ruleId, rule)
                .then(res => {
                    alert("Rule updated!");
                })
        }
        controllaNomi();
    }


    //////////////////////////////
    /*----------RENDER----------*/
    //////////////////////////////
    return (
        currentState && 
        <div>
            <h1 className="mb-4">Edit rule</h1>
            <form onSubmit={onSubmit}>


                <div className="h4 text-center mb-3 p-3 rounded text-white bg-info">1 ~ General settings</div>
                <div className="form-group">
                    <h6><label>Rule Name</label></h6>
                    <input type="text"
                        className="col-sm-12 col-md-12 col-lg-12 col-xl-12 form-control mb-3"
                        value={currentState.name}
                        onChange={onChangeName} />

                    <h6><label>Express Athletes ID</label></h6>
                    {newAthletesList()}
                    <div className="mb-2 form-inline mb-3">
                        <select required
                            className="form-control col-12 col-sm-6 col-md-6 col-lg-6 col-xl-6 mr-4 mb-3 mb-sm-0"
                            ref={myRef}>
                            <option
                                value="noneSelected">
                                Choose athlete(s)
                            </option>
                            {
                                currentState?.firstAthletesList?.map(
                                    currentAthlete => {
                                        return <option
                                            key={currentAthlete._id}
                                            value={currentAthlete.name + " ~ " + currentAthlete._id}>{currentAthlete.name + " ~ " + currentAthlete._id}
                                        </option>
                                    }
                                )
                            }
                        </select>
                        <button type="button"
                            className="btn btn-success mt-3"
                            onClick={() => { onAddAthleteId() }}>
                            Add
                        </button>
                        <button type="button"
                            className="btn btn-outline-success mt-3"
                            onClick={() => { onAddAllAthletesId() }}
                            style={{ marginLeft: '10px' }}>
                            Add All
                        </button>
                        <button type="button"
                            className="btn btn-outline-danger mt-3"
                            onClick={() => { onRemoveAllAthletesId() }}
                            style={{ marginLeft: '10px' }}>
                            Remove All
                        </button>
                    </div>

                    <h6><label>Message</label></h6>
                    <textarea className="col-sm-12 col-md-12 col-lg-12 col-xl-12 form-control mb-3"
                        id="formControlTextarea1"
                        required
                        rows={4}
                        value={currentState.message}
                        onChange={onChangeMessage}></textarea>
                </div>


                <div className="h4 text-center mt-5 mb-3 p-3 rounded text-white bg-info">2 ~ Conditions</div>

                <div className="form-group">
                    <h6><label>Setted Conditions</label></h6>
                    {newConditionsList()}
                    <span id="linkSelection">
                        <select className="form-control col-4 col-sm-4 col-md-3 col-lg-3 col-xl-3 mr-4 my-2"
                            id="selectLink"
                            title="Scegli una opzione"
                            defaultValue="and"
                            onChange={onChangelink}>
                            <option value="and">AND</option>
                            <option value="or">OR</option>
                        </select>
                    </span>
                    <div className="form-inline mt-2">
                        <select className="form-control col-sm-12 col-md-3 col-lg-3 col-xl-3 mr-4 my-2"
                            id="selectCondition"
                            title="Scegli una opzione"
                            onChange={onChangeType}>
                            <option value="Calories Intake (Breakfast)">Calories Intake - Breakfast (Kcal)</option>
                            <option value="Calories Intake (Lunch)">Calories Intake - Lunch (Kcal)</option>
                            <option value="Calories Intake (Dinner)">Calories Intake - Dinner (Kcal)</option>
                            <option value="Calories Intake (Snacks)">Calories Intake - Snacks (Kcal)</option>
                            <option value="Carbs (g)">Carbs (g)</option>
                            <option value="Fat (g)">Fat (g)</option>
                            <option value="Protein (g)">Protein (g)</option>
                            <option value="Cholesterol (mg)">Cholesterol (mg)</option>
                            <option value="Sodium (mg)">Sodium (mg)</option>
                            <option value="Sugars (g)">Sugars (g)</option>
                            <option value="Fibre (g)">Fibre (g)</option>
                            <option value="Mood">Mood</option>
                            <option value="Sleep minutes">Sleep minutes</option>
                            <option value="Sleep latency">Sleep latency (minutes)</option>
                            <option value="Sleep awakening">Sleep awakenings (number)</option>
                            <option value="Activity duration">Activity duration (minutes)</option>
                            <option value="Activity distance">Activity distance (km)</option>
                            <option value="Burned calories">Burned calories (Kcal)</option>
                            <option value="Steps">Steps (number)</option>
                        </select> <span className="mr-4">is</span>
                        <select className="form-control col-sm-12 col-md-2 col-lg-2 col-xl-2 mr-4 my-2"
                            id="selectOp"
                            onChange={onChangeOperator}>
                            <option value="higher than"> &gt; higher than</option>
                            <option value="lower than"> &lt; lower than</option>
                            <option value="between"> &gt; &lt; between</option>
                            <option value="equal to"> = equal to</option>
                            <option value="not equal to"> &ne; not equal to</option>
                        </select>
                        {/* primo valore */}
                        <input type="number"
                            className="form-control col-sm-12 col-md-2 col-lg-2 col-xl-2 mr-4 my-2"
                            id="selectVal1"
                            value={currentState.value1}
                            onChange={onChangeValue1Condition}
                        ></input>
                        {/* secondo valore */}
                        <input type="number"
                            className="form-control col-sm-12 col-md-2 col-lg-2 col-xl-2 mr-4 my-2"
                            id="selectVal2"
                            value={currentState.value2}
                            onChange={onChangeValue2Condition}
                        ></input>
                        {/*primo valore nel caso si parli di mood */}
                        <select className="form-control col-sm-12 col-md-3 col-lg-3 col-xl-3 mr-4 my-2"
                            id="selectValMood"
                            title="Scegli una opzione"
                            onChange={onChangeValue1Condition}>
                            <option value="Really Bad">Really Bad</option>
                            <option value="Bad">Bad</option>
                            <option value="Normal">Normal</option>
                            <option value="Good">Good</option>
                            <option value="Really Good">Really Good</option>
                        </select>
                        {/*secondo valore nel caso si parli di mood */}
                        <select className="form-control col-sm-12 col-md-3 col-lg-3 col-xl-3 mr-4 my-2"
                            id="selectSecondValMood"
                            title="Scegli una opzione"
                            onChange={onChangeValue2Condition}>
                            <option value="Really Bad">Really Bad</option>
                            <option value="Bad">Bad</option>
                            <option value="Normal">Normal</option>
                            <option value="Good">Good</option>
                            <option value="Really Good">Really Good</option>
                        </select>

                        <button type="button"
                            className="btn btn-success mr-4 my-2"
                            onClick={() => { onAddCondition() }}>
                            Add
                        </button>
                    </div>
                    {showSuggestedAthletes()}
                </div>


                <div className="h4 text-center mt-5 mb-3 p-3 rounded text-white bg-info">3 ~ Temporal conditions</div>

                <div className="form-group mb-3">
                    <h6><label>Temporal Conditions</label></h6>
                    {newTemporalConditionsList()}
                    <span id="temporalLinkSelection">
                        <select className="form-control col-4 col-sm-4 col-md-3 col-lg-3 col-xl-3 mr-4 my-2"
                            id="selectTemporalLink"
                            title="Scegli una opzione"
                            defaultValue="and"
                            onChange={onChangeTemporalLink}>
                            <option value="and">AND</option>
                            <option value="or">OR</option>
                        </select>
                    </span>
                    <div className="form-inline mt-2">
                        <select className="form-control col-sm-12 col-md-4 col-lg-4 col-xl-4 mr-4 my-2"
                            id="selectTemporalCondition"
                            title="Scegli una opzione"
                            onChange={onChangeTemporalItem}>
                            <option value="select temporal item">Select temporal item...</option>
                                {currentState?.conditions?.map(currentCondition => {
                                return (
                                    <option value={currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}
                                        key={currentCondition.type + currentCondition.operator + currentCondition.value1 + currentCondition.value2}>
                                        {currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}
                                    </option>
                                )
                            })}
                        </select>
                        <select className="form-control col-sm-12 col-md-2 col-lg-2 col-xl-2 mr-4 my-2"
                            id="selectOpTemporal"
                            onChange={onChangeTemporalOperator}>
                            <option value="starts with"> starts with</option>
                            <option value="starts before"> starts before</option>
                            <option value="starts after"> starts after</option>
                            <option value="starts between"> starts between</option>
                            <option value="ends with"> ends with</option>
                            <option value="ends before"> ends before</option>
                            <option value="ends after"> ends after</option>
                            <option value="ends between"> ends between</option>
                        </select>
                        {/* primo valore */}
                        <select
                            className="form-control col-sm-12 col-md-4 col-lg-4 col-xl-4 mr-4 my-2"
                            id="selectTemporalVal1"
                            title="Choose first element"
                            onChange={onChangeValue1TemporalCondition}>
                            <option value="">Select first element...</option>
                                {(currentState?.conditions?.filter(el => el.type + " is " + el.operator + " " + el.value1 + (el.value2 === "" ? "" : (" and " + el.value2)) !== currentState.currentTemporalItem))?.map(currentCondition => {
                                return (
                                    <option value={currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}
                                        key={currentCondition.type + currentCondition.operator + currentCondition.value1 + currentCondition.value2}>
                                        {currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}
                                    </option>
                                )
                            })}
                        </select>
                        {/* secondo valore */}
                        <select
                            className="form-control col-sm-12 col-md-4 col-lg-4 col-xl-4 mr-4 my-2"
                            id="selectTemporalVal2"
                            title="select second element"
                            onChange={onChangeValue2TemporalCondition}>
                            <option value="">Select second element...</option>
                                {(currentState?.conditions?.filter(el => el.type + " is " + el.operator + " " + el.value1 + (el.value2 === "" ? "" : (" and " + el.value2)) !== currentState.currentTemporalItem && el.type + " is " + el.operator + " " + el.value1 + (el.value2 === "" ? "" : (" and " + el.value2)) !== currentState.currentTemporalValue1))?.map(currentCondition => {
                                return (
                                    <option value={currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}
                                        key={currentCondition.type + currentCondition.operator + currentCondition.value1}>
                                        {currentCondition.type + " is " + currentCondition.operator + " " + currentCondition.value1 + (currentCondition.value2 === "" ? "" : (" and " + currentCondition.value2))}
                                    </option>
                                )
                            })}
                        </select>
                        <button type="button"
                            className="btn btn-success mr-4 my-2"
                            onClick={() => { onAddTemporalCondition() }}>
                            Add
                        </button>
                    </div>
                </div>


                <div className="my-4 text-center">
                    <input type="submit"
                        value="Update Rule"
                        className="btn btn-primary btn-lg">
                    </input>
                </div>

            </form>
        </div>
    )
}

export default EditRuleForm;