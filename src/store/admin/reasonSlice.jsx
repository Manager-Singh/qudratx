import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData } from '../../utils/api';


export const fetchReasons = createAsyncThunk(
  // Action type string: 'sliceName/actionName'
  'reasons/fetchReasons',
  // Payload creator function
  async (_, { rejectWithValue }) => {
    try {
      // Make the API call to your endpoint
      const response = await getData('/admin/get-reasons'); // Assuming a proxy or base URL is set
    
      return response.data;
    } catch (error) {
      
      if (error.response) {
        return rejectWithValue(error.response.data.message || 'Server error');
      }
      return rejectWithValue(error.message);
    }
  }
);


const initialState = {
  reasons: [], // This will hold the array of reasons
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null, // To store any error messages
};


const reasonsSlice = createSlice({
  name: 'reasons',
  initialState,

  reducers: {},
  
  extraReducers: (builder) => {
    builder
      // Case for when the fetch is pending (request is in flight)
      .addCase(fetchReasons.pending, (state) => {
        state.status = 'loading';
        state.error = null; // Clear previous errors
      })
      // Case for when the fetch is successful
      .addCase(fetchReasons.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.reasons = action.payload; // Update the reasons with the data from the API
      })
      // Case for when the fetch fails
      .addCase(fetchReasons.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload; // `action.payload` is the value from `rejectWithValue`
      });
  },
});

// Export the reducer to be added to the store
export default reasonsSlice.reducer;
