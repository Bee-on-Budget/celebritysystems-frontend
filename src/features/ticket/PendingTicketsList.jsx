import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataList, Loading } from '../../components';
import { getPendingTickets } from '../../api/services/TicketService';

const PendingTicketsList = () => {
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchTickets = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getPendingTickets();
      setTickets(data || []);
      setFiltered(data || []);
    } catch (e) {
      setError("Failed to load pending tickets");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSearch = useCallback(
    async (query) => {
      return tickets
        .filter((ticket) =>
          ticket.title.toLowerCase().includes(query.toLowerCase()) ||
          ticket.description?.toLowerCase().includes(query.toLowerCase())
        )
        .map((t) => t.title);
    },
    [tickets]
  );

  const handleResultClick = (query) => {
    const result = tickets.filter((ticket) =>
      ticket.title.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(result);
  };

  const handleClearSearch = () => {
    setFiltered([...tickets]);
  };

  const renderTicketItem = (list) => {
    const headerStyle = "px-3 py-2 text-left text-sm font-medium text-gray-500 uppercase tracking-wider";
    const nameStyle = "px-3 py-2 text-sm text-dark font-bold";
    const bodyStyle = "px-3 py-2 text-sm text-dark max-w-xs whitespace-nowrap overflow-hidden text-ellipsis";
    const rowStyle = "h-14 hover:bg-gray-100 transition cursor-pointer";

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={`${headerStyle} w-72`}>Title</th>
              <th className={headerStyle}>Description</th>
              <th className={headerStyle}>Company</th>
              <th className={headerStyle}>Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {list.map((ticket) => (
              <tr
                key={ticket.id}
                className={rowStyle}
                onClick={() => navigate(`/tickets/pending/${ticket.id}`, { state: { ticket } })}
              >
                <td className={nameStyle}>{ticket.title}</td>
                <td className={bodyStyle} title={ticket.description}>
                  {ticket.description}
                </td>
                <td className={bodyStyle}>{ticket.companyName || 'N/A'}</td>
                <td className={bodyStyle}>
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.status === 'OPEN'
                    ? 'bg-green-100 text-green-800'
                    : ticket.status === 'IN_PROGRESS'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                    }`}>
                    {ticket.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  if (isLoading) return <Loading />;

  return (
    <DataList
      title="Pending Tickets"
      label="pending tickets"
      error={error}
      isLoading={isLoading}
      onSearch={handleSearch}
      onResultClick={handleResultClick}
      onClearSearch={handleClearSearch}
      totalElements={Array.isArray(filtered) ? filtered.length : 0}
    >
      {renderTicketItem(filtered)}
    </DataList>
  );
};

export default PendingTicketsList;
