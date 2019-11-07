import { Injectable } from "@angular/core";
import { File } from "../models/file.model";
import { FileTypeIconService } from "./file-type-icon.service";
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { MimeTypeService } from "./mime-type.service";
import { ElectronService } from 'ngx-electron';

import {
  Capacitor,
  Plugins,
  Device,
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

  constructor(private fileTypeService: FileTypeIconService, private fileOpener: FileOpener, private mimetypeService: MimeTypeService, private _electronService: ElectronService)
  {
    let self = this;
    this.root = config.rootFolder;
    const info = this.getDeviceInfo();
    info.then((value) => {
      let platform = value.model.split(' ')[0];
      console.log("Platform: " + platform);
      self.root = config[platform+'rootFolder'];
      console.log("Root: "+ self.root);      
      console.log("Device INFOS:");
      console.log(value);
      let files = this.readdir(""),
      mkdir = this.mkdir;
      console.log("Files  kkk: ");
      files.then(res => {
        let rootFolderNotCreated = true;
        for (const file of res.files) {
          console.log("File: " + file);
          if (file === self.root) {
            rootFolderNotCreated = false;
            break;
          }
        }
        if (rootFolderNotCreated) {
          console.log("Have to create root folder: " + self.root);
          mkdir(self.root);
          mkdir(self.root + "/Upload");
          mkdir(self.root + "/Download");

          mkdir(self.root + "\\Upload\\private");
          mkdir(self.root + "\\Upload\\public");
          mkdir(self.root + "\\Download\\private");
          mkdir(self.root + "\\Download\\public");
        } else {
          console.log("Something went wrong.");
        }
      });
    });
  }

  async getDeviceInfo(){
    return await Device.getInfo();
  }

  fileWrite(actionType: 'Upload' | 'Download', fileName:string, base64data:string, privacy: 'private' | 'public') {
    try {
      Filesystem.writeFile({
        path: this.root + "/" + actionType + "/" + privacy + "/" + fileName,
        data: base64data,
        directory: FilesystemDirectory.Documents
        //encoding: FilesystemEncoding.UTF8
      })
    } catch(e) {
      console.error('Unable to write file', e);
    }
  }

  openFile(fileType:string, filePath:string){
    console.log("File path: " + filePath);
    //let isOpened = shell.openItem(filePath);
    //console.log("Is Opened: " + isOpened);
    if (this._electronService.isElectronApp) {
      this._electronService.shell.openItem(filePath);
      console.log("Opening...");
    }
    this.fileOpener.showOpenWithDialog(filePath, this.mimetypeService.getMimeType(fileType))
    .then(() => console.log('File is opened'))
    .catch(e => {
      console.log('Error opening file:');
      console.log(e);
    });
  }

  async fileDelete(actionType:'Upload' | 'Download', fileName:string, isPrivate:boolean) {
    let privacy = this.getPrivacyFolder(isPrivate);
    let fullPath = this.root + "/" + actionType + "/" + privacy + "/" + fileName; 
    console.log("Full path: " + fullPath);
    await Filesystem.deleteFile({
      path: fullPath,
      directory: FilesystemDirectory.Documents
    });
  }

  async mkdir(directory) {
    console.log("Try to create dir " +  directory);
    console.log("Directory: " + FilesystemDirectory.Documents);
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
    
    let privateFiles = this.readdir(dir+"/"+"private"), files = [], index = 0;
    return privateFiles.then(res => {
      for (const fileName of res.files) {
        files[index] = this.stat(dir+"/"+"private"+"/"+fileName, fileName, 'private');
        index++;
      }
      let publicFiles = this.readdir(dir+"/"+"public");
      return publicFiles.then(pubRes => {
        for (const fileName of pubRes.files) {
          files[index] = this.stat(dir+"/"+"public"+"/"+fileName, fileName, 'public');
          index++;
        }
        return files;
      });
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
    console.log("ROOT FOLDER: " + this.root);    
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
    let fullFilePath = this.root + "/" + folder + "/" + 'private' + "/" + fileName;  
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
    console.log("\n\n\n\n\n\nFinished\n\n\n\n\n\n");
  }

  async stat(filePath, fileName, privacy: 'private'| 'public' ) {
    try {
      let ret = await Filesystem.stat({
        path: filePath,
        directory: FilesystemDirectory.Documents
      });
      let type:string = this.fileTypeService.getFileType(fileName);
      console.log("\n\n\n\n\nRet: \n\n\n\n");
      console.log(ret);
      console.log("\n\n\n\nctime: " + ret.ctime + "\n\n\nmtime: "+ ret.mtime + "\n\n\ntype: "+ ret.type + "\n\n\nuri: "+ ret.uri + "\n\n\n");
      return new File(fileName, ret.mtime, type, ret.size>1000000 ? (ret.size/1000000.0).toFixed(2)+"MB" : (ret.size/1000.0).toFixed(2)+"KB", ret.uri, privacy === 'private');
    } catch(e) {
      console.error('Unable to stat file', e);
    }
  }

  private getPrivacyFolder(isPrivate:boolean){
    return isPrivate ? 'private' : 'public'
  }

  async rename(actionType:'Download' | 'Upload', originalName:string, newName:string, isPrivate: boolean) {
    let privacyFolder = this.getPrivacyFolder(isPrivate);
    try {
      console.log("Renaming...");
      let ret = await Filesystem.rename({
        from: this.root+ "/" + actionType + "/" + privacyFolder + "/" + originalName,
        to: this.root+ "/" + actionType + "/" + privacyFolder + "/" + newName,
        directory: FilesystemDirectory.Documents
      });
    } catch(e) {
      console.error('Unable to rename file', e);
    }
  }

  async moveToDifPrivacyFolder(fromPrivate: boolean, actionType:'Download' | 'Upload', fileName:string){
    try {
      // This example copies a file from the app directory to the documents directory
    let fromPrivacyFolder = this.getPrivacyFolder(fromPrivate);
    let toPrivacyFolder = this.getPrivacyFolder(!fromPrivate);
    console.log("\n\n\n\n\nmoving from "+this.root + "/" + actionType + "/" + fromPrivacyFolder  + "/" + fileName +" to " +  this.root + "/" + actionType + "/" + toPrivacyFolder + "/" + fileName + "\n\n\n\n\n");
      let ret = await Filesystem.copy({
        from: this.root + "/" + actionType + "/" + fromPrivacyFolder  + "/" + fileName,
        to: this.root + "/" + actionType + "/" + toPrivacyFolder + "/" + fileName,
        directory: FilesystemDirectory.Documents,
        toDirectory: FilesystemDirectory.Documents
      });
      this.fileDelete(actionType, fileName, fromPrivate);
    } catch(e) {
      console.error('Unable to copy file', e);
    }
  }
}
