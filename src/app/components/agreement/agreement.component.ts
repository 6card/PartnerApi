import { Component, OnInit, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { CommonComponent }  from '../../shared/common.component';

import { Agreement } from '../../shared/agreement';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';
import { UserAgreement } from '../../services/user-agreement.service';
import { PartnerService } from '../../services/partner.service';

import 'rxjs/operators/map';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-agreement',
    templateUrl: 'agreement.component.html'
})

export class AgreementComponent extends CommonComponent implements OnInit, OnDestroy {
    @ViewChild('agreementTextBlock') textBlock: ElementRef;

    currentAgreement: Agreement;
    acceptDisabled: boolean = true;

    constructor(    
        private router: Router,
        protected authService: AuthService,
        protected partnerService: PartnerService,
        protected alertService: AlertService,
        protected userAgreement: UserAgreement
    ) {
        super(authService, partnerService, alertService, userAgreement);
     }
    
    ngOnInit() {
        this.userAgreement.getAgreement()
        .takeWhile(() => this.alive)
        .subscribe((agreement: Agreement) => {
            if (!agreement) {
                return;
            }
            this.addFullAgreement(agreement);
        });
    }

    loadAgreements() {
        console.log('loadAgreements');
        this.userAgreement.getAgreements(this.authService.sessionId)
        .takeWhile(() => this.alive)  
        .subscribe( (res: any) => {  
            const data = this.respondHandler(res);
            if (data.Data.length > 0) {
                this.userAgreement.add( data.Data[0] );
            }
            else {
                this.refreshPage();
            }
        }, 
            error => this.errorHandler(error)
        );
    }

    addFullAgreement(agreement: Agreement) { //получаем полное соглашение
        const that = this;

        this.userAgreement.getFullAgreement(agreement.RequestToken)
        .takeWhile(() => this.alive)
        .subscribe((data: Agreement) => {
            if (!data) {
                this.currentAgreement = null;
                return;
            }
            this.currentAgreement = data;

             // без таймаута не успевает обработаться
            setTimeout( ()=> {
                $('#last_agreement').modal({ 
                    closable: false,
                    onShow: function(){
                        that.modalShowHandler();
                    },
                    onHidden: function(){
                        that.modalHideHandler();
                    },
                    selector    : {
                        close    : ' ',
                        approve  : ' ',
                        deny     : ' '
                      },
                }).modal('show');
                document.getElementById("last_agreement_text").scrollIntoView(); //скролл на начало нового соглашения
            }, 100 );
        });        
    }



    onScroll(event: any) {
        if ( (event.target.scrollTop + event.target.offsetHeight) == event.target.scrollHeight) {
            this.acceptDisabled = false;
        }
    }

    modalShowHandler() { //проверка на наличие скролла, вкучение кнопки при его отсутствии
        let el = this.textBlock.nativeElement;
        if ( (el.scrollTop + el.offsetHeight) == el.scrollHeight) {
            this.acceptDisabled = false;
        }
    }

    modalHideHandler() {
        this.loadAgreements(); //проверка на оставшиеся соглашения
        this.userAgreement.clear();
        this.acceptDisabled = true;
    }

    accept() {
        this.userAgreement.acceptAgreement(this.currentAgreement.AcceptToken)
        .takeWhile(() => this.alive)  
        .subscribe( (status: number) => {  
            if (status == 204) {
                $('#last_agreement').modal('hide');
            }
        }, 
            error => this.errorHandler(error)
        );
    }

    refreshPage() {
        this.router.navigate([this.router.url]);
    }
}