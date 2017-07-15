import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from	"@angular/router";

import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';

import { MediaListComponent } from './components/videos/media-list.component';
import { MediaDetailComponent } from './components/media/media-detail.component';
import { MediaFormComponent } from "./components/media/media-form.component";

import { AuthService } from './services/auth.service';
import { PartnerService } from './services/partner.service';

import { AuthGuard } from './shared/auth.guard';

import { SafePipe } from './pipes/safe.pipe';

const	routes:	Routes	=	[
		{path:	'',	redirectTo:	'media',	pathMatch:	'full'},
    //{ path: '', component: MediaComponent, canActivate: [AuthGuard] },
		//{path:	'channels',	component:	ChannelsComponent, canActivate: [AuthGuard] },
    { path:	'media',	component:	MediaListComponent, canActivate: [AuthGuard] },
    { path:	'media/:id',	component:	MediaDetailComponent, canActivate: [AuthGuard] },
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

    MediaFormComponent,

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
