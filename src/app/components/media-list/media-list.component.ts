import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";

import { PaginationComponent } from "../pagination.component"

import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';
import { Media } from '../../shared/media';
@Component({
  selector: 'media-list',
  templateUrl: './media-list.component.html'
})

export class MediaListComponent implements OnInit, OnDestroy, AfterViewInit {
    public medias: Array<Media> = [];
    public currentPage: number = 1;
    public itemsPerPage: number = 2;
    public totalItems: number;
    constructor(
        private	router:	Router,
        private authService:AuthService,
        private partnerService:PartnerService
    ) { 
      /*
      if (!partnerService.xSessionId) {
        this.router.navigate(['login']);
      }
      */
    }

    loadMedia() {        
        let channelId = 32703;        
        let countItems = this.itemsPerPage;
        let startItem = (this.currentPage * countItems) - countItems + 1;

        this.medias.length = 0;
        this.partnerService.getMedias(this.authService.sessionId, channelId, startItem, countItems).subscribe( data => {  
            if (data.Data !== undefined) {
                data.Data.map((item:any) =>  this.medias.push(new Media(item)));  
                console.log(this.medias); 
            }        
        }, (err) => {
            console.error('Get Media ERROR');
        }, () => {
            //console.log('Torrents get');
        });  
    }

    getTotalMediaCount() {
        let channelId = 32703;
        this.partnerService.getMediasCount(this.authService.sessionId, channelId).subscribe( data => {  
            if (data.Data !== undefined) {
                this.totalItems = data.Data;
                console.log('total items'+this.totalItems);
            }        
        }, (err) => {
            console.error('Get count ERROR');
        }, () => {
            //console.log('Torrents get');
        }); 
    }

    ngOnInit(){
        console.log('media-list ngOnInit');
         
        this.getTotalMediaCount();
        this.itemsPerPage = +localStorage.getItem('itemsPerPage') || 2;
        this.loadMedia();
            
    }

    ngOnDestroy(){
        console.log('media-list ngOnDestroy');
    }

    ngAfterViewInit() { 
        console.log('media-list ngAfterViewInit');
        /*
        jQuery('.ui.dropdown.example')
            .dropdown({
                allowAdditions: true
            });
        */
    }

    onChange(newValue: number) {
        this.itemsPerPage = newValue;
        localStorage.setItem('itemsPerPage', this.itemsPerPage.toString());
        this.currentPage = 1;
        this.loadMedia();
        console.log('itemsPerPage'+this.itemsPerPage);
    }

    pageUpdated(page: number) {
        //console.log('PAGE UPDATED 2');
        this.currentPage = page;
        this.loadMedia();
}

}