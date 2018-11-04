var myreact = {
    globalNode: undefined
}

function _callJSEvent(vnode, reactTag, eventName, reactEvent) {
    if (vnode._nativeTag === reactTag) {
        if (typeof vnode.attrs[eventName] === 'function') {
            vnode.attrs[eventName].call(reactEvent);
        }
        return false;
    }

    var childrens = vnode.children;

    for (let i = 0; i < childrens.length; i++) {
        var child = childrens [i];
        var ret = _callJSEvent(child, reactTag, eventName, reactEvent);
        if (ret) {
            return true;
        }
    }

    return false;
}

/**
 * @param {string} reactTag  节点标记
 * @param {string} eventName 事件类型名称
 * @param {object} reactEvent 事件参数
 * @returns {bool} 是否执行成功
 */
function _nativeCallJSEvent(reactTag, eventName, reactEvent) {
    console.log('native event call js [' + reactTag + ',' + eventName + ',' + reactEvent);
    if (myreact.globalNode) {
        _callJSEvent(myreact.globalNode, reactTag, eventName, reactEvent);
    }
}

/**
 * 获得唯一ID
 */
let nextNodeId = 1
export function uniqueId () {
  return (nextNodeId++).toString()
}

/**
 * 设置父节点
 * @param {object} child node 
 * @param {object} parent node
 */
function linkParent (node, parent) {
    node.parentNode = parent
    
    node.ownerDocument = parent.ownerDocument
    node.ownerDocument.nodeMap[node.reactTag] = node

    node.childNodes.forEach(child => {
        linkParent(child, node)
    })
}

/**
 * 插入节点
 * @param {object} target node
 * @param {array} list 
 * @param {number} newIndex 
 * @param {bool} changeSibling 
 * @return {number} newIndex
 */
function insertIndex (target, list, newIndex, changeSibling) {
    if (newIndex < 0) {
        newIndex = 0
    }

    const before = list[newIndex - 1]
    const after = list[newIndex + 1]
    list.splice(newIndex, 0, target)

    if (changeSibling) {
        before && (before.nextSibling = target)
        target.previousSibling = before
        target.nextSibling = after
        after && (after.previousSibling = target)
    }
}

/**
 * 移动节点位置
 * @param {object} target node
 * @param {array} list 
 * @param {number} newIndex 
 * @param {bool} changeSibling 
 * @return {number} newIndex
 */
function moveIndex (target, list, newIndex, changeSibling) {
    const index = list.indexOf(target)

    if (index < 0) {
        return -1
    }

    if (changeSibling) {
        const before = list[index - 1]
        const after = list[index + 1]
        before && (before.nextSibling = after)
        after && (after.previousSibling = before)
    }

    list.splice(index, 1)
    let newIndexAfter = newIndex
    if (index <= newIndex) {
        newIndexAfter = newIndex - 1
    }

    const beforeNew = list[newIndexAfter - 1]
    const afterNew = list[newIndexAfter]
    list.splice(newIndexAfter, 0, target)
    if (changeSibling) {
        beforeNew && (beforeNew.nextSibling = target)
        target.previousSibling = beforeNew
        target.nextSibling = afterNew
        afterNew && (afterNew.previousSibling = target)
    }

    if (index === newIndexAfter) {
        return -1
    }

    return newIndex
}

/**
 * 移除节点
 * @param {object} target node
 * @param {array} list 
 * @param {boolean} changeSibling 
 */
function removeIndex (target, list, changeSibling) {
    const index = list.indexOf(target)
    if (index < 0) {
        return
    }

    if (changeSibling) {
        const before = list[index - 1]
        const after = list[index + 1]
        before && (before,nextSibling = after)
        after && (after.previousSibling = before)
    }

    list.splice(index, 1)
}

/**
 * 以下为了模拟document操作
 */
var DEF_ELEMENT_TAG = 'div'
var DOC_ELEMENT_TAG = 'document'
/**
 * 虚拟节点
 */
class MRDOMNode {
    constructor (type) {
        this.nodeName = type
        this.nodeValue = null
        this.childNodes = []
        this.parentNode = null
        this.nodeType = 1
        this.reactTag = uniqueId()
        this.key = null
        this.ownerDocument = null
        this.nextSibling = null
        this.previousSibling = null
    }

    appendChild (node) {
        if (node.parentNode && node.parentNode !== this) {
            return
        }

        if (!node.parentNode) {
            linkParent(node, this)
            insertIndex(node, this.childNodes, this.childNodes.length, true)

            if (node.nodeType === 1) {
                //调用 addElement
            }
        } else {
            moveIndex(node, this.childNodes, this.childNodes.length, true)
            if (node.nodeType === 1) {
                //调用 moveElement
            }
        }
    }

    /**
     * 插入到节点之前
     * @param {object} node 要插入的节点
     * @param {object} before 目标节点
     */
    insertBefore (node, before) {
        if (node.parentNode && node.parentNode !== this) {
            return
        }

        if (node === before || (node.nextSibling && node.nextSibling === before)) {
            return
        }

        if (!node.parentNode) {
            linkParent(node, this)
            insertIndex(node, this.childNodes, this.childNodes.indexOf(before), true)

            if (node.nodeType === 1) {
                // 。。。
                // 调用 addElement
            }
        } else {
            moveIndex(node, this.childNodes, this.childNodes.indexOf(before). true)
            if (node.nodeType === 1) {
                //。。。
                // 调用 moveElement
            }
        }
    }

    /**
     * 插入到节点之后
     * @param {object} node 要插入的节点
     * @param {object} after 目标节点
     */
    insertAfter (node, after) {
        if (node.parentNode && node.parentNode !== this) {
            return
        }

        if (node === after || (node.previousSibling && node.previousSibling === after)) {
            return
        }

        if (!node.parentNode) {
            linkParent(node, this)
            insertIndex(node, this.childNodes, this.childNodes.indexOf(after) + 1, true)

            if (node.nodeType === 1) {
                // 调用 addElement
            }
        } else {
            moveIndex(node, this.childNodes, this.childNodes.indexOf(after) + 1, true)
            if (node.nodeType === 1) {
                // 调用 moveElement
            }
        }
    }

    /**
     * 移除节点
     * @param {object} node 要移除的节点
     * @param {boolean} preserved 是否保留
     */
    removeChild (node, preserved) {
        if (node.parentNode) {
            removeIndex(node, this.childNodes, true)
            if (node.nodeType === 1) {
                // 调用 removeElement
            }
        }

        if (!preserved) {
            node.destroy()
        }
    }

    replaceChild (node, old) {
        if (old.parentNode && old.parentNode !== this) {
            return
        }

        const index = this.childNodes.indexOf(old)
        if (index < 0) {
            return
        }

        // 移除旧的
        this.removeChild(old)
        // 插入新的
        if (!node.parentNode) {
            linkParent(node, this)
            insertIndex(node, this.childNodes, index, true)

            if (node.nodeType === 1) {
                // 调用 addElement
            }
        } else {
            moveIndex(node, this.childNodes, index, true)
            if (node.nodeType === 1) {
                // 调用 moveElement
            }
        }
    }

    destroy () {
        delete this.ownerDocument.nodeMap[this.reactTag]
        this.childNodes.forEach(child => {
            child.destroy()
        })
    }
}
/**
 * 虚拟元素
 */
class MRDOMElement extends MRDOMNode {
    constructor (type, props) {
        super(type)
        props = props || {}
        this.style = props.style
        this.attributes = props
    }

    setAttribute(name, value) {
        if (this.attributes[name] === value) {
            return;
        }

        this.attributes[name] = value
        // 需要调用updateAttrs
    }
}

class MRDOMText extends MRDOMNode {
    constructor (value) {
        super()
        this.nodeType = 8
        this.value = value
    }
}
/**
 * 虚拟文档
 */
class MRDOMDocument {
    constructor () {
        this.nodeMap = {}
        // 根dom
        this.createDocumentElement()
    }

    createDocumentElement () {
        let el = new MRDOMElement(DOC_ELEMENT_TAG)
        this.nodeMap._documentElement = el
        this.documentElement = el
    }

    createElement (tag) {
        let el = new MRDOMElement(tag)
        el.ownerDocument = this
        return el
    }

    createTextNode (data) {

    }

    getElementById (elId) {
        if (elId === 'root') {
            return this.documentElement;
        }
    }
}

/**
 * 以下为运行时使用到变量
 */

var document = new MRDOMDocument();