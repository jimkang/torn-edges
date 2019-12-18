var probable = require('probable');
var shape = require('d3-shape');
var range = require('d3-array').range;

var area = shape.area();
area.curve(shape.curveLinear);

function drawTear({ direction, length, maxThickness, tearFreq = 4 }) {
  if (direction[1] === 0) {
    area.x0(direction[0] < 0 ? maxThickness : 0);
    area.y(identity);
  } else {
    area.y0(direction[1] < 0 ? maxThickness : 0);
    area.x(identity);
  }

  const divisorA = 10 + probable.rollDie(4);
  const divisorB = 2 + probable.roll(2);
  // console.log('divisorA', divisorA);

  if (direction[1] === 0) {
    area.x1(getCurrentThickness);
  } else {
    area.y1(getCurrentThickness);
  }

  return area(range(0 + tearFreq, length - tearFreq, tearFreq));

  function getCurrentThickness(p) {
    var currentThickness = 0;
    if (p === 0 || p >= length - tearFreq) {
      if (direction[0] < 0 || direction[1] < 0) {
        currentThickness = maxThickness;
      }
    } else {
      let thicknessDelta = (Math.sin(p / divisorA) * maxThickness) / divisorB;

      if (direction[0] < 0 || direction[1] < 0) {
        currentThickness = maxThickness / 2 + thicknessDelta;
      } else {
        currentThickness = maxThickness / 2 - thicknessDelta;
      }

      currentThickness += (Math.sin(p / 4) * maxThickness) / 6;

      if (probable.roll(2) === 0) {
        currentThickness += probable.rollDie(maxThickness / 5);
      } else {
        currentThickness -= probable.rollDie(maxThickness / 5);
      }
    }
    return currentThickness;
  }
}

function identity(x) {
  return x;
}

module.exports = drawTear;
