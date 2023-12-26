import { MouseEvent } from "react";
import { MUIStyledCommonProps, styled } from "@mui/system";
import { Button, ButtonProps } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../store";
import { displayBingeList, hideBingeList } from "./bingeListSlice";

export interface BingeListToggleButtonProps extends ButtonProps {
  blaction?: 'open' | 'close' | 'toggle';
}

export function BingeListDisplayButton(props: BingeListToggleButtonProps) {
  const dispatch = useAppDispatch();
  const doDisplayBingeList = useAppSelector((state) => state.bingeList.isDisplaying);
  const {blaction = 'toggle'} = props;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (blaction !== 'open' && doDisplayBingeList) {
      dispatch(hideBingeList());
    } else if (blaction !== 'close' && !doDisplayBingeList)
      dispatch(displayBingeList());
  }

  return (<StyledBingeListButton {...props as MUIStyledCommonProps} onClick={handleClick}/>);
}

const StyledBingeListButton = styled(Button)`
  background-color: ${(props) => props.theme.palette.primary.main};
  color: white;
  padding: 8px 16px;
  height: 42px;
  font-size: 14px;
  border-radius: 4px;

  &:hover {
    background-color: ${(props) => props.theme.palette.primary.dark};
  }
`;
