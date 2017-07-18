import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Channel } from '../../shared/media';
import { DatePipe } from '@angular/common';


@Component({
    selector: 'media-form',
    template: `
        <form class="ui form segment" (ngSubmit)="onSubmit()" [formGroup]="mediaForm">
            <h4 class="ui dividing header">Video description</h4>

            <div class="field" [ngClass]="{'error' : !mediaForm.controls['title'].valid}">
                <label>Title:</label>
                <input placeholder="Title" type="text" [formControlName]="'title'">
            </div>
            <div class="field" [ngClass]="{'error' : !mediaForm.controls['description'].valid}">
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

            <div class="field" [ngClass]="{'error' : !mediaForm.controls['shootDate'].valid}">
                <label>Shoot date:</label>
                <calendar (change)="onDateChange($event)" [fGroup]="mediaForm" [fControlName]="'shootDate'"></calendar>                
            </div>

            <button type="submit" class="ui green submit button" [disabled]="!mediaForm.valid">Submit</button>
            <div class="ui error message">
                <ul>If you are looking for validation you should check out.</ul>
            </div>
        </form>
        `,
        providers: [DatePipe]
})

export class MediaFormComponent implements AfterViewInit {
    @Output() formResults: EventEmitter<any> = new EventEmitter();

    @Input() title: string;
    @Input() description: string;
    @Input() channels: Array<Channel>;
    @Input() channelId: string;
    @Input() shootDate: string;

    public mediaForm: FormGroup;

    constructor(
        public fb: FormBuilder,
        public datepipe: DatePipe
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
    onDateChange(date: Date): void {
        //this.mediaForm.controls['shootDate'].setValue(date);
        console.log(this.datepipe.transform(date, 'yyyy-MM-dd'));
    }
    ngAfterViewInit() {
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
