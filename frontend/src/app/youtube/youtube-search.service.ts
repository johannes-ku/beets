import { Injectable } from '@angular/core';
import { YOUTUBE_API_KEY } from '../config';
import { YoutubeTrack } from './youtube-track';
import { duration } from 'moment';

@Injectable({
  providedIn: 'root'
})
export class YoutubeSearchService {

  constructor() { }

  async search(searchPhrase: string): Promise<YoutubeTrack[]> {
    const parsedVideoCode = this.parseVideoCode(searchPhrase);
    let codes: string[];
    if (parsedVideoCode != null) {
      codes = [parsedVideoCode];
    } else {
      const searchResponseBody = await this.performSearchQuery(searchPhrase);
      codes = searchResponseBody.items.map(item => item.id.videoId);
    }
    const videoInfoResponseBody = await this.performVideosQuery(codes);
    const items = videoInfoResponseBody.items;
    return items.map(item => ({
      name: item.snippet.title,
      length: duration(item.contentDetails.duration).asSeconds(),
      code: item.id
    }));
  }

  // noinspection JSMethodCanBeStatic
  private parseVideoCode(searchPhrase: string): string | undefined {
    try {
      const url = new URL(searchPhrase);
      if (!url.host.endsWith('youtube.com')) {
        return undefined;
      }
      return url.searchParams.get('v');
    } catch (e) {
      return undefined;
    }
  }

  // noinspection JSMethodCanBeStatic
  private async performVideosQuery(codes: string[]) {
    const videoInfoUrl = new URL('https://www.googleapis.com/youtube/v3/videos');
    videoInfoUrl.searchParams.append('key', YOUTUBE_API_KEY);
    videoInfoUrl.searchParams.append('id', codes.join(','));
    videoInfoUrl.searchParams.append('part', ['id', 'snippet', 'contentDetails'].join(','));
    const videoInfoResponse = await fetch(videoInfoUrl.toString());
    return await videoInfoResponse.json();
  }

  // noinspection JSMethodCanBeStatic
  private async performSearchQuery(searchPhrase: string) {
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search');
    searchUrl.searchParams.append('key', YOUTUBE_API_KEY);
    searchUrl.searchParams.append('type', 'video');
    searchUrl.searchParams.append('q', searchPhrase);
    searchUrl.searchParams.append('maxResults', '5');
    searchUrl.searchParams.append('part', 'id');
    const searchResponse = await fetch(searchUrl.toString());
    return await searchResponse.json();
  }
}
