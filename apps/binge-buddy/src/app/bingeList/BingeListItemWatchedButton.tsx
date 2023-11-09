import { MouseEvent } from "react";
import { Button } from "@mui/material";
import { BingeListItem } from "@bb/api-interfaces";
import { RadioButtonUnchecked, TaskAlt } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { updateBingeListItem } from "./bingeListSlice";
import { AnyAction } from "@reduxjs/toolkit";

export interface BingeListItemWatchedButtonProps {
  seriesId: number;
  seriesTitle: string;
}

export function BingeListItemWatchedButton(props: BingeListItemWatchedButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const bingeList = useSelector((state: RootState) => state.bingeList.list);
  const {seriesId, seriesTitle} = props;
  const bingeListItem = getBingeListItemBySeriesId(seriesId, bingeList);

  function handleBtnClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    dispatch(updateBingeListItem({
      ...bingeListItem,
      watched: !bingeListItem.watched,
    })as unknown as AnyAction);
  }

  function getBingeListItemBySeriesId(seriesId: number, bingeList: BingeListItem[]): BingeListItem {
    return bingeList.filter(Boolean).find(
      (item) => item.seriesId === seriesId) || {seriesId, seriesTitle, onWatchList: false, watched: false};
  }

  return (
    <Button onClick={handleBtnClick} style={{color: bingeListItem.watched ? 'green' : 'white'} }>
      {bingeListItem.watched ? <TaskAlt/> : <RadioButtonUnchecked/>}
    </Button>
  );
}





