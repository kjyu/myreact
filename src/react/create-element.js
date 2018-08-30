import Component from './component.js'

function createElement( tag, attrs, ...children ) {

    attrs = attrs || {};
    var child;
    if (children.length === 1 && Array.isArray(children[0])) {
        child = children[0];
    } else {
        child = children;
    }

    return {
        tag,
        attrs,
        children: child,
        key: attrs.key || null
    }
}

export default createElement;