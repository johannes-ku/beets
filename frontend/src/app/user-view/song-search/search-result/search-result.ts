import { TrackSource } from 'beets-shared';

export interface SearchResult {
  name: string;
  length: number;
  source: TrackSource;
  code: string;
}
