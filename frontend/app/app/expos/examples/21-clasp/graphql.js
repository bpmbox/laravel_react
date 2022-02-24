/**
 * GitHubからissue一覧取得
 */
function getGitHubIssues() {
  var query = '{\
    repository(owner: "yosiakatsuki", name: "ystandard") { \
      name,\
      description,\
      issues(first: 10, states: OPEN){\
        totalCount,\
        nodes{\
          title\
        }\
      }\
    }\
  }';
  var options = {
    'method' : 'post',
    'contentType' : 'application/json',
    'headers' : {
      'Authorization' : 'Bearer ' +  ACCESS_TOKEN
     },
    'payload' : JSON.stringify({query:query})
  };
  var response = UrlFetchApp.fetch(ENDPOINT, options);
  var json = JSON.parse(response.getContentText());

  Logger.log(json);

  return ContentService.createTextOutput(JSON.stringify(json)).setMimeType(ContentService.MimeType.JSON);
}