import { BingeListPayload } from '@bb/api-interfaces';
import { RequestManager, RequestOptions } from "../utils/http";

export async function fetchBingeList(userId: string): Promise<BingeListPayload> {
  try {
    // Initialize the RequestManager instance
    const requestManager = RequestManager.getInstance();

    const apiPath = `/binge-list/${userId}`;

    const options: RequestOptions = {
      method: 'GET',
      params: {
      }
    };

    return await requestManager.makeRequest<BingeListPayload>(apiPath, options);

  } catch (error) {
    console.error('Error fetching series:', error);
    throw error;
  }
}

export async function updateBingeList(userId: string, payload: BingeListPayload): Promise<BingeListPayload> {
  try {
    // Initialize the RequestManager instance
    const requestManager = RequestManager.getInstance();

    const apiPath = `/binge-list/${userId}`;

    const options: RequestOptions = {
      method: 'PUT',
      body: JSON.stringify(payload)
    };

    return await requestManager.makeRequest<BingeListPayload>(apiPath, options);

  } catch (error) {
    console.error('Error fetching series:', error);
    throw error;
  }
}
