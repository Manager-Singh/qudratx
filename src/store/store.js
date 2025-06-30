import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import themeReducer from './themeSlice'
import employeeReducer from './admin/employeeSlice'
import businessZoneReducer from './admin/businessZoneSlice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    employee:employeeReducer,
    businesszone:businessZoneReducer,
  },
})

export default store