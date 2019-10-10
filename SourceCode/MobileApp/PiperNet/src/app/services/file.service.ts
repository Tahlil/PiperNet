import { Injectable } from "@angular/core";

import {
  Plugins,
  FilesystemDirectory,
  FilesystemEncoding
} from "@capacitor/core";
import { config } from "../../../app.config";

const { Filesystem } = Plugins;

@Injectable({
  providedIn: "root"
})
export class FileService {
  root: string;
  testFiles: string;

  constructor() {
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
        console.log(mkdir);
        mkdir(this.root);
        mkdir(this.root+"/uploads");
        mkdir(this.root+"/downloads");
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
}
