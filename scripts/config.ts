import 'dotenv/config';

import Database from 'better-sqlite3';
import prompts from 'prompts';

const temperatureAndHumidityQuestions: Array<prompts.PromptObject> = [
	{
		type: 'number',
		name: 'TEMPERATURE_MIN',
		message: 'What is the minimum temperature?',
	},
	{
		type: 'number',
		name: 'TEMPERATURE_MAX',
		message: 'What is the maximum temperature?',
	},
	{
		type: 'number',
		name: 'TEMPERATURE_SUFFICIENT',
		message: 'What is the sufficient temperature?',
	},
	{
		type: 'number',
		name: 'HUMIDITY_MIN',
		message: 'What is the minimum humidity?',
	},
	{
		type: 'number',
		name: 'HUMIDITY_MAX',
		message: 'What is the maximum humidity?',
	},
	{
		type: 'number',
		name: 'HUMIDITY_SUFFICIENT',
		message: 'What is the sufficient humidity?',
	},
];

const taskQuestions: Array<prompts.PromptObject> = [
	{
		type: 'toggle',
		name: 'TASK_CLIMATE_CONTROL',
		message: 'Do you want to enable climate control?',
		initial: true,
		active: 'yes',
		inactive: 'no',
	},
	{
		type: 'toggle',
		name: 'TASK_CLIMATE_LOG',
		message: 'Do you want to enable climate log?',
		initial: true,
		active: 'yes',
		inactive: 'no',
	},
	{
		type: 'toggle',
		name: 'TASK_LOG_BROOM',
		message: 'Do you want to enable log broom?',
		initial: true,
		active: 'yes',
		inactive: 'no',
	},
];

const graphQuestions: Array<prompts.PromptObject> = [
	{
		type: 'number',
		name: 'GRAPH_TEMPERATURE_MIN',
		message: 'What is the minimum temperature for the graph?',
	},
	{
		type: 'number',
		name: 'GRAPH_TEMPERATURE_MAX',
		message: 'What is the maximum temperature for the graph?',
	},
	{
		type: 'number',
		name: 'GRAPH_HUMIDITY_MIN',
		message: 'What is the minimum humidity for the graph?',
	},
	{
		type: 'number',
		name: 'GRAPH_HUMIDITY_MAX',
		message: 'What is the maximum humidity for the graph?',
	},
];

const outletSlots = [
	['Light', 'OUTLET_SLOT_LIGHT'],
	['Ventilator', 'OUTLET_SLOT_VENTILATOR'],
	['Humidifier', 'OUTLET_SLOT_HUMIDIFIER'],
	['Fan', 'OUTLET_SLOT_FAN'],
];
const outletOptions = [
	{ title: '1', value: 1 },
	{ title: '2', value: 2 },
	{ title: '3', value: 3 },
	{ title: '4', value: 4 },
];

(async () => {
	const response1 = await prompts(temperatureAndHumidityQuestions);
	const response2 = await prompts(taskQuestions);
	const response3 = await prompts(graphQuestions);
	const result = {
		...response1,
		...response2,
		...response3,
	};

	for (const [componentName, dbVariable] of outletSlots) {
		const response = await prompts({
			type: 'select',
			name: dbVariable,
			message: `What is the outlet slot for ${componentName}?`,
			choices: outletOptions,
		});
		const value = response[dbVariable];
		result[dbVariable] = value;
		outletOptions.splice(
			outletOptions.findIndex((option) => option.value === value),
			1,
		);
	}

	const db = new Database(process.env.DB_NAME);
	const stmt = db.prepare(`
		INSERT INTO config (key, value)
		VALUES (?, ?)
		ON CONFLICT (key)
		DO UPDATE SET value = excluded.value
	`);
	for (const [key, value] of Object.entries(result)) {
		stmt.run(key, value);
	}

	console.log(result);
	console.log('Done');
})();
