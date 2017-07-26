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

                <div class="ui action input" *ngIf="this.videoFile && !isSending">
                    <input type="text" [value]="this.videoFile ? this.videoFile.name : ''" [disabled]="true">
                    <button type="button" (click)="UploadVideoFile()" class="ui red button">Send</button>
                    <button type="button" (click)="ClearVideoFile()" class="ui button">Cancel</button>
                </div>
                <label class="fluid ui big button" *ngIf="!this.videoFile && !isSending" for="videoFile"> 
                    Upload Video &nbsp;
                    <i class="upload icon"></i>
                    <input #videoFileInput type="file" id="videoFile" name="videoFile" (change)="changeListener($event)" style="display: none">
                </label>

                <div *ngIf="isSending" class="ui indicating progress" [attr.data-percent]="videoFileProgress">
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

    @Input() title: string;
    @Input() description: string;
    @Input() channels: Array<Channel>;
    @Input() channelId: string;
    @Input() shootDate: string;
    @Input() state: string;

    @ViewChild('videoFileInput') inputVariable: any;

    public mediaForm: FormGroup;
    public videoFile: File = null;
    public videoFileProgress: number = 0;
    public isSending: boolean = false;

    constructor(
        public fb: FormBuilder
    ) {
        
    }

    ngOnInit(){
        this.mediaForm = this.fb.group({  
            'title': [this.title, Validators.required],
            'description': [this.description, Validators.required],
            'channelId': [this.channelId],
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

    changeListener($event: any): void {
        this.videoFile = $event.target.files[0];
        //this.videoFile.name
    }

    ClearVideoFile() {
        //this.inputVariable.value = '';
        //console.log(this.inputVariable);
        this.videoFile = null;
    }

    UploadVideoFile(){
        /*
        this.partnerService.startUpload(this.authService.sessionId).subscribe( res => {  
            console.log(res);
        }, 
            error => console.log(error)
        ); 
        */
        // сначала сохраняем форму и получаем guid        
        this.readThis(this.videoFile);
        /*
        this.partnerService.stopUpload(this.authService.sessionId).subscribe( res => {  
            console.log(res);
        }, 
            error => console.log(error)
        );
        */
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
             if (this.readyState == 2) { // Загрузка DONE

                //загружаем кусок и после удачной загрузки рисуем прогресс и запускаем следующую порцию
                that.videoFileProgress = Math.round((position + blob.size) * 100 / that.videoFile.size);

                if ( that.videoFileProgress == 100) 
                    that.isSending = false;

                //console.log('PERCENT = ' + that.videoFileProgress);

                position += portion;
                if (that.videoFile.size > position) {

                    setTimeout(function(){
                        that.UploadPortion(that.videoFile, position, portion);
                    },  Math.floor(Math.random() * 1000) );
                    
                }
             }
        }
 
        myReader.readAsBinaryString(blob);
        
    }

    readThis(videoFile: File){        
        //this.videoFile = inputValue.files[0];


        
    
        
        if (!videoFile) {            
            return;
        }
        this.isSending = true;
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
        /*
        
        */
    }
    
    ngAfterViewInit() {
        
    }
}
