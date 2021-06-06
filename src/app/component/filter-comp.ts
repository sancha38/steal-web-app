import { FormBuilder, FormGroup , FormControl,Validators} from '@angular/forms';
import { Component, OnInit ,Output,EventEmitter} from '@angular/core';
import {ApiService} from '../_services/api.service';

import {NgbDate, NgbCalendar, NgbDateParserFormatter} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'filter-comp',
  templateUrl: './filter-comp.html',
  styleUrls: ['./common.css']
})
export class Filters implements OnInit{
  myForm:FormGroup;
  disabled = false;
  ShowFilter = false;
  limitSelection = false;
  inventory = [];
    showlist = []
  selectedItems = [];
  selectedsearch =[];
  dropdownSettings: any = {};
  reportTypes :any
  disableDate = true
  @Output() searchParam = new EventEmitter<any>();
  constructor(private apiService:ApiService,private fb: FormBuilder,private calendar: NgbCalendar) {}
  ngOnInit() {
     
    this.dropdownSettings = {
        singleSelection: true,
        idField: 'item_id',
        textField: 'item_text',
        itemsShowLimit: 2,
        allowSearchFilter: this.ShowFilter
    };
    let myDate = new Date();
    //myDate = this.datePipe.transform(myDate, 'yyyy-MM-dd');
    this.myForm = this.fb.group({
        trans: new FormControl("",[Validators.required]),
        searchBy :new FormControl("",[Validators.required]),
        fromDate:new FormControl(  this.calendar.getPrev(this.calendar.getToday(), 'd', 30)),
        toDate :new FormControl(this.calendar.getToday())
    });
    this.apiService.searchReportOptions().subscribe(data=>{
        console.log("data=======================")
      this.showlist= data['options_search1']
      console.log("this.showlist ",this.showlist)
      console.log(this.showlist[0])
      this.myForm.controls['searchBy'].setValue(this.showlist[0]);
      this.reportTypes = data['reportType']
      this.inventory = this.reportTypes['1']
    })
  
}

onItemSelect(item: any) {
   
    console.log('onItemSelect', item.item_id);
    if (item.item_id === 1)
      this.disableDate = true;
    else
        this.disableDate = false;
    this.inventory = this.reportTypes[item.item_id]
}
onSelectAll(items: any) {
    console.log('onSelectAll', items);
}
toogleShowFilter() {
    this.ShowFilter = !this.ShowFilter;
    this.dropdownSettings = Object.assign({}, this.dropdownSettings, { allowSearchFilter: this.ShowFilter });
}

handleLimitSelection() {
    if (this.limitSelection) {
        this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: 2 });
    } else {
        this.dropdownSettings = Object.assign({}, this.dropdownSettings, { limitSelection: null });
    }
}
submit(){
    let lookfor = (this.myForm.get('searchBy').value)[0]['item_id']
    let reportType = (this.myForm.get('trans').value)[0]['item_id']
    let fromDate = this.myForm.get('fromDate').value
    let toDate = this.myForm.get("toDate").value
    
  this.searchParam.emit({lookfor,reportType,fromDate,toDate})
}
printPage(){
    window.print();
}
}