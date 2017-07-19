import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { Router } from "@angular/router";

import { PaginationComponent } from "../pagination.component"

import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';
import { Media } from '../../shared/media';

const ITEMS_PER_PAGE = 2;

@Component({
  selector: 'media-list',
  templateUrl: './media-list.component.html'
})

export class MediaListComponent implements OnInit, OnDestroy, AfterViewInit {
    public medias: Array<Media> = [];
    public currentPage: number = 1;
    public itemsPerPage: number = 2;
    public totalItems: number;
    public error: any;

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
            let medias = this.respondHandler(data);
            if (medias && medias.Data !== undefined) {
                medias.Data.map((item:any) =>  this.medias.push(new Media(item)));  
            }        
        }, 
            error => this.errorHandler(error)
        );  
    }

    getTotalMediaCount() {
        let channelId = 32703;
        this.partnerService.getMediasCount(this.authService.sessionId, channelId).subscribe( data => {  
            if (data.Data !== undefined) {
                this.totalItems = data.Data;
                //console.log('total items'+this.totalItems);
            }        
        },
            error => this.errorHandler(error)
        ); 
    }

    ngOnInit(){
        //console.log('media-list ngOnInit');
         
        this.getTotalMediaCount();
        this.itemsPerPage = +localStorage.getItem('itemsPerPage') || ITEMS_PER_PAGE;
        this.loadMedia();            
    }

    ngOnDestroy(){
        //console.log('media-list ngOnDestroy');
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

    onItemsPerPageChange(newValue: number) {
        this.itemsPerPage = newValue;
        localStorage.setItem('itemsPerPage', this.itemsPerPage.toString());
        this.currentPage = 1;
        this.loadMedia();
        //console.log('itemsPerPage'+this.itemsPerPage);
    }

    pageUpdated(page: number) {
        //console.log('PAGE UPDATED 2');
        this.currentPage = page;
        this.loadMedia();
    }

    private respondHandler(data: any) {
        if (!data.Success) {
            this.error = data.Message.Text;
            console.error(this.error);
            return false;
        }        
        return data;        
    }

    private errorHandler(error: any) {
        this.error = error; 
        console.error(error);
    }

}