import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { RegisterServiceService } from 'src/app/shared/register-service.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { DemoFilePickerAdapter } from './UploadAdapter.adapter';
import { HttpClient } from '@angular/common/http';
import { FilePreviewModel, UploaderCaptions, ValidationError } from 'ngx-awesome-uploader';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  selectedFile:any=null;

  constructor(private http:HttpClient,private spinner:NgxSpinnerService,public service:RegisterServiceService,private toastr:ToastrService,private route:Router,private cookie:CookieService) { }



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
        this.cookie.set('email',this.service.email)
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
      window.alert('Greška prilikom učitavanja slike');
    }
    
  }


  



  public imeFajla:string;
  public VelicinaFajla:number;
  public adapter = new DemoFilePickerAdapter(this.http,this.spinner,this.toastr);

  MaksVelicinaFajla=5;

  public myFiles: FilePreviewModel[] = [];

  public captions: UploaderCaptions = {
    dropzone: {
      title: '',
      or: '',
      browse: '',
    },
    cropper: {
      crop: 'Iseci',
      cancel: 'Prekini',
    },
    previewCard: {
      remove: 'Izbriši',
      uploadError: 'Greška pri ucitavanju fajla',
    },
  };

  public cropperOptions = {
    minContainerWidth: '300',
    minContainerHeight: '300',
  };

  public onValidationError(error: ValidationError): void {
    if("FILE_MAX_SIZE"==error.error && this.myFiles.length==0){
      alert("Maksimalna velicina fajla je "+this.MaksVelicinaFajla+" Mb")
    }
    else if("FILE_MAX_COUNT"==error.error){
      alert("Izaberite samo jedan fajl")
    }
    else{
      alert(`Izaberite sliku sa jednom od sledecih ekstenzija: jpg,png,gif`);
    }
    // ${error.error}
  }

  public onUploadSuccess(e: FilePreviewModel): void {

    console.log(this.myFiles.length);
  }

  public onRemoveSuccess(e: FilePreviewModel) {
    
    console.log(this.myFiles.length);
    this.myFiles.pop();
    this.selectedFile=null;
  }
  public onFileAdded(file: FilePreviewModel) {
    
    this.onFileSelected(file);
  }

  onFileSelected(fajl: FilePreviewModel)
  {
    
    if (fajl) 
    {
      var file = fajl.file;
      this.imeFajla=fajl.fileName;
      this.VelicinaFajla=fajl.file.size;
      this.selectedFile=file;
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: any) => {
        this.url = event.target.result;
      };
    }
  }

  IzbrisiSliku(){
    this.selectedFile=null;
    this.url="";
  }
}
