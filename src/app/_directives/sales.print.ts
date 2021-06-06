import {Component,ViewChild,Input,Output,EventEmitter} from '@angular/core';

import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import {ApiService} from '../_services/api.service'
@Component({
  selector: 'print-challan',
  templateUrl: './sales.print.html',
  styleUrls: ['./sales.css']
})
export class SalesPrint {
@Input() name;
@Input() vehicleNumber;
@Input() challanNo;
@Input() itemList;
@Input() receiptDate;

}