import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataList, Pagination } from '../../components';
import { getAllTickets } from '../../api/services/TicketService';
import { useTranslation } from 'react-i18next';

const TicketList = () => {
  const { t } = useTranslation();
  const [tickets, setTickets] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const navigate = useNavigate();

  const fetchTickets = useCallback(async (page = 0) => {
    setIsLoading(true);
    try {
      const data = await getAllTickets({ page, size: pageSize });
      setTickets(data || []);
      setFiltered(data || []);
      setTotalPages(data.totalPages);
      setTotalTickets(data.totalElements);
      setCurrentPage(data.pageNumber);
      setPageSize(data.pageSize);
    } catch (e) {
      setError(t('tickets.messages.errorFetchingTickets'));
    } finally {
      setIsLoading(false);
    }
  }, [pageSize, t]);

  useEffect(() => {
    fetchTickets(currentPage);
  }, [currentPage, fetchTickets]);

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
    const headerStyle = "px-3 py-2 text-start text-sm font-medium text-gray-500 uppercase tracking-wider";
    const nameStyle = "px-3 py-2 text-sm text-dark font-bold";
    const bodyStyle = "px-3 py-2 text-sm text-dark max-w-xs whitespace-nowrap overflow-hidden text-ellipsis";
    const rowStyle = "h-14 hover:bg-gray-100 transition cursor-pointer";

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={`${headerStyle} w-72`}>{t('tickets.table.title')}</th>
              <th className={headerStyle}>{t('tickets.table.description')}</th>
              <th className={headerStyle}>{t('tickets.table.company')}</th>
              <th className={headerStyle}>{t('tickets.table.status')}</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {list.map((ticket) => (
              <tr
                key={ticket.id}
                className={rowStyle}
                onClick={() => navigate(`/tickets/${ticket.id}`, { state: { ticket } })}
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

  return (
    <DataList
      title={t('tickets.ticketsListTitle')}
      label="tickets"
      error={error}
      isLoading={isLoading}
      onSearch={handleSearch}
      onResultClick={handleResultClick}
      onClearSearch={handleClearSearch}
      totalElements={Array.isArray(filtered) ? filtered.length : 0}
    >
      {renderTicketItem(filtered)}
      {
        tickets.length > pageSize && <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalTickets}
          itemsPerPage={pageSize}
          onPageChange={(newPage) => {
            if (newPage >= 0 && newPage < totalPages) {
              setCurrentPage(newPage);
            }
          }}
          className={"mt-8"}
        />
      }
    </DataList>
  );
};

export default TicketList;