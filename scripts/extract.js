import AdmZip from "adm-zip";
import csvParser from "csv-parser";
import { Writable, PassThrough } from "stream";
import { pipeline } from "stream/promises";
import { getDate, preprocessRow } from "../utils/index.js";
import { readdir, mkdir } from "fs/promises";
import { existsSync } from "fs";

export async function extractFile(filename) {
  const zip = new AdmZip(`./Equities/${filename}_CSV.ZIP`);
  const zipEntry = zip.getEntry(`${filename}.CSV`);

  if (!zipEntry) {
    throw new Error(`${filename}.CSV not found.`);
  }

  const buffer = zipEntry.getData();
  const results = [];

  const bufferStream = new PassThrough();
  bufferStream.end(buffer);

  await pipeline(
    bufferStream,
    csvParser(),
    new Writable({
      objectMode: true,
      write: (data, encoding, callback) => {
        const date = getDate(filename);
        const newData = preprocessRow(data, date);
        results.push(newData);
        callback();
      },
    })
  );

  return results;
}

export async function* extractFilesFromFolder(folder) {
  const files = await readdir(folder);

  //   if (!existsSync("./Equities/extractedFiles")) {
  //     await mkdir("./Equities/extractedFiles");
  //   }

  for (const fileName of files) {
    // Make sure we are only extracting files that are .zip files and
    // related to equities.
    if (fileName.startsWith("EQ") && fileName.endsWith(".ZIP")) {
      const file = fileName.split("_")[0];
      try {
        const result = await extractFile(file);
        yield { fileName, result };
      } catch (e) {
        console.error(`Err: ${e.message}`);
      }
    }
  }
}
