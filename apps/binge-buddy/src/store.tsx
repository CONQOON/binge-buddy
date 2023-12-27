// store.ts
import { configureStore } from '@reduxjs/toolkit';
import { seriesDetailsSlice } from './app/series/seriesDetailsSlice';
import { seriesGridSlice } from './app/series/seriesGridSlice';
import { globalSeriesSlice } from './app/series/globalSeriesSlice';
import { bingeListSlice, displayBingeList, hideBingeList } from './app/bingeList/bingeListSlice';
import {
  Provider,
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
} from 'react-redux';
import {useMemo} from 'react';

const store = configureStore({
  reducer: {
    bingeList: bingeListSlice.reducer,
    globalSeries: globalSeriesSlice.reducer,
    seriesDetails: seriesDetailsSlice.reducer,
    seriesGrid: seriesGridSlice.reducer,
  },
});

/**
 * Types
 */
export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

/**
 * Typed Hooks
 */
// export const useAppSelector = useSelector<AppState>;
export const useAppSelector: TypedUseSelectorHook<AppState> = useSelector;
export const useAppDispatch = useDispatch<AppDispatch>;

/**
 * Example of a convenience Store
 */
export function useBingeListStore() {
  const values  = useAppSelector((state) => state.bingeList);
  const dispatch = useAppDispatch();
  return useMemo(() => ({
    values,
    displayBingeList: () => dispatch(displayBingeList()),
    hideBingeList: () => dispatch(hideBingeList()),
  }), [values, dispatch]);
}

/**
 * Provider
 */
export const StoreProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => <Provider store={store}>{children}</Provider>;
