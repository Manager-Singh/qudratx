// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { postData, getData, deleteData, putData } from '../../utils/api'

// // Add Fee Structure
// export const addFeeStructure = createAsyncThunk('admin/create-feestructure', async (data, thunkAPI) => {
//   try {
//     const response = await postData('/admin/create-fee-structure', data)
//     return response
//   } catch (error) {
//     console.error('Create fee structure error:', error)
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })

// // Get All Fee Structures
// export const getFeeStructures = createAsyncThunk('admin/get-feestructures', async (_, thunkAPI) => {
//   try {
//     const response = await getData('/admin/get-fee-structures')
//     return response
//   } catch (error) {
//     console.error('Get fee structures error:', error)
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })

// // Delete Fee Structure
// export const deleteFeeStructure = createAsyncThunk('admin/delete-feestructure', async (uuid, thunkAPI) => {
//   try {
//     const response = await deleteData(`/admin/delete-fee-structure/${uuid}`)
//     return { uuid, ...response }
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })

// // Get Deleted Fee Structures
// export const fetchDeletedFeeStructures = createAsyncThunk('admin/fetchDeleted-feestructures', async (queryParams = '', thunkAPI) => {
//   try {
//     const response = await getData(`/admin/get-deleted-fee-structures${queryParams}`)
//     return response
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })

// // Update Fee Structure
// export const updateFeeStructure = createAsyncThunk('admin/update-feestructure', async ({ id, ...rest }, thunkAPI) => {
//   try {
//     const uuid = id;
//     const response = await putData(`/admin/update-fee-structure/${uuid}`, rest)
//     return response
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })

// // Get Fee Structure by UUID
// export const getFeeStructureByUuid = createAsyncThunk('admin/get-feestructure-by-uuid', async (uuid, thunkAPI) => {
//   try {
//     const response = await getData(`/admin/get-fee-structure-by-uuid/${uuid}`)
//     return response
//   } catch (error) {
//     console.error('Get fee structure by UUID error:', error)
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })

// const feeStructureSlice = createSlice({
//   name: 'feestructure',
//   initialState: {
//     feestructures: [],
//     feestructure: null,
//     isLoading: true,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(addFeeStructure.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(addFeeStructure.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.feestructures.push(action.payload.data)
//       })
//       .addCase(addFeeStructure.rejected, (state) => {
//         state.isLoading = false
//       })

//       .addCase(getFeeStructures.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(getFeeStructures.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.feestructures = action.payload.data
//       })
//       .addCase(getFeeStructures.rejected, (state) => {
//         state.isLoading = false
//         state.feestructures = []
//       })

//       .addCase(deleteFeeStructure.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(deleteFeeStructure.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.feestructures = state.feestructures.filter(item => item.uuid !== action.uuid)
//       })
//       .addCase(deleteFeeStructure.rejected, (state) => {
//         state.isLoading = false
//       })

//       .addCase(updateFeeStructure.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(updateFeeStructure.fulfilled, (state, action) => {
//         state.isLoading = false
//         const updated = action.payload.data
//         const index = state.feestructures.findIndex(item => item.uuid === updated.uuid)
//         if (index !== -1) {
//           state.feestructures[index] = updated
//         }
//       })
//       .addCase(updateFeeStructure.rejected, (state) => {
//         state.isLoading = false
//       })

//       .addCase(getFeeStructureByUuid.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(getFeeStructureByUuid.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.feestructure = action.payload.data
//       })
//       .addCase(getFeeStructureByUuid.rejected, (state) => {
//         state.isLoading = false
//         state.feestructure = null
//       })
//   }
// })

// export default feeStructureSlice.reducer
