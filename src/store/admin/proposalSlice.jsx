import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postData, getData ,deleteData ,putData} from '../../utils/api'

export const CreateProposal= createAsyncThunk('admin/create-proposal', async (data, thunkAPI) => {
 
  try {
    const response = await postData('/admin/create-proposal', data)
    return response
  } catch (error) {
    console.error('Create  error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const GetMyProposal= createAsyncThunk('admin/get-my-proposals', async (data, thunkAPI) => {
 
  try {
    const response = await getData('/admin/get-my-proposals', data)
    return response
  } catch (error) {
    console.error('Create  error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

// export const getSubCategory = createAsyncThunk('admin/get-subcategory', async (_, thunkAPI) => {
//   try {
//     const response = await getData('/admin/get-subcategory')
//     return response
//   } catch (error) {
//     console.error('Get error:', error)
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })

// export const deleteSubCategory  = createAsyncThunk('admin/delete-subcategory', async (uuid, thunkAPI) => {
//   try {
//     const response = await deleteData(`/admin/delete-subcategory/${uuid}`)
//     return { uuid, ...response }
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })


// export const fetchDeletedBusinessActivity  = createAsyncThunk('admin/fetchDeleted-businesszone', async (queryParams = '', thunkAPI) => {
//   try {
//     const response = await getData(`/admin/get-deleted-zone${queryParams}`)
//     return response
//   } catch (error) {
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })


// export const updateSubCategory = createAsyncThunk(
//   'admin/update-subcategory',
//   async ({ uuid, data }, thunkAPI) => {
//     try {
//       console.log(data, "formData being sent")
//       const response = await putData(`/admin/update-subcategory/${uuid}`, data)
//       return response
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message)
//     }
//   }
// )

// export const getSubCategoryByUUID = createAsyncThunk('admin/get-subcategory-by-uuid', async (uuid, thunkAPI) => {
//   try {
//     const response = await getData(`/admin/get-subcategory-by-uuid/${uuid}`)
//     return response
//   } catch (error) {
//     console.error('Get error:', error)
//     return thunkAPI.rejectWithValue(error.message)
//   }
// })
// export const getSubCategoryByCategoryId = createAsyncThunk(
//   'authority/getByUUID',
//   async ({categoryId}, thunkAPI) => {
//     try {
//       const response = await getData(`/admin/get-subcategory-by-categoryid/${categoryId}`)
//       return response
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response?.data?.message || error.message)
//     }
//   }
// )


const proposalSlice = createSlice({
  name: 'proposal',
  initialState: {
    proposals: [],  
    proposal:null,
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(CreateProposal.pending, (state) => {
        state.isLoading = true
      })
      .addCase(CreateProposal.fulfilled, (state, action) => {
        state.isLoading = false
         state.proposal = action.payload.data
      })
      .addCase(CreateProposal.rejected, (state, action) => {
        state.isLoading = false
     })

      // GetMyProposal
      .addCase(GetMyProposal.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(GetMyProposal.fulfilled, (state, action) => {
        state.isLoading = false
        state.proposals = action.payload.data // assuming `data` is the array of proposals
      })
      .addCase(GetMyProposal.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
     //.addCase(getSubCategory.pending, (state) => {
//         state.isLoading = true
//   })
//   .addCase(getSubCategory.fulfilled, (state, action) => {
//     state.isLoading = false
//     state.sub_categories = action.payload.data
//   })
//       .addCase(getSubCategory.rejected, (state) => {
//     state.isLoading = false
//     state.sub_categories = []
//   })

      

//       // Delete Employee
//       .addCase(deleteSubCategory.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(deleteSubCategory.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.sub_categories = state.sub_categories.filter(item => item.uuid !== action.uuid)

//       })
//       .addCase(deleteSubCategory.rejected, (state, action) => {
//         state.isLoading = false
//       })

//       // Update Employee
//       .addCase(updateSubCategory.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(updateSubCategory.fulfilled, (state, action) => {
//         state.isLoading = false
       
//         const updated = action.payload.data
//           const index = state.sub_categories.findIndex(
//          (category) => category.uuid === updated.uuid
//   );

//   if (index !== -1) {
//     // Replace the old entry with the updated one
//     state.sub_categories[index] = updated;
//   }
       
//       })
//       .addCase(updateSubCategory.rejected, (state, action) => {
//         state.isLoading = false
     
//       }).addCase(getSubCategoryByUUID.pending, (state) => {
//         state.isLoading = true
//       })
//       .addCase(getSubCategoryByUUID.fulfilled, (state, action) => {
//         state.isLoading = false
//         state.sub_category = action.payload.data
//       })
//       .addCase(getSubCategoryByUUID.rejected, (state, action) => {
//         state.isLoading = false
//         state.sub_category = null
       
//       }).addCase(getSubCategoryByCategoryId.pending, (state) => {
//               state.isLoading = true
//             })
//             .addCase(getSubCategoryByCategoryId.fulfilled, (state, action) => {
//               state.isLoading = false
//               state.sub_categories = action.payload.data
      
//             })
//             .addCase(getSubCategoryByCategoryId.rejected, (state, action) => {
//               state.isLoading = false
//               state.sub_categories = []
//               state.error = action.payload
//             })

 },
})

export default proposalSlice.reducer
