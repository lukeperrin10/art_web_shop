import { createSlice } from '@reduxjs/toolkit'

const messageSlice = createSlice({
  name: 'message',
  initialState: '',
  reducers: {
    successMessage: (state, action) => {
      return {
        ...state,
        message: action.payload,
        open: true
      }
    },
  },
})

export const messageReducer = messageSlice.reducer

export const { successMessage } = messageSlice.actions
