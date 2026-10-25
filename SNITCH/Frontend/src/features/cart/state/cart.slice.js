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

export const { setCart } = cartSlice.actions;
export const selectCartItems = (state) => state.cart.items;
export const selectCartCount = (state) => state.cart.items.reduce((sum, item) => sum + item.quantity, 0)

export default cartSlice.reducer;