// renderer/index.js
const { ipcRenderer } = require("electron");
const XLSX = require("xlsx");
const Swal = require("sweetalert2");

let filePath;
const progressBar = document.getElementById("progressBar");

function parseExcel(pathFile) {
  const workbook = XLSX.readFile(pathFile);
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);

  return data;
}

function showModal(data) {
  errors = "";
  data.errors.forEach((msg) => {
    errors += "NIP: " + msg.nip + " - " + msg.kendala + ", <br/>";
  });
  Swal.fire({
    title: "<strong>Proses Berhasil</strong>",
    icon: "info",
    html: `
      <div class="scrollable-content">
        <p style="display:block;">Success : ${data.total_success}</p>
        <p style="display:block;">Error : ${data.total_error}</p>
        <p style="display:block;">Pesan Error : </p>
        <p style="display:block;">${errors}</p>
      </div>
    `,
    heightAuto: false,
    customClass: {
      htmlContainer: "swal-scroll",
      icon: "swal-icon-kecil",
    },
    didOpen: () => {
      const modal = document.querySelector(".swal2-popup");
      modal.style.width = "400px";
      modal.style.fontSize = "11px";
    },
  });
}

document.getElementById("uploadBtn").addEventListener("click", async () => {
  const filePaths = await ipcRenderer.invoke("dialog:openFile");
  if (filePaths && filePaths.length > 0) {
    filePath = filePaths[0];
    document.getElementById("fileInfo").innerHTML = filePath;
    const buttons = document.querySelectorAll(".btn-action");
    buttons.forEach((elm) => {
      elm.removeAttribute("disabled");
    });
  }
});

ipcRenderer.on("progress-update", (event, progress) => {
  progressBar.value = progress;
  if (progress == 100) {
    setTimeout(() => {
      const buttons = document.querySelectorAll("button");
      buttons.forEach((elm) => {
        if (elm.classList.contains("btn-action")) {
          elm.setAttribute("disabled", true);
        } else {
          elm.removeAttribute("disabled");
        }
      });

      progressBar.style.display = "none";
      document.getElementById("fileInfo").innerHTML =
        '<h4 style="text-color:green;">Proses Selesai</h4>';
    }, 1000);
  }
});

ipcRenderer.on("alert-about", (event, message) => {
  alert(message);
});

document.getElementById("tambahBtn").addEventListener("click", async () => {
  let answer = confirm("Apakah anda yakin untuk TAMBAH data karyawan?");
  if (!answer) return;

  const buttons = document.querySelectorAll("button");
  buttons.forEach((elm) => {
    elm.setAttribute("disabled", true);
  });
  progressBar.style.display = "inline";
  // progressBar.style.backgroundColor = "#4CAF50";
  const dataExcel = parseExcel(filePath);

  const invokeAdd = await ipcRenderer.invoke("excel:add", dataExcel);
  showModal(invokeAdd);
});

document.getElementById("updateBtn").addEventListener("click", async () => {
  let answer = confirm("Apakah anda yakin untuk UPDATE data karyawan?");
  if (!answer) return;

  const buttons = document.querySelectorAll("button");
  buttons.forEach((elm) => {
    elm.setAttribute("disabled", true);
  });
  progressBar.style.display = "inline";
  // progressBar.style.backgroundColor = "#2231fd";
  const dataExcel = parseExcel(filePath);
  const invokeUpdate = await ipcRenderer.invoke("excel:update", dataExcel);
  showModal(invokeUpdate);
});

document.getElementById("deleteBtn").addEventListener("click", async () => {
  let answer = confirm("Apakah anda yakin untuk HAPUS data karyawan?");
  if (!answer) return;

  const buttons = document.querySelectorAll("button");
  buttons.forEach((elm) => {
    elm.setAttribute("disabled", true);
  });
  progressBar.style.display = "inline";
  // progressBar.style.backgroundColor = "#ee2b08";
  const dataExcel = parseExcel(filePath);
  const invokeDelete = await ipcRenderer.invoke("excel:delete", dataExcel);
  showModal(invokeDelete);
});
