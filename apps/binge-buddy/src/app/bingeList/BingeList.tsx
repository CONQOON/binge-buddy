import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { hideBingeList, updateBingeListItem } from "./bingeListSlice";
import { styled } from "@mui/system";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography
} from "@mui/material";
import { RadioButtonUnchecked, TaskAlt } from "@mui/icons-material";
import { BingeListItem } from "@bb/api-interfaces";
import { BingeListDisplayButton } from "./BingeListDisplayButton";
import { useState } from "react";
import { AnyAction } from "@reduxjs/toolkit";

export function BingeList() {
  const dispatch = useDispatch<AppDispatch>();
  const isDisplayingBingeList = useSelector((state: RootState) => state.bingeList.isDisplaying);
  const bingeList = useSelector((state: RootState) =>
    state.bingeList.list
      .filter((item: BingeListItem) => item.onWatchList === true)
      .sort((a: BingeListItem, b: BingeListItem) => (a.updatedAt ?? 0) - (b.updatedAt ?? 0))
  );
  const [clickedItems, setClickedItems] = useState<number[]>([]);

  function handleDrawerClose() {
    dispatch(hideBingeList());
  }

  function handleListItemClick(bingeListItem: BingeListItem) {
    setClickedItems([...clickedItems, bingeListItem.seriesId]);

    setTimeout(() => {
      dispatch(updateBingeListItem({
        ...bingeListItem,
        watched: true,
        onWatchList: false,
      }) as unknown as AnyAction);
    }, 1000);
  }

  return (
    <StyledDrawer
      variant="temporary"
      anchor="right"
      open={isDisplayingBingeList}
      onClose={handleDrawerClose}
    >
      <StyledHeader>
        <StyledCloseButton blaction={"close"}>X</StyledCloseButton>
        <StyledTitle variant={"h6"}>My Binge List</StyledTitle>
      </StyledHeader>
      <div>
        <List sx={{width: '100%', bgcolor: 'background.paper', marginTop: 2}}>
          {bingeList.map((bingeListItem: BingeListItem) => {
            const labelId = `checkbox-list-label-${bingeListItem.seriesId}`;

            return (
              <StyledListItem
                key={bingeListItem.seriesId}
                disablePadding
              >
                <ListItemButton role={undefined} dense onClick={() => {
                  handleListItemClick(bingeListItem)
                }}>
                  <ListItemIcon>
                    {clickedItems.some(clickedItem => clickedItem === bingeListItem.seriesId) ?
                      <TaskAlt style={{color: 'green', padding: '0 16 0 92'}}/> :
                      <RadioButtonUnchecked style={{color: 'white', padding: '0 16 0 92'}}/>}
                  </ListItemIcon>
                  <ListItemText id={labelId} primary={bingeListItem.seriesTitle || 'n.a.'}/>
                </ListItemButton>
              </StyledListItem>
            );
          })}
        </List>
      </div>
    </StyledDrawer>
  );
}

const StyledDrawer = styled(Drawer, {shouldForwardProp: (prop) => prop !== 'isOpen'})`
  & .MuiDrawer-paper {
    width: 100%;
    max-width: 400px;
  }
`;

const StyledHeader = styled('div')`
  display: flex;
  flex-direction: row;
`;

const StyledTitle = styled(Typography)`
  flex-grow: 1;
  padding: 8px 8px 8px 68px;
`;

const StyledCloseButton = styled(BingeListDisplayButton)`
  width: 42px;
  padding: 0;
  min-width: 0;
  background-color: ${(props) => props.theme.palette.primary.main};
`;

const StyledListItem = styled(ListItem)`
  color: 'white';
`;
