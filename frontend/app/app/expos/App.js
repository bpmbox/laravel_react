import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  SafeAreaView,
  ScrollView,
  View,
  BackHandler,
} from "react-native";
import { Alert, Text, ListItem } from "react-native-elements";
import Constants from "expo-constants";
import { EXAMPLE_LIST } from "./example-list";
import { useWindowDimensions } from 'react-native';
import RenderHtml, { HTMLContentModel, defaultHTMLElementModels } from 'react-native-render-html';

function H1Renderer({
  TDefaultRenderer,
  ...props
}) {
  const onPress = () => alert('pressed!');
  return (
    <TDefaultRenderer
      {...props}
      onPress={onPress}
    />
  );
}

const tagsStyles = {
  article: {
    marginHorizontal: 10
  }
};

const source2 = {
  html: `
<article>
  <h1>Press me!</h1>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
    do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam.
  </p>
</article>
`
};

const renderers = {
  h1: H1Renderer
};

let a = "aaasaassa"
const source = {
  html: `<p style="text-align:center">
  <a href="https://www.google.com">aaaaaa</a>s
  <textbox>aa</textbox>
  Those are inline images!<br/><br/>
  <input type="password" name="pass" size="6" maxlength="4">
  <strong>${a}before</strong>
  <img src="https://www.fillmurray.com/50/50" width="50" height="50" />&nbsp;
  <img src="https://www.fillmurray.com/70/50" width="70" height="50" />&nbsp;
  <strong>after</strong>
<textbox>ssssssssssssssssssssaa</textbox>
  <a href="https://meliorence.github.io/react-native-render-html/docs/guides/custom-renderers">maji</a>
</p>
<table border=1>
<tr><tr>aaaaaaaaaddddddddddddddddaaaaaaaaaaaaaa</td></tr>
https://www.aizulab.com/blog/react-native-render-html/
https://snack.expo.dev/@miyataken999/001001333333333333main
</table>

`
};

const customHTMLElementModels = {
  img: defaultHTMLElementModels.img.extend({
    contentModel: HTMLContentModel.mixed
  })
};

//https://snack.expo.io/@narcis/custom-back-button カスタムバックボタン
export default function App() {
  const [exampleIndex, setExampleIndex] = useState(null);

  // Handle when user press Hardware Back Button
  useEffect(() => {
    const backAction = () => {
      // Go back to Example List
      if (exampleIndex !== null) {
        setExampleIndex(null);
      }
      // Exit app if user currently in Example List
      else {
        BackHandler.exitApp();
      }

      return true;
    };

    // https://reactnative.dev/docs/backhandler
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [exampleIndex]);

  if (exampleIndex !== null) return EXAMPLE_LIST[exampleIndex].component;

  return (
    <SafeAreaView style={styles.container}>
      <Text h4 style={styles.heading}>
        React Native Expo Examples
      </Text>
      <RenderHtml
        contentWidth={200}
        source={source2}
        customHTMLElementModels={customHTMLElementModels}
      />

      <ScrollView>
        {EXAMPLE_LIST.map((l, i) => (
          <ListItem key={i} bottomDivider onPress={() => setExampleIndex(i)}>
            <View>
              <Text>Level {l.level}</Text>
            </View>

            <ListItem.Content>
              <ListItem.Title style={styles.title}>{l.name}</ListItem.Title>
            </ListItem.Content>
          </ListItem>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Constants.statusBarHeight,
  },
  heading: {
    textAlign: "center",
    padding: 12,
  },
  title: {
    fontWeight: "bold",
  },
});
