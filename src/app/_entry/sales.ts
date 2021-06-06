import { Component,OnInit} from '@angular/core';
import {ApiService} from '../_services/api.service';
import {FormBuilder,FormGroup,FormControl,Validators} from '@angular/forms'
import {FinishedProductImpl,Sales} from '../_models'



@Component({
  selector: 'sales',
  templateUrl: './sales.html',
  styleUrls: ['./common.css']
})
export class SalesCompoent implements OnInit {
   
  status = 'new'
  disable = true
  productlist :Array<string> =[]
  size_map ={}
  sizedropdown =[]
  currentActiveRowid
  action="add"
  flag = false
  dataTosave:Array<Sales>=[]
  deletedItem:Array<Sales> =[]
  hidesize:boolean = false
  constructor(private apiService:ApiService,private fb: FormBuilder){}
  vehicleNumber="";
  name="";
  challan=0;
  receiptDate;
  entryform  = this.fb.group(
    {
      challan : new FormControl("",Validators.required),
      recdate : new FormControl("",Validators.required),
      product : new FormControl("",[Validators.required, Validators.min(1)]),
      size:new FormControl("", [Validators.required, Validators.min(1)]),
      qty :new FormControl("",Validators.required),
      vehicleNumber: new FormControl(this.vehicleNumber,Validators.required),
      description: new FormControl(this.name,Validators.required)
  })
  
  ngOnInit(){
    this.getChallanNo()
    let industry = localStorage.getItem('userRole');
    if(industry ==="industry1"){
      this.hidesize = true
    }
    console.log("this.hidesize==",this.hidesize)
    this.apiService.getFinishedlist().subscribe(
      data=>{
        this.productlist = data['product'].sort()
          
        console.log(this.hidesize)
        this.entryform.controls['product'].setValue(this.productlist[0]);
        if (this.hidesize){
          this.entryform.controls['size'].setValue('N/A');
        }
        else{
          this.size_map = data['sizes']
          this.sizedropdown = this.size_map[this.productlist[0]].sort(function(a, b){return Number(b)<Number(a)})
          this.entryform.controls['size'].setValue(this.sizedropdown[0]);
        }
          
      }
    )
  }
  getChallanNo(){
    this.apiService.getChallanNo('sales').subscribe(data=>{
    
      this.status = 'new'
      this.entryform.controls['challan'].setValue(data['challan_no'])
      this.challan=data['challan_no']
      this.disable = true
    })
  }
  onChange(e){
   
    this.sizedropdown = this.size_map[e.target.value].sort(function(a, b){return Number(b)<Number(a)})
    this.entryform.controls['size'].setValue(this.sizedropdown[0]);
    //this.flag = false;
    }

    refresh(){
      this.entryform.controls['product'].setValue(this.productlist[0]);
      if(!this.hidesize){        
      this.sizedropdown = this.size_map[this.productlist[0]]
      this.entryform.controls['size'].setValue(this.sizedropdown[0]);
      }
      this.entryform.controls['qty'].setValue(null);
      this.action="add"
     }
     doaction(){
      if (this.action === 'add'){
        this.add()
      }
      else{
        this.update()
      }
      this.refresh()
    }
     add(){
       let row =new Sales()
       row.challan = "SALE-"+this.entryform.get('challan').value
      row.size = this.entryform.get('size').value
      row.product=this.entryform.get('product').value
      row.stock= this.entryform.get('qty').value
      row.recdate = this.entryform.get('recdate').value
      this.vehicleNumber =  this.entryform.get('vehicleNumber').value
      this.name=this.entryform.get('description').value
      this.receiptDate=this.entryform.get('recdate').value
      row.vehicleNumber=this.entryform.get('vehicleNumber').value
      row.description = this.entryform.get('description').value
      row.status = 'new'
      this.dataTosave.push(row)

     }
     update(){
      let row = this.dataTosave[this.currentActiveRowid]
      row.size = this.entryform.get('size').value
      row.product=this.entryform.get('product').value
      row.stock= this.entryform.get('qty').value
      row.recdate = this.entryform.get('recdate').value
      row.vehicleNumber= this.entryform.get('vehicleNumber').value
      row.description=this.entryform.get('description').value

      this.receiptDate=this.entryform.get('recdate').value
      this.vehicleNumber =  this.entryform.get('vehicleNumber').value
      this.name=this.entryform.get('description').value

      if (row.status !== 'new')
          row.status = 'update'
      
      this.dataTosave[this.currentActiveRowid]=row
     }
     format_date(datejson){
      return datejson['day']+"-"+datejson['month']+"-"+datejson['year'];
    }
     save(){
      
      let data = {
        status : this.status,
        data : this.dataTosave,
        delete:this.deletedItem
      }
         this.apiService.saveSales(data).subscribe(e=>{
            console.log(e)
            this.reset();
            this.flag = true
          });
     }
     reset(){
      this.refresh();
      
      this.entryform.controls['vehicleNumber'].setValue(null);
      this.entryform.controls['description'].setValue(null);
      this.dataTosave=[]
      this.deletedItem=[]
      this.getChallanNo();      
    }
     populateSearchChallan(data){
      this.entryform.controls['challan'].setValue(data['challanNo']);
      
      this.challan=data['challanNo']
        this.dataTosave =data['records']
        console.log( this.dataTosave[0])
        this.vehicleNumber= this.dataTosave[0].vehicleNumber;
        this.name=this.dataTosave[0].description;
        this.receiptDate=this.dataTosave[0].recdate
        this.status = "update"
    }
     editChallan(){
    
    }
    searchChallan(prefix){
      
    }
    edit(itemID){
      this.action="update"
      console.log("edit",itemID)
      this.currentActiveRowid = itemID
      let ele = this.dataTosave[itemID]
      console.log("ele",ele)
      
      if(!this.hidesize){
        this.sizedropdown = this.size_map[ele.product]
        
      }
      let challan = ele.challan.split("-")[1]
      this.entryform.setValue({
        challan:challan,
        recdate:ele.recdate,
        product:ele.product,
        size : ele.size,
        qty:ele.stock,
        vehicleNumber:this.vehicleNumber,
        description:this.name
      })
    
    }
    delete(itenId){
      console.log("delete",itenId)
      let item = this.dataTosave[itenId]
      if (item.status === 'update'||item.status ==='pristine'){
        this.deletedItem.push(item)
      }      
      this.dataTosave.splice(itenId, 1);
    }
    printPage(){
      window.print();
    }
}

 

