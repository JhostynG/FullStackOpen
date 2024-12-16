import { createSlice } from '@reduxjs/toolkit'

const notificationSlice = createSlice({
  name: 'notification',
  initialState: '',
  reducers: {
    notificationChange(state, action) {
      return action.payload
    },
    deleteNotification() {
      return ''
    }
  },
})

export const { notificationChange, deleteNotification } = notificationSlice.actions

export const setNotification = (content, time) => {
  return async dispatch => {
    dispatch(notificationChange(content))
    setTimeout(() => {
      dispatch(deleteNotification())
    }, time * 1000)
  }
}

export default notificationSlice.reducer