import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import themeReducer from './themeSlice'
import employeeReducer from './admin/employeeSlice'
import businessZoneReducer from './admin/businessZoneSlice'
import businessZonesAuthorityReducer from './admin/zoneAuthoritySlice'
// import feeStructureReducer from './admin/feeStructureSlice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    employee:employeeReducer,
    businesszone:businessZoneReducer,
    businessZonesAuthority:businessZonesAuthorityReducer,
    // feeStructure:  feeStructureReducer
  }, 
})

export default store