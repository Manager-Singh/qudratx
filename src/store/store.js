import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import themeReducer from './themeSlice'
import employeeReducer from './admin/employeeSlice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    employee:employeeReducer
  },
})

export default store