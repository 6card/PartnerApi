import { Component, OnInit, OnDestroy } from '@angular/core';

import { Alert, AlertType } from '../../shared/alert';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent implements OnInit, OnDestroy {
    alerts: Alert[] = [];
    private alive: boolean = true;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getAlert()
        .takeWhile(() => this.alive)
        .subscribe((alert: Alert) => {
            if (!alert) {
                // очищаем alerts получен пустой alert
                this.alerts = [];
                return;
            }
            //добавляем alert в массив
            if (!this.alerts.filter(item => item.id == alert.id)[0]) {
                this.alerts.push(alert);
                document.getElementById("messages").scrollIntoView();
            }
        });
    }

    removeAlert(alert: Alert) {
        this.alerts = this.alerts.filter(x => x !== alert);
    }

    cssClass(alert: Alert) {
        if (!alert) {
            return;
        }
        switch (alert.type) {
            case AlertType.Success:
                return 'positive';
            case AlertType.Error:
                return 'negative';
            case AlertType.Info:
                return 'info';
            case AlertType.Warning:
                return 'warning';
        }
    }

    ngOnDestroy() { 
        this.alive = false;
    }
}