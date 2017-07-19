import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from	"@angular/router";

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { MediaListComponent } from './components/media-list/media-list.component';
import { MediaDetailComponent } from './components/media-detail/media-detail.component';
import { MediaAddComponent } from './components/media-add/media-add.component';
import { MediaFormComponent } from "./components/media-detail/media-form.component";

import { NavigationComponent } from "./components/navigation.component"
import { PaginationComponent } from "./components/pagination.component"
import { CalendarComponent } from "./components/calendar.component"

import { AuthService } from './services/auth.service';
import { PartnerService } from './services/partner.service';

import { AuthGuard } from './shared/auth.guard';

import { SafePipe } from './pipes/safe.pipe';
//import { DatePipe } from '@angular/common';

const	routes:	Routes	=	[
		{path:	'',	redirectTo:	'media',	pathMatch:	'full'},
    //{ path: '', component: MediaComponent, canActivate: [AuthGuard] },
		//{path:	'channels',	component:	ChannelsComponent, canActivate: [AuthGuard] },
    { path:	'media',	component:	MediaListComponent },
    { path:	'media/add',	component:	MediaAddComponent, canActivate: [AuthGuard] },
    { path:	'media/:id',	component:	MediaDetailComponent },
		{ path:	'login',	component:	LoginComponent },
		{ path:	'**',	redirectTo:	'media',	pathMatch:	'full'}
    //{path:	'**',	component:	AppComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MediaListComponent,
    MediaDetailComponent,
    MediaAddComponent,
    MediaFormComponent,

    NavigationComponent,
    PaginationComponent,
    CalendarComponent,

    //DatePipe,
    SafePipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes, {useHash: false})
  ],
  providers: [
    AuthService,
    PartnerService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
