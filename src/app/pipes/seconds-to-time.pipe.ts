import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
       name: 'secondsToTime'
})
export class SecondsToTimePipe implements PipeTransform{
    private times = {
        year: 1000 * 31557600,
        month: 1000 * 2629746,
        day: 1000 * 86400,
        hour: 1000 * 3600,
        minute: 1000 * 60,
        second: 1000 * 1
    }

    transform(seconds: number){
        let time_string: string = '';
        let plural: string = '';
        for(var key in this.times){
            if(Math.floor(seconds / this.times[key]) > 0){
                if(Math.floor(seconds / this.times[key]) >1 ){
                    plural = 's';
                }
                else{
                    plural = '';
                }

                time_string += Math.floor(seconds / this.times[key]).toString() + ' ' + key.toString() + plural + ' ';
                seconds = seconds - this.times[key] * Math.floor(seconds / this.times[key]);

            }
        }
        return time_string;
    }
}