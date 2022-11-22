function addCategory(categories){
    let category = Document.creatElement('section');
    category.className = 'categories__category';
    let title = Document.creatElement('h1');
    title.className = 'categories__category__title';
    title.innerHTML = categories.name;
    category.appendChild(title);
    let carousel = Document.creatElement('div');
    carousel.innerHTML = 'categories__category__carousel';
    category.appendChild(carousel);
    let buttonLeft = Document.creatElement('div');
    let buttonRight = Document.creatElement('div');
    let leftArrow = Document.creatElement('div');
    let rightArrow = Document.creatElement('div');
    leftArrow.innerHTML = '<';
    rightArrow.innerHTML = '>';
    buttonLeft.appendChild(leftArrow);
    buttonRight.appendChild(rightArrow);
    
}