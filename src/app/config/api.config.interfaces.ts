export interface ApiUrls {
  ROOT: string;
  MEDIA_CHANNELS: string;
  MEDIA_GET_MEDIA: string;
  MEDIA_IMPORT_MEDIAS_PAGE_COUNT: string;
  MEDIA_IMPORT_MEDIAS_PAGE: string;
  MEDIA_MEDIA_ADD: string;
  MEDIA_MEDIA_UPDATE: string;
  MEDIA_MEDIA_BLOCK: string;
  MEDIA_MEDIA_UNBLOCK: string;
  MEDIA_SET_VIDEO: string;
  MEDIA_GET_TEMP_EMBED_URL: string;
  VIDEO_UPLOAD_START: string;
  VIDEO_UPLOAD_UPLOAD: string;
  VIDEO_UPLOAD_COMPLETE: string;
}

export interface ErrorKeys {
  HTML: string;
  JSON: string;
  TSV: string;
  [key: string]: string;
}

