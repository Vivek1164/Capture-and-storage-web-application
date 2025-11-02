import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import mediaService from "./mediaService.js";

// ✅ Fetch all documents
export const fetchDocuments = createAsyncThunk(
  "documents/fetchAll",
  async (_, thunkAPI) => {
    try {
      return await mediaService.getMedia();
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// ✅ Upload new document
export const uploadDocument = createAsyncThunk(
  "documents/upload",
  async (formData, thunkAPI) => {
    try {
      return await mediaService.uploadMedia(formData);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// ✅ Delete document
export const deleteDocument = createAsyncThunk(
  "documents/delete",
  async (id, thunkAPI) => {
    try {
      await mediaService.deleteMedia(id);
      return id; // return id to remove from Redux state
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data?.message);
    }
  }
);

// ✅ Slice
const documentSlice = createSlice({
  name: "documents",
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Upload
      .addCase(uploadDocument.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(uploadDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.items = state.items.filter((doc) => doc._id !== action.payload);
      });
  },
});

export default documentSlice.reducer;
