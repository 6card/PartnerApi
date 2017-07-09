import { Pipe, PipeTransform } from '@angular/core';

import { Torrent } from '../shared/torrent';

@Pipe({ name: 'filterTorrent' })
export class FilterTorrentsPipe implements PipeTransform {
  transform(torrents: Torrent[], status: number = null) {
      if (status === null)
        return torrents;    
    return torrents.filter(item => item.status == status);
  }
}