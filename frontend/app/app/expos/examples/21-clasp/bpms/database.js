/*
データベースクラス
*/
(function (global) { //即時実行
  var database = (
    function () { //即時実行

      /* object 作成 */
      function database() {

      };

      database.prototype.exec_Mysql = function (sql) {
        /* phpの場合も書いておけばいい

        */
        // #information_Schema
        //select * from `COLUMNS` where TABLE_NAME = "Eoc"
        var conn = Jdbc.getConnection('jdbc:mysql://chat.bpmboxes.com:3306/wf_workflow', 'admin', '1qaz2wsx3edc@@@');
        var stmt = conn.createStatement();
        var rs = stmt.execute(sql);

        stmt.close();
        conn.close();
        var end = new Date();
        return end;
        //Logger.log('Time elapsed: ' + (end.getTime() - start.getTime()));
      }

      database.prototype.write_to_sheet = function (database, table, sheet) {
        /* phpの場合も書いておけばいい

        */
        // InsertSheet1(table);
        var conn = Jdbc.getConnection('jdbc:mysql://chat.bpmboxes.com:3306/' + database + '?useUnicode=true&characterEncoding=UTF-8', 'admin', '1qaz2wsx3edc@@@');
        var stmt = conn.createStatement();
        //最大書き出し数
        stmt.setMaxRows(1000);
        //sql = 'SELECT * FROM INFORMATION_SCHEMA. COLUMNS WHERE TABLE_SCHEMA = "wf_officeone" AND TABLE_NAME = "USERS" ORDER BY TABLE_NAME';
        sql = "select * from " + table;
        var rs = stmt.executeQuery(sql);
        var doc = SpreadsheetApp.getActiveSpreadsheet();
        //var doc = SpreadsheetApp.openById('1IvJUL7faubds4VsWxysaBTGOGJ0X-qmOgUeyJa5xZVI').getSheetByName(table);//シート名
        var doc = doc.getActiveSheet();
        //doc.clear();
        var cell = doc.getRange("a1");
        var row = 0;
        /**
        @function 検索したデータの内容を　シートに書き出す
        */
        while (rs.next()) {
          for (var col = 1; col < rs.getMetaData().getColumnCount(); col++) {
            cell.offset(row, col - 1).setValue(rs.getString(col + 1));
          }
          row++;
        }

        rs.close();
        stmt.close();
        conn.close();
        var end = new Date();
        //Logger.log('Time elapsed: ' + (end.getTime() - start.getTime()));
      }

      database.prototype.insert_to_table = function (sheet) {
        var conn = Jdbc.getConnection('jdbc:mysql://chat.bpmboxes.com:3307/test?useUnicode=true&characterEncoding=UTF-8', 'admin', '1qaz2wsx3edc@@@');
        conn.setAutoCommit(false);

        var stmt = conn.createStatement();
        var start = new Date();

        var ss = SpreadsheetApp.getActiveSpreadsheet();
        //get data from spreadsheet
        var first = ss.getSheetByName(sheet);

        L50 = first.getRange('k50').getValue();
        P48 = first.getRange('P48').getValue();
        P49 = first.getRange('P49').getValue();
        P50 = first.getRange('P50').getValue();
        P51 = first.getRange('P51').getValue();
        P52 = first.getRange('P52').getValue();

        var ret = stmt.executeUpdate("insert PMT_SPREADMAIN (K50,P48,P49,P50,P51,P52) values(" + L50 + "," + P48 + "," + P49 + "," + P50 + "," + P51 + "," + P52 + ")");

        conn.commit();

        var rst = stmt.executeQuery("select id from PMT_SPREADMAIN ORDER BY id DESC limit 1");
        rst.next()
        var id = rst.getInt("id");
        Logger.log(String(id))

        var message = "[info]" +
          "[title]" + "店頭での成約となります。買取金額：" + L50.toLocaleString() + "[/title]" +
          "H=" + L50 + "\r\nK=" + P48 + "\r\nD=" + P49 + "\r\nJ=" + P50 + "\r\nW=" + P51 + "\r\nB=" + P52 +
          "[hr]顧客SEQ:" + "ここは本日どうするか　相談　でざこに顧客登録をさせるなど　顧客登録　＊＊＊＊　といれるとデータコピーなど\r\n" +
          "以下URLから登録してください。\r\n" +
          "https://urlounge.co.jp/shop5/Eoc_add.php" + "" +

          "[hr]下記のURLから確認をお願い致します" + "[hr]" +
          "https://chat.bpmboxes.com/phprunner/PMT_SPREADMAIN_list.php" + "[hr]" +
          "USER " + "58835960058e603e3eb05e1088090533" + "[hr]" +
          "PASS " + "2eafe31d784c13c03ce5c958373b7fb6" + "[hr]" +
          "SHEETURL https://docs.google.com/spreadsheets/d/13aoTcCT3fSvb4aF5lykT04zd1A-poPMm8ty8oZFmTdY/edit#gid=50529666" + "[hr]" +
          "ADDONURL https://chrome.google.com/webstore/detail/bpmboxes/flpphdladnemmfboejiclglghloibdij?utm_source=permalink" +
          "[/info]";
        Logger.log(message)

        postChatwork_light("", message)

        //postChatwork_light("",messages);

        var end = new Date();

        stmt.close();
        conn.close();
        // findRowIntoSQL("宝飾単価VLOOKUP33","PMT_INVOICE_ITEMS",id);
        //PMT_SPREADSUB
        findRowIntoSQL("宝飾単価VLOOKUP33", "PMT_SPREADSUB", String(id));

        Logger.log("Ret = %s", ret);
        return String(id)
        // ExecuteTimeToLog(start, end);
      }

      return database; //作成したオブジェクトを返す
    }
  )(); //引数なしの無名関数

  global.database = database;

})(this)


/************************************
スプレッドシート意書き出し
*************************************/

function WrittoTOSheet(database, table, sheet) {
  /* phpの場合も書いておけばいい

  */
  // InsertSheet1(table);
  var conn = Jdbc.getConnection('jdbc:mysql://35.202.19.58:3306/' + database + '?useUnicode=true&characterEncoding=UTF-8', 'admin', '1qaz2wsx3edc@@@AAA');
  var stmt = conn.createStatement();
  //最大書き出し数
  stmt.setMaxRows(10);
  //sql = 'SELECT * FROM INFORMATION_SCHEMA. COLUMNS WHERE TABLE_SCHEMA = "wf_officeone" AND TABLE_NAME = "USERS" ORDER BY TABLE_NAME';
  sql = "select * from " + table + " order by APP_NUMBER desc";
  var rs = stmt.executeQuery(sql);
  var doc = SpreadsheetApp.getActiveSpreadsheet();
  //var doc = SpreadsheetApp.openById('1IvJUL7faubds4VsWxysaBTGOGJ0X-qmOgUeyJa5xZVI').getSheetByName(table);//シート名
  var doc = doc.getActiveSheet();
  //doc.clear();
  var cell = doc.getRange("a1");
  var row = 0;
  /**
  @function 検索したデータの内容を　シートに書き出す
  */
  while (rs.next()) {
    for (var col = 1; col < rs.getMetaData().getColumnCount(); col++) {
      cell.offset(row, col - 1).setValue(rs.getString(col + 0));
    }
    row++;
  }

  rs.close();
  stmt.close();
  conn.close();
  var end = new Date();
  //Logger.log('Time elapsed: ' + (end.getTime() - start.getTime()));
}


/************************************
テーブルから検索
@paramst {string} searchWord 検索分
*************************************/