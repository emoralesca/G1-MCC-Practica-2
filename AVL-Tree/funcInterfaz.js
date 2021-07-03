var textBox_id = document.getElementById('node_id');
var msg = document.getElementById('msg');

function sleep(ms) {
    var unixtime_ms = new Date().getTime();
    while(new Date().getTime() < unixtime_ms + ms) {}
}

function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;

	while (0 != currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

function createExampleAVLTree() {
	bst = new AVL();

	var n = getRandomInt(5, 15);
	var arr = [];

	// console.log('N = ', n);
	for (i = 0; i < n; i++) arr[i] = i;
	arr = shuffle(arr);

	for (i = 0; i < n; i++) {
		bst.InsertVal(i);
		drawTree();
	}
}

function InsertNode() {
	var node_id = Number(textBox_id.value);
	bst.InsertVal(node_id);

	textBox_id.value = '';


	msg.innerHTML = 'Nodo Insertado(' + node_id + ')';
	// console.log('nodo insertado = ', node-id);

	textBox_id.focus();

	drawTree();
}

function DeleteNode() {
	if (textBox_id.value != '') {
		var val = Number(textBox_id.value);

		bst.DeleteVal(val);
		textBox_id.value = '';

		msg.innerHTML = 'Nodo Eliminado(id = ' + val + ')<br>';
		// console.log('nodo eliminado = ', val);

		drawTree();
	}

	textBox_id.focus();
}

function SearchNode() {
	if (textBox_id.value != '') {
		SearchNodeByID();
		return;
	}
}

function SearchNodeByID() {
	var val = Number(textBox_id.value);
	var node = bst.Search(val);

	msg.innerHTML = '';

	if (node == -1)
		msg.innerHTML = 'No encontrado';
	else
		msg.innerHTML = 'Encontrado: Nodo(' + node.value + ')';

	textBox_id.value = '';
	textBox_id.focus();
}


function maxNode() {
	var listNode = bst.getAllNode();
	var pos = listNode.length - 1;

	msg.innerHTML = 'Valor Max de Nodo: (' + listNode[pos][0] + ')<br>';

	// console.log(msg.innerHTML);
	textBox_id.value = '';
	textBox_id.focus();
}

function minNode() {
	var listNode = bst.getAllNode();
	var pos = 0;

	msg.innerHTML = 'Valor Min de Nodo: (' + listNode[pos][0] + ')<br>';

	// console.log(msg.innerHTML);
	textBox_id.value = '';
	textBox_id.focus();
}

// funcion recorrido
function Print(traversal) {
	var numbers = traversal.call(bst);
	msg.innerHTML = numbers.join(', ');
	textBox_id.focus();
}

function handleKeyPress(e) {
	var key = e.keyCode || e.which;
	msg.innerHTML = '';
	if (key == 13)
		InsertNode();
}

function getRandomInt(min, max) {
	return Math.floor(Math.random() * (max - min)) + min;
}

// Grafica el arbol en treeData
function drawTree() {

	// Limpiar canvas
	d3.select("svg").remove();

	// Representacion del arbol en json
	var treeData;
	// Si el arbol no esta vacio
	if (bst.root)
		treeData = bst.root.json;
	else
		return;

	// Estableciendo dimenciones y margenes del diagrama
	var margin = {
			top: 40,
			right: 90,
			bottom: 50,
			left: 90
		},
		width = window.innerWidth - 10 - margin.left - margin.right,
		height = window.innerHeight - 120 - margin.top - margin.bottom;

	// Define el diseño del arbol y asigna tamaño
	var treemap = d3.tree()
		.size([width, height]);

	//  asigna los datos a una jerarquía utilizando relaciones padre-hijo
	var nodes = d3.hierarchy(treeData);

	// mapea los datos del nodo al diseño del arbol
	nodes = treemap(nodes);

	// agregar el objeto svg al cuerpo de la página
	// agrega un elemento 'grupo' a 'svg'
	// mueve el elemento 'grupo' al margen superior izquierdo
	var svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom),
		g = svg.append("g")
		.attr("transform",
			"translate(" + margin.left + "," + margin.top + ")");

	// agrega los enlaces entre los nodos
	var link = g.selectAll(".link")
		.data(nodes.descendants().slice(1))
		.enter().append("path")
		.attr("class", "link")
		.attr("d", function(d) {
			// Si su hijo es el único
			// muévelo hacia la derecha o hacia la izquierda
			// (el árbol D3.js predeterminado colocará el nodo
			// exactamente debajo de su padre)
			if (d.parent && d.parent.children.length == 1) {
				if (d.data.direction == 'right') {
					if (d.parent.parent)
						d.x += Math.abs(d.parent.x - d.parent.parent.x) / 2;
					else
						d.x += width / 4;
				} else {
					if (d.parent.parent)
						d.x -= Math.abs(d.parent.x - d.parent.parent.x) / 2;
					else
						d.x -= width / 4;
				}
			}

			return "M" + d.x + "," + d.y +
				"C" + (d.x + d.parent.x) / 2 + "," + (d.y + d.parent.y) / 2 +
				" " + (d.x + d.parent.x) / 2 + "," + (d.y + d.parent.y) / 2 +
				" " + d.parent.x + "," + d.parent.y;
		});

	// agrega cada nodo como un grupo
	var node = g.selectAll(".node")
		.data(nodes.descendants())
		.enter().append("g")
		.attr("class", function(d) {
			return "node" +
				(d.children ? " node--internal" : " node--leaf");
		})
		.attr("transform", function(d) {
			return "translate(" + d.x + "," + d.y + ")";
		});

	// agrega el círculo al nodo
	node.append("circle")
		.attr("r", 15);

	// agrega el texto al nodo
	node.append("text")
		.attr("dy", ".35em")
		.attr("y", function(d) {
			return 0;
		})
		.style("text-anchor", "middle")
		.text(function(d) {
			return d.data.name;
		});
}
