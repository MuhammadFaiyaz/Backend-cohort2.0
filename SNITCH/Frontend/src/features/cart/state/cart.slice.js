import { createSlice } from "@reduxjs/toolkit"

const cartSlice = createSlice({
  name: "cart",

  initialState: {
    items: [],
    totals: {},
  },
  reducers: {
    setCart: (state, action) => {
      state.items = action.payload?.items ?? []
      state.totals = action.payload?.totals ?? {}
    }
  }
})

export const { setCart } = cartSlice.actions
export default cartSlice.reducer