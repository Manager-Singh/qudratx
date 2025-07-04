import React, { useState, useEffect } from "react";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CRow,
  CFormSelect,
  CModal,
  CModalHeader,
  CModalBody,
} from "@coreui/react";
import { useDispatch, useSelector } from "react-redux";
import AddClient from "../clients/AddClient";
import { getClient } from "../../../../store/admin/clientSlice";

const AddLead = () => {
  const dispatch = useDispatch();
  const { clients, isLoading } = useSelector((state) => state.client);

  const [selectedClient, setSelectedClient] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Fetch clients on mount
  useEffect(() => {
    dispatch(getClient());
  }, [dispatch]);

  const handleClientSelect = (e) => {
    setSelectedClient(e.target.value);
  };

  const handleClientAdded = (newClient) => {
    setSelectedClient(newClient.id?.toString() || "");
    setModalVisible(false);
  };

  return (
    <CCard>
      <CCardBody>
        <CRow className="align-items-center mb-3">
          <CCol xs="auto">
            <CButton color="primary" onClick={() => setModalVisible(true)}>
              + Add Client
            </CButton>
          </CCol>
          <CCol md={6}>
            <CFormSelect
              value={selectedClient}
              onChange={handleClientSelect}
              disabled={isLoading}
            >
              <option value="">Select Client</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name}
                </option>
              ))}
            </CFormSelect>
          </CCol>
        </CRow>

        {selectedClient && (
          <CRow className="mt-3">
            <CCol>
              <CButton color="success">Add Lead</CButton>
            </CCol>
          </CRow>
        )}

        <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
          <CModalHeader onClose={() => setModalVisible(false)}>
            Add New Client
          </CModalHeader>
          <CModalBody>
            <AddClient onSubmit={handleClientAdded} />
          </CModalBody>
        </CModal>
      </CCardBody>
    </CCard>
  );
};

export default AddLead;
