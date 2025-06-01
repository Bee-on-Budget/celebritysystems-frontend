// src/components/tickets/TicketDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getTicketById, deleteTicket } from "./TicketService";
import { addAttachment, deleteAttachment } from "./TicketService";

const TicketDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attachments, setAttachments] = useState([]);
  const [newAttachment, setNewAttachment] = useState(null);
  const [note, setNote] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const data = await getTicketById(id);
        setTicket(data);
        if (data.attachments) {
          setAttachments(data.attachments);
        }
      } catch (error) {
        console.error("Error loading ticket:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicket();
  }, [id]);

  const handleFileChange = (e) => {
    setNewAttachment(e.target.files[0]);
  };

  const handleAddAttachment = async () => {
    if (!newAttachment) return;
    
    try {
      const attachment = await addAttachment(ticket.id, newAttachment, note);
      setAttachments([...attachments, attachment]);
      setNewAttachment(null);
      setNote("");
    } catch (error) {
      console.error("Error adding attachment:", error);
    }
  };

  const handleDeleteAttachment = async (attachmentId) => {
    try {
      await deleteAttachment(attachmentId);
      setAttachments(attachments.filter(a => a.id !== attachmentId));
    } catch (error) {
      console.error("Error deleting attachment:", error);
    }
  };

  const handleDeleteTicket = async () => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    
    setIsDeleting(true);
    try {
      await deleteTicket(id);
      navigate('/tickets');
    } catch (error) {
      console.error("Error deleting ticket:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="p-4">Loading ticket details...</div>;
  if (!ticket) return <div className="p-4">Ticket not found.</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">{ticket.title}</h1>
          <p className="text-sm text-gray-500 mt-1">
            Created: {new Date(ticket.createdAt).toLocaleString()} | Status: 
            <span className={`ml-1 px-2 py-1 text-xs rounded-full ${
              ticket.status === 'Open' ? 'bg-blue-100 text-blue-800' :
              ticket.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
              'bg-green-100 text-green-800'
            }`}>
              {ticket.status}
            </span>
          </p>
          {ticket.attachmentFileName && (
            <p className="text-sm text-gray-500 mt-1">
              Attachment: {ticket.attachmentFileName}
            </p>
          )}
        </div>
        <button
          onClick={handleDeleteTicket}
          disabled={isDeleting}
          className="bg-red-600 text-white px-3 py-1 rounded-md text-sm hover:bg-red-700 disabled:opacity-70"
        >
          {isDeleting ? 'Deleting...' : 'Delete Ticket'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold mb-3">Description</h2>
        <p className="text-gray-700 whitespace-pre-line">{ticket.description}</p>
        
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          {ticket.companyId && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Company ID</h3>
              <p>{ticket.companyId}</p>
            </div>
          )}
          {ticket.screenId && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Screen ID</h3>
              <p>{ticket.screenId}</p>
            </div>
          )}
          {ticket.assignedToWorkerId && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Assigned to Worker</h3>
              <p>{ticket.assignedToWorkerId}</p>
            </div>
          )}
          {ticket.assignedBySupervisorId && (
            <div>
              <h3 className="text-sm font-medium text-gray-500">Assigned by Supervisor</h3>
              <p>{ticket.assignedBySupervisorId}</p>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold mb-3">Attachments</h2>
        
        {attachments.length === 0 ? (
          <p className="text-gray-500">No attachments yet.</p>
        ) : (
          <div className="space-y-3">
            {attachments.map(attachment => (
              <div key={attachment.id} className="flex justify-between items-center p-3 border rounded-md">
                <div>
                  <p className="font-medium">{attachment.filePath || "Attachment"}</p>
                  {attachment.note && <p className="text-sm text-gray-500">{attachment.note}</p>}
                  <p className="text-xs text-gray-400">
                    Uploaded: {new Date(attachment.uploadedAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <a 
                    href={`/api/attachments/${attachment.id}`} 
                    download
                    className="text-blue-600 hover:text-blue-800 text-sm"
                  >
                    Download
                  </a>
                  <button
                    onClick={() => handleDeleteAttachment(attachment.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 border-t pt-4">
          <h3 className="text-md font-medium mb-3">Add New Attachment</h3>
          <div className="space-y-3">
            <div>
              <input 
                type="file" 
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full border border-gray-300 px-3 py-2 rounded-md text-sm"
                placeholder="Optional description"
              />
            </div>
            <button
              onClick={handleAddAttachment}
              disabled={!newAttachment}
              className={`px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 ${!newAttachment ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              Upload Attachment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetail;