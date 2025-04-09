// netlify/functions/csv.js
const fs = require('fs');
const csv = require('csv-parser');

exports.handler = async function(event, context) {
  const results = {
    music_info: [],
    solo_live_data: [],
    multi_live_data_1: [],
    multi_live_data_2: []
  };

  // CSVファイルを読み込む関数
  const readCSV = (filePath) => {
    return new Promise((resolve, reject) => {
      const data = [];
      fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => data.push(row))
        .on('end', () => resolve(data))
        .on('error', (err) => reject(err));
    });
  };

  try {
    // 各CSVファイルを順番に読み込む
    results.music_info = await readCSV('./music_info.csv');
    results.solo_live_data = await readCSV('./solo_live_data.csv');
    results.multi_live_data_1 = await readCSV('./multi_live_data_1.csv');
    results.multi_live_data_2 = await readCSV('./multi_live_data_2.csv');

    return {
      statusCode: 200,
      body: JSON.stringify(results),  // 4つのCSVファイルの内容を1つのJSONで返す
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Error reading CSV files', details: err.message }),
    };
  }
};
