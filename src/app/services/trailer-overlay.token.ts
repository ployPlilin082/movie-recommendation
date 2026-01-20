import { InjectionToken } from '@angular/core';

export const TRAILER_DATA = new InjectionToken<{
  youtubeKey: string;
  close: () => void;
}>('TRAILER_DATA');
