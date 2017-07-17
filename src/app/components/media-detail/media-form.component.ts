import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Channel } from '../../shared/media';

@Component({
    selector: 'media-form',
    template: `
        <form class="ui form segment" (ngSubmit)="onSubmit()" [formGroup]="mediaForm">
            <h4 class="ui dividing header">Video description</h4>

            <div class="field" [ngClass]="{'error' : !mediaForm.controls['title'].valid}">
                <label>Title:</label>
                <input placeholder="Title" type="text" [formControl]="mediaForm.controls['title']">
            </div>
            <div class="field" [ngClass]="{'error' : !mediaForm.controls['description'].valid}">
                <label>Description</label>
                <textarea placeholder="Description" [formControl]="mediaForm.controls['description']">{{description}}</textarea>
            </div>

            <div class="field">
                <label>Channel:</label>
                <select placeholder="Channel" type="text" [formControl]="mediaForm.controls['channelId']">
                    <option *ngFor="let c of channels" [ngValue]="c.Id">{{c.Title}}</option>
                    <option value="5">5</option>
                </select>
            </div>

            <div class="field" [ngClass]="{'error' : !mediaForm.controls['shootDate'].valid}">
                <label>Shoot date:</label>
                <div class="ui calendar" id="calendar">
                    <div class="ui input left icon">
                    <i class="calendar icon"></i>
                    <input type="text" placeholder="Date/Time" [formControl]="mediaForm.controls['shootDate']">
                    </div>
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
         this.pushValues();
    }
    ngAfterViewInit() {
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
        });
    }
}