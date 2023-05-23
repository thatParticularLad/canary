let dialog;
let posX;
let posY;

const body = document.querySelector("body");

// Update mouse position post-click
body.addEventListener("mouseup", handleMouseup);

// Mouse up event handler function
function handleMouseup(event) {
  const selection = window.getSelection().toString();
  // Check if any text was selected
  if (selection.length > 0) {
    // Find out how much (if any) user has scrolled
    const scrollTop =
      window.pageYOffset !== undefined
        ? window.pageYOffset
        : (
            document.documentElement ||
            document.body.parentNode ||
            document.body
          ).scrollTop;

    // Get cursor position
    posX = event.clientX - 150;
    posY = event.clientY + 20 + scrollTop;
  }
}

const getImageName = (label) => (label === "FAKE" ? "warn.png" : "checked.png");

const rescale = (val, oMin, oMax, min, max) =>
  ((val - oMin) * (max - min)) / (oMax - oMin) + min;

function getDialogHTML(result) {
  const resultObj = { label: "", confidence: 0 };
  // Now a constant, but should be fetched form the user's settings
  // confidence percent to assign a class to text
  if (result <= 0.5) {
    const rescaled = rescale(result, 0.5, 0, 0, 1) * 100;
    new_value = rescaled.toFixed(2);
    resultObj.confidence = new_value;
    resultObj.label = "REAL";
  } else {
    const rescaled = rescale(result, 0.5, 1, 0, 1) * 100;
    new_value = rescaled.toFixed(2);
    resultObj.confidence = new_value;
    resultObj.label = "FAKE";
  }

  const assetPath = getImageName(resultObj.label);
  const iconURL = chrome.runtime.getURL(`assets/${assetPath}`);

  const dialogHtml = `
  <img src=${iconURL} alt="verdict-image" />
  <p>We're <span>${resultObj.confidence}%</span> sure it's ${resultObj.label}</p>
  `;

  return dialogHtml;
}

// // close dialog if it's open
window.addEventListener("click", () => {
  closeDialog(dialog);
});

const closeDialog = (dialog) => (dialog ? dialog.remove() : null);

function displayDialog(result) {
  const selection = window.getSelection();
  if (!selection) {
    console.log("Nothing was selected");
    return;
  }

  const dialogHtml = getDialogHTML(result);

  dialog = document.querySelector("#response-dialog");
  closeDialog(dialog);
  dialog = document.createElement("dialog");
  dialog.innerHTML = dialogHtml;
  console.log("DIALOG", dialog);
  dialog.id = "response-dialog";
  dialog.open = true;
  dialog.style = `position: absolute; top:${posY}px; left: ${posX}px;`;

  document.body.appendChild(dialog);
}

// HANDLE RESPONSE DATA FROM MODEL
chrome.runtime.onMessage.addListener((data) => {
  displayDialog(data);
  console.log("Message received!", data);
});
