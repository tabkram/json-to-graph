# json-to-graph

[Online Demo!](https://tabkram.github.io/json-to-graph/)

# Introduction:
this project is an [Online Demo](https://tabkram.github.io/json-to-graph/), that allows to render JSON graph object with [cytoscape.js](https://js.cytoscape.org/) and [ELK layout algorithms](https://github.com/cytoscape/cytoscape.js-elk). 

# Data format

This project accepts a semi-standardized JSON-based graph format [Cytoscape JSON](https://js.cytoscape.org/#notation/elements-json) which is based on [json-graph-specification](https://github.com/jsongraph/json-graph-specification)
# Dependencies:

### Main dependencies:

- **cytoscape ^3.21.1** 
  - A fully featured graph library written in pure JS with a permissive open source license (MIT) for the core (Cytoscape.js library and all first-party extensions)
 
    
- **elkjs ^0.7.1**
  - The [Eclipse Layout Kernel (ELK)](https://www.eclipse.org/elk/) 's layout algorithms for JavaScript
  - elkjs is the successor of [klayjs](https://github.com/kieler/klayjs).
  - implemented by the Eclipse Foundation in Java, the source code is compiled to JS by the elk.js project using GWT.


- **cytoscape-elk ^2.0.2**
  - The elk layout algorithm adapter for Cytoscape.js
  


