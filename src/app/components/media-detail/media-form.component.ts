import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Channel } from '../../shared/media';



@Component({
    selector: 'media-form',
    template: `
        <form class="ui form segment" (ngSubmit)="onSubmit()" [formGroup]="mediaForm">
            <h4 class="ui dividing header">Video description</h4>

            <div class="field" [ngClass]="{'error' : !mediaForm.controls['title'].valid && mediaForm.controls['title'].touched}">
                <label>Title:</label>
                <input placeholder="Title" type="text" [formControlName]="'title'">
            </div>
            <div class="field" [ngClass]="{'error' : !mediaForm.controls['description'].valid && mediaForm.controls['description'].touched}">
                <label>Description</label>
                <textarea placeholder="Description" [formControlName]="'description'">{{description}}</textarea>
            </div>

            <div class="field">
                <label>Channel:</label>
                <select placeholder="Channel" type="text" [formControlName]="'channelId'">
                    <option *ngFor="let c of channels" [ngValue]="c.Id">{{c.Title}}</option>
                    <option value="5">5</option>
                </select>
            </div>

            <div class="field" [ngClass]="{'error' : !mediaForm.controls['shootDate'].valid && mediaForm.controls['shootDate'].touched}">
                <label>Shoot date:</label>
                <calendar (changeDate)="onDateChange($event)" [fGroup]="mediaForm" [fControlName]="'shootDate'"></calendar>                
            </div>
            <div class="field">
                <label>Video:</label>
                <input type="file" (change)="changeListener($event)">
                <button type="button" *ngIf="videoFile" (click)="UploadVideoFile()" class="ui red button">Send</button>
                <div class="ui indicating progress" [attr.data-percent]="videoFileProgress">
                    <div class="bar" [ngStyle]="{'transition-duration': '300ms', 'width': videoFileProgress+'%'}">
                        <div class="progress">{{videoFileProgress}}%</div>
                    </div>
                    <div class="label">Uploading Video</div>
                </div>
            </div>
            <button type="submit" class="ui green submit button" [disabled]="!mediaForm.valid">Submit</button>
            <div class="ui error message">
                <ul>If you are looking for validation you should check out.</ul>
            </div>
        </form>
        `
})

export class MediaFormComponent implements AfterViewInit {
    @Output() formResults: EventEmitter<any> = new EventEmitter();

    @Input() title: string;
    @Input() description: string;
    @Input() channels: Array<Channel>;
    @Input() channelId: string;
    @Input() shootDate: string;

    public mediaForm: FormGroup;
    public videoFile: File = null;
    public videoFileProgress: number = 0;

    constructor(
        public fb: FormBuilder
    ) {
        this.mediaForm = this.fb.group({  
            'title': [null, Validators.required],
            'description': [null, Validators.required],
            'channelId': [null],
            'shootDate': [null, Validators.required]
        });
    }

    ngOnInit(){
        this.mediaForm.controls['title'].setValue(this.title);
        this.mediaForm.controls['description'].setValue(this.description);
        this.mediaForm.controls['channelId'].setValue(this.channelId); 
        this.mediaForm.controls['shootDate'].setValue(this.shootDate); 
    }

    pushValues(): void {
        let values = this.mediaForm.value;
        this.formResults.emit(values);
    }

    onSubmit(): void {  
        //console.log(this.mediaForm.controls['shootDate'].value);
        this.pushValues();
    }
    onDateChange(date: any): void {
        console.log(date);
    }

    changeListener($event: any): void {
        this.videoFile = $event.target.files[0];
        
    }

    UploadVideoFile(){        
        this.readThis(this.videoFile);
    }

    UploadPortion = (file: File, start: number, length: number) => {
        var myReader:FileReader = new FileReader();
        var blob: Blob;
        var position: number = start;
        var portion: number = length; 
        var that = this;

        if (that.videoFile.slice) 
            blob = that.videoFile.slice(position, position + portion);

        myReader.onloadend = function(e){            
            //myReader.readAsBinaryString(blob);
            console.log('SIZE = ' + blob.size);

            that.videoFileProgress = Math.round((position + blob.size) * 100 / that.videoFile.size);
            
            console.log('PERCENT = ' + that.videoFileProgress);

            position += portion;
            if (that.videoFile.size > position) {

                setTimeout(function(){
                    that.UploadPortion(that.videoFile, position, portion);
                },  Math.floor(Math.random() * 1000) );
                
            }
            //console.log(myReader.result);
        }
 
        myReader.readAsBinaryString(blob);
    }

    readThis(videoFile: File){        
        //this.videoFile = inputValue.files[0];
        
        if (!videoFile) {            
            return;
        }
   
        if (videoFile.size > 100000) 
            this.UploadPortion(videoFile, 0, 100000);
        else
            this.UploadPortion(videoFile, 0, videoFile.size);
   
        // Загрузка по частям http://www.codenet.ru/webmast/js/html5-ajax-partial-upload/
        /*
            FileReader.readyState
            
            EMPTY   : 0 : Данные еще не были загружены.
            LOADING : 1 : Данные в данный момент загружаются.
            DONE    : 2 : Операция чтения была завершена.
        */
    }
    
    ngAfterViewInit() {
        jQuery('.ui.progress').progress();
        /*
        this.settings.onChange = (date: Date) => {
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours();
            let minute = date.getMinutes();

            // everything combined
            let total = (year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + 'T' + (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute) + ':00+0300');
           
            this.mediaForm.controls['shootDate'].setValue(total);
        };
        this.settings.formatter = {
            datetime: (date: Date) => {
                //2017-07-15T19:06:00+03:00
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let minute = date.getMinutes();

                // everything combined
                return (year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':00+0300');
            }
        };

        let calendarElement: HTMLElement = this._elementRef.nativeElement.querySelector('#calendar');

        $(calendarElement).calendar(this.settings);
        
        $('#calendar').calendar({
            type: 'datetime', 
            ampm: false,
            firstDayOfWeek: 1,
            text: {
                days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
                months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
                monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
                today: 'Сегодня',
                now: 'Сейчас',
                am: 'AM',
                pm: 'PM'
            },
            formatter: {
                datetime: function (date) {
                    //2017-07-15T19:06:00+03:00
                    var year = date.getFullYear();
                    var month = date.getMonth() + 1;
                    var day = date.getDate();
                    var hour = date.getHours();
                    var minute = date.getMinutes();
                
                    if (month < 10) {
                        month = '0' + month;
                    }
                    if (day < 10) {
                        day = '0' + day;
                    }

                    // everything combined
                    return (year + '-' + month + '-' + day + 'T' + hour + ':' + minute + ':00+0300');
                }
            },
            onChange: function (date, text, mode) {
                var year = date.getFullYear();
                var month = date.getMonth() + 1;
                var day = date.getDate();
                if (month < 10) {
                    month = '0' + month;
                }
                if (day < 10) {
                    day = '0' + day;
                }

                // everything combined
                console.log(year + '-' + month + '-' + day);
            },
        });
        */
    }
}
