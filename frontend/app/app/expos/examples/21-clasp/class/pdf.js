function myFunction() {
  Logger.log(222222222)

  // PDFの保存先となるフォルダID 確認方法は後述
  var folderid = "1BH2Z3KpyJ5Ag5dM-Db3BIOk0EiTq0Y9X";

  // マイドライブ直下に保存したい場合は以下
  // var root= DriveApp.getRootFolder();
  // var folderid = root.getId();

  /////////////////////////////////////////////
  // 現在開いているスプレッドシートをPDF化したい場合//
  ////////////////////////////////////////////
  // 現在開いているスプレッドシートを取得


  var ss = SpreadsheetApp.getActiveSpreadsheet()
    //  return
    // 現在開いているスプレッドシートのIDを取得
  var ssid = ss.getId();

  // 現在開いているスプレッドシートのシートIDを取得
  var sheetid = ss.getActiveSheet().getSheetId();
  // getActiveSheetの後の()を忘れると、TypeError: オブジェクト function getActiveSheet() {/* */} で関数 getSheetId が見つかりません。
  Logger.log(sheetid)
    // ファイル名に使用する名前を取得
  var customer_name = ss.getRange("B1").getValue();
  // ここで例として使用しているスプレッドシートのC15に顧客の名前が入っているため、それをファイル名用に取得しているだけです。

  // ファイル名に使用するタイムスタンプを取得
  var timestamp = getTimestamp();

  // PDF作成関数
  createPDF(folderid, ssid, sheetid, customer_name + "_" + timestamp);

}

// PDF作成関数　引数は（folderid:保存先フォルダID, ssid:PDF化するスプレッドシートID, sheetid:PDF化するシートID, filename:PDFの名前）
function createPDF(folderid, ssid, sheetid, filename) {

  // PDFファイルの保存先となるフォルダをフォルダIDで指定
  var folder = DriveApp.getFolderById(folderid);

  // スプレッドシートをPDFにエクスポートするためのURL。このURLに色々なオプションを付けてPDFを作成
  var url = "https://docs.google.com/spreadsheets/d/SSID/export?".replace("SSID", ssid);

  // PDF作成のオプションを指定
  var opts = {
    exportFormat: "pdf", // ファイル形式の指定 pdf / csv / xls / xlsx
    format: "pdf", // ファイル形式の指定 pdf / csv / xls / xlsx
    size: "A4", // 用紙サイズの指定 legal / letter / A4
    portrait: "true", // true → 縦向き、false → 横向き
    fitw: "true", // 幅を用紙に合わせるか
    sheetnames: "false", // シート名をPDF上部に表示するか
    printtitle: "false", // スプレッドシート名をPDF上部に表示するか
    pagenumbers: "false", // ページ番号の有無
    gridlines: "false", // グリッドラインの表示有無
    fzr: "false", // 固定行の表示有無
    gid: sheetid // シートIDを指定 sheetidは引数で取得
  };

  var url_ext = [];

  // 上記のoptsのオプション名と値を「=」で繋げて配列url_extに格納
  for (optName in opts) {
    url_ext.push(optName + "=" + opts[optName]);
  }

  // url_extの各要素を「&」で繋げる
  var options = url_ext.join("&");

  // optionsは以下のように作成しても同じです。
  // var ptions = 'exportFormat=pdf&format=pdf'
  // + '&size=A4'
  // + '&portrait=true'
  // + '&sheetnames=false&printtitle=false'
  // + '&pagenumbers=false&gridlines=false'
  // + '&fzr=false'
  // + '&gid=' + sheetid;

  // API使用のためのOAuth認証
  var token = ScriptApp.getOAuthToken();

  // PDF作成
  var response = UrlFetchApp.fetch(url + options, {
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  //
  var blob = response.getBlob().setName(filename + '.pdf');

  //}

  //　PDFを指定したフォルダに保存
  folder.createFile(blob);

}

// タイムスタンプを返す関数
function getTimestamp() {
  var now = new Date();
  var year = now.getYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var min = now.getMinutes();
  // var sec = now.getSeconds();

  return year + "_" + month + "_" + day + "_" + hour + min;
}

// スプレッドシートのメニューからPDF作成用の関数を実行出来るように、「スクリプト」というメニューを追加。
function onOpen2() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var entries = [
    {
      name: "Create PDF",
      functionName: "myFunction"
        }
        ];
  sheet.addMenu("スクリプト", entries);
};
