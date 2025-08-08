    import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
    import { postData, getData, deleteData, putData } from '../../utils/api'

    // Create Lead
    export const addLead = createAsyncThunk('admin/create-lead', async (data, thunkAPI) => {
    try {
        const response = await postData('/admin/create-lead', data)
        return response
    } catch (error) {
        console.error('Create lead error:', error)
        return thunkAPI.rejectWithValue(error.message)
    }
    })

    // Get All Leads
export const getLead = createAsyncThunk(
  'admin/get-leads',
  async ({ page = 1, limit = 10, search = '' }, thunkAPI) => {
    try {
      const response = await getData(`/admin/get-lead-detail?page=${page}&limit=${limit}&search=${search}`);
      return response;
    } catch (error) {
      console.error('Get leads error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const getEmployeeLead = createAsyncThunk(
  'admin/get-lead-detail-by-employeeId',
  async ({ page = 1, limit = 10, search = '' }, thunkAPI) => {
    try {
      const response = await getData(`/admin/get-lead-detail-by-employeeId?page=${page}&limit=${limit}&search=${search}`);
      return response;
    } catch (error) {
      console.error('Get leads error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);


    // Delete Lead
    export const deleteLead = createAsyncThunk('admin/delete-lead', async (uuid, thunkAPI) => {
    try {
        const response = await deleteData(`/admin/delete-lead-detail/${uuid}`)
        return { uuid, ...response }
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
    })

    // Get Deleted Leads
    export const fetchDeletedLead = createAsyncThunk('admin/fetchDeleted-lead', async (queryParams = '', thunkAPI) => {
    try {
        const response = await getData(`/admin/get-deleted-lead-detail${queryParams}`)
        return response
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
    })

    // Update Lead
    export const updateLead = createAsyncThunk('admin/update-lead', async ({ uuid, formdata }, thunkAPI) => {
    try {
        const response = await putData(`/admin/update-lead-detail/${uuid}`, formdata)
        return response
    } catch (error) {
        return thunkAPI.rejectWithValue(error.message)
    }
    })

    // Get Lead by UUID
    export const getLeadByUuid = createAsyncThunk('admin/get-lead-by-uuid', async (uuid, thunkAPI) => {
    try {
        const response = await getData(`/admin/get-lead-detail-by-uuid/${uuid}`)
        return response
    } catch (error) {
        console.error('Get lead by UUID error:', error)
        return thunkAPI.rejectWithValue(error.message)
    }
    })

    // assigned lead
    export const assignLead = createAsyncThunk('admin/assign-lead', async(data, thunkAPI) => {
        try{
            const response = await putData('/admin/assign-lead', data)
            return response
        } catch(error){
            return thunkAPI.rejectWithValue(error.message)
        }
    })

    const leadSlice = createSlice({
    name: 'lead',
    initialState: {
        leads: [],
        lead: null,
        deletedLeads: [],
        assignLead: null,
        isLoading: false,
        isAdding: false, 
        isUpdating: false,
        isDeleting: false,
      },      
    reducers: {},
    extraReducers: (builder) => {
        builder
        // Add
        .addCase(addLead.pending, (state) => {
            state.isAdding = true
        })
        .addCase(addLead.fulfilled, (state, action) => {
            state.isAdding = false
            state.leads.push(action.payload.data)
        })
        .addCase(addLead.rejected, (state) => {
            state.isAdding = false
        })
            
        // Get all
        .addCase(getLead.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getLead.fulfilled, (state, action) => {
            state.isLoading = false
            state.leads = action.payload.data
        })
        .addCase(getLead.rejected, (state) => {
            state.isLoading = false
            state.leads = []
        })
        .addCase(getEmployeeLead.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getEmployeeLead.fulfilled, (state, action) => {
            state.isLoading = false
            state.leads = action.payload.data
        })
        .addCase(getEmployeeLead.rejected, (state) => {
            state.isLoading = false
            state.leads = []
        })


        // Delete
        .addCase(deleteLead.pending, (state) => {
            state.isLoading = true
        })
        .addCase(deleteLead.fulfilled, (state, action) => {
            state.isLoading = false
            state.leads = state.leads.filter(item => item.uuid !== action.uuid)
        })
        .addCase(deleteLead.rejected, (state) => {
            state.isLoading = false
        })

        // Update
        .addCase(updateLead.pending, (state) => {
            state.isLoading = true
        })
        .addCase(updateLead.fulfilled, (state, action) => {
            state.isLoading = false
            const updated = action.payload.data
            const index = state.leads.findIndex(lead => lead.uuid === updated.uuid)
            if (index !== -1) {
            state.leads[index] = updated
            }
        })
        .addCase(updateLead.rejected, (state) => {
            state.isLoading = false
        })

        // Get by UUID
        .addCase(getLeadByUuid.pending, (state) => {
            state.isLoading = true
        })
        .addCase(getLeadByUuid.fulfilled, (state, action) => {
            state.isLoading = false
            state.lead = action.payload.data
        })
        .addCase(getLeadByUuid.rejected, (state) => {
            state.isLoading = false
            state.lead = null
        })

        // Fetch deleted
        .addCase(fetchDeletedLead.pending, (state) => {
            state.isLoading = true
        })
        .addCase(fetchDeletedLead.fulfilled, (state, action) => {
            state.isLoading = false
            state.deletedLeads = action.payload.data
        })
        .addCase(fetchDeletedLead.rejected, (state) => {
            state.isLoading = false
            state.deletedLeads = []
        })

        // assign lead
        .addCase(assignLead.pending, (state) => {
            state.isLoading = true
        })
        .addCase(assignLead.fulfilled, (state, action) => {
            state.isLoading = false
            state.assignLead = action.payload.data
        })
        .addCase(assignLead.rejected, (state) => {
            state.isLoading = false
            state.assignLead = null
        })
    },
    })

    export default leadSlice.reducer
