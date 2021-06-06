import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login'
import { AuthGuard } from './_guards';
import {RawMaterial} from './_entry/raw_material';
import {FinishedMaterial} from './_entry/finished_material'
import {SalesCompoent} from './_entry/sales'
import {SemiFinishedProduct} from './_entry/semi.finished'
import {Finish_Product_Entry} from './_entry/finish_product'
import {Reports} from './_entry/report'
const appRoutes: Routes = [
    { path: '',component:RawMaterial, canActivate: [AuthGuard] ,pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'raw',component:RawMaterial,canActivate: [AuthGuard]},
    { path: 'semifinished',component:SemiFinishedProduct,canActivate: [AuthGuard]},
    { path: 'finished', component:Finish_Product_Entry,canActivate: [AuthGuard]},
    { path: 'sales', component:SalesCompoent,canActivate: [AuthGuard]},
    {path:'reports',component:Reports,canActivate: [AuthGuard]},
    
    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];

export const routing = RouterModule.forRoot(appRoutes);