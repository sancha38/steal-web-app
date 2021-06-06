import { Component, OnInit,Input,OnDestroy,ViewChild,ChangeDetectorRef } from '@angular/core';
import {ApiService} from '../_services/api.service';

import { DataTableDirective } from 'angular-datatables';
import { Subject,Observable,forkJoin } from 'rxjs';

interface Columns{
  data: string, 
  title: string, 
  visible: boolean
}
const j = {
  1: "Raw Material",
  2: "Semi Finished Product",
  3: "Finished Product",
  4: "Sales"
}
@Component({
  selector: 'app-print-page',
  templateUrl: './print-page.component.html',
  styleUrls: ['./print-page.component.css'],
 
})
export class PrintPageComponent implements OnInit {
  @ViewChild(DataTableDirective) dtElement: DataTableDirective;

 
  dtRendered = true;
  dtOptions: any = {};
  dtInstance: Promise<DataTables.Api>;
  dtTrigger: Subject<any> = new Subject();

  repotTitle:string
  data=[]
  columns:Array<Columns>=[]
  @Input()  set searchParam (params){
        let reportType = params['reportType']   
        let fetch = params['lookfor']
        console.log("reportType====",reportType)
        console.log("fetch ==",fetch)
        if(fetch ==1){
            this.get_Stock_in_hand(reportType,fetch)
        }else{
          this.getTransactions(reportType,fetch,params['fromDate'],params['toDate'])
        }
        
        
  }
  get_Stock_in_hand(reportType,fetch){
    this.repotTitle = j[reportType]+" "+"Stock In hand Report"
    let option = this.apiserive.getOptions(reportType,fetch)
    let SIH=  this.apiserive.getSIH(reportType)

      forkJoin([option, SIH]).subscribe(results => {
        // results[0] is our character
        // results[1] is our character homeworld
        let options = results[0] ;
        let data = results[1];
        //console.log(options)
        this.columns = options
        //console.log(data)
        this.data=data['data']
        this.updateData()
      });
  }
  getTransactions(reportType,fetch,fromDate,toDate){
    
    this.repotTitle = j[reportType]+" "+"Stock In hand Report"
    let option = this.apiserive.getOptions(reportType,fetch)
    let transaction=  this.apiserive.getTransactionData(reportType,{fromDate:fromDate,toDate:toDate})
      forkJoin([option, transaction]).subscribe(results => {
        // results[0] is our character
        // results[1] is our character homeworld
        let options = results[0] ;
        let data = results[1];
        //console.log(options)
        this.columns = options
        //console.log(data)
        this.data=data['data']
        this.updateData()
      });
  }
  constructor(private apiserive:ApiService,
    public cdr: ChangeDetectorRef
  ) {}
 


  jsonData = {"data":[{"id":860,"firstName":"Superman","lastName":"Yoda"},{"id":870,"firstName":"Foo","lastName":"Whateveryournameis"},{"id":590,"firstName":"Toto","lastName":"Titi"}]};
  jsonData1 = {"data":[{"idx":860,"name":"Superman","last":"Yoda"},{"idx":870,"name":"Foo","last":"Whateveryournameis"}]};


  ngOnInit(): void {
    this.generateData();
  }

  ngOnChanges() {
    
  }

  generateData() {
    console.log("generateData")
    this.dtOptions = {
      data: [],
      columns: []
    };
  }

  updateData() {
    // destroy you current configuration
    console.log("updateData")
    this.dtRendered = false
    this.dtOptions = {
      
      columns: this.columns,
      destroy: true,
      searching: true,
      displayLength: 15,
      paginationType: "full_numbers",
      processing: true,
      dom: 'Bfrtip',
      buttons: [
          'copy', 'csv', 'pdf','excel', 
          {
            extend: 'print',
            title: this.repotTitle
        }
      ],
      responsive: true
  
    };
    // make sure your template notices it
    this.cdr.detectChanges();
    // initialize them again
    this.dtRendered = true
    this.cdr.detectChanges();
  }

   reRenderDataTable(): void {
    // this.dtElement.dtInstance.then((dtInstance: DataTables.Api) => {
      // Destroy the table first
      //  dtInstance.destroy();
      // Call the dtTrigger to rerender again
      //  this.dtTrigger.next();
    // });
  }


  format_date(col ,cell){
    if(col ==='recdate')
     return cell['day']+"-"+cell['month']+"-"+cell['year'];
    else
     return cell
  }
}