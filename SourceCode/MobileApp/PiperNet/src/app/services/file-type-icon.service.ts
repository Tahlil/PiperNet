import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';

const fileTypeIconPath = "../../../assets/img/fileIcons/";
const fileIconListTxtPath = "../assets/allFileTypes.txt"

@Injectable({
  providedIn: 'root'
})
export class FileTypeIconService {

  allFileTypes: string[];
  constructor(private http: HttpClient) { 
    console.log("Initialize service:");
    this.allFileTypes = [];
    this.http.get(fileIconListTxtPath, {responseType: 'text'})
    .subscribe(
        data => {
          function splitLines(t) { return t.split(/\r\n|\r|\n/); }
          let splitedTypes = splitLines(data), index = 0;
          for (const fileType of splitedTypes) {
            this.allFileTypes[index] = this.getFileType(fileType);
            index++;
          }
          console.log("Number of file types: " + this.allFileTypes.length);
        },
        error => {
            console.log(error);
        }
    );
  }

  getFileType(fileName: string): string{
    let splitedName = fileName.split('.');
    return splitedName[splitedName.length-1];
  }

  public getFileImagePath(fileName: string): string{
    return fileTypeIconPath + this.getFileType(fileName) + ".svg";
  }
}
