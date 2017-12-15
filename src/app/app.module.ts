import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from	"@angular/router";

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { MediaListComponent } from './components/media-list/media-list.component';
import { MediaDetailComponent } from './components/media-detail/media-detail.component';
import { MediaStatComponent } from "./components/media-stat/media-stat.component";
import { MediaAddComponent } from './components/media-add/media-add.component';
import { MediaFormComponent } from "./components/media-form/media-form.component";
import { VideoUploadComponent } from './components/video-upload/video-upload.component';
import { VideoViewComponent } from "./components/video-view/video-view.component";
import { AgreementComponent } from "./components/agreement/agreement.component";

import { NavigationComponent } from "./components/navigation/navigation.component"
import { AlertComponent } from "./components/alert/alert.component"
import { PaginationComponent } from "./components/pagination/pagination.component"
import { CalendarComponent } from "./components/calendar/calendar.component"

import { AlertService } from './services/alert.service';
import { AuthService } from './services/auth.service';
import { PartnerService } from './services/partner.service';
import { UserAgreement } from './services/user-agreement.service';

import { AuthGuard } from './shared/auth.guard';

import { SafePipe } from './pipes/safe.pipe';
import { KeysPipe } from './pipes/keys.pipe';
import { SecondsToTimePipe } from './pipes/seconds-to-time.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';
import { DatexPipe } from './pipes/datex.pipe';

const	routes:	Routes	=	[
		{path:	'',	redirectTo:	'media',	pathMatch:	'full'},
    { path:	'media',	component:	MediaListComponent, canActivate: [AuthGuard] },
    { path:	'media/add',	component:	MediaAddComponent, canActivate: [AuthGuard] },
    { path:	'media/:id',	component:	MediaDetailComponent, canActivate: [AuthGuard] },
    //{ path:	'media/stat/:id',	component:	MediaStatComponent, canActivate: [AuthGuard] },
		{ path:	'login',	component:	LoginComponent },
		{ path:	'**',	redirectTo:	'media',	pathMatch:	'full'}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MediaListComponent,
    MediaDetailComponent,
    MediaStatComponent,
    MediaAddComponent,
    MediaFormComponent,
    VideoUploadComponent,
    VideoViewComponent,
    AgreementComponent,

    NavigationComponent,
    AlertComponent,
    PaginationComponent,
    CalendarComponent,

    SafePipe,
    KeysPipe,
    SecondsToTimePipe,
    OrderByPipe,
    DatexPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes, {useHash: false})
  ],
  providers: [
    AlertService,
    AuthService,
    PartnerService,
    AuthGuard,
    UserAgreement
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
