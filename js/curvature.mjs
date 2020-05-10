const warp_canvas = document.createElement("canvas"),
  warp_context = warp_canvas.getContext("2d");

var warp_percentage_input = 0.06;

function getQuadraticBezierXYatT(start_point, control_point, end_point, T) {
  var pow1minusTsquared = Math.pow(1 - T, 2),
    powTsquared = Math.pow(T, 2);
  var x =
      pow1minusTsquared * start_point.x +
      2 * (1 - T) * T * control_point.x +
      powTsquared * end_point.x,
    y =
      pow1minusTsquared * start_point.y +
      2 * (1 - T) * T * control_point.y +
      powTsquared * end_point.y;
  return {
    x: x,
    y: y,
  };
}

function warpVertically(image_to_warp, invert_curve) {
  var image_width = image_to_warp.width,
    image_height = image_to_warp.height,
    warp_percentage = parseFloat(warp_percentage_input, 10),
    warp_y_offset = warp_percentage * image_height;
  console.log(image_height, image_width);
  warp_canvas.width = image_width;
  warp_canvas.height = image_height + Math.ceil(warp_y_offset * 2);
  var start_point = {
    x: 0,
    y: 0,
  };
  var control_point = {
    x: image_width / 2,
    y: invert_curve ? warp_y_offset : -warp_y_offset,
  };
  var end_point = {
    x: image_width,
    y: 0,
  };
  var offset_y_points = [],
    t = 0;
  for (; t < image_width; t = t + 0.95) {
    var xyAtT = getQuadraticBezierXYatT(
        start_point,
        control_point,
        end_point,
        t / image_width
      ),
      y = parseInt(xyAtT.y);
    offset_y_points.push(y);
  }
  warp_context.clearRect(0, 0, warp_canvas.width, warp_canvas.height);
  var x = 0;
  for (; x < image_width; x = x + 1) {
    warp_context.drawImage(
      image_to_warp,
      // clip 1 pixel wide slice from the image
      x,
      0,
      1,
      image_height + warp_y_offset,
      // draw that slice with a y-offset
      x,
      warp_y_offset + offset_y_points[x],
      1,
      image_height + warp_y_offset
    );
  }
}

export {
  warpVertically,
  warp_canvas
}