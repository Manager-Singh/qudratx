import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice'
import themeReducer from './themeSlice'
import employeeReducer from './admin/employeeSlice'
import businessZoneReducer from './admin/businessZoneSlice'
import businessZonesAuthorityReducer from './admin/zoneAuthoritySlice'
import feeStructureReducer from './admin/feeStructureSlice'
import BusinessCategoryReducer from './admin/businessCategorySlice'
import clientSliceReducer from './admin/clientSlice'
import leadReducer from './admin/leadSlice'
import packageReducer from './admin/packageSlice'
import subCategoryReducer from './admin/subCategorySlice'
import businessActivityReducer from './admin/businessActivitySlice'
import proposalReducer from './admin/proposalSlice'
import DashboardReducer from './admin/dashboardSlice'
import notificationSlice from './admin/notificationSlice';
import reasonReducer from './admin/reasonSlice'
import trashReducer from './admin/trashSlice'
const store = configureStore({
  reducer: {
    auth: authReducer,
    theme: themeReducer,
    employee:employeeReducer,
    businesszone:businessZoneReducer,
    businessZonesAuthority:businessZonesAuthorityReducer,
    business_category:BusinessCategoryReducer,
    feeStructure:feeStructureReducer,
    client:clientSliceReducer,
    lead:leadReducer,
    package:packageReducer,
    sub_category:subCategoryReducer,
    business_activity:businessActivityReducer,
    proposal:proposalReducer,
    dashboard:DashboardReducer,
    notification: notificationSlice,
    reasons:reasonReducer,
    trash:trashReducer
  }, 
})

export default store