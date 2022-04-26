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

  constructor(private http:HttpClient,private toastr:ToastrService, private spinner: NgxSpinnerService) { }
  procenatUploada=0;
  public uploadFile(file:any): Observable<UploadResponse> {
    const form = new FormData();
    //this.setSession();
    
    
    form.append("uploadedFile",file);
    form.append("userID",sessionStorage.getItem("userId"));
    const baseURL=Konfiguracija.KonfiguracijaServera.osnovniURL
    const api = baseURL+"api/MachineLearning/uploadFile";
    
    const req = new HttpRequest('POST', api, form, { reportProgress: true });
      return this.http.request(req).pipe(
        map((res: HttpEvent<any>) => {
          if (res.type === HttpEventType.Response) {
            const responseFromBackend = res.body;
            return {
              body: responseFromBackend,
              status: UploadStatus.UPLOADED
            };
          } else if (res.type === HttpEventType.UploadProgress) {
            /** Predstavlja procenat upload-a: */
            const uploadProgress = +Math.round((100 * res.loaded) / res.total);
            this.procenatUploada=uploadProgress;
            return {
              status: UploadStatus.IN_PROGRESS,
              progress: uploadProgress
            };

          }
        }),
        catchError(er => {
          this.spinner.hide("Spiner2");
          this.toastr.error("Neuspešna konekcija sa serverom!","Greška")
          console.log(er);
          return of({ status: UploadStatus.ERROR, body: er });
        })
      );
  }
}
