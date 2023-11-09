export type BingeListPayload = BingeListItem[];

export interface BingeListItem {
  seriesId: number;
  seriesTitle: string;
  updatedAt?: number;
  onWatchList: boolean;
  watched: boolean;
}
