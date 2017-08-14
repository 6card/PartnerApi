import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Channel } from '../../shared/media';

@Component({
    selector: 'media-form',
    templateUrl: './media-form.component.html'
})

export class MediaFormComponent implements AfterViewInit {
    @Output() formResults: EventEmitter<any> = new EventEmitter();
    @Output() changeBlock: EventEmitter<any> = new EventEmitter();


    @Input() title: string;
    @Input() description: string;
    @Input() channels: Array<Channel>;
    @Input() channelId: string;
    @Input() shootDate: string;
    @Input() state: string;

    public mediaForm: FormGroup;
    constructor(
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
        /*
        this.mediaForm.controls['title'].setValue(this.title);
        this.mediaForm.controls['description'].setValue(this.description);
        this.mediaForm.controls['channelId'].setValue(this.channelId); 
        this.mediaForm.controls['shootDate'].setValue(this.shootDate); 
        this.mediaForm.controls['state'].setValue(this.state); 
        */
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
        //console.log(date);
    }

    onBlockMedia(event: any): void {
        this.changeBlock.emit(event);
    }

    ngAfterViewInit() { }
}
