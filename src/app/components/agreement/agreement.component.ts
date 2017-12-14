import { Component, OnInit, OnDestroy } from '@angular/core';
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
    agreements: Agreement[] = [];
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
        //подписываемся на события: если есть ошибка 21, сервис добавит сюда первое в списке соглашение
        this.userAgreement.getAgreement()
        .takeWhile(() => this.alive)
        .subscribe((agreement: Agreement) => {
            if (!agreement) {
                return;
            }
            this.addLastAgreement(agreement);
        });

        //this.loadAgreements()
    }

    loadAgreements() {
        console.log('loadAgreements');
        this.userAgreement.getAgreements(this.authService.sessionId)
        .takeWhile(() => this.alive)  
        .subscribe( (res: any) => {  
            const data = res;
            if (data.Data.length > 0) {
                this.userAgreement.add( data.Data[0] );
            }
            else {
                this.refreshPage();
            }
        }, 
            error => console.error(error)
        );
    }

    addLastAgreement(agreement: Agreement) { //получаем полное соглашение
        const that = this;

        this.userAgreement.getFullAgreement(agreement.RequestToken)
        .takeWhile(() => this.alive)
        .subscribe((data: Agreement) => {
            if (!data) {
                this.currentAgreement = null;
                return;
            }
            this.currentAgreement = data;

            //console.log(data.AcceptToken);
             // без таймаута не успевает обработаться, надо будет убрать
            setTimeout( ()=> {
                $('#last_agreement').modal({ 
                    closable: false,
                    onHidden: function(){
                        that.loadAgreements();//проверка на оставшиеся соглашения
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
        if (event.target.scrollTop == event.target.scrollTopMax) {
            this.acceptDisabled =false;
        }
    }

    accept() {        
        this.userAgreement.clear();
        this.acceptDisabled = true;
        $('#last_agreement').modal('hide');
    }

    refreshPage() {
        this.router.navigate([this.router.url]);
    }


}