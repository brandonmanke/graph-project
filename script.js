/**
 * Idea:
 * We have to be able to select the two nodes we want to find the shortest path to.
 * Look into click events for cytoscape, there isn't too much material in the docs so
 * it looks like this will be somewhat easy to implement
 * Quick example of adding clicked cytoscape elements to a collection
 *  Keep a collection of nodes that have been clicked:
 * ```
 *
 *  var collection = cy.collection();
 *  cy.nodes().on("click", function(){
 *    collection = collection.add(this);
 *  });
 *
 * ```
 * Idea: Show / hide weights
 */
(function() {
    var alphabet = [
        'a', 'b', 'c', 'd', 'e', 'f', 
        'g', 'h', 'i', 'j', 'k', 'l', 
        'm', 'n', 'o', 'p', 'q', 'r', 
        's', 't', 'u', 'v', 'w', 'x', 
        'y', 'z'
    ];

    /** 
     * Calculate edge color based on weight
     * Colors are tints of node color:
     * http://www.color-hex.com/color/3579dc
     * @param {number} weight of edge
     */
    function edgeColor(weight) {
        var color = '';
        if (weight >= 90 && weight <= 100) {
            color = '#3579dc';
        } else if (weight >= 80 && weight < 90) {
            color = '#4986df';
        } else if ( weight >= 70 && weight < 80) {
            color ='#5d93e3';
        } else if ( weight >= 60 && weight < 70) {
            color ='#71a1e6';
        } else if ( weight >= 50 && weight < 60) {
            color ='#85aeea';
        } else if ( weight >= 40 && weight < 50) {
            color ='#9abced';
        } else if ( weight >= 30 && weight < 40) {
            color ='#aec9f1';
        } else if ( weight >= 20 && weight < 30) {
            color ='#c2d6f4';
        } else if ( weight >= 10 && weight < 20) {
            color = '#aac6ef';
        } else {
            color = '#d6e4f8';
        }
        return color;
    }

    function addColorWeights() {
        var edges = [];
        var nodes = [];
        // seperate edges & nodes into organized arrays
        getEdgesAndNodes(graph, edges, nodes);
        for (var i = 0; i < edges.length; i++) {
           var id = edges[i].data.id;
           var weight = edges[i].data.weight;
           cy.getElementById(id).style({
               'line-color': edgeColor(weight)
           });
        }
    }

    // ugly way of doing this
    function generateExampleGraph() {
        var elements = [];
        elements.push({ data: { id: 'a' } });
        elements.push({ data: { id: 'b' } });
        elements.push({ data: { id: 'c' } });
        elements.push({ data: { id: 'd' } });
        elements.push({ data: { id: 'e' } });
        elements.push({ data: { id: 'f' } });
        elements.push({
            data: { 
                id: 'ab',
                source: 'a', 
                target: 'b',
                weight: 10
            }
        });
        elements.push({
            data: { 
                id: 'bc',
                source: 'b', 
                target: 'c',
                weight: 24
            }
        });
        elements.push({
            data: { 
                id: 'af',
                source: 'a', 
                target: 'f',
                weight: 5
            }
        });
        elements.push({
            data: { 
                id: 'ae',
                source: 'a', 
                target: 'e',
                weight: 33
            }
        });
        elements.push({
            data: { 
                id: 'fe',
                source: 'f', 
                target: 'e',
                weight: 14
            }
        });
        elements.push({
            data: { 
                id: 'cd',
                source: 'c', 
                target: 'd',
                weight: 28
            }
        });
        elements.push({
            data: { 
                id: 'db',
                source: 'd', 
                target: 'b',
                weight: 7
            }
        });
        elements.push({
            data: { 
                id: 'df',
                source: 'd', 
                target: 'f',
                weight: 9
            }
        });
        return elements;
    }

    function generateRandomGraph() {
        var elements = [];
        var random = Math.floor((Math.random() * 10) + 2);
        for (var i = 0; i < random; i++) {
            elements.push({
                data: { id: alphabet[i] }
            });
        }
        // random number from |V| to 2|V|
        var randomNumberOfEdges = Math.floor(Math.random() * (random * 4) + (random * 1.5));
        var edgesAdded = 0;
        for (var i = 0; i < randomNumberOfEdges; i++) {
            // get a random node from the elements array and subtract 'i' because
            // that's the number of edges that have already been added to the array
            // we know that all the edges added are at the end of the elements array
            var buffer = 0;
            var randomLetter = -1;
            var randomLetter2 = -1;
            while ((randomLetter < 0) ||
                   (randomLetter2 < 0) ||
                   (randomLetter > (elements.length - 1)) ||
                   (randomLetter2 > (elements.length - 1)) ||
                   (randomLetter === randomLetter2)) {
                randomLetter = Math.floor((Math.random() * elements.length) - edgesAdded);
                randomLetter2 = Math.floor((Math.random() * elements.length) - edgesAdded);
            }
            var weight = Math.floor((Math.random() * 100) + 1);
            var node1 = alphabet[randomLetter];
            var node2 = alphabet[randomLetter2];
            var edgeName = node1 + '' + node2;
            var exists = false;

            var node1InGraph = false;
            var node2InGraph = false;
            for (var j = 0; j < elements.length; j++) {
                // check to make sure node is actually in graph
                if (elements[j].data.id === node1) {
                    node1InGraph = true;
                }
                if (elements[j].data.id === node2) {
                    node2InGraph = true;
                }

                // check if edge already exists
                if ((elements[j].data.id === edgeName) ||
                    (elements[j].data.id === edgeName.split("").reverse().join(""))) {
                    exists = true;
                }
            }
            if (!exists && node1InGraph && node2InGraph) {
                edgesAdded++;
                elements.push({
                    data: { 
                        id: edgeName, 
                        source: alphabet[randomLetter],
                        target: alphabet[randomLetter2],
                        weight: weight
                    }
                });
            }
        }
        return elements;
    }

    var graph = generateRandomGraph();
    //var graph = generateExampleGraph();

    function getEdgesAndNodes(graph, edges, nodes) {
        for (var i = 0; i < graph.length; i++) {
            if (graph[i].data.id.length === 1) {
                nodes.push(graph[i]);
            } else {
                edges.push(graph[i]);
            }
        }
    }

    function filterVisited(currentNeighbors, processedVertices, processedEdges) {
        if ((processedEdges.length > 0 && currentNeighbors.length > 0)||
            (processedVertices.length > 0 && currentNeighbors.length > 0)) {
            // we remove edges to vertices we have already processed
            for (var i = 0; i < currentNeighbors.length; i++) {
                for (var j = 0; j < processedEdges.length; j++) {
                    if (currentNeighbors[i]) {
                        // check if we have used this edge already
                        if (currentNeighbors[i].data.id === processedEdges[j]) {
                            var index = i;
                            currentNeighbors.splice(index, 1);
                        }
                    }
                }
                for (var j = 0; j < processedVertices.length; j++) {
                    if (currentNeighbors[i]) {
                        // check if we have visited this vertice already
                        if ((currentNeighbors[i].data.source === processedVertices[j]) ||
                            (currentNeighbors[i].data.target === processedVertices[j])) {
                            var index = i;
                            currentNeighbors.splice(index, 1);
                        }
                    }
                }
            }
        }
    }

    function pickShortestEdge(currentNeighbors) {
        var edgeToPick = {};
        if (currentNeighbors.length > 1) {
            edgeToPick = currentNeighbors[0].data;
            // for the current neighbors pick the one with the shortest weight
            for (var i = 0; i < currentNeighbors.length; i++) {
                if (edgeToPick.weight > currentNeighbors[i].data.weight) {
                    edgeToPick = currentNeighbors[i].data;
                }
            }
            console.log('Edge to pick', edgeToPick);
        } else {
            // no edges on current node
            if (currentNeighbors.length === 0) {
                // consider back tracking to previous node
                var errMsg = 'Error there is no connected path to that vertex';
                console.log(errMsg)
                document.getElementById('path-text').innerHTML = errMsg;
                return -1;
            }
            // case where current node only has 1 edge
            edgeToPick = currentNeighbors[0].data;
        }
        return edgeToPick;
    }

    /** 
     * @param {string} element id of element we want to highlight
     * @param {number} index multiplier to deal with javascript closures
     */
    function highlight(element, index) {
        setTimeout(function() {
            cy.getElementById(element).addClass('visited');
        }, 1000 * index);
    }

    function nearestNeighborAlgorithm(startingNode, endingNode) {
        var distanceTraveled = 0;
        var processedEdges = [];
        var processedVertices = [];
        var edges = [];
        var nodes = [];

        // seperate edges & nodes into organized arrays
        getEdgesAndNodes(graph, edges, nodes);
        var currentNode = startingNode;
        //cy.getElementById(currentNode).addClass('visited');
        while ((currentNode !== endingNode) && currentNode) {
            console.log('\nCurrent node is ' + currentNode);
            var currentNeighbors = [];
            for (var i = 0; i < edges.length; i++) {
                if (edges[i].data.source === currentNode ||
                    edges[i].data.target === currentNode) {
                    currentNeighbors.push(edges[i]);
                }
            }

            filterVisited(currentNeighbors, processedVertices, processedVertices);
            var edgeToPick = pickShortestEdge(currentNeighbors);
            if (edgeToPick === -1) {
                // even though this means we can't find the edge we still 
                // want to highlight this node.
                //processedVertices.push(currentNode);
                break;
            }

            // check if we are traveling from target to source OR
            // from source to target
            if (edgeToPick.source === currentNode) {
                processedEdges.push(edgeToPick.id);
                processedVertices.push(edgeToPick.source);
                currentNode = edgeToPick.target;
                console.log('Taking edge ' + edgeToPick.id + 
                            ' from ' + edgeToPick.source + 
                            ' to ' + edgeToPick.target + 
                            ' with cost of ' + edgeToPick.weight);
            } else {
                // must be target to source
                processedEdges.push(edgeToPick.id);
                processedVertices.push(edgeToPick.target);
                currentNode = edgeToPick.source;
                console.log('Taking edge ' + edgeToPick.id + 
                            ' from ' + edgeToPick.target + 
                            ' to ' + edgeToPick.source + 
                            ' with cost of ' + edgeToPick.weight);
            }            
            distanceTraveled += edgeToPick.weight;

            if (currentNode === endingNode) {
                processedVertices.push(currentNode);
                console.log('processed:', processedEdges);
                console.log('processedVertices:', processedVertices);
                var endingDetails = 'Approximate Shortest Path Between: ' +
                                    startingNode + 
                                    ' & ' +
                                    currentNode + 
                                    ' &boxh; Distance Traveled: ' + 
                                    distanceTraveled;
                console.log(endingDetails);
                document.getElementById('path-text').innerHTML = endingDetails;
                break;
            }
        }
        return { processedVertices, processedEdges };
    }

    var cy = cytoscape({
        container: document.getElementById('cy'), // container to render in
        elements: graph,
        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                    //'background-color': '#666',
                    'background-color': '#3579DC',
                    'color': '#ffffff',
                    // TODO styling for labels (both node & edge)
                    'text-halign': 'center',
                    'text-valign': 'center',
                    'label': 'data(id)'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle',
                    'label': 'data(weight)'
                }
            },
            {
                selector: '.visited',
                style: {
                    'background-color': 'red',
                    'line-color': 'red',
                    'transition-property': 'background-color, line-color',
                    'transition-delay': '1000ms',
                    'transition-duration': '0.5s'
                }
            }
        ],
        layout: {
            name: 'grid',
            rows: 1
        }
    });

    /**
     * @param callback - function that returns an object containing an array of edges and vertices to highlight
     */
    function draw(callback) {
        //var processed = //nearestNeighborAlgorithm('a', 'd');
        var processed = callback();
        var keys = Object.keys(processed);
        var vertices = processed[keys[0]];
        var edges = processed[keys[1]];
        // O(|E|) - this is kind of ugly because of javascript closures (sorry)
        for (var i = 0; i < processed[keys[1]].length; i++) {
            (function(x) {
                highlight(vertices[x], x);
                highlight(edges[x], x);
            })(i);
        }
        var lastIndex = processed[keys[0]].length - 1;
        // highlight ending node since |V| > |E|
        highlight(vertices[lastIndex], lastIndex);
        // we need to wait until all the elements are highlighted before we show the message
        setTimeout(function() {
            document.getElementById('path-text').className = '';
        }, 1000 * (lastIndex + 1.1)); // 1.1 the extra .1 is for animation time
    }

    //console.log(graph);

    var layout = cy.layout({
        name: 'random'
    });

    addColorWeights();
    layout.run();
    // draw nearest neighbor algo
    draw(function() {
        return nearestNeighborAlgorithm('a', 'd');
    });
})();

window.onload = function() {
    document.getElementById('title').className = 'load';
};