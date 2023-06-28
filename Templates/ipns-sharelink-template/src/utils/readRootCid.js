import { exporter } from "@web3-storage/fast-unixfs-exporter";
import filetypeinfo from "magic-bytes.js";
import axios from "axios";
import { getFileSize } from "@/utils/utils";

class ReadRootCID {
  static id = 0;
  path;
  gateway;
  dir = [];
  extension;
  blockStory;
  self;
  offset = 0;
  length;
  limit;
  hasMore = true;
  constructor(path, gateway = "https://ipfs.io/ipfs/", limit = 1) {
    if (typeof path != "string" || !path)
      throw new Error("must enter cid path");
    if (!gateway) this.gateway = "https://ipfs.io/ipfs/";
    this.path = path;
    this.gateway = gateway;
    this.limit = limit;
    this.length = limit;
    this.blockStory = {
      get: async function (key) {
        try {
          const res = await fetch(gateway + key.toString() + "?format=raw");
          const buffer = await res.arrayBuffer();
          return new Uint8Array(buffer);
        } catch (error) {
          throw new Error(key.toString());
        }
      },
      has: async function () {
        return true;
      },
    };
  }
  async getResult() {
    try {
      const result = await exporter(this.path, this.blockStory, {
        blockReadConcurrency: 10,
        timeout: 10000,
      });
      console.log(result, "result");
      if (!result.node.Links) {
        throw new Error(
          "The parsing result of the CID is not a directory structure and cannot be accessed."
        );
      }
      if (result.node.Links.length == 256) {
        // throw new Error(
        //   "The file associated with the CID is too large to be accessed."
        // );
      } else {
        this.dir = result.node.Links.map((it) => {
          return {
            Name: it.Name,
            Tsize: getFileSize(it.Tsize),
            Hash: it.Hash.toString(),
            pathV1: this.gateway + result.path + "/" + it.Name,
            pathV2: this.gateway + it.Hash.toString(),
          };
        });
      }
      this.extension = this._fileExtension(result.name);
      this.self = result;
      await this.traversalDirectory(result);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  async getNextPage() {
    if (!this.self || !this.hasMore) return (this.hasMore = false);
    await this.traversalDirectory(this.self);
  }
  async traversalDirectory(result) {
    const files = [];
    let chunk1 = null;
    try {
      if (result.type == "directory") {
        for await (const chunk of result.content({
          offset: this.offset,
          length: this.length,
        })) {
          try {
            if (chunk.type == "directory") {
              chunk.cidPath = chunk.cid.toString();
              chunk.mimeType = "directory";
            } else if (chunk.type == "file") {
              chunk.cidPath = chunk.cid.toString();
              const { headers } = await axios.head(
                this.gateway + chunk.cidPath
              );
              chunk.mimeType = headers["content-type"];
              chunk.extension = this._fileExtension(chunk.name);
              chunk.fileSize = getFileSize(chunk.size);
            } else if (chunk.type == "raw") {
              let buffer = new ArrayBuffer(chunk.size);
              const uint8array = new Uint8Array(buffer);
              uint8array.set(chunk.node);
              const data = filetypeinfo(uint8array)[0];
              chunk.mimeType = data ? data.mime : "";
              chunk.cidPath = chunk.cid.toString();
              chunk.extension = this._fileExtension(chunk.name);
              chunk.fileSize = getFileSize(chunk.size);
            } else {
              //
            }
            chunk.pathV1 = this.gateway + chunk.path;
            chunk.pathV2 = this.gateway + chunk.cidPath;
            chunk.state = "success";
          } catch (error) {
            console.log(error, "error");
            chunk.extension = this._fileExtension(chunk.name);
            chunk.pathV1 = this.gateway + chunk.path;
            chunk.pathV2 = this.gateway + chunk.cid.toString();
            chunk.fileSize = getFileSize(chunk.size);
            chunk.state = "head request failed";
          }
          chunk1 = chunk;
        }
      }
    } catch (error) {
      console.log(error);
      chunk1 = {
        name: "",
        cidPath: error.message,
        pathV1: this.gateway + error.message,
        pathV2: this.gateway + error.message,
        mimeType: "failed",
        state: "failed",
      };
    }

    files.push(chunk1);
    let file = Object.assign(chunk1, this.dir[this.offset]);
    this.dir.splice(this.offset, this.limit, file);
    let length = 1000;
    if (result.node) {
      length = result.node.Links.length;
    }
    if (this.offset + this.limit >= length) {
      this.hasMore = false;
    }
    this.offset += this.limit;
    this.length += this.limit;
  }
  _fileExtension(name) {
    if (name && typeof name == "string") {
      let nameArr = name.split(".");
      if (nameArr.length == 1) return;
      let extension = nameArr[nameArr.length - 1];
      return extension;
    }
  }
}
export default ReadRootCID;
