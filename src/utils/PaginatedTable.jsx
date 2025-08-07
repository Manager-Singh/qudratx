import { useEffect, useState } from 'react'
import DataTable from 'react-data-table-component'

const PaginatedTable = ({
  columns,
  fetchData,
  searchKeys = [],
  defaultPerPage = 10,
  noDataMessage = 'No data found',
  enableSearch = true,
  enableStatusFilter = false,
}) => {
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(defaultPerPage)
  const [totalRows, setTotalRows] = useState(0)
  const [data, setData] = useState([])
  const [filterText, setFilterText] = useState('')
  const [statusFilter, setStatusFilter] = useState('') // '', 'active', 'inactive'

  useEffect(() => {
    fetchData({ page, limit: perPage, search: filterText, status: statusFilter }).then((res) => {
      if (res?.data) {
        setData(res.data)
        setTotalRows(res.total)
      }
    })
  }, [page, perPage, filterText, statusFilter])

  return (
    <>
      <div className="d-flex justify-content-between mb-2">
        {enableSearch && (
          <input
            type="text"
            className="form-control w-25"
            placeholder="Search..."
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        )}
        {enableStatusFilter && (
          <select
            className="form-select w-25 ms-3"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        )}
      </div>

      <DataTable
        columns={columns}
        data={data}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        paginationPerPage={perPage}
        onChangePage={setPage}
        onChangeRowsPerPage={(newPerPage, page) => {
          setPerPage(newPerPage)
          setPage(page)
        }}
        highlightOnHover
        responsive
        striped
        noDataComponent={noDataMessage}
      />
    </>
  )
}
export default PaginatedTable
