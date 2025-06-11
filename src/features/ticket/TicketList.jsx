// src/components/tickets/TicketList.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllTickets } from "./TicketService";

const TicketList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const data = await getAllTickets();
        setTickets(data);
      } catch (error) {
        console.error("Error loading tickets:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-600">Loading tickets...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Tickets</h2>
        <Link
          to="/tickets/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Create Ticket
        </Link>
      </div>

      {tickets.length === 0 ? (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600">No tickets found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <Link
              key={ticket.id}
              to={`/tickets/${ticket.id}`}
              className="block bg-white p-5 rounded-lg shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold text-blue-700 hover:underline">
                {ticket.title}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {ticket.description?.substring(0, 100)}...
              </p>
              <p className="text-sm text-gray-500 mt-2">
                <strong>Company:</strong> {ticket.companyName || "N/A"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;
