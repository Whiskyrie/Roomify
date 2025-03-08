// src/store/slices/propertySlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { propertyService } from "../../../services/api";
import { PropertyState } from "../../../types/proprerty";

// Types
const initialState: PropertyState = {
  properties: [],
  currentProperty: null,
  loading: false,
  error: null,
  total: 0,
};

// Async thunks
export const fetchProperties = createAsyncThunk(
  "properties/fetchAll",
  async (filters: any = {}, { rejectWithValue }) => {
    try {
      const response = await propertyService.getAllProperties(filters);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch properties"
      );
    }
  }
);

export const fetchPropertyById = createAsyncThunk(
  "properties/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await propertyService.getPropertyById(id);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch property"
      );
    }
  }
);

export const createProperty = createAsyncThunk(
  "properties/create",
  async (propertyData: any, { rejectWithValue }) => {
    try {
      const response = await propertyService.createProperty(propertyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create property"
      );
    }
  }
);

export const updateProperty = createAsyncThunk(
  "properties/update",
  async (
    { id, propertyData }: { id: string; propertyData: any },
    { rejectWithValue }
  ) => {
    try {
      const response = await propertyService.updateProperty(id, propertyData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update property"
      );
    }
  }
);

export const deleteProperty = createAsyncThunk(
  "properties/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      await propertyService.deleteProperty(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete property"
      );
    }
  }
);

export const fetchUserProperties = createAsyncThunk(
  "properties/fetchUserProperties",
  async (_, { rejectWithValue }) => {
    try {
      const response = await propertyService.getUserProperties();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user properties"
      );
    }
  }
);

// Create slice
const propertySlice = createSlice({
  name: "property",
  initialState,
  reducers: {
    clearPropertyError: (state) => {
      state.error = null;
    },
    clearProperty: (state) => {
      state.currentProperty = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch all properties
    builder.addCase(fetchProperties.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProperties.fulfilled, (state, action) => {
      state.loading = false;
      state.properties = action.payload;
      state.total = action.payload.length;
    });
    builder.addCase(fetchProperties.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch property by ID
    builder.addCase(fetchPropertyById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchPropertyById.fulfilled, (state, action) => {
      state.loading = false;
      state.currentProperty = action.payload;
    });
    builder.addCase(fetchPropertyById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create property
    builder.addCase(createProperty.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createProperty.fulfilled, (state, action) => {
      state.loading = false;
      state.properties.push(action.payload);
    });
    builder.addCase(createProperty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update property
    builder.addCase(updateProperty.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateProperty.fulfilled, (state, action) => {
      state.loading = false;
      // Update in property list
      const index = state.properties.findIndex(
        (p: { id: any }) => p.id === action.payload.id
      );
      if (index !== -1) {
        state.properties[index] = action.payload;
      }
      // Update current property
      if (
        state.currentProperty &&
        state.currentProperty.id === action.payload.id
      ) {
        state.currentProperty = action.payload;
      }
    });
    builder.addCase(updateProperty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete property
    builder.addCase(deleteProperty.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteProperty.fulfilled, (state, action) => {
      state.loading = false;
      // Remove from property list
      state.properties = state.properties.filter(
        (p: { id: string }) => p.id !== action.payload
      );
      // Clear current property if deleted
      if (
        state.currentProperty &&
        state.currentProperty.id === action.payload
      ) {
        state.currentProperty = null;
      }
    });
    builder.addCase(deleteProperty.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearPropertyError, clearProperty } = propertySlice.actions;
export default propertySlice.reducer;
