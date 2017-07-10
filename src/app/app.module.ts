import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from	"@angular/router";

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { ChannelsComponent } from './media/channels/channels.component';

import { PartnerService } from './shared/partner.service';

import { AuthGuard } from './shared/auth.guard';

const	routes:	Routes	=	[
		//{path:	'',	redirectTo:	'channels',	pathMatch:	'full'},
    { path: '', component: ChannelsComponent, canActivate: [AuthGuard] },
		//{path:	'channels',	component:	ChannelsComponent, canActivate: [AuthGuard] },
    { path:	'channels',	component:	ChannelsComponent },
		{ path:	'login',	component:	LoginComponent },
		{ path:	'**',	redirectTo:	'channels',	pathMatch:	'full'}
    //{path:	'**',	component:	AppComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,

    ChannelsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    RouterModule.forRoot(routes, {useHash: false})
  ],
  providers: [
    PartnerService,
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
