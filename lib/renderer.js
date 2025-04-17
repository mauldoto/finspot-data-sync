// renderer/index.js
const { ipcRenderer } = require("electron");
const XLSX = require("xlsx");
let filePath;

document.getElementById("uploadBtn").addEventListener("click", async () => {
  const filePaths = await ipcRenderer.invoke("dialog:openFile");
  if (filePaths && filePaths.length > 0) {
    filePath = filePaths[0];
    console.log("File yang dipilih:", filePath);
    console.log(XLSX);

    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log(data); // Nih hasilnya array of object bro!
  }
});

ipcRenderer.on("alert-about", (event, message) => {
  console.log(message);
  alert(message);
});

document.getElementById("tambahBtn").addEventListener("click", () => {
  let answer = confirm("Apakah anda yakin untuk TAMBAH data karyawan?");
});

document.getElementById("updateBtn").addEventListener("click", () => {
  let answer = confirm("Apakah anda yakin untuk UPDATE data karyawan?");
});

document.getElementById("deleteBtn").addEventListener("click", () => {
  let answer = confirm("Apakah anda yakin untuk HAPUS data karyawan?");
});
