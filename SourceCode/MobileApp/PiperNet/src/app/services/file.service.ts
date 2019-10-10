import { Injectable } from "@angular/core";

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

  constructor() //private fileChooser: FileChooser
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

  async fileDelete(fileName) {
    await Filesystem.deleteFile({
      path: this.root + "/" + fileName,
      directory: FilesystemDirectory.Data
    });
  }

  async mkdir(directory) {
    try {
      let ret = await Filesystem.mkdir({
        createIntermediateDirectories: true,
        path: directory,
        directory: FilesystemDirectory.Documents
      });

      console.log(ret);
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

  async readdir(folder) {
    try {
      let ret = await Filesystem.readdir({
        path: folder,
        directory: FilesystemDirectory.Documents
      });
      console.log("ret: ");
      console.log(ret);
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
}
