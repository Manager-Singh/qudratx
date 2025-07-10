import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postData, getData ,deleteData ,putData} from '../../utils/api'

export const addSubCategory= createAsyncThunk('admin/create-subcategory', async (data, thunkAPI) => {
 
  try {
    const response = await postData('/admin/create-subcategory', data)
    return response
  } catch (error) {
    console.error('Create  error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getSubCategory = createAsyncThunk('admin/get-subcategory', async (_, thunkAPI) => {
  try {
    const response = await getData('/admin/get-subcategory')
    return response
  } catch (error) {
    console.error('Get error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const deleteSubCategory  = createAsyncThunk('admin/delete-subcategory', async (uuid, thunkAPI) => {
  try {
    const response = await deleteData(`/admin/delete-subcategory/${uuid}`)
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


export const updateSubCategory= createAsyncThunk('admin/update-subcategory', async ({ uuid, payload}, thunkAPI) => {
  try {
    
    const response = await putData(`/admin/update-subcategory/${uuid}`, payload)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getSubCategoryByUUID = createAsyncThunk('admin/get-subcategory-by-uuid', async (uuid, thunkAPI) => {
  try {
    const response = await getData(`/admin/get-subcategory-by-uuid/${uuid}`)
    return response
  } catch (error) {
    console.error('Get error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})


const subCategorySlice = createSlice({
  name: 'sub_category',
  initialState: {
    sub_categories: [],
    sub_category:null,
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addSubCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addSubCategory.fulfilled, (state, action) => {
        state.isLoading = false
         state.sub_categories.push(action.payload.data)
      })
      .addCase(addSubCategory.rejected, (state, action) => {
        state.isLoading = false
      }).addCase(getSubCategory.pending, (state) => {
        state.isLoading = true
  })
  .addCase(getSubCategory.fulfilled, (state, action) => {
    state.isLoading = false
    state.sub_categories = action.payload.data
  })
      .addCase(getSubCategory.rejected, (state) => {
    state.isLoading = false
    state.sub_categories = []
  })

      

      // Delete Employee
      .addCase(deleteSubCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteSubCategory.fulfilled, (state, action) => {
        state.isLoading = false
        state.sub_categories = state.sub_categories.filter(item => item.uuid !== action.uuid)

      })
      .addCase(deleteSubCategory.rejected, (state, action) => {
        state.isLoading = false
      })

      // Update Employee
      .addCase(updateSubCategory.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateSubCategory.fulfilled, (state, action) => {
        state.isLoading = false
       
        const updated = action.payload.data
          const index = state.sub_categories.findIndex(
         (category) => category.uuid === updated.uuid
  );

  if (index !== -1) {
    // Replace the old entry with the updated one
    state.sub_categories[index] = updated;
  }
       
      })
      .addCase(updateSubCategory.rejected, (state, action) => {
        state.isLoading = false
     
      }).addCase(getSubCategoryByUUID.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getSubCategoryByUUID.fulfilled, (state, action) => {
        state.isLoading = false
        state.sub_category = action.payload.data
      })
      .addCase(getSubCategoryByUUID.rejected, (state, action) => {
        state.isLoading = false
        state.sub_category = null
       
      })

  },
})

export default subCategorySlice.reducer
