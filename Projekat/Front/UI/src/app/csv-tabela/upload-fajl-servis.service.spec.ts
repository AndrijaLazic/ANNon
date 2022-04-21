import { TestBed } from '@angular/core/testing';

import { UploadFajlServisService } from './upload-fajl-servis.service';

describe('UploadFajlServisService', () => {
  let service: UploadFajlServisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadFajlServisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
