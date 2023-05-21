const mongoose = require('mongoose');

const Schema = mongoose.Schema;

var mfpSchema = new Schema({
	Data: String,
	Meal: String,
	Calories: Number,
	Carbs: Number,
	Fat: Number,
	Protein: Number,
	Cholest: Number,
	Sodium: Number,
	Sugars: Number,
	Fiber: Number
  });

var activitySchema = new Schema({
	Data: String,
	CalorieBruciate: Number,
	Passi: Number,
	Distanza: String,
	Piani: Number,
	MinutiDiAttivitàSedentaria: Number,
	MinutiDiAttivitàLeggera: Number,
	MinutiDiAttivitàModerata: Number,
	MinutiDiAttivitàIntensa: Number,
	CalorieAttività: Number
  });

var bodySchema = new Schema({
	Data: String,
	Peso: String,
	IMC: String,
	Massa_grassa: Number
  });

var sleepSchema = new Schema({
	Data: String,
	MinutiDiSonno: Number,
	MinutiDiVeglia: Number,
	NumeroDiRisvegli: Number,
	DurataDelRiposo: Number
  });

var moodSchema = new Schema({
	Data: String,
	Time: String,
	Mood: Number
  });

const athletSchema = new Schema({
    id: Number,
	name: String,
	weight: Number,
	height: Number,
	dob: String,
	mfp: [mfpSchema],
	activity: [activitySchema],
	body: [bodySchema],
	sleep:[sleepSchema],
	mood:[moodSchema],
})

const athlet = mongoose.model('athletes', athletSchema);

module.exports = athlet;