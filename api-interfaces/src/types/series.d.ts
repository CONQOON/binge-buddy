import { Episode } from "./episode";

export interface Series {
  id: number;
  actors: string[];
  airsDayOfWeek: string;
  airsTime: string;
  contentrating: string;
  firstaired: string;
  genre: string[];
  imdbID: string;
  language: string;
  network: string;
  networkid: number;
  overview: string;
  rating: number;
  ratingcount: number;
  runtime: number;
  seriesid: number;
  seriesname: string;
  status: string;
  added: string;
  addedby: number;
  banner: string;
  fanart: string;
  finaleAired: string;
  lastupdated: number;
  poster: string;
  tmsWantedOld: number;
  zap2itId: number;
};

export enum SeriesFilterTypes {
  genre = 'genre',
  rating = 'rating',
  unstructuredText = 'unstructuredText',
}

export interface SeriesFilter {
  filterType: SeriesFilterTypes;
  value: string;
}

export interface SeriesDetailsPayload {
  series: Series;
  episodes: Episode[];
}

export type GenrePayload = string[];



