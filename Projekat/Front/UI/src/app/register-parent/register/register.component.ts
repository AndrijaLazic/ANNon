import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { RegisterServiceService } from 'src/app/shared/register-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  selectedFile:File=null;

  constructor(private spinner:NgxSpinnerService,public service:RegisterServiceService,private toastr:ToastrService,private route:Router,private cookie:CookieService) { }



  ngOnInit(): void {
  }
  onSubmit1(form:NgForm){
    this.spinner.show("Spiner1")
    let username=this.service.formdata.username;
    const filedata=new FormData();
    if(!this.selectedFile)
    {
      filedata.append('image',"");
    }
    else
    {
      filedata.append('image',this.selectedFile,this.selectedFile.name);
    }
    
    filedata.append('username',username);
    filedata.append('email',this.service.formdata.email);
    filedata.append('password',this.service.formdata.password);
    console.log(this.service.formdata);
    this.service.postFunkcija(filedata).subscribe(
      //uspesna registracija
      res=>{
        this.spinner.hide("Spiner1");
        this.toastr.success(res['data']['message'])
        this.cookie.set('register','uspesna')
        this.route.navigate(['success-register'])
      },
      err=>{
        this.spinner.hide("Spiner1");
        this.toastr.error(err['error'])
      }
    )
  }

   url = 'assets/image/pocetna1.png';
  onSelect(event) {
    let fileType = event.target.files[0].type
    this.selectedFile=<File>event.target.files[0];
    if (fileType.match(/image\/*/)) {
      let reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        this.url = event.target.result;
        
      };
    } else {
      window.alert('Please select correct image format');
    }
    
  }

}
