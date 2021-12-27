import { TestBed } from '@angular/core/testing';

import { YoutubePlayerService } from './youtube-player.service';

describe('YoutubePlayerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YoutubePlayerService = TestBed.get(YoutubePlayerService);
    expect(service).toBeTruthy();
  });
});
