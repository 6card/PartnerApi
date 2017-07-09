import { Component, OnInit, AfterViewChecked  } from '@angular/core';
import { TransmissionService } from './shared/transmission.service';
import { Remote } from './shared/remote';
import { Torrent } from './shared/torrent';

import { FileSizePipe } from './pipes/file-size.pipe'; // import our pipe here
import { FileSpeedPipe } from './pipes/file-speed.pipe';
import { OrderByPipe } from './pipes/order-by.pipe'; // import our pipe here
import { FilterTorrentsPipe } from './pipes/filter.pipe';

import {Observable} from 'rxjs/Rx';

import '../assets/css/styles.css';
import '../assets/css/semantic.min.css';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit, AfterViewChecked  {

    xSessionId: string;
    remote: Remote;
    torrents: Torrent[] = [];
    sort: string  = '-addedDate';
    filter: number = null;
    selectedTorrents: number[] = [];

    constructor(private transmissionService:TransmissionService) { 
        setInterval(() => { this.getTorrents(true); }, 5000);
    }
 
    ngOnInit(){
        this.getSession();
        setTimeout(()=>{
            this.getTorrents();
        },2000);
        
        /*
        do {
            setTimeout (() => {
                this.getSession();
            }, 1000)
        }
        while (!this.xSessionId);

        
        let timer = Observable.timer(2000, 10000);
        timer.subscribe(() => );
        */
    }
    ngAfterViewChecked() { 
        //$('.ui.progress').progress();
    }
    getAllCount() {
        return this.torrents.length;
    }

    getDownloadingCount() {
        return this.getCountByFilter(this.torrents, Torrent.STATUS_DOWNLOAD);
    }

    getSeedingCount() {
        return this.getCountByFilter(this.torrents, Torrent.STATUS_SEED);
    }
 
    getFinishedCount() {
        return this.getCountByFilter(this.torrents, Torrent.STATUS_SEED);
    }
    getPausedCount() {
        return this.getCountByFilter(this.torrents, Torrent.STATUS_STOPPED);
    }

    getCountByFilter(torrents: Torrent[], status: number) {
        return torrents.filter( x => x['status'] == status).length;
    }

    sortBy(sort: string) {
        if (this.sort == sort) {
            this.sort = '-' + sort;
        }
        else {
            this.sort = sort;
        }
        console.log(this.sort);
    }

    getSortingClass(sort: string) {
        let desc = this.sort.substr(0,1) == '-';
        let sortName = this.sort;
        if (desc)
            sortName = this.sort.substr(1);
        if (sort == sortName) {
            if (desc)
                return ['sorted', 'descending'];
            else
                return ['sorted', 'ascending'];
        }
        else
            return false;
    }

    setFilter(filterId: number) {
        this.filter = filterId;
        this.clearSelectedTorrents();
    }

    getFilterClass(filterId: number) {        
        if (this.filter == filterId)   
            return ['active'];
        else
            return false;        
    }

    selectTorrent(torrent: Torrent, event: any) {
        let torrentId: number = torrent['id'];
        if(event.ctrlKey) {
            if (this.selectedTorrents.find(x => x == torrentId)) {
                let index = this.selectedTorrents.indexOf(torrentId);
                this.selectedTorrents.splice(index, 1);
            }
            else
                this.selectedTorrents.push(torrentId);
        } else {
            this.selectedTorrents = [torrentId];
        }
    }
    getSelectedTorrentClass(torrent: Torrent) {
        let torrentId: number = torrent['id'];
        if (this.selectedTorrents.filter(x => x === torrentId).length)
            return ['active'];
        else
            return false;
    }

    getSession() {
        this.transmissionService.getSessionId(this.xSessionId)
        .subscribe( data => {
            this.remote = data.arguments;
            //console.log(this.remote);
        }, (err) => {
            if (err.status == 409) {
                if (this.xSessionId = err.headers.get('X-Transmission-Session-Id')) {
                    console.log('Session get DONE ' + this.xSessionId);
                }
                else {
                    console.error('Get X-Transmission-Session-Id ERROR');
                }
            }
        }, () => { // <----
            console.log('Session get');
        });
    }

    getTorrents(recently: boolean = false) {
        let torrent: Torrent;
        let removedIds: Array<number>;        
        
        if (!this.xSessionId) 
            this.getSession();

        let callable = this.transmissionService.getTorrents(this.xSessionId);
        if (recently)
            callable = this.transmissionService.getRecentlyActiveTorrents(this.xSessionId);

        callable.subscribe( data => {  
            if (removedIds = data.arguments.removed) {
                removedIds.map(
                    torrentId => this.removeTorrentById(torrentId)
                );
            }
            data.arguments.torrents.map((item: any) => {                    
                if (torrent = this.torrents.find(x => x['id'] == item['id'])) {
                    torrent.update(item);
                }
                else {
                    this.torrents.push(new Torrent(item));
                }
            });
            
        }, (err) => {
            //this.xSessionId = '';
            console.error('Get Torrents ERROR');
        }, () => { // <----
            console.log('Torrents get');
        });           
    
    }

    stopTorrents() {
        this.transmissionService.stopTorrents(this.xSessionId, this.selectedTorrents)
        .subscribe( data => {
            console.log('Stop Torrents ' + data.result);
        }, (err) => {
            console.error('Stop Torrents ERROR');
        }, () => { // <----
            //console.log('Torrents get');
        });
        this.getTorrents();
    }

    startTorrents() {
        this.transmissionService.startTorrents(this.xSessionId, this.selectedTorrents)
        .subscribe( data => {
            console.log('Start Torrents ' + data.result);
        }, (err) => {
            console.error('Stop Torrents ERROR');
        }, () => { // <----
            //console.log('Torrents get');
        });
        this.getTorrents();
        
    }

    removeTorrentById(torrentId: number) {
        this.torrents = this.torrents.filter(item => item['id'] !== torrentId);
    }

    clearSelectedTorrents() {
        this.selectedTorrents = [];
    }

    deleteTorrents() {
        let deleteData: boolean = false;
        if(confirm("Delete torrent(s) with data?")) {
            deleteData = true;
        }
        this.transmissionService.deleteTorrents(this.xSessionId, this.selectedTorrents, deleteData)
        .subscribe( data => {
            console.log('Delete Torrents ' + data.result);
            /*
            if (data.result == 'success') {
                for (var v in this.selectedTorrents) // for acts as a foreach  
                {  
                    this.removeTorrentById(this.selectedTorrents[v]);  
                }
                this.clearSelectedTorrents(); 
            }
            */
        }, (err) => {
            console.error('Delete Torrents ERROR');
        }, () => { // <----
            //console.log('Torrents get');
        });
        this.getTorrents();
    }
}