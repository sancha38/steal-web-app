import { Component,OnInit} from '@angular/core';
import {ApiService} from '../_services/api.service';
//import {UtilService} from '../shared/utilservice'
import {FinishedProductImpl,SemiFinishedImpl, RawMaterialImp} from '../_models'
import {FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms'



@Component({
  selector: 'finishedItem',
  templateUrl: './finished_material.html',
  styleUrls: ['./common.css']
})
export class FinishedMaterial implements OnInit {

    uri = 'finishedproduct'
    status = 'new'
    disable = true
    productlist :Array<string> =[]
    size_map ={}
    sizedropdown =[]
    currentActiveRowid
    action="add"
    flag =false
    dataTosave:Array<FinishedProductImpl>=[]
    deletedItem :Array<FinishedProductImpl> =[]
    


    constructor(private apiService:ApiService,private fb: FormBuilder){}
    entryform  = this.fb.group(
      {
        challan : new FormControl("",Validators.required),
        recdate : new FormControl("",Validators.required),
        product : new FormControl("",[Validators.required, Validators.min(1)]),
        size:new FormControl("", [Validators.required, Validators.min(1)]),
        qty :new FormControl("",Validators.required)
    })

    
    ngOnInit(){
      this.getChallanNo()
      this.apiService.getFinishedlist().subscribe(
        data=>{
          this.productlist = data['product'].sort()
          this.size_map = data['sizes']
          this.sizedropdown = this.size_map[this.productlist[0]].sort(function(a, b){return Number(b)<Number(a)})
          this.entryform.controls['product'].setValue(this.productlist[0]);
          this.entryform.controls['size'].setValue(this.sizedropdown[0]);
        }
      )
    }
    getChallanNo(){
      this.apiService.getChallanNo('finishprod').subscribe(data=>{
      
        this.status = 'new'
        this.entryform.controls['challan'].setValue(data['challan_no'])
        this.disable = true
        this.flag = false
      })
    }
    
    onChange(e){
    this.sizedropdown = this.size_map[e.target.value].sort(function(a, b){return Number(b)<Number(a)})
    this.entryform.controls['size'].setValue(this.sizedropdown[0]);
    //this.flag = false;
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
      let row = new FinishedProductImpl()
      row.challan = "FINIS-"+this.entryform.get('challan').value
      row.size = this.entryform.get('size').value
      row.product=this.entryform.get('product').value
      row.stock= this.entryform.get('qty').value
      row.recdate = this.entryform.get('recdate').value
      row.status = 'new'
      row = this.populate_weight_stock(row)
      this.dataTosave.push(row)
      this.refresh()
    }
    update(){
      let row = this.dataTosave[this.currentActiveRowid]
      row.size = this.entryform.get('size').value
      row.product=this.entryform.get('product').value
      row.stock= this.entryform.get('qty').value
      row.recdate = this.entryform.get('recdate').value
      if (row.status !== 'new')
          row.status = 'update'
      this.populate_weight_stock(row)
      this.dataTosave[this.currentActiveRowid] =row
      this.refresh()
    }
    refresh(){
      this.entryform.controls['product'].setValue(this.productlist[0]);
      this.sizedropdown = this.size_map[this.productlist[0]].sort(function(a, b){return Number(b)<Number(a)})
      this.entryform.controls['size'].setValue(this.sizedropdown[0]);
      this.entryform.controls['qty'].setValue(null);
      this.action="add"
    }
    reset(){
      this.getChallanNo();
      this.refresh();
      this.dataTosave=[]
      this.deletedItem=[]
    }
    populate_weight_stock(obj:FinishedProductImpl){
      let search={ 
          product: obj.product,
          size : obj.size
    }
      this.apiService.getFinishedPrdCfg(search).subscribe(d=>{
     
          let stock = d['stock']
          let cosumed_semi_prod = d['consumed_semi_product']
          let cosumed_raw = d['consumed_raw_material']
          
          obj.semiProdList =[]
          obj.rawMaterialList =[]
          
          cosumed_semi_prod.forEach(element => {
            let semi = new SemiFinishedImpl()
            semi.product = element['product']
            semi.size = element['size']
            semi.qty = obj.stock
            semi.recdate = obj.recdate
            semi.challan = obj.challan
            semi.status = obj.status
            obj.semiProdList.push(semi)
          });
          
          cosumed_raw.forEach(element=>{
            let raw = new RawMaterialImp()
            raw.material = element['material']
            raw.size = element['size']
            raw.recdate = obj.recdate
            raw.challan = obj.challan
            raw.status = obj.status
            raw.weight = (obj.stock * element['weight_per_product'] /100).toFixed(3)
            obj.rawMaterialList.push(raw)
          })
          
       
          //this.refresh()
      })
      return obj
  }
  format_date(datejson){
    return datejson['day']+"-"+datejson['month']+"-"+datejson['year'];
  }
  save(){
    //console.log(this.dataTosave)
    let data = {
      status : this.status,
      data : this.dataTosave,
      delete : this.deletedItem
    }
    this.apiService.saveProducttxn(data).subscribe(e=>{
   
      this.flag = true
      this.reset();
      
    })
  }
  populateSearchChallan(data){
    this.entryform.controls['challan'].setValue(data['challanNo']);
      this.dataTosave =data['records']
      this.status = 'update'
      console.log(this.dataTosave)
  }
  editChallan(){
    
  }
  searchChallan(prefix){
    
  }
  edit(itemID){
      this.currentActiveRowid = itemID
      let row = this.dataTosave[itemID]
      this.action = 'update'
      let challan = row.challan.split("-")[1]

      this.sizedropdown = this.size_map[row.product].sort(function(a, b){return Number(b)<Number(a)})
      this.entryform.setValue({
        challan:challan,
        recdate:row.recdate,
        product:row.product,
        size : row.size,
        qty:row.stock
      })
  }
  delete(itenId){
      let row = this.dataTosave[itenId]
      console.log(row.status)
      if (row.status === 'update'|| row.status === 'pristine'){
        this.deletedItem.push(this.dataTosave[itenId])
      }      
      this.dataTosave.splice(itenId, 1);
  }
}

 

