import { Injectable } from "@angular/core";
import { File } from "../models/file.model";
import { FileTypeIconService } from "./file-type-icon.service";
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { MimeTypeService } from "./mime-type.service";

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

  constructor(private fileTypeService: FileTypeIconService, private fileOpener: FileOpener, private mimetypeService: MimeTypeService)
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
        mkdir(this.root + "/Upload/private");
        mkdir(this.root + "/Upload/public");
        mkdir(this.root + "/Download/private");
        mkdir(this.root + "/Download/public");
      } else {
        console.log("Something went wrong.");
      }
    });
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
    this.fileOpener.showOpenWithDialog(filePath, this.mimetypeService.getMimeType(fileType))
    .then(() => console.log('File is opened'))
    .catch(e => {
      console.log('Error opening file:');
      console.log(e);
    });
  }

  async fileDelete(type:string, fileName:string, isPrivate:boolean) {
    let privacy = isPrivate ? 'private' : 'public';
    let fullPath = this.root + "/" + type + "/" + privacy + "/" + fileName; 
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

  async rename(actionType:'Download' | 'Upload', originalName:string, newName:string) {
    try {
      console.log("Renaming...");
      let ret = await Filesystem.rename({
        from: this.root+ "/" + actionType + "/" + originalName,
        to: this.root+ "/" + actionType + "/" + newName,
        directory: FilesystemDirectory.Documents
      });
    } catch(e) {
      console.error('Unable to rename file', e);
    }
  }
}
