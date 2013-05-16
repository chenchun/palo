/**
 * var a = [1, 2, 3, 4]
 * a.remove(0, 2)
 * a = [4]
 *
 * var a = [1, 2, 3, 4]
 * a.remove(-1)
 * a = [1, 2, 3]
 *
 * @param from index
 * @param to index
 */
Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
    this.length = from < 0 ? this.length + from : from;
    return this.push.apply(this, rest);
};


function extend(child, parent) {
    var F = function(){};
    F.prototype = parent.prototype;
    child.prototype = new F();
    child.prototype.constructor = child;
}

/**
 * 操作
 *
 * @constructor
 */
CmdNode.id = 0;
CmdNode.newId = function(prefix) {
    CmdNode.id += 1;
    return prefix === undefined? CmdNode.id : prefix + CmdNode.id;
}
function CmdNode() {
    this.initNode();
}
CmdNode.prototype.initNode = function() {
    this.parents = [];
    this.children = [];
    this.menu = {};
    this.data = [];
    this.nodeName = "";
}
CmdNode.prototype.getParents = function() {
    return this.parents;
}

CmdNode.prototype.getChildren = function() {
    return this.children;
}
CmdNode.prototype.getJqueryNode = function() {
    return this.jqueryNode;
}
/**
 * 创建dom节点
 * <div id="draggable1" class="rectangle list">
 <form class="form-horizontal">
 <div class="control-group">
 <label class="control-label" for="tbl1">表</label>

 <div class="controls">
 <input type="text" id="tbl1">
 </div>
 </div>
 <div class="control-group">
 <label class="control-label" for="column1">字段</label>

 <div class="controls">
 <input type="text" id="column1">
 </div>
 </div>
 </form>
 </div>
 */
CmdNode.prototype.draw = function() {
    if (!this.jqueryNode) {
        var draggableDiv = $('<div class="rectangle list"><form class="form-horizontal"></form></div>');
        var nodeId = this.id;
        $.each(this.menu, function(name, value) {
            var controlDiv = $('<div class="control-group"></div>');
            var elId = nodeId + '-' + name;
            $('<label class="control-label" for="' + elId + '">' + value + '</label>').appendTo(controlDiv);
            $('<div class="controls"><input type="text" id="' + elId + '" name="' + name + '"/></div>').appendTo(controlDiv);
            controlDiv.appendTo(draggableDiv.children('form'));
        })
        draggableDiv.attr('id', nodeId);
        draggableDiv.css(':after', this.content);
        draggableDiv.addClass(pseudoAfterContent(this.nodeName));
        this.jqueryNode = draggableDiv;
    }
    return this.jqueryNode;
}
CmdNode.prototype.hasChild = function(cmdNode) {
    return _.contains(this.children, cmdNode);
}
CmdNode.prototype.addChild = function(cmdNode) {
    if (!this.hasChild(cmdNode)) {
        this.children.push(cmdNode);
    }
}
CmdNode.prototype.removeChild = function(cmdNode) {
    var index = _.indexOf(this.children, cmdNode);
    if (index != -1) {
        this.children.remove(index);
    }
}
CmdNode.prototype.hasParent = function(cmdNode) {
    return _.contains(this.parents, cmdNode);
}
CmdNode.prototype.addParent = function(cmdNode) {
    if (!this.hasParent(cmdNode)) {
        this.parents.push(cmdNode);
    }
}
CmdNode.prototype.removeParent = function(cmdNode) {
    var index = _.indexOf(this.parents, cmdNode);
    if (index != -1) {
        this.parents.remove(index);
    }
}
CmdNode.prototype.serialize = function() {
    var v = {};
    v.action = this.nodeType.substring(0, this.nodeType.indexOf('Cmd')).toLowerCase();
    v.params = {};
    this.jqueryNode.find('input').each(function(index) {
        v.params[$(this).attr('name')] = $(this).val();
    })
    if (arguments.length == 1) {
        if (arguments[0] === 'save') {
            v.coordinate = [this.jqueryNode.position().left, this.jqueryNode.position().top];
        }
    }
    return v;
}
/**
 * 转json
 *
 * @return {*}
 */
CmdNode.prototype.toJson = function() {
    return JSON.stringify(this.serialize());
}

/**
 * 加载
 * @constructor
 */
function LoadCmd() {
    this.initNode();
    this.nodeType = "LoadCmd";
    this.nodeName = "加载";
//    this.fileName = "";
//    this.delimiter = "";
    this.menu = {
        "fileName" : "文件名",
        "delimeter" : "分隔符"
    };
    this.id = CmdNode.newId(this.nodeType);
}
extend(LoadCmd, CmdNode);

/**
 * 内连接
 * @constructor
 */
function InnerJoinCmd() {
    this.initNode();
    this.nodeType = "InnerJoinCmd";
    this.nodeName = "内连接";
    this.menu = {
        "leftCol" : "左表字段",
        "RightCol" : "右表字段"
    };
    this.id = CmdNode.newId(this.nodeType);
}
extend(InnerJoinCmd, CmdNode);

/**
 * 外连接
 * @constructor
 */
function OuterJoinCmd() {
    this.initNode();
    this.nodeType = "OuterJoinCmd";
    this.nodeName = "外连接";
    this.menu = {
        "leftCol" : "左表字段",
        "RightCol" : "右表字段"
    };
    this.id = CmdNode.newId(this.nodeType);
}
extend(OuterJoinCmd, CmdNode);

/**
 * 过滤
 *
 * @constructor
 */
function FilterCmd() {
    this.initNode();
    this.nodeType = "FilterCmd";
    this.nodeName = "过滤";
    this.menu = {
        "filter" : "过滤"
    };
    this.id = CmdNode.newId(this.nodeType);
}
extend(FilterCmd, CmdNode);

/**
 * 去重
 *
 * @constructor
 */
function DistinctCmd() {
    this.initNode();
    this.nodeType = "DistinctCmd";
    this.nodeName = "去重";
    this.menu = {
    };
    this.id = CmdNode.newId(this.nodeType);
}
extend(DistinctCmd, CmdNode);

/**
 * 列筛选
 *
 * @constructor
 */
function SelectCmd() {
    this.initNode();
    this.nodeType = "SelectCmd";
    this.nodeName = "列筛选";
    this.menu = {
        "expression" : "表达式"
    };
    this.id = CmdNode.newId(this.nodeType);
}
extend(SelectCmd, CmdNode);


/**
 * 改变css after伪类content属性
 * @type {Function}
 */
var pseudoAfter = (function() {
    var pseudoId = 1;
    return (function(content) {
        var className = "pseudo" + pseudoId;
        $('<style>.' + className + ':after{content:"' + content + '"}</style>').appendTo($('head'));
        pseudoId += 1;
        return className;
    });
})
var pseudoAfterContent = pseudoAfter();

var pfx = (function() {

    var style = document.createElement('dummy').style,
        prefixes = 'Webkit Moz O ms Khtml'.split(' '),
        memory = {};

    return function (prop) {
        if ( typeof memory[ prop ] === "undefined" ) {

            var ucProp = prop.charAt(0).toUpperCase() + prop.substr(1),
                props  = (prop + ' ' + prefixes.join(ucProp + ' ') + ucProp).split(' ');

            memory[ prop ] = null;
            for ( var i in props ) {
                if ( style[ props[i] ] !== undefined ) {
                    memory[ prop ] = props[i];
                    break;
                }
            }
        }
        return memory[ prop ];
    };

})();

// `css` function applies the styles given in `props` object to the element
// given as `el`. It runs all property names through `pfx` function to make
// sure proper prefixed version of the property is used.
/**
 * css(body, {
                height: "100%",
                overflow: "hidden"
            });
 * @param el
 * @param props
 * @return {*}
 */
var css = function ( el, props ) {
    var key, pkey;
    for ( key in props ) {
        if ( props.hasOwnProperty(key) ) {
            pkey = pfx(key);
            if ( pkey !== null ) {
                el.style[pkey] = props[key];
            }
        }
    }
    return el;
};

