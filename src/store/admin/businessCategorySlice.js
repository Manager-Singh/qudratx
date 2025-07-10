import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postData, getData ,deleteData ,putData} from '../../utils/api'

export const addBusinessCategory = createAsyncThunk('admin/create-category', async (data, thunkAPI) => {
 
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


export const updateBusinessCategory = createAsyncThunk('admin/update-category', async ({ uuid, formData}, thunkAPI) => {
  try {
    const response = await putData(`/admin/update-category/${uuid}`, formData)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getBusinessCategoryByUuid = createAsyncThunk('admin/get-category-by-uuid', async (uuid, thunkAPI) => {
  try {
    const response = await getData(`/admin/get-category-by-uuid/${uuid}`)
    return response
  } catch (error) {
    console.error('Get error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})


const businessCategorySlice = createSlice({
  name: 'business_category',
  initialState: {
    business_categories: [],
    business_category:null,
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addBusinessCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addBusinessCategory.fulfilled, (state, action) => {
        state.isLoading = false
         state.business_categories.push(action.payload.data)
      })
      .addCase(addBusinessCategory.rejected, (state, action) => {
        state.isLoading = false
      }).addCase(getBusinessCategories.pending, (state) => {
        state.isLoading = true
  })
  .addCase(getBusinessCategories.fulfilled, (state, action) => {
    state.isLoading = false
    state.business_categories = action.payload.data
  })
      .addCase(getBusinessCategories.rejected, (state) => {
    state.isLoading = false
    state.business_categories = []
  })

      

      // Delete Employee
      .addCase(deleteBusinessCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteBusinessCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.business_categories = state.business_categories.filter(item => item.uuid !== action.uuid)

      })
      .addCase(deleteBusinessCategory.rejected, (state, action) => {
        state.isLoading = false
      })

      // Update Employee
      .addCase(updateBusinessCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateBusinessCategory.fulfilled, (state, action) => {
        state.isLoading = false
       
        const updated = action.payload.data
          const index = state.business_categories.findIndex(
         (activity) => activity.uuid === updated.uuid
  );

  if (index !== -1) {
    // Replace the old entry with the updated one
    state.business_categories[index] = updated;
  }
       
      })
      .addCase(updateBusinessCategory.rejected, (state, action) => {
        state.isLoading = false
     
      }).addCase(getBusinessCategoryByUuid.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getBusinessCategoryByUuid.fulfilled, (state, action) => {
        state.isLoading = false
        state.business_category = action.payload.data
      })
      .addCase(getBusinessCategoryByUuid.rejected, (state, action) => {
        state.isLoading = false
        state.business_category = null
       
      })
  },
})

export default businessCategorySlice.reducer
