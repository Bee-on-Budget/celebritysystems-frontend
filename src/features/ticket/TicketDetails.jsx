// src/components/tickets/TicketDetail.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTicketById, deleteTicket } from "./TicketService";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await getTicketById(id);
        setTicket(data);
      } catch (error) {
        console.error("Error loading ticket:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTicket();
  }, [id]);

  const handleDeleteTicket = async () => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    setIsDeleting(true);
    try {
      await deleteTicket(id);
      navigate("/tickets");
    } catch (error) {
      console.error("Error deleting ticket:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="p-6 text-center text-gray-600">Loading ticket details...</div>;
  if (!ticket) return <div className="p-6 text-center text-red-600">Ticket not found.</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">{ticket.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Created: {new Date(ticket.createdAt).toLocaleString()}
          </p>
          <span
            className={`inline-block mt-2 px-3 py-1 text-sm rounded-full font-medium ${
              ticket.status === "OPEN"
                ? "bg-blue-100 text-blue-800"
                : ticket.status === "IN_PROGRESS"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-green-100 text-green-800"
            }`}
          >
            {ticket.status}
          </span>
        </div>
        <button
          onClick={handleDeleteTicket}
          disabled={isDeleting}
          className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 disabled:opacity-60"
        >
          {isDeleting ? "Deleting..." : "Delete Ticket"}
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{ticket.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-700">
          {/* <div><strong>Created By:</strong> {ticket.createdBy}</div> */}
          <div><strong>Assigned To:</strong> {ticket.assignedToWorkerName || "N/A"}</div>
          <div><strong>Assigned By:</strong> {ticket.assignedBySupervisorName || "N/A"}</div>
          <div><strong>Company:</strong> {ticket.companyName || "N/A"}</div>
          <div><strong>Screen:</strong> {ticket.screenName || "N/A"}</div>
          {ticket.attachmentFileName && (
            <div className="md:col-span-2">
              <strong>Attachment:</strong> {ticket.attachmentFileName}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;
