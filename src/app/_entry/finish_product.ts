import { Component,OnInit} from '@angular/core';
import {ApiService} from '../_services/api.service';
//import {UtilService} from '../shared/utilservice'
import {FinishedProductImpl,SemiFinishedImpl, RawMaterialImp} from '../_models'
import {FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms'



@Component({
  selector: 'finish-entry',
  templateUrl: './finish_product.html',
  styleUrls: ['./common.css']
})
export class Finish_Product_Entry implements OnInit {
 constructor(){}
 industry1 = false
 industry2 =false
 ngOnInit(){
    let industry = localStorage.getItem('userRole');
    if(industry ==="industry2"){
        this.industry2 = true
    }else{
        this.industry1 = true
    }
 }
}