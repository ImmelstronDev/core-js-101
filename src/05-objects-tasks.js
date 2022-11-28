/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */


/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  this.width = width;
  this.height = height;
  this.getArea = () => this.width * this.height;
}


/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}


/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const obj = JSON.parse(json);
  return Object.setPrototypeOf(obj, proto);
}


/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */
function CssSelector() {
  this.elementValue = '';
  this.idValue = '';
  this.classes = '';
  this.attrs = '';
  this.pseudoClasses = '';
  this.pseudoElementValue = '';
  this.combinator = '';
  this.supSelector = '';
  this.order = Array(6).fill(0);

  this.throwException = () => {
    throw Error('Element, id and pseudo-element should not occur more then one time inside the selector');
  };

  this.assertEmpty = (value) => {
    if (value !== '') {
      this.throwException();
    }
  };

  this.checkOrder = (value) => {
    const first = this.order.indexOf(1);
    if (first !== -1 && first > value) {
      throw Error('Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element');
    } else {
      this.order[value] = 1;
    }
  };

  this.element = (value) => {
    this.assertEmpty(this.elementValue);
    this.checkOrder(0);
    this.elementValue = value;
    return this;
  };

  this.id = (value) => {
    this.assertEmpty(this.idValue);
    this.checkOrder(1);
    this.idValue = `#${value}`;
    return this;
  };

  this.class = (value) => {
    this.checkOrder(2);
    this.classes = `${this.classes}.${value}`;
    return this;
  };

  this.attr = (value) => {
    this.checkOrder(3);
    this.attrs = `${this.attrs}[${value}]`;
    return this;
  };

  this.pseudoClass = (value) => {
    this.checkOrder(4);
    this.pseudoClasses = `${this.pseudoClasses}:${value}`;
    return this;
  };

  this.pseudoElement = (value) => {
    this.checkOrder(5);
    this.assertEmpty(this.pseudoElementValue);
    this.pseudoElementValue = `${this.pseudoElementValue}::${value}`;
    return this;
  };

  this.combine = (selector, combinator) => {
    this.supSelector = selector.stringify();
    this.combinator = combinator;
    return this;
  };

  this.stringify = () => {
    let result = this.elementValue
      .concat(this.idValue)
      .concat(this.classes)
      .concat(this.attrs)
      .concat(this.pseudoClasses)
      .concat(this.pseudoElementValue)
      .concat(' ');
    if (this.combinator !== '' && this.supSelector !== '') {
      result = result.concat(`${this.combinator} `).concat(this.supSelector);
    }
    return result.trim();
  };
}

const cssSelectorBuilder = {
  element(value) {
    return new CssSelector().element(value);
  },

  id(value) {
    return new CssSelector().id(value);
  },

  class(value) {
    return new CssSelector().class(value);
  },

  attr(value) {
    return new CssSelector().attr(value);
  },

  pseudoClass(value) {
    return new CssSelector().pseudoClass(value);
  },

  pseudoElement(value) {
    return new CssSelector().pseudoElement(value);
  },

  combine(selector1, combinator, selector2) {
    return selector1.combine(selector2, combinator);
  },
};


module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
