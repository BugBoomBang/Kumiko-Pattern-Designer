
// // init: slider - element size
// var sliderElementSize = document.getElementById("slider_element_size");
// var sliderElementSizeValueText = document.getElementById("slidervalue_element_size");
// sliderElementSizeValueText.innerHTML = sliderElementSize.value; // Display the default slider value

// init: slider - triangle stroke width
var sliderTriangleStrokeWidth = document.getElementById("slider_triangle_stroke_width");
var sliderTriangleStrokeWidthValueText = document.getElementById("slidervalue_triangle_stroke_width");
sliderTriangleStrokeWidthValueText.innerHTML = sliderTriangleStrokeWidth.value; // Display the default slider value

// init: slider - pattern stroke width
var sliderPatternStrokeWidth = document.getElementById("slider_pattern_stroke_width");
var sliderPatternStrokeWidthValueText = document.getElementById("slidervalue_pattern_stroke_width");
sliderPatternStrokeWidthValueText.innerHTML = sliderPatternStrokeWidth.value; // Display the default slider value



// main settings 
// var sidelen = parseInt(sliderElementSize.value);
var height = sidelen * Math.cos(Math.PI / 6);
draw.data('attrTriangle', {
  fill: 'none', 
  stroke: 'black',
  'stroke-width': sliderTriangleStrokeWidth.value,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
});
draw.data('attrPattern', {
  fill: 'none', 
  stroke: 'black',
  'stroke-width': sliderPatternStrokeWidth.value,
  'stroke-linecap': 'round',
  'stroke-linejoin': 'round'
});

// // Update the slider value each time the slider handle is dragged
// sliderElementSize.oninput = function() {
//   sliderElementSizeValueText.innerHTML = this.value;
//   sidelen = parseInt(this.value);
//   height = sidelen * Math.cos(Math.PI / 6);
// } 

// Update the slider value each time the slider handle is dragged
sliderTriangleStrokeWidth.oninput = function() {
  sliderTriangleStrokeWidthValueText.innerHTML = this.value;
  strokeWidthTriangle = parseInt(this.value);
  var attr = draw.data('attrTriangle');
  attr['stroke-width'] = strokeWidthTriangle;
  draw.data('attrTriangle', attr);
} 

// Update the slider value each time the slider handle is dragged
sliderPatternStrokeWidth.oninput = function() {
  sliderPatternStrokeWidthValueText.innerHTML = this.value;  
  strokeWidthPattern = parseInt(this.value);
  var attr = draw.data('attrPattern');
  attr['stroke-width'] = strokeWidthPattern;
  draw.data('attrPattern', attr);
} 



// Assuming you have the form element containing the radio buttons
var form = document.querySelector('form');

// Add an event listener to the form to detect changes in the radio button group
form.addEventListener('change', function() {
  // Get the selected radio button within the group
  var selectedOption = form.querySelector('input[name="kumiko_pattern"]:checked');

  // Check if an option is selected and retrieve its value
  if (selectedOption) {
    var selectedValue = selectedOption.value;
    console.log('Selected Value:', selectedValue);
  }

  var gridCheckbox = form.querySelector('input[name="grid"]:checked');
  if (gridCheckbox) {
    showGrid();
  }
  else {
    hideGrid();
  }

});

function getCurrentKumikoPattern() {
  return form.querySelector('input[name="kumiko_pattern"]:checked').value
}

function initGrid(circleDiameter) {
  radius = circleDiameter / 2;
  for (var col = 0; col<svgPaneWidth/sidelen; col++) {
    for (var row = 0; row<svgPaneHeight/height; row++) {
      // draw point
      x_offset = col * sidelen - (row % 2) * sidelen / 2;  // every second row has an additional x-offset of a half triangle sidelength
      y_offset = row * height;

      var circle = draw.circle(circleDiameter).move(x_offset-radius, y_offset-radius);
      circle.addClass('gridpoint')
    }
  }
}

function showGrid() {
  document.querySelectorAll('.gridpoint').forEach(it => { it.style.visibility = 'visible'} );
}

function hideGrid() {
  document.querySelectorAll('.gridpoint').forEach(it => { it.style.visibility = 'hidden'} );
}

initGrid(2);
showGrid();

// Create an map for remembering the svg objects in the pane
var modeSelector = document.getElementById('mode');

draw.click(function(event) {
  console.log('click event received')

  // clickPoint = draw.point(event.pageX, event.pageY)

  var scrollX = (window.scrollX || window.pageXOffset);
  var scrollY = window.scrollY || window.pageYOffset;

  if (event instanceof MouseEvent) {
    clickPoint = new Point(event.x+ scrollX -220, event.y+ scrollY)
  } else if (event.detail) {
    clickPoint = new Point(event.detail.x+ scrollX -220, event.detail.y+ scrollY)
  } else {
    console.error('Click event coordinates not found. Ignoring click.')
    return;
  }

  // console.log('event: x:' + event.x + ', y:' + event.y);
  // console.log('clickPoint: x:' + clickPoint.x + ', y:' + clickPoint.y);
  // console.log('height: ' + Math.round(height));
  // console.log(Math.round(clickPoint.y/height))
  // console.log(draw.node.getBoundingClientRect())
  // console.log('clientX/clientY: x:' + event.clientX + ', y:' + event.clientY);


  if (modeSelector.value === 'INSPIRE_ME' && event instanceof MouseEvent) {
    inspireMeAnimation(5, 10,clickPoint.x+220, clickPoint.y);    
    return;
  }


  // rastersize pane into a rectangular grid (x-spacing: triangle sidelength, y-spacing: triangle height) and get the respective row and column index
  row = Math.floor(clickPoint.y/height)
  col = Math.floor((clickPoint.x + (row % 2) * sidelen / 2) / sidelen)

  // console.log('col:' + col)
  // console.log('row:' + row)

  // calculate the actuall x and y offset based on the row and column
  x_offset = col * sidelen - (row % 2) * sidelen / 2;  // every second row has an additional x-offset of a half triangle sidelength
  y_offset = row * height;

  // console.log('x_offset:' + x_offset);
  // console.log('y_offset:' + y_offset);

  point_rect_upper_left = new Point(x_offset, y_offset);
  point_rect_upper_right = new Point(x_offset+sidelen, y_offset);
  point_rect_lower_middle = new Point(x_offset+sidelen/2, y_offset+height);

  // circle_diameter = 10;
  // radius = circle_diameter/2;
  // console.log('rect_upper_left: x=' + point_rect_upper_left.x + ' y=' + point_rect_upper_left.y)
  // draw.circle(circle_diameter).move(point_rect_upper_left.x-radius, point_rect_upper_left.y-radius);

  // console.log('rect_upper_right: x=' + point_rect_upper_right.x + ' y=' + point_rect_upper_right.y)
  // draw.circle(circle_diameter).move(point_rect_upper_right.x-radius, point_rect_upper_right.y-radius).attr({fill: 'green'});

  // console.log('rect_lower_middle: x=' + point_rect_lower_middle.x + ' y=' + point_rect_lower_middle.y)
  // draw.circle(circle_diameter).move(point_rect_lower_middle.x-radius, point_rect_lower_middle.y-radius).attr({fill: 'red'});


  var line1_p1 = point_rect_upper_left;
  var line1_p2 = point_rect_lower_middle;
  let line1_slope_a = (line1_p2.y - line1_p1.y) / (line1_p2.x - line1_p1.x);
  let line1_offset_b = line1_p2.y - line1_slope_a * line1_p2.x;        
  // console.log("line1_slope_a=" + line1_slope_a);
  // console.log("line1_offset_b=" + line1_offset_b);

  var line2_p1 = point_rect_upper_right;
  var line2_p2 = point_rect_lower_middle;
  let line2_slope_a = (line2_p2.y - line2_p1.y) / (line2_p2.x - line2_p1.x);
  let line2_offset_b = line2_p2.y - line2_slope_a * line2_p2.x;        
  // console.log("line2_slope_a=" + line2_slope_a);
  // console.log("line2_offset_b=" + line2_offset_b);


  var y_line1_at_clicked_point = line1_slope_a * clickPoint.x + line1_offset_b;
  var y_line2_at_clicked_point = line2_slope_a * clickPoint.x + line2_offset_b;

  let triangle_point1, triangle_point2, triangle_point3, triangle_centroid;

  if (clickPoint.y > y_line1_at_clicked_point) {
    // case 1: point belongs to left triangle
    // console.log('// case 1: point belongs to left triangle')
    triangle_point1 = point_rect_upper_left;
    triangle_point2 = point_rect_lower_middle;
    triangle_point3 = new Point(point_rect_lower_middle.x-sidelen, point_rect_lower_middle.y);
    triangle_centroid = new Point(point_rect_lower_middle.x - sidelen / 2, point_rect_lower_middle.y - height / 3);  
  }
  else if (clickPoint.y > y_line2_at_clicked_point) {
    // case 3: point belongs to left triangle
    // console.log('// case 3: point belongs to right triangle')
    triangle_point1 = point_rect_upper_right;
    triangle_point2 = point_rect_lower_middle;
    triangle_point3 = new Point(point_rect_lower_middle.x+sidelen, point_rect_lower_middle.y);  
    triangle_centroid = new Point(point_rect_lower_middle.x + sidelen / 2, point_rect_lower_middle.y - height / 3);  
  }
  else {
    // case 2: point belongs to left triangle
    // console.log('// case 2: point belongs to middle triangle')
    triangle_point1 = point_rect_upper_left;
    triangle_point2 = point_rect_upper_right;
    triangle_point3 = point_rect_lower_middle;   
    triangle_centroid = new Point(point_rect_upper_left.x + sidelen / 2, point_rect_upper_left.y + height / 3);
  }


  triangleId = getTriangleId(triangle_point1, triangle_point2, triangle_point3)
  if (getCurrentKumikoPattern() === 'delete_single_pattern') {
      // delete patterns at clicked region
      history.writeRemovedElementsToHistory(triangleId, memoryMap.get(triangleId));
      hideElements(memoryMap.get(triangleId)); 
      return;   
  }

  var triangle = drawPolyline([triangle_point1, triangle_point2, triangle_point3, triangle_point1], draw.data('attrTriangle'))
  pushValuesIntoMap(memoryMap, triangleId, [triangle]);

  var svg_elements;
  var attr = draw.data('attrPattern');
  switch(getCurrentKumikoPattern()) {
    case 'asanoha':
      svg_elements = draw_inlay_asanoha(triangle_point1, triangle_point2, triangle_point3, triangle_centroid, attr); 
      // add svg_elements to map (in order to be able to delete it later on)  
      svg_elements.push(triangle);
      pushValuesIntoMap(memoryMap, triangleId, svg_elements);      
      history.writeAddedElementsToHistory(triangleId, svg_elements);
      break;
    case 'kagome':
      svg_elements = draw_inlay_kagome(triangle_point1, triangle_point2, triangle_point3, triangle_centroid, attr); 
      // add svg_elements to map (in order to be able to delete it later on)  
      svg_elements.push(triangle);
      pushValuesIntoMap(memoryMap, triangleId, svg_elements);      
      history.writeAddedElementsToHistory(triangleId, svg_elements);
      break;
    case 'kasana_rindo':
      svg_elements = draw_inlay_kasane_rindo(triangle_point1, triangle_point2, triangle_point3, triangle_centroid, attr); 
      // add svg_elements to map (in order to be able to delete it later on)  
      svg_elements.push(triangle);
      pushValuesIntoMap(memoryMap, triangleId, svg_elements);      
      history.writeAddedElementsToHistory(triangleId, svg_elements);
      break;
    case 'tsumiishi_kikko':
      svg_elements = draw_inlay_tsumiishi_kikko(triangle_point1, triangle_point2, triangle_point3, triangle_centroid, attr); 
      // add svg_elements to map (in order to be able to delete it later on)  
      svg_elements.push(triangle);
      pushValuesIntoMap(memoryMap, triangleId, svg_elements);      
      history.writeAddedElementsToHistory(triangleId, svg_elements);
      break;
    case 'goma':
      svg_elements = draw_inlay_goma(triangle_point1, triangle_point2, triangle_point3, triangle_centroid, attr); 
      // add svg_elements to map (in order to be able to delete it later on)  
      svg_elements.push(triangle);
      pushValuesIntoMap(memoryMap, triangleId, svg_elements);      
      history.writeAddedElementsToHistory(triangleId, svg_elements);
      break;
    case 'yae_urahana_kikkou':
      svg_elements = draw_inlay_yae_urahana_kikkou(triangle_point1, triangle_point2, triangle_point3, triangle_centroid, attr); 
      // add svg_elements to map (in order to be able to delete it later on)  
      svg_elements.push(triangle);
      pushValuesIntoMap(memoryMap, triangleId, svg_elements);      
      history.writeAddedElementsToHistory(triangleId, svg_elements);
      break;
    case 'triangle_frame':
      svg_elements = [triangle];
      pushValuesIntoMap(memoryMap, triangleId, svg_elements);      
      history.writeAddedElementsToHistory(triangleId, svg_elements);
      break;    
    default:
      console.log('unknown kumiko pattern: ' + getCurrentKumikoPattern())
    
  }

  // console.log('point is in rectangle xIdx=' + row + " yIdx=" + col)

});


function getTriangleId(triangle_point1, triangle_point2, triangle_point3) {
  return triangle_point1.x + '-' + triangle_point1.y + '-' + triangle_point2.x + '-' + triangle_point2.y + '-' + triangle_point3.x + '-' + triangle_point3.y;
}

function drawPolyline(pointList, attributes) {

  polylinePointlist = []
  for (const p of pointList) {
    polylinePointlist.push([p.x, p.y]) 
  }

  // draw polyline
  return draw.polyline(polylinePointlist).attr(attributes)
}

function draw_inlay_tsumiishi_kikko(triangle_p1, triangle_p2, triangle_p3, triangle_centroid, attr) {
  var pattern = drawPolyline([getIntermediatePoint(triangle_p1, triangle_p2, 0.5), triangle_centroid, getIntermediatePoint(triangle_p2, triangle_p3, 0.5), triangle_centroid, getIntermediatePoint(triangle_p1, triangle_p3, 0.5)], attr);
  return [pattern];
}

function draw_inlay_asanoha(triangle_p1, triangle_p2, triangle_p3, triangle_centroid, attr) {
  var pattern = drawPolyline([triangle_p1, triangle_centroid, triangle_p2, triangle_centroid, triangle_p3], attr);
  return [pattern];
}

function draw_inlay_kagome(triangle_p1, triangle_p2, triangle_p3, triangle_centroid, attr) {
  // // component 1
  var corner1_point1 = getIntermediatePoint(triangle_p1, triangle_p2, 1.0/3)
  var corner1_point2 = getIntermediatePoint(triangle_p1, triangle_p3, 1.0/3)
  var line1 = draw.line(corner1_point1.x, corner1_point1.y, corner1_point2.x, corner1_point2.y).attr(attr);
  // // component 2
  var corner2_point1 = getIntermediatePoint(triangle_p2, triangle_p1, 1.0/3)
  var corner2_point2 = getIntermediatePoint(triangle_p2, triangle_p3, 1.0/3)
  var line2 = draw.line(corner2_point1.x, corner2_point1.y, corner2_point2.x, corner2_point2.y).attr(attr);
  // component 3
  var corner3_point1 = getIntermediatePoint(triangle_p3, triangle_p1, 1.0/3)
  var corner3_point2 = getIntermediatePoint(triangle_p3, triangle_p2, 1.0/3)
  var line3 = draw.line(corner3_point1.x, corner3_point1.y, corner3_point2.x, corner3_point2.y).attr(attr)

  return [line1, line2, line3];
}

function draw_inlay_kasane_rindo(triangle_p1, triangle_p2, triangle_p3, triangle_centroid, attr) {
  // // component 1
  var p1 = getIntermediatePoint(triangle_p3, triangle_p2, 1.0/4)
  var line1 = draw.line(triangle_p1.x, triangle_p1.y, p1.x, p1.y).attr(attr);
  // // component 2
  var p1 = getIntermediatePoint(triangle_p3, triangle_p1, 1.0/4)
  var line2 = draw.line(triangle_p2.x, triangle_p2.y, p1.x, p1.y).attr(attr);

  return [line1, line2];
}

function draw_inlay_goma(triangle_p1, triangle_p2, triangle_p3, triangle_centroid, attr) {
  // line 1
  var p1 = getIntermediatePoint(triangle_p2, triangle_p1, 0.2)
  var p2 = getIntermediatePoint(triangle_p3, triangle_p1, 0.2)
  var line1 = draw.line(p1.x, p1.y, p2.x, p2.y).attr(attr);
  // line 2
  var p1 = getIntermediatePoint(triangle_p1, triangle_p2, 0.2)
  var p2 = getIntermediatePoint(triangle_p3, triangle_p2, 0.2)
  var line2 = draw.line(p1.x, p1.y, p2.x, p2.y).attr(attr);
    // line 3
  var p1 = getIntermediatePoint(triangle_p1, triangle_p3, 0.2)
  var p2 = getIntermediatePoint(triangle_p2, triangle_p3, 0.2)
  var line3 = draw.line(p1.x, p1.y, p2.x, p2.y).attr(attr);

  return [line1, line2, lilne3];
}

function draw_inlay_yae_urahana_kikkou(triangle_p1, triangle_p2, triangle_p3, triangle_centroid, attr) {

  s1 = 0.66
  s2 = 1.33

  var p1 = getIntermediatePoint(triangle_p1, triangle_centroid, s1)
  var p2 = getIntermediatePoint(triangle_p1, triangle_centroid, s2)

  var p3 = getIntermediatePoint(triangle_p2, triangle_centroid, s1)
  var p4 = getIntermediatePoint(triangle_p2, triangle_centroid, s2)
  
  var p5 = getIntermediatePoint(triangle_p3, triangle_centroid, s1)
  var p6 = getIntermediatePoint(triangle_p3, triangle_centroid, s2)  
  
  var line1 = draw.line(triangle_p1.x, triangle_p1.y, p1.x, p1.y).attr(attr);
  var line2 = draw.line(triangle_p2.x, triangle_p2.y, p3.x, p3.y).attr(attr);
  var line3 = draw.line(triangle_p3.x, triangle_p3.y, p5.x, p5.y).attr(attr);

  var polyline = drawPolyline([p1, p4, p5, p2, p3, p6, p1], attr);

  return [line1, line2, line3];
}

function getIntermediatePoint(point1, point2, frac) {
  return new Point(point1.x + frac*(point2.x-point1.x), point1.y + frac*(point2.y-point1.y));
}


