import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { RegisterServiceService } from 'src/app/shared/register-service.service';

@Component({
  selector: 'app-verifikacija',
  templateUrl: './verifikacija.component.html',
  styleUrls: ['./verifikacija.component.css']
})
export class VerifikacijaComponent implements OnInit {
  pom?:any
  ind=false
  constructor(private registerService:RegisterServiceService,private route:Router,private activatedRoute:ActivatedRoute,private toastr:ToastrService,private cookie:CookieService) {}
  

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params=>{
      this.pom=params['token'];
    })
    this.saljizahtev()
    
  }

  saljizahtev()
  {
    this.registerService.verifikacionZahtev(this.pom).subscribe(
      res=>{
        this.toastr.success(res['data']['message'])
        this.cookie.delete('register')
        this.ind=true
      },
      err=>{
        this.toastr.error(err['error'])
      }
    )
    
  }

}
