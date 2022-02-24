function testselectFusion() {
  selectFusion("捜査関係")
}

function selectFusion(word) {
  var tableId = '15IlkQB-NG3ywHTP6-vlZCuizr666NFSp__qhbHYe';
  var sql = 'SELECT * FROM ' + tableId + " where B like '%" + word + "%'"; // OR C like '%"+word+"%'";// OR D like '%"+word+"%' OR E like '%"+word+"%'";
  var res = FusionTables.Query.sql(sql);

  for (var index = 0; index < res.rows.length; index++) {
    postChatwork_light("", res.rows[index][4])
    Logger.log("name = %s, value = %s, value = %s, value = %s, value = %s", res.rows[index][0], res.rows[index][1], res.rows[index][2], res.rows[index][3], res.rows[index][4]);
  }
}

function insertas() {
  var tableId = '12GSrqT7CvaA7hJzJIl3jU5is2xbRWdPrA2nPheqV';
  var sql = 'INSERT INTO ' + tableId + '(\'シェイプ\') VALUES (\'上海\')';
  var res = FusionTables.Query.sql(sql);
}


function insertIntoSheetToFuction() {
  //spreadshhet
  //getvalues



}

function testinsertSheetFusionTable() {
  insertSheetFusionTable("マニュアル")
}


function insertSheetFusionTable(sheetName) { //string:word
  //  var conn = Jdbc.getConnection('jdbc:mysql://chat.bpmboxes.com:3306/wf_workflow?useUnicode=true&characterEncoding=UTF-8', 'admin', '1qaz2wsx3edc@@@');
  //  var stmt = conn.createStatement();
  //  conn.setAutoCommit(false);

  var word = "";
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  var dat = sheet.getDataRange().getValues(); //受け取ったシートのデータを二次元配列に取得
  var tableId = '15IlkQB-NG3ywHTP6-vlZCuizr666NFSp__qhbHYe';

  for (var i = 0; i < dat.length; i++) {
    a = dat[i][0];
    b = dat[i][1];
    c = dat[i][2];
    d = dat[i][3];
    e = dat[i][4];


    //    var blob = Utilities.newBlob([a, b, c,d,e].join(','),
    //    'application/octet-stream');
    /// ret = FusionTables.Table.importRows(tableId, blob);

    Utilities.sleep(1000)

    sql = "insert into " + tableId + " (A,B,C,D,F) VALUES (\'" + a + "\',\'" + b + "\',\'" + c + "\',\'" + d + "\',\'" + e + "\')";
    Logger.log(sql);
    try {
      var res = FusionTables.Query.sql(sql);
    }
    catch (ex) {
      Logger.log(ex)
    }
  }


}
