function testinsertSheetFusionTable() {
  insertSheetFusionTable("マニュアル")
}

/////////////
function insertSheetFusionTable(sheetName) {


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
    f = dat[i][4];


    sql = "insert into " + tableId + " (A,B,C,D,F) VALUES ('" + a + "','" + b + "','" + c + "','" + d + "','" + f + "')";
    var res = FusionTables.Query.sql(sql);
  }

  Logger.log(sql);
}


/************************************
スプレッドシート意書き出し
*************************************/
function testselectTable() {
  selectTable("wf_workflow", "PMT_SPREADSUB", "つぶし")
}


function selectTable(database, table, word) {
  /* phpの場合も書いておけばいい
  
  */
  // InsertSheet1(table);
  var conn = Jdbc.getConnection('jdbc:mysql://chat.bpmboxes.com:3306/' + database + '?useUnicode=true&characterEncoding=UTF-8', 'admin', '1qaz2wsx3edc@@@');
  var stmt = conn.createStatement();
  //最大書き出し数
  stmt.setMaxRows(1000);
  //sql = 'SELECT * FROM PMC_SPREADSUB WHERE B = //"wf_officeone" AND TABLE_NAME = "USERS" ORDER BY TABLE_NAME';
  sql = "select E from " +
    table +
    " where B like '%" +
    word +
    "%' or C like '%" +
    word +
    "%' or D like '%" +
    word +
    "%'";
  Logger.log(sql)
  var rs = stmt.executeQuery(sql);

  var row = 0;
  /**
  @function 検索したデータの内容を　シートに書き出す
  */
  while (rs.next()) {
    for (var col = 0; col < rs.getMetaData().getColumnCount(); col++) {
      res = rs.getString(col + 1);
      Logger.log(res)
    }
    //row++;
  }

  rs.close();
  stmt.close();
  conn.close();
  var end = new Date();
  //Logger.log('Time elapsed: ' + (end.getTime() - start.getTime()));
}