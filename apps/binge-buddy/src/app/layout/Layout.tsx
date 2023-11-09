import React, { ReactNode } from 'react';
import { Container, ContainerProps, styled } from '@mui/system';
import { Footer } from './Footer';
import { Header } from './Header';
import { BingeList } from "../bingeList/BingeList";

const StyledLayoutContainer = styled(Container)<ContainerProps<typeof Container>>`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: ${(props) => props.theme.palette.background.default}; // Use the theme background color
`;

const StyledMain = styled('main')`
  margin-top: 92px;
`

export function Layout({children}: ContainerProps<typeof Container> & { children: ReactNode }) {
  return (
    <StyledLayoutContainer maxWidth={'lg'}>
      <Header/>
      <StyledMain>
        {children}
        <BingeList/>
      </StyledMain>
      <Footer/>
    </StyledLayoutContainer>
  );
}
