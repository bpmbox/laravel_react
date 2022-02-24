import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
// You can import from local files

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

export default function Apitest() {
//特徴検索設定
 const query1 = `
 query test($id:JSONString!){
  vwsearchFeature(jsonInput:$id){
    value
    featureType
    spaceId
  }
} `

/*
検索用クエリー
{
  "spaceid":  "{\"test\":\"51011eaa-8991-4276-a881-a9a12e59fb8a\",\"name\": \"51011eaa-8991-4276-a881-a9a12e59fb8a\",\"name2\": \"51011eaa-8991-4276-a881-a9a12e59fb8a\"}"

}
*/
const qa = {
  "spaceid":"814e1aa3-d128-4d3f-9054-501975030e2d",
  "name":"ddd",
  "name2":"ddd"
}

const sq = JSON.stringify(qa)
const val1 = {
 "id": sq
}
/**  
 * ルーム詳細検索設定
 */

//検索クエリー
const query2 = `
 query test($id:JSONString!){
  vwsearchroom(jsonInput:$id){
		roomId
    workspaceId
    workspaceName
    workplaceId
    workspaceName
    startTime
    endTime
    postCode
    prefectures
    address
    buildingName
    latitude
    longitude
    roomSet{
      roomName
      id
      roomId
      workspaceId
      workplaceId
      featureSet{
        featureId
        roomId
        value
        featureType
      }
    }
  }
}
`
/*
{
  "id":  "{\"test\":\"51011eaa-8991-4276-a881-a9a12e59fb8a\",\"workplace_id\": \"51011eaa-8991-4276-a881-a9a12e59fb8a\",\"name2\": \"51011eaa-8991-4276-a881-a9a12e59fb8a\"}"

}
*/
////////////////
const test = {
  "room_id":"7be5cc3c-5c29-4116-906f-25e1462e7bfe",
  "workplace_id":"c3a52999-6cb1-4850-bc6a-48316a648cd8",
  "space_id": "4223c88c-fe49-4013-aa2b-e984b8a19bc7"
  }

const sq1 = JSON.stringify(test)


/*
      
const val2 = {
  "id": sq1 ///
}.*/


    const val2 = {
      "id": JSON.stringify(test),
    }


//ルーム検索
const query3 = `
 query test($id:JSONString!){
  vwsearchroom(jsonInput:$id){
		roomId
    workspaceId
    workspaceName
    workplaceId
    workspaceName
    startTime
    endTime
    postCode
    prefectures
    address
    buildingName
    latitude
    longitude
    roomSet{
      roomName
      id
      roomId
      workspaceId
      workplaceId
      featureSet{
        featureId
        roomId
        value
        featureType
      }
    }
  }
}
//検索データを変更すれば自動で検索が変わります`
const qa3 = {
  "space_id":"51011eaa-8991-4276-a881-a9a12e59fb8a",
  "workplace_id":"51011eaa-8991-4276-a881-a9a12e59fb8a",
  "workplace_name": "51011eaa-8991-4276-a881-a9a12e59fb8a",
  "workplace_name_with_fuature": "51011eaa-8991-4276-a881-a9a12e59fb8a",
  "wcapacity": "51011eaa-8991-4276-a881-a9a12e59fb8a"
  }

const sq3 = JSON.stringify(test)
   
const val3 = {
  "id": sq3 
}

console.log(val3)

/**
 * 検索に”　が付くとエラーになるので　variavle の方にデータを設定
 */
 const result = fetch("https://api.dreamso.net/graphql", {
  "headers": {
    "accept": "*/*",
    "accept-language": "en-GB,en-US;q=0.9,en;q=0.8",
    "content-type": "application/json"
  },
  "referrer": "https://api.dreamso.net/graphql",
  "referrerPolicy": "strict-origin-when-cross-origin",
  "operationName":"",
  "variables":{},
  body: JSON.stringify({
    query: query2,
    variables: val2,
  }),
  "method": "POST",
  "mode": "cors"
}).then((res) => res.json())
  .then((result) => {
    //console.dir(result);
    console.log("//----------------------")
    console.log(JSON.stringify(result))//["data"]["vwsearchroom"]))
    console.log("//-----------------------")
    console.log(result["data"]["vwsearchroom"].length)
    let i = 0;
    console.log("startlllll")
    for(i=0;i<=result["data"]["vwsearchroom"].length;i++){
      console.log("start")
      console.log(result["data"]["vwsearchroom"][i].workspaceId)
      console.log(result["data"]["vwsearchroom"][i].featureType)
      console.log(result["data"]["vwsearchroom"][i].value)
      
      
    }
    });

////
  return (
    <View style={styles.container}>
      <Text style={styles.paragraph}>
        Change code in the editor and watch it change on your phone! Save to get a shareable url.
      </Text>
      <Card>
      
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#ecf0f1',
    padding: 8,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
