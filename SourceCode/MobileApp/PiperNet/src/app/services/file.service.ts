import { Injectable } from "@angular/core";
import { File } from "../models/file.model";
import { FileTypeIconService } from "./file-type-icon.service";
import { FileOpener } from '@ionic-native/file-opener/ngx';

import {
  Capacitor,
  Plugins,
  CameraResultType,
  FilesystemDirectory,
  FilesystemEncoding
} from "@capacitor/core";
import { config } from "../../../app.config";

const { Camera, Filesystem } = Plugins;

@Injectable({
  providedIn: "root"
})
export class FileService {
  root: string;
  testFiles: string;

  constructor(private fileTypeService: FileTypeIconService, private fileOpener: FileOpener) //private fileChooser: FileChooser
  {
    this.root = config.rootFolder;
    let files = this.readdir(""),
      mkdir = this.mkdir;
    console.log("Files: ");
    files.then(res => {
      let rootFolderNotCreated = true;
      for (const file of res.files) {
        console.log("File: " + file);
        if (file === this.root) {
          rootFolderNotCreated = false;
          break;
        }
      }
      if (rootFolderNotCreated) {
        console.log("Have to create root folder: " + this.root);
        //mkdir(this.root);
        mkdir(this.root + "/Upload");
        mkdir(this.root + "/Download");
      } else {
        console.log("Something went wrong.");
      }
      //     this.fileChooser.open()
      // .then(uri => console.log("URI: " + uri))
      // .catch(e => console.log(e));
    });

    // this.readdir("").then(result => {
    //   console.log("FIles: ");
    //   console.log(result);
    // });
  }


  openFile(filePath:string){
    console.log("File path: " + filePath);
    this.fileOpener.open(filePath, 'application/pdf')
    .then(() => console.log('File is opened'))
    .catch(e => {
      console.log('Error opening file:');
      console.log(e);
      
    });
  
  
  }

  async fileDelete(type:string, fileName:string) {
    let fullPath = this.root + "/" + type + "/" + fileName; 
    console.log("Full path: " + fullPath);
    await Filesystem.deleteFile({
      path: fullPath,
      directory: FilesystemDirectory.Documents
    });
  }

  async mkdir(directory) {
    try {
      let ret = await Filesystem.mkdir({
        createIntermediateDirectories: true,
        path: directory,
        directory: FilesystemDirectory.Documents
      });
    } catch (e) {
      console.error("Unable to make directory");
      console.error(e);
    }
  }

  async rmdir(folder) {
    try {
      let ret = await Filesystem.rmdir({
        path: folder,
        directory: FilesystemDirectory.Documents,
        recursive: false
      });
    } catch (e) {
      console.error("Unable to remove directory", e);
    }
  }

  private getAllFilesInfo(dir){
    let allFiles = this.readdir(dir), files = [], index = 0;
    return allFiles.then(res => {
      for (const fileName of res.files) {
        files[index] = this.stat(dir+"/"+fileName, fileName);
        index++;
      }
      return files;
    });
  }

  getUploadedFiles(){
    let dir = this.root+"/Upload";
    return this.getAllFilesInfo(dir);
  }

  getDowloadedFiles(){
    let dir = this.root+"/Download";
    return this.getAllFilesInfo(dir);
  }

  async readdir(folder) {
    try {
      let ret = await Filesystem.readdir({
        path: folder,
        directory: FilesystemDirectory.Documents
      });
      return ret;
    } catch (e) {
      console.error("Unable to read dir", e);
    }
  }

  async takePhoto(folder) {
    const options = {
      resultType: CameraResultType.Uri
    };
  
    const originalPhoto = await Camera.getPhoto(options);
    const photoInTempStorage = await Filesystem.readFile({ path: originalPhoto.path });

    let date = new Date(),
      time = date.getTime(),
      fileName = time + ".jpeg";
    let fullFilePath = this.root + "/" + folder + "/" + fileName;  
    await Filesystem.writeFile({
      data: photoInTempStorage.data,
      path: fullFilePath,
      directory: FilesystemDirectory.Documents
    });
    const finalPhotoUri = await Filesystem.getUri({
      directory: FilesystemDirectory.Documents,
      path: fullFilePath
    });
    let photoPath = Capacitor.convertFileSrc(finalPhotoUri.uri);
    console.log(photoPath);
  }

  async stat(filePath, fileName) {
    try {
      let ret = await Filesystem.stat({
        path: filePath,
        directory: FilesystemDirectory.Documents
      });
      let type:string = this.fileTypeService.getFileType(fileName);
      return new File(fileName, type, ret.size>1000000 ? (ret.size/1000000.0).toFixed(2)+"MB" : (ret.size/1000.0).toFixed(2)+"KB", ret.uri, true);
    } catch(e) {
      console.error('Unable to stat file', e);
    }
  }
}
