import { Component, OnInit, OnDestroy } from '@angular/core';

import { Agreement } from '../../shared/agreement';
import { AuthService } from '../../services/auth.service';
import { UserAgreement } from '../../services/user-agreement.service';

import 'rxjs/operators/map';

@Component({
    selector: 'app-agreement',
    templateUrl: 'agreement.component.html'
})

export class AgreementComponent implements OnInit, OnDestroy {
    agreements: Agreement[] = [];
    currentAgreement: Agreement;
    private alive: boolean = true;

    constructor(
        private authService: AuthService,
        private userAgreement: UserAgreement
    ) { }

    ngOnInit() {

        this.userAgreement.getAgreement()
        .takeWhile(() => this.alive)
        .subscribe((agreement: Agreement) => {
            if (!agreement) {
                // очищаем alerts получен пустой alert
                //this.agreement = [];
                return;
            }
            this.addLastAgreement(agreement);
        });

        /*
        this.userAgreement.getAgreements(this.authService.sessionId)
        .takeWhile(() => this.alive)
        .subscribe((agreements: Agreement[]) => {
            if (!agreements) {
                // очищаем agreements получен пустой agreements
                //this.agreements = [];
                this.currentAgreement = null;
                return;
            }
            //добавляем agreements в массив
            //agreements.map(item => this.agreements.push(item));
            this.agreements = agreements;
            //this.addLastAgreement(agreements[0]);
            //this.openDialog();
            //document.getElementById("agreement").scrollIntoView();
        });

        */
    }

    addLastAgreement(agreement: Agreement) {

        this.userAgreement.getFullAgreement(agreement.RequestToken)
        .takeWhile(() => this.alive)
        .subscribe((data: Agreement) => {
            if (!data) {
                // очищаем alerts получен пустой alert
                //this.agreement = [];
                return;
            }
            this.currentAgreement = data;
            setTimeout( ()=> {
                $('#last_agreement').modal('show'); // без таймаута не работает.
                document.getElementById("last_agreement_text").scrollIntoView();
            }, 100 );
        });        
    }

    ngOnDestroy() { 
        this.alive = false;
    }

    openDialog() {
        setTimeout( ()=> $('.ui.modal').modal('show'), 100 );
        
    }
}