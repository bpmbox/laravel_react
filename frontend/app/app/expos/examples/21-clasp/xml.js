function myFunctionXML() {
  var dataXml = SpreadsheetApp.getActive()
//.openById('1IvJUL7faubds4VsWxysaBTGOGJ0X-qmOgUeyJa5xZVI')
.getSheetByName('XML')
.getDataRange()
.getValues();

// XMLをパース
  var xml = XmlService.parse(dataXml[0][0]);
  var rootDoc = xml.getRootElement()
  
  var nsSoapenv = XmlService.getNamespace("x", "http://schemas.microsoft.com/winfx/2006/xaml");
 var nsSoapenv1 = XmlService.getNamespace("","http://schemas.microsoft.com/netfx/2009/xaml/activities")
 var sco = XmlService.getNamespace("sco","clr-namespace:System.Collections.ObjectModel;assembly=mscorlib")
  // 各データの要素を取得
  var entries = rootDoc.getChildren("Members",nsSoapenv)[0]//[0].getChild("String",nsSoapenv)//.getChildren("Property",nsSoapenv);

  var entries = rootDoc.getChildren("TextExpression.x",nsSoapenv1)[0].
  getChildren("Collection",sco)[0].
  getChildren("String",nsSoapenv)//[0].getValue()//.getChild("String",nsSoapenv)//.getChildren("Property",nsSoapenv);
// Logger.log(entries.toString())
  //

//var entries = rootDoc.getAllContent()
for(i=0;i<entries.length;i++){
Logger.log(entries[i].getValue())

}
 /*
Logger.log(entries[1].getValue())
Logger.log(entries[2])
Logger.log(entries[3])
Logger.log(entries[4])
Logger.log(entries[5])
Logger.log(entries[6])
Logger.log(entries[7])
Logger.log(entries[8])
Logger.log(entries[9])




//var entries = rootDoc.getChildren("TextExpression")
Logger.log(JSON.stringify(entries))
Logger.log(entries[0])
Logger.log(JSON.stringify(entries))
//output.append(entries)
  // 要素数を取得
  var length = entries.length;
 // output.append("length = "+length)
//output.append(entries.getText()) 
  // 取得したデータをループさせる
  for(var i = 0; i < length; i++) {
    // 記事タイトル
//output.append(entries[i].getText())
    
   // var title = entries[i].getChildText("Name");
 //output.append(title)
    // ログに出力
   // Logger.log(title);
  }
  */
}

//XML2JSONで処理をする
function xmlconvert(){
  //検索結果を取得する
  //var response = UrlFetchApp.fetch(sURL);
  var response = SpreadsheetApp.getActive()
//.openById('1IvJUL7faubds4VsWxysaBTGOGJ0X-qmOgUeyJa5xZVI')
.getSheetByName('XML')
.getDataRange()
.getValues();

//
  //JSONデータに変換する
  var jsondoc = xmlToJson(response[0][0]);

  //結果を出力する
  Logger.log(jsondoc);

}

//XMLをJSONに変換するとき利用する関数
function xmlToJson(xml) { 
  //XMLをパースして変換関数に引き渡し結果を取得する
  var doc = XmlService.parse(xml);
  var result = {};
  var root = doc.getRootElement();
  result[root.getName()] = elementToJson(root);
  return result;
}

//変換するメインルーチン
function elementToJson(element) {
  //結果を格納する箱を用意
  var result = {};

  // Attributesを取得する
  element.getAttributes().forEach(function(attribute) {
    result[attribute.getName()] = attribute.getValue();
  });

  //Child Elementを取得する
  element.getChildren().forEach(function(child) {
  //キーを取得する
  var key = child.getName();

  //再帰的にもう一度この関数を実行して判定
  var value = elementToJson(child);
  
  //XMLをJSONに変換する
  if (result[key]) {
    if (!(result[key] instanceof Array)) {
        result[key] = [result[key]];
      }
      result[key].push(value);
    } else {
      result[key] = value;
    }
  });

  //タグ内のテキストデータを取得する
  if (element.getText()) {
    result['Text'] = element.getText();
  }
  return result;
}