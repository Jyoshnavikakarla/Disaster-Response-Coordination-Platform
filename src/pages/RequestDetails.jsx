import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const RequestDetails = () => {
  const { id } = useParams();
  const [request, setRequest] = useState(null);

  useEffect(() => {
    const fetchRequest = async () => {
      const token = localStorage.getItem("token");
      const res = await fetch(`/api/requests/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRequest(data);
    };
    fetchRequest();
  }, [id]);

  if (!request) return <p>Loading...</p>;

  return (
    <div className="request-details">
      <h2>Request Details</h2>
      <p><b>Type:</b> {request.type}</p>
      <p><b>Status:</b> {request.status}</p>
      <p><b>Location:</b> {request.location}</p>
      <p><b>Description:</b> {request.description}</p>
    </div>
  );
};

export default RequestDetails;
