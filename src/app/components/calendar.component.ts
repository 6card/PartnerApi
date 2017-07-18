import {Component, ElementRef, AfterViewInit, Output, EventEmitter, Input, Self} from '@angular/core';
import {ControlValueAccessor, NgModel} from '@angular/forms';
declare var $: any;
@Component({
  selector: 'calendar',
  template: `
        <div class="ui calendar">
          <div class="ui input left icon">
            <i class="calendar icon"></i>
            <input type="text" placeholder="Click to select Date/Time" [value]="initialDate">
          </div>
        </div>
`,
  providers: [NgModel]
})
export class CalendarComponent implements AfterViewInit, ControlValueAccessor {
  @Output() change: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() htmlElement: EventEmitter<HTMLElement> = new EventEmitter<HTMLElement>();
  @Input() settings: CalendarOptions = {};
  @Input() initialDate: Date;
  public onChange: any = Function.prototype;
  public onTouched: any = Function.prototype;
  private selectedDate: Date;
  constructor(private parentElement: ElementRef, @Self() private self: NgModel){
    this.self.valueAccessor = this;
  }
  ngAfterViewInit(): void {
    this.settings.onChange = (date: Date) => {
      this.writeValue(date);
    };
    let calendarElement: HTMLElement = this.parentElement.nativeElement.children[0];
    this.htmlElement.emit(calendarElement);
    $(calendarElement).calendar(this.settings);
  }
  writeValue (value: Date): void {
    if (value === this.selectedDate) {
      return;
    }
    this.self.viewToModelUpdate(value);
    this.change.emit(value);
    this.selectedDate = value;
  }
  registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
  registerOnTouched(fn: () => void): void { this.onTouched = fn; }
}
export interface CalendarOptions {
  type?: string;
  startCalendar?: HTMLElement;
  endCalendar?: HTMLElement;
  startMode?: string;
  ampm?: boolean;
  on?: string;
  minDate?: Date;
  maxDate?: Date;
  formatter?: Function;
  monthFirst?: boolean;
  inline?: boolean;
  onChange?: Function;
}