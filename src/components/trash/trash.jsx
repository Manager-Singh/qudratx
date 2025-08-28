// components/AllTrash.js
import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "react-data-table-component";
import { restoreTrashItem, deleteTrashItem, fetchAllTrash } from "../../store/admin/trashSlice";
import useConfirm from "../../components/SweetConfirm/useConfirm";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaTrashRestore } from "react-icons/fa";
function AllTrash() {
  const dispatch = useDispatch();
  const confirm = useConfirm();
  const { items, loading } = useSelector((state) => state.trash);

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);

  // Fetch trash items
  const fetchData = useCallback(() => {
    dispatch(fetchAllTrash({ page, limit: perPage })).then((data) => {
      if (data.payload?.success) {
        setTotalRecords(data.payload.totalRecords || data.payload.items?.length || 0);
      }
    });
  }, [dispatch, page, perPage]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRestore = async (id, moduleType) => {
    const isConfirmed = await confirm({
      title: "Restore Item",
      text: "Are you sure you want to restore this item?",
      icon: "question",
      confirmButtonText: "Yes, Restore",
    });
    if (isConfirmed) {
      dispatch(restoreTrashItem({ id, moduleType })).then(() => fetchData());
    }
  };

  const handlePermanentDelete = async (id, moduleType) => {
    const isConfirmed = await confirm({
      title: "Delete Permanently",
      text: "This action cannot be undone. Do you really want to delete?",
      icon: "error",
      confirmButtonText: "Yes, Delete Permanently",
    });
    if (isConfirmed) {
      dispatch(deleteTrashItem({ id, moduleType })).then(() => fetchData());
    }
  };
console.log(items)
  // DataTable Columns
  const columns = [
    {
      name: "#",
      selector: (_, index) => index + 1,
      width: "70px",
    },
    {
      name: "Module",
      selector: (row) => row.moduleType?.toUpperCase(),
      sortable: true,
    },
    {
      name: "Id",
      selector: (row) => row.id,
      sortable: true,
    },
    {
      name: "Deleted At",
      selector: (row) =>
        row.deletedAt ? new Date(row.deletedAt).toLocaleString() : "-",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <button
            className="btn btn-sm btn-outline-success"
            onClick={() => handleRestore(row.id, row.moduleType)}
          >
            <FaTrashRestore />
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handlePermanentDelete(row.id, row.moduleType)}
          >
            <FaRegTrashAlt />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div className="container mt-4">
      <div className="card shadow-sm border-light">
        <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">🗑️ All Trash</h4>
          {loading && (
            <div
              className="spinner-border spinner-border-sm text-light"
              role="status"
            />
          )}
        </div>
        <div className="card-body">
          <DataTable
            columns={columns}
            data={items}
            pagination
            paginationServer
            paginationTotalRows={totalRecords}
            paginationDefaultPage={page}
            onChangePage={setPage}
            onChangeRowsPerPage={(newPerPage) => {
              setPerPage(newPerPage);
              setPage(1);
            }}
            highlightOnHover
            striped
            responsive
            progressPending={loading}
            noDataComponent="Trash is empty"
          />
        </div>
      </div>
    </div>
  );
}

export default AllTrash;
