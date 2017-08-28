import { Component, Input, OnDestroy } from '@angular/core';

import { CommonComponent }  from '../../shared/common.component';

import { AlertService } from '../../services/alert.service';
import { AuthService } from '../../services/auth.service';
import { PartnerService } from '../../services/partner.service';

import { Media } from '../../shared/media';

import {Observable} from 'rxjs/Rx';

@Component({
  selector: 'video-view',
  templateUrl: './video-view.component.html'
})
export class VideoViewComponent extends CommonComponent implements OnDestroy{

  public media: Media;
  public TempEmbedUrl: string;

  public subsUrl: any;

  constructor(
    protected authService:AuthService,
    protected partnerService: PartnerService,
    protected alertService: AlertService
  ){
    super(authService, partnerService, alertService);
    
  }

  ngOnInit(){

  }

  ngAfterViewInit() {

  }

  closeModal() {
    this.TempEmbedUrl = null;
  }

  Show(media: Media){
    this.media = media;

    if (media.isPossibleToView) {
      
      let url: string;
      this.subsUrl = this.partnerService.getTempEmbedUrl(this.authService.sessionId, media.MediaId, 1).subscribe( res => {  
          let data = this.respondHandler(res);
          url = data.Data;
          this.TempEmbedUrl = url;
          var self = this;
          $('.ui.modal.video-view').modal({
            onHide: function(){
              self.closeModal();
            }            
          }).modal('show');
      }, 
          error => this.errorHandler(error)
      );
    }


  }

  ngOnDestroy() {
    this.closeModal();
    if (this.subsUrl)
      this.subsUrl.unsubscribe();
  }

  

  //(isLoggedIn | async) or authService.isAuthenticated()
}