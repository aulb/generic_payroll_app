import React from 'react';
import PropTypes from 'prop-types';

function UploadMessage({ isError, isSuccessful }) {
  return (
    <div style={{ textAlign: "center" }}>
    { isError
      ? <p>The file you are trying to upload has the same report id. Please try again by pressing the reset button.</p>
      : null
    }
    { isSuccessful
      ? <p>The file uploaded successfully. Lets build more features together :)</p>
      : null
    }
    </div>
  );
}

UploadMessage.propTypes = {
  isError: PropTypes.bool.isRequired,
  isSuccessful: PropTypes.bool.isRequired,
}

export default UploadMessage;
