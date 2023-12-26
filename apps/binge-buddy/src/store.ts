// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { seriesDetailsSlice } from "./app/series/seriesDetailsSlice";
import { seriesGridSlice } from "./app/series/seriesGridSlice";
import { globalSeriesSlice } from "./app/series/globalSeriesSlice";
import { bingeListSlice } from "./app/bingeList/bingeListSlice";

export const store = configureStore({
    reducer: {
      bingeList: bingeListSlice.reducer,
      globalSeries: globalSeriesSlice.reducer,
      seriesDetails: seriesDetailsSlice.reducer,
      seriesGrid: seriesGridSlice.reducer
    },
  }
);

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
