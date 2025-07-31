import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import { FaUser, FaClock, FaHistory } from 'react-icons/fa';
import { getData } from '../../../utils/api';
import { format, startOfToday, startOfMonth, endOfMonth, startOfYear, endOfYear } from 'date-fns';

function HistoryLogs() {
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [total, setTotal] = useState(0);
  const [filterText, setFilterText] = useState('');
  const [auditLogs, setAuditLogs] = useState([]);
  const [dateFilter, setDateFilter] = useState('');
  const [customStartDate, setCustomStartDate] = useState(null);
  const [customEndDate, setCustomEndDate] = useState(null);

  useEffect(() => {
    async function fetchAuditLogs() {
      try {
        let queryParams = `page=${page}&limit=${perPage}&search=${encodeURIComponent(filterText)}`;
        const now = new Date();
        
         if (dateFilter === 'month') {
          queryParams += `&startDate=${format(startOfMonth(now), 'yyyy-MM-dd')}&endDate=${format(endOfMonth(now), 'yyyy-MM-dd')}`;
        } else if (dateFilter === 'year') {
          queryParams += `&startDate=${format(startOfYear(now), 'yyyy-MM-dd')}&endDate=${format(endOfYear(now), 'yyyy-MM-dd')}`;
        } else if (dateFilter === 'custom') {
          if (customStartDate && customEndDate) {
            const start = format(new Date(customStartDate), 'yyyy-MM-dd');
            const end = format(new Date(customEndDate.setHours(23, 59, 59, 999)), 'yyyy-MM-dd');
            queryParams += `&startDate=${start}&endDate=${end}`;
          } else {
            return; // Wait for both custom dates
          }
        }

        const res = await getData(`/admin/audit-logs?${queryParams}`);
        setAuditLogs(res.data || []);
        setTotal(res.totalRecords || 0);
      } catch (error) {
        console.error('Failed to fetch audit logs:', error);
      }
    }

    fetchAuditLogs();
  }, [page, perPage, filterText, dateFilter, customStartDate, customEndDate]);

  const ExpandedRow = ({ data }) => {
    const changes = data?.changes;
    const isChangesValid = changes && typeof changes === 'object' && !Array.isArray(changes);

    return (
      <div className="p-4 bg-light rounded border">
        <div className="fw-semibold mb-1">Changes:</div>
        <ul className="mb-0">
          {isChangesValid && Object.keys(changes).length > 0 ? (
            Object.entries(changes).map(([key, value]) => {
              if (Array.isArray(value) && value.length === 2) {
                return (
                  <li key={key}>
                    <strong>{key}</strong>: <code>{String(value[0])}</code> → <code>{String(value[1])}</code>
                  </li>
                );
              } else {
                return (
                  <li key={key}>
                    <strong>{key}</strong>: <code>{String(value)}</code>
                  </li>
                );
              }
            })
          ) : (
            <li>No changes recorded</li>
          )}
        </ul>
      </div>
    );
  };

  const columns = [
    {
      name: 'Model',
      selector: row => row.model || 'N/A',
      sortable: true,
      width: '120px',
    },
    {
      name: 'Model ID',
      selector: row => row.modelId || 'N/A',
      sortable: true,
      width: '120px',
    },
    {
      name: 'Action',
      selector: row => row.action || 'N/A',
      sortable: true,
      width: '120px',
    },
    {
      name: 'Performed By',
      selector: row => row.performedByName || 'N/A',
      sortable: true,
      cell: row => (
        <>
          <FaUser className="me-2" size={20} />
          {row.performedByName || 'N/A'}
        </>
      ),
    },
    {
      name: 'Date',
      selector: row => new Date(row.createdAt).toLocaleString(),
      sortable: true,
      cell: row => (
        <>
          <FaClock className="me-2" size={14} />
          {new Date(row.createdAt).toLocaleString()}
        </>
      ),
    },
    {
      name: 'Message',
      selector: row => {
        const fullMessage = row.log_message || '';
        const shortMessage = fullMessage.includes(':') ? fullMessage.split(':')[0] + '.' : fullMessage;
        return shortMessage;
      },
      wrap: true,
      grow: 2,
    },
  ];

  return (
    <div className="container">
      <div className="d-flex flex-wrap justify-content-between align-items-between mb-3 gap-2">
        <h4>
          <FaHistory className="me-2" />
          Audit Logs
        </h4>
<div className='d-flex w-75 gap-2 justify-content-end'>
<div className="d-flex gap-2 align-items-center">
          <select
            className="form-select w-auto"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
             
            <option value="">Today</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
            <option value="custom">Custom Range</option>
          </select>

          {dateFilter === 'custom' && (
            <>
              <input
                type="date"
                className="form-control"
                value={customStartDate ? format(customStartDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setCustomStartDate(new Date(e.target.value))}
              />
              <input
                type="date"
                className="form-control"
                value={customEndDate ? format(customEndDate, 'yyyy-MM-dd') : ''}
                onChange={(e) => setCustomEndDate(new Date(e.target.value))}
              />
            </>
          )}
        </div>

        <input
          type="text"
          className="form-control w-50"
          placeholder="Search by model, action, or name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
</div>
        

      <DataTable
        columns={columns}
        data={auditLogs}
        pagination
        paginationServer
        paginationTotalRows={total}
        paginationPerPage={perPage}
        onChangePage={setPage}
        onChangeRowsPerPage={(newPerPage, page) => {
          setPerPage(newPerPage);
          setPage(page);
        }}
        striped
        responsive
        highlightOnHover
        noDataComponent="No history logs found"
        expandableRows
        expandableRowsComponent={ExpandedRow}
        expandOnRowClicked
      />
    </div>
  );
}

export default HistoryLogs;
