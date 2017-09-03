import { ApiUrls } from './api.config.interfaces';

export const API_URLS: ApiUrls = {
  ROOT: 'https://api.newstube.ru/v2',
  AUTH_LOGIN: '/Auth/Login',
  MEDIA_CHANNELS: '/Media/Channels',
  MEDIA_GET_MEDIA: '/Media/GetMedia',
  MEDIA_MEDIAS_PAGE_COUNT: '/Media/MediasPageCount',
  MEDIA_MEDIAS_PAGE: '/Media/MediasPage',
  MEDIA_MEDIA_ADD:'/Media/MediaAdd',
  MEDIA_MEDIA_UPDATE: '/Media/MediaUpdate',
  MEDIA_MEDIA_BLOCK: '/Media/MediaBlock',
  MEDIA_MEDIA_UNBLOCK: '/Media/MediaUnblock',
  MEDIA_SET_VIDEO: '/Media/SetVideo',
  MEDIA_GET_TEMP_EMBED_URL: '/Media/GetTempEmbedUrl',
  STAT_GET_MEDIA_COUNTERS: '/Stat/MediaCounters',
  STAT_GET_MEDIA_REPORTS_URL: '/Stat/GetMediaReportsUrl',
  STAT_GET_REPORTS_URL: '/Stat/GetReportsUrl',
  VIDEO_UPLOAD_START: '/VideoUpload/Start',
  VIDEO_UPLOAD_UPLOAD:'/VideoUpload/UploadData',
  VIDEO_UPLOAD_COMPLETE: '/VideoUpload/Complete'
};