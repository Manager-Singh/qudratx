import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import themeReducer from './themeSlice'
import employeeReducer from './admin/employeeSlice'
import businessZoneReducer from './admin/businessZoneSlice'
import businessZonesAuthorityReducer from './admin/zoneAuthoritySlice'
import feeStructureReducer from './admin/feeStructureSlice'
import BusinessActivityReducer from './admin/businessActivitySlice'
import clientSliceReducer from './admin/clientSlice'
import leadReducer from './admin/leadSlice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    employee:employeeReducer,
    businesszone:businessZoneReducer,
    businessZonesAuthority:businessZonesAuthorityReducer,
    business_activity:BusinessActivityReducer,
    feeStructure:feeStructureReducer,
    client:clientSliceReducer,
    lead:leadReducer
  }, 
})

export default store