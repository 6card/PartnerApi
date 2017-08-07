import { Component, Input, Output, EventEmitter, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Channel } from '../../shared/media';

@Component({
    selector: 'media-form',
    template: `
        <form class="ui form segment" (ngSubmit)="onSubmit()" [formGroup]="mediaForm">
            <h4 class="ui dividing header">Video description</h4>

            <div class="field">
                <label>Video:</label>

                <div class="ui action input" *ngIf="this.videoFile">
                    <input type="text" [value]="this.videoFile ? this.videoFile.name : ''" [disabled]="true">
                    <button type="button" (click)="onSendVideo($event)" class="ui red button">Send</button>
                    <button type="button" (click)="ClearVideoFile()" class="ui button">Cancel</button>
                </div>
                <label class="fluid ui big button" *ngIf="!this.videoFile" for="videoFile"> 
                    Upload Video &nbsp;
                    <i class="upload icon"></i>
                    <input #videoFileInput type="file" id="videoFile" name="videoFile" (change)="changeListener($event)" style="display: none">
                </label>

                <div *ngIf="videoFileProgress > 0" class="ui indicating progress" [attr.data-percent]="videoFileProgress">
                    <div class="bar" [ngStyle]="{'transition-duration': '300ms', 'width': videoFileProgress+'%'}">
                        <div class="progress">{{videoFileProgress}}%</div>
                    </div>
                    <div class="label">Uploading Video...</div>
                </div>
            </div>

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
                <div class="ui toggle checkbox">
                    <input type="checkbox" [formControlName]="'state'" (change)="onBlockMedia($event)">
                    <label>Block</label>
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
    @Output() changeBlock: EventEmitter<any> = new EventEmitter();
    @Output() sendVideo: EventEmitter<any> = new EventEmitter();

    @Input() title: string;
    @Input() description: string;
    @Input() channels: Array<Channel>;
    @Input() channelId: string;
    @Input() shootDate: string;
    @Input() state: string;
    @Input() videoFileProgress: number;

    @ViewChild('videoFileInput') inputVariable: any;

    public mediaForm: FormGroup;
    public videoFile: File = null;
    
    public isSending: boolean = false;

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
        console.log(date);
    }

    onBlockMedia(event: any): void {
        this.changeBlock.emit(event);
    }
    onSendVideo(event: any): void {
        this.sendVideo.emit(this.videoFile);
    }

    changeListener($event: any): void {
        this.videoFile = $event.target.files[0];
        //this.videoFile.name
    }

    ClearVideoFile() {
        //this.inputVariable.value = '';
        //console.log(this.inputVariable);
        this.videoFile = null;
    }

    

    
    
    ngAfterViewInit() {
        
    }
}
