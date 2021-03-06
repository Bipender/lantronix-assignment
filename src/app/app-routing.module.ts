import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component'
import { NgModule } from '@angular/core';

const routes: Routes = [

    {path: 'login', component: LoginComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: '', redirectTo: '/login', pathMatch: 'full'}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})

export class AppRoutingModule {}
