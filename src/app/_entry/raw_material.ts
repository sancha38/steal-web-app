import { Component,OnInit, Input,Output ,EventEmitter} from '@angular/core';
import {ApiService} from '../_services/api.service';

//import {UtilService} from '../shared/utilservice'
import { RawMaterialImp} from '../_models'

import {FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms'



@Component({
  selector: 'rawitem',
  templateUrl: './raw_material.html',
  styleUrls: ['./common.css']
})
export class RawMaterial implements OnInit {
 uri = 'finishedproduct'
 entryform  = this.fb.group(
  {
    challan : new FormControl("",Validators.required),
    recdate : new FormControl("",Validators.required),
    material: ["",  [Validators.required, Validators.min(1)]],
    size:["", Validators.required],
    weight:["",Validators.required]
})

 
 materialist :Array<string> =[]
 size_map ={}
 sizedropdown =[]
 currentActiveRowid
  
 dataTosave:Array<RawMaterialImp>=[]
 disable:boolean = false;
 flag = false
 status = 'new'
 deletedItem :Array<RawMaterialImp> =[]
 
 constructor(private apiService:ApiService,private fb: FormBuilder){
  
 }
 getChallanNo(){
   this.apiService.getChallanNo('raw').subscribe(data=>{
     console.log(data)
     this.status = 'new'
     this.entryform.controls['challan'].setValue(data['challan_no'])
     this.disable = true
   })
 }
 ngOnInit(){  
this.getChallanNo();
this.apiService.getRawAll().subscribe(data =>{
    console.log(data);
    this.materialist = data['material']
    this.size_map = data['size_map']  
    this.sizedropdown = this.size_map[this.materialist[0]].sort(function(a, b){return Number(b)<Number(a)})
    this.entryform.controls['material'].setValue(this.materialist[0]);
    this.entryform.controls['size'].setValue(this.sizedropdown[0]);
});



 }

  action="add"
  populateSearchChallan(data){
    this.entryform.controls['challan'].setValue(data['challanNo']);
      this.dataTosave =data['records']
      this.status = "update"
  }

  onChange(e){
    console.log(e.target.value);
    this.sizedropdown = this.size_map[e.target.value].sort(function(a, b){return Number(b)<Number(a)})
    this.entryform.controls['size'].setValue(this.sizedropdown[0]);
    this.flag = false;
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
  add(){
    console.log("add")
    //let row = JSON.stringify(this.entryform.value)
    let row = new RawMaterialImp()
    row.challan = "RAW-"+this.entryform.get('challan').value
    let date = new Date();
    console.log(this.entryform.get('recdate').value)
    row.recdate = this.entryform.get('recdate').value
    row.material = this.entryform.get('material').value
    row.size = this.entryform.get('size').value
    row.weight = this.entryform.get('weight').value
    //row.txn = this.entryform.get('recdate').value
    row.status = 'new'
    this.dataTosave.push(row)
    this.refresh()

  }
  format_date(datejson){
    return datejson['day']+"-"+datejson['month']+"-"+datejson['year'];
  }
  refresh(){
    this.entryform.controls['material'].setValue(this.materialist[0]);
    this.entryform.controls['size'].setValue(this.sizedropdown[0]);
    this.entryform.controls['weight'].setValue(null);
    this.action="add"
  }
  reset(){
    this.getChallanNo();
    this.refresh();
    this.dataTosave=[]
    this.deletedItem=[]
  }

  update(){
    let row = this.dataTosave[this.currentActiveRowid]
    row.recdate = this.entryform.get('recdate').value
    row.material = this.entryform.get('material').value
    row.size = this.entryform.get('size').value
    row.weight = this.entryform.get('weight').value
    row.status = 'update'
    this.dataTosave[this.currentActiveRowid]=row
    this.refresh()
  }
  edit(indexOfelement){
    this.action="update"
    console.log("edit",indexOfelement)
    this.currentActiveRowid = indexOfelement
    let ele = this.dataTosave[indexOfelement]
    console.log("ele",ele)
    const challan = ele.challan.split("-")[1]
    this.sizedropdown = this.size_map[ele.material].sort(function(a, b){return Number(b)<Number(a)})
    this.entryform.setValue({
      challan:challan,
      recdate:ele.recdate,
      material:ele.material,
      size : ele.size,
      weight:ele.weight
    })
  }
  delete(indexOfelement){
      console.log("delete",indexOfelement)
      if (this.status == 'update'){
        this.deletedItem.push(this.dataTosave[indexOfelement])
      }      
      this.dataTosave.splice(indexOfelement, 1);
      
  }
  save(){
   
    let data = {
      status : this.status,
      data : this.dataTosave,
      delete: this.deletedItem
    }
    console.log(data)
    this.apiService.saveRaw(data).subscribe(e=>{
      console.log(e)
      this.reset();
      this.flag = true

    })
  }
  editChallan(){
    
  }
}