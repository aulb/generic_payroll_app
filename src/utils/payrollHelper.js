import Papa from 'papaparse';

/*
	Utilities needed to parse and transform data are all in this file.
	TODO: More separation and modularization is good.
*/

class SimpleEmployeeRecord {
	/*
		Simple class to hold the employee id and job group. Using this for the toString() repr.
	*/
	constructor(employeeId, jobGroup, hours_worked) {
		this.employeeId = employeeId;
		this.jobGroup = jobGroup;
	}

	toString() {
		return `${this.employeeId},${this.jobGroup}`;
	}
}

export const getDaysInMonth = (date) => {
	/*
		Get the number of days in a month given a date object.
	*/
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth();
	const dummy = new Date(year, month + 1, 0);
	return dummy.getDate();
}

export const formatPayrollDate = (date) => {
	/*
		Get a YYYY/MM/DD representation of date object.
	*/
	let mm = date.getUTCMonth() + 1;
	let dd = date.getUTCDate();

	return [
		date.getUTCFullYear(), 
		`${(mm > 9 ? '' : '0')}${mm}`,
		`${(dd > 9 ? '' : '0')}${dd}`
	].join('/');
}

export const getEarliestAndLatestDatesFrom = (timeReports) => {
	/*
		Takes an array of time reports and find the earliest and latest date as date object.
		timereport := {
			job_group,
			employee_id,
			report_id,
			date,
			hours_worked,
		}
	*/
	let earliestDate = new Date(timeReports[0]['date']);
	let latestDate = new Date(timeReports[0]['date']);

	for (let i = 1; i < timeReports.length; i++) {
		let currentDate = new Date(timeReports[i]['date']);
		if (earliestDate > currentDate) earliestDate = currentDate;
		if (latestDate < currentDate) latestDate = currentDate;
	}

	earliestDate = earliestDate;
	latestDate = latestDate;
	return {earliestDate, latestDate};
}

export const getStartingAndEndDatesForPayPeriod = (date) => {
	/*
		Takes a date object and find the pay period (date objects) it belongs, 
		i.e: first or second half of month.
	*/
	const year = date.getUTCFullYear();
	const month = date.getUTCMonth();
	const check = new Date(year, month, 15);
	let startingDay;
	let endingDay;

	if (date > check) {
		// First half of the month pay period
		startingDay = 1;
		endingDay = 15;
	} else {
		// Second half of the month pay period
		startingDay = 16;
		endingDay = getDaysInMonth(date); // Days in month
	}

	const startingDate = new Date(year, month, startingDay);
	const endingDate = new Date(year, month, endingDay);
	return {startingDate, endingDate};
}

export const getPayPeriod = (date) => {
	/*
		Takes a date object and find the STRING representation of the pay period.
		e.g: new Date(2017,1,1) -> '2017/01/01 - 2017/01/15'
	*/
	const { startingDate, endingDate } = getStartingAndEndDatesForPayPeriod(date);
	const startingDateString = formatPayrollDate(startingDate);
	const endingDateString = formatPayrollDate(endingDate);

	return `${startingDateString} - ${endingDateString}`;
}

export const getEmployeeIdJobGroup = (string) => {
	/*
		Splits a string of format '{employeeId},{jobGroup}'.
	*/
	const splittedString = string.split(',');
	const employeeId = splittedString[0];
	const jobGroup = splittedString[1];
	return { employeeId, jobGroup };
}

const transformJobGroupToDictionary = (jobGroup) => {
	/*
		Takes a job group array and transforms it into a dictionary for fast lookup.
		[{
			'job_group': '__some_job_group__',
			'rate': __some_rate__
		}] 
			=> 
		{ '__some_job_group__' : __some_rate__}
	*/
	let jobGroupDictionary = {};
	for (let i = 0; i < jobGroup.length; i++) {
		jobGroupDictionary[jobGroup[i]['job_group']] = jobGroup[i]['rate'];
	}
	return jobGroupDictionary;
}

export const extractPayrollInformation = (timeReports, jobGroup) => {
	/*
		Extracts data from an array of time report objects and job group
		and transform it to...
		[
			{employeeId, payPeriod, amountPaid},
			{...}
			...
		]
	*/
	const jobGroupDictionary = transformJobGroupToDictionary(jobGroup);
	
	const createPayrollInformation = (record) => {
		let payrollInformation = [];
		for (let payPeriod in record) {
			let currentPayPeriod = record[payPeriod];
			for (let keyString in currentPayPeriod) {
				let { employeeId, jobGroup } = getEmployeeIdJobGroup(keyString);
				let amountPaid = jobGroupDictionary[jobGroup] * currentPayPeriod[keyString];
				let payrollData = {
					'amountPaid': amountPaid,
					'employeeId': employeeId,
					'payPeriod': payPeriod,
				}
				payrollInformation.push(payrollData);
			}
		}
		return payrollInformation;
	}

	let record = {};
	const { earliestDate, latestDate } = getEarliestAndLatestDatesFrom(timeReports);

	for (let i = 0; i < timeReports.length; i++) {
		let timeReport = timeReports[i];
		let currentEmployeeId = timeReport['employee_id'];
		let currentPayPeriod = getPayPeriod(new Date(timeReport['date']));
		let currentJobGroup = timeReport['job_group'];
		let currentEmployeeRecord = new SimpleEmployeeRecord(currentEmployeeId, currentJobGroup);

		// Job groups may be different for different pay periods
		if (currentPayPeriod in record) {
			if (currentEmployeeRecord in record[currentPayPeriod]) {
				record[currentPayPeriod][currentEmployeeRecord] += timeReport['hours_worked'];
			} else {
				record[currentPayPeriod][currentEmployeeRecord] = timeReport['hours_worked'];
			}
		} else {
			// Initialize pay period as object
			record[currentPayPeriod] = {};
			// Initialize pay period for specific employee
			record[currentPayPeriod][currentEmployeeRecord] = timeReport['hours_worked'];
		}
	}

	return createPayrollInformation(record);
}

/* TODO: 
	Clean up, better this function 
	Very specific, refactoring needed.
*/
export const parsePapaDataToTimeReport = (papaData) => {
	/*
		Takes Papadata and make a time report object.
		Papadata := {
			'data': [[row1], ..., [rowN]],
			'error': ...
			...
		}
			=>
		TimeReport := {
			'report_id': ... same as above ...
		}
	*/
	const eliminateEmptyRows = (papaData) => {
		let data = [];
		// Get rid dataof possible empty lines
		for (let i = 0; i < papaData['data'].length; i++) {
			let current = papaData['data'][i];
			if (current.length !== 1) {
				data.push(papaData['data'][i]);
			}
		}
		return data;
	}

	const data = eliminateEmptyRows(papaData);
	const headers = data.splice(0, 1);
	const reportId = data.splice(data.length - 1, 1)[0][1];
	let timeReport = [];

	for (let i = 0; i < data.length; i++){
		let currentData = data[i];
		let date = currentData[0].split('/');

		let constructedData	= {
			'report_id': parseInt(reportId),
			'employee_id': parseInt(currentData[2]),
			'job_group': currentData[3],
			'hours_worked': parseFloat(currentData[1]),
			'date': `${date[2]}-${date[1]}-${date[0]}`,
		};
		timeReport.push(constructedData);
	}
	return timeReport;
}

export const parseFile = (file, callback) => {
	/*
		Parses file (csv) using Papaparse library and 
		send the data back to the callback.
	*/
	const reader = new FileReader();

	// Callback when it is done
	reader.onload = (event) => {
		const text = event.target.result;
		const papaData = Papa.parse(text);
		const data = parsePapaDataToTimeReport(papaData);
		callback(data);
	};

	reader.readAsText(file); // UTF-8 by default
}
