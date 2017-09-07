import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Channel } from '../../shared/media';


@Component({
    selector: 'media-form',
    templateUrl: './media-form.component.html',
    providers: [DatePipe]
})

export class MediaFormComponent {
    @Output() formResults: EventEmitter<any> = new EventEmitter();
    @Output() changeBlock: EventEmitter<any> = new EventEmitter();

    @Input() title: string;
    @Input() description: string;
    @Input() channels: Array<Channel>;
    @Input() channelId: number;
    @Input() shootDate: string;
    @Input() state: string;
    @Input() editForm: boolean = false;

    private tempDate: Date;

    isSended: boolean = false;

    public mediaForm: FormGroup;
    constructor(
        public datepipe: DatePipe,
        public fb: FormBuilder
    ) {
        
    }

    ngOnInit(){
        this.mediaForm = this.fb.group({  
            'title': [this.title, Validators.required],
            'description': [this.description, Validators.required],
            'channelId': [this.channelId, Validators.required],
            'state': [this.state],
            'shootDate': [this.shootDate ? this.shootDate : new Date(), Validators.required]
        });
    }

    pushValues(): void {
        let values = this.mediaForm.value;
        if (this.tempDate)
            values.shootDate = this.datepipe.transform(this.tempDate, 'yyyy-MM-ddTHH:mm:ss+03:00');
        this.formResults.emit(values);
    }

    onSubmit(): void {  
        this.isSended = true;
        if(this.mediaForm.dirty && this.mediaForm.valid) {
            this.pushValues();
        }
    }
    onDateChange(date: any): void {
        this.tempDate = date;
    }

    onBlockMedia(event: any): void {
        this.changeBlock.emit(event);
    }

    get ChannelName(): string {
        let channel: Channel = this.channels.filter( (item: Channel) => item.Id == this.channelId)[0];
        if (!channel)
            return '';
        return channel.Title;
    }
}
