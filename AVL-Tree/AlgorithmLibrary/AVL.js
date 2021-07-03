// Copyright 2011 David Galles, University of San Francisco. All rights reserved.
//
// Se permite la redistribución y el uso en formato fuente y binario, con o sin 
// modificaciones, siempre que se cumplan las siguientes condiciones:
//
// 1. Las redistribuciones del código fuente deben conservar el aviso de derechos de 
// autor anterior, esta lista de condiciones y el siguiente descargo de responsabilidad.
//
// 2. Las redistribuciones en formato binario deben reproducir el aviso de derechos de autor
//  anterior, esta lista de condiciones y el siguiente descargo de responsabilidad en la
// documentación y / u otros materiales proporcionados con la distribución.
//
// ESTE SOFTWARE ES PROPORCIONADO POR David Galles `` TAL CUAL '' Y CUALQUIER GARANTÍA EXPLÍCITA
// O IMPLÍCITA, INCLUYENDO, PERO NO LIMITADO A, LAS GARANTÍAS IMPLÍCITAS DE COMERCIABILIDAD
// E IDONEIDAD PARA UN PROPÓSITO PARTICULAR NO SE RESPONSABILIZA. EN NINGÚN CASO David Galles O LOS
// COLABORADORES SERÁN RESPONSABLES DE NINGÚN DAÑO DIRECTO, INDIRECTO, INCIDENTAL, ESPECIAL, EJEMPLAR
// O CONSECUENCIAL (INCLUYENDO, PERO NO LIMITADO A, LA ADQUISICIÓN DE BIENES O SERVICIOS SUSTITUTOS;
// PÉRDIDA DE USO, DATOS O BENEFICIOS; O INTERRUPCIÓN COMERCIAL) SIN EMBARGO Y SOBRE CUALQUIER TEORÍA
// DE RESPONSABILIDAD, YA SEA POR CONTRATO, RESPONSABILIDAD ESTRICTA O AGRAVIO (INCLUYENDO NEGLIGENCIA
// O DE OTRA MANERA) QUE SURJA DE CUALQUIER FORMA DEL USO DE ESTE SOFTWARE, AUNQUE SE INDIQUE LA POSIBILIDAD
// DE DICHO DAÑO.
//
// Las opiniones y conclusiones contenidas en el software y la documentación son las de los autores y no
// deben interpretarse como representaciones de políticas oficiales, ya sea expresas o implícitas,
// de la Universidad de San Francisco.

function AVL(am, w, h) {   // declaracion de la funcion AVL
  this.init(am, w, h);     // definiendo propiedades y metodos de la funcion AVL
}

AVL.prototype = new Algorithm();   //Creacion del prototypo algorithm 
AVL.prototype.constructor = AVL;
AVL.superclass = Algorithm.prototype;

// definicion de constantes

AVL.HIGHLIGHT_LABEL_COLOR = "#FF0000";
AVL.HIGHLIGHT_LINK_COLOR = "#FF0000";

AVL.HIGHLIGHT_COLOR = "#007700";
AVL.HEIGHT_LABEL_COLOR = "#007700";

AVL.LINK_COLOR = "#007700";
AVL.HIGHLIGHT_CIRCLE_COLOR = "#007700";
AVL.FOREGROUND_COLOR = "0x007700";
AVL.BACKGROUND_COLOR = "#DDFFDD";
AVL.PRINT_COLOR = AVL.FOREGROUND_COLOR;

AVL.WIDTH_DELTA = 50;
AVL.HEIGHT_DELTA = 50;
AVL.STARTING_Y = 50;

AVL.FIRST_PRINT_POS_X = 50;
AVL.PRINT_VERTICAL_GAP = 20;
AVL.PRINT_HORIZONTAL_GAP = 50;
AVL.EXPLANITORY_TEXT_X = 10;
AVL.EXPLANITORY_TEXT_Y = 10;

AVL.prototype.init = function (am, w, h) {         //inicializando funcion AVL
  var sc = AVL.superclass;                         //el primer elemento se imprimira en la pocision 
  var fn = sc.init;
  this.first_print_pos_y = h - 2 * AVL.PRINT_VERTICAL_GAP;//altura(h-2)
  this.print_max = w - 10;                                //altura(hamplitud w -10)

  fn.call(this, am, w, h);
  this.startingX = w / 2;
  this.addControls();
  this.nextIndex = 1;
  this.commands = [];
  this.cmd(
    "CreateLabel",
    0,
    "",
    AVL.EXPLANITORY_TEXT_X,
    AVL.EXPLANITORY_TEXT_Y,
    0
  );
  this.animationManager.StartNewAnimation(this.commands);
  this.animationManager.skipForward();
  this.animationManager.clearHistory();
};

AVL.prototype.addControls = function () {
  this.insertField = addControlToAlgorithmBar("Text", "");
  this.insertField.onkeydown = this.returnSubmit(
    this.insertField,
    this.insertCallback.bind(this),
    4
  );
  this.insertButton = addControlToAlgorithmBar("Button", "Insertar");
  this.insertButton.onclick = this.insertCallback.bind(this);
  this.deleteField = addControlToAlgorithmBar("Text", "");
  this.deleteField.onkeydown = this.returnSubmit(
    this.deleteField,
    this.deleteCallback.bind(this),
    4
  );
  this.deleteButton = addControlToAlgorithmBar("Button", "Eliminar");
  this.deleteButton.onclick = this.deleteCallback.bind(this);
  this.findField = addControlToAlgorithmBar("Text", "");
  this.findField.onkeydown = this.returnSubmit(
    this.findField,
    this.findCallback.bind(this),
    4
  );
  this.findButton = addControlToAlgorithmBar("Button", "Buscar");
  this.findButton.onclick = this.findCallback.bind(this);
  this.printButton = addControlToAlgorithmBar("Button", "Imprimir");
  this.printButton.onclick = this.printCallback.bind(this);
};

AVL.prototype.reset = function () {
  this.nextIndex = 1;
  this.treeRoot = null;
};

AVL.prototype.insertCallback = function (event) {
  var insertedValue = this.insertField.value;
  // Get text value
  insertedValue = this.normalizeNumber(insertedValue, 4);
  if (insertedValue != "") {
    // set text value
    this.insertField.value = "";
    this.implementAction(this.insertElement.bind(this), insertedValue);
  }
};

AVL.prototype.deleteCallback = function (event) {
  var deletedValue = this.deleteField.value;
  if (deletedValue != "") {
    deletedValue = this.normalizeNumber(deletedValue, 4);
    this.deleteField.value = "";
    this.implementAction(this.deleteElement.bind(this), deletedValue);
  }
};

AVL.prototype.findCallback = function (event) {
  var findValue = this.findField.value;
  if (findValue != "") {
    findValue = this.normalizeNumber(findValue, 4);
    this.findField.value = "";
    this.implementAction(this.findElement.bind(this), findValue);
  }
};

AVL.prototype.printCallback = function (event) {
  this.implementAction(this.printTree.bind(this), "");
};

AVL.prototype.sizeChanged = function (newWidth, newHeight) {
  this.startingX = newWidth / 2;
};

AVL.prototype.printTree = function (unused) {
  this.commands = [];

  if (this.treeRoot != null) {
    this.highlightID = this.nextIndex++;
    var firstLabel = this.nextIndex;
    this.cmd(
      "CreateHighlightCircle",
      this.highlightID,
      AVL.HIGHLIGHT_COLOR,
      this.treeRoot.x,
      this.treeRoot.y
    );
    this.xPosOfNextLabel = AVL.FIRST_PRINT_POS_X;
    this.yPosOfNextLabel = this.first_print_pos_y;
    this.printTreeRec(this.treeRoot);
    this.cmd("Delete", this.highlightID);
    this.cmd("Step");
    for (var i = firstLabel; i < this.nextIndex; i++) this.cmd("Delete", i);
    this.nextIndex = this.highlightID; /// Reuse objects.  Not necessary.
  }
  return this.commands;
};

AVL.prototype.printTreeRec = function (tree) {
  this.cmd("Step");
  if (tree.left != null) {
    this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
    this.printTreeRec(tree.left);
    this.cmd("Move", this.highlightID, tree.x, tree.y);
    this.cmd("Step");
  }
  var nextLabelID = this.nextIndex++;
  this.cmd("CreateLabel", nextLabelID, tree.data, tree.x, tree.y);
  this.cmd("SetForegroundColor", nextLabelID, AVL.PRINT_COLOR);
  this.cmd("Move", nextLabelID, this.xPosOfNextLabel, this.yPosOfNextLabel);
  this.cmd("Step");

  this.xPosOfNextLabel += AVL.PRINT_HORIZONTAL_GAP;
  if (this.xPosOfNextLabel > this.print_max) {
    this.xPosOfNextLabel = AVL.FIRST_PRINT_POS_X;
    this.yPosOfNextLabel += AVL.PRINT_VERTICAL_GAP;
  }
  if (tree.right != null) {
    this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
    this.printTreeRec(tree.right);
    this.cmd("Move", this.highlightID, tree.x, tree.y);
    this.cmd("Step");
  }
  return;
};

AVL.prototype.findElement = function (findValue) {
  this.commands = [];

  this.highlightID = this.nextIndex++;

  this.doFind(this.treeRoot, findValue);

  return this.commands;
};

AVL.prototype.doFind = function (tree, value) {
  this.cmd("SetText", 0, "Searchiing for " + value);
  if (tree != null) {
    this.cmd("SetHighlight", tree.graphicID, 1);
    if (tree.data == value) {
      this.cmd(
        "SetText",
        0,
        "Searching for " +
          value +
          " : " +
          value +
          " = " +
          value +
          " (Element found!)"
      );
      this.cmd("Step");
      this.cmd("SetText", 0, "Found:" + value);
      this.cmd("SetHighlight", tree.graphicID, 0);
    } else {
      if (tree.data > value) {
        this.cmd(
          "SetText",
          0,
          "Searching for " +
            value +
            " : " +
            value +
            " < " +
            tree.data +
            " (look to left subtree)"
        );
        this.cmd("Step");
        this.cmd("SetHighlight", tree.graphicID, 0);
        if (tree.left != null) {
          this.cmd(
            "CreateHighlightCircle",
            this.highlightID,
            AVL.HIGHLIGHT_COLOR,
            tree.x,
            tree.y
          );
          this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
          this.cmd("Step");
          this.cmd("Delete", this.highlightID);
        }
        this.doFind(tree.left, value);
      } else {
        this.cmd(
          "SetText",
          0,
          " Searching for " +
            value +
            " : " +
            value +
            " > " +
            tree.data +
            " (look to right subtree)"
        );
        this.cmd("Step");
        this.cmd("SetHighlight", tree.graphicID, 0);
        if (tree.right != null) {
          this.cmd(
            "CreateHighlightCircle",
            this.highlightID,
            AVL.HIGHLIGHT_COLOR,
            tree.x,
            tree.y
          );
          this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
          this.cmd("Step");
          this.cmd("Delete", this.highlightID);
        }
        this.doFind(tree.right, value);
      }
    }
  } else {
    this.cmd(
      "SetText",
      0,
      " Searching for " + value + " : " + "< Empty Tree > (Element not found)"
    );
    this.cmd("Step");
    this.cmd(
      "SetText",
      0,
      " Searching for " + value + " : " + " (Element not found)"
    );
  }
};

AVL.prototype.insertElement = function (insertedValue) {          //funcion insertar elemento a ser ordenado
  this.commands = [];
  this.cmd("SetText", 0, " Inserting " + insertedValue);

  if (this.treeRoot == null) {    // si la raiz del arbol esta vacia, crea un circulo donde estara el valor ingresado           
    var treeNodeID = this.nextIndex++;//agrega un valor al index del circulo actual
    var labelID = this.nextIndex++;
    this.cmd(                    //creando circulo con su index, valor ingresado.
      "CreateCircle",
      treeNodeID,
      insertedValue,
      this.startingX,
      AVL.STARTING_Y     //la pocision inicial es 50 linea 57
    );
    this.cmd("SetForegroundColor", treeNodeID, AVL.FOREGROUND_COLOR);  //utiliza el color de primer plano declarado al inicio  linea 45
    this.cmd("SetBackgroundColor", treeNodeID, AVL.BACKGROUND_COLOR);  //utiliza el color de fondo declarado al inicio  linea 46 
    this.cmd(
      "CreateLabel",                   //crea la etiqueta 20 pocisiones a la izquierda y por encima
      labelID,
      1,
      this.startingX - 20,
      AVL.STARTING_Y - 20
    );
    this.cmd("SetForegroundColor", labelID, AVL.HEIGHT_LABEL_COLOR); 
    this.cmd("Step");
    this.treeRoot = new AVLNode(
      insertedValue,
      treeNodeID,
      labelID,
      this.startingX,
      AVL.STARTING_Y
    );
    this.treeRoot.height = 1;
  } else {                      // en que caso contrario de que la raiz del arbol no este vacia
    treeNodeID = this.nextIndex++;   //Agregamos un indice tanto al nodo como a la etiqueta
    labelID = this.nextIndex++;
    this.highlightID = this.nextIndex++;

    this.cmd("CreateCircle", treeNodeID, insertedValue, 30, AVL.STARTING_Y);     //de la misma forma creamos un nuevo circulo con el id del nodo y el valor insertado      

    this.cmd("SetForegroundColor", treeNodeID, AVL.FOREGROUND_COLOR);
    this.cmd("SetBackgroundColor", treeNodeID, AVL.BACKGROUND_COLOR);
    this.cmd("CreateLabel", labelID, "", 100 - 20, 100 - 20);
    this.cmd("SetForegroundColor", labelID, AVL.HEIGHT_LABEL_COLOR);
    this.cmd("Step");
    var insertElem = new AVLNode(insertedValue, treeNodeID, labelID, 100, 100);

    this.cmd("SetHighlight", insertElem.graphicID, 1);
    insertElem.height = 1;
    this.insert(insertElem, this.treeRoot);
    //				this.resizeTree();
  }
  this.cmd("SetText", 0, " ");
  return this.commands;
};

AVL.prototype.singleRotateRight = function (tree) {   // Rotacion simple a la derecha
  var B = tree;         //declaracion de variables(B =ARBOL)(nodo)
  var t3 = B.right;     //sub arbol derecho
  var A = tree.left;    //sub arbol izquierdo
  var t1 = A.left;      //izquierda del sub arbol izquierdo
  var t2 = A.right;     //derecha del sub arbol izquierdo

  this.cmd("SetText", 0, "Rotacion Simple a la derecha");       //este comando mostrar en pantall que se esta rotando a la derecha
  this.cmd("SetEdgeHighlight", B.graphicID, A.graphicID, 1);  // resaltamos los circulos que rotan
  this.cmd("Step");

  if (t2 != null) {         //si la derecha del subarbol izquierdo no esta vacio
    this.cmd("Disconnect", A.graphicID, t2.graphicID);
    this.cmd("Connect", B.graphicID, t2.graphicID, AVL.LINK_COLOR);
    t2.parent = B;  //entonces el lado derecho del subarbol izquierdo se volveri el padre del nodo B o su raiz
  }
  this.cmd("Disconnect", B.graphicID, A.graphicID);
  this.cmd("Connect", A.graphicID, B.graphicID, AVL.LINK_COLOR);
  A.parent = B.parent;
  if (this.treeRoot == B) { //si la raiz del arbol es el nodo B
    this.treeRoot = A;        // Entonces el nodo de la subrama a se convierte en la raiz del arbol
  } else {// caso contrario la izquierda de la sub rama izquierda  se convierte en el nodo de la subrama izquierda
    this.cmd("Disconnect", B.parent.graphicID, B.graphicID, AVL.LINK_COLOR);
    this.cmd("Connect", B.parent.graphicID, A.graphicID, AVL.LINK_COLOR);
    if (B.isLeftChild()) {
      B.parent.left = A;
    } else {
      B.parent.right = A;
    }
  }
  A.right = B; //se recalcula variables
  B.parent = A;
  B.left = t2;
  this.resetHeight(B);
  this.resetHeight(A);
  this.resizeTree();
};

AVL.prototype.singleRotateLeft = function (tree) { //Rotacion simple a la izquierda
  var A = tree;    //nodo principal 
  var B = tree.right; //subrama derecha
  var t1 = A.left;  //izquierda del nodo principal
  var t2 = B.left;  //izquierda de la rama derecha
  var t3 = B.right;  //derecha de la rama derecha

  this.cmd("SetText", 0, "rotacion simple a la izquierda"); //mostrar
  this.cmd("SetEdgeHighlight", A.graphicID, B.graphicID, 1); 
  this.cmd("Step");

  if (t2 != null) {  //si el lado izquierdo de la rama derecha no esta vacio
    this.cmd("Disconnect", B.graphicID, t2.graphicID);
    this.cmd("Connect", A.graphicID, t2.graphicID, AVL.LINK_COLOR);
    t2.parent = A; //t2 se convierte en el padre de A o el nodo principal
  }
  this.cmd("Disconnect", A.graphicID, B.graphicID);
  this.cmd("Connect", B.graphicID, A.graphicID, AVL.LINK_COLOR);
  B.parent = A.parent;// y el padre de a seria igual al de la rama izquierda(t2)
  if (this.treeRoot == A) { //si es que la raiz del arbol es A, entonces el nodo de la rama derecha (B se convierte en el nodo principal)
    this.treeRoot = B;
  } else {
    this.cmd("Disconnect", A.parent.graphicID, A.graphicID, AVL.LINK_COLOR);
    this.cmd("Connect", A.parent.graphicID, B.graphicID, AVL.LINK_COLOR);

    if (A.isLeftChild()) {
      A.parent.left = B;
    } else {
      A.parent.right = B;
    }
  }
  B.left = A;
  A.parent = B;
  A.right = t2;
  this.resetHeight(A); 
  this.resetHeight(B);

  this.resizeTree();
};

AVL.prototype.getHeight = function (tree) {   //funcion para conseguir la altura del arabol
  if (tree == null) {    //si es que el arbol esta vacio devolver altura 0
    return 0;
  }
  return tree.height;  // caso contrario devolver la altura
};

AVL.prototype.resetHeight = function (tree) {  //resetear altura
  if (tree != null) {   //si el arbol no esta vacio calcular una nueva altura
    var newHeight =
      Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1;
    if (tree.height != newHeight) {
      tree.height =
        Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1;
      this.cmd("SetText", tree.heightLabelID, newHeight);
      //			this.cmd("SetText",tree.heightLabelID, newHeight);
    }
  }
};

AVL.prototype.doubleRotateRight = function (tree) {   // rotacion doble a la derecha
  this.cmd("SetText", 0, "Double Rotate Right");
  var A = tree.left;
  var B = tree.left.right;
  var C = tree;
  var t1 = A.left;
  var t2 = B.left;
  var t3 = B.right;
  var t4 = C.right;

  this.cmd("Disconnect", C.graphicID, A.graphicID);
  this.cmd("Disconnect", A.graphicID, B.graphicID);
  this.cmd("Connect", C.graphicID, A.graphicID, AVL.HIGHLIGHT_LINK_COLOR);
  this.cmd("Connect", A.graphicID, B.graphicID, AVL.HIGHLIGHT_LINK_COLOR);
  this.cmd("Step");

  if (t2 != null) {
    this.cmd("Disconnect", B.graphicID, t2.graphicID);
    t2.parent = A;
    A.right = t2;
    this.cmd("Connect", A.graphicID, t2.graphicID, AVL.LINK_COLOR);
  }
  if (t3 != null) {
    this.cmd("Disconnect", B.graphicID, t3.graphicID);
    t3.parent = C;
    C.left = t2;
    this.cmd("Connect", C.graphicID, t3.graphicID, AVL.LINK_COLOR);
  }
  if (C.parent == null) {
    B.parent = null;
    this.treeRoot = B;
  } else {
    this.cmd("Disconnect", C.parent.graphicID, C.graphicID);
    this.cmd("Connect", C.parent.graphicID, B.graphicID, AVL.LINK_COLOR);
    if (C.isLeftChild()) {
      C.parent.left = B;
    } else {
      C.parent.right = B;
    }
    B.parent = C.parent;
    C.parent = B;
  }
  this.cmd("Disconnect", C.graphicID, A.graphicID);
  this.cmd("Disconnect", A.graphicID, B.graphicID);
  this.cmd("Connect", B.graphicID, A.graphicID, AVL.LINK_COLOR);
  this.cmd("Connect", B.graphicID, C.graphicID, AVL.LINK_COLOR);
  B.left = A;
  A.parent = B;
  B.right = C;
  C.parent = B;
  A.right = t2;
  C.left = t3;
  this.resetHeight(A);
  this.resetHeight(C);
  this.resetHeight(B);

  this.resizeTree();
};

AVL.prototype.doubleRotateLeft = function (tree) {
  this.cmd("SetText", 0, "Double Rotate Left");
  var A = tree;
  var B = tree.right.left;
  var C = tree.right;
  var t1 = A.left;
  var t2 = B.left;
  var t3 = B.right;
  var t4 = C.right;

  this.cmd("Disconnect", A.graphicID, C.graphicID);
  this.cmd("Disconnect", C.graphicID, B.graphicID);
  this.cmd("Connect", A.graphicID, C.graphicID, AVL.HIGHLIGHT_LINK_COLOR);
  this.cmd("Connect", C.graphicID, B.graphicID, AVL.HIGHLIGHT_LINK_COLOR);
  this.cmd("Step");

  if (t2 != null) {
    this.cmd("Disconnect", B.graphicID, t2.graphicID);
    t2.parent = A;
    A.right = t2;
    this.cmd("Connect", A.graphicID, t2.graphicID, AVL.LINK_COLOR);
  }
  if (t3 != null) {
    this.cmd("Disconnect", B.graphicID, t3.graphicID);
    t3.parent = C;
    C.left = t2;
    this.cmd("Connect", C.graphicID, t3.graphicID, AVL.LINK_COLOR);
  }

  if (A.parent == null) {
    B.parent = null;
    this.treeRoot = B;
  } else {
    this.cmd("Disconnect", A.parent.graphicID, A.graphicID);
    this.cmd("Connect", A.parent.graphicID, B.graphicID, AVL.LINK_COLOR);
    if (A.isLeftChild()) {
      A.parent.left = B;
    } else {
      A.parent.right = B;
    }
    B.parent = A.parent;
    A.parent = B;
  }
  this.cmd("Disconnect", A.graphicID, C.graphicID);
  this.cmd("Disconnect", C.graphicID, B.graphicID);
  this.cmd("Connect", B.graphicID, A.graphicID, AVL.LINK_COLOR);
  this.cmd("Connect", B.graphicID, C.graphicID, AVL.LINK_COLOR);
  B.left = A;
  A.parent = B;
  B.right = C;
  C.parent = B;
  A.right = t2;
  C.left = t3;
  this.resetHeight(A);
  this.resetHeight(C);
  this.resetHeight(B);

  this.resizeTree();
};

AVL.prototype.insert = function (elem, tree) {   //funcion insert
  this.cmd("SetHighlight", tree.graphicID, 1);   //resaltar el nodo del grafico
  this.cmd("SetHighlight", elem.graphicID, 1);   

  if (elem.data < tree.data) {       // si el elemento es menor al nodo del arbol
    this.cmd(
      "SetText",
      0,
      elem.data + " < " + tree.data + ".  buscando en la subrama izquierda del arbol"  //mostramos texto
    );
  } else {      // en caso contrario, el elemento es mayor a la raiz del arbol
    this.cmd(
      "SetText",
      0,
      elem.data + " >= " + tree.data + ".  buscando en la subrama derecha del arbol"
    );
  }
  this.cmd("Step");
  this.cmd("SetHighlight", tree.graphicID, 0);
  this.cmd("SetHighlight", elem.graphicID, 0);

  if (elem.data < tree.data) {   // si el elemento es menor al nodo
    if (tree.left == null) {   // y la subrama izquierda esta vacia
      this.cmd("SetText", 0, " Se encontro arbol vacio, insertando elemento");
      this.cmd("SetText", elem.heightLabelID, 1);

      this.cmd("SetHighlight", elem.graphicID, 0);
      tree.left = elem;   
      elem.parent = tree;   //ubicamos el elemento debajo de la raiz del arbol
      this.cmd("Connect", tree.graphicID, elem.graphicID, AVL.LINK_COLOR);

      this.resizeTree(); 
      this.cmd(       // se crea un nuevo circulo
        "CreateHighlightCircle",
        this.highlightID,
        AVL.HIGHLIGHT_COLOR,
        tree.left.x,
        tree.left.y
      );
      this.cmd("Move", this.highlightID, tree.x, tree.y);
      this.cmd("SetText", 0, "desenrrollando la recursividad");
      this.cmd("Step");
      this.cmd("Delete", this.highlightID);

      if (tree.height < tree.left.height + 1) { //si la altura del arbol es menor a a la altura de la subrama izquierda +1
        tree.height = tree.left.height + 1;// entonces asignamos que la nueva altura del arbol es la altura de la subrama izquierda +1
        this.cmd("SetText", tree.heightLabelID, tree.height);
        this.cmd("SetText", 0, "ajustando altura");
        this.cmd(
          "SetForegroundColor",
          tree.heightLabelID,
          AVL.HIGHLIGHT_LABEL_COLOR
        );
        this.cmd("Step");
        this.cmd(
          "SetForegroundColor",
          tree.heightLabelID,
          AVL.HEIGHT_LABEL_COLOR
        );
      }
    } else {  //la altura del arbol no es menor a la subrama izquierda +1
      this.cmd(
        "CreateHighlightCircle",
        this.highlightID,
        AVL.HIGHLIGHT_COLOR,
        tree.x,
        tree.y
      );
      this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
      this.cmd("Step");
      this.cmd("Delete", this.highlightID);
      this.insert(elem, tree.left);
      this.cmd(
        "CreateHighlightCircle",
        this.highlightID,
        AVL.HIGHLIGHT_COLOR,
        tree.left.x,
        tree.left.y
      );
      this.cmd("Move", this.highlightID, tree.x, tree.y);
      this.cmd("SetText", 0, "desenrrollando la recursividad");
      this.cmd("Step");
      this.cmd("Delete", this.highlightID);

      if (tree.height < tree.left.height + 1) { //la altura del arbol es menor a la subrama izquierda
        tree.height = tree.left.height + 1;
        this.cmd("SetText", tree.heightLabelID, tree.height);
        this.cmd("SetText", 0, "ajustando altura despues de una llamada recursiva");
        this.cmd(
          "SetForegroundColor",
          tree.heightLabelID,
          AVL.HIGHLIGHT_LABEL_COLOR
        );
        this.cmd("Step");
        this.cmd(
          "SetForegroundColor",
          tree.heightLabelID,
          AVL.HEIGHT_LABEL_COLOR
        );
      }
      if (
        (tree.right != null && tree.left.height > tree.right.height + 1) || //si la subrama derecha no esta vacia y la altura de la subrama izquierda es mayor a la altura de la rama derecha +1
        (tree.right == null && tree.left.height > 1)// o la subrama derecha esta vacia y la altura de la subrama izquierda es mayor 1
      ) {
        if (elem.data < tree.left.data) { //y el elemento nuevo es menor o pertenece a la subrama iquierda
          this.singleRotateRight(tree);   //utilizamos una rotacion simple a la derecha
        } else {
          this.doubleRotateRight(tree); // en caso contrario una rotacion doble a la derecha
        }
      }
    }
  } else {   // si el elemento es mayor al nodo, osea pertenece a la subrama derecha
    if (tree.right == null) {   //y la subrama derecha no esta vacia
      this.cmd("SetText", 0, "se encontro arbol vacio, insertando elemento"); //insertamos el elemento en al subrama derecha
      this.cmd("SetText", elem.heightLabelID, 1);
      this.cmd("SetHighlight", elem.graphicID, 0);
      tree.right = elem;
      elem.parent = tree; //el padre del nuevo elemeneto seria el nodo principal o raiz
      this.cmd("Connect", tree.graphicID, elem.graphicID, AVL.LINK_COLOR);
      elem.x = tree.x + AVL.WIDTH_DELTA / 2;
      elem.y = tree.y + AVL.HEIGHT_DELTA;
      this.cmd("Move", elem.graphicID, elem.x, elem.y);

      this.resizeTree();  //recalculamos la altura

      this.cmd(
        "CreateHighlightCircle",  //creamos su circulo apra el nuevo nodo
        this.highlightID,
        AVL.HIGHLIGHT_COLOR,
        tree.right.x,
        tree.right.y
      );
      this.cmd("Move", this.highlightID, tree.x, tree.y);
      this.cmd("SetText", 0, "desenrrollando recursividad");
      this.cmd("Step");
      this.cmd("Delete", this.highlightID);

      if (tree.height < tree.right.height + 1) {   //si la altura es menor a la altura del lado izquierdo +1
        tree.height = tree.right.height + 1;   //asignamos que la nueva altura del arbol es la de la rama derecha+1
        this.cmd("SetText", tree.heightLabelID, tree.height);
        this.cmd("SetText", 0, "ajustando altura");    
        this.cmd(
          "SetForegroundColor",
          tree.heightLabelID,
          AVL.HIGHLIGHT_LABEL_COLOR
        );
        this.cmd("Step");
        this.cmd(
          "SetForegroundColor",
          tree.heightLabelID,
          AVL.HEIGHT_LABEL_COLOR
        );
      }
    } else {  //creamos ele elemento con su subindice de altura
      this.cmd(
        "CreateHighlightCircle",
        this.highlightID,
        AVL.HIGHLIGHT_COLOR,
        tree.x,
        tree.y
      );
      this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
      this.cmd("Step");
      this.cmd("Delete", this.highlightID);
      this.insert(elem, tree.right);
      this.cmd(
        "CreateHighlightCircle",
        this.highlightID,
        AVL.HIGHLIGHT_COLOR,
        tree.right.x,
        tree.right.y
      );
      this.cmd("Move", this.highlightID, tree.x, tree.y);
      this.cmd("SetText", 0, "desenrrollar recursividad");
      this.cmd("Step");
      this.cmd("Delete", this.highlightID);
      if (tree.height < tree.right.height + 1) {
        tree.height = tree.right.height + 1;
        this.cmd("SetText", tree.heightLabelID, tree.height);
        this.cmd("SetText", 0, "reajustando altura");
        this.cmd(
          "SetForegroundColor",
          tree.heightLabelID,
          AVL.HIGHLIGHT_LABEL_COLOR
        );
        this.cmd("Step");
        this.cmd(
          "SetForegroundColor",
          tree.heightLabelID,
          AVL.HEIGHT_LABEL_COLOR
        );
      }
      if (     //si la subrama izquierda no esta vacia y la altura de la subrama dereche es mayor a la altura de la subrama izquierda +1
        (tree.left != null && tree.right.height > tree.left.height + 1) ||
        (tree.left == null && tree.right.height > 1)//o la surama izquierda esta vacia y la altura de la subrama derecha es mayor a 1
      ) {
        if (elem.data >= tree.right.data) {//ademas el elemento nuevo pertenece a la subrama derecha,
          this.singleRotateLeft(tree);// generamos una rotacion simple
        } else {
          this.doubleRotateLeft(tree);// en caso de que el nuevo elemento pertenezca a la subrama izquierda usamos una rotacion doble
        }
      }
    }
  }
};

AVL.prototype.deleteElement = function (deletedValue) {  //borrar elemento
  this.commands = [];
  this.cmd("SetText", 0, "Deleting " + deletedValue);
  this.cmd("Step");
  this.cmd("SetText", 0, " ");
  this.highlightID = this.nextIndex++;
  this.treeDelete(this.treeRoot, deletedValue);
  this.cmd("SetText", 0, " ");
  return this.commands;
};

AVL.prototype.treeDelete = function (tree, valueToDelete) {
  var leftchild = false;
  if (tree != null) {
    if (tree.parent != null) {
      leftchild = tree.parent.left == tree;
    }
    this.cmd("SetHighlight", tree.graphicID, 1);
    if (valueToDelete < tree.data) {
      this.cmd(
        "SetText",
        0,
        valueToDelete + " < " + tree.data + ".  Looking at left subtree"
      );
    } else if (valueToDelete > tree.data) {
      this.cmd(
        "SetText",
        0,
        valueToDelete + " > " + tree.data + ".  Looking at right subtree"
      );
    } else {
      this.cmd(
        "SetText",
        0,
        valueToDelete + " == " + tree.data + ".  Found node to delete"
      );
    }
    this.cmd("Step");
    this.cmd("SetHighlight", tree.graphicID, 0);

    if (valueToDelete == tree.data) {
      if (tree.left == null && tree.right == null) {
        this.cmd("SetText", 0, "Node to delete is a leaf.  Delete it.");
        this.cmd("Delete", tree.graphicID);
        this.cmd("Delete", tree.heightLabelID);
        if (leftchild && tree.parent != null) {
          tree.parent.left = null;
        } else if (tree.parent != null) {
          tree.parent.right = null;
        } else {
          this.treeRoot = null;
        }
        this.resizeTree();
        this.cmd("Step");
      } else if (tree.left == null) {
        this.cmd(
          "SetText",
          0,
          "Node to delete has no left child.  \nSet parent of deleted node to right child of deleted node."
        );
        if (tree.parent != null) {
          this.cmd("Disconnect", tree.parent.graphicID, tree.graphicID);
          this.cmd(
            "Connect",
            tree.parent.graphicID,
            tree.right.graphicID,
            AVL.LINK_COLOR
          );
          this.cmd("Step");
          this.cmd("Delete", tree.graphicID);
          this.cmd("Delete", tree.heightLabelID);
          if (leftchild) {
            tree.parent.left = tree.right;
          } else {
            tree.parent.right = tree.right;
          }
          tree.right.parent = tree.parent;
        } else {
          this.cmd("Delete", tree.graphicID);
          this.cmd("Delete", tree.heightLabelID);
          this.treeRoot = tree.right;
          this.treeRoot.parent = null;
        }
        this.resizeTree();
      } else if (tree.right == null) {
        this.cmd(
          "SetText",
          0,
          "Node to delete has no right child.  \nSet parent of deleted node to left child of deleted node."
        );
        if (tree.parent != null) {
          this.cmd("Disconnect", tree.parent.graphicID, tree.graphicID);
          this.cmd(
            "Connect",
            tree.parent.graphicID,
            tree.left.graphicID,
            AVL.LINK_COLOR
          );
          this.cmd("Step");
          this.cmd("Delete", tree.graphicID);
          this.cmd("Delete", tree.heightLabelID);
          if (leftchild) {
            tree.parent.left = tree.left;
          } else {
            tree.parent.right = tree.left;
          }
          tree.left.parent = tree.parent;
        } else {
          this.cmd("Delete", tree.graphicID);
          this.cmd("Delete", tree.heightLabelID);
          this.treeRoot = tree.left;
          this.treeRoot.parent = null;
        }
        this.resizeTree();
      } // tree.left != null && tree.right != null
      else {
        this.cmd(
          "SetText",
          0,
          "Node to delete has no two children.  \nFind largest node in left subtree."
        );

        this.highlightID = this.nextIndex;
        this.nextIndex += 1;
        this.cmd(
          "CreateHighlightCircle",
          this.highlightID,
          AVL.HIGHLIGHT_COLOR,
          tree.x,
          tree.y
        );
        var tmp = tree;
        tmp = tree.left;
        this.cmd("Move", this.highlightID, tmp.x, tmp.y);
        this.cmd("Step");
        while (tmp.right != null) {
          tmp = tmp.right;
          this.cmd("Move", this.highlightID, tmp.x, tmp.y);
          this.cmd("Step");
        }
        this.cmd("SetText", tree.graphicID, " ");
        var labelID = this.nextIndex;
        this.nextIndex += 1;
        this.cmd("CreateLabel", labelID, tmp.data, tmp.x, tmp.y);
        this.cmd("SetForegroundColor", labelID, AVL.HEIGHT_LABEL_COLOR);
        tree.data = tmp.data;
        this.cmd("Move", labelID, tree.x, tree.y);
        this.cmd(
          "SetText",
          0,
          "Copy largest value of left subtree into node to delete."
        );

        this.cmd("Step");
        this.cmd("SetHighlight", tree.graphicID, 0);
        this.cmd("Delete", labelID);
        this.cmd("SetText", tree.graphicID, tree.data);
        this.cmd("Delete", this.highlightID);
        this.cmd("SetText", 0, "Remove node whose value we copied.");

        if (tmp.left == null) {
          if (tmp.parent != tree) {
            tmp.parent.right = null;
          } else {
            tree.left = null;
          }
          this.cmd("Delete", tmp.graphicID);
          this.cmd("Delete", tmp.heightLabelID);
          this.resizeTree();
        } else {
          this.cmd("Disconnect", tmp.parent.graphicID, tmp.graphicID);
          this.cmd(
            "Connect",
            tmp.parent.graphicID,
            tmp.left.graphicID,
            AVL.LINK_COLOR
          );
          this.cmd("Step");
          this.cmd("Delete", tmp.graphicID);
          this.cmd("Delete", tmp.heightLabelID);
          if (tmp.parent != tree) {
            tmp.parent.right = tmp.left;
            tmp.left.parent = tmp.parent;
          } else {
            tree.left = tmp.left;
            tmp.left.parent = tree;
          }
          this.resizeTree();
        }
        tmp = tmp.parent;

        if (
          this.getHeight(tmp) !=
          Math.max(this.getHeight(tmp.left), this.getHeight(tmp.right)) + 1
        ) {
          tmp.height =
            Math.max(this.getHeight(tmp.left), this.getHeight(tmp.right)) + 1;
          this.cmd("SetText", tmp.heightLabelID, tmp.height);
          this.cmd("SetText", 0, "Adjusting height after recursive call");
          this.cmd(
            "SetForegroundColor",
            tmp.heightLabelID,
            AVL.HIGHLIGHT_LABEL_COLOR
          );
          this.cmd("Step");
          this.cmd(
            "SetForegroundColor",
            tmp.heightLabelID,
            AVL.HEIGHT_LABEL_COLOR
          );
        }

        while (tmp != tree) {
          var tmpPar = tmp.parent;
          // TODO:  Add extra animation here?
          if (this.getHeight(tmp.left) - this.getHeight(tmp.right) > 1) {
            if (
              this.getHeight(tmp.left.right) > this.getHeight(tmp.left.left)
            ) {
              this.doubleRotateRight(tmp);
            } else {
              this.singleRotateRight(tmp);
            }
          }
          if (tmpPar.right != null) {
            if (tmpPar == tree) {
              this.cmd(
                "CreateHighlightCircle",
                this.highlightID,
                AVL.HIGHLIGHT_COLOR,
                tmpPar.left.x,
                tmpPar.left.y
              );
            } else {
              this.cmd(
                "CreateHighlightCircle",
                this.highlightID,
                AVL.HIGHLIGHT_COLOR,
                tmpPar.right.x,
                tmpPar.right.y
              );
            }
            this.cmd("Move", this.highlightID, tmpPar.x, tmpPar.y);
            this.cmd("SetText", 0, "Backing up ...");

            if (
              this.getHeight(tmpPar) !=
              Math.max(
                this.getHeight(tmpPar.left),
                this.getHeight(tmpPar.right)
              ) +
                1
            ) {
              tmpPar.height =
                Math.max(
                  this.getHeight(tmpPar.left),
                  this.getHeight(tmpPar.right)
                ) + 1;
              this.cmd("SetText", tmpPar.heightLabelID, tree.height);
              this.cmd("SetText", 0, "Adjusting height after recursive call");
              this.cmd(
                "SetForegroundColor",
                tmpPar.heightLabelID,
                AVL.HIGHLIGHT_LABEL_COLOR
              );
              this.cmd("Step");
              this.cmd(
                "SetForegroundColor",
                tmpPar.heightLabelID,
                AVL.HEIGHT_LABEL_COLOR
              );
            }

            //28,15,50,7,22,39,55,10,33,42,63,30 .

            this.cmd("Step");
            this.cmd("Delete", this.highlightID);
          }
          tmp = tmpPar;
        }
        if (this.getHeight(tree.right) - this.getHeight(tree.left) > 1) {
          if (
            this.getHeight(tree.right.left) > this.getHeight(tree.right.right)
          ) {
            this.doubleRotateLeft(tree);
          } else {
            this.singleRotateLeft(tree);
          }
        }
      }
    } else if (valueToDelete < tree.data) {
      if (tree.left != null) {
        this.cmd(
          "CreateHighlightCircle",
          this.highlightID,
          AVL.HIGHLIGHT_COLOR,
          tree.x,
          tree.y
        );
        this.cmd("Move", this.highlightID, tree.left.x, tree.left.y);
        this.cmd("Step");
        this.cmd("Delete", this.highlightID);
      }
      this.treeDelete(tree.left, valueToDelete);
      if (tree.left != null) {
        this.cmd("SetText", 0, "Unwinding recursion.");
        this.cmd(
          "CreateHighlightCircle",
          this.highlightID,
          AVL.HIGHLIGHT_COLOR,
          tree.left.x,
          tree.left.y
        );
        this.cmd("Move", this.highlightID, tree.x, tree.y);
        this.cmd("Step");
        this.cmd("Delete", this.highlightID);
      }
      if (this.getHeight(tree.right) - this.getHeight(tree.left) > 1) {
        if (
          this.getHeight(tree.right.left) > this.getHeight(tree.right.right)
        ) {
          this.doubleRotateLeft(tree);
        } else {
          this.singleRotateLeft(tree);
        }
      }
      if (
        this.getHeight(tree) !=
        Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1
      ) {
        tree.height =
          Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1;
        this.cmd("SetText", tree.heightLabelID, tree.height);
        this.cmd("SetText", 0, "Adjusting height after recursive call");
        this.cmd(
          "SetForegroundColor",
          tree.heightLabelID,
          AVL.HIGHLIGHT_LABEL_COLOR
        );
        this.cmd("Step");
        this.cmd(
          "SetForegroundColor",
          tree.heightLabelID,
          AVL.HEIGHT_LABEL_COLOR
        );
      }
    } else {
      if (tree.right != null) {
        this.cmd(
          "CreateHighlightCircle",
          this.highlightID,
          AVL.HIGHLIGHT_COLOR,
          tree.x,
          tree.y
        );
        this.cmd("Move", this.highlightID, tree.right.x, tree.right.y);
        this.cmd("Step");
        this.cmd("Delete", this.highlightID);
      }
      this.treeDelete(tree.right, valueToDelete);
      if (tree.right != null) {
        this.cmd("SetText", 0, "Unwinding recursion.");
        this.cmd(
          "CreateHighlightCircle",
          this.highlightID,
          AVL.HIGHLIGHT_COLOR,
          tree.right.x,
          tree.right.y
        );
        this.cmd("Move", this.highlightID, tree.x, tree.y);
        this.cmd("Step");
        this.cmd("Delete", this.highlightID);
      }

      if (this.getHeight(tree.left) - this.getHeight(tree.right) > 1) {
        if (this.getHeight(tree.left.right) > this.getHeight(tree.left.left)) {
          this.doubleRotateRight(tree);
        } else {
          this.singleRotateRight(tree);
        }
      }
      if (
        this.getHeight(tree) !=
        Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1
      ) {
        tree.height =
          Math.max(this.getHeight(tree.left), this.getHeight(tree.right)) + 1;
        this.cmd("SetText", tree.heightLabelID, tree.height);
        this.cmd("SetText", 0, "Adjusting height after recursive call");
        this.cmd(
          "SetForegroundColor",
          tree.heightLabelID,
          AVL.HIGHLIGHT_LABEL_COLOR
        );
        this.cmd("Step");
        this.cmd(
          "SetForegroundColor",
          tree.heightLabelID,
          AVL.HEIGHT_LABEL_COLOR
        );
      }
    }
  } else {
    this.cmd(
      "SetText",
      0,
      "Elemet " + valueToDelete + " not found, could not delete"
    );
  }
};

AVL.prototype.resizeTree = function () {
  var startingPoint = this.startingX;
  this.resizeWidths(this.treeRoot);
  if (this.treeRoot != null) {
    if (this.treeRoot.leftWidth > startingPoint) {
      startingPoint = this.treeRoot.leftWidth;
    } else if (this.treeRoot.rightWidth > startingPoint) {
      startingPoint = Math.max(
        this.treeRoot.leftWidth,
        2 * startingPoint - this.treeRoot.rightWidth
      );
    }
    this.setNewPositions(this.treeRoot, startingPoint, AVL.STARTING_Y, 0);
    this.animateNewPositions(this.treeRoot);
    this.cmd("Step");
  }
};

AVL.prototype.setNewPositions = function (tree, xPosition, yPosition, side) {
  if (tree != null) {
    tree.y = yPosition;
    if (side == -1) {
      xPosition = xPosition - tree.rightWidth;
      tree.heightLabelX = xPosition - 20;
    } else if (side == 1) {
      xPosition = xPosition + tree.leftWidth;
      tree.heightLabelX = xPosition + 20;
    } else {
      tree.heightLabelX = xPosition - 20;
    }
    tree.x = xPosition;
    tree.heightLabelY = tree.y - 20;
    this.setNewPositions(
      tree.left,
      xPosition,
      yPosition + AVL.HEIGHT_DELTA,
      -1
    );
    this.setNewPositions(
      tree.right,
      xPosition,
      yPosition + AVL.HEIGHT_DELTA,
      1
    );
  }
};
AVL.prototype.animateNewPositions = function (tree) {
  if (tree != null) {
    this.cmd("Move", tree.graphicID, tree.x, tree.y);
    this.cmd("Move", tree.heightLabelID, tree.heightLabelX, tree.heightLabelY);
    this.animateNewPositions(tree.left);
    this.animateNewPositions(tree.right);
  }
};

AVL.prototype.resizeWidths = function (tree) {
  if (tree == null) {
    return 0;
  }
  tree.leftWidth = Math.max(this.resizeWidths(tree.left), AVL.WIDTH_DELTA / 2);
  tree.rightWidth = Math.max(
    this.resizeWidths(tree.right),
    AVL.WIDTH_DELTA / 2
  );
  return tree.leftWidth + tree.rightWidth;
};

AVL.prototype.disableUI = function (event) {
  this.insertField.disabled = true;
  this.insertButton.disabled = true;
  this.deleteField.disabled = true;
  this.deleteButton.disabled = true;
  this.findField.disabled = true;
  this.findButton.disabled = true;
  this.printButton.disabled = true;
};

AVL.prototype.enableUI = function (event) {
  this.insertField.disabled = false;
  this.insertButton.disabled = false;
  this.deleteField.disabled = false;
  this.deleteButton.disabled = false;
  this.findField.disabled = false;
  this.findButton.disabled = false;
  this.printButton.disabled = false;
};

function AVLNode(val, id, hid, initialX, initialY) {
  this.data = val;
  this.x = initialX;
  this.y = initialY;
  this.heightLabelID = hid;
  this.height = 1;

  this.graphicID = id;
  this.left = null;
  this.right = null;
  this.parent = null;
}

AVLNode.prototype.isLeftChild = function () {
  if (this.parent == null) {
    return true;
  }
  return this.parent.left == this;
};

var currentAlg;

function init() {
  var animManag = initCanvas();
  currentAlg = new AVL(animManag, canvas.width, canvas.height);
}
