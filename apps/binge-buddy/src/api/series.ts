import { Series, SeriesDetailsPayload, SeriesFilter } from "@bb/api-interfaces";
import { RequestManager, RequestOptions } from "../utils/http";

export async function fetchSeriesData(filters: SeriesFilter[] = [], limit = 50, page = 1): Promise<Series[]> {
  try {
    // Initialize the RequestManager instance
    const requestManager = RequestManager.getInstance();

    const apiPath = '/series';

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

    return await requestManager.makeRequest<Series[]>(apiPath, options);

  } catch (error) {
    console.error('Error fetching series:', error);
    throw error;
  }
}

export async function fetchSeriesById(seriesId: string): Promise<SeriesDetailsPayload> {
  try {
    // Initialize the RequestManager instance
    const requestManager = RequestManager.getInstance();

    const apiPath = `/series/${seriesId}`;

    const options: RequestOptions = {
      method: 'GET',
    };

    return await requestManager.makeRequest<SeriesDetailsPayload>(apiPath, options);

  } catch (error) {
    console.error('Error fetching series:', error);
    throw error;
  }
}

export async function fetchGenres(): Promise<string[]> {
  try {
    // Initialize the RequestManager instance
    const requestManager = RequestManager.getInstance();

    const apiPath = '/genres';

    const options: RequestOptions = {
      method: 'GET',
    };

    return await requestManager.makeRequest<string[]>(apiPath, options);

  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
}
