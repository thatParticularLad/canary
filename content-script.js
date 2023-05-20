let dialog;
const body = document.querySelector("body");

// close dialog if it's open
// window.addEventListener("click", () => {
//   if (dialog) {
//     dialog.remove();
//   }
// });

function displayDialog(result) {
  const selection = window.getSelection();
  if (!selection) {
    console.log("Nothing was selected");
    return;
  }

  const dialogHtml = `
  <p>${result}</p>
  `;

  dialog = document.querySelector("#response-dialog");
  if (dialog) {
    dialog.remove();
  }
  dialog = document.createElement("dialog");
  dialog.innerHTML = dialogHtml;
  dialog.id = "response-dialog";
  dialog.open = true;

  const range = selection.getRangeAt(0);
  const parent = range.commonAncestorContainer.parentNode;
  parent.appendChild(dialog);
  dialog.addEventListener("click", () => {
    dialog.remove();
  });

  // Receive click on context menu option
}

chrome.runtime.onMessage.addListener((data) => {
  displayDialog(data);
  console.log("Message received!", data);
});
