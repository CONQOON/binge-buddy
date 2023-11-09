import { BingeListPayload } from "@bb/api-interfaces";

export async function fetchBingeList(userId: string): Promise<BingeListPayload> {
  try {
    // Check if the binge list exists in local storage
    const storedBingeList = localStorage.getItem(`bingeList_${userId}`);
    if (storedBingeList) {
      return JSON.parse(storedBingeList);
    }
    // If it doesn't exist, return an empty binge list
    return [];
  } catch (error) {
    console.error('Error fetching binge list:', error);
    throw error;
  }
}

export async function updateBingeList(userId: string, payload: BingeListPayload): Promise<BingeListPayload> {
  try {
    // Update the binge list in local storage
    localStorage.setItem(`bingeList_${userId}`, JSON.stringify(payload));
    return payload;
  } catch (error) {
    console.error('Error updating binge list:', error);
    throw error;
  }
}
