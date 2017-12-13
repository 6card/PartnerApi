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
    private alive: boolean = true;

    constructor(
        private authService: AuthService,
        private userAgreement: UserAgreement
    ) { }

    ngOnInit() {
        this.userAgreement.getAgreements(this.authService.sessionId)
        .takeWhile(() => this.alive)
        .subscribe((agreements: Agreement[]) => {
            if (!agreements) {
                // очищаем agreements получен пустой agreements
                this.agreements = [];
                return;
            }
            //добавляем agreements в массив
            //agreements.map(item => this.agreements.push(item));
            this.agreements = agreements;
            $('.ui.modal').modal('show');
            //document.getElementById("agreement").scrollIntoView();
        });
    }

    ngOnDestroy() { 
        this.alive = false;
    }
}