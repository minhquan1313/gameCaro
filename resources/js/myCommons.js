const EleProto = (namePrototype, func) => {
    Element.prototype[namePrototype] = func;
};
EleProto("hasCl", function (className = "") {
    return this.classList.contains(className);
});
EleProto("removeCl", function (className = "") {
    return this.classList.remove(className);
});
EleProto("addCl", function (className = "") {
    return this.classList.add(className);
});
EleProto("gData", function (attributeName = "") {
    return this.getAttribute("data-" + attributeName);
});
EleProto("sData", function (attributeName = "", attributeValue = "") {
    return this.setAttribute("data-" + attributeName, attributeValue);
});
EleProto("gAttr", function (attributeName = "") {
    return this.getAttribute(attributeName);
});
EleProto("sAttr", function (attributeName = "", attributeValue = "") {
    return this.setAttribute(attributeName, attributeValue);
});
EleProto("html", function (htmlValue = "") {
    return (this.innerHTML = htmlValue);
});

const l = function () {
    [...arguments].forEach((r) => {
        const type = typeof r != "string" ? "log" : "warn";
        console[type](r);
    });
    console.log("-=-=-=-=-=-=-=-=-=-=-=-=--=-=-");
};
const $ = (selector = "") => {
    return document.querySelector(selector);
};
const $$ = (selector = "") => {
    return document.querySelectorAll(selector);
};

const idCounter = (start = 0) => {
    let i = start;
    let inc = () => i++;
    return inc;
};

const cEle = (elementName = "", { ...attributes } = {}) => {
    let ele = elementName && document.createElement(elementName);
    if (ele) {
        for (let attr in attributes) {
            ele.sAttr(attr, attributes[attr]);
        }
    }
    return ele || null;
};
