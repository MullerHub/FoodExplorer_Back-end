const fs = require("fs");
const path = require("path");
const uploadConfig = require("../configs/upload");

class DiskStorage {
  async saveFile(arquivo) {
    await fs.promises.rename(
      path.resolve(uploadConfig.TMP_FOLDER, arquivo),
      path.resolve(uploadConfig.UPLOADS_FOLDER, arquivo),
    );
    return arquivo;
  }

  async deleteFile(arquivo) {
    const filePath = path.resolve(uploadConfig.UPLOADS_FOLDER, arquivo);

    try {
      await fs.promises.stat(filePath);
    } catch (e) {
      console.error("Erro no DiskSotage: ", e);
      return false;
    }
    await fs.promises.unlink(filePath);
  }
}

module.exports = DiskStorage;
