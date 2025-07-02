// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
// import { postData, getData ,deleteData ,putData} from '../../utils/api'

// export const addBusinessZone = createAsyncThunk('admin/create-businesszone', async (data, thunkAPI) => {
//   try {
//     const response = await postData('/admin/create-zone', data)
//     return response
//   } catch (error) {
//     console.error('Create businesszone error:', error)
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })

// export const getBusinessZone = createAsyncThunk('admin/get-businesszone', async (_, thunkAPI) => {
//   try {
//     const response = await getData('/admin/get-zone')
//     return response
//   } catch (error) {
//     console.error('Get businesszone error:', error)
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })

// export const deleteBusinessZone  = createAsyncThunk('employee/delete-businesszone', async (uuid, thunkAPI) => {
//   try {
//     const response = await deleteData(`/admin/delete-zone/${uuid}`)
//     return { uuid, ...response }
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })

// // Get Deleted Employees
// export const fetchDeletedBusinessZone  = createAsyncThunk('admin/fetchDeleted-businesszone', async (queryParams = '', thunkAPI) => {
//   try {
//     const response = await getData(`/admin/get-deleted-zone${queryParams}`)
//     return response
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })

// // Update Employee (by UUID)
// export const updateBusinessZone = createAsyncThunk('admin/update-businesszone', async ({ id, name }, thunkAPI) => {
   
//   try {
//      const uuid = id;
//     const response = await putData(`/admin/update-zone/${uuid}`, {name})
//     return response
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })

// export const getBusinessZoneByUuid = createAsyncThunk('admin/get-businesszone-by-uuid', async (uuid, thunkAPI) => {
//   try {
//     const response = await getData(`/admin/get-zone-by-uuid/${uuid}`)
//     return response
//   } catch (error) {
//     console.error('Get employees error:', error)
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })


// const businessZoneSlice = createSlice({
//   name: 'businesszone',
//   initialState: {
//     businesszones: [],
//     businesszone:null,
//     isLoading: true,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       .addCase(addBusinessZone.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(addBusinessZone.fulfilled, (state, action) => {
//         state.isLoading = false
//          state.businesszones.push(action.payload.data)
//       })
//       .addCase(addBusinessZone.rejected, (state, action) => {
//         state.isLoading = false
//       }).addCase(getBusinessZone.pending, (state) => {
//     state.isLoading = true
//   })
//   .addCase(getBusinessZone.fulfilled, (state, action) => {
//     state.isLoading = false
//     state.businesszones = action.payload.data
//   })
//       .addCase(getBusinessZone.rejected, (state) => {
//     state.isLoading = false
//     state.businesszones = []
//   })

//       // Get Employees
      

//       // Get Deleted Employees
//       // .addCase(getDeletedEmployees.pending, (state) => {
//       //   state.isLoading = true
//       // })
//       // .addCase(getDeletedEmployees.fulfilled, (state, action) => {
//       //   state.isLoading = false
//       //   state.deletedEmployees = action.payload.data
//       // })
//       // .addCase(getDeletedEmployees.rejected, (state, action) => {
//       //   state.isLoading = false
//       //   state.deletedEmployees = []
//       //   state.error = action.payload
//       // })

//       // Delete Employee
//       .addCase(deleteBusinessZone.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(deleteBusinessZone.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.businesszones = state.businesszones.filter(emp => emp.uuid !== action.uuid)

//       })
//       .addCase(deleteBusinessZone.rejected, (state, action) => {
//         state.isLoading = false
//       })

//       // Update Employee
//       .addCase(updateBusinessZone.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(updateBusinessZone.fulfilled, (state, action) => {
//         state.isLoading = false
       
//         const updated = action.payload.data
//           const index = state.businesszones.findIndex(
//          (zone) => zone.uuid === updated.uuid
//   );

//   if (index !== -1) {
//     // Replace the old entry with the updated one
//     state.businesszones[index] = updated;
//   }
       
//       })
//       .addCase(updateBusinessZone.rejected, (state, action) => {
//         state.isLoading = false
     
//       }).addCase(getBusinessZoneByUuid.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(getBusinessZoneByUuid.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.businesszone = action.payload.data
//       })
//       .addCase(getBusinessZoneByUuid.rejected, (state, action) => {
//         state.isLoading = false
//         state.businesszone = null
       
//       })
//   },
// })

// export default businessActivitySlice.reducer
