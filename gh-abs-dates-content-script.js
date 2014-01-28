

function traverseDom(node, func) {
    func(node);
    node = node.firstChild;
    while (node) {
        traverseDom(node, func);
        node = node.nextSibling;
    }
}

function absDate(node) {
    if (node.nodeType == 1 && node.nodeName.toLowerCase() == "time" && node.title && node.textContent != node.title) {
        node.textContent = node.title;
    }
}

var nodeHandlers = function (node) {
    absDate(node);
};

/* initial replacement */
traverseDom(document.body, nodeHandlers);


/* now, because GitHub reloads the timestamps every minute or so, we need to reset those changes  */
MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
var observer = new MutationObserver(function(mutations, observer) {
    for (var i = 0; i < mutations.length; ++i) {
        var mutation = mutations[i];
        for (var j = 0; j < mutation.addedNodes.length; ++j) {
            var addedNode = mutation.addedNodes[j];
            if (addedNode.nodeType == 3) {
                var parent = addedNode.parentNode;
                if (parent.nodeName.toLowerCase() == "time" && parent.title && parent.textContent != parent.title) {
                    //console.log("updating time element "+ parent.title);
                    parent.textContent = parent.title;
                }
            }
        }
    }
});
observer.observe(document, {
  subtree: true,
  childList: true
});
