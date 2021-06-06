import { FormBuilder, FormGroup , FormControl,Validators} from '@angular/forms';

    import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'reports',
  templateUrl: './reports.html',
  styleUrls: ['./common.css']
})
export class Reports implements OnInit{
  searchParam
  constructor(private fb: FormBuilder) {}
  ngOnInit() {
      
   
}
generateReport(events){

 this.searchParam = events
}

}