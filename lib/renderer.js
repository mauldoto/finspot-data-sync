// renderer/index.js
const { ipcRenderer } = require('electron');

document.getElementById('uploadBtn').addEventListener('click', async () => {
  const filePaths = await ipcRenderer.invoke('dialog:openFile');
  if (filePaths && filePaths.length > 0) {
    const filePath = filePaths[0];
    console.log('File yang dipilih:', filePath);
    // Lanjut proses file Excel di sini
  }
});