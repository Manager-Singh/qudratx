import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postData, getData ,deleteData ,putData} from '../../utils/api'

export const addBusinessActivity = createAsyncThunk('admin/create-activity', async (data, thunkAPI) => {
  try {
    const response = await postData('/admin/create-activity', data)
    return response
  } catch (error) {
    console.error('Create  error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getBusinessActivity = createAsyncThunk('admin/get-activity', async (_, thunkAPI) => {
  try {
    const response = await getData('/admin/get-activity')
    return response
  } catch (error) {
    console.error('Get error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const deleteBusinessActivity  = createAsyncThunk('employee/delete-activity', async (uuid, thunkAPI) => {
  try {
    const response = await deleteData(`/admin/delete-activity/${uuid}`)
    return { uuid, ...response }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})


// export const fetchDeletedBusinessActivity  = createAsyncThunk('admin/fetchDeleted-businesszone', async (queryParams = '', thunkAPI) => {
//   try {
//     const response = await getData(`/admin/get-deleted-zone${queryParams}`)
//     return response
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })


export const updateBusinessActivity = createAsyncThunk('admin/update-activity', async ({ uuid, formData}, thunkAPI) => {
  try {
    const response = await putData(`/admin/update-activity/${uuid}`, formData)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getBusinessActivityByUuid = createAsyncThunk('admin//get-activity-by-uuid', async (uuid, thunkAPI) => {
  try {
    const response = await getData(`/admin/get-activity-by-uuid/${uuid}`)
    return response
  } catch (error) {
    console.error('Get error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})


const businessActivitySlice = createSlice({
  name: 'business_activity',
  initialState: {
    business_activities: [],
    business_activity:null,
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addBusinessActivity.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addBusinessActivity.fulfilled, (state, action) => {
        state.isLoading = false
         state.business_activities.push(action.payload.data)
      })
      .addCase(addBusinessActivity.rejected, (state, action) => {
        state.isLoading = false
      }).addCase(getBusinessActivity.pending, (state) => {
        state.isLoading = true
  })
  .addCase(getBusinessActivity.fulfilled, (state, action) => {
    state.isLoading = false
    state.business_activities = action.payload.data
  })
      .addCase(getBusinessActivity.rejected, (state) => {
    state.isLoading = false
    state.business_activities = []
  })

      

      // Delete Employee
      .addCase(deleteBusinessActivity.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteBusinessActivity.fulfilled, (state, action) => {
        state.isLoading = false
        state.business_activities = state.business_activities.filter(item => item.uuid !== action.uuid)

      })
      .addCase(deleteBusinessActivity.rejected, (state, action) => {
        state.isLoading = false
      })

      // Update Employee
      .addCase(updateBusinessActivity.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateBusinessActivity.fulfilled, (state, action) => {
        state.isLoading = false
       
        const updated = action.payload.data
          const index = state.business_activities.findIndex(
         (activity) => activity.uuid === updated.uuid
  );

  if (index !== -1) {
    // Replace the old entry with the updated one
    state.business_activities[index] = updated;
  }
       
      })
      .addCase(updateBusinessActivity.rejected, (state, action) => {
        state.isLoading = false
     
      }).addCase(getBusinessActivityByUuid.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getBusinessActivityByUuid.fulfilled, (state, action) => {
        state.isLoading = false
        state.business_activity = action.payload.data
      })
      .addCase(getBusinessActivityByUuid.rejected, (state, action) => {
        state.isLoading = false
        state.business_activity = null
       
      })
  },
})

export default businessActivitySlice.reducer
