export class Torrent {
  public 'activityDate': number;
  public 'addedDate': number;
  public 'bandwidthPriority': number;
  public 'comment': string;
  public 'corruptEver': number;
  public 'creator': string;
  public 'dateCreated': number;
  public 'desiredAvailable': number;
  public 'doneDate': number;
  public 'downloadDir': string;
  public 'downloadedEver': number;
  public 'downloadLimit': number;
  public 'downloadLimited': boolean ;
  public 'error': number;
  public 'errorString': string;
  public 'eta': number;
  public 'etaIdle': number;
  //public 'files': array (see below) ;
  //public 'fileStats': array (see below) ;
  public 'hashString': string;
  public 'haveUnchecked': number;
  public 'haveValid': number;
  public 'honorsSessionLimits': boolean ;
  public 'id': number;
  public 'isFinished': boolean ;
  public 'isPrivate': boolean ;
  public 'isStalled': boolean ;
  public 'leftUntilDone': number;
  public 'magnetLink': string;
  public 'manualAnnounceTime': number;
  public 'maxConnectedPeers': number;
  //public 'metadataPercentComplete': double;
  public 'name': string;
  public 'peer-limit': number;
  //public 'peers': array (see below) ;
  public 'peersConnected': number;
  //public 'peersFrom': object (see below);
  public 'peersGettingFromUs': number;
  public 'peersSendingToUs': number;
  public 'percentDone': number;
  //public 'pieces': string (see below);
  public 'pieceCount': number;
  public 'pieceSize': number;
  //public 'priorities': array (see below) ;
  public 'queuePosition': number;
  public 'rateDownload': number;
  public 'rateUpload': number;
  //public 'recheckProgress': double;
  public 'secondsDownloading': number;
  public 'secondsSeeding': number;
  public 'seedIdleLimit': number;
  public 'seedIdleMode': number;
  //public 'seedRatioLimit': double;
  public 'seedRatioMode': number;
  public 'sizeWhenDone': number;
  public 'startDate': number;
  public 'status': number;
  //public 'trackers': array (see below) ;
  //public 'trackerStats': array (see below) ;
  public 'totalSize': number;
  public 'torrentFile': string;
  public 'uploadedEver': number;
  public 'uploadLimit': number;
  public 'uploadLimited': boolean ;
  //public 'uploadRatio': double;
  //public 'wanted': array (see below) ;
  //public 'webseeds': array (see below) ;
  public 'webseedsSendingToUs': number;
  public percent: number;

  public static STATUS_STOPPED = 0;
  public static STATUS_CHECK_WAIT = 1;
  public static STATUS_CHECK = 2;
  public static STATUS_DOWNLOAD_WAIT = 3;
  public static STATUS_DOWNLOAD = 4;
  public static STATUS_SEED_WAIT = 5;
  public static STATUS_SEED = 6;

  constructor(data: any) {
    this.update(data);
  }

  update(data: any) {
    this['activityDate'] = data['activityDate'];
    this['addedDate'] = data['addedDate'] * 1000;
    this['bandwidthPriority'] = data['bandwidthPriority'];
    this['comment'] = data['comment'];
    this['corruptEver'] = data['corruptEver'];
    this['creator'] = data['creator'];
    this['dateCreated'] = data['dateCreated'];
    this['desiredAvailable'] = data['desiredAvailable'];
    this['doneDate'] = data['doneDate'];
    this['downloadDir'] = data['downloadDir'];
    this['downloadedEver'] = data['downloadedEver'];
    this['downloadLimit'] = data['downloadLimit'];
    this['downloadLimited'] = data['downloadLimited'];
    this['error'] = data['error'];
    this['errorString'] = data['errorString'];
    this['eta'] = data['eta'];
    this['etaIdle'] = data['etaIdle'];
      //public 'files': array (see below) ;
      //public 'fileStats': array (see below) ;
    this['hashString'] = data['hashString'];
    this['haveUnchecked'] = data['haveUnchecked'];
    this['haveValid'] = data['haveValid'];
    this['honorsSessionLimits'] = data['honorsSessionLimits'];
    this['id'] = data['id'];
    this['isFinished'] = data['isFinished'];
    this['isPrivate'] = data['isPrivate'];
    this['isStalled'] = data['isStalled'];
    this['leftUntilDone'] = data['leftUntilDone'];
    this['magnetLink'] = data['magnetLink'];
    this['manualAnnounceTime'] = data['manualAnnounceTime'];
    this['maxConnectedPeers'] = data['maxConnectedPeers'];
      //public 'metadataPercentComplete': double;
    this['name'] = data['name'];
    this['peer-limit'] = data['peer-limit'];
      //public 'peers': array (see below) ;
    this['peersConnected'] = data['peersConnected'];
      //public 'peersFrom': object (see below);
    this['peersGettingFromUs'] = data['peersGettingFromUs'];
    this['peersSendingToUs'] = data['peersSendingToUs'];
    this['percentDone'] = data['percentDone'] * 100;
      //public 'pieces': string (see below);
    this['pieceCount'] = data['pieceCount'];
    this['pieceSize'] = data['pieceSize'];
      //public 'priorities': array (see below) ;
    this['queuePosition'] = data['queuePosition'];
    this ['rateDownload'] = data['rateDownload'];
    this ['rateUpload'] = data['rateUpload'];
      //public 'recheckProgress': double;
    this['secondsDownloading'] = data['secondsDownloading'];
    this['secondsSeeding'] = data['secondsSeeding'];
    this['seedIdleLimit'] = data['seedIdleLimit'];
    this['seedIdleMode'] = data['seedIdleMode'];
      //public 'seedRatioLimit': double;
    this['seedRatioMode'] = data['seedRatioMode'];
    this['sizeWhenDone'] = data['sizeWhenDone'];
    this['startDate'] = data['startDate'];
    this['status'] = data['status'];
      //public 'trackers': array (see below) ;
      //public 'trackerStats': array (see below) ;
    this['totalSize'] = data['totalSize'];
    this['torrentFile'] = data['torrentFile'];
    this['uploadedEver'] = data['uploadedEver'];
    this['uploadLimit'] = data['uploadLimit'];
    this['uploadLimited'] = data['uploadLimited'];
      //public 'uploadRatio': double;
      //public 'wanted': array (see below) ;
      //public 'webseeds': array (see below) ;
    this['webseedsSendingToUs'] = data['webseedsSendingToUs'];
  }



  getStatusColor(){    
    switch(this.status) {
			case Torrent.STATUS_STOPPED:          return ['grey'];//this.isFinished ? '#ff00ff' : '#ff0000';
			case Torrent.STATUS_CHECK_WAIT:       return ['yellow'];
			case Torrent.STATUS_CHECK:            return ['orange'];
			case Torrent.STATUS_DOWNLOAD_WAIT:    return ['teal'];
			case Torrent.STATUS_DOWNLOAD:         return ['blue'];
			case Torrent.STATUS_SEED_WAIT:        return ['olive'];
			case Torrent.STATUS_SEED:             return ['green'];
			default:                              return ['red'];
		}
  }

    getStatus(){    
      switch(this.status) {
        case Torrent.STATUS_STOPPED:          return 'Stopped';
        case Torrent.STATUS_CHECK_WAIT:       return 'Queued for verification';
        case Torrent.STATUS_CHECK:            return 'Verifying local data';
        case Torrent.STATUS_DOWNLOAD_WAIT:    return 'Queued for download';
        case Torrent.STATUS_DOWNLOAD:         return 'Downloading';
        case Torrent.STATUS_SEED_WAIT:        return 'Queued for seeding';
        case Torrent.STATUS_SEED:             return 'Seeding';
        case null:                            return 'Unknown';
        case undefined:                       return 'Unknown';
        default:                              return 'Error';
      }
    }
    getSpeed(){    
      switch(this.status) {
        case Torrent.STATUS_DOWNLOAD:         return this.rateDownload;
        case Torrent.STATUS_SEED:             return this.rateUpload;
        default:                              return false;
      }
    }
}