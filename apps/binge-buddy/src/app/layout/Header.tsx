import React from 'react';
import { AppBar, AppBarProps, Button } from "@mui/material";
import { Container, styled } from "@mui/system";
import { Link } from "react-router-dom";
import { BingeListDisplayButton } from "../bingeList/BingeListDisplayButton";

const StyledAppBar = styled(AppBar)<AppBarProps>`
  display: flex;
  padding: 0 1rem;
  background-color: ${(props) => props.theme.palette.background.default}; // Use the theme background color
  z-index: 1200;
`;

export function Header() {
  return (
    <StyledAppBar position={'fixed'}>
      <StyledAppBarContainer maxWidth={'lg'}>
        <Link to={'/'}>
          <StyledLogo src="/logo.jpg" alt="Logo"/>
        </Link>
        <StyledNavBar>
          <BingeListDisplayButton blaction={'open'}>
            My Binge List
          </BingeListDisplayButton>
        </StyledNavBar>
      </StyledAppBarContainer>
    </StyledAppBar>
  );
}

const StyledLogo = styled('img')`
  margin-left: -20px;
  width: 160px;
  height: auto;
`;

const StyledNavBar = styled('div')`
  display: flex;
  flex-direction: row;
  align-items: center;
`
const StyledAppBarContainer = styled(Container)`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`


