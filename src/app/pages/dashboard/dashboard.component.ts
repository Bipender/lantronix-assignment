import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/service/api.service';

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
      id: [''],
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
    // this.userForm.disable();
    // this.userForm.get('firstname')?.enable();
    // this.userForm.get('lastname')?.enable();
     this.userForm.get('id')?.disable();


  }
  
  cancel(){
    this.formEditEnabled = false;
    this.userForm.patchValue(this.userData);
  }

  save(){
    const request = this.userForm.value;
    const url = 'https://ltrx.herokuapp.com/api/v1/auth/user';
    const header = this.apiService.getHeaders();;
    
    const data = [request.firstname, request.lastname, request.country, request.bio, request.username,
      request.email];

    this.httpService.put(url, this.userForm.value, {headers: header}).subscribe((data: any)=>{
      this.userData = data.data;
    },
    (err)=>{
      if(err.error.code == 'TOKEN_EXPIRED'){
        alert("token expired, routing to login page");
        this.router.navigate(['./login']);

      }
    })

  }



}
