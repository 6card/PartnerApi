export class Channel {
  Description: string; //, optional): Описание канала ,
  IconUrl: string; //, optional): Иконка канала ,
  LogoUrl: string; //, optional): Баннер канала ,
  Id: number; //, optional): Идентификатор ,
  Guid: string; //, optional): Guid ,
  Title: string; //, optional): Название ,
  Url: string; //, optional): Страница объекта
  
  constructor(obj: Object) {
    this.Description = obj['Description'];
    this.IconUrl = obj['IconUrl'];
    this.LogoUrl = obj['LogoUrl'];
    this.Id = obj['Id'];
    this.Guid = obj['Guid'];
    this.Title = obj['Title'];
    this.Url = obj['Url'];
  }
}

export class Media {
  UpdateTime: Date; //, optional),
  MediaId: number; //, optional): Внутренний идентификатор ролика. При обновление MediaId или ExternalId должны быть выставлены ,
  ExternalId: string; //, optional): Идентификатор ролика на стороне импортера. При обновление MediaId или ExternalId должны быть выставлены. stringMax. Length:256,
  MediaGuid: string; //, optional): readonly. Guid ролика ,
  CanonicalUrl: string; //, optional): readonly. Cтраница ролика ,
  IgnoreCheckUnique: boolean; //, optional): При добавление роликов игнорировать уникальность видео файла, т.е. то что он уже принадлежит другому ролику ,
  AfterVideoUploadUnblockMedia: boolean; //, optional): После загрузки видео, разблокировать ролик. ,
  Title: string; //): Название ролика stringMax. Length:256,
  Description: string; //, optional): Описание ролика stringMax. Length:4000,
  ShootDate: Date; //): Время съемки сюжета или время публикации в MSK, ShootDate или ShootDateUtc должны быть выставлены ,
  ShootDateUtc: Date; //): Время съемки сюжета или время публикации в UTC, ShootDate или ShootDateUtc должны быть выставлены ,
  PubDate: Date; //, optional): readonly. Время публикации на newstube ,
  Link: string; //, optional): Ссылка на ресурс импортера stringMax. Length:256,
  Series: string; //, optional): Название передачи на канале stringMax. Length:200,
  Keywords: Array<string>; //, optional): Список ключевых слов ,
  ChannelId: number; //): Идентификатор канала в который нужно поместить ролик. Задается при добавление ролика. В дальнейшем не меняется. ,
  VideoUrl: string; //, optional): Url с видео для загрузки stringMax. Length:256,
  VideoUrls: Array<string>; //, optional): Список url с видео для загрузки ,
  ThumbnailUrl: string; //, optional): readonly. Url превью картинки ролика ,
  NextVideo: Video; //, optional): readonly. Видео которое станет активным после загрузки ,
  Video: Video; //, optional): readonly. Текущее видео ,
  Videos: Array<Video>; //, optional): readonly. Список видео ролика ,
  Downloads: Array<Download>; //, optional): readonly. Файлы отправленные на загрузку ,
  Actions: number; //, optional):readonly. Флаги дотсупных действий для ролика ,
  CreateTime: Date; //, optional): readonly. Время создания ролика UTC ,
  State: number; //, optional): readonly. Состояние ролика UTC = ['0', '1', '5', '7', '8', '10', '16', '20']integerEnum:0, 1, 5, 7, 8, 10, 16, 20,
  User: User; //, optional): Пользователь добавивший ролик ,
  SourceGuid: string; //, optional): Источник из которого получена информация по ролику, значение выбирается импортером ,
  Data: string; //, optional): Дополнительные данные по ролику stringMax. Length:4000

  EmbedUrl: string;
  Statistics: Statistics;

  constructor(obj: Object) {
    this.UpdateTime = new Date(obj['UpdateTime']);
    this.MediaId = obj['MediaId'];
    this.ExternalId = obj['ExternalId'];
    this.MediaGuid = obj['MediaGuid'];
    this.CanonicalUrl = obj['CanonicalUrl'];
    this.IgnoreCheckUnique = obj['IgnoreCheckUnique'];
    this.AfterVideoUploadUnblockMedia = obj['AfterVideoUploadUnblockMedia'];
    this.Title = obj['Title'];
    this.Description = obj['Description'];
    this.ShootDate = new Date(obj['ShootDate']);
    this.ShootDateUtc = new Date(obj['ShootDateUtc']);
    this.PubDate = new Date(obj['PubDate']);
    this.Link = obj['Link'];
    this.Series = obj['Series'];
    this.Keywords = obj['Keywords'];
    this.ChannelId = obj['ChannelId'];
    this.VideoUrl = obj['VideoUrl'];
    this.VideoUrls = obj['VideoUrls'];
    this.ThumbnailUrl = obj['ThumbnailUrl'];
    this.NextVideo = obj['NextVideo'];
    this.Video = obj['Video'] ? new Video(obj['Video']) : undefined;
    this.Videos = obj['Videos'] ? obj['Videos'].map((item: any) => new Video(item)) : undefined;
    this.Downloads = obj['Downloads'] ? obj['Downloads'].map((item: any) => new Download(item)) : undefined;
    this.Actions = obj['Actions'];
    this.CreateTime = new Date(obj['CreateTime']);
    this.State = obj['State'];
    this.User = obj['User'];
    this.SourceGuid = obj['SourceGuid'];
    this.Data = obj['Data'];

    this.EmbedUrl = '//www.newstube.ru/embed/'+ obj['MediaGuid'];
    this.Statistics = obj['Statistics'] ? new Statistics(obj['Statistics']) : undefined;
  }

  get CreateTimeGMT() {
    if (this.CreateTime)
      return this.CreateTime.getTime() - (this.CreateTime.getTimezoneOffset() * 60000);
    return false;
  }

  get UpdateTimeGMT() {
    if (this.UpdateTime)
      return this.UpdateTime.getTime() - (this.UpdateTime.getTimezoneOffset() * 60000);
    return false;
  }

  get PubDateGMT() {
    if (this.PubDate)
      return this.PubDate.getTime() - (this.PubDate.getTimezoneOffset() * 60000);
    return false;
  }

  static getStates(): any {
    return {
        0: "зарегистрирован",
        1: "загружен",
        5: "модерируется",
        7: "опубликован",
        8: "ошибка транскодирования",
        10: "транскодируется",
        16: "заблокировано редакцией",
        20: "дубль",
        21: "заблокировано правообладателем"
    };
  }

  get StateName(): string {  
    let statuses = Media.getStates();
    return statuses[this.State];
  }

  get StateColor(): string {  
    let colors = {
        5: "blue",
        7: "green",
        16: "red",
        20: "yellow"
    };
    return colors[this.State];
  }

  get isPossibleToUnblock(): boolean {
    let mask = 1; // 0 возможно действие разблокировать ролик
    return this.checkMask(this.Actions, mask);
  }

  get isPossibleToBlock(): boolean {
    let mask = 2; // 1 возможно действие заблокировать ролик
    return this.checkMask(this.Actions, mask);
  }

  get isPossibleToView(): boolean {
    let mask = 4; // 2 возможен просмотр видео
    return this.checkMask(this.Actions, mask);
  }

  get isAvailableOnSite(): boolean {
    let mask = 8; // 3 ролик доступен на сайте
    return this.checkMask(this.Actions, mask);
  }

  get isAvailableMediaStat(): boolean {
    let mask = 16; // отобразить кнопку «Отчеты по ролику»
    return this.checkMask(this.Actions, mask);
  }

  checkMask(value: number, mask: number): boolean {
    if (value & mask)
      return true;
    else
      return false;
  }


}

export class Video {
  Id: number; //, optional): Идентификатор файла ,
  Width: number; //, optional): Ширина видео ,
  Height: number; //, optional): Высота видео ,
  Duration: number; //, optional): Длительность, ms ,
  Url: string; //, optional): Адрес с которого загрузилось видео ,
  State: number; //, optional): Состояние файла. 0 зарегистрирован 2 загружен 3 транскодируется 4 готов 6 готов, исходный файл удален 35 ошибка кодирования ,
  CreateTime: Date; //, optional): Время загрузки видео ,
  UpdateTime: Date; //, optional): Последнее изменение с файлом ,
  Downloads: Array<Download>; //, optional): История запросов на загрузку видео
  
  constructor(obj: Object) {
    this.Id = obj['Id'];
    this.Width = obj['Width'];
    this.Height = obj['Height'];
    this.Duration = obj['Duration'];
    this.Url = obj['Url'];
    this.State = obj['State'];
    this.CreateTime = new Date(obj['CreateTime']);
    this.UpdateTime = new Date(obj['UpdateTime']);
    this.Downloads = obj['Downloads'] ? obj['Downloads'].map((item: any) => new Download(item)) : undefined;
  }

  get CreateTimeGMT() {
    return this.CreateTime.getTime() - (this.CreateTime.getTimezoneOffset() * 60000);
  }

  get UpdateTimeGMT() {
    return this.UpdateTime.getTime() - (this.UpdateTime.getTimezoneOffset() * 60000);
  }

  get StateName(): string {  
    let statuses = {
        0: "зарегистрирован",
        2: "загружен",
        3: "транскодируется",
        6: "готов",
        4: "готов, исходный файл удален",
        34: "файл не удалось транскодировать",
        32: "файл не удалось транскодировать, исходный файл удален",
    };
    return statuses[this.State];
  }

}

export class User {
  Id: number; //, optional),
  Guid: string; //, optional),
  Name: string; //, optional),
  UserName: string; //, optional): Имя для авторизации
}

export class Download  {
  Id: number; //, optional): Идентификатор загрузки ,
  Url: string; //, optional): Url загрузки видео ,
  CreateTime: string; //, optional): Время создания загрузки UTC ,
  Video: Video; //, optional): Видео файл загрузки ,
  UpdateTime: string; //, optional): Последнее обновление состояния загрузки ,
  State: number; //, optional): Состояние видео 0 зарегистрирован 1 загружается 2 загружен 8 пропущен 16 пропущен так как дубль 32 ошибка загрузки

  constructor(obj: Object) {
    this.Id = obj['Id'];
    this.Url = obj['Url'];
    this.CreateTime = obj['CreateTime'];
    this.Video = obj['Video'] ? new Video(obj['Video']) : undefined;
    this.UpdateTime = obj['UpdateTime'];
    this.State = obj['State'];
  }
}

export class Counter  {
  CreateDate: string; //, optional): Дата ,
  Location: string; //, optional): Кодовое слово площадки просмотра ,
  Counter: number; //, optional): Кол-во просмотров ролика 

  constructor(obj: Object) {
    this.CreateDate = obj['CreateDate'];
    this.Location = obj['Location'];
    this.Counter = obj['Counter'];
  }
}

export class Statistics {
  ViewCount: number; //Просмотры ролика
  constructor(obj: Object) {
    this.ViewCount = obj['ViewCount'];
  }
}