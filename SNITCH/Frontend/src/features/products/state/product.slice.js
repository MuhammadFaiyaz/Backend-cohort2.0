import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
  name: "product",
  initialState: {
    sellerProducts: [],
    // loading: false,
    // error: null,
  },
  reducers: {
    setProducts: (state, action) => {state.sellerProducts = action.payload},
  }
})

export const { setProducts } = productSlice.actions
export default productSlice.reducer