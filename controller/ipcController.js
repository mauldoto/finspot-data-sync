const { ipcMain, dialog } = require('electron')

const openFileDialog = async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [{ name: 'Excel Files', extensions: ['xlsx', 'xls'] }]
    });
    return result.filePaths;
  };

  const registerOpenDialogHandler = () => {
    ipcMain.handle('dialog:openFile', openFileDialog);
  }

  module.exports = {
    registerOpenDialogHandler
  }