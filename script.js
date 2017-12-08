/**
 * @author Brandon Manke
 * Idea: Show / hide weights
 */
(function() {
    /* empty instance of cy object */
    var cy = {};
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

    // ugly way of doing this, sorry
    function generateExampleGraph(numberOfEdges) {
        var elements = [];
        elements.push({ data: { id: 'a' } });
        elements.push({ data: { id: 'b' } });
        elements.push({ data: { id: 'c' } });
        elements.push({ data: { id: 'd' } });
        elements.push({ data: { id: 'e' } });
        elements.push({ data: { id: 'f' } });
        elements.push({ data: { id: 'g' } });
        elements.push({ data: { id: 'h' } });
        elements.push({ data: { id: 'i' } });
        elements.push({ data: { id: 'j' } });
        elements.push({ data: { id: 'k' } });
        elements.push({ data: { id: 'l' } });
        elements.push({ data: { id: 'm' } });
        elements.push({ data: { id: 'n' } });
        elements.push({ data: { id: 'o' } });
        elements.push({ data: { id: 'p' } });
        elements.push({ data: { id: 'q' } });
        elements.push({ data: { id: 'r' } });
        elements.push({ data: { id: 's' } });
        elements.push({ data: { id: 't' } });
        elements.push({ data: { id: 'u' } });
        elements.push({ data: { id: 'v' } });
        elements.push({ data: { id: 'w' } });
        elements.push({ data: { id: 'x' } });
        elements.push({ data: { id: 'y' } });
        elements.push({ data: { id: 'z' } });
        elements.push({ data: { id: 'a1' } });
        elements.push({ data: { id: 'b2' } });
        elements.push({ data: { id: 'c3' } });
        elements.push({ data: { id: 'd4' } });
        var nodes = [
            { data: { id: 'a' } },
            { data: { id: 'b' } },
            { data: { id: 'c' } },
            { data: { id: 'd' } },
            { data: { id: 'e' } },
            { data: { id: 'f' } },
            { data: { id: 'g' } },
            { data: { id: 'h' } },
            { data: { id: 'i' } },
            { data: { id: 'j' } },
            { data: { id: 'k' } },
            { data: { id: 'l' } },
            { data: { id: 'm' } },
            { data: { id: 'n' } },
            { data: { id: 'o' } },
            { data: { id: 'p' } },
            { data: { id: 'q' } },
            { data: { id: 'r' } },
            { data: { id: 's' } },
            { data: { id: 't' } },
            { data: { id: 'u' } },
            { data: { id: 'v' } },
            { data: { id: 'w' } },
            { data: { id: 'x' } },
            { data: { id: 'y' } },
            { data: { id: 'z' } },
            { data: { id: 'a1' } },
            { data: { id: 'b2' } },
            { data: { id: 'c3' } },
            { data: { id: 'd4' } }
        ];
        if (numberOfEdges > 0) {
            createEdges(numberOfEdges, elements);
        }
        return elements;
    }

    function createEdges(numberOfEdges, elements) {
        var edgesAdded = 0;
        for (var i = 0; i < numberOfEdges; i++) {
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
    }

    // 5, 2.5
    function generateRandomGraph(minEdgeWeight, maxEdgeWeight) {
        var elements = [];
        var random = Math.floor((Math.random() * 10) + 2);
        for (var i = 0; i < random; i++) {
            elements.push({
                data: { id: alphabet[i] }
            });
        }
        // random number from |V| to 2|V|
        if (minEdgeWeight > maxEdgeWeight) {
            throw console.log('edgeweigh error');
        }
        var randomNumberOfEdges = Math.floor(Math.random() * 
                                  (random * maxEdgeWeight) + 
                                  (random * minEdgeWeight));
        createEdges(randomNumberOfEdges, elements);
        return elements;
    }

    //var graph = generateRandomGraph(2.5, 5);
    var graph = generateExampleGraph(80);

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

    function getNeighbors(currentNode, edges) {
        var currentNeighbors = [];
        for (var i = 0; i < edges.length; i++) {
            if (edges[i].data.source === currentNode ||
                edges[i].data.target === currentNode) {
                currentNeighbors.push(edges[i]);
            }
        }
        return currentNeighbors;
    }

    /**
     * From point A to B
     */
    function nearestNeighborAlgorithm(startingNode, endingNode) {
        var distanceTraveled = 0;
        var processedEdges = [];
        var processedVertices = [];
        var edges = [];
        var nodes = [];

        // seperate edges & nodes into organized arrays
        getEdgesAndNodes(graph, edges, nodes);
        var currentNode = startingNode;
        while ((currentNode !== endingNode) && currentNode) {
            console.log('\nCurrent node is ' + currentNode);
            var currentNeighbors = getNeighbors(currentNode, edges);

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
                // maybe switch this
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

    function newInstance(_graph) { 
        var cy = cytoscape({
            container: document.getElementById('cy'), // container to render in
            elements: _graph,
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
        return cy;
    }

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

    cy = newInstance(graph);

    var layout = cy.layout({
        name: 'random'
    });

    addColorWeights();
    layout.run();

    function cyClickListeners() {
        var clicked = cy.collection();
        cy.nodes().on("click", function() {
            if (clicked.length < 2) {
                clicked = clicked.add(this);
                if (clicked.length === 2) {
                    // draw nearest neighbor algo
                    if (clicked[0] !== clicked[1]) {
                        draw(function() {
                            return nearestNeighborAlgorithm(clicked[0].data().id, 
                                                            clicked[1].data().id);
                        });
                    }
                }
            } else {
                for (var i = 0; i < cy.$('.visited').length; i++) {
                    cy.$('.visited')[i].data().removeClass('.visited');
                }
            }
        });
    }

    cyClickListeners();

    // menu click listeners
    document.getElementById('example').addEventListener('click', function() {
        var numberOfEdges = 80;
        var inputNumOfNodes = document.getElementById('n-edges').value;
        if (inputNumOfNodes) {
            numberOfEdges = inputNumOfNodes;
        }
        graph = generateExampleGraph(numberOfEdges);
        for (var i = 0; i < cy.$('.visited').length; i++) {
            if (cy.$('.visited')[i].hasClass('visited')) {
                cy.$('.visited')[i].removeClass('visited');
            }
        }
        if (cy.$('.visited')[0]) {
            cy.$('.visited')[0].removeClass('visited');
        }
        cy.destroy();
        cy = newInstance(graph);
        addColorWeights();
        layout = cy.layout({
            name: 'random'
        });
        cyClickListeners();
        layout.run();
    });
    document.getElementById('random').addEventListener('click', function() {
        graph = generateRandomGraph(2.5, 5);
        cy.destroy();
        cy = newInstance(graph);
        addColorWeights();
        layout = cy.layout({
            name: 'random'
        });
        cyClickListeners();
        layout.run();
    });
    document.getElementById('find-path').addEventListener('click', function() {
        var vertex1 = document.getElementById('1st-v').value;
        var vertex2 = document.getElementById('2nd-v').value;
        if (vertex1.toLowerCase() !== vertex2.toLowerCase()) {
            draw(function() {
                return nearestNeighborAlgorithm(vertex1.toLowerCase(), 
                                                vertex2.toLowerCase());
            });
        }
    });
    document.getElementById('generate').addEventListener('click', function() {
        var minWeight = document.getElementById('min-w').value;
        var maxWeight = document.getElementById('max-w').value;
        if (minWeight && maxWeight) {
            minWeight = parseFloat(minWeight);
            maxWeight = parseFloat(maxWeight);
        }
        if (minWeight < maxWeight && (minWeight > 0) && (maxWeight > 0) ) {
            graph = generateRandomGraph(minWeight, maxWeight);
            cy.destroy();
            cy = newInstance(graph);
            addColorWeights();
            layout = cy.layout({
                name: 'random'
            });
            cyClickListeners();
            layout.run();
        }
    });
    var _name = 'random';
    document.getElementById('layout').addEventListener('click', function() {
        if (_name === 'circle') {
            _name = 'random'
        } else {
            _name = 'circle';
        }
        layout = cy.layout({
            name: _name
        });
        layout.run();
    });
})();

window.onload = function() {
    document.getElementById('title').className = 'load';
    document.getElementById('settings').className += ' load';
    //document.getElementById('x').className += ' load';
    document.getElementById('description').className = 'load';
    document.getElementById('cy').className = '';
    document.getElementById('settings').addEventListener('click', function() {
        var wrapper = document.getElementById('wrapper');
        var menu = document.getElementById('slide-menu');
        wrapper.className === '' 
            ? wrapper.className = 'slide-over' 
            : wrapper.className = '';
        setTimeout(function() {
            //cy.resize(); // jyes it does, for the cy canvas
        }, 300);
        menu.className === '' 
            ? menu.className = 'menu-toggle' 
            : menu.className = '';  
    });
};
