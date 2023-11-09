import { Series, SeriesFilter, SeriesFilterTypes } from '@bb/api-interfaces';
import { createAsyncThunk, createSlice, isPending, isRejected, PayloadAction } from "@reduxjs/toolkit";
import { fetchSeriesData } from "../../api";
import { SearchParams } from "./types";

export interface SeriesGridState {
  isLoading: boolean;
  data: Series[];
  searchTerm?: string;
  genre?: string;
  error?: string;
}

const initialState: SeriesGridState = {
  isLoading: false,
  data: [],
  error: undefined,
};

export const seriesGridSlice = createSlice({
  initialState: initialState,
  name: 'seriesGrid',
  reducers: {
    updateSearchParams: (state: SeriesGridState, action: PayloadAction<SearchParams>) => {
      state.searchTerm = action.payload.searchTerm;
      state.genre = action.payload.genre;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchSeries.fulfilled, (state: SeriesGridState, {payload}) => {
        state.isLoading = false;
        state.data = payload;
      })
      .addMatcher(isPending(fetchSeries), (state: SeriesGridState) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addMatcher(isRejected(fetchSeries), (state: SeriesGridState, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Unknown error while loading series data.';
      });
  },
});

export const fetchSeries = createAsyncThunk<Series[], SearchParams>(
  'seriesGrid/fetchSeries',
  async (searchParams: { searchTerm?: string, genre?: string } = {}, {dispatch}) => {
    const {searchTerm, genre} = searchParams;
    const searchFilters: SeriesFilter[] = [];

    if (searchTerm) {
      searchFilters.push({filterType: SeriesFilterTypes.unstructuredText, value: searchTerm});
    }
    if (genre) {
      searchFilters.push({filterType: SeriesFilterTypes.genre, value: genre});
    }

    // Dispatch the updateSearchParams action to update the state with searchTerm and genre
    dispatch(updateSearchParams({searchTerm, genre}));

    return await fetchSeriesData(searchFilters);
  },
);

// Actions
export const {updateSearchParams} = seriesGridSlice.actions;


export default seriesGridSlice.reducer;
