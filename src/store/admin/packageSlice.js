import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postData, getData ,deleteData ,putData} from '../../utils/api'

export const addPackage = createAsyncThunk('admin/create-package', async (data, thunkAPI) => {
 
  try {
    const response = await postData('/admin/create-package', data)
    return response
  } catch (error) {
    console.error('Create  error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getPackages = createAsyncThunk('admin/get-package', async (_, thunkAPI) => {
  try {
    const response = await getData('/admin/get-package')
    return response
  } catch (error) {
    console.error('Get error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const deletePackage  = createAsyncThunk('admin/delete-package', async (uuid, thunkAPI) => {
  try {
    const response = await deleteData(`/admin/delete-package/${uuid}`)
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


export const updatePackage = createAsyncThunk('admin/update-package', async ({ uuid, payload}, thunkAPI) => {
  try {
    
    const response = await putData(`/admin/update-package/${uuid}`, payload)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getPackageByUUID = createAsyncThunk('admin/get-package-by-uuid', async (uuid, thunkAPI) => {
  try {
    const response = await getData(`/admin/get-package-by-uuid/${uuid}`)
    return response
  } catch (error) {
    console.error('Get error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getPackageByAuthorityId = createAsyncThunk('admin/get-package-by-authority-id', async (id, thunkAPI) => {
  try {
    
    const response = await getData(`/admin/get-package-by-authority-id/${id}`)
    return response
  } catch (error) {
    console.error('Get error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})


const packageSlice = createSlice({
  name: 'package',
  initialState: {
    packages: [],
    business_package:null,
    isLoading: true,
    isPackageLoading :true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addPackage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(addPackage.fulfilled, (state, action) => {
        state.isLoading = false
         state.packages.push(action.payload.data)
      })
      .addCase(addPackage.rejected, (state, action) => {
        state.isLoading = false
      }).addCase(getPackages.pending, (state) => {
        state.isLoading = true
  })
  .addCase(getPackages.fulfilled, (state, action) => {
    state.isLoading = false
    state.packages = action.payload.data
  })
      .addCase(getPackages.rejected, (state) => {
    state.isLoading = false
    state.packages = []
  })

      

      // Delete Employee
      .addCase(deletePackage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deletePackage.fulfilled, (state, action) => {
        state.isLoading = false
        state.packages = state.packages.filter(item => item.uuid !== action.uuid)

      })
      .addCase(deletePackage.rejected, (state, action) => {
        state.isLoading = false
      })

      // Update Employee
      .addCase(updatePackage.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updatePackage.fulfilled, (state, action) => {
        state.isLoading = false
       
        const updated = action.payload.data
          const index = state.packages.findIndex(
         (activity) => activity.uuid === updated.uuid
  );

  if (index !== -1) {
    // Replace the old entry with the updated one
    state.packages[index] = updated;
  }
       
      })
      .addCase(updatePackage.rejected, (state, action) => {
        state.isLoading = false
     
      }).addCase(getPackageByUUID.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getPackageByUUID.fulfilled, (state, action) => {
        state.isLoading = false
        state.business_package = action.payload.data
      })
      .addCase(getPackageByUUID.rejected, (state, action) => {
        state.isLoading = false
        state.business_package = null
       
      }).addCase(getPackageByAuthorityId.pending, (state) => {
        state.isPackageLoading  = true
      })
      .addCase(getPackageByAuthorityId.fulfilled, (state, action) => {
        state.isPackageLoading  = false
        state.packages = action.payload.data
      })
          .addCase(getPackageByAuthorityId.rejected, (state) => {
        state.isPackageLoading  = false
        state.packages = []
      })
  },
})

export default packageSlice.reducer
