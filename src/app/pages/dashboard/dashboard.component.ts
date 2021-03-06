import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user = "AK";
  userForm: FormGroup;
  userData = {
    firstname: '',
    lastname: '',
    country: '',
    email: '',
    bio: '',
    username: '',
  }

  formEditEnabled = false;

  constructor(private fb: FormBuilder, private httpService: HttpClient,
     private apiService: ApiService, private router: Router) {
    this.userForm = fb.group({
      firstname: [''],
      lastname: [''],
      email: [''],
      country: [''],
      bio: ['']
    });

    this.userForm.patchValue(this.userData);
   }

  ngOnInit(): void {
    this.getUserData();
  }

  getUserData(){
    const url = 'https://ltrx.herokuapp.com/api/v1/auth/user';
    const header = this.apiService.getHeaders();

    this.httpService.get(url, {headers: header}).subscribe((data: any)=>{
      this.userData = data.data;
      this.userForm.patchValue(this.userData);
      this.user = this.userData.firstname.charAt(0)+ this.userData.lastname.charAt(0);


    },
    (err)=>{
      if(err.error.code == 'TOKEN_EXPIRED'){
        alert("token expired, routing to login page");
        this.router.navigate(['./login']);

      }
    });

  }

  update(){
    this.formEditEnabled = true;

  }
  
  cancel(){
    this.formEditEnabled = false;
    this.userForm.patchValue(this.userData);
  }

  save(){
    
    const url = 'https://ltrx.herokuapp.com/api/v1/auth/user';
    const header = this.apiService.getHeaders();
    let request = '';
    let flag= false;
    for(let data in this.userForm.value){
      if(flag){
        request += '&';
      }
      request = request+data.toString()+'='+this.userForm.value[data].toString();
      flag=true;
    }

    this.httpService.put(url, request, {headers: header}).subscribe((data: any)=>{
      this.userData = data.data;
      this.userForm.patchValue(data.data);
      this.formEditEnabled= false;
    },
    (err)=>{
      if(err.error.code == 'TOKEN_EXPIRED'){
        alert("token expired, routing to login page");
        this.router.navigate(['./login']);

      }
    })

  }



}
