import fs from "fs/promises";
import { Readable } from "stream";
import { finished } from "stream/promises";
import { createWriteStream } from "fs";
import * as path from "path";

async function downloadEquities() {
  const args = process.argv;
  try {
    if (args.length <= 2) {
      throw new Error(
        "No arguments given.\nUsuage node <program_name> YYYY-MM-DD"
      );
    }

    const date = new Date(args[2]);
    if (isNaN(date)) {
      throw new Error(
        "Invalid date format.\nThe correct format is YYYY-MM-DD."
      );
    }

    await createDirIfNotExists("Equities");
    await downloadEquity(date);
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
    throw new Error(
      `Failed to download file: [${response.status}] : ${response.statusText}`
    );
  }
  const fileStream = createWriteStream(destination, { flags: "wx" });
  await finished(Readable.fromWeb(response.body).pipe(fileStream));
}

async function downloadEquity(date) {
  try {
    const day = date.getDate();
    const temp = date.getMonth() + 1;
    const month = temp < 10 ? "0" + String(temp) : temp;
    const year = date.getFullYear() % 100;

    const filename = `EQ${day}${month}${year}_CSV.ZIP`;
    const url = `https://www.bseindia.com/download/BhavCopy/Equity/${filename}`;
    const destination = path.resolve("./Equities", filename);

    console.log(`Downloading: ${url}`);
    await downloadFile(url, destination);
    console.log(`File downloaded: ${destination}`);
  } catch (e) {
    console.log(`Err: ${e.message}`);
  }
}

downloadEquities();
