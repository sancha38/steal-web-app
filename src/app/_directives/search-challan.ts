import {Component,ViewChild,Input,Output,EventEmitter} from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../_services/api.service'
@Component({
  selector: 'search-challan',
  templateUrl: './search-challan.html'
})
export class SearchChalanModal {
  closeResult = '';
  @ViewChild('content') seleactor; 

  constructor(private modalService: NgbModal,private apiService:ApiService) {}
  @Input() prefix
  @Output() searchResult = new EventEmitter<any>()
  searchModel
  message
  open() {
    this.message=""
    this.searchModel =this.modalService.open(this.seleactor, {centered: true ,backdrop: 'static',keyboard: false,ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  searchChallan(challanNo){
    this.message=""
    console.log("challanNo ",challanNo.value)
    challanNo= challanNo.value
    console.log("split",this.prefix.split("-"))  
    let type = this.prefix.split("-")[0]
    
    if(challanNo){
      
      this.apiService.searchChallan(type,this.prefix+challanNo).subscribe(records=>{
          console.log("return data",records)
          if(records && typeof records !== 'undefined' && records.length > 0){
            console.log("return data",records)
            this.searchResult.emit({challanNo,records})
            this.modalService.dismissAll('on save')
          }else{
              this.message =this.prefix+challanNo+" not available."
          }
          //this.dataTosave = data
          //this.disable = true
          
      })
    }else{
      this.message =" Please enter challan number"
     
    }
    
  }
}