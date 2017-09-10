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

  constructor(
    protected authService:AuthService,
    protected partnerService: PartnerService,
    protected alertService: AlertService
  ){
    super(authService, partnerService, alertService);
    
  }

  closeModal() {
    this.TempEmbedUrl = null;
  }

  Show(media: Media){
    this.media = media;

    if (media.isPossibleToView) {      
      let url: string;
      this.partnerService.getTempEmbedUrl(this.authService.sessionId, media.MediaId, 1)
      .takeWhile(() => this.alive) 
      .subscribe( res => {  
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
    this.alive = false;
    this.closeModal();
  }

}