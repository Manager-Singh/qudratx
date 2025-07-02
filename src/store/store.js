import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import themeReducer from './themeSlice'
import employeeReducer from './admin/employeeSlice'
import businessZoneReducer from './admin/businessZoneSlice'
import businessZonesAuthorityReducer from './admin/zoneAuthoritySlice'
// import feeStructureReducer from './admin/feeStructureSlice'
import BusinessActivityReducer from './admin/businessActivitySlice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    employee:employeeReducer,
    businesszone:businessZoneReducer,
    businessZonesAuthority:businessZonesAuthorityReducer,
    business_activity:BusinessActivityReducer
    // feeStructure:  feeStructureReducer
  }, 
})

export default store