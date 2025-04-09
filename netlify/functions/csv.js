// netlify/functions/csv.js
const https = require('https');
const csv = require('csv-parser');

// GitHubリポジトリ上のCSVファイルのURL
const githubCSVUrl = 'https://raw.githubusercontent.com/yourusername/sekai-csv-api/main/music_info.csv';

exports.handler = async function(event, context) {
  // CORSヘッダーの設定
  const headers = {
    'Access-Control-Allow-Origin': '*',  // 任意のオリジンを許可
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',  // 許可するHTTPメソッド
    'Access-Control-Allow-Headers': 'Content-Type',  // 許可するヘッダー
  };

  // CSVファイルの内容を格納するオブジェクト
  const results = {
    music_info: [],
    solo_live_data: [],
    multi_live_data_1: [],
    multi_live_data_2: []
  };

  // GitHubからCSVファイルを読み込む関数
  const readCSVFromGitHub = (url) => {
    return new Promise((resolve, reject) => {
      const data = [];
      https.get(url, (response) => {
        response
          .pipe(csv())
          .on('data', (row) => data.push(row))
          .on('end', () => resolve(data))
          .on('error', (err) => reject(err));
      });
    });
  };

  try {
    // GitHub上のCSVファイルを順番に読み込む
    results.music_info = await readCSVFromGitHub(githubCSVUrl);
    results.solo_live_data = await readCSVFromGitHub(githubCSVUrl2);
    results.multi_live_data_1 = await readCSVFromGitHub(githubCSVUrl3);
    results.multi_live_data_2 = await readCSVFromGitHub(githubCSVUrl4);

    return {
      statusCode: 200,
      headers: headers,  // CORSヘッダーを返す
      body: JSON.stringify(results),  // 4つのCSVファイルの内容を1つのJSONで返す
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: headers,  // CORSヘッダーを返す
      body: JSON.stringify({ error: 'Error reading CSV files', details: err.message }),
    };
  }
};
