var d3 = require('d3-selection');
var drawTear = require('./draw-tear');

const tearWidth = 5;

function TornEdges(parentEl) {
  var parentSel = d3.select(parentEl);
  parentSel
    .append('svg')
    .classed('paper-board', true)
    .append('foreignObject')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('x', tearWidth)
    .attr('y', tearWidth)
    // Using the namespace when appending an html element to a foreignObject is
    // incredibly important. Without it, a div will not size itself correctly for its contents.
    .append('xhtml:div')
    .classed('paper-container', true)
    .append('xhtml:div')
    .classed('paper', true);

  return drawTornEdges;

  function drawTornEdges() {
    // This must go after the .paper contents are updated.
    // Hack: If this is called immediately, the clientHeight will not be correct yet.
    setTimeout(callRenderTears, 300);

    function callRenderTears() {
      renderTears(parentSel.selectAll('.paper-board'));
    }
  }
}

function renderTears(textBoards) {
  textBoards
    .selectAll('foreignObject')
    .attr('width', getForeignObjectWidth)
    .attr('height', getForeignObjectHeight);

  // Changing the width of the board changes the width of the foreignObjects, as they
  // are initially set to 100%. So, do that before changing the width of the board.
  textBoards.attr('width', getBoardWidth).attr('height', getBoardHeight);

  // Use path directions as data.
  var paths = textBoards
    .selectAll('.tear-path')
    .data([[0, -1], [0, 1], [-1, 0], [1, 0]]);

  var updatePaths = paths
    .enter()
    .append('path')
    .classed('tear-path', true)
    .merge(paths);

  updatePaths.attr('d', getPathDirections).attr('transform', getPathTransform);

  function getBoardWidth() {
    return getWidthOfTextElement(d3.select(this)) + 2 * tearWidth;
  }

  function getBoardHeight() {
    return getHeightOfTextElement(d3.select(this)) + 2 * tearWidth;
  }

  function getForeignObjectWidth() {
    return getWidthOfTextElement(d3.select(this));
  }

  function getForeignObjectHeight() {
    return getHeightOfTextElement(d3.select(this));
  }

  function getPathDirections(direction) {
    var tearOpts = {
      direction: direction,
      maxThickness: tearWidth
    };

    var lengthAttr = 'height';
    if (direction[0] === 0) {
      lengthAttr = 'width';
    }
    tearOpts.length = d3.select(this.parentNode).attr(lengthAttr);

    return drawTear(tearOpts);
  }

  function getPathTransform(direction) {
    var x = 0;
    var y = 0;
    if (direction[0] > 0) {
      x = d3.select(this.parentNode).attr('width') - tearWidth - 1;
    }
    if (direction[1] > 0) {
      y = d3.select(this.parentNode).attr('height') - tearWidth - 1;
    }
    // Safari needs the -1; Chrome and Firefox do not.
    return `translate(${x}, ${y})`;
  }
}

function getHeightOfTextElement(parentSel) {
  var textContainer = parentSel.select('.paper');
  return textContainer.node().clientHeight;
}

function getWidthOfTextElement(parentSel) {
  var textContainer = parentSel.select('.paper');
  return textContainer.node().clientWidth;
}

module.exports = TornEdges;

