import { Component, Input, Output, OnInit, EventEmitter, OnChanges  } from '@angular/core';

const PAGINATION_TEMPLATE = `
<div class="ui pagination menu">
    <li class="pagination-first page-item"
        *ngIf="boundaryLinks"
        [class.disabled]="noPrevious()||disabled">
      <a class="page-link" href (click)="selectPage(1, $event)">first</a>
    </li>
	
	<a class="icon item" *ngIf="directionLinks"  [class.disabled]="noPrevious()||disabled" href (click)="selectPage(page - 1, $event)">
		<i class="left chevron icon"></i>
	</a>
	
	<a class="item" *ngFor="let pg of pages"
		[class.active]="pg.active"
		[class.disabled]="disabled&&!pg.active"
		href (click)="selectPage(pg.number, $event)"
		[innerHTML]="pg.text"
	 >
	 </a>
	 
	 <a class="icon item" *ngIf="directionLinks" [class.disabled]="noNext()" href (click)="selectPage(page + 1, $event)">
		<i class="right chevron icon"></i>
	</a>


    <li class="pagination-last page-item"
        *ngIf="boundaryLinks"
        [class.disabled]="noNext()">
      <a class="page-link" href (click)="selectPage(totalPages, $event)">last</a></li>
</div>
  `;

@Component({
    selector: 'pagination',
    template: PAGINATION_TEMPLATE
})

export class PaginationComponent {
	@Input() page: number = 1;   
	@Input() totalItems: number = 100;
	@Input() itemsPerPage: number = 10;
	
	@Output() goToPage = new EventEmitter();
	
	private totalPages: number;
	private directionLinks: boolean = true;
	private boundaryLinks: boolean = false;	
	private rotate: boolean = false;
	private maxSize: number = 5;

   
	private pages:Array<any>;
   
	ngOnInit() {
		this.totalPages = this.calculateTotalPages();
		this.pages = this.getPages(this.page, this.totalPages);
    }

    ngOnChanges(changes: any) {
		this.totalPages = this.calculateTotalPages();
		this.pages = this.getPages(this.page, this.totalPages);
	}
	
	private makePage(number:number, text:string, isActive:boolean):{number: number, text: string, active: boolean} {
        return {
            number: number,
            text: text,
            active: isActive
        };
    }
	
	private getPages(currentPage:number, totalPages:number):Array<any> {
        let pages:any[] = [];

        // Default page limits
        let startPage = 1;
        let endPage = totalPages;
        let isMaxSized = typeof this.maxSize !== 'undefined' && this.maxSize < totalPages;

        // recompute if maxSize
        if (isMaxSized) {			
            if (this.rotate) {			
                // Current page is displayed in the middle of the visible ones
                startPage = Math.max(currentPage - Math.floor(this.maxSize / 2), 1);
                endPage = startPage + this.maxSize - 1;

                // Adjust if limit is exceeded
                if (endPage > totalPages) {
                    endPage = totalPages;
                    startPage = endPage - this.maxSize + 1;
                }
            } else {
                // Visible pages are paginated with maxSize
                startPage = ((Math.ceil(currentPage / this.maxSize) - 1) * this.maxSize) + 1;

                // Adjust last page if limit is exceeded
                endPage = Math.min(startPage + this.maxSize - 1, totalPages);
            }
        }
        
        // Add page number links
        for (var number = startPage; number <= endPage; number++) {
            let page = this.makePage(number, number.toString(), number === +currentPage);
            pages.push(page);
        }

        // Add links to move between page sets
        if (isMaxSized && !this.rotate) {
            if (startPage > 1) {
                let previousPageSet = this.makePage(startPage - 1, '...', false);
                pages.unshift(previousPageSet);
            }

            if (endPage < totalPages) {
                let nextPageSet = this.makePage(endPage + 1, '...', false);
                pages.push(nextPageSet);
            }
        }
        return pages;
    }
	
	private selectPage(page:number, event?:MouseEvent) {
        if (event) {
            event.preventDefault();
        }

        //if (!this.disabled) {
            if (event && event.target) {
                let target:any = event.target;
                target.blur();
            }
            this.writeValue(page);
            //this.cd.viewToModelUpdate(this.page);
			this.goToPage.emit(this.page);
        //}
    }
	
	writeValue(value:number) {
        this.page = value;
        this.pages = this.getPages(this.page, this.totalPages);
    }
	
	
	// base class
    private calculateTotalPages():number {
        let totalPages = this.itemsPerPage < 1 ? 1 : Math.ceil(this.totalItems / this.itemsPerPage);
        //console.log(this.totalItems + ' ' + this.itemsPerPage)
        return Math.max(totalPages || 0, 1);
    }
	
	private noNext():boolean {
        return this.page === this.totalPages;
    }
	
	private noPrevious():boolean {
        return this.page === 1;
    }

}
