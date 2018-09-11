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