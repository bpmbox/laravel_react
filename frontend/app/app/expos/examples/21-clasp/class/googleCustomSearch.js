function testGOOGLESEARCHAPI() {
  var word = encodeURIComponent("送料は無料??")
  GOOGLESEARCHAPI("ブランド")
}
//setting
function GOOGLESEARCHAPI(word) {
  word = encodeURIComponent(word)
    //  var url = ‘https://www.googleapis.com/customsearch/v1?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&rsz&cx=【*2 検索エンジンID（cx）の値】&q=【検索ワード】’;
    //var response = UrlFetchApp.fetch(url);
    //var json = response.getContentText();
    //var data = JSON.parse(json);
    //Logger.log(response);//ログに取得したデータを表示
    //ひとつめのタイトルの場合こんな感じ→ Logger.log(data.items[0].title);

  var url = "https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY" +
    "&rsz=filtered_cse&num=10" +
    "&hl=ja&prettyPrint=false&source=gcsc&gss=.jp" +
    "&sig=c2209932f49d54b1ddc575672079011e" +
    "&cx=015479686609644248070:yxsk24pgfvq&" +
    "q=" + word +
    "&cse_tok=ABPF6Hg5S9HPUrAC26a-A8AExx15MukM0w:1527934273000" +
    "&sort=&googlehost=www.google.com&oq=%E3%83%80%E3%82%A4%E3%83%A4%E3%80%80%E8%B2%B7%E5%8F%96&gs_l=partner-generic.12...23908.27564.2.31672.15.10.0.0.0.0.0.0..0.0.gsnos%2Cn%3D13...0.27592j576996166j16j2..1ac.1j4.25.partner-generic..45.0.0.&callback=google.search.Search.apiary13883&nocache=1527392998930";



  var url = "https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY" +
    "&rsz=filtered_cse&num=10" +
    "&hl=ja&prettyPrint=false&source=gcsc&gss=.com" +
    "&sig=4aa0772189af4c17ea7ec181af2bca15" +
    "&cx=015479686609644248070:yxsk24pgfvq" +
    "&q=" + word +
    "&cse_tok=ABPF6HhMKgn9mY6BKu-JHBse3c3n3EaaOg:1528277263106" +
    "&sort=&googlehost=www.google.com" +
    "&oq=%E3%83%96%E3%83%A9%E3%83%B3%E3%83%89" +
    "&gs_l=partner-generic.12...17896.19003.1.23172.9.9.0.0.0.3.147.817.6j3.9.0.gsnos%2Cn%3D13...0.984j141414j9..1ac.1j4.25.partner-generic..10.1.94.qnztKvfn44Q&callback=google.search.Search.apiary3534&nocache=1528277260144";


  var url = "https://www.googleapis.com/customsearch/v1element?key=AIzaSyCVAXiUzRYsML1Pv6RwSG1gunmMikTzQqY&rsz=filtered_cse&num=10&hl=ja&prettyPrint=false&source=gcsc&gss=.com&sig=4aa0772189af4c17ea7ec181af2bca15&cx=017457217203888637458:h8skwhnhk04&" +
    "q=" + word + "&cse_tok=ABPF6HirMU1o3b4ZXVWlVENKWpeL5-E42A:1528922889628&sort=date&googlehost=www.google.com&callback=google.search.Search.apiary16434&nocache=1528922893732"


  //var url2 = "https://www.googleapis.com/customsearch/v1element"
  var payload = {

  };

  var headers = {
    'authority': 'www.googleapis.com',
    'cache-control': 'max-age=0',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.181 Safari/537.36',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'x-client-data': 'CIu2yQEIo7bJAQjBtskBCKmdygEIqKPKAQ==',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'ja,en-US;q=0.9,en;q=0.8',
    'if-none-match': "Dt6BbyzIrl7S7kqhuwm6f8IHaLI/Cw_gp1fzQpcC5urShXU72smAQbk"
  };

  var options = {
    "method": "GET",
    //    "payload": payload,
    "headers": headers
  };

  Logger.log("start")

  // try{

  var response = UrlFetchApp.fetch(url) //, options);
    // c = c.string()
    //c = c.replace("// API callbackgoogle.search.Search.apiary13883", "");

  // for(i in response) {
  //Logger.log(i + ": " + response[i]);
  // }
  _json = response.getContentText()
  _json = _json.replace("// API callback", "")
  _json = _json.replace("google.search.Search.apiary16434(", "")
    // =google.search.Search.apiary3534
  _json = _json.replace(");", "")

  // Logger.log(_json)
  //  console.log(c.getContent())
  Logger.log(_json)
    //  return
  data2 = JSON.parse(_json)

  //Logger.log("length = ". length
  var allword = ""
  try {
    for (i = 0; i < data2.results.length; i++) {
      //  for(i=0;i<5;i++){
      chatworksend = "" +
        "􀁸" + data2.results[i].titleNoFormatting + "\r\n􀁸" +
        data2.results[i].contentNoFormatting + "\r\n\r\n" +
        data2.results[i].unescapedUrl +
        "\r\n\r\n";
      allword = allword + chatworksend
        //postChatwork_light("",chatworksend)

      // Logger.log(chatworksend)
    }
  }
  catch (ex) {
    Logger.log(ex)
  }
  // Logger.log("===========================================")
  // Logger.log(allword)
  postChatwork_light("", allword)
    //Logger.log(data2.results[0].contentNoFormatting)
  return allword
    //return "chatwork 38";//UrlFetchApp.fetch("https://api.chatwork.com/v2/rooms/" + roomId + "/messages", options);
    //  }catch(ex){
    //   console.log(ex);
    // }

}
