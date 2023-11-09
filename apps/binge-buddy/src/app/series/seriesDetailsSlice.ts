import { Episode, Series, SeriesDetailsPayload } from "@bb/api-interfaces";
import { createAsyncThunk, createSlice, isRejected, PayloadAction } from "@reduxjs/toolkit";
import { fetchSeriesById } from "../../api";

export interface SeriesDetailsState {
  isLoading: boolean;
  seriesId?: number;
  series?: Series;
  episodes?: Episode[];
  error?: string;
}

const initialState: SeriesDetailsState = {
  isLoading: false,
}

export const seriesDetailsSlice = createSlice({
  initialState,
  name: 'seriesDetails',
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeriesDetails.fulfilled, (state: SeriesDetailsState, action: PayloadAction<SeriesDetailsPayload>) => {
        state.isLoading = false;
        state.seriesId = action.payload.series.id;
        state.series = action.payload.series;
        state.episodes = action.payload.episodes;
      })
      .addCase(fetchSeriesDetails.pending, (state: SeriesDetailsState) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addMatcher(action =>
        action.type.endsWith('/rejected'), (state: SeriesDetailsState, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Unknown error while loading series details data';
      });
  }
});

export const fetchSeriesDetails = createAsyncThunk<SeriesDetailsPayload, number>(
  'seriesDetails/loadSeriesDetails',
  async (seriesId) => {
    return fetchSeriesById(seriesId);
  }
);
