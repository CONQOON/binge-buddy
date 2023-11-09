// store.ts
import { Store } from 'redux';
import { configureStore } from "@reduxjs/toolkit";
import { seriesDetailsSlice } from "./app/series/seriesDetailsSlice";
import { seriesGridSlice } from "./app/series/seriesGridSlice";
import { globalSeriesSlice } from "./app/series/globalSeriesSlice";
import { bingeListSlice } from "./app/bingeList/bingeListSlice";

const store: Store = configureStore({
    reducer: {
      bingeList: bingeListSlice.reducer,
      globalSeries: globalSeriesSlice.reducer,
      seriesDetails: seriesDetailsSlice.reducer,
      seriesGrid: seriesGridSlice.reducer
    },
  }
);

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
