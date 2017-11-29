(function() {

    var visitedEdge = {
        'line-color': 'red'
    };

    var visitedNode = {
        'background-color': 'red'
    };

    var alphabet = [
        'a', 'b', 'c', 'd', 'e', 'f', 
        'g', 'h', 'i', 'j', 'k', 'l', 
        'm', 'n', 'o', 'p', 'q', 'r', 
        's', 't', 'u', 'v', 'w', 'x', 
        'y', 'z'
    ];

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
            var currentNeighbors = [];
            for (var i = 0; i < edges.length; i++) {
                if (edges[i].data.source === currentNode ||
                    edges[i].data.target === currentNode) {
                    currentNeighbors.push(edges[i]);
                }
            }

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
                    console.log('Error there is no connected path to that vertex')
                    break;
                }
                // case where current node only has 1 edge
                edgeToPick = currentNeighbors[0].data;
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
                console.log('processed:', processedEdges);
                console.log('Ending node:', currentNode, '| Distance Traveled:', distanceTraveled);
                break;
            }
            // just in case
            if (distanceTraveled > 1000)
                break;
        }
    }

    var cy = cytoscape({
        container: document.getElementById('cy'), // container to render in
        elements: graph,
        style: [ // the stylesheet for the graph
            {
                selector: 'node',
                style: {
                    'background-color': '#666',
                    'label': 'data(id)'
                }
            },
            {
                selector: 'edge',
                style: {
                    'width': 3,
                    'line-color': '#ccc',
                    'target-arrow-color': '#ccc',
                    'target-arrow-shape': 'triangle'
                }
            }
        ],
        layout: {
            name: 'grid',
            rows: 1
        }
    });

    // works sometimes, less with larger graphs
    setTimeout(function() {
        nearestNeighborAlgorithm('a', 'd');
    }, 2000);

    //console.log(graph);

    var layout = cy.layout({
        name: 'random'
    });

    layout.run();


    //cy.getElementById('b').style(visitedNode);

})();