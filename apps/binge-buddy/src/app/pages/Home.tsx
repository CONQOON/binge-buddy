import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { SeriesGrid } from "../series";
import { fetchSeries } from "../series/seriesGridSlice";
import { InputAdornment, TextField, Grid, FormControl, IconButton, InputLabel, MenuItem, Select } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Container, styled } from "@mui/system";
import { Layout } from "../layout";
import { fetchGenres } from "../series/globalSeriesSlice";
import { AppDispatch, RootState } from "../../store";
import { fetchBingeList } from "../bingeList/bingeListSlice";

export function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedGenre, setSelectedGenre] = useState<string>();
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>("");
  const seriesData = useSelector((state: RootState) => state.seriesGrid.data);
  const genres = useSelector((state: RootState) => state.globalSeries.genres);


  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchSeries({searchTerm: debouncedSearchTerm, genre: selectedGenre}));
    dispatch(fetchGenres());
  }, [dispatch, debouncedSearchTerm, selectedGenre]);

  useEffect(() => {
    dispatch(fetchBingeList());
  }, [dispatch]);

  const executeSearch = () => {
    dispatch(fetchSeries({searchTerm: debouncedSearchTerm, genre: selectedGenre}));
  };

  return (
    <Layout>
      <StyledSearchBar>
        <Container maxWidth={'lg'}>
          <Grid container spacing={4}>
            <Grid item xs={12} sm={8} md={9}>
              <TextField
                fullWidth
                placeholder="Search for show or actor ..."
                variant="outlined"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  style: {
                    color: "white",       // Set font color to white
                    backgroundColor: "#333", // Set background color to dark gray
                  },
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        color="primary"
                        onClick={executeSearch}
                        edge="end"
                      >
                        <SearchIcon/>
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} sm={4} md={3}>
              <FormControl variant="outlined" fullWidth>
                <InputLabel id="genre-label" style={{color: '#767676'}}>Select a genre</InputLabel>
                <Select
                  labelId="genre-label"
                  id="genre"
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value as string)}
                  label="Select a genre"
                  style={{backgroundColor: '#333'}}
                >
                  <MenuItem value={undefined}>
                    All genres ...
                  </MenuItem>
                  {genres.map((genre: string) => (
                    <MenuItem key={`genre-${genre}`} value={genre}>
                      {genre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Container>
      </StyledSearchBar>
      <StyledGridContainer item xs={12}>
        <SeriesGrid seriesData={seriesData}/>
      </StyledGridContainer>
    </Layout>
  );
}

const StyledSearchBar = styled('div')`
  position: fixed;
  background-color: ${(props) => props.theme.palette.background.default};
  top: 64px;
  left: 0;
  right: 0;
  padding: 8px 0;
  z-index: 1200;
`;

const StyledGridContainer = styled(Grid)`
  margin-top: 64px;
`;
