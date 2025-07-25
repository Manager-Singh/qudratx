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


export const GetAllProposal= createAsyncThunk('admin/get-all-proposals', async (data, thunkAPI) => {
 
  try {
    const response = await getData('/admin/get-all-proposals', data)
    return response
  } catch (error) {
    console.error('Create  error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getProposalByUUID = createAsyncThunk(
  'proposal/getByUUID',
  async (uuid, thunkAPI) => {
    try {
      const response = await getData(`/admin/get-proposal-by-uuid/${uuid}`);
      return response; 
    } catch (error) {
      console.error('Fetch Proposal By UUID Error:', error);
      return thunkAPI.rejectWithValue(error.message || 'Failed to fetch proposal');
    }
  }
)


export const  deleteProposal = createAsyncThunk('admin/delete-proposal', async (uuid, thunkAPI) => {
  try {
    const response = await deleteData(`/admin/delete-proposal/${uuid}`)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})


export const updateProposal = createAsyncThunk(
  'admin/update-proposal',
  async ({ uuid, data }, thunkAPI) => {
    try {
      console.log(data, "formData being sent")
      const response = await putData(`/admin/update-proposal/${uuid}`, data)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)

// export const approveProposalStatus = createAsyncThunk(
//   'admin/approve-proposal-status',
//   async (uuid, thunkAPI) => {
//     try {
//       const response = await putData(`/admin/proposals/${uuid}/approve`)
//       return { uuid, ...response }
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.message)
//     }
//   }
// )

export const approveProposalStatus = createAsyncThunk(
  'admin/update-proposal-status',
  async ({ uuid, action }, thunkAPI) => {
    try {
      // This will call /admin/proposals/:uuid/approve OR /admin/proposals/:uuid/unapprove
      const response = await putData(`/admin/proposals/${uuid}/${action}`);
      return { uuid, action, ...response };
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);





const proposalSlice = createSlice({
  name: 'proposal',
  initialState: {
    proposals: [],  
    proposal:null,
    isLoading: true,
  },
   reducers: {
    clearSelectedProposal: (state) => {
      state.proposal = null;
      state.isLoading = false;
    }},
  extraReducers: (builder) => {
    builder
      .addCase(CreateProposal.pending, (state) => {
        state.isLoading = true
      })
      .addCase(CreateProposal.fulfilled, (state, action) => {
        state.isLoading = false
        state.proposal = action.payload.proposal
        state.proposals.push(action.payload.proposal)
        
        
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
        state.proposals = action.payload.data 
      })
      .addCase(GetMyProposal.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // get all proposal
       .addCase(GetAllProposal.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(GetAllProposal.fulfilled, (state, action) => {
        state.isLoading = false
        state.proposals = action.payload.data
      })
      .addCase(GetAllProposal.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

       .addCase(deleteProposal.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteProposal.fulfilled, (state, action) => {
        state.isLoading = false
        state.proposals = state.proposals.filter(item => item.uuid !== action.uuid)

      })
      .addCase(deleteProposal.rejected, (state, action) => {
        state.isLoading = false
      })
      // Update proposal
     .addCase(updateProposal.pending, (state) => {
        state.isUpdating = true
      })
      .addCase(updateProposal.fulfilled, (state, action) => {
        state.isUpdating = false
        state.success = 'Proposal updated successfully'
        state.proposal = {
          ...state.proposal,
          ...action.payload.proposal, 
        }
      })
      .addCase(updateProposal.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload
      }).addCase(getProposalByUUID.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getProposalByUUID.fulfilled, (state, action) => {
        state.isLoading = false;
        console.log("action.payload?.data",action.payload?.data  )
        state.proposal = action.payload?.data || null;
      })
      .addCase(getProposalByUUID.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Something went wrong';
      })
      // Approve Proposal Status
      .addCase(approveProposalStatus.pending, (state) => {
        state.isLoading = true
      })
      .addCase(approveProposalStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.success = 'Proposal approved successfully'

        // Update the specific proposal in the list if needed
        const index = state.proposals.findIndex(p => p.uuid === action.payload.uuid)
        if (index !== -1) {
          state.proposals[index] = {
            ...state.proposals[index],
            ...action.payload.data,
          }
        }

        // Also update the current proposal (if loaded)
        if (state.proposal && state.proposal.uuid === action.payload.uuid) {
          state.proposal = {
            ...state.proposal,
            ...action.payload.data,
          }
        }
      })
      .addCase(approveProposalStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })  
 },
})
export const { clearSelectedProposal } = proposalSlice.actions;
export default proposalSlice.reducer
