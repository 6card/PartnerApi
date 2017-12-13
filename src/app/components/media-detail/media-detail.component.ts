import { Component, OnInit, AfterViewInit, DoCheck, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { CommonComponent }  from '../../shared/common.component';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';
import { UserAgreement } from '../../services/user-agreement.service';

import { Media, Channel } from '../../shared/media';
@Component({
  selector: 'media-detail',
  templateUrl: './media-detail.component.html'
})

export class MediaDetailComponent extends CommonComponent implements DoCheck{
    public media: Media;
    public oldMedia: Media;
    public mediaId: number;
    public channels: Array<Channel> = [];
    public TempEmbedUrl: string;
    public MediaReportsUrl: string;
    public loadingMedia: boolean = false;

    @ViewChild('mediaForm') mediaForm: any;

    constructor(
        protected authService: AuthService,
        protected partnerService: PartnerService,
        protected alertService: AlertService,
        protected userAgreement: UserAgreement,
        
        private	router:	Router,
        private route: ActivatedRoute
    ) { 
        super(authService, partnerService, alertService, userAgreement);
    }

    ngOnInit(){
        this.route.params.forEach((params: Params) => {
             this.mediaId = params['id'];
             this.loadMedia(this.mediaId);
         });        
         this.loadChannels();
     }

    ngDoCheck() {
        if (this.oldMedia !== this.media) {
            this.oldMedia = this.media;
            if (this.media.isPossibleToView && this.media.Video) {
                this.getTempEmbedUrl();
            }

            if (this.media.isAvailableMediaStat) {
                this.getMediaReportsUrl();
            }
        }
    }

    loadChannels() { 
        this.partnerService.getChannels(this.authService.sessionId)
        .takeWhile(() => this.alive)  
        .subscribe( res => {  
            let data = this.respondHandler(res);
            if (data.Data !== undefined) {
                data.Data.map((item:any) =>  this.channels.push(new Channel(item)));  
            }   
        }, 
            error => this.errorHandler(error)
        ); 
    }

    loadMedia(mediaId: number) { 
        this.loadingMedia = true;
        this.partnerService.getMedia(this.authService.sessionId, mediaId, 1)
        .takeWhile(() => this.alive)  
        .subscribe( res => {  
            let data = this.respondHandler(res);
            if (data !== undefined) {
                this.media = new Media(data.Data); 
                this.loadingMedia = false;
            }   
        }, 
            error => this.errorHandler(error)
        ); 
    }

    

    changeMediaBlock(e: any) {
        if(e.target.checked){
            this.mediaBlock();
        }
        else {
            this.mediaUnblock();
        }
    }

    mediaBlock() {
        if(confirm("Вы действительно хотите заблокировать ролик?")) {
            this.partnerService.blockMedia(this.authService.sessionId, this.mediaId, 1)
            .takeWhile(() => this.alive)  
            .subscribe( res => {  
                let data = this.respondHandler(res);
                this.mediaForm.pushValues();
            }, 
                error => this.errorHandler(error)
            );
        }
        
    }

    mediaUnblock() {
        this.partnerService.unblockMedia(this.authService.sessionId, this.mediaId, 1)
        .takeWhile(() => this.alive)  
        .subscribe( res => {  
            let data = this.respondHandler(res);
            this.mediaForm.pushValues();
        }, 
            error => this.errorHandler(error)
        );
    }

    getTempEmbedUrl() {
        let url: string;
        this.partnerService.getTempEmbedUrl(this.authService.sessionId, this.mediaId, 1)
        .takeWhile(() => this.alive)
        .subscribe( res => {  
            let data = this.respondHandler(res);
            url = data.Data;
            this.TempEmbedUrl = url;
        }, 
            error => this.errorHandler(error)
        );
    }

    getMediaReportsUrl() {
        let url: string;
        this.partnerService.getMediaReportsUrl(this.authService.sessionId, this.mediaId)
        .takeWhile(() => this.alive)  
        .subscribe( res => {  
            let data = this.respondHandler(res);
            url = data.Data;
            this.MediaReportsUrl = url;
        }, 
            error => this.errorHandler(error)
        );
    }

    viewVideo() {
        let url: string;
        this.partnerService.getTempEmbedUrl(this.authService.sessionId, this.mediaId, 1)
        .takeWhile(() => this.alive)  
        .subscribe( res => {  
            let data = this.respondHandler(res);
            url = data.Data; 
            window.open(url, "_blank");
        }, 
            error => this.errorHandler(error)
        );
        return url;
    }

    updateMedia(data: any) { 
        this.partnerService.updateMedia(this.authService.sessionId, data)
        .takeWhile(() => this.alive)  
        .subscribe( res => {  
            let data = this.respondHandler(res);
            this.loadMedia(this.media.MediaId);
        }, 
            error => this.errorHandler(error)
        );
        
    }

    formUpdated(params: any) {
        this.media.Title = params.title;
        this.media.Description = params.description;
        this.media.ChannelId = params.channelId;
        this.media.ShootDate = params.shootDate;
        delete this.media.ShootDateUtc;

        let obj = {
            'MediaId': this.mediaId,
            'ShootDate': params.shootDate,
            'Title' : params.title,
            'Description' : params.description
        }
        this.updateMedia(obj);
    }

    onVideoUploadDone() {
        this.mediaForm.pushValues();
    }

    get ChannelName(): string {
        let channel: Channel = this.channels.filter( (item: Channel) => item.Id == this.media.ChannelId)[0];
        if (!channel)
            return '';
        return channel.Title;
    }
}