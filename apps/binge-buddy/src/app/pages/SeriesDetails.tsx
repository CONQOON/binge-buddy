import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import { fetchSeriesDetails, SeriesDetailsState } from '../series/seriesDetailsSlice';
import {
  Chip,
  CircularProgress,
  Grid,
  List,
  ListItem,
  ListItemText,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Container, styled } from '@mui/system';
import { Episode } from "@bb/api-interfaces";
import { AppDispatch, RootState } from "../../store";
import { Layout } from '../layout';
import { AnyAction } from "@reduxjs/toolkit";

export function SeriesDetails() {
  const dispatch = useDispatch<AppDispatch>();
  const {id} = useParams<{ id: string }>();
  const {isLoading, series, episodes}: SeriesDetailsState = useSelector((state: RootState) => state.seriesDetails);

  useEffect(() => {
    if (id) {
      dispatch(fetchSeriesDetails(Number.parseInt(id)) as unknown as AnyAction);
    }
  }, [id]);

  const seasons = episodes ? groupEpisodesToSeason(episodes) : [];

  return (
    <Layout>
      <div>
        {isLoading || !series ? (
          <LoadingContainer>
            <CircularProgress size={80} color="inherit"/>
          </LoadingContainer>
        ) : (
          <>
            <Container>
              <Grid container spacing={4}>
                <Grid item xs={6} sm={4}>
                  <StyledPoster src={series.poster} alt={series.seriesname}/>
                </Grid>
                <Grid item xs={6} sm={8}>
                  <Typography variant="h4" style={{color: 'white'}}>
                    {series.seriesname}
                  </Typography>
                  <Typography variant="body1" style={{color: 'white'}}>
                    Rating: {series.rating} ({series.ratingcount})
                  </Typography>
                  <GenrePills>
                    {series.genre.map((genre, index) => (
                      <Chip
                        key={index}
                        label={genre}
                        variant="outlined"
                        color="primary"
                      />
                    ))}
                  </GenrePills>
                  <Typography
                    variant="body1"
                    style={{color: 'white', marginTop: '16px'}}
                  >
                    {series.overview}
                  </Typography>
                  <Paper elevation={3} style={{marginTop: '16px', }}>
                    <Typography variant="h5" style={{padding: '8px'}}>
                      Actors
                    </Typography>
                    <Typography variant="body1" style={{padding: '8px'}}>
                      {series.actors.join(', ')}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>
              <div>
                {seasons.map((season: Season, index: number) => (
                  <Paper key={index} elevation={3} style={{marginTop: '16px', color: 'white'}}>
                    <Typography variant="h5" style={{padding: '8px'}}>
                      Season #{season.seasonnumber + 1}
                    </Typography>
                    <TableContainer>
                      <Table style={{border: '2px solid black'}}>
                        <TableHead>
                          <TableRow>
                            <TableCell style={{border: '2px solid black'}}>Episode Number</TableCell>
                            <TableCell style={{border: '2px solid black'}}>Episode Name</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {season.episodes.map((episode: Episode, index: number) => (
                            <TableRow key={index}>
                              <TableCell style={{border: '2px solid black'}}>{`#${episode.episodenumber}`}</TableCell>
                              <TableCell
                                style={{color: 'white', border: '2px solid black'}}>{episode.episodename}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Paper>
                ))}
              </div>
            </Container>
          </>
        )}
      </div>
    </Layout>
  );
}

const groupEpisodesToSeason = (episodes: Episode[]): Season[] => {
  return episodes.reduce((seasons: Season[], episode) => {
    const seasonIndex = seasons.findIndex(
      (season: Season) => season.seasonnumber === episode.seasonnumber
    );
    if (seasonIndex === -1) {
      seasons.push({
        seasonnumber: episode.seasonnumber,
        episodes: [episode],
      } as Season);
    } else {
      seasons[seasonIndex].episodes.push(episode);
    }
    return seasons;
  }, []);
}

const LoadingContainer = styled('div')(({theme}) => ({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '300px',
  color: theme.palette.primary.main, // Customize text color
}));

const StyledPoster = styled('img')(({theme}) => ({
  width: '100%',
  borderRadius: '4px',
}));

const GenrePills = styled('div')({
  display: 'flex',
  gap: '8px',
  marginTop: '8px',
  flexWrap: 'wrap',
});

interface Season {
  seasonnumber: number;
  episodes: Episode[];
}
