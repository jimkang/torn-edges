torn-edges
==================

Given a parent element, it draws within that element torn paper edges (in SVG) around a div (in HTML) that you can write into like a normal html element.

[Here it is in use.](https://jimkang.com/council)

Currently makes a lot of assumptions about the contents of the div. Probably only only going to work for me right now.

Installation
------------

Currently only available on [GitHub Packages](https://help.github.com/en/github/managing-packages-with-github-packages/configuring-npm-for-use-with-github-packages#installing-a-package) for now. Add `@jimkang/torn-edges` to your dependencies in package.json, then run `npm install` if you've already set up your npmrc with GitHub Packages.

Usage
-----

    var TornEdge = require('torn-edges');

    var drawTornEdges = TornEdges(document.getElementById('container'));
    // Update contents of .paper within container, then:
    drawTornEdges();

License
-------

BSD.
