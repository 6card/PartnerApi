import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';

import { TransmissionService } from './shared/transmission.service';

import { FileSizePipe } from './pipes/file-size.pipe';
import { FileSpeedPipe } from './pipes/file-speed.pipe';
import { OrderByPipe } from './pipes/order-by.pipe';
import { FilterTorrentsPipe } from './pipes/filter.pipe';

@NgModule({
  declarations: [
    AppComponent,
    FileSizePipe,
    FileSpeedPipe,
    OrderByPipe,
    FilterTorrentsPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule
  ],
  providers: [TransmissionService],
  bootstrap: [AppComponent]
})
export class AppModule { }
