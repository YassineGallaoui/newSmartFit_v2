const router = require('express').Router();
let Athlete = require('../models/athlet.model');
//const athlete = require('../models/athlet.model');

//WARNING: L'ORDINE DELLE CHIAMATE È FONDAMENTALE! LASCIARE QUELLE CON :ID ALLA FINE.

//QUANDO VOGLIO VISUALIZZARE LA LISTA DI ATLETI
router.route('/').get((req, res) => {    
    Athlete.find()
    .then(athlete => {res.json(athlete);})
    .catch(err => {res.status(400).json('Error: '+err); console.log('richiesta fatta con errore')});
})

router.route('/ask').post((req, res) => {
    const tipo = req.body.tipo;
    let valCal = "";
    if( tipo==="mfp.CaloriesBreakfast" ) valCal="Breakfast"
    if( tipo==="mfp.CaloriesLunch" ) valCal="Lunch"
    if( tipo==="mfp.CaloriesDinner" ) valCal="Dinner"
    if( tipo==="mfp.CaloriesSnacks" ) valCal="Snacks"

    const op = req.body.op;
    const val1 = req.body.value1;
    const val2 = req.body.value2;
    if(op === "===") {
        if(valCal !== ""){
            Athlete.find({ 'mfp': { $elemMatch: {'Meal': { $eq: valCal}, 'Calories': { $eq: val1 } } } })
            .then(athlete => res.json(athlete))
            .catch(err => res.status(400).json('Error: '+err));    
        } else {
            Athlete.find({ [tipo] : { $eq: val1 } })
            .then(athlete => res.json(athlete))
            .catch(err => res.status(400).json('Error: '+err));
        }
    }
    if(op === "!==") {
        if(valCal !== ""){
            Athlete.find({ 'mfp': { $elemMatch: {'Meal': { $eq: valCal}, 'Calories': { $ne: val1 } } } })
            .then(athlete => res.json(athlete))
            .catch(err => res.status(400).json('Error: '+err));
        } else {
            Athlete.find({ [tipo] : { $ne: val1 } })
            .then(athlete => res.json(athlete))
            .catch(err => res.status(400).json('Error: '+err));
        }
    }
    if(op === ">") {
        if(valCal !== "") {
            Athlete.find({ 'mfp.Meal': { $eq: valCal }, 'mfp.Calories' : { $gte: val1 } })
            Athlete.find({ 'mfp': { $elemMatch: {'Meal': { $eq: valCal}, 'Calories': { $gte: val1 } } } })
            .then(athlete => res.json(athlete))
            .catch(err => res.status(400).json('Error: '+err));
        } else {
            Athlete.find({ [tipo] : { $gte: val1 } })
            .then(athlete => res.json(athlete))
            .catch(err => res.status(400).json('Error: '+err));
        }
    }
    if(op === "<") {
        if(valCal !== "") {
            Athlete.find({ 'mfp': { $elemMatch: {'Meal': { $eq: valCal}, 'Calories': { $lte: val1 } } } })
            .then(athlete => res.json(athlete))
            .catch(err => res.status(400).json('Error: '+err));
        } else {
            Athlete.find({ [tipo] : { $lte: val1 } })
            .then(athlete => res.json(athlete))
            .catch(err => res.status(400).json('Error: '+err));
        }
    }
    if(op === "><") {
        if(valCal !== "") {
            Athlete.find({ 'mfp': { $elemMatch: {'Meal': { $eq: valCal}, 'Calories': { $gte: val1, $lte: val2 } } } })
            .then(athlete => res.json(athlete))
            .catch(err => res.status(400).json('Error: '+err));
        } else {
            Athlete.find({ [tipo] : { $gte: val1, $lte: val2 } })
            .then(athlete => res.json(athlete))
            .catch(err => res.status(400).json('Error: '+err));
        }
    }
    
})

//QUANDO VISUALIZZO UN SINGOLO ATLETA
router.route('/:id').get((req,res) => {
    Athlete.findById(req.params.id)
    .then(athlete => res.json(athlete))
    .catch(err => res.status(400).json('Error: '+err));
})


module.exports = router;
