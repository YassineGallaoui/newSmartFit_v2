const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var conditionsSchema = new Schema({
	link : String,
	operator : String,
	type: String,
	value1 : String,
	value2 : String
  });

var temporalConditionsSchema = new Schema({
	temporalLink : String,
	temporalOperator : String,
	temporalItem: String,
	temporalValue1 : String,
	temporalValue2 : String
  });

const ruleSchema = new Schema({
	name: String,
	message: String,
	athletesId: [String],
	suggestedAthletesId: [String],
	conditions: [conditionsSchema],
	temporalConditions: [temporalConditionsSchema]
})

const rule = mongoose.model('rules', ruleSchema);

module.exports = rule;