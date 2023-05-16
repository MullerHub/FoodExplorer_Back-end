const fs = require("fs");
const path = require("path");
const uploadConfig = require("../configs/upload");

class DiskStorage {
  /*   async saveFile(file) {
    console.log("saveFile não chegando:");
    await fs.promises.rename(
      path.resolve(uploadConfig.TMP_FOLDER, file),
      path.resolve(uploadConfig.UPLOADS_FOLDER, file),
    );
    console.log("saveFile chegando => ", file);
    return file;
  } */

  async saveFile(file) {
    console.log("saveFile não chegando => ");

    const filePath = path.resolve(uploadConfig.TMP_FOLDER, file.filename);
    const destinationPath = path.resolve(
      uploadConfig.UPLOADS_FOLDER,
      file.filename,
    );

    await fs.promises.rename(filePath, destinationPath);

    console.log("saveFile chegando => ", file.filename);
    return file.filename;
  }

  async deleteFile(file) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, file);

    try {
      await fs.promises.stat(filePath);
    } catch (e) {
      console.error("Erro no DiskSotage ==> ", e);
      return false;
    }
    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;
