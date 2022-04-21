import {
    HttpRequest,
    HttpClient,
    HttpEvent,
    HttpEventType
  } from '@angular/common/http';
  import { catchError, map } from 'rxjs/operators';
  import { Observable, of } from 'rxjs';
  import {
    FilePickerAdapter,
    UploadResponse,
    UploadStatus,
    FilePreviewModel
  } from 'ngx-awesome-uploader';
  import { default as Konfiguracija } from '../../../KonfiguracioniFajl.json';

  export class DemoFilePickerAdapter extends FilePickerAdapter {
    constructor(private http: HttpClient) {
      super();
    }
    progresUploada=0;
    public uploadFile(fileItem: FilePreviewModel): Observable<UploadResponse> {
      const form = new FormData();
      form.append('uploadedFile', fileItem.file);
      form.append("userID",sessionStorage.getItem("userId"));
      form.append('PrvoSlanje', 'PrvoSlanje');
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
            this.progresUploada=uploadProgress;
            return {
              status: UploadStatus.IN_PROGRESS,
              progress: uploadProgress
            };

          }
        }),
        catchError(er => {
          console.log(er);
          return of({ status: UploadStatus.ERROR, body: er });
        })
      );
    }
    public removeFile(fileItem: FilePreviewModel): Observable<any> {
      const id = 50;
      const responseFromBackend = fileItem.uploadResponse;
      console.log(fileItem);
      const removeApi =
        'https://run.mocky.io/v3/dedf88ec-7ce8-429a-829b-bd2fc55352bc';
      return this.http.post(removeApi, { id });
    }
    public dajUploadProgres(){
      return this.progresUploada;
    }
  }