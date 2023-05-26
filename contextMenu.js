"use strict";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create(
    {
      id: "checkVeracity",
      title: 'Check veracity of "%s"',
      contexts: ["selection"],
    },
    () => chrome.runtime.lastError
  );
});
function onError(error) {
  console.error(`Error: ${error}`);
}

const parseApiResponse = (data) => {
  const regex = /[0-9]*\.[0-9]+/i;
  const [matchingData] = data.match(regex);
  return Number(matchingData);
};

async function getClassificationResult(info) {
  const URL = "https://flask-model-api.herokuapp.com/lstm-text";
  const { selectionText } = info;
  const data = await postData(URL, selectionText);

  return data;
}

chrome.contextMenus.onClicked.addListener(async (info, tabs) => {
  const classification = await getClassificationResult(info);
  // what contentScript listens for
  const predictionNumber = parseApiResponse(classification.prediction);
  console.log("CLASSIFICACTION", predictionNumber);

  // Send message
  chrome.tabs.sendMessage(tabs.id, predictionNumber);
});

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
