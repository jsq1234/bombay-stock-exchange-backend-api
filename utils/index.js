export function preprocessRow(data, date) {
  const {
    SC_NAME,
    SC_CODE,
    OPEN,
    HIGH,
    LOW,
    CLOSE,
    LAST,
    PREVCLOSE,
    NO_TRADES,
    NO_OF_SHRS,
    NET_TURNOV,
  } = data;

  return {
    date: date,
    sc_name: SC_NAME.trimEnd(),
    sc_code: parseInt(SC_CODE, 10),
    open: parseFloat(OPEN),
    high: parseFloat(HIGH),
    low: parseFloat(LOW),
    close: parseFloat(CLOSE),
    last: parseFloat(LAST),
    prevclose: parseFloat(PREVCLOSE),
    no_trades: parseInt(NO_TRADES, 10),
    no_of_shrs: parseInt(NO_OF_SHRS, 10),
    net_turnov: parseFloat(NET_TURNOV),
  };
}

export function getFileName(date) {
  let temp = date.getDate();
  const day = temp < 10 ? "0" + String(temp) : String(temp);
  temp = date.getMonth() + 1;
  const month = temp < 10 ? "0" + String(temp) : String(temp);
  const year = date.getFullYear() % 100;

  const filename = `EQ${day}${month}${year}`;

  return filename;
}

export function getDate(filename) {
  const dateStr = filename.substring(2);
  const date = dateStr.substring(0, 2);
  const month = dateStr.substring(2, 4);
  let year = dateStr.substring(4);
  year = "20" + year;
  return `${year}-${month}-${date}`;
}

export async function trackExecutionTime(callback) {
  const startTime = new Date();
  await callback();
  const endTime = new Date();
  return endTime - startTime;
}

export function convertStockRecords(row) {
  return {
    ...row,
    sc_code: parseInt(row.sc_code),
    high: parseFloat(row.high),
    low: parseFloat(row.low),
    open: parseFloat(row.open),
    close: parseFloat(row.close),
    last: parseFloat(row.last),
    prevclose: parseFloat(row.prevclose),
    no_trades: parseInt(row.no_trades),
    no_of_shrs: parseInt(row.no_of_shrs),
    net_turnov: parseFloat(row.net_turnov),
  };
}

export async function executeQuery(callback) {
  const profiler = dbLog.startTimer();
  const db_results = await callback();
  profiler.done({ message: db_results.command });
  return db_results;
}
