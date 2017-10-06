import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import APIClient from '../utils/APIClient';
import PayrollInformation from '../components/PayrollInformation';
import UploadButton from '../components/UploadButton';
import UploadMessage from '../components/UploadMessage';
import { parseFile } from '../utils/payrollHelper';

const initialState = { 
  // Job groups information from the API
  jobGroups: {},
  // Initial data coming from the API
  initialData: [], 
  // Incoming data from the selected file
  incomingData: [], 
  // Is the API fetched yet?
  isInitialDataFetched: false, 
  // Should payroll information be displayed
  displayResult: false, 
  // Is there an error from uploading?
  isError: false,
  // Did the file upload successfully?
  isSuccessful: false,
  // The selected file as File object
  file: null,
};

class MainContainer extends Component {
  constructor() {
    super();
    this.state = initialState;
    this.onDrop = this.onDrop.bind(this);
    this.uploadFile = this.uploadFile.bind(this);
    this.setIncomingData = this.setIncomingData.bind(this);
    this.fetchAPI = this.fetchAPI.bind(this);
  }

  componentDidMount() {
    /* 
      Get all initial data from the API
    */
    this.fetchAPI();
  }

  async uploadFile() {
    const { file } = this.state;

    let data = new FormData();
    data.append('file', file);
    data.append('name', file.name);

    await APIClient
      .post('time_report/', data)
      .then(response => {
        this.setState({
          isSuccessful: true,
          isError: false
        });
      })
      .catch(error => { 
        // Rejected, report id the same
        console.error(error);
        this.setState({
          isError: true,
          isSuccessful: false
        });
      });
  }

  async fetchAPI() {
    // TODO: Can cache here
    let jobGroups;
    let initialData;
    await APIClient
      .get(`job_group/`)
      .then(result => {
        jobGroups = result.data;
      }); 

    await APIClient
      .get(`time_report/`)
      .then(result => {
        initialData = result.data;
      });

    // TODO: Double check if await works
    this.setState({
      jobGroups,
      initialData,
      isInitialDataFetched: true
    });
  }

  setIncomingData(incomingData) {
    // If theres no error from the previous step, set the state
    this.setState({ incomingData });
  }

  async onDrop(fileArray) {
    // Get the file that was dropped
    const file = fileArray[0];

    // Attempt to parse the file
    await parseFile(file, this.setIncomingData);

    // Set state to display result
    this.setState({
      file,
      displayResult: true,
    });
  }

  render() {
    const { 
      initialData,
      incomingData,
      jobGroups,
      isInitialDataFetched,
      isError,
      isSuccessful,
      displayResult
    } = this.state;
    
    return (
      <div>
        { isInitialDataFetched 
          ? <div>
              <Dropzone 
                accept="text/csv" 
                onDrop={this.onDrop}
                style={{"width" : "100%", "height" : "20%", "border" : "1px dashed #454545"}}
              >
                <p style={{ textAlign: "center" }}>Pick file by clicking on box or dragging your file directly to the dashed box.</p>
              </Dropzone>

              { displayResult 
                ? <div>
                    <PayrollInformation 
                      existingTimeReports={initialData}
                      incomingTimeReports={incomingData}
                      jobGroups={jobGroups}
                    />
                    <UploadButton
                      uploadFile={this.uploadFile}
                    />
                    <UploadMessage 
                      isError={isError}
                      isSuccessful={isSuccessful}
                    />
                  </div>
              : null
            }
          </div>
          : null
        }
        <br />
      </div>
    );
  }
}

export default MainContainer;
