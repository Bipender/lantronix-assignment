import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { HttpClient } from '@angular/common/http'
import { ApiService } from 'src/app/service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  tokenControl: FormControl = new FormControl('');
  hashToken: any;
  loginFormEnable = true;


  constructor(private fb: FormBuilder, private httpService: HttpClient,
    private apiService: ApiService, private router: Router) {

    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    
   }

  ngOnInit(): void {
  }

  login(){
    const request = this.loginForm.value;
    const url = 'https://ltrx.herokuapp.com/api/v1/auth/login';
        this.httpService.post(url, request).subscribe(
            (data: any)=>{
                const token = {
                    refreshToken: data['refreshToken'],
                    accessToken: data['token']
                };
                localStorage.setItem(this.apiService.TOKEN_KEYWORD, JSON.stringify(token));
                this.apiService.refreshToken()
                this.router.navigate(['/dashboard']);

            },
            (err)=>{
                window.alert(err.error['code'] +": "+ err.error['errors'][0].message);
                console.log(err);

            });
  }

  register(){
    const request = this.loginForm.value;

    const url = 'https://ltrx.herokuapp.com/api/v1/auth/register';
        this.httpService.post(url, request).subscribe(
            (data: any)=>{
              this.hashToken = data.hashToken;
              this.loginFormEnable = false;
            },
            (err)=>{
                window.alert(err.error['code'] +": "+ err.error['errors'][0].message);
                console.log(err);

            });

  }

  verify(){
    const url = 'https://ltrx.herokuapp.com/api/v1/auth/verification';
    const req = {
        otp: this.tokenControl.value,
        hashToken: this.hashToken
    }
    this.httpService.post(url, req).subscribe(
        (data: any)=>{
            alert(data.message+ " Please login")
            this.tokenControl.reset();
            this.loginForm.reset();
            this.loginFormEnable = true;
        },
        (err)=>{
            window.alert(err.error['code'] +": "+ err.error['errors'][0].message);
            console.log(err);

        });
}

}
