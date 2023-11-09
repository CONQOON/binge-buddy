import { AnyAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { BingeListItem, BingeListPayload } from "@bb/api-interfaces";
import { fetchBingeList as fetchBingeListFromApi, updateBingeList as updateBingeListWithApi } from "../../api";
import { AppDispatch } from "../../store";

const dummyUserId = '1234567890';

export interface BingeListState {
  isLoading: boolean;
  list: BingeListItem[];
  isDisplaying: boolean;
  error?: string;
}

const initialState: BingeListState = {
  isLoading: false,
  list: [],
  isDisplaying: false
}

export const bingeListSlice = createSlice({
  initialState,
  name: 'bingeList',
  reducers: {
    displayBingeList: (state: BingeListState) => {
      state.isDisplaying = true;
    },
    hideBingeList: (state: BingeListState) => {
      state.isDisplaying = false;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBingeList.fulfilled, (state: BingeListState, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addCase(updateBingeList.fulfilled, (state: BingeListState, action) => {
        state.isLoading = false;
        state.list = action.payload;
      })
      .addMatcher(action =>
        action.type.endsWith('/pending'), (state: BingeListState, action) => {
        state.isLoading = true;
        state.error = undefined;
      })
      .addMatcher(action =>
        action.type.endsWith('/rejected'), (state: BingeListState, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Unknown error while loading binge list data';
      });
  }
});

export const fetchBingeList = createAsyncThunk<BingeListItem[]>(
  'bingeList/fetchBingeList',
  async () => {
    return fetchBingeListFromApi(dummyUserId);
  }
);

export const updateBingeListItem = createAsyncThunk<BingeListItem[], BingeListItem, { dispatch: AppDispatch }>(
  'bingeList/updateBingeListItem',
  async (bingeListItem, {dispatch}) => {

    try {
      const bingeList = await fetchBingeListFromApi(dummyUserId);

      const updatedBingeList = bingeList.map((item) => {
        if (item.seriesId === bingeListItem.seriesId) {
          return bingeListItem;
        } else {
          return item;
        }
      });

      await dispatch(updateBingeList(updatedBingeList) as unknown as AnyAction);

      return updatedBingeList;
    } catch (error) {
      // Handle the error here if needed
      throw error;
    }
  }
);


export const updateBingeList = createAsyncThunk<BingeListItem[], BingeListItem[]>(
  'bingeList/updateBingeList',
  async (bingeList) => {
    return updateBingeListWithApi(dummyUserId, bingeList as BingeListPayload)
  }
);

export const {displayBingeList, hideBingeList} = bingeListSlice.actions;
