import { Component } from '@angular/core';
import { Router, ActivatedRoute, Params } from "@angular/router";

import { CommonComponent }  from '../../shared/common.component';

import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { PartnerService } from '../../services/partner.service';
import { Media, Channel } from '../../shared/media';

import { Subject } from 'rxjs/Subject';

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
    public channelId: number = -1;
    public stateId: number = -1;
    public states: any = Object.assign({'-1': 'Все статусы'}, Media.getStates());
    public title: string = '';
    public channels: Array<Channel> = [new Channel({Title: 'Все каналы', Id: -1})];

    titleChanged: Subject<string> = new Subject<string>();

    public loadingMedia: boolean = false;

    constructor(
        protected router: Router,
        protected authService: AuthService,
        protected partnerService: PartnerService,
        protected alertService: AlertService,
        protected activatedRoute: ActivatedRoute
    ) { 
        super(authService, partnerService, alertService);
    }

    ngOnInit(){
        let params: Params;

        this.loadChannels();
        this.activatedRoute.queryParams
        .takeWhile(() => this.alive)  
        .subscribe( (param: Params) => {
            params = param;
            this.currentPage = param['page'] || 1;
            this.channelId = param['channel'] || localStorage.getItem('channelId') || -1;
            this.stateId = param['state'] || localStorage.getItem('stateId') || -1;
            this.title = param['title'] || '';
            this.itemsPerPage = param['items'] || localStorage.getItem('itemsPerPage') || ITEMS_PER_PAGE;
            if (params && (Object.keys(params).length === 0)) { // empty params
                this.navigate(true);
            }
            else {            
                this.loadMedias();
            }
        });

        this.titleChanged
            .debounceTime(500)
            .distinctUntilChanged()
            .takeWhile(() => this.alive)
            .subscribe(title => {
                this.title = title;
                this.navigate();
        });    
    }

    getChannelName(channelId: number): string {
        let channel: Channel = this.channels.filter( (item: Channel) => item.Id == channelId)[0];
        if (!channel)
            return '';
        return channel.Title;
    }

    loadMedias() {
        if (!this.channelId)
            return;

        this.getTotalMediaCount();      
        let countItems = this.itemsPerPage;
        let startItem = (this.currentPage * countItems) - countItems + 1;
        
        this.loadingMedia = true;

        this.partnerService.getMedias(this.authService.sessionId, this.channelId, startItem, countItems, this.stateId, this.title)
        .takeWhile(() => this.alive)  
        .subscribe( data => {  
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
        this.partnerService.getMediasCount(this.authService.sessionId, this.channelId, this.stateId, this.title)
        .takeWhile(() => this.alive)  
        .subscribe( res => {  
            let data = this.respondHandler(res);
            if (data.Data !== undefined) {
                this.totalItems = data.Data;
            }        
        },
            error => this.errorHandler(error)
        ); 
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

    mediaBlock(mediaId: number) {
        if(confirm("Вы действительно хотите заблокировать ролик?")) {
            this.partnerService.blockMedia(this.authService.sessionId, mediaId, 1)
            .takeWhile(() => this.alive)  
            .subscribe( res => {  
                let data = this.respondHandler(res);
                this.loadMedias();
            }, 
                error => this.errorHandler(error)
            );
        }
        
    }

    mediaUnblock(mediaId: number) {
        this.partnerService.unblockMedia(this.authService.sessionId, mediaId, 1)
        .takeWhile(() => this.alive)  
        .subscribe( res => {  
            let data = this.respondHandler(res);
            this.loadMedias();
        }, 
            error => this.errorHandler(error)
        );
    }

    onChannelChange(newValue: number) {
        this.channelId = newValue;        
        localStorage.setItem('channelId', this.channelId.toString());
        this.currentPage = 1;
        this.navigate();
    }


    onItemsPerPageChange(newValue: number) {
        this.itemsPerPage = newValue;
        localStorage.setItem('itemsPerPage', this.itemsPerPage.toString());
        this.currentPage = 1;
        this.navigate();
    }

    onStateChange(state: number) {
        this.stateId = state;
        localStorage.setItem('stateId', this.stateId.toString());
        this.currentPage = 1;
        this.navigate();
    }

    onTitleChange(title: string) {
        this.titleChanged.next(title);

        
    }

    pageUpdated(page: number) {
        this.currentPage = page;
        this.navigate();
    }

    navigate(replaceUrl?: boolean) {
        this.router.navigate(['/media'], {replaceUrl: replaceUrl || false, queryParams: { page: this.currentPage, items: this.itemsPerPage, channel: this.channelId, state: this.stateId, title: this.title } });
    }


}