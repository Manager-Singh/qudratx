import { createSlice } from '@reduxjs/toolkit'

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    sidebarShow: true,
    theme: 'light',
  },
  reducers: {
    setThemeState: (state, action) => {
      const payload = { ...action.payload }

      // Force light theme always
      if ('theme' in payload) {
        payload.theme = 'light'
      }

      return { ...state, ...payload }
    },
  },
})

export const { setThemeState } = themeSlice.actions
export default themeSlice.reducer
