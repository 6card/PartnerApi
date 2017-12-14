import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { Agreement } from '../../shared/agreement';
import { AuthService } from '../../services/auth.service';
import { UserAgreement } from '../../services/user-agreement.service';

import 'rxjs/operators/map';
import { Subject } from 'rxjs/Subject';

@Component({
    selector: 'app-agreement',
    templateUrl: 'agreement.component.html'
})

export class AgreementComponent implements OnInit, OnDestroy {
    agreements: Agreement[] = [];
    currentAgreement: Agreement;
    private alive: boolean = true;

    acceptDisabled: boolean = true;

    constructor(    
        private router: Router,
        private authService: AuthService,
        private userAgreement: UserAgreement
    ) {
        
     }
    
    onScroll(event: any) {
        //console.log(`scrollTop=${event.target.scrollTop} scrollTopMax=${event.target.scrollTopMax}`);
        if (event.target.scrollTop == event.target.scrollTopMax) {
            this.acceptDisabled =false;
        }
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

        this.loadAgreements()
    }

    loadAgreements() {
        this.userAgreement.getAgreements(this.authService.sessionId)
        .takeWhile(() => this.alive)  
        .subscribe( (res: any) => {  
            let data = res;
            if (data.Data.length > 0)
                this.userAgreement.add( data.Data[0] )
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

    getAcceptDisabled() {
        return this.acceptDisabled;
    }

    accept() {        
        this.userAgreement.clear();
        this.acceptDisabled = true;
        $('#last_agreement').modal('hide');
    }

    refreshPage() {
        this.router.navigate([this.router.url]);
    }

    ngOnDestroy() { 
        this.alive = false;
    }

}