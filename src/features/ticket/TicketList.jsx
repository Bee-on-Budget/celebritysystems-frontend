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

  if (loading) return <div className="p-4">Loading tickets...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">All Tickets</h2>
        <Link
          to="/tickets/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
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
            <div key={ticket.id} className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <Link to={`/tickets/${ticket.id}`} className="block">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-blue-700 hover:underline">{ticket.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{ticket.description.substring(0, 100)}...</p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    ticket.status === 'Open' ? 'bg-blue-100 text-blue-800' :
                    ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {ticket.status}
                  </span>
                </div>
                <div className="mt-3 flex items-center text-sm text-gray-500">
                  <span>Created: {new Date(ticket.createdAt).toLocaleString()}</span>
                  {ticket.companyId && (
                    <span className="ml-4">Company ID: {ticket.companyId}</span>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TicketList;