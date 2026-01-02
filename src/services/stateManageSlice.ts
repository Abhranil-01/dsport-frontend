import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    addressId: null,
};

export const stateManageSlice = createSlice({
  name: "stateManage",
  initialState,
  reducers:{
    setAddressId: (state, action) => {
      state.addressId = action.payload;
    }
  }});

export const { setAddressId } = stateManageSlice.actions;
export default stateManageSlice.reducer;