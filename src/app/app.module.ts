import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { Routes, RouterModule } from	"@angular/router";

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

import { ChannelsComponent } from './media/channels/channels.component';

import { PartnerService } from './shared/partner.service';

const	routes:	Routes	=	[
		{path:	'',	redirectTo:	'channels',	pathMatch:	'full'},
		{path:	'channels',	component:	ChannelsComponent},
		{path:	'login',	component:	LoginComponent},
		{path:	'**',	redirectTo:	'channels',	pathMatch:	'full'}
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
    HttpModule,
    RouterModule.forRoot(routes, {useHash: false})
  ],
  providers: [PartnerService],
  bootstrap: [AppComponent]
})
export class AppModule { }
