# Canary

A browser extension that warns you about potential misinformation/fake news using english deep learning language models

## How it works

1. Click the extension icon
2. In the popup, click "select text element"
3. Once you've selected the text element, a query selector will be generated and saved for the current url (`window.location.hostname`).

> Note: currently only a single text element is supported

4. By default, a classification for the first instance of the selected text element will be generated. Note that this can be disabled via settings.

> Note: Classification results are more accurate with more text

5.
