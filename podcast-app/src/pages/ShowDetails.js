import React from 'react';
import { useParams } from 'react-router-dom';

function ShowDetails() {
  const { id } = useParams();

  return (
    <div>
      <h1>Show Details for ID: {id}</h1>
      {/* Fetch and display show details here */}
    </div>
  );
}

export default ShowDetails;
