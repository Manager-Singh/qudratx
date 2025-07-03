
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postData, getData ,deleteData ,putData} from '../../utils/api'

export const addClient = createAsyncThunk('admin/create-client', async (data, thunkAPI) => {
  try {
    const response = await postData('/admin/create-client-detail', data)
    return response
  } catch (error) {
    console.error('Create  error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getClient = createAsyncThunk('admin/get-clients', async (_, thunkAPI) => {
  try {
    const response = await getData('/admin/get-client-detail')
    return response
  } catch (error) {
    console.error('Get  error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const deleteClient  = createAsyncThunk('employee/delete-client', async (uuid, thunkAPI) => {
  try {
    const response = await deleteData(`/admin/delete-client-detail/${uuid}`)
    return { uuid, ...response }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})


export const fetchDeletedClient = createAsyncThunk('admin/fetchDeleted-client', async (queryParams = '', thunkAPI) => {
  try {
    const response = await getData(`/admin/get-deleted-client-detail${queryParams}`)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})


export const updateClient = createAsyncThunk('admin/update-client', async ({ uuid, name }, thunkAPI) => {
  
  try {
    const response = await putData(`/admin/update-client-detail/${uuid}`, {name})
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getClientByUuid = createAsyncThunk('admin/get-client-by-uuid', async (uuid, thunkAPI) => {
  try {
    const response = await getData(`/admin/get-client-detail-by-uuid/${uuid}`)
    return response
  } catch (error) {
    console.error('Get employees error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})


const clientSlice = createSlice({
  name: 'client',
  initialState: {
    clients: [],
    client:null,
    deletedClient:[],
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addClient.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addClient.fulfilled, (state, action) => {
        state.isLoading = false
         state.clients.push(action.payload.data)
      })
      .addCase(addClient.rejected, (state, action) => {
        state.isLoading = false
      }).addCase(getClient.pending, (state) => {
        state.isLoading = true
  })
  .addCase(getClient.fulfilled, (state, action) => {
    state.isLoading = false
    state.clients = action.payload.data
  })
      .addCase(getClient.rejected, (state) => {
    state.isLoading = false
    state.clients = []
  })

      

      // Delete Employee
      .addCase(deleteClient.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.isLoading = false
        state.clients = state.clients.filter(item => item.uuid !== action.uuid)

      })
      .addCase(deleteClient.rejected, (state, action) => {
        state.isLoading = false
      })

      // Update Employee
      .addCase(updateClient.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.isLoading = false
       
        const updated = action.payload.data
          const index = state.clients.findIndex(
         (user) => user.uuid === updated.uuid
  );

  if (index !== -1) {
    // Replace the old entry with the updated one
    state.clients[index] = updated;
  }
       
      })
      .addCase(updateClient.rejected, (state, action) => {
        state.isLoading = false
     
      }).addCase(getClientByUuid.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getClientByUuid.fulfilled, (state, action) => {
        state.isLoading = false
        state.client = action.payload.data
      })
      .addCase(getClientByUuid.rejected, (state, action) => {
        state.isLoading = false
        state.client = null
       
      }).addCase(fetchDeletedClient.pending, (state) => {
        state.isLoading = true
  })
  .addCase(fetchDeletedClient.fulfilled, (state, action) => {
    state.isLoading = false
    state.deletedClient = action.payload.data
  })
      .addCase(fetchDeletedClient.rejected, (state) => {
    state.isLoading = false
    state.deletedClient = []
  })
  },
})

export default clientSlice.reducer
