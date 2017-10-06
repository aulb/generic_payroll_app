/*
	Cut, should've started from the beginning.
*/
import React from 'react';
import PayrollInformation from '../components/PayrollInformation';

const dummyExistingTimeReportSingle = [
	{
		'report_id': 1,
		'employee_id': 1,
		'job_group': 'A',
		'date': '2017-01-01',
		'hours_worked': 10000,
	}
];

const dummyJobGroup = [
	{
		'job_group': 'A',
		'rate': 20,
	}
];

/*
	Considering that data passed down and uploaded are all valid.
*/

// Empty props should render payroll information no matter what
describe('<PayrollInformation /> empty props', () => {
	const wrapper = shallow(<PayrollInformation 
		existingTimeReports={[]}
		incomingTimeReports={[]}
		jobGroups={[]}
	/>);

	it('Should render with empty props', () => {});
	// TODO: https://stackoverflow.com/questions/35304866/how-to-test-if-a-react-component-contains-another-component-with-tape-and-enzyme
});

// Incoming data should have 
describe('<PayrollInformation /> incoming data empty', () => {
	const wrapper = shallow(<PayrollInformation 
		existingTimeReports={dummyExistingTimeReportSingle}
		incomingTimeReports={[]}
		jobGroups={dummyJobGroup}
	/>);

	it('Should render with empty incoming data (empty csv file)',  () => {});
	// TODO: https://stackoverflow.com/questions/35304866/how-to-test-if-a-react-component-contains-another-component-with-tape-and-enzyme
});
