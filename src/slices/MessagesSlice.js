import { createSlice } from "@reduxjs/toolkit";

function createMessage(state, title, severity, text) {
  state.items.push({
    title,
    severity,
    text,
    created: Date.now(),
  });
  state.items = state.items.slice(0);
}
const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    items: [],
  },
  reducers: {
    error(state, action) {
      createMessage(state, "Error", "error", action.payload);
    },
    info(state, action) {
      createMessage(state, "Information", "info", action.payload);
    },
    set(state, action) {
      state.items = action.payload;
    },
  },
});

export const { set, error, info } = messagesSlice.actions;

export default messagesSlice.reducer;
