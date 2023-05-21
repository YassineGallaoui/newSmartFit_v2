import React, { Component, useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    registerables
} from 'chart.js';
ChartJS.register(...registerables);
let bgColour = "rgba(43, 21, 210, 0.2)";
let pointsBgColours = [
    'rgba(166, 187, 135, 1)',
    'rgba(44, 162, 214, 1)',
    'rgba(110, 109, 5, 1)',
    'rgba(248, 221, 82, 1)',
    'rgba(190, 71, 100, 1)',
    'rgba(213, 43, 254, 1)',
    'rgba(165, 103, 212, 1)',
    'rgba(115, 215, 13, 1)',
    'rgba(216, 44, 144, 1)',
    'rgba(89, 50, 64, 1)',
    'rgba(241, 71, 211, 1)',
    'rgba(210, 132, 35, 1)',
    'rgba(241, 73, 10, 1)',
    'rgba(0, 246, 12, 1)',
    'rgba(194, 97, 172, 1)',
    'rgba(252, 229, 36, 1)',
    'rgba(168, 67, 67, 1)',
    'rgba(81, 34, 78, 1)'
]

const ChartCustom = (props) => {
    const[currentState, setCurrentState] = useState(null);

    useEffect(()=>{
            let arr1 = [];
            for (let a = 0; a < props.chartData.length; a++) {
                arr1.push(props.chartData[a].Data);
            }
            if (props.target === "caloriesXMeal" || props.target === "nutrientiColazione" || props.target === "nutrientiPranzo" || props.target === "nutrientiCena" || props.target === "nutrientiSnack") {
                arr1 = [];
                for (let a = 0; a < props.chartData.length; a = a + 4) {
                    arr1.push(props.chartData[a].Data);
                }
            }

            let arr2 = [];
            let arr3 = [];
            let arr4 = [];
            let arr5 = [];
            let arr6 = [];
            let arr7 = [];
            let arr8 = [];
            let titolo = "";
            let labelText = "";
            for (let b = 0; b < props.chartData.length; b++) {
                if (props.target === "calorieBruciate") {
                    titolo = "Calorie bruciate";
                    labelText = "Calorie bruciate";
                    //IL PUNTO NON VA BENE A CHART.JS E QUINDI LO TOLGO
                    let n = "" + props.chartData[b].CalorieBruciate;
                    let pos = n.indexOf(".");
                    n = n.substring(0, pos) + n.substring(pos + 1);
                    n = parseInt(n);
                    //ORA POSSO AGGIUNGERE IL VALORE ALL'ARRAY
                    arr2.push(n);

                    //IL PUNTO NON VA BENE A CHART.JS E QUINDI LO TOLGO
                    let m = "" + props.chartData[b].CalorieAttività;
                    let pos2 = m.indexOf(".");
                    m = m.substring(0, pos2) + m.substring(pos2 + 1);
                    m = parseInt(m);
                    //ORA POSSO AGGIUNGERE IL VALORE ALL'ARRAY
                    arr3.push(m);
                }

                if (props.target === "passi") {
                    titolo = "Passi";
                    labelText = "Passi";
                    let n = "" + props.chartData[b].Passi;
                    let pos = n.indexOf(".");
                    n = n.substring(0, pos) + n.substring(pos + 1);
                    n = parseInt(n);
                    arr2.push(n);
                }

                if (props.target === "distanza") {
                    titolo = "Distanza";
                    labelText = "Distanza";
                    let n = props.chartData[b].Distanza;
                    let pos = n.indexOf(",");
                    n = n.substring(0, pos) + n.substring(pos + 1) + "0";
                    n = parseInt(n);
                    //ORA POSSO AGGIUNGERE IL VALORE ALL'ARRAY
                    arr2.push(n);
                }

                if (props.target === "piani") {
                    titolo = "Piani";
                    labelText = "Piani";
                    let n = props.chartData[b].Piani;
                    arr2.push(n);
                }

                if (props.target === "minuti") {
                    titolo = "Minuti di attività"
                    labelText = "Minuti di Attività";
                    let n = props.chartData[b].MinutiDiAttivitàSedentaria;
                    arr2.push(n);
                    n = props.chartData[b].MinutiDiAttivitàLeggera;
                    arr3.push(n);
                    n = props.chartData[b].MinutiDiAttivitàModerata;
                    arr4.push(n);
                    n = props.chartData[b].MinutiDiAttivitàIntensa;
                    arr5.push(n);
                }

                if (props.target === "peso") {
                    titolo = "Peso"
                    labelText = "Peso";
                    //Avolte C'È LA VIRGOLA QUINDI DEVO RISOLVERE
                    let n = "" + props.chartData[b].Peso;
                    let pos = n.indexOf(",");
                    if (pos !== -1) {
                        n = n.substring(0, pos) + "." + n.substring(pos + 1);
                    }
                    n = parseFloat(n);
                    arr2.push(n);
                }

                if (props.target === "imc") {
                    titolo = "IMC"
                    labelText = "IMC";
                    //Avolte C'È LA VIRGOLA QUINDI DEVO RISOLVERE
                    let n = "" + props.chartData[b].IMC;
                    let pos = n.indexOf(",");
                    if (pos !== -1) {
                        n = n.substring(0, pos) + "." + n.substring(pos + 1);
                    }
                    n = parseFloat(n);
                    arr2.push(n);
                }

                if (props.target === "massaGrassa") {
                    titolo = "Massa Grassa"
                    labelText = "Massa Grassa";
                    //Avolte C'È LA VIRGOLA QUINDI DEVO RISOLVERE
                    let n = "" + props.chartData[b].MassaGrassa;
                    let pos = n.indexOf(",");
                    if (pos !== -1) {
                        n = n.substring(0, pos) + "." + n.substring(pos + 1);
                    }
                    n = parseFloat(n);
                    arr2.push(props.chartData[b].MassaGrassa);
                }

                if (props.target === "caloriesXMeal") {
                    titolo = "Calorie per pasto"
                    labelText = "Calorie per pasto";
                    if (props.chartData[b].Meal === "Breakfast") {
                        arr2.push(props.chartData[b].Calories);
                    }
                    if (props.chartData[b].Meal === "Lunch") {
                        arr3.push(props.chartData[b].Calories);
                    }
                    if (props.chartData[b].Meal === "Dinner") {
                        arr4.push(props.chartData[b].Calories);
                    }
                    if (props.chartData[b].Meal === "Snacks") {
                        arr5.push(props.chartData[b].Calories);
                    }
                }

                if (props.target === "nutrientiColazione") {
                    titolo = "Nutrienti colazione"
                    labelText = "Nutrienti colazione";
                    if (props.chartData[b].Meal === "Breakfast") {
                        arr2.push(props.chartData[b].Carbs_g);
                        arr3.push(props.chartData[b].Fat_g);
                        arr4.push(props.chartData[b].Protein_g);
                        arr5.push(props.chartData[b].Sugars_g);
                        arr6.push(props.chartData[b].Fiber_g);
                        arr7.push(props.chartData[b].Cholest_mg);
                        arr8.push(props.chartData[b].Sodium_mg);
                    }
                }

                if (props.target === "nutrientiPranzo") {
                    titolo = "Nutrienti pranzo"
                    labelText = "Nutrienti pranzo";
                    if (props.chartData[b].Meal === "Lunch") {
                        arr2.push(props.chartData[b].Carbs_g);
                        arr3.push(props.chartData[b].Fat_g);
                        arr4.push(props.chartData[b].Protein_g);
                        arr5.push(props.chartData[b].Sugars_g);
                        arr6.push(props.chartData[b].Fiber_g);
                        arr7.push(props.chartData[b].Cholest_mg);
                        arr8.push(props.chartData[b].Sodium_mg);
                    }
                }

                if (props.target === "nutrientiCena") {
                    titolo = "Nutrienti cena"
                    labelText = "Nutrienti cena";
                    if (props.chartData[b].Meal === "Dinner") {
                        arr2.push(props.chartData[b].Carbs_g);
                        arr3.push(props.chartData[b].Fat_g);
                        arr4.push(props.chartData[b].Protein_g);
                        arr5.push(props.chartData[b].Sugars_g);
                        arr6.push(props.chartData[b].Fiber_g);
                        arr7.push(props.chartData[b].Cholest_mg);
                        arr8.push(props.chartData[b].Sodium_mg);
                    }
                }

                if (props.target === "nutrientiSnack") {
                    titolo = "Nutrienti snack"
                    labelText = "Nutrienti snack";
                    if (props.chartData[b].Meal === "Snacks") {
                        arr2.push(props.chartData[b].Carbs_g);
                        arr3.push(props.chartData[b].Fat_g);
                        arr4.push(props.chartData[b].Protein_g);
                        arr5.push(props.chartData[b].Sugars_g);
                        arr6.push(props.chartData[b].Fiber_g);
                        arr7.push(props.chartData[b].Cholest_mg);
                        arr8.push(props.chartData[b].Sodium_mg);
                    }
                }


                if (props.target === "minutiSleeping") {
                    titolo = "Riposo"
                    labelText = "Minuti di Attività";
                    let n = props.chartData[b].MinutiDiSonno;
                    arr2.push(n);
                    n = props.chartData[b].MinutiDiVeglia;
                    arr3.push(n);
                    n = props.chartData[b].DurataDelRiposo;
                    arr4.push(n);
                }

                if (props.target === "numeroRisvegli") {
                    titolo = "Risvegli"
                    labelText = "# Risvegli";
                    let n = props.chartData[b].NumeroDiRisvegli;
                    arr2.push(n);
                }


            }

            setCurrentState({
                chartData: {
                    labels: arr1,
                    datasets: [{
                        label: labelText,
                        data: arr2,
                        pointBackgroundColor: pointsBgColours,
                        backgroundColor: bgColour
                    }]
                },
                options: {
                    title: {
                        display: true,
                        text: titolo
                    },
                    maintainAspectRatio: false
                }
            })

            if (props.target === "minuti" || props.target === "caloriesXMeal") {
                let bgColour3 = 'rgba(229, 79, 109, 0.4)';
                let bgColour4 = 'rgba(87, 61, 28, 0.4)';
                let bgColour5 = 'rgba(40, 89, 67, 0.4)';
                let label2 = (props.target === "minuti" ? "Minuti di attività sedentaria" : "Colazione");
                let label3 = (props.target === "minuti" ? "Minuti di attività leggera" : "Pranzo");
                let label4 = (props.target === "minuti" ? "Minuti di attività moderata" : "Cena");
                let label5 = (props.target === "minuti" ? "Minuti di attività intensa" : "Snack");
                setCurrentState({
                    chartData: {
                        labels: arr1,
                        datasets: [{
                            label: label2,
                            data: arr2,
                            pointBackgroundColor: pointsBgColours,
                            backgroundColor: bgColour
                        },
                        {
                            label: label3,
                            data: arr3,
                            pointBackgroundColor: pointsBgColours,
                            backgroundColor: bgColour3
                        },
                        {
                            label: label4,
                            data: arr4,
                            pointBackgroundColor: pointsBgColours,
                            backgroundColor: bgColour4
                        },
                        {
                            label: label5,
                            data: arr5,
                            pointBackgroundColor: pointsBgColours,
                            backgroundColor: bgColour5
                        }]
                    }, options: {
                        title: {
                            display: true,
                            text: titolo,
                            fontSize: 20
                        },
                        legend: {
                            display: false
                        },
                        maintainAspectRatio: false
                    }
                })
            }

            if (props.target === "calorieBruciate") {
                let bgColour3 = 'rgba(229, 79, 109, 0.4)';
                setCurrentState({
                    chartData: {
                        labels: arr1,
                        datasets: [{
                            label: "Calorie bruciate",
                            data: arr2,
                            pointBackgroundColor: pointsBgColours,
                            backgroundColor: bgColour
                        },
                        {
                            label: "Calorie bruciate con attività fisica",
                            data: arr3,
                            pointBackgroundColor: pointsBgColours,
                            backgroundColor: bgColour3
                        }]
                    }, options: {
                        title: {
                            display: true,
                            text: titolo,
                            fontSize: 20
                        },
                        legend: {
                            display: false
                        },
                        maintainAspectRatio: false
                    }
                })
            }

            if (props.target === "nutrientiColazione" || props.target === "nutrientiPranzo" || props.target === "nutrientiCena" || props.target === "nutrientiSnack") {
                let bgColour3 = 'rgba(229, 79, 109, 0.4)';
                let bgColour4 = 'rgba(87, 61, 28, 0.4)';
                let bgColour5 = 'rgba(40, 89, 67, 0.4)';
                let bgColour6 = 'rgba(20, 59, 37, 0.4)';
                let bgColour7 = 'rgba(50, 119, 17, 0.4)';
                let bgColour8 = 'rgba(90, 59, 27, 0.4)';
                let label2 = "Carboidrati (g)";
                let label3 = "Grassi (g)";
                let label4 = "Proteine (g)";
                let label5 = "Zuccheri (g)";
                let label6 = "Fibre (g)";
                let label7 = "Colesterolo (mg)";
                let label8 = "Sodio (mg)";
                setCurrentState({
                    chartData: {
                        labels: arr1,
                        datasets: [{
                            label: label2,
                            data: arr2,
                            pointBackgroundColor: pointsBgColours,
                            backgroundColor: bgColour
                        },
                        {
                            label: label3,
                            data: arr3,
                            pointBackgroundColor: pointsBgColours,
                            backgroundColor: bgColour3
                        },
                        {
                            label: label4,
                            data: arr4,
                            pointBackgroundColor: pointsBgColours,
                            backgroundColor: bgColour4
                        },
                        {
                            label: label5,
                            data: arr5,
                            pointBackgroundColor: pointsBgColours,
                            backgroundColor: bgColour5
                        },
                        {
                            label: label6,
                            data: arr6,
                            pointBackgroundColor: pointsBgColours,
                            backgroundColor: bgColour6
                        },
                        {
                            label: label7,
                            data: arr7,
                            pointBackgroundColor: pointsBgColours,
                            backgroundColor: bgColour7
                        },
                        {
                            label: label8,
                            data: arr8,
                            pointBackgroundColor: pointsBgColours,
                            backgroundColor: bgColour8
                        }]
                    }, options: {
                        title: {
                            display: true,
                            text: titolo,
                            fontSize: 20
                        },
                        legend: {
                            display: false
                        },
                        maintainAspectRatio: false
                    }
                })
            }


            if (props.target === "minutiSleeping") {
                let bgColour3 = 'rgba(229, 79, 109, 0.4)';
                let bgColour4 = 'rgba(87, 61, 28, 0.4)';
                let label2 = "Minuti Sonno";
                let label3 = "Minuti Veglia";
                let label4 = " Durata del riposo";
                setCurrentState({
                    chartData: {
                        labels: arr1,
                        datasets: [{
                            label: label2,
                            data: arr2,
                            pointBackgroundColor: pointsBgColours,
                            backgroundColor: bgColour
                        },
                        {
                            label: label3,
                            data: arr3,
                            pointBackgroundColor: pointsBgColours,
                            backgroundColor: bgColour3
                        },
                        {
                            label: label4,
                            data: arr4,
                            pointBackgroundColor: pointsBgColours,
                            backgroundColor: bgColour4
                        }
                        ]
                    }, options: {
                        title: {
                            display: true,
                            text: titolo,
                            fontSize: 20
                        },
                        legend: {
                            display: false
                        },
                        maintainAspectRatio: false
                    }
                })
            }


        
    }, [props])
    return (
        <div className="graphActivity1">
            {currentState != null && 
                <Line
                    data={currentState.chartData}
                    options={currentState.options}
                />
            }
        </div>
    )
}

export default ChartCustom