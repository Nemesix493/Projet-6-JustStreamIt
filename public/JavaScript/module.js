function createHTMLElement(tag, properties){
    let element = document.createElement(tag);
    for (const property in properties){
        element[property] = properties[property];
    }
    return element;
}