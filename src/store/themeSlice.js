import { createSlice } from '@reduxjs/toolkit'

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    sidebarShow: true,
    theme: 'light',
  },
  reducers: {
    setThemeState: (state, action) => {
      return { ...state, ...action.payload }
    },
  },
})

export const { setThemeState } = themeSlice.actions
export default themeSlice.reducer