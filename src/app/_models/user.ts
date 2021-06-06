export class User {
    id: number;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
}

export class RawMaterialImp {
    industry : string;
    challan : string;
    txn:string;
    recdate : string;
    weight : string;
    material : string;
    size: string;   
    status: string;
}

export class SemiFinishedImpl{
    industry: string;
    challan: string;
    txn:string;
    recdate:string;
    product:string;
    size:string;
    qty : number;
    rawMaterial:RawMaterialImp
    status: string;
    wastage : string;
}


export class FinishedProductImpl {
    recdate : string;
    challan: string;
    product : string;
    size: string;
    stock : number;
    industry: string;
    txn:string;
    status: string;
    semiProdList : Array<SemiFinishedImpl>=[]
    rawMaterialList : Array<RawMaterialImp>=[];    
}
export class Sales{
    recdate : string;
    challan: string;
    product : string;
    size: string;
    stock : number;
    txn:string;
    status: string;
    vehicleNumber :string;
    description:string;
    
}