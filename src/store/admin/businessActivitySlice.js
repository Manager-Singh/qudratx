import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postData, getData ,deleteData ,putData} from '../../utils/api'

export const addBusinessActivity = createAsyncThunk('admin/create-category', async (data, thunkAPI) => {
 
  try {
    const response = await postData('/admin/create-category', data)
    return response
  } catch (error) {
    console.error('Create  error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getBusinessCategories = createAsyncThunk('admin/get-category', async (_, thunkAPI) => {
  try {
    const response = await getData('/admin/get-category')
    return response
  } catch (error) {
    console.error('Get error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const deleteBusinessCategory = createAsyncThunk('employee/delete-category', async (uuid, thunkAPI) => {
  try {
    const response = await deleteData(`/admin/delete-category/${uuid}`)
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


export const updateBusinessActivity = createAsyncThunk('admin/update-category', async ({ uuid, formData}, thunkAPI) => {
  try {
    
    const response = await putData(`/admin/update-category/${uuid}`, formData)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getBusinessActivityByUuid = createAsyncThunk('admin/get-category-by-uuid', async (uuid, thunkAPI) => {
  try {
    const response = await getData(`/admin/get-category-by-uuid/${uuid}`)
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
      }).addCase(getBusinessCategories.pending, (state) => {
        state.isLoading = true
  })
  .addCase(getBusinessCategories.fulfilled, (state, action) => {
    state.isLoading = false
    state.business_activities = action.payload.data
  })
      .addCase(getBusinessCategories.rejected, (state) => {
    state.isLoading = false
    state.business_activities = []
  })

      

      // Delete Employee
      .addCase(deleteBusinessCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteBusinessCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.business_activities = state.business_activities.filter(item => item.uuid !== action.uuid)

      })
      .addCase(deleteBusinessCategory.rejected, (state, action) => {
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
