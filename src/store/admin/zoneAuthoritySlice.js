import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { getData, postData, putData, deleteData, postDataWithImage, putDataWithImage } from '../../utils/api'

// CREATE
export const addBusinessZonesAuthority = createAsyncThunk(
  'authority/add',
  async (data, thunkAPI) => {
    
    try {
      const response = await postDataWithImage('/admin/create-authority', data)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// READ ALL
export const getBusinessZonesAuthorities = createAsyncThunk(
  'authority/getAll',
  async (queryParams = '', thunkAPI) => {
    try {
      const response = await getData(`/admin/get-authorities${queryParams}`)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// READ ONE
export const getBusinessZonesAuthorityByZoneId = createAsyncThunk(
  'authority/getbyzoneid',
  async ({id}, thunkAPI) => {
    try {
      const response = await getData(`/admin/get-authority-by-zone/${id}`)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

export const getBusinessZonesAuthorityByUuid = createAsyncThunk(
  'authority/get-by-uuid',
  async ({authority_uuid}, thunkAPI) => {
    try {
      const response = await getData(`/admin/get-authority-by-uuid/${authority_uuid}`)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// UPDATE
export const updateBusinessZonesAuthority = createAsyncThunk(
  'authority/update',
  async ({ uuid, data }, thunkAPI) => {
    
    try {
      const response = await putDataWithImage(`/admin/update-authority/${uuid}`, data)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// DELETE
export const deleteBusinessZonesAuthority = createAsyncThunk(
  'authority/delete',
  async (uuid, thunkAPI) => {
    try {
      const response = await deleteData(`/admin/delete-authority/${uuid}`)
      return { uuid, ...response }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

// GET DELETED
export const getDeletedBusinessZonesAuthorities = createAsyncThunk(
  'authority/getDeleted',
  async (queryParams = '', thunkAPI) => {
    try {
      const response = await getData(`/admin/get-deleted-authorities${queryParams}`)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
    }
  }
)

const businessZonesAuthoritySlice = createSlice({
  name: 'businessZonesAuthority',
  initialState: {
    authorities: [],
    deletedAuthorities: [],
    authority: null,
    isLoading: false,
    error: null,
    message: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // CREATE
      .addCase(addBusinessZonesAuthority.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addBusinessZonesAuthority.fulfilled, (state, action) => {
        state.isLoading = false
        state.message = action.payload.message
        state.authorities.unshift(action.payload.data)
      })
      .addCase(addBusinessZonesAuthority.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // READ ALL
      .addCase(getBusinessZonesAuthorities.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getBusinessZonesAuthorities.fulfilled, (state, action) => {
        state.isLoading = false
        state.authorities = action.payload.data
      })
      .addCase(getBusinessZonesAuthorities.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // READ ONE
      .addCase(getBusinessZonesAuthorityByZoneId.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getBusinessZonesAuthorityByZoneId.fulfilled, (state, action) => {
        state.isLoading = false
        state.authorities = action.payload.data

      })
      .addCase(getBusinessZonesAuthorityByZoneId.rejected, (state, action) => {
        state.isLoading = false
        state.authorities = []
        state.error = action.payload
      })

      // UPDATE
      .addCase(updateBusinessZonesAuthority.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateBusinessZonesAuthority.fulfilled, (state, action) => {
        state.isLoading = false
        const updated = action.payload.data
        state.authorities = state.authorities.map(item =>
          item.uuid === updated.uuid ? updated : item
        )
        state.message = action.payload.message
      })
      .addCase(updateBusinessZonesAuthority.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // DELETE
      .addCase(deleteBusinessZonesAuthority.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteBusinessZonesAuthority.fulfilled, (state, action) => {
        state.isLoading = false
        state.authorities = state.authorities.filter(item => item.uuid !== action.uuid)
        state.message = action.message
      })
      .addCase(deleteBusinessZonesAuthority.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // GET DELETED
      .addCase(getDeletedBusinessZonesAuthorities.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getDeletedBusinessZonesAuthorities.fulfilled, (state, action) => {
        state.isLoading = false
        state.deletedAuthorities = action.payload.data
      })
      .addCase(getDeletedBusinessZonesAuthorities.rejected, (state, action) => {
        state.isLoading = false
      }).addCase(getBusinessZonesAuthorityByUuid.pending, (state) => {
      state.isLoading = true
    })
    .addCase(getBusinessZonesAuthorityByUuid.fulfilled, (state, action) => {
      state.isLoading = false
    
      state.authority = action.payload.data
    })
    .addCase(getBusinessZonesAuthorityByUuid.rejected, (state, action) => {
      state.isLoading = false,
      state.authority=null
    })
  }
})

export default businessZonesAuthoritySlice.reducer
