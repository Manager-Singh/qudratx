// src/redux/slices/trashSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { deleteData, getData, postData } from '../../utils/api'


// ✅ Fetch all trashed items
export const fetchAllTrash = createAsyncThunk(
  'trash/fetchTrash',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getData('/admin/get-all-trash-items') 
      return response
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

// ✅ Restore a trashed item
export const restoreTrashItem = createAsyncThunk(
  'trash/restoreTrashItem',
  async ({ moduleType, id }, { rejectWithValue }) => {
    try {
      const { data } = await postData(`/admin/restore-trash-items/${moduleType}/${id}`)
      return { moduleType, id, data }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

// ✅ Permanently delete a trashed item
export const deleteTrashItem = createAsyncThunk(
  'trash/deleteTrashItem',
  async ({ moduleType, id }, { rejectWithValue }) => {
    try {
      await deleteData(`/admin/permanent-delete/${moduleType}/${id}`)
      return { moduleType, id }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message)
    }
  }
)

const trashSlice = createSlice({
  name: 'trash',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- Fetch ---
      .addCase(fetchAllTrash.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllTrash.fulfilled, (state, action) => {
        state.loading = false
        state.items = action.payload
      })
      .addCase(fetchAllTrash.rejected, (state, action) => {
        state.loading = false
        state.error = action.payload
      })

      // --- Restore ---
      .addCase(restoreTrashItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => !(item.id === action.payload.id && item.moduleType === action.payload.moduleType)
        )
      })

      // --- Permanent Delete ---
      .addCase(deleteTrashItem.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (item) => !(item.id === action.payload.id && item.moduleType === action.payload.moduleType)
        )
      })
  },
})

export default trashSlice.reducer
