// This plugin will open a modal to prompt the user to enter a number, and
// it will then create that many rectangles on the screen.

// This file holds the main code for the plugins. It has access to the *document*.
// You can access browser APIs in the <script> tag inside "ui.html" which has a
// full browser enviroment (see documentation).

// This shows the HTML page in "ui.html".
console.log('Code')
figma.showUI(__html__)
figma.ui.resize(400, 520)

function clone(val) {
  return JSON.parse(JSON.stringify(val))
}

figma.ui.onmessage = (msg) => {
  switch (msg.type) {
    case 'create-logo':
      const nodes = figma.currentPage.selection
      if (nodes.length > 0) {
        nodes.forEach((node) => {
          let image = figma.createImage(msg.imageArray)
          if (node.type !== 'SLICE' && node.type !== 'GROUP') {
            let fills = clone(node.fills)
            fills.push({ type: 'IMAGE', scaleMode: 'FILL', imageHash: image.hash })
            node.fills = fills
          }
        })
      } else {
        figma.notify('Please select a layer')
      }
      break

    case 'error':
      // console.log(msg.e);
      // figma.notify(msg.e);
      break
    case 'cancel':
      figma.closePlugin()
      break
    default:
      break
  }
}
