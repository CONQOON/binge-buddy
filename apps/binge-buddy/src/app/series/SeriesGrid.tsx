import { Grid, Typography } from "@mui/material";
import { SeriesThumbnail } from "./SeriesThumbnail";
import { Series } from "@bb/api-interfaces";

export interface SeriesGridProps {
  seriesData: Series[] | undefined;
}

export const SeriesGrid = ({ seriesData }: SeriesGridProps) => {
  if (!seriesData || seriesData.length === 0) {
    return (
      <Typography
        variant="h4"
        color="error"
        align="center"
        sx={{ mt: 4, mb: 4 }}
        style={{ position: 'relative', top: 64 }}
      >
        No matching tv shows found
      </Typography>
    );
  }

  return (
    <Grid container spacing={4}>
      {seriesData.map((series) => (
        <SeriesThumbnail series={series} key={series.id} />
      ))}
    </Grid>
  );
};
