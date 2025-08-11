import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { postData, getData ,deleteData ,putData} from '../../utils/api'

export const addEmployee = createAsyncThunk('admin/create-employee', async (credentials, thunkAPI) => {
  try {
    const response = await postData('/admin/create-employee', credentials)
    return response
  } catch (error) {
    console.error('Create employee error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const getEmployees = createAsyncThunk(
  'admin/get-employee',
  async ({ page = 1, limit = 10, search = '' } = {}, thunkAPI) => {
    try {
      // Build query params for API
      const queryParams = new URLSearchParams({
        page,
        limit,
        search
      }).toString();

      const response = await getData(`/admin/get-employee?${queryParams}`);
      return response;
    } catch (error) {
      console.error('Get employees error:', error);
      return thunkAPI.rejectWithValue(error.message);
    }
  }
);

export const deleteEmployee = createAsyncThunk('employee/deleteEmployee', async (uuid, thunkAPI) => {
  try {
    const response = await deleteData(`/admin/delete-employee/${uuid}`)
    return { uuid, ...response }
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

// Get Deleted Employees
export const fetchDeletedEmployees = createAsyncThunk('employee/fetchDeletedEmployees', async (queryParams = '', thunkAPI) => {
  try {
    const response = await getData(`/admin/deleted-employee${queryParams}`)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

// Update Employee (by UUID)
export const updateEmployee = createAsyncThunk('employee/updateEmployee', async ({ uuid, data }, thunkAPI) => {
  try {
    const response = await putData(`/admin/update-employee/${uuid}`, data)
    return response
  } catch (error) {
    return thunkAPI.rejectWithValue(error.message)
  }
})

export const fetchEmployeeByUuid = createAsyncThunk('admin/get-employee-by-uuid', async (uuid, thunkAPI) => {
  try {
    const response = await getData(`/admin/get-employee-by-uuid/${uuid}`)
    return response
  } catch (error) {
    console.error('Get employees error:', error)
    return thunkAPI.rejectWithValue(error.message)
  }
})


const employeeSlice = createSlice({
  name: 'employee',
  initialState: {
    employees: [],
    employee:null,
    isLoading: true,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(addEmployee.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addEmployee.fulfilled, (state, action) => {
        state.isLoading = false
        state.employees.push(action.payload.user)
      })
      .addCase(addEmployee.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      }).addCase(getEmployees.pending, (state) => {
    state.isLoading = true
     })
    .addCase(getEmployees.fulfilled, (state, action) => {
    state.isLoading = false
    state.employees = action.payload.data
  })
      .addCase(getEmployees.rejected, (state) => {
    state.isLoading = false
    state.employees = []
  })

      // Get Employees
      

      // Get Deleted Employees
      // .addCase(getDeletedEmployees.pending, (state) => {
      //   state.isLoading = true
      // })
      // .addCase(getDeletedEmployees.fulfilled, (state, action) => {
      //   state.isLoading = false
      //   state.deletedEmployees = action.payload.data
      // })
      // .addCase(getDeletedEmployees.rejected, (state, action) => {
      //   state.isLoading = false
      //   state.deletedEmployees = []
      //   state.error = action.payload
      // })

      // Delete Employee
      .addCase(deleteEmployee.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteEmployee.fulfilled, (state, action) => {
        state.isLoading = false
        state.employees = state.employees.filter(emp => emp.uuid !== action.uuid)
        state.message = action.message
      })
      .addCase(deleteEmployee.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })

      // Update Employee
      .addCase(updateEmployee.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateEmployee.fulfilled, (state, action) => {
        state.isLoading = false
        console.log(action.payload,"action.payload")
        const updated = action.payload.user
        state.employees = state.employees.map(emp =>
          emp.uuid === updated.uuid ? updated : emp
        )
        state.message = action.payload.message
      })
      .addCase(updateEmployee.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      }).addCase(fetchEmployeeByUuid.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchEmployeeByUuid.fulfilled, (state, action) => {
        state.isLoading = false
        state.employee = action.payload.data
      })
      .addCase(fetchEmployeeByUuid.rejected, (state, action) => {
        state.isLoading = false
        state.employee = null
        state.error = action.payload
      })
  },
})

export default employeeSlice.reducer
