let dialog;
let posX;
let posY;

const body = document.querySelector("body");

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

  const iconURL = chrome.runtime.getURL("assets/cool.png");
  const dialogHtml = `
  <img src=${iconURL} class="verdict-image" alt="" />
  <p>${result}</p>
  `;

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

// HANDLE mousemove
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
