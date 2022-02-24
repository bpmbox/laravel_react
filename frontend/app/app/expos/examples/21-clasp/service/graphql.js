const accessToken = ""//process.env.GITHUB_ACCESS_TOKEN || "";
const endpoint = "https://storybook.dreamso.net/v1/graphql";

const graphql = `
{
  wordpress_city {
    City
    CityID
    StateID
  }
}
`;

buildRequestOption = (graphql) => {
  return {
    method: "post",
    contentType: "application/json",
    payload: JSON.stringify({ query:graphql }),
  };
};


const getAssignedPullRequests = () => {
  const option = buildRequestOption(graphql);
  console.log(JSON.stringify(option))
  const res = UrlFetchApp.fetch(endpoint, option);
  console.log("--------------------------------------------")
  console.log(JSON.stringify(res))
  console.info(res)
  console.log("---------------------------------------")
  const json = JSON.parse(res.getContentText());
  console.log(json)
  return json;
};

//take from front end
//append into firebase
function tesGASaat(){
getAssignedPullRequests()
}


