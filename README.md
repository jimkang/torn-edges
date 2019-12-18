torn-edges
==================

Given a parent element, it draws within that element torn paper edges (in SVG) around a div (in HTML) that you can write into like a normal html element.

![Torn edges example screenshot](meta/torn-edges-example.png)

[Here it is in use.](https://jimkang.com/moif)

Currently makes a lot of assumptions about being able to correctly figure out the size of the contents inside the edges. Definitely will not work in a lot of situations.

Installation
------------

Currently only available on [GitHub Packages](https://help.github.com/en/github/managing-packages-with-github-packages/configuring-npm-for-use-with-github-packages#installing-a-package) for now. Add `@jimkang/torn-edges` to your dependencies in package.json, then run `npm install` if you've already set up your npmrc with GitHub Packages.

Usage
-----

    var TornEdges = require('@jimkang/torn-edges');

    renderTornEdges = TornEdges({
      // This is the DOM element that will contain the element surrounded by torn edges.
      parentEl: document.getElementById('container'),
      // The element surrounded by the torn edges will have this class so that you can select it or style it.
      contentClassName: 'paper',
      pathFill: 'hsl(39.4, 47.1%, 73.3%)'
    });

    // Update contents of .paper within container, then:
    renderTornEdges();

You need to update the contents of your content element before calling `renderTornEdges` because `renderTornEdges` needs to know the content size before proceeding.

It ends up creating a DOM hierarchy like this in '.container':

    <div class="container">
      <svg class="paper-board" width="739" height="772">
        <foreignObject width="729" height="762" x="5" y="5">
          <div class="paper-container">
            <div class="paper">
              <img class="picture" src="media/cultists.jpg" alt="A picture of three guys">
              <p>Your content goes here!</p>
            </div>
          </div>
        </foreignObject>
        <path class="tear-path" d="[Really long list of path commands]" transform="translate(0, 0)" fill="hsl(39.4, 47.1%, 73.3%)"></path>
        <path class="tear-path" d="[Really long list of path commands]" transform="translate(0, 767)" fill="hsl(39.4, 47.1%, 73.3%)"></path>
        <path class="tear-path" d="[Really long list of path commands]" transform="translate(0, 0)" fill="hsl(39.4, 47.1%, 73.3%)"></path>
        <path class="tear-path" d="[Really long list of path commands]" transform="translate(734, 0)" fill="hsl(39.4, 47.1%, 73.3%)"></path>
      </svg>
    </div>

License
-------

BSD.
