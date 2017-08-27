import { Component, OnInit } from '@angular/core';

import { Alert, AlertType } from '../../shared/alert';
import { AlertService } from '../../services/alert.service';

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent {
    alerts: Alert[] = [];

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getAlert().subscribe((alert: Alert) => {
            if (!alert) {
                // clear alerts when an empty alert is received
                this.alerts = [];
                return;
            }

            // add alert to array
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

        // return css class based on alert type
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
}