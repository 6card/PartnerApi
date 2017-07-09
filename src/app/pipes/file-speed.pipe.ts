import { Pipe, PipeTransform } from '@angular/core';

/*
 * Convert bytes into largest possible unit.
 * Takes an precision argument that defaults to 2.
 * Usage:
 *   bytes | fileSize:precision
 * Example:
 *   {{ 1024 |  fileSize}}
 *   formats to: 1 KB
*/
@Pipe({name: 'fileSpeed'})
export class FileSpeedPipe implements PipeTransform {

  private units = [
    'B/s',
    'KB/s',
    'MB/s',
    'GB/s',
    'TB/s',
    'PB/s'
  ];

  transform(bytes: number = 0, precision: number = 2 ) : any {
    if ( isNaN( parseFloat( String(bytes) )) || ! isFinite( bytes ) ) return null;

    let unit = 0;

    while ( bytes >= 1000 ) {
      bytes /= 1000;
      unit ++;
    }

    return bytes.toFixed( + precision ) + ' ' + this.units[ unit ];
  }
}