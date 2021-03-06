//https://gist.github.com/ihadeed/5f73e703897318e86521d5e5008347d8

import {Component, ElementRef, AfterViewInit, Output, EventEmitter, Input, Self} from '@angular/core';
import {ControlValueAccessor, FormGroup, FormControl} from '@angular/forms';
import { DatePipe } from '@angular/common';

declare var $: any;
@Component({
  selector: 'calendar',
  templateUrl: './calendar.component.html',
  providers: [DatePipe]
})
export class CalendarComponent implements AfterViewInit {
  @Output() changeDate: EventEmitter<any> = new EventEmitter<any>();
  @Output() htmlElement: EventEmitter<HTMLElement> = new EventEmitter<HTMLElement>();

  @Input() fGroup: FormGroup;
  @Input() fControlName: string;
  @Input() settings: CalendarOptions = {
      type: 'datetime', 
      ampm: false,
      firstDayOfWeek: 1,
      //monthFirst: false,
      text: {
          days: ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'],
          /* из-за этой настройки парсинг даты сбивается */
          //months: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
          monthsHeader: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
          monthsShort: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
          today: 'Сегодня',
          now: 'Сейчас',
          am: 'AM',
          pm: 'PM'
      }
  };
  @Input() initialDate: Date;

  //public onChange: any = Function.prototype;
  //public onTouched: any = Function.prototype;
  private selectedDate: Date;
  constructor(
    public datepipe: DatePipe,
    private parentElement: ElementRef
  ){
  }
  ngAfterViewInit(): void {
    
    this.settings.onChange = (date: Date) => {
      this.writeValue(date);
    };

    this.settings.formatter = {
        datetime: (date: Date) => {
            if (!date) {
              return '';
            }
            //2017-07-15T19:06:00+03:00
            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let day = date.getDate();
            let hour = date.getHours();
            let minute = date.getMinutes();

            let total = ((day < 10 ? '0' + day : day) + '.' + (month < 10 ? '0' + month : month) + '.' + year + ' ' + (hour < 10 ? '0' + hour : hour) + ':' + (minute < 10 ? '0' + minute : minute));
           
            return total;
        },
        dayHeader: (date: Date, settings: CalendarOptions) => {
          var month = settings.text.monthsHeader[date.getMonth()];
          var year = date.getFullYear();
          return month + ' ' + year;
        },
    };
    
    let calendarElement: HTMLElement = this.parentElement.nativeElement.children[0];
    this.htmlElement.emit(calendarElement);
    $(calendarElement).calendar(this.settings);

  }

  writeValue (value: Date): void {
    if (value === this.selectedDate) {
      return;
    }
    //2017-07-15T19:06:00+03:00
    if (value instanceof Date) {
      
        let transformDate = this.datepipe.transform(value, 'dd.MM.yyyy HH:mm');
        this.fGroup.controls[this.fControlName].setValue(transformDate);
        this.changeDate.emit(value);
    }

    this.selectedDate = value;
  }
  //registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  //registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
export interface CalendarOptions {
  type?: string;
  firstDayOfWeek? :number;
  text?: {
    days?: Array<string>,
    /* из-за этой настройки парсинг даты сбивается */
    months?: Array<string>,
    monthsHeader?: Array<string>,
    monthsShort?: Array<string>,
    today?: string,
    now?: string,
    am?: string,
    pm?: string,
  };
  formatter?: {
      datetime?: Function,
      dayHeader?: Function,
  };
  startCalendar?: HTMLElement;
  endCalendar?: HTMLElement;
  startMode?: string;
  ampm?: boolean;
  on?: string;
  minDate?: Date;
  maxDate?: Date;
  //formatter?: Function;
  monthFirst?: boolean;
  inline?: boolean;
  onChange?: Function;
}