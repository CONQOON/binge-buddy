import { MouseEvent } from "react";
import { Button } from "@mui/material";
import { BingeListItem } from "@bb/api-interfaces";
import { PlaylistAdd, PlaylistRemove } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { updateBingeListItem } from "./bingeListSlice";
import { styled } from "@mui/system";
import { theme } from "../theme";
import { AnyAction } from "@reduxjs/toolkit";

export interface BingeListItemButtonProps {
  seriesId: number;
  seriesTitle: string;
}

export function BingeListItemButton(props: BingeListItemButtonProps) {
  const dispatch = useDispatch<AppDispatch>();
  const bingeList = useSelector((state: RootState) => state.bingeList.list);
  const {seriesId, seriesTitle} = props;
  const bingeListItem = getBingeListItemBySeriesId(seriesId, bingeList);

  function handleBtnClick(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    const putToWatchList = !bingeListItem.onWatchList;
    const updatedAt = Math.floor(new Date().getTime() / 1000);

    dispatch(updateBingeListItem({
      ...bingeListItem,
      onWatchList: putToWatchList,
      updatedAt,
    }) as unknown as AnyAction);
  }

  function getBingeListItemBySeriesId(seriesId: number, bingeList: BingeListItem[]): BingeListItem {
    return bingeList.filter(Boolean).find(
      (item) => item.seriesId === seriesId) || {seriesId, seriesTitle, onWatchList: false, watched: false};
  }

  return (
    <StyledBingeListButton onClick={handleBtnClick}>
      {bingeListItem.onWatchList ? <PlaylistRemove style={{color: theme.palette.primary.main}}/> : <PlaylistAdd/>}
    </StyledBingeListButton>
  );
}


const StyledBingeListButton = styled(Button)`
  padding-right: 0;
  color: white;
`;


