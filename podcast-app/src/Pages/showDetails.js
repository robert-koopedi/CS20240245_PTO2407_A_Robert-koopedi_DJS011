import React from 'react';
import { useParams } from 'react-router-dom';

export default function ShowDetails() {
  const { id } = useParams();
  return <h1>Show Details for ID: {id}</h1>;
}