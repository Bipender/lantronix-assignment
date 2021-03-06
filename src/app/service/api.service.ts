import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from '@angular/core';
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";

@Injectable({
    providedIn: 'root'
})

export class ApiService {
    TOKEN_KEYWORD = "login.token";
    tokenRefreshTimer: any;
    constructor(private httpService: HttpClient, private router: Router){
    }


    refreshToken(){
        this.tokenRefreshTimer = setInterval(()=>{
            this.callRefreshTokenApi();
        }, 2459)

    }

    clearTokenRefresh(){
        clearInterval(this.tokenRefreshTimer);
    }

    callRefreshTokenApi(){
        const url = 'https://ltrx.herokuapp.com/api/v1/auth/refreshToken';
        const accesstoken = localStorage.getItem(this.TOKEN_KEYWORD) as any;
        let token;
        if(null != accesstoken){
            token = JSON.parse(accesstoken);
        }else{
            this.router.navigate(['/login']);
        }
        const request = {
            refreshToken: token['refreshToken'],
            accessToken: token['accessToken']
        };

        this.httpService.post(url, request).subscribe(
            (data: any)=>{
                const token = {
                    refreshToken: data['refreshToken'],
                    accessToken: data['token']
                };
                localStorage.setItem(this.TOKEN_KEYWORD, JSON.stringify(token));
            },
            (err)=>{
                window.alert("Error Occured while refreshing token , Redirecting to login page");
                this.clearTokenRefresh();
                this.router.navigate(['/login']);
                console.log(err);
            }
        );
    }

    getHeaders(): HttpHeaders{
        const accesstoken = localStorage.getItem(this.TOKEN_KEYWORD) as any;
        let token;
        if(null != accesstoken){
            token = JSON.parse(accesstoken);
        }else{
            this.router.navigate(['/login']);
        }
        const request = {
            refreshToken: token['refreshToken'],
            accessToken: token['accessToken']
        };
        const header = new HttpHeaders({
            'Content-Type':'application/x-www-form-urlencoded',
            'Authorization': 'Bearer ' + request.accessToken

        });
        return header;
    }

}