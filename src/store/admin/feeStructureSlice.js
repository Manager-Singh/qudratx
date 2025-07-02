// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { postData, getData, deleteData, putData } from '../../utils/api'

// const API_URL = 'https://sheetdb.io/api/v1/jmukf802divph'

// // Fetch all fee structures
// export const fetchFeeStructures = createAsyncThunk(
//   'feeStructure/fetchAll',
//   async (_, thunkAPI) => {
//     try {
//       const response = await getData(API_URL)
//       return response
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message)
//     }
//   }
// )

// // Add new fee structure
// export const addFeeStructure = createAsyncThunk(
//   'feeStructure/add',
//   async (feeData, thunkAPI) => {
//     try {
//       // SheetDB expects { data: { ... } }
//       const response = await postData(API_URL, { data: feeData })
//       return response.created[0]
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message)
//     }
//   }
// )

// // Update fee structure by ID
// export const updateFeeStructure = createAsyncThunk(
//   'feeStructure/update',
//   async ({ id, updates }, thunkAPI) => {
//     try {
//       const response = await putData(`${API_URL}/${id}`, { data: updates })
//       return response.updated[0]
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message)
//     }
//   }
// )

// // Delete fee structure by ID
// export const deleteFeeStructure = createAsyncThunk(
//   'feeStructure/delete',
//   async (id, thunkAPI) => {
//     try {
//       await deleteData(`${API_URL}/${id}`)
//       return id
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message)
//     }
//   }
// )

// const feeStructureSlice = createSlice({
//   name: 'feeStructure',
//   initialState: {
//     fees: [],
//     isLoading: false,
//     error: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchFeeStructures.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(fetchFeeStructures.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.fees = action.payload
//       })
//       .addCase(fetchFeeStructures.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload
//       })

//       .addCase(addFeeStructure.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(addFeeStructure.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.fees.push(action.payload)
//       })
//       .addCase(addFeeStructure.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload
//       })

//       .addCase(updateFeeStructure.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(updateFeeStructure.fulfilled, (state, action) => {
//         state.isLoading = false
//         const updated = action.payload
//         const index = state.fees.findIndex((fee) => fee.id === updated.id)
//         if (index !== -1) {
//           state.fees[index] = updated
//         }
//       })
//       .addCase(updateFeeStructure.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload
//       })

//       .addCase(deleteFeeStructure.pending, (state) => {
//         state.isLoading = true
//         state.error = null
//       })
//       .addCase(deleteFeeStructure.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.fees = state.fees.filter((fee) => fee.id !== action.payload)
//       })
//       .addCase(deleteFeeStructure.rejected, (state, action) => {
//         state.isLoading = false
//         state.error = action.payload
//       })
//   },
// })

// export default feeStructureSlice.reducer
