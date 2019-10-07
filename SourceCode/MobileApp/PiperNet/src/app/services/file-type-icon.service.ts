import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';

const fileTypeIconPath = "../assets/img/fileIcons/";
const fileIconListTxtPath = "../assets/allFileTypes.txt"

@Injectable({
  providedIn: 'root'
})
export class FileTypeIconService {

  allFileTypes: string[];
  constructor(private http: HttpClient) { 
    console.log("Initialize service:");
    this.http.get(fileIconListTxtPath, {responseType: 'text'})
    .subscribe(
        data => {
            console.log(data);
        },
        error => {
            console.log(error);
        }
    );
  }

  private getFileType(fileName: string): string{
    let splitedName = fileName.split('.');
    return splitedName[splitedName.length-1];
  }

  public getFileImagePath(fileName: string): string{
    return fileTypeIconPath + this.getFileType(fileName) + ".svg";
  }
  public test(){
    console.log("This is a test");
    
  }

}
