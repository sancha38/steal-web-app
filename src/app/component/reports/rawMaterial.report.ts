import { Component, OnInit, Input,OnDestroy,ViewChild,ChangeDetectorRef } from '@angular/core';
import {ApiService} from '../../_services/api.service';
import { DataTableDirective } from 'angular-datatables';
import { Subject } from 'rxjs';
@Component({
  selector: 'show-records',
  templateUrl: './rawMaterial.report.html'
})
export class RawMaterialReport implements OnInit,OnDestroy{
  title = 'angulardatatables';


  @ViewChild(DataTableDirective)
  dtElement: DataTableDirective;

  dtOptions: any= {};
  dtTrigger:Subject<any>= new Subject();
  dtRendered = true;
  //dtInstance: Promise<DataTables.Api>;

  @Input()  columns
  @Input() recrods
 
  constructor(private apiserive:ApiService,private cdRef: ChangeDetectorRef) {
    
  }
  
  
 
  ngOnInit() {
    console.log("recrods================",this.recrods)
    console.log("options ================",this.dtOptions)
  }   

  
    generateData() {
      this.dtOptions = {
        data: this.recrods,
        columns: this.columns,
        destroy: true,
        searching: false,
        displayLength: 15,
        paginationType: "full_numbers",
        processing: true,
        dom: 'Bfrtip',
        buttons: [
            'copy', 'csv', 'excel', 'print'
        ],
        responsive: true
      };
      console.log("dtoptions ", this.dtOptions)
    }
    updateData() {
      // destroy you current configuration
      this.dtRendered = false
      this.generateData()
      // make sure your template notices it
      this.cdRef.detectChanges();
      // initialize them again
      this.dtRendered = true
      this.cdRef.detectChanges();
    }
    ngAfterViewInit(): void {
      console.log("ngAfterViewInit")
     // this.dtTrigger.next();
    }
  
    ngOnDestroy(): void {
      // Do not forget to unsubscribe the event
      this.dtTrigger.unsubscribe();
    }
  
    rerender(): void {
      console.log("rerender")
      this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
        // Destroy the table first
        dtInstance.destroy();
        // Call the dtTrigger to rerender again
        this.dtTrigger.next();
      });
    }
    
}

