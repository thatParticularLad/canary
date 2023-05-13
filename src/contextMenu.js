chrome.contextMenus.create({
  id: "1",
  title: "Check veracity of \"%s\"",
  contexts: ["selection"],
});

const callTitleModel = (info) => {
  const URL = "http://127.0.0.1:5000/lstm-text";
  const data = { text: info };
  postData(URL, data).then((data) => alert(data));
};

chrome.contextMenus.onClicked.addListener(function (info) {
  const text = info;
  callTitleModel(text);
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
