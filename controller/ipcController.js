const { ipcMain, dialog } = require("electron");
const {
  addEmployee,
  updateEmployee,
  deleteEmployee,
} = require("./dbController");

const openFileDialog = async () => {
  const result = await dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Excel Files", extensions: ["xlsx", "xls"] }],
  });
  return result.filePaths;
};

const handleAddEmployee = async (event, dataExcel) => {
  const errorLogs = [];
  let successCount = 0;
  let progressCount = 0;

  for (const row of dataExcel) {
    try {
      await addEmployee(row);

      successCount++;
    } catch (err) {
      errorLogs.push({
        nip: row["NIP"],
        kendala: err.message,
      });
    }

    progressCount++;
    event.sender.send(
      "progress-update",
      (progressCount / dataExcel.length) * 100
    );
  }

  return {
    total_success: successCount,
    total_error: errorLogs.length,
    errors: errorLogs,
  };
};

const handleUpdateEmployee = async (event, dataExcel) => {
  const errorLogs = [];
  let successCount = 0;
  let progressCount = 0;

  for (const row of dataExcel) {
    try {
      await updateEmployee(row);

      successCount++;
    } catch (err) {
      errorLogs.push({
        nip: row["NIP"],
        kendala: err.message,
      });
    }

    progressCount++;
    event.sender.send(
      "progress-update",
      (progressCount / dataExcel.length) * 100
    );
  }

  return {
    total_success: successCount,
    total_error: errorLogs.length,
    errors: errorLogs,
  };
};

const handleDeleteEmployee = async (event, dataExcel) => {
  const errorLogs = [];
  let successCount = 0;
  let progressCount = 0;

  for (const row of dataExcel) {
    try {
      await deleteEmployee(row);

      successCount++;
    } catch (err) {
      errorLogs.push({
        nip: row["NIP"],
        kendala: err.message,
      });
    }

    progressCount++;
    event.sender.send(
      "progress-update",
      (progressCount / dataExcel.length) * 100
    );
  }

  return {
    total_success: successCount,
    total_error: errorLogs.length,
    errors: errorLogs,
  };
};

const registerIpcHandler = () => {
  ipcMain.handle("dialog:openFile", openFileDialog);
  ipcMain.handle("excel:add", handleAddEmployee);
  ipcMain.handle("excel:update", handleUpdateEmployee);
  ipcMain.handle("excel:delete", handleDeleteEmployee);
};

module.exports = {
  registerIpcHandler,
};
