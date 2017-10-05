import React from 'react';
import PropTypes from 'prop-types';

function UploadButton({ uploadFile }) {
  return (
    <div
      onClick={uploadFile}
      className="button -regular"
      role="button"
      aria-pressed="true"
      tabIndex={0}
    >
      Upload File
    </div>
  );
}

UploadButton.propTypes = {
  uploadFile: PropTypes.func.isRequired,
}

export default UploadButton;
