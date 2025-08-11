import React from 'react';

function ResumeCard({ fileName }) {
 
  return (
    <div className="card shadow-sm mb-3">
      <div className="card-body">
        <h5 className="card-title">Uploaded File</h5>
        <p className="card-text text-muted">{fileName}</p>
      </div>
    </div>
  );
}

export default ResumeCard;