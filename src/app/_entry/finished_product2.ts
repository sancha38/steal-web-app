import { Component,OnInit} from '@angular/core';
import {ApiService} from '../_services/api.service';
//import {UtilService} from '../shared/utilservice'
import {FinishedProductImpl,SemiFinishedImpl, RawMaterialImp} from '../_models'
import {FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms'



@Component({
  selector: 'finish-in2',
  templateUrl: './finished_product2.html',
  styleUrls: ['./common.css']
})
export class FinishedProductIN2 implements OnInit {

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
    rawmaterial_list =[]
    mundiszes = []
    uppersizes = []
    bottomsizes =[]
    w_per_product_map ={}
    deletedItem :Array<FinishedProductImpl>=[]
    constructor(private apiService:ApiService,private fb: FormBuilder){}
    entryform  = this.fb.group(
      {
        challan : new FormControl("",Validators.required),
        recdate : new FormControl("",Validators.required),
        product : new FormControl("",[Validators.required, Validators.min(1)]),
        qty :new FormControl("",Validators.required),
        rawMundi : new FormControl("",Validators.required),
        rawMundiSize : new FormControl("",Validators.required),
        rawUppara: new FormControl("",Validators.required),
        rawUpparaSize:new FormControl("",Validators.required),
        rawBottom: new FormControl("",Validators.required),
        rawBottomSize:new FormControl("",Validators.required)
    })

    
    ngOnInit(){
      this.getChallanNo()
      this.apiService.getFinishedlist().subscribe(
        data=>{
          this.productlist = data['product'].sort()
          let raw = data['raw']
          this.size_map = raw['size_map']
          this.rawmaterial_list = raw['material']
          this.w_per_product_map = raw['w/p']
          this.entryform.controls['product'].setValue(this.productlist[0]);
          this.mundiszes = this.size_map[this.rawmaterial_list[0]].sort(function(a, b){return Number(b)<Number(a)})
          this.uppersizes = this.size_map[this.rawmaterial_list[0]].sort(function(a, b){return Number(b)<Number(a)})
          this.bottomsizes = this.size_map[this.rawmaterial_list[0]].sort(function(a, b){return Number(b)<Number(a)})
          this.entryform.controls['rawMundi'].setValue(this.rawmaterial_list[0]);
          this.entryform.controls['rawMundiSize'].setValue(this.mundiszes[0]);
          this.entryform.controls['rawUppara'].setValue(this.rawmaterial_list[0]);
          this.entryform.controls['rawUpparaSize'].setValue(this.uppersizes[0]);
          this.entryform.controls['rawBottom'].setValue(this.rawmaterial_list[0]);
          this.entryform.controls['rawBottomSize'].setValue(this.bottomsizes[0]);
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
    
    onChangeMundi(e){
    this.mundiszes = this.size_map[e.target.value].sort(function(a, b){return Number(b)<Number(a)})
    this.entryform.controls['rawMundiSize'].setValue(this.mundiszes[0]);
    //this.entryform.controls['size'].setValue(this.sizedropdown[0]);
    //this.flag = false;
    }
    onChangeUppera(e){
      this.uppersizes = this.size_map[e.target.value].sort(function(a, b){return Number(b)<Number(a)})
      this.entryform.controls['rawUpparaSize'].setValue(this.uppersizes[0]);
      //this.flag = false;
      }
      onChangeBottom(e){
        this.bottomsizes = this.size_map[e.target.value].sort(function(a, b){return Number(b)<Number(a)})
        this.entryform.controls['rawBottomSize'].setValue(this.bottomsizes[0]);
        //this.flag = false;
        }
    submit(){
      
      
      if (this.action === 'add'){    
        const row = this.add()   
        this.dataTosave.push(row)
     }else{
       const row = this.update(this.dataTosave[this.currentActiveRowid])
       console.log("row====",row)
       this.dataTosave[this.currentActiveRowid]=row
     }
     
      this.refresh()
    }
    add(){
      
      let row = new FinishedProductImpl()
      row.challan = "FINIS-"+this.entryform.get('challan').value
      row.product=this.entryform.get('product').value
      row.stock= this.entryform.get('qty').value
      row.recdate = this.entryform.get('recdate').value
      row.status = 'new'
      row.size ='N/A'
      
      let rawList = ['Mundi','Uppara','Bottom']
      rawList.forEach(e=>{
        let rawconsumed = new RawMaterialImp()
        this.populate_weight_stock(row,rawconsumed,e,this.entryform.get('raw'+e).value,this.entryform.get('raw'+e+'Size').value)
        row.rawMaterialList.push(rawconsumed)
      })    
    
      return row
     
    }
    update(row:FinishedProductImpl){
      row.product = this.entryform.get('product').value
      row.stock = this.entryform.get('qty').value
      row.recdate = this.entryform.get('recdate').value
      if (row.status ==='pristine')
          row.status = 'update'

      row.rawMaterialList.forEach((e,index)=>{
        const prefix = e.material.split(" ")[0]
        let key = 'raw'+prefix
        let keysize = 'raw'+prefix+'Size'
        e=this.populate_weight_stock(row,e,prefix,this.entryform.get(key).value,this.entryform.get(keysize).value)
        
        row.rawMaterialList[index]=e
      })
      return row
    }
    refresh(){
      this.entryform.controls['product'].setValue(this.productlist[0]);
      this.entryform.controls['qty'].setValue(null);
      this.mundiszes = this.size_map[this.rawmaterial_list[0]]
      this.uppersizes = this.size_map[this.rawmaterial_list[0]]
      this.bottomsizes = this.size_map[this.rawmaterial_list[0]]
      this.entryform.controls['rawMundi'].setValue(this.rawmaterial_list[0]);
      this.entryform.controls['rawMundiSize'].setValue(this.mundiszes[0]);
      this.entryform.controls['rawUppara'].setValue(this.rawmaterial_list[0]);
      this.entryform.controls['rawUpparaSize'].setValue(this.uppersizes[0]);
      this.entryform.controls['rawBottom'].setValue(this.rawmaterial_list[0]);
      this.entryform.controls['rawBottomSize'].setValue(this.bottomsizes[0]);
      this.action="add"
    }
    reset(){
      this.getChallanNo();
      this.refresh();
      this.dataTosave=[]
      this.deletedItem=[]
    }
    populate_weight_stock(obj:FinishedProductImpl,rawconsumed:RawMaterialImp,prefix,raw,size){
         
         rawconsumed.material = prefix+" "+raw
         rawconsumed.size = size
         rawconsumed.recdate = obj.recdate
         rawconsumed.challan = obj.challan
         rawconsumed.status = obj.status
         let key = raw+"-"+parseFloat(size)
         console.log(key)

         console.log(this.w_per_product_map)

         console.log(this.w_per_product_map[key])
         console.log("obj.stock== ",obj.stock)
         rawconsumed.weight = (obj.stock * this.w_per_product_map[key]).toFixed(3)
         return rawconsumed
      
  }
  format_date(datejson){
    return datejson['day']+"-"+datejson['month']+"-"+datejson['year'];
  }
  save(){
    //console.log(this.dataTosave)
    let data = {
      status : this.status,
      data : this.dataTosave,
      delete:this.deletedItem
    }
    this.apiService.saveProducttxn(data).subscribe(e=>{
   
      this.flag = true
      this.reset();
      
    })
  }
  populateSearchChallan(data){
    this.entryform.controls['challan'].setValue(data['challanNo']);
      this.dataTosave =data['records']
      console.log(this.dataTosave)
      this.status = "update"
  }
  editChallan(){
    
  }
  searchChallan(prefix){
    
  }
  edit(itemID){
    this.action="update"
    this.currentActiveRowid = itemID
      let row = this.dataTosave[itemID]
      let challanS = row.challan.split("-");
      console.log(challanS)
      this.entryform.controls['challan'].setValue(challanS[1]);
      this.entryform.controls['product'].setValue(row.product);
      this.entryform.controls['recdate'].setValue(row.recdate);
      this.entryform.controls['qty'].setValue(row.stock)
      row.rawMaterialList.forEach(e=>{
        const s = e.material.split(" ")
        console.log("s===",s)
        this.setRawMaterialinput(s[0],s[1],e.size)
      })
  }
  setRawMaterialinput(prefix,materialName,size){
      const key = 'raw'+prefix
      const keysize = 'raw'+prefix+'Size'
      if (prefix ==='Mundi')
          this.mundiszes = this.size_map[materialName].sort(function(a, b){return Number(b)<Number(a)})
      else if (prefix ==='Uppara')
          this.uppersizes = this.size_map[materialName].sort(function(a, b){return Number(b)<Number(a)})
      else if (prefix ==='Bottom')
            this.bottomsizes = this.size_map[materialName].sort(function(a, b){return Number(b)<Number(a)})
      console.log(key,"==",keysize,"===",materialName,"==",size)
      this.entryform.controls[key].setValue(materialName);
      this.entryform.controls[keysize].setValue(size)

  }
  delete(itenId){
    console.log("delete",itenId)
    let row = this.dataTosave[itenId]
    if (row.status === 'update' || row.status ==='pristine'){
      this.deletedItem.push(this.dataTosave[itenId])
    }      
    this.dataTosave.splice(itenId, 1);
  }
}

 

