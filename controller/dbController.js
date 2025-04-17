const mysql = require("mysql2/promise");

async function dbconnection() {
  return await mysql.createConnection({
    host: "localhost",
    user: "mauldoto",
    password: "fafifu",
    database: "fin_pro",
  });
}

function parseDate(serial) {
  const utc_days = Math.floor(serial - 25569); // 25569 = serial utk 1970-01-01
  const utc_value = utc_days * 86400; // detik
  const date = new Date(utc_value * 1000); // dalam milidetik

  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");

  const sqlFormat = `${yyyy}-${mm}-${dd}`;
  return sqlFormat;
}

async function addEmployee(data) {
  let connection;

  try {
    connection = await dbconnection();
    // cek data duplikasi
    const [pegawaiRows] = await connection.execute(
      "SELECT pegawai_id FROM pegawai WHERE pegawai_pin = ?",
      [data["PIN"]]
    );

    if (pegawaiRows.length > 0) {
      console.log("Pegawai dengan nip tersebut sudah ada");
      return;
    }

    const ids = await connection.execute(
      "SELECT pegawai_id FROM pegawai ORDER BY pegawai_id DESC LIMIT 1;"
    );

    const lastId = ids[0][0].pegawai_id + 1;

    // 1. cari pembagian1
    const p1 = await connection.execute(
      "SELECT * FROM pembagian1 WHERE pembagian1_nama = ?",
      [data["Jabatan"]]
    );

    // 2. cari pembagian2
    const p2 = await connection.execute(
      "SELECT * FROM pembagian2 WHERE pembagian2_nama = ?",
      [data["Bagian"]]
    );

    // 3. cari pembagian3
    const p3 = await connection.execute(
      "SELECT * FROM pembagian3 WHERE pembagian3_nama = ?",
      [data["Lokasi"]]
    );

    console.log([
      lastId,
      data["PIN"],
      data["NIP"],
      data["Nama"],
      data["Tempat Lahir"] ? data["Tempat Lahir"] : null,
      data["Tanggal Lahir"] ? parseDate(data["Tanggal Lahir"]) : null,
      p1[0][0].pembagian1_id,
      p2[0][0].pembagian2_id,
      p3[0][0].pembagian3_id,
    ]);

    // . insert data baru ke database
    const insertResult = await connection.execute(
      "INSERT INTO pegawai (pegawai_id, pegawai_pin, pegawai_nip, pegawai_nama, tempat_lahir, tgl_lahir, pembagian1_id, pembagian2_id, pembagian3_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        lastId,
        data["PIN"],
        data["NIP"],
        data["Nama"],
        data["Tempat Lahir"] ? data["Tempat Lahir"] : null,
        data["Tanggal Lahir"] ? parseDate(data["Tanggal Lahir"]) : null,
        p1[0][0].pembagian1_id,
        p2[0][0].pembagian2_id,
        p3[0][0].pembagian3_id,
      ]
    );

    console.log("✅ Employee inserted");
  } catch (err) {
    console.error("❌ Error:", err);
    throw new Error("❌ Error:", err);
  } finally {
    await connection.end();
  }
}

async function updateEmployee(data) {
  let connection;

  try {
    connection = await dbconnection();
    // cek data duplikasi
    const [pegawaiRows] = await connection.execute(
      "SELECT pegawai_id FROM pegawai WHERE pegawai_pin = ?",
      [data["PIN"]]
    );

    if (pegawaiRows.length === 0) {
      console.log("Pegawai dengan nip tersebut tidak ada");
      return;
    }

    // 1. cari pembagian1
    const p1 = await connection.execute(
      "SELECT * FROM pembagian1 WHERE pembagian1_nama = ?",
      [data["Jabatan"]]
    );

    // 2. cari pembagian2
    const p2 = await connection.execute(
      "SELECT * FROM pembagian2 WHERE pembagian2_nama = ?",
      [data["Bagian"]]
    );

    // 3. cari pembagian3
    const p3 = await connection.execute(
      "SELECT * FROM pembagian3 WHERE pembagian3_nama = ?",
      [data["Lokasi"]]
    );

    // 2. Update orders dengan stock yang diambil
    const updateResult = await connection.execute(
      "UPDATE pegawai SET tempat_lahir = ?, pembagian1_id = ?, pembagian2_id = ?, pembagian3_id = ?, tgl_lahir = ? WHERE pegawai_nip = ?",
      [
        data["Tempat Lahir"] ? data["Tempat Lahir"] : null,
        p1[0][0].pembagian1_id,
        p2[0][0].pembagian2_id,
        p3[0][0].pembagian3_id,
        data["Tanggal Lahir"] ? parseDate(data["Tanggal Lahir"]) : null,
        data["NIP"],
      ]
    );

    console.log("✅ Employee updated");
  } catch (err) {
    console.error("❌ Error:", err);
    throw new Error("❌ Error:", err);
  } finally {
    await connection.end();
  }
}

async function deleteEmployee(data) {
  let connection;

  try {
    connection = await dbconnection();
    // cek data duplikasi
    const [pegawaiRows] = await connection.execute(
      "SELECT pegawai_id FROM pegawai WHERE pegawai_pin = ?",
      [data["PIN"]]
    );

    if (pegawaiRows.length === 0) {
      console.log("Pegawai dengan nip tersebut tidak ada");
      return;
    }

    // Update orders dengan stock yang diambil
    const deleteResult = await connection.execute(
      "DELETE FROM pegawai WHERE pegawai_pin = ?",
      [data["PIN"]]
    );

    console.log("✅ Employee deleted");
  } catch (err) {
    console.error("❌ Error:", err);
    throw new Error("❌ Error:", err);
  } finally {
    await connection.end();
  }
}

module.exports = {
  addEmployee,
  updateEmployee,
  deleteEmployee,
};
