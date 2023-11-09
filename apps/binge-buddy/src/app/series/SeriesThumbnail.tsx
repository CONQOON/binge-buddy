import { Series } from "@bb/api-interfaces";
import { Grid, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import { BingeListItemButton } from "../bingeList/BingeListItemButton";
import { BingeListItemWatchedButton } from "../bingeList/BingeListItemWatchedButton";

interface SeriesThumbnailProps {
  series: Series;
}

export const SeriesThumbnail = ({series}: SeriesThumbnailProps) => {
  return (
    <ThumbnailContainer item xs={6} sm={4} md={3} key={series.id}>
      <StyledLink to={`/series/${series.id}`}>
        <ImageContainer>
          <Image src={series.poster} alt={series.seriesname}/>
          <div className="overlay">
            <Description variant="subtitle1">{series.overview}</Description>
          </div>
        </ImageContainer>
        <BottomContainer>
          <TextContainer>
            <Typography variant="h6">{series.seriesname}</Typography>
            <Rating variant="subtitle1">
              Rating:&nbsp;{series.rating}
            </Rating>
          </TextContainer>
          <ButtonContainer>
            <BingeListItemWatchedButton seriesId={series.id} seriesTitle={series.seriesname}/>
            <BingeListItemButton seriesId={series.id} seriesTitle={series.seriesname}/>
          </ButtonContainer>
        </BottomContainer>
      </StyledLink>
    </ThumbnailContainer>
  );
};

const ThumbnailContainer = styled(Grid)`
  position: relative;
  overflow: hidden;
  cursor: pointer;
  color: white;

  &:hover {
    .overlay {
      opacity: 1;
    }
  }

  .overlay {
    position: absolute;
    overflow: hidden;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.7);
    opacity: 0;
    transition: opacity 0.3s;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
  }
`;

const Description = styled(Typography)`
  font-size: 14px;
  margin-top: 10px;
`;

const Rating = styled(Typography)`
  display: flex;
  align-items: center;
  font-size: 14px;

  .material-icons {
    font-size: 16px;
    margin-right: 4px;
  }
`;

const ImageContainer = styled("div")`
  position: relative;
  aspect-ratio: 5 / 7;
`;

const Image = styled("img")`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const StyledLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`;

const BottomContainer = styled("div")`
  display: flex;
  flex-direction: row;
  `;

const TextContainer = styled("div")`
  flex-grow: 1;
`;

const ButtonContainer = styled("div")`
  display: flex;
  flex-direction: column;
`;

