import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Constants from 'expo-constants';
// You can import from local files

// or any pure javascript modules available in npm
import { Card } from 'react-native-paper';

export default function Apitest() {

const query1 = `query{
  vwsearchFeature(jsonInput:"{\"spaceid\":\"814e1aa3-d128-4d3f-9054-501975030e2d\",\"name\": \"施設情報\",\"name2\": \"特徴抽出　search room by json object\"}"){
    value
    featureType
    spaceId
  }
}`


const query2 = `query test($id:JSONString!){
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
}`

const val1 = `
{
  "id":  "{\"roomid\":\"51011eaa-8991-4276-a881-a9a12e59fb8a\",\"workplace_id\": \"51011eaa-8991-4276-a881-a9a12e59fb8a\",\"name2\": \"51011eaa-8991-4276-a881-a9a12e59fb8a\"}"
}

`

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
    query: `
 query{
  vwsearchFeature(jsonInput:"{\"spaceid\":\"814e1aa3-d128-4d3f-9054-501975030e2d\",\"name\": \"施設情報\",\"name2\": \"特徴抽出　search room by json object\"}"){
    value
    featureType
    spaceId
  }
}
      `,
    variables: {
  "id": "b9461ca1-8eb2-48c0-b24d-ee5b66ab07bb"
},
  }),
  "method": "POST",
  "mode": "cors"
}).then((res) => res.json())
  .then((result) => {
    console.log(JSON.stringify(result["data"]["feature"]))
    console.log(result["data"]["feature"].length)
    let i = 0;
    console.log("startlllll")
    for(i=0;i<=result["data"]["feature"].length;i++){
      console.log("start")
      console.log(result["data"]["feature"][i].workspaceId)
      console.log(result["data"]["feature"][i].featureType)
      console.log(result["data"]["feature"][i].value)
      
      
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
