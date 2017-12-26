import { Component, OnInit, AfterViewInit  } from '@angular/core';

import 'semantic-ui/dist/semantic.min.css';
import 'semantic-ui-calendar/dist/calendar.min.css'

import '../assets/css/styles.css';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewInit  {

    ngOnInit(){

    }
    ngAfterViewInit() { 
        //console.log(jQuery.fn.jquery);
    }
    
}