import fs from "fs/promises";
import { Readable } from "stream";
import { finished } from "stream/promises";
import { createWriteStream } from "fs";
import * as path from "path";
import yauzl from "yauzl";
import csv from "csv-parser";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function downloadEquities() {
  const args = process.argv;
  try {
    if (args.length <= 2) {
      throw new Error(
        "No arguments given.\nUsuage node <program_name> YYYY-MM-DD"
      );
    }

    let date = new Date(args[2]);

    if (isNaN(date)) {
      throw new Error(
        "Invalid date format.\nThe correct format is YYYY-MM-DD."
      );
    }

    await createDirIfNotExists("Equities");

    /* Download all the BSE equity files from the given date till there 
      are 50 total downloaded files.
      IMPORTANT : Not all files are available for every date, therefore
      it's not possible to get 50 consecutive
      (Example: if date is 11/01/2024 then 25/11/23 file is not avaible). I just run the loop
      until there are 50 files downloaded in total */
    let d = 0;
    while (d < 50) {
      try {
        date.setDate(date.getDate() - (d == 0 ? 0 : 1));
        await downloadEquity(date);
        d++;
      } catch (e) {
        console.error(`Err: ${e.message}`);
      }
    }
    console.log(`Total files downloaded : ${d}`);
  } catch (e) {
    console.log(`Err: ${e.message}`);
  }
}

async function createDirIfNotExists(directoryPath) {
  try {
    await fs.mkdir(directoryPath, { recursive: true });
    console.log(`Directory created: ./${directoryPath}`);
  } catch (e) {
    console.error(`Error creating directory: ${e.message}`);
  }
}

async function downloadFile(url, destination) {
  const response = await fetch(url);

  if (!response.ok) {
    const items = url.split("/");
    const filename = items[items.length - 1];
    throw new Error(
      `Failed to download file [${filename}]: [${response.status}] : ${response.statusText}`
    );
  }
  const fileStream = createWriteStream(destination, { flags: "wx" });
  await finished(Readable.fromWeb(response.body).pipe(fileStream));
}

async function downloadEquity(date) {
  let temp = date.getDate();
  const day = temp < 10 ? "0" + String(temp) : String(temp);
  temp = date.getMonth() + 1;
  const month = temp < 10 ? "0" + String(temp) : String(temp);
  const year = date.getFullYear() % 100;

  const filename = `EQ${day}${month}${year}_CSV.ZIP`;
  const url = `https://www.bseindia.com/download/BhavCopy/Equity/${filename}`;
  const destination = path.resolve("./Equities", filename);

  console.log(`Downloading: ${url}`);
  await downloadFile(url, destination);
  console.log(`File downloaded: ${destination}`);
}

//downloadEquities();

function extractDataFromZip(zipFilePath, callback) {
  yauzl.open(zipFilePath, { lazyEntries: true }, (err, zipfile) => {
    if (err) throw err;
    zipfile.readEntry();
    zipfile.on("entry", (entry) => {
      zipfile.openReadStream(entry, (err, readStream) => {
        if (err) throw err;

        const rows = [];
        readStream
          .pipe(csv())
          .on("data", (row) => {
            rows.push(row);
          })
          .on("end", () => {
            callback(null, rows);
            zipfile.readEntry();
          });
      });
    });

    zipfile.on("end", () => {});
  });
}

// extractDataFromZip("./Equities/EQ100124_CSV.ZIP", (err, data) => {
//   if (err) {
//     console.error(`Err: ${err.message}`);
//   } else {
//     console.log("Data extracted from CSV");
//     for (let j = 0; j < 10; j++) {
//       console.log(data[j]);
//     }
//   }
// });

downloadEquities();
