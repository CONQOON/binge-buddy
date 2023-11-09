import { Episode, Series, SeriesDetailsPayload, SeriesFilter, SeriesFilterTypes } from "@bb/api-interfaces";
import { RequestOptions } from "../utils/http";
import baseData from "../assets/data.json";

export async function fetchSeriesData(filters: SeriesFilter[] = [], limit = 50, page = 1): Promise<Series[]> {
  try {
    const options: RequestOptions = {
      method: 'GET',
      params: {
        ...filters.reduce((query, filter) => {
          return {...query, [filter.filterType]: filter.value};
        }, {}),
        "limit": limit.toString(),
        "page": page.toString(),
      }
    };


    return applySeriesFilters(baseData.series as Series[], options);

  } catch (error) {
    console.error('Error fetching series:', error);
    throw error;
  }
}

function applySeriesFilters(data: Series[], options?: RequestOptions): Series[] {
  if (!options || !options.params) {
    return data;
  }

  let filteredData = data;

  if (options.params) {
    // Filter based on attributes in options.params
    for (const attribute in options.params) {
      // eslint-disable-next-line no-prototype-builtins
      if (options.params.hasOwnProperty(attribute)) {
        const filterType = attribute;
        const filterValue = options.params[attribute];

        filteredData = filteredData.filter((item) => {
          switch (filterType) {
            case SeriesFilterTypes.genre:
              return item.genre.includes(filterValue);

            case SeriesFilterTypes.rating:
              return item.rating >= Number.parseFloat(filterValue);

            case SeriesFilterTypes.unstructuredText:
              if (filterValue) {
                let filterResult = true;
                const words = filterValue.split(/\s+/);

                // Check if any word matches seriesname or any actor
                for (const word of words) {
                  if (
                    !item.seriesname.toLowerCase().includes(word.toLowerCase()) &&
                    !item.actors.some((actor) =>
                      actor.toLowerCase().includes(word.toLowerCase())
                    )
                  ) {
                    filterResult = false;
                  }
                }
                return filterResult;
              }
              return false;
          }
          return true;
        });
      }
    }
  }

  filteredData.sort((a, b) => {
    return b.firstaired.localeCompare(a.firstaired);
  });


  const {limit: limitParam = '50', page: pageParam = '1'} = options.params;
  const page = Number.parseInt(pageParam);
  const limit = Number.parseInt(limitParam);
  const startIndex: number = (page - 1) * limit;
  const endIndex = startIndex + limit;

// Use slice to get a portion of the data based on the calculated indices
  return filteredData.slice(startIndex, endIndex);
}

export async function fetchSeriesById(seriesId: number): Promise<SeriesDetailsPayload> {
  try {
    const series: Series | undefined = (baseData.series as Series[]).find((item: Series) => item.id === seriesId);

    if (!series) {
      throw new Error(`Series with id ${seriesId} not found`);
    }

    const episodes: Episode[] = baseData.episodes.filter((episode) => episode.seriesid === seriesId);

    const seriesDetails: SeriesDetailsPayload = {
      series: series,
      episodes: episodes,
    };

    return seriesDetails;
  } catch (error) {
    console.error('Error fetching series details:', error);
    throw error;
  }
}

export async function fetchGenres(): Promise<string[]> {
  try {
    const genres = baseData.series.reduce((acc, series) => {
      if (Array.isArray(series)) {
        return [...acc, ...series[0].genre];
      }
      return [...acc, ...series.genre];
    }, [] as string[]);

    const uniqueGenres = Array.from(new Set(genres));
    return uniqueGenres.sort();
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
}
