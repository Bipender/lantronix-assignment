import { Component, OnDestroy, OnInit } from '@angular/core';
import { ApiService } from './service/api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'lantronix-assignment';

  constructor(private apiService: ApiService){
  }

  ngOnInit(){
    this.apiService.refreshToken();
  }

  ngOnDestroy(){
    this.apiService.clearTokenRefresh();
  }
  
}
