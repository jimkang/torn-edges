var d3 = require('d3-selection');
var drawTear = require('./draw-tear');

function TornEdges({ parentEl, tearWidth = 5, contentClassName }) {
  var parentSel = d3.select(parentEl);
  parentSel
    .append('svg')
    .classed(contentClassName + '-board', true)
    // 100% width works on Firefox, but not Chrome.
    // Large pixel width works in Firefox and Chrome, but not Mobile Safari.
    .attr('width', parentSel.node().parentNode.clientWidth)
    // 100% height works on Firefox, but not on Mobile Safari.
    .attr('height', '5000')
    .append('foreignObject')
    .attr('width', '100%')
    .attr('height', '100%')
    .attr('x', tearWidth)
    .attr('y', tearWidth)
    // Using the namespace when appending an html element to a foreignObject is
    // incredibly important. Without it, a div will not size itself correctly for its contents.
    .append('xhtml:div')
    .classed(contentClassName + '-container', true)
    .append('xhtml:div')
    .classed(contentClassName, true);

  return drawTornEdges;

  function drawTornEdges() {
    // This must go after the .paper contents are updated.
    // Hack: If this is called immediately, the clientHeight will not be correct yet.
    setTimeout(callRenderTears, 400);

    function callRenderTears() {
      renderTears(parentSel.selectAll('.' + contentClassName + '-board'));
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

    updatePaths
      .attr('d', getPathDirections)
      .attr('transform', getPathTransform);

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

      if (lengthAttr === 'width') {
        // Draw one extra pixel down for Mobile Safari to avoid gap
        // between tear and foreignObject.
        tearOpts.maxThickness += 1;
      }

      return drawTear(tearOpts);
    }

    function getPathTransform(direction) {
      var x = 0;
      var y = 0;
      if (direction[0] > 0) {
        x = d3.select(this.parentNode).attr('width') - tearWidth;
      }
      if (direction[1] > 0) {
        y = d3.select(this.parentNode).attr('height') - tearWidth;
      }
      return `translate(${x}, ${y})`;
    }
  }

  function getHeightOfTextElement(parentSel) {
    var textContainer = parentSel.select('.' + contentClassName);
    return textContainer.node().clientHeight;
  }

  function getWidthOfTextElement(parentSel) {
    var textContainer = parentSel.select('.' + contentClassName);
    return textContainer.node().clientWidth;
  }
}

module.exports = TornEdges;
