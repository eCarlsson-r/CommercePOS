import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  constructor(private http: HttpClient) {}

  upload(file: File, modelId: number, modelType: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('model_id', modelId.toString());
    formData.append('model_type', modelType);

    return this.http.post('/api/media/upload', formData, {
      reportProgress: true,
      observe: 'events'
    });
  }
}