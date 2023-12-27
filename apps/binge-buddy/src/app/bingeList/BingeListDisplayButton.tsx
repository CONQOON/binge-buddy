import { MouseEvent } from "react";
import { MUIStyledCommonProps, styled } from "@mui/system";
import { Button, ButtonProps } from "@mui/material";
import { useBingeListStore } from "../../store";

export interface BingeListToggleButtonProps extends ButtonProps {
  blaction?: 'open' | 'close' | 'toggle';
}

export function BingeListDisplayButton(props: BingeListToggleButtonProps) {
  const { bingeList: {isDisplaying: doDisplayBingeList}, hideBingeList, displayBingeList } = useBingeListStore();
  const {blaction = 'toggle'} = props;

  function handleClick(event: MouseEvent<HTMLButtonElement>) {
    if (blaction !== 'open' && doDisplayBingeList) {
      hideBingeList();
    } else if (blaction !== 'close' && !doDisplayBingeList)
      displayBingeList();
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
