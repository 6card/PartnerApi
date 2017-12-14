export interface ApiUrls {
  ROOT: string;
  AUTH_LOGIN: string;
  MEDIA_CHANNELS: string;
  MEDIA_GET_MEDIA: string;
  MEDIA_MEDIAS_PAGE_COUNT: string;
  MEDIA_MEDIAS_PAGE: string;
  MEDIA_MEDIA_ADD: string;
  MEDIA_MEDIA_UPDATE: string;
  MEDIA_MEDIA_BLOCK: string;
  MEDIA_MEDIA_UNBLOCK: string;
  MEDIA_SET_VIDEO: string;
  MEDIA_GET_TEMP_EMBED_URL: string;
  STAT_GET_MEDIA_COUNTERS: string;
  STAT_GET_MEDIA_REPORTS_URL: string;
  STAT_GET_REPORTS_URL: string;
  VIDEO_UPLOAD_START: string;
  VIDEO_UPLOAD_UPLOAD: string;
  VIDEO_UPLOAD_COMPLETE: string;

  USER_GET_AGREEMENTS: string;
  USER_GET_AGREEMENT: string;
  USER_ACCEPT_AGREEMENT: string;
}

export interface ErrorKeys {
  HTML: string;
  JSON: string;
  TSV: string;
  [key: string]: string;
}

