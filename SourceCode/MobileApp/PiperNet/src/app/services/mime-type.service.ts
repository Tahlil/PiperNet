import { Injectable } from '@angular/core';
import { mimeTypeMap } from "../Data/mimeTypes.json";

@Injectable({
  providedIn: 'root'
})
export class MimeTypeService {

  numberOfMimeTypes:Number; 
  constructor() { 
    this.numberOfMimeTypes = mimeTypeMap.length;
    console.log("Number of MimeTypes: " + this.numberOfMimeTypes);
  }

  getMimeType(fileType:string):string{
    console.log("Fileype: " + fileType);
    let type = "none";
    for (let index = 0; index < this.numberOfMimeTypes; index++) {
      const mimePair = mimeTypeMap[index];
      if(mimePair[0] === "."+fileType.toLowerCase()){
        return mimePair[1];
      }
    }
    console.error("Mime Type not found.");
    return type;
  }
}
