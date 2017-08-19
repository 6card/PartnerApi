import { Component } from '@angular/core';
import { Router } from "@angular/router";

import { CommonComponent }  from '../../shared/common.component';
//import { PaginationComponent } from "../pagination.component"

import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { PartnerService } from '../../services/partner.service';
import { Media, Channel } from '../../shared/media';

const ITEMS_PER_PAGE = 2;

@Component({
  selector: 'media-list',
  templateUrl: './media-list.component.html'
})

export class MediaListComponent extends CommonComponent {
    public medias: Array<Media> = [];
    public currentPage: number = 1;
    public itemsPerPage: number = 2;
    public totalItems: number;
    public error: any;
    public channelId: number;
    public channels: Array<Channel> = [];

    public loadingMedia: boolean = false;

    constructor(
        protected router: Router,
        protected authService: AuthService,
        protected partnerService: PartnerService,
        protected alertService: AlertService
    ) { 
        super(authService, partnerService, alertService);
      /*
      if (!partnerService.xSessionId) {
        this.router.navigate(['login']);
      }
      */
    }

    ngOnInit(){
        this.itemsPerPage = + localStorage.getItem('itemsPerPage') || ITEMS_PER_PAGE;
        this.channelId = + localStorage.getItem('channelId') || null;

        this.loadChannels();      
        this.loadMedias();
    }

    ngAfterViewInit() { 
        //console.log('media-list ngAfterViewInit');
        /*
        jQuery('.ui.dropdown.example')
            .dropdown({
                allowAdditions: true
            });
        */
    }

    loadMedias() {        

        if (!this.channelId)
            return;
        this.getTotalMediaCount();      
        let countItems = this.itemsPerPage;
        let startItem = (this.currentPage * countItems) - countItems + 1;
        
        this.loadingMedia = true;

        this.partnerService.getMedias(this.authService.sessionId, this.channelId, startItem, countItems).subscribe( data => {  
            let medias = this.respondHandler(data);
            if (medias && medias.Data !== undefined) {
                this.medias.length = 0;
                medias.Data.map((item:any) =>  this.medias.push(new Media(item)));  
            } 
            this.loadingMedia = false;      
        }, 
            error => this.errorHandler(error)
        );  
    }

    getTotalMediaCount() {
        this.partnerService.getMediasCount(this.authService.sessionId, this.channelId).subscribe( res => {  
            let data = this.respondHandler(res);
            if (data.Data !== undefined) {
                this.totalItems = data.Data;
                //console.log('total items'+this.totalItems);
            }        
        },
            error => this.errorHandler(error)
        ); 
    }

    

    loadChannels() { 
        this.partnerService.getChannels(this.authService.sessionId).subscribe( res => {  
            let data = this.respondHandler(res);
            if (data.Data !== undefined) {
                data.Data.map((item:any) =>  this.channels.push(new Channel(item)));  
            }   
        }, 
            error => this.errorHandler(error)
        ); 
    }

    mediaBlock(mediaId: number) {        
        
        if(confirm("Вы действительно хотите заблокировать ролик?")) {
            this.partnerService.blockMedia(this.authService.sessionId, mediaId, 1).subscribe( res => {  
                let data = this.respondHandler(res);
                this.loadMedias();
            }, 
                error => this.errorHandler(error)
            );
        }
        
    }

    mediaUnblock(mediaId: number) {
        this.partnerService.unblockMedia(this.authService.sessionId, mediaId, 1).subscribe( res => {  
            let data = this.respondHandler(res);
            this.loadMedias();
        }, 
            error => this.errorHandler(error)
        );
    }

    openViewWindow(event: any) {
        //console.log(event.target.parentElement.attr.href);
        //return false;        
    }

    onChannelChange(newValue: number) {
        this.channelId = newValue;        
        localStorage.setItem('channelId', this.channelId.toString());
        this.currentPage = 1;
        this.loadMedias();
    }


    onItemsPerPageChange(newValue: number) {
        this.itemsPerPage = newValue;
        localStorage.setItem('itemsPerPage', this.itemsPerPage.toString());
        this.currentPage = 1;
        this.loadMedias();
    }

    pageUpdated(page: number) {
        //console.log('PAGE UPDATED 2');
        this.currentPage = page;
        this.loadMedias();
    }

}