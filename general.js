
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class History {
  constructor() {
    this.historyList = [];
  }

  writeAddedElementsToHistory(gridId, addedElements) {
    const historyEntry = new HistoryEntry();
    historyEntry.addedElements = addedElements;
    historyEntry.gridId = gridId
    console.log('history: ' + addedElements.length + ' element(s) added (' + gridId + ')');
    this.historyList.push(historyEntry)
  }

  writeRemovedElementsToHistory(gridId, removedElements) {
    const historyEntry = new HistoryEntry();
    historyEntry.removedElements = removedElements;
    historyEntry.gridId = gridId
    console.log('history: ' + removedElements.length + ' element(s) removed (' + gridId + ')');    
    this.historyList.push(historyEntry)
  }

  pop() {
    if (this.historyList.length>0) {
      var latestEntry = this.historyList.at(-1);
      if (latestEntry.addedElements.length) {
        console.log('history undo: ' + latestEntry.removedElements.length + ' element(s) hidden (' + latestEntry.gridId + ')'); 
        hideElements(latestEntry.addedElements)        
      }  
      else if (latestEntry.removedElements.length) {        
        console.log('history undo: ' + latestEntry.removedElements.length + ' element(s) redrawn (' + latestEntry.gridId + ')'); 
        showElements(latestEntry.removedElements)      
      }
      this.historyList.pop();
    }
  }
}

class HistoryEntry {
  constructor() {
    this.addedElements = [];
    this.removedElements = [];
    this.gridId = [];
  }
}


function download(filename) {
  
  var text = draw.svg(function(node) {
    if (node.hasClass('gridpoint')) return false   // exclude gridpoints
  });

  // Create a Blob containing the text
  const blob = new Blob([text], { type: 'text/plain' });

  // Create a link element
  const link = document.createElement('a');

  // Set the download attribute with the filename
  link.download = filename;

  // Create a URL for the Blob and set it as the href attribute of the link
  link.href = URL.createObjectURL(blob);

  // Append the link to the document
  document.body.appendChild(link);

  // Trigger a click on the link to start the download
  link.click();

  // Remove the link from the document
  document.body.removeChild(link);
}

// Function to push values into the map based on a key
function pushValuesIntoMap(map, key, values) {
  // Check if the key exists in the map
  if (map.has(key)) {
    // If the key exists, push all values into the existing array
    map.get(key).push(...values);
  } else {
    // If the key doesn't exist, initialize a new array with the values
    map.set(key, [...values]);
  }
}


function showElements(svgElements) {
  // console.log('hideElement() [size=' + svgElements.size + ']');
  for (const elem of svgElements) {
    elem.show();
  }
}

function hideElements(svgElements) {
  // console.log('hideElement() [size=' + svgElements.size + ']');
  for (const elem of svgElements) {
    elem.hide();
  }
}

function removeElements(svgElements) {
  // console.log('removeElement() [size=' + svgElements.size + ']');
  for (const elem of svgElements) {
    elem.remove();     
  }
}

function removeAllElements() {
  // console.log('removeAllElements() [memoryMapSize=' + memoryMap.size + ']');
  for ([key, svgElementList] of memoryMap) {
    // console.log(svgElementList)
    removeElements(svgElementList)
  }
}

function undo() {
history.pop()
}


function r() {
  return Math.random()
}



function waitAsync(millis) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, millis);
  });
}

const delay = ms => new Promise(res => setTimeout(res, ms));

function inspireMeAnimation(durationInSeconds, drawEventsPerSecond, initialX, initialY) {
  // console.log(draw.x() + ' | ' + draw.y() + ' | ' + draw.width() + ' | ' + draw.height())
  // x = 220 + 600;
  // y = 400;
  var drawEventsPerSecond = 10;
  var delay = 1000.0/drawEventsPerSecond; // waiting time between events
  it = durationInSeconds*drawEventsPerSecond
  simulateClickEvent(initialX, initialY, delay, it)    
}

function simulateClickEvent(x, y, delay, it) {
  if (it<=0){
    return;
  }
  draw.fire('click', {'x': x - window.scrollX || window.pageXOffset, 'y': y - window.scrollY || window.pageYOffset});
  x = x + (Math.random()-0.5)*sidelen*2;
  y = y + (Math.random()-0.5)*height*2;  
  it -= 1;
  waitAsync(delay).then(() => {simulateClickEvent(x,y,delay, it)})
}

// Add keyboard shortcuts 
document.addEventListener('keydown', function(event) {
  // Check if the key pressed is 'Z' and the Ctrl key is also pressed (for undo)
  if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
    // Undo last action
    undo()
  }
  if (event.key === 'c' && (event.ctrlKey || event.metaKey)) {
    // Reset panel
    removeAllElements()
  }
});


const svgPaneWidth = 1510;
const svgPaneHeight = 2000;
const draw = SVG().addTo('#svg_container').size(svgPaneWidth, svgPaneHeight).addClass('svg_pane');
const memoryMap = new Map();
const history = new History();
const sidelen = 50;


  