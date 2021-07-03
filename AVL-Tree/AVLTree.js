function Node(val = null) {
	this.value = val;
	this.parent = null;
	this.height = null;
	this.left = null;
	this.right = null;
	this.json = {
		name: this.value,
		direction: null,
		children: []
	};

	this.UpdateHeight = function() {
		var leftheigh = 0,
			rightheigh = 0;
		this.json.children = [];
		if (this.left) {
			leftheigh = this.left.height;

			// GUI
			this.json.children.push(this.left.json);
			this.left.json.direction = 'left';
		}
		if (this.right) {
			rightheigh = this.right.height;

			// GUI
			this.json.children.push(this.right.json);
			this.right.json.direction = 'right';
		}
		this.height = 1 + Math.max(leftheigh, rightheigh);
	}

	this.balancefactor = function() {
		var leftheigh = 0,
			rightheigh = 0;
		if (this.left)
			leftheigh = this.left.height;
		if (this.right)
			rightheigh = this.right.height;
		return leftheigh - rightheigh;
	}
}

function AVL() {
	this.root = null;

	this.RotateRight = function(z) {
		var y = z.left,
			t3 = null;
		if (y)
			t3 = y.right;
		if (t3)
			t3.parent = z;

		y.right = z;
		z.left = t3;

		y.parent = z.parent;
		z.parent = y;

		z.UpdateHeight();
		y.UpdateHeight();

		if (z == this.root)
			this.root = y;

		return y;
	}

	this.RotateLeft = function(z) {
		var y = z.right,
			t2 = null;
		if (y)
			t2 = y.left;
		if (t2)
			t2.parent = z;


		y.left = z;
		z.right = t2;

		y.parent = z.parent;
		z.parent = y;

		z.UpdateHeight();
		y.UpdateHeight();

		if (z == this.root)
			this.root = y;

		return y;
	}

	this.balance = function(cur) {
		if (cur.balancefactor() == 2) ///izquierda
		{
			if (cur.left.balancefactor() == -1) ///si esta condición es válida entonces es de izquierda a derecha
				cur.left = this.RotateLeft(cur.left); ///Aquí se convierte a izquierda izquierda

			///  aquí se convierte en un árbol de balance
			cur = this.RotateRight(cur);
		} else if (cur.balancefactor() == -2) ///derecha
		{

			if (cur.right.balancefactor() == 1) ///si esta condición es válida entonces es derecha izquierda
				cur.right = this.RotateRight(cur.right); /// aquí se convierte a la derecha a la derecha

			///convierto en un árbol de balance
			cur = this.RotateLeft(cur);
		}
		return cur;
	}

	// Retorna el nodo que contiene valor
	this.Search = function(val, cur = this.root) {
		if (cur == null)
			return -1;

		if (cur.value == val)
			return cur;
		if (val > cur.value)
			return this.Search(val, cur.right);
		return this.Search(val, cur.left);
	}

	this.Insert = function(cur, val, fname, birth, g, cre) {
		if (cur == null)
			cur = new Node(val, fname, birth, g, cre);
		else if (val <= cur.value) {
			cur.left = this.Insert(cur.left, val, fname, birth, g, cre);
			cur.left.parent = cur;

			// GUI
			cur.left.json.direction = 'left';
			cur.json.children.push(cur.left.json);
		} else {
			cur.right = this.Insert(cur.right, val, fname, birth, g, cre);
			cur.right.parent = cur;

			// GUI
			cur.right.json.direction = 'right';
			cur.json.children.push(cur.right.json);
		}

		cur.UpdateHeight();
		cur = this.balance(cur);
		return cur;
	}

	this.InsertVal = function(val, fname, birth, g, cre) {
		this.root = this.Insert(this.root, val, fname, birth, g, cre);
	}

	this.DeleteVal = function(val) {
		var node = this.Search(val);
		if (node == -1)
			return;

		this.Delete(node);

		// Si el arbol no esta vacio
		if (this.root)
			this.root = this.balance(this.root)
	}


	this.Delete = function(cur) ///le daremos el nodo puntero que queremos eliminar, no el valor, y después de eliminarlo llamaremos a la función de balance dado el cur
	{
		// Si es el único nodo del árbol
		if (cur.parent == null && cur.right == null && cur.left == null) {
			// Limpiar el árbol
			this.root = null;
			return;
		}

		if (cur.right == null) {
			// Si es el nodo raíz
			if (cur.parent == null) {
				cur = cur.left;
				cur.parent = null;
			}

			else if (cur.parent.left == cur)
				cur.parent.left = cur.left;
			else
				cur.parent.right = cur.left;
			if (cur.left)
				cur.left.parent = cur.parent;

		} else if (cur.left == null) {
			// Si es el nodo raíz
			if (cur.parent == null) {
				cur = cur.right;
				cur.parent = null;
			}

			else if (cur.parent.left == cur)
				cur.parent.left = cur.right;
			else
				cur.parent.right = cur.right;
			if (cur.right)
				cur.right.parent = cur.parent;

		} else {
		var prev, temp = cur;
			temp = cur.left;
			prev = cur;
			while (temp.right != null) {
				prev = temp;
				temp = temp.right;
			}
			cur.value = temp.value;
			cur.json.name = cur.value;
			if (prev == cur)
				prev.left = temp.left;
			else
				prev.right = temp.left;

			prev.UpdateHeight();
			prev = this.balance(prev);
			while (prev.parent) {
				prev = prev.parent;
				prev.UpdateHeight();
				prev = this.balance(prev);
			}
			return;
		}

		while (cur.parent) {
			cur.UpdateHeight();
			cur = this.balance(cur);
			cur = cur.parent;
		}
		cur.UpdateHeight();
		this.root = this.balance(cur);
	}

	this.inorder = function(cur = this.root) {
		var numbers = [];
		if (cur != null) {
			numbers = this.inorder(cur.left);
			numbers.push(cur.value);
			numbers = numbers.concat(this.inorder(cur.right));
		}
		return numbers;
	}

	

	
	this.getAllNode = function(cur = this.root) {
		var nodes = [];

		if (cur != null) {
			nodes = this.getAllNode(cur.left);
			nodes.push([cur.value]);
			nodes = nodes.concat(this.getAllNode(cur.right));
		}

		return nodes;
	}
}

var bst = new AVL();
