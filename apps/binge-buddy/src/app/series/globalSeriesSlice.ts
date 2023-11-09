import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { fetchGenres as fetchGenresFromAPI } from "../../api";
import { GenrePayload } from "@bb/api-interfaces";
import { UnhandledErrorAction } from "next/dist/client/components/react-dev-overlay/internal/error-overlay-reducer";

export interface GlobalSeriesState {
  isLoading: boolean;
  genres: string[];
  error?: string;
}

const initialState: GlobalSeriesState = {
  isLoading: false,
  genres: [],
}

export const globalSeriesSlice = createSlice({
  initialState,
  name: 'globalSeries',
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGenres.fulfilled, (state: GlobalSeriesState, action: PayloadAction<GenrePayload>) => {
        state.isLoading = false;
        state.genres = action.payload;
      })
      .addCase(fetchGenres.pending, (state: GlobalSeriesState) => {
        state.isLoading = true;
      })
      .addMatcher(action =>
        action.type.endsWith('/rejected'), (state: GlobalSeriesState, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Unknown error while loading genres';
      });
  }
});

export const fetchGenres = createAsyncThunk<string[], void>(
  'globalSeries/loadGenres',
  async () => {
    return fetchGenresFromAPI();
  }
);
