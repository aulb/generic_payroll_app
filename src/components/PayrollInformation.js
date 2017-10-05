import React from 'react';
import PropTypes from 'prop-types';
import ReactTable from 'react-table';

import { extractPayrollInformation } from '../utils/payrollHelper';
import 'react-table/react-table.css';

const payrollColumnConfig = [
  { 
    Header: 'Employee ID',
    accessor: 'employeeId',
  },
  {
    Header: 'Pay Period',
    accessor: 'payPeriod',
  },
  {
    Header: 'Amount Paid',
    accessor: 'amountPaid'
  }
];

const payrollDefaultSort = [
  {
    id: 'employeeId',
    desc: false,
  },
  {
    id: 'payPeriod',
    desc: false,
  }
];

function PayrollInformation({ 
  existingTimeReports,
  incomingTimeReports,
  jobGroups
}) {
  const consolidatedTimeReports = existingTimeReports.concat(incomingTimeReports);
  const data = extractPayrollInformation(consolidatedTimeReports, jobGroups);
  return (
    <div>
      <ReactTable
        data={data}
        columns={payrollColumnConfig}
        defaultSorted={payrollDefaultSort}
        defaultPageSize={10}
        className='-striped -highlight'
      />
      <br />
      <div style={{ textAlign: "center" }}>
        <em>Tip: Hold shift when sorting to multi-sort!</em>
      </div> 
    </div>
  );
}

PayrollInformation.propTypes = {
  existingTimeReports: PropTypes.array.isRequired,
  incomingTimeReports: PropTypes.array.isRequired,
  jobGroups: PropTypes.array.isRequired,
};

export default PayrollInformation;
