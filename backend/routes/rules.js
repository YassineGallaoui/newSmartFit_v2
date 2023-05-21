const router = require('express').Router();
let Rules = require('../models/rule.model');
//const rules = require('../models/rule.model');

//QUANDO VOGLIO VISUALIZZARE LA LISTA DI RULES
router.route('/').get((req, res) => {
    Rules.find()
    .then(rules => res.json(rules))
    .catch(err => res.status(400).json('Error: '+err));
})

//QUANDO VISUALIZZO UNA SINGOLO REGOLA... non dovrebbe servire
router.route('/:id').get((req,res) => {
    Rules.findById(req.params.id)
    .then(rules => res.json(rules))
    .catch(err => res.status(400).json('Error: '+err));
})

// AGGIUNTA DI UNA SINGOLA REGOLA
router.route('/add').post((req,res) => {
    const athletesId = req.body.athletesId;
    const suggestedAthletesId = req.body.suggestedAthletesId;
    const name = req.body.name;
    const message = req.body.message;
    const conditions = req.body.conditions;
    const temporalConditions = req.body.temporalConditions;
    const newRule = new Rules({
        name,
        athletesId,
        suggestedAthletesId,
        conditions,
        temporalConditions,
        message
    });

    newRule.save()
    .then(() => res.json('Rule added!'))
    .catch(err => res.status(400).json('Error: '+ err));
})

// QUANDO SI VOGLIONO MODIFICARE LE INFORMAZIONI DI UNA SINGOLA REGOLA
router.route('/update/:id').post((req,res) => {
    Rules.findById(req.params.id)
    .then(rules => {
        rules.athletesId = req.body.athletesId;
        rules.suggestedAthletesId = req.body.suggestedAthletesId;
        rules.name = req.body.name;
        rules.message = req.body.message;
        rules.conditions = req.body.conditions;
        rules.temporalConditions = req.body.temporalConditions;

        rules.save()
        .then(() => res.json('Rule updated!'))
        .catch(err => res.status(400).json('Error: '+err));
    })
    .catch(err => res.status(400).json('Error: '+err));
})

// RIMOZIONE DI UNA SINGOLO REGOLA
router.route('/:id').delete((req,res) => {
    Rules.findByIdAndDelete(req.params.id)
    .then(() => res.json("Rule deleted from database!"))
    .catch(err => res.status(400).json('Error: '+err));
})

module.exports = router;