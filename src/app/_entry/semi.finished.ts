import { Component,OnInit, Input,Output ,EventEmitter} from '@angular/core';
import {ApiService} from '../_services/api.service';

//import {UtilService} from '../shared/utilservice'
import { SemiFinishedImpl,RawMaterialImp} from '../_models'

import {FormBuilder,FormGroup,FormControl, Validators} from '@angular/forms'



@Component({
  selector: 'semifinished',
  templateUrl: './semi_finished.html',
  styleUrls: ['./common.css']
})
export class SemiFinishedProduct implements OnInit {
 uri = 'semiFinishedProduct'
 entryform  = this.fb.group(
  {
    challan : new FormControl("",Validators.required),
    recdate : new FormControl("",Validators.required),
    product : new FormControl("",[Validators.required, Validators.min(1)]),
    
    size:new FormControl("", [Validators.required, Validators.min(1)]),
    
    qty :new FormControl("",Validators.required)
})

 
productlist :Array<string> =[]
 size_map ={}
 sizedropdown =[]
 currentActiveRowid
  
 dataTosave:Array<SemiFinishedImpl>=[]
 deletedItem :Array<SemiFinishedImpl> =[]

 disable:boolean = false;
 flag = false
 status = 'new'

 constructor(private apiService:ApiService,private fb: FormBuilder){
  
 }
 getChallanNo(){
   this.apiService.getChallanNo('semifinished').subscribe(data=>{
     console.log(data)
     this.deletedItem = []
     this.status = 'new'
     this.entryform.controls['challan'].setValue(data['challan_no'])
     this.disable = true
   })
 }
 ngOnInit(){  
this.getChallanNo();
this.apiService.getSemiFinishedAll().subscribe(data =>{
    console.log(data);    
    this.productlist = data['product']
    this.size_map = data['sizes']  
    this.sizedropdown = this.size_map[this.productlist[0]]
    this.entryform.controls['product'].setValue(this.productlist[0]);
    this.entryform.controls['size'].setValue(this.sizedropdown[0]);
    //this.onSizeChange(0);
});



 }

  
  action="add"
  

  onChange(e){
    console.log(e.target.value);
    this.sizedropdown = this.size_map[e.target.value].sort(function(a, b){return Number(b)<Number(a)})
    this.entryform.controls['size'].setValue(this.sizedropdown[0]);
    this.flag = false;
  }
  onSizeChange(obj:SemiFinishedImpl){
    let search={ 
        product: obj.product,
        size : obj.size
  }
    this.apiService.getRawCfg(search).subscribe(d=>{
        console.log(d)
        let rawMaterial = new RawMaterialImp()
        rawMaterial.material = d['raw']
        rawMaterial.size = d['raw_size']
        rawMaterial.weight = (obj.qty * d['weight_per_product']).toFixed(3)       
        rawMaterial.recdate = obj.recdate
        rawMaterial.challan = obj.challan
        rawMaterial.status = obj.status
        if(obj.status == 'update')
             rawMaterial.txn = obj.rawMaterial.txn
        obj.wastage = (((obj.qty * d['weight_per_product']) * d['wastage_in_percetage'])/100).toFixed(3)
        obj.rawMaterial = rawMaterial
        
    })
    return obj
}
  disbalef(){
    this.disable = true;
  }
  enablef(){
    this.disable =false;
  }
  submit(){
     if (this.action === 'add'){
       this.add()
     }
     else{
       this.update()
     }
  }
 
  format_date(datejson){
    return datejson['day']+"-"+datejson['month']+"-"+datejson['year'];
  }
  refresh(){
    this.entryform.controls['product'].setValue(this.productlist[0]);
    this.entryform.controls['size'].setValue(this.sizedropdown[0]);
    this.entryform.controls['qty'].setValue(null);
    this.action="add"
  }
  
  add(){
    console.log("add")
    //let row = JSON.stringify(this.entryform.value)
    let row = new SemiFinishedImpl()
    row.challan = "SEMI-"+this.entryform.get('challan').value
    let date = new Date();
    console.log(this.entryform.get('recdate').value)
    row.recdate = this.entryform.get('recdate').value
    row.product = this.entryform.get('product').value
    row.size = this.entryform.get('size').value
    row.qty = this.entryform.get('qty').value
    row.status = 'new'
    row = this.onSizeChange(row)
    this.dataTosave.push(row)
    this.refresh()
  
}

  edit(indexOfelement){
    this.action="update"
    console.log("edit",indexOfelement)
    this.currentActiveRowid = indexOfelement
    let ele = this.dataTosave[indexOfelement]
    console.log("ele",ele)
    this.sizedropdown = this.size_map[ele.product].sort(function(a, b){return Number(b)<Number(a)})
    const challan = ele.challan.split("-")[1]
    this.entryform.setValue({
      challan:challan,
      recdate:ele.recdate,
      product:ele.product,
      size : ele.size,
      qty:ele.qty
    })
  }
  update(){
    let row = this.dataTosave[this.currentActiveRowid]
    row.recdate = this.entryform.get('recdate').value
    row.product = this.entryform.get('product').value
    row.size = this.entryform.get('size').value
    row.qty = this.entryform.get('qty').value
    if(row.status !== 'new')
        row.status = 'update'
    this.dataTosave[this.currentActiveRowid]=row
    row = this.onSizeChange(row)
    this.dataTosave[this.currentActiveRowid] = row
    this.refresh()
  }

  delete(indexOfelement){
      console.log("delete",indexOfelement)
      let row = this.dataTosave[indexOfelement]
      if (row.status === 'update' || row.status === 'pristin'){
        this.deletedItem.push(row)
      }  
      this.dataTosave.splice(indexOfelement, 1);
  }
  save(){
    console.log(this.dataTosave)
    let data = {
      status : this.status,
      data : this.dataTosave,
      delete: this.deletedItem
    }
    console.log("data to save ===",data)
    this.apiService.saveSemiProduct(data).subscribe(e=>{
      console.log(e)
      this.reset();
      this.flag = true
    })
  }
  reset(){
    this.refresh();
    this.dataTosave=[]
    this.deletedItem=[]
    this.getChallanNo();      
  }
  populateSearchChallan(data){
    this.deletedItem = []
    this.entryform.controls['challan'].setValue(data['challanNo']);
    this.dataTosave =data['records']
    this.status = 'update' 
  }
  editChallan(){
    
  }
 
}