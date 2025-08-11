import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  postData,
  getData,
  deleteData,
  putData,
  putDataWithImage,
  patchData,
} from '../../utils/api'

export const CreateProposal = createAsyncThunk('admin/create-proposal', async (data, thunkAPI) => {
  try {
    const response = await postData('/admin/create-proposal', data)
    return response
  } catch (error) {
    console.error('Create  error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const GetMyProposal = createAsyncThunk(
  'admin/get-my-proposals',
  async ({ page = 1, limit = 10, search = '' }, thunkAPI) => {
    try {
      const response = await getData(
        `/admin/get-my-proposals?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
      )
      return response // Expecting { data: [...], total: number }
    } catch (error) {
      console.error('Get my proposals error:', error)
      return thunkAPI.rejectWithValue(error.message)
    }
  }
)


export const GetAllProposal = createAsyncThunk(
  'admin/get-all-proposals',
  async (data, thunkAPI) => {
    try {
      const response = await getData('/admin/get-all-proposals', data)
      return response
    } catch (error) {
      console.error('Create  error:', error)
      return thunkAPI.rejectWithValue(error.message)
    }
  },
)

export const getProposalByUUID = createAsyncThunk('proposal/getByUUID', async (uuid, thunkAPI) => {
  try {
    const response = await getData(`/admin/get-proposal-by-uuid/${uuid}`)
    return response
  } catch (error) {
    console.error('Fetch Proposal By UUID Error:', error)
    return thunkAPI.rejectWithValue(error.message || 'Failed to fetch proposal')
  }
})

export const deleteProposal = createAsyncThunk('admin/delete-proposal', async (uuid, thunkAPI) => {
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
      console.log(data, 'formData being sent')
      const response = await putData(`/admin/update-proposal/${uuid}`, data)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  },
)

export const updateProposalPdf = createAsyncThunk(
  'admin/update-proposalpdf',
  async ({ uuid, data }, thunkAPI) => {
    try {
      console.log('formData being sent', data)
      const response = await putDataWithImage(`/admin/update-proposal/${uuid}`, data)
      return response
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  },
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
  async ({ uuid, action, reason }, thunkAPI) => {
    try {
      // Send `reason` in the body
      const response = await putData(`/admin/proposals/${uuid}/${action}`, { reason })
      return { uuid, action, ...response }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message)
    }
  },
)


// export const updateTrackingStatus = createAsyncThunk(
//   'proposal/updateTrackingStatus',
//   async ({ id, proposal_status }, thunkAPI) => {
//     try {
//       const response = await proposalService.updateTrackingStatus(id, proposal_status)
//       return response.data
//     } catch (error) {
//       return thunkAPI.rejectWithValue(error.response.data)
//     }
//   }
// )

// update proposal status
export const updateTrackingStatus = createAsyncThunk(
  'proposal/updateTrackingStatus',
  async ({ uuid, proposal_status }, thunkAPI) => {
    try {
      const response = await patchData(`/admin/update-proposal-status/${uuid}`, { proposal_status })
      return { uuid, proposal_status }
    } catch (error) {
      return thunkAPI.rejectWithValue(error.message || 'Failed to update tracking status')
    }
  },
)

const proposalSlice = createSlice({
  name: 'proposal',
  initialState: {
    proposals: [],
    proposal: null,
    isLoading: true,
  },
  reducers: {
    clearSelectedProposal: (state) => {
      state.proposal = null
      state.isLoading = false
    },
  },
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
        state.proposals = state.proposals.filter((item) => item.uuid !== action.uuid)
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
      })
      .addCase(updateProposalPdf.pending, (state) => {
        state.isUpdating = true
      })
      .addCase(updateProposalPdf.fulfilled, (state, action) => {
        state.isUpdating = false
        state.success = 'Proposal updated successfully'
        state.proposal = {
          ...state.proposal,
          ...action.payload.proposal,
        }
      })
      .addCase(updateProposalPdf.rejected, (state, action) => {
        state.isUpdating = false
        state.error = action.payload
      })
      .addCase(getProposalByUUID.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getProposalByUUID.fulfilled, (state, action) => {
        state.isLoading = false
        state.proposal = action.payload?.data || null
      })
      .addCase(getProposalByUUID.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload || 'Something went wrong'
      })
      // Approve Proposal Status
      .addCase(approveProposalStatus.pending, (state) => {
        state.isLoading = true
      })
      .addCase(approveProposalStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.success = 'Proposal approved successfully'

        // Update the specific proposal in the list if needed
        const index = state.proposals.findIndex((p) => p.uuid === action.payload.uuid)
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
      // update tracking status
      // .addCase(updateTrackingStatus.pending, (state) => {
      //   state.isLoading = true
      // })
      // .addCase(updateTrackingStatus.fulfilled, (state, action) => {
      //   state.isLoading = false
      //   state.proposals = state.proposals.map((proposal) =>
      //     proposal.uuid === action.payload.uuid ? { ...proposal, proposal_status: action.payload.proposal_status } : proposal
      //   )
      // })
      // .addCase(updateTrackingStatus.rejected, (state, action) => {
      //   state.isLoading = false
      //   state.error = action.payload || 'Something went wrong'
      // })
      .addCase(updateTrackingStatus.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateTrackingStatus.fulfilled, (state, action) => {
        state.isLoading = false

        const { uuid, proposal_status } = action.payload
        const proposalIndex = state.proposals.findIndex((p) => p.uuid === uuid)

        if (proposalIndex !== -1) {
          state.proposals[proposalIndex].proposal_status = proposal_status
        }

        if (state.proposal && state.proposal.uuid === uuid) {
          state.proposal.proposal_status = proposal_status
        }
      })
      .addCase(updateTrackingStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})
export const { clearSelectedProposal } = proposalSlice.actions
export default proposalSlice.reducer
