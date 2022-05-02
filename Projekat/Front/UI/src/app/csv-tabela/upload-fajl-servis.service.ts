import { HttpEvent, HttpEventType, HttpRequest,HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CsvExportParams } from 'ag-grid-community';
import { UploadResponse, UploadStatus } from 'ngx-awesome-uploader';
import { catchError, map, Observable, of } from 'rxjs';
import { default as Konfiguracija } from '../../../KonfiguracioniFajl.json';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class UploadFajlServisService {
  private baseUrl = Konfiguracija.KonfiguracijaServera.osnovniURL;
  constructor(private http: HttpClient) { }
  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();
    formData.append("uploadedFile",file);
    formData.append("userID",sessionStorage.getItem("userId"));
    const req = new HttpRequest('POST',this.baseUrl+"api/MachineLearning/uploadFile", formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.http.request(req);
  }
}
