webpackJsonp([0],Array(471).concat([
/* 471 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(756)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(638),
  /* template */
  __webpack_require__(908),
  /* scopeId */
  "data-v-5e46292b",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 472 */,
/* 473 */,
/* 474 */,
/* 475 */,
/* 476 */,
/* 477 */,
/* 478 */,
/* 479 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Utilities
//



function _class(obj) { return Object.prototype.toString.call(obj); }

function isString(obj) { return _class(obj) === '[object String]'; }

var _hasOwnProperty = Object.prototype.hasOwnProperty;

function has(object, key) {
  return _hasOwnProperty.call(object, key);
}

// Merge objects
//
function assign(obj /*from1, from2, from3, ...*/) {
  var sources = Array.prototype.slice.call(arguments, 1);

  sources.forEach(function (source) {
    if (!source) { return; }

    if (typeof source !== 'object') {
      throw new TypeError(source + 'must be object');
    }

    Object.keys(source).forEach(function (key) {
      obj[key] = source[key];
    });
  });

  return obj;
}

// Remove element from array and put another array at those position.
// Useful for some operations with tokens
function arrayReplaceAt(src, pos, newElements) {
  return [].concat(src.slice(0, pos), newElements, src.slice(pos + 1));
}

////////////////////////////////////////////////////////////////////////////////

function isValidEntityCode(c) {
  /*eslint no-bitwise:0*/
  // broken sequence
  if (c >= 0xD800 && c <= 0xDFFF) { return false; }
  // never used
  if (c >= 0xFDD0 && c <= 0xFDEF) { return false; }
  if ((c & 0xFFFF) === 0xFFFF || (c & 0xFFFF) === 0xFFFE) { return false; }
  // control codes
  if (c >= 0x00 && c <= 0x08) { return false; }
  if (c === 0x0B) { return false; }
  if (c >= 0x0E && c <= 0x1F) { return false; }
  if (c >= 0x7F && c <= 0x9F) { return false; }
  // out of range
  if (c > 0x10FFFF) { return false; }
  return true;
}

function fromCodePoint(c) {
  /*eslint no-bitwise:0*/
  if (c > 0xffff) {
    c -= 0x10000;
    var surrogate1 = 0xd800 + (c >> 10),
        surrogate2 = 0xdc00 + (c & 0x3ff);

    return String.fromCharCode(surrogate1, surrogate2);
  }
  return String.fromCharCode(c);
}


var UNESCAPE_MD_RE  = /\\([!"#$%&'()*+,\-.\/:;<=>?@[\\\]^_`{|}~])/g;
var ENTITY_RE       = /&([a-z#][a-z0-9]{1,31});/gi;
var UNESCAPE_ALL_RE = new RegExp(UNESCAPE_MD_RE.source + '|' + ENTITY_RE.source, 'gi');

var DIGITAL_ENTITY_TEST_RE = /^#((?:x[a-f0-9]{1,8}|[0-9]{1,8}))/i;

var entities = __webpack_require__(486);

function replaceEntityPattern(match, name) {
  var code = 0;

  if (has(entities, name)) {
    return entities[name];
  }

  if (name.charCodeAt(0) === 0x23/* # */ && DIGITAL_ENTITY_TEST_RE.test(name)) {
    code = name[1].toLowerCase() === 'x' ?
      parseInt(name.slice(2), 16)
    :
      parseInt(name.slice(1), 10);
    if (isValidEntityCode(code)) {
      return fromCodePoint(code);
    }
  }

  return match;
}

/*function replaceEntities(str) {
  if (str.indexOf('&') < 0) { return str; }

  return str.replace(ENTITY_RE, replaceEntityPattern);
}*/

function unescapeMd(str) {
  if (str.indexOf('\\') < 0) { return str; }
  return str.replace(UNESCAPE_MD_RE, '$1');
}

function unescapeAll(str) {
  if (str.indexOf('\\') < 0 && str.indexOf('&') < 0) { return str; }

  return str.replace(UNESCAPE_ALL_RE, function (match, escaped, entity) {
    if (escaped) { return escaped; }
    return replaceEntityPattern(match, entity);
  });
}

////////////////////////////////////////////////////////////////////////////////

var HTML_ESCAPE_TEST_RE = /[&<>"]/;
var HTML_ESCAPE_REPLACE_RE = /[&<>"]/g;
var HTML_REPLACEMENTS = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;'
};

function replaceUnsafeChar(ch) {
  return HTML_REPLACEMENTS[ch];
}

function escapeHtml(str) {
  if (HTML_ESCAPE_TEST_RE.test(str)) {
    return str.replace(HTML_ESCAPE_REPLACE_RE, replaceUnsafeChar);
  }
  return str;
}

////////////////////////////////////////////////////////////////////////////////

var REGEXP_ESCAPE_RE = /[.?*+^$[\]\\(){}|-]/g;

function escapeRE(str) {
  return str.replace(REGEXP_ESCAPE_RE, '\\$&');
}

////////////////////////////////////////////////////////////////////////////////

function isSpace(code) {
  switch (code) {
    case 0x09:
    case 0x20:
      return true;
  }
  return false;
}

// Zs (unicode class) || [\t\f\v\r\n]
function isWhiteSpace(code) {
  if (code >= 0x2000 && code <= 0x200A) { return true; }
  switch (code) {
    case 0x09: // \t
    case 0x0A: // \n
    case 0x0B: // \v
    case 0x0C: // \f
    case 0x0D: // \r
    case 0x20:
    case 0xA0:
    case 0x1680:
    case 0x202F:
    case 0x205F:
    case 0x3000:
      return true;
  }
  return false;
}

////////////////////////////////////////////////////////////////////////////////

/*eslint-disable max-len*/
var UNICODE_PUNCT_RE = __webpack_require__(483);

// Currently without astral characters support.
function isPunctChar(ch) {
  return UNICODE_PUNCT_RE.test(ch);
}


// Markdown ASCII punctuation characters.
//
// !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~
// http://spec.commonmark.org/0.15/#ascii-punctuation-character
//
// Don't confuse with unicode punctuation !!! It lacks some chars in ascii range.
//
function isMdAsciiPunct(ch) {
  switch (ch) {
    case 0x21/* ! */:
    case 0x22/* " */:
    case 0x23/* # */:
    case 0x24/* $ */:
    case 0x25/* % */:
    case 0x26/* & */:
    case 0x27/* ' */:
    case 0x28/* ( */:
    case 0x29/* ) */:
    case 0x2A/* * */:
    case 0x2B/* + */:
    case 0x2C/* , */:
    case 0x2D/* - */:
    case 0x2E/* . */:
    case 0x2F/* / */:
    case 0x3A/* : */:
    case 0x3B/* ; */:
    case 0x3C/* < */:
    case 0x3D/* = */:
    case 0x3E/* > */:
    case 0x3F/* ? */:
    case 0x40/* @ */:
    case 0x5B/* [ */:
    case 0x5C/* \ */:
    case 0x5D/* ] */:
    case 0x5E/* ^ */:
    case 0x5F/* _ */:
    case 0x60/* ` */:
    case 0x7B/* { */:
    case 0x7C/* | */:
    case 0x7D/* } */:
    case 0x7E/* ~ */:
      return true;
    default:
      return false;
  }
}

// Hepler to unify [reference labels].
//
function normalizeReference(str) {
  // use .toUpperCase() instead of .toLowerCase()
  // here to avoid a conflict with Object.prototype
  // members (most notably, `__proto__`)
  return str.trim().replace(/\s+/g, ' ').toUpperCase();
}

////////////////////////////////////////////////////////////////////////////////

// Re-export libraries commonly used in both markdown-it and its plugins,
// so plugins won't have to depend on them explicitly, which reduces their
// bundled size (e.g. a browser build).
//
exports.lib                 = {};
exports.lib.mdurl           = __webpack_require__(490);
exports.lib.ucmicro         = __webpack_require__(563);

exports.assign              = assign;
exports.isString            = isString;
exports.has                 = has;
exports.unescapeMd          = unescapeMd;
exports.unescapeAll         = unescapeAll;
exports.isValidEntityCode   = isValidEntityCode;
exports.fromCodePoint       = fromCodePoint;
// exports.replaceEntities     = replaceEntities;
exports.escapeHtml          = escapeHtml;
exports.arrayReplaceAt      = arrayReplaceAt;
exports.isSpace             = isSpace;
exports.isWhiteSpace        = isWhiteSpace;
exports.isMdAsciiPunct      = isMdAsciiPunct;
exports.isPunctChar         = isPunctChar;
exports.escapeRE            = escapeRE;
exports.normalizeReference  = normalizeReference;


/***/ }),
/* 480 */,
/* 481 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * class Ruler
 *
 * Helper class, used by [[MarkdownIt#core]], [[MarkdownIt#block]] and
 * [[MarkdownIt#inline]] to manage sequences of functions (rules):
 *
 * - keep rules in defined order
 * - assign the name to each rule
 * - enable/disable rules
 * - add/replace rules
 * - allow assign rules to additional named chains (in the same)
 * - cacheing lists of active rules
 *
 * You will not need use this class directly until write plugins. For simple
 * rules control use [[MarkdownIt.disable]], [[MarkdownIt.enable]] and
 * [[MarkdownIt.use]].
 **/



/**
 * new Ruler()
 **/
function Ruler() {
  // List of added rules. Each element is:
  //
  // {
  //   name: XXX,
  //   enabled: Boolean,
  //   fn: Function(),
  //   alt: [ name2, name3 ]
  // }
  //
  this.__rules__ = [];

  // Cached rule chains.
  //
  // First level - chain name, '' for default.
  // Second level - diginal anchor for fast filtering by charcodes.
  //
  this.__cache__ = null;
}

////////////////////////////////////////////////////////////////////////////////
// Helper methods, should not be used directly


// Find rule index by name
//
Ruler.prototype.__find__ = function (name) {
  for (var i = 0; i < this.__rules__.length; i++) {
    if (this.__rules__[i].name === name) {
      return i;
    }
  }
  return -1;
};


// Build rules lookup cache
//
Ruler.prototype.__compile__ = function () {
  var self = this;
  var chains = [ '' ];

  // collect unique names
  self.__rules__.forEach(function (rule) {
    if (!rule.enabled) { return; }

    rule.alt.forEach(function (altName) {
      if (chains.indexOf(altName) < 0) {
        chains.push(altName);
      }
    });
  });

  self.__cache__ = {};

  chains.forEach(function (chain) {
    self.__cache__[chain] = [];
    self.__rules__.forEach(function (rule) {
      if (!rule.enabled) { return; }

      if (chain && rule.alt.indexOf(chain) < 0) { return; }

      self.__cache__[chain].push(rule.fn);
    });
  });
};


/**
 * Ruler.at(name, fn [, options])
 * - name (String): rule name to replace.
 * - fn (Function): new rule function.
 * - options (Object): new rule options (not mandatory).
 *
 * Replace rule by name with new function & options. Throws error if name not
 * found.
 *
 * ##### Options:
 *
 * - __alt__ - array with names of "alternate" chains.
 *
 * ##### Example
 *
 * Replace existing typorgapher replacement rule with new one:
 *
 * ```javascript
 * var md = require('markdown-it')();
 *
 * md.core.ruler.at('replacements', function replace(state) {
 *   //...
 * });
 * ```
 **/
Ruler.prototype.at = function (name, fn, options) {
  var index = this.__find__(name);
  var opt = options || {};

  if (index === -1) { throw new Error('Parser rule not found: ' + name); }

  this.__rules__[index].fn = fn;
  this.__rules__[index].alt = opt.alt || [];
  this.__cache__ = null;
};


/**
 * Ruler.before(beforeName, ruleName, fn [, options])
 * - beforeName (String): new rule will be added before this one.
 * - ruleName (String): name of added rule.
 * - fn (Function): rule function.
 * - options (Object): rule options (not mandatory).
 *
 * Add new rule to chain before one with given name. See also
 * [[Ruler.after]], [[Ruler.push]].
 *
 * ##### Options:
 *
 * - __alt__ - array with names of "alternate" chains.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')();
 *
 * md.block.ruler.before('paragraph', 'my_rule', function replace(state) {
 *   //...
 * });
 * ```
 **/
Ruler.prototype.before = function (beforeName, ruleName, fn, options) {
  var index = this.__find__(beforeName);
  var opt = options || {};

  if (index === -1) { throw new Error('Parser rule not found: ' + beforeName); }

  this.__rules__.splice(index, 0, {
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.__cache__ = null;
};


/**
 * Ruler.after(afterName, ruleName, fn [, options])
 * - afterName (String): new rule will be added after this one.
 * - ruleName (String): name of added rule.
 * - fn (Function): rule function.
 * - options (Object): rule options (not mandatory).
 *
 * Add new rule to chain after one with given name. See also
 * [[Ruler.before]], [[Ruler.push]].
 *
 * ##### Options:
 *
 * - __alt__ - array with names of "alternate" chains.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')();
 *
 * md.inline.ruler.after('text', 'my_rule', function replace(state) {
 *   //...
 * });
 * ```
 **/
Ruler.prototype.after = function (afterName, ruleName, fn, options) {
  var index = this.__find__(afterName);
  var opt = options || {};

  if (index === -1) { throw new Error('Parser rule not found: ' + afterName); }

  this.__rules__.splice(index + 1, 0, {
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.__cache__ = null;
};

/**
 * Ruler.push(ruleName, fn [, options])
 * - ruleName (String): name of added rule.
 * - fn (Function): rule function.
 * - options (Object): rule options (not mandatory).
 *
 * Push new rule to the end of chain. See also
 * [[Ruler.before]], [[Ruler.after]].
 *
 * ##### Options:
 *
 * - __alt__ - array with names of "alternate" chains.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')();
 *
 * md.core.ruler.push('my_rule', function replace(state) {
 *   //...
 * });
 * ```
 **/
Ruler.prototype.push = function (ruleName, fn, options) {
  var opt = options || {};

  this.__rules__.push({
    name: ruleName,
    enabled: true,
    fn: fn,
    alt: opt.alt || []
  });

  this.__cache__ = null;
};


/**
 * Ruler.enable(list [, ignoreInvalid]) -> Array
 * - list (String|Array): list of rule names to enable.
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * Enable rules with given names. If any rule name not found - throw Error.
 * Errors can be disabled by second param.
 *
 * Returns list of found rule names (if no exception happened).
 *
 * See also [[Ruler.disable]], [[Ruler.enableOnly]].
 **/
Ruler.prototype.enable = function (list, ignoreInvalid) {
  if (!Array.isArray(list)) { list = [ list ]; }

  var result = [];

  // Search by name and enable
  list.forEach(function (name) {
    var idx = this.__find__(name);

    if (idx < 0) {
      if (ignoreInvalid) { return; }
      throw new Error('Rules manager: invalid rule name ' + name);
    }
    this.__rules__[idx].enabled = true;
    result.push(name);
  }, this);

  this.__cache__ = null;
  return result;
};


/**
 * Ruler.enableOnly(list [, ignoreInvalid])
 * - list (String|Array): list of rule names to enable (whitelist).
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * Enable rules with given names, and disable everything else. If any rule name
 * not found - throw Error. Errors can be disabled by second param.
 *
 * See also [[Ruler.disable]], [[Ruler.enable]].
 **/
Ruler.prototype.enableOnly = function (list, ignoreInvalid) {
  if (!Array.isArray(list)) { list = [ list ]; }

  this.__rules__.forEach(function (rule) { rule.enabled = false; });

  this.enable(list, ignoreInvalid);
};


/**
 * Ruler.disable(list [, ignoreInvalid]) -> Array
 * - list (String|Array): list of rule names to disable.
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * Disable rules with given names. If any rule name not found - throw Error.
 * Errors can be disabled by second param.
 *
 * Returns list of found rule names (if no exception happened).
 *
 * See also [[Ruler.enable]], [[Ruler.enableOnly]].
 **/
Ruler.prototype.disable = function (list, ignoreInvalid) {
  if (!Array.isArray(list)) { list = [ list ]; }

  var result = [];

  // Search by name and disable
  list.forEach(function (name) {
    var idx = this.__find__(name);

    if (idx < 0) {
      if (ignoreInvalid) { return; }
      throw new Error('Rules manager: invalid rule name ' + name);
    }
    this.__rules__[idx].enabled = false;
    result.push(name);
  }, this);

  this.__cache__ = null;
  return result;
};


/**
 * Ruler.getRules(chainName) -> Array
 *
 * Return array of active functions (rules) for given chain name. It analyzes
 * rules configuration, compiles caches if not exists and returns result.
 *
 * Default chain name is `''` (empty string). It can't be skipped. That's
 * done intentionally, to keep signature monomorphic for high speed.
 **/
Ruler.prototype.getRules = function (chainName) {
  if (this.__cache__ === null) {
    this.__compile__();
  }

  // Chain can be empty, if rules disabled. But we still have to return Array.
  return this.__cache__[chainName] || [];
};

module.exports = Ruler;


/***/ }),
/* 482 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Token class




/**
 * class Token
 **/

/**
 * new Token(type, tag, nesting)
 *
 * Create new token and fill passed properties.
 **/
function Token(type, tag, nesting) {
  /**
   * Token#type -> String
   *
   * Type of the token (string, e.g. "paragraph_open")
   **/
  this.type     = type;

  /**
   * Token#tag -> String
   *
   * html tag name, e.g. "p"
   **/
  this.tag      = tag;

  /**
   * Token#attrs -> Array
   *
   * Html attributes. Format: `[ [ name1, value1 ], [ name2, value2 ] ]`
   **/
  this.attrs    = null;

  /**
   * Token#map -> Array
   *
   * Source map info. Format: `[ line_begin, line_end ]`
   **/
  this.map      = null;

  /**
   * Token#nesting -> Number
   *
   * Level change (number in {-1, 0, 1} set), where:
   *
   * -  `1` means the tag is opening
   * -  `0` means the tag is self-closing
   * - `-1` means the tag is closing
   **/
  this.nesting  = nesting;

  /**
   * Token#level -> Number
   *
   * nesting level, the same as `state.level`
   **/
  this.level    = 0;

  /**
   * Token#children -> Array
   *
   * An array of child nodes (inline and img tokens)
   **/
  this.children = null;

  /**
   * Token#content -> String
   *
   * In a case of self-closing tag (code, html, fence, etc.),
   * it has contents of this tag.
   **/
  this.content  = '';

  /**
   * Token#markup -> String
   *
   * '*' or '_' for emphasis, fence string for fence, etc.
   **/
  this.markup   = '';

  /**
   * Token#info -> String
   *
   * fence infostring
   **/
  this.info     = '';

  /**
   * Token#meta -> Object
   *
   * A place for plugins to store an arbitrary data
   **/
  this.meta     = null;

  /**
   * Token#block -> Boolean
   *
   * True for block-level tokens, false for inline tokens.
   * Used in renderer to calculate line breaks
   **/
  this.block    = false;

  /**
   * Token#hidden -> Boolean
   *
   * If it's true, ignore this element when rendering. Used for tight lists
   * to hide paragraphs.
   **/
  this.hidden   = false;
}


/**
 * Token.attrIndex(name) -> Number
 *
 * Search attribute index by name.
 **/
Token.prototype.attrIndex = function attrIndex(name) {
  var attrs, i, len;

  if (!this.attrs) { return -1; }

  attrs = this.attrs;

  for (i = 0, len = attrs.length; i < len; i++) {
    if (attrs[i][0] === name) { return i; }
  }
  return -1;
};


/**
 * Token.attrPush(attrData)
 *
 * Add `[ name, value ]` attribute to list. Init attrs if necessary
 **/
Token.prototype.attrPush = function attrPush(attrData) {
  if (this.attrs) {
    this.attrs.push(attrData);
  } else {
    this.attrs = [ attrData ];
  }
};


/**
 * Token.attrSet(name, value)
 *
 * Set `name` attribute to `value`. Override old value if exists.
 **/
Token.prototype.attrSet = function attrSet(name, value) {
  var idx = this.attrIndex(name),
      attrData = [ name, value ];

  if (idx < 0) {
    this.attrPush(attrData);
  } else {
    this.attrs[idx] = attrData;
  }
};


/**
 * Token.attrGet(name)
 *
 * Get the value of attribute `name`, or null if it does not exist.
 **/
Token.prototype.attrGet = function attrGet(name) {
  var idx = this.attrIndex(name), value = null;
  if (idx >= 0) {
    value = this.attrs[idx][1];
  }
  return value;
};


/**
 * Token.attrJoin(name, value)
 *
 * Join value to existing attribute via space. Or create new attribute if not
 * exists. Useful to operate with token classes.
 **/
Token.prototype.attrJoin = function attrJoin(name, value) {
  var idx = this.attrIndex(name);

  if (idx < 0) {
    this.attrPush([ name, value ]);
  } else {
    this.attrs[idx][1] = this.attrs[idx][1] + ' ' + value;
  }
};


module.exports = Token;


/***/ }),
/* 483 */
/***/ (function(module, exports) {

module.exports=/[!-#%-\*,-/:;\?@\[-\]_\{\}\xA1\xA7\xAB\xB6\xB7\xBB\xBF\u037E\u0387\u055A-\u055F\u0589\u058A\u05BE\u05C0\u05C3\u05C6\u05F3\u05F4\u0609\u060A\u060C\u060D\u061B\u061E\u061F\u066A-\u066D\u06D4\u0700-\u070D\u07F7-\u07F9\u0830-\u083E\u085E\u0964\u0965\u0970\u0AF0\u0DF4\u0E4F\u0E5A\u0E5B\u0F04-\u0F12\u0F14\u0F3A-\u0F3D\u0F85\u0FD0-\u0FD4\u0FD9\u0FDA\u104A-\u104F\u10FB\u1360-\u1368\u1400\u166D\u166E\u169B\u169C\u16EB-\u16ED\u1735\u1736\u17D4-\u17D6\u17D8-\u17DA\u1800-\u180A\u1944\u1945\u1A1E\u1A1F\u1AA0-\u1AA6\u1AA8-\u1AAD\u1B5A-\u1B60\u1BFC-\u1BFF\u1C3B-\u1C3F\u1C7E\u1C7F\u1CC0-\u1CC7\u1CD3\u2010-\u2027\u2030-\u2043\u2045-\u2051\u2053-\u205E\u207D\u207E\u208D\u208E\u2308-\u230B\u2329\u232A\u2768-\u2775\u27C5\u27C6\u27E6-\u27EF\u2983-\u2998\u29D8-\u29DB\u29FC\u29FD\u2CF9-\u2CFC\u2CFE\u2CFF\u2D70\u2E00-\u2E2E\u2E30-\u2E44\u3001-\u3003\u3008-\u3011\u3014-\u301F\u3030\u303D\u30A0\u30FB\uA4FE\uA4FF\uA60D-\uA60F\uA673\uA67E\uA6F2-\uA6F7\uA874-\uA877\uA8CE\uA8CF\uA8F8-\uA8FA\uA8FC\uA92E\uA92F\uA95F\uA9C1-\uA9CD\uA9DE\uA9DF\uAA5C-\uAA5F\uAADE\uAADF\uAAF0\uAAF1\uABEB\uFD3E\uFD3F\uFE10-\uFE19\uFE30-\uFE52\uFE54-\uFE61\uFE63\uFE68\uFE6A\uFE6B\uFF01-\uFF03\uFF05-\uFF0A\uFF0C-\uFF0F\uFF1A\uFF1B\uFF1F\uFF20\uFF3B-\uFF3D\uFF3F\uFF5B\uFF5D\uFF5F-\uFF65]|\uD800[\uDD00-\uDD02\uDF9F\uDFD0]|\uD801\uDD6F|\uD802[\uDC57\uDD1F\uDD3F\uDE50-\uDE58\uDE7F\uDEF0-\uDEF6\uDF39-\uDF3F\uDF99-\uDF9C]|\uD804[\uDC47-\uDC4D\uDCBB\uDCBC\uDCBE-\uDCC1\uDD40-\uDD43\uDD74\uDD75\uDDC5-\uDDC9\uDDCD\uDDDB\uDDDD-\uDDDF\uDE38-\uDE3D\uDEA9]|\uD805[\uDC4B-\uDC4F\uDC5B\uDC5D\uDCC6\uDDC1-\uDDD7\uDE41-\uDE43\uDE60-\uDE6C\uDF3C-\uDF3E]|\uD807[\uDC41-\uDC45\uDC70\uDC71]|\uD809[\uDC70-\uDC74]|\uD81A[\uDE6E\uDE6F\uDEF5\uDF37-\uDF3B\uDF44]|\uD82F\uDC9F|\uD836[\uDE87-\uDE8B]|\uD83A[\uDD5E\uDD5F]/

/***/ }),
/* 484 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  methods: {
    loadFourCornersScript: function loadFourCornersScript() {
      (function (d, script) {
        script = d.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.onload = function () {
          var evt = document.createEvent('Event');
          evt.initEvent('load', false, false);
          window.dispatchEvent(evt);
        };
        script.src = 'https://digitalinteraction.github.io/fourcorners/dist/4c.js';
        d.getElementsByTagName('head')[0].appendChild(script);
      })(document);
    }
  }
});

/***/ }),
/* 485 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.clamp` which doesn't coerce arguments.
 *
 * @private
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 */
function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}

module.exports = baseClamp;


/***/ }),
/* 486 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// HTML5 entities map: { name -> utf16string }
//


/*eslint quotes:0*/
module.exports = __webpack_require__(509);


/***/ }),
/* 487 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Regexps to match html elements



var attr_name     = '[a-zA-Z_:][a-zA-Z0-9:._-]*';

var unquoted      = '[^"\'=<>`\\x00-\\x20]+';
var single_quoted = "'[^']*'";
var double_quoted = '"[^"]*"';

var attr_value  = '(?:' + unquoted + '|' + single_quoted + '|' + double_quoted + ')';

var attribute   = '(?:\\s+' + attr_name + '(?:\\s*=\\s*' + attr_value + ')?)';

var open_tag    = '<[A-Za-z][A-Za-z0-9\\-]*' + attribute + '*\\s*\\/?>';

var close_tag   = '<\\/[A-Za-z][A-Za-z0-9\\-]*\\s*>';
var comment     = '<!---->|<!--(?:-?[^>-])(?:-?[^-])*-->';
var processing  = '<[?].*?[?]>';
var declaration = '<![A-Z]+\\s+[^>]*>';
var cdata       = '<!\\[CDATA\\[[\\s\\S]*?\\]\\]>';

var HTML_TAG_RE = new RegExp('^(?:' + open_tag + '|' + close_tag + '|' + comment +
                        '|' + processing + '|' + declaration + '|' + cdata + ')');
var HTML_OPEN_CLOSE_TAG_RE = new RegExp('^(?:' + open_tag + '|' + close_tag + ')');

module.exports.HTML_TAG_RE = HTML_TAG_RE;
module.exports.HTML_OPEN_CLOSE_TAG_RE = HTML_OPEN_CLOSE_TAG_RE;


/***/ }),
/* 488 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Process *this* and _that_
//



// Insert each marker as a separate text token, and add it to delimiter list
//
module.exports.tokenize = function emphasis(state, silent) {
  var i, scanned, token,
      start = state.pos,
      marker = state.src.charCodeAt(start);

  if (silent) { return false; }

  if (marker !== 0x5F /* _ */ && marker !== 0x2A /* * */) { return false; }

  scanned = state.scanDelims(state.pos, marker === 0x2A);

  for (i = 0; i < scanned.length; i++) {
    token         = state.push('text', '', 0);
    token.content = String.fromCharCode(marker);

    state.delimiters.push({
      // Char code of the starting marker (number).
      //
      marker: marker,

      // Total length of these series of delimiters.
      //
      length: scanned.length,

      // An amount of characters before this one that's equivalent to
      // current one. In plain English: if this delimiter does not open
      // an emphasis, neither do previous `jump` characters.
      //
      // Used to skip sequences like "*****" in one step, for 1st asterisk
      // value will be 0, for 2nd it's 1 and so on.
      //
      jump:   i,

      // A position of the token this delimiter corresponds to.
      //
      token:  state.tokens.length - 1,

      // Token level.
      //
      level:  state.level,

      // If this delimiter is matched as a valid opener, `end` will be
      // equal to its position, otherwise it's `-1`.
      //
      end:    -1,

      // Boolean flags that determine if this delimiter could open or close
      // an emphasis.
      //
      open:   scanned.can_open,
      close:  scanned.can_close
    });
  }

  state.pos += scanned.length;

  return true;
};


// Walk through delimiter list and replace text tokens with tags
//
module.exports.postProcess = function emphasis(state) {
  var i,
      startDelim,
      endDelim,
      token,
      ch,
      isStrong,
      delimiters = state.delimiters,
      max = state.delimiters.length;

  for (i = max - 1; i >= 0; i--) {
    startDelim = delimiters[i];

    if (startDelim.marker !== 0x5F/* _ */ && startDelim.marker !== 0x2A/* * */) {
      continue;
    }

    // Process only opening markers
    if (startDelim.end === -1) {
      continue;
    }

    endDelim = delimiters[startDelim.end];

    // If the previous delimiter has the same marker and is adjacent to this one,
    // merge those into one strong delimiter.
    //
    // `<em><em>whatever</em></em>` -> `<strong>whatever</strong>`
    //
    isStrong = i > 0 &&
               delimiters[i - 1].end === startDelim.end + 1 &&
               delimiters[i - 1].token === startDelim.token - 1 &&
               delimiters[startDelim.end + 1].token === endDelim.token + 1 &&
               delimiters[i - 1].marker === startDelim.marker;

    ch = String.fromCharCode(startDelim.marker);

    token         = state.tokens[startDelim.token];
    token.type    = isStrong ? 'strong_open' : 'em_open';
    token.tag     = isStrong ? 'strong' : 'em';
    token.nesting = 1;
    token.markup  = isStrong ? ch + ch : ch;
    token.content = '';

    token         = state.tokens[endDelim.token];
    token.type    = isStrong ? 'strong_close' : 'em_close';
    token.tag     = isStrong ? 'strong' : 'em';
    token.nesting = -1;
    token.markup  = isStrong ? ch + ch : ch;
    token.content = '';

    if (isStrong) {
      state.tokens[delimiters[i - 1].token].content = '';
      state.tokens[delimiters[startDelim.end + 1].token].content = '';
      i--;
    }
  }
};


/***/ }),
/* 489 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// ~~strike through~~
//



// Insert each marker as a separate text token, and add it to delimiter list
//
module.exports.tokenize = function strikethrough(state, silent) {
  var i, scanned, token, len, ch,
      start = state.pos,
      marker = state.src.charCodeAt(start);

  if (silent) { return false; }

  if (marker !== 0x7E/* ~ */) { return false; }

  scanned = state.scanDelims(state.pos, true);
  len = scanned.length;
  ch = String.fromCharCode(marker);

  if (len < 2) { return false; }

  if (len % 2) {
    token         = state.push('text', '', 0);
    token.content = ch;
    len--;
  }

  for (i = 0; i < len; i += 2) {
    token         = state.push('text', '', 0);
    token.content = ch + ch;

    state.delimiters.push({
      marker: marker,
      jump:   i,
      token:  state.tokens.length - 1,
      level:  state.level,
      end:    -1,
      open:   scanned.can_open,
      close:  scanned.can_close
    });
  }

  state.pos += scanned.length;

  return true;
};


// Walk through delimiter list and replace text tokens with tags
//
module.exports.postProcess = function strikethrough(state) {
  var i, j,
      startDelim,
      endDelim,
      token,
      loneMarkers = [],
      delimiters = state.delimiters,
      max = state.delimiters.length;

  for (i = 0; i < max; i++) {
    startDelim = delimiters[i];

    if (startDelim.marker !== 0x7E/* ~ */) {
      continue;
    }

    if (startDelim.end === -1) {
      continue;
    }

    endDelim = delimiters[startDelim.end];

    token         = state.tokens[startDelim.token];
    token.type    = 's_open';
    token.tag     = 's';
    token.nesting = 1;
    token.markup  = '~~';
    token.content = '';

    token         = state.tokens[endDelim.token];
    token.type    = 's_close';
    token.tag     = 's';
    token.nesting = -1;
    token.markup  = '~~';
    token.content = '';

    if (state.tokens[endDelim.token - 1].type === 'text' &&
        state.tokens[endDelim.token - 1].content === '~') {

      loneMarkers.push(endDelim.token - 1);
    }
  }

  // If a marker sequence has an odd number of characters, it's splitted
  // like this: `~~~~~` -> `~` + `~~` + `~~`, leaving one marker at the
  // start of the sequence.
  //
  // So, we have to move all those markers after subsequent s_close tags.
  //
  while (loneMarkers.length) {
    i = loneMarkers.pop();
    j = i + 1;

    while (j < state.tokens.length && state.tokens[j].type === 's_close') {
      j++;
    }

    j--;

    if (i !== j) {
      token = state.tokens[j];
      state.tokens[j] = state.tokens[i];
      state.tokens[i] = token;
    }
  }
};


/***/ }),
/* 490 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



module.exports.encode = __webpack_require__(559);
module.exports.decode = __webpack_require__(558);
module.exports.format = __webpack_require__(560);
module.exports.parse  = __webpack_require__(561);


/***/ }),
/* 491 */
/***/ (function(module, exports) {

module.exports=/[\0-\x1F\x7F-\x9F]/

/***/ }),
/* 492 */
/***/ (function(module, exports) {

module.exports=/[ \xA0\u1680\u2000-\u200A\u202F\u205F\u3000]/

/***/ }),
/* 493 */
/***/ (function(module, exports) {

module.exports=/[\0-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/

/***/ }),
/* 494 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(497)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(495),
  /* template */
  __webpack_require__(501),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 495 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__mixins_FourCorners__ = __webpack_require__(484);




/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'four-corners',
  props: ['html'],
  mixins: [__WEBPACK_IMPORTED_MODULE_0__mixins_FourCorners__["a" /* default */]]
});

/***/ }),
/* 496 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".four-corners-wrapper>img{display:block!important;margin:0!important;max-width:100%!important;padding:0!important;width:100%!important}", "", {"version":3,"sources":["/root/connectedacademy/src/components/fourcorners/FourCorners.vue"],"names":[],"mappings":"AACA,0BACE,wBAA0B,AAC1B,mBAAqB,AACrB,yBAA2B,AAC3B,oBAAsB,AACtB,oBAAuB,CACxB","file":"FourCorners.vue","sourcesContent":["\n.four-corners-wrapper > img {\n  display: block !important;\n  margin: 0 !important;\n  max-width: 100% !important;\n  padding: 0 !important;\n  width: 100% !important;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 497 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(496);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("7ee7cc29", content, true);

/***/ }),
/* 498 */
/***/ (function(module, exports, __webpack_require__) {

var baseClamp = __webpack_require__(485),
    baseToString = __webpack_require__(69),
    toInteger = __webpack_require__(68),
    toString = __webpack_require__(70);

/**
 * Checks if `string` starts with the given target string.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {string} [target] The string to search for.
 * @param {number} [position=0] The position to search from.
 * @returns {boolean} Returns `true` if `string` starts with `target`,
 *  else `false`.
 * @example
 *
 * _.startsWith('abc', 'a');
 * // => true
 *
 * _.startsWith('abc', 'b');
 * // => false
 *
 * _.startsWith('abc', 'b', 1);
 * // => true
 */
function startsWith(string, target, position) {
  string = toString(string);
  position = position == null
    ? 0
    : baseClamp(toInteger(position), 0, string.length);

  target = baseToString(target);
  return string.slice(position, position + target.length) == target;
}

module.exports = startsWith;


/***/ }),
/* 499 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



module.exports = __webpack_require__(519);


/***/ }),
/* 500 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module, global) {var __WEBPACK_AMD_DEFINE_RESULT__;/*! https://mths.be/punycode v1.4.1 by @mathias */
;(function(root) {

	/** Detect free variables */
	var freeExports = typeof exports == 'object' && exports &&
		!exports.nodeType && exports;
	var freeModule = typeof module == 'object' && module &&
		!module.nodeType && module;
	var freeGlobal = typeof global == 'object' && global;
	if (
		freeGlobal.global === freeGlobal ||
		freeGlobal.window === freeGlobal ||
		freeGlobal.self === freeGlobal
	) {
		root = freeGlobal;
	}

	/**
	 * The `punycode` object.
	 * @name punycode
	 * @type Object
	 */
	var punycode,

	/** Highest positive signed 32-bit float value */
	maxInt = 2147483647, // aka. 0x7FFFFFFF or 2^31-1

	/** Bootstring parameters */
	base = 36,
	tMin = 1,
	tMax = 26,
	skew = 38,
	damp = 700,
	initialBias = 72,
	initialN = 128, // 0x80
	delimiter = '-', // '\x2D'

	/** Regular expressions */
	regexPunycode = /^xn--/,
	regexNonASCII = /[^\x20-\x7E]/, // unprintable ASCII chars + non-ASCII chars
	regexSeparators = /[\x2E\u3002\uFF0E\uFF61]/g, // RFC 3490 separators

	/** Error messages */
	errors = {
		'overflow': 'Overflow: input needs wider integers to process',
		'not-basic': 'Illegal input >= 0x80 (not a basic code point)',
		'invalid-input': 'Invalid input'
	},

	/** Convenience shortcuts */
	baseMinusTMin = base - tMin,
	floor = Math.floor,
	stringFromCharCode = String.fromCharCode,

	/** Temporary variable */
	key;

	/*--------------------------------------------------------------------------*/

	/**
	 * A generic error utility function.
	 * @private
	 * @param {String} type The error type.
	 * @returns {Error} Throws a `RangeError` with the applicable error message.
	 */
	function error(type) {
		throw new RangeError(errors[type]);
	}

	/**
	 * A generic `Array#map` utility function.
	 * @private
	 * @param {Array} array The array to iterate over.
	 * @param {Function} callback The function that gets called for every array
	 * item.
	 * @returns {Array} A new array of values returned by the callback function.
	 */
	function map(array, fn) {
		var length = array.length;
		var result = [];
		while (length--) {
			result[length] = fn(array[length]);
		}
		return result;
	}

	/**
	 * A simple `Array#map`-like wrapper to work with domain name strings or email
	 * addresses.
	 * @private
	 * @param {String} domain The domain name or email address.
	 * @param {Function} callback The function that gets called for every
	 * character.
	 * @returns {Array} A new string of characters returned by the callback
	 * function.
	 */
	function mapDomain(string, fn) {
		var parts = string.split('@');
		var result = '';
		if (parts.length > 1) {
			// In email addresses, only the domain name should be punycoded. Leave
			// the local part (i.e. everything up to `@`) intact.
			result = parts[0] + '@';
			string = parts[1];
		}
		// Avoid `split(regex)` for IE8 compatibility. See #17.
		string = string.replace(regexSeparators, '\x2E');
		var labels = string.split('.');
		var encoded = map(labels, fn).join('.');
		return result + encoded;
	}

	/**
	 * Creates an array containing the numeric code points of each Unicode
	 * character in the string. While JavaScript uses UCS-2 internally,
	 * this function will convert a pair of surrogate halves (each of which
	 * UCS-2 exposes as separate characters) into a single code point,
	 * matching UTF-16.
	 * @see `punycode.ucs2.encode`
	 * @see <https://mathiasbynens.be/notes/javascript-encoding>
	 * @memberOf punycode.ucs2
	 * @name decode
	 * @param {String} string The Unicode input string (UCS-2).
	 * @returns {Array} The new array of code points.
	 */
	function ucs2decode(string) {
		var output = [],
		    counter = 0,
		    length = string.length,
		    value,
		    extra;
		while (counter < length) {
			value = string.charCodeAt(counter++);
			if (value >= 0xD800 && value <= 0xDBFF && counter < length) {
				// high surrogate, and there is a next character
				extra = string.charCodeAt(counter++);
				if ((extra & 0xFC00) == 0xDC00) { // low surrogate
					output.push(((value & 0x3FF) << 10) + (extra & 0x3FF) + 0x10000);
				} else {
					// unmatched surrogate; only append this code unit, in case the next
					// code unit is the high surrogate of a surrogate pair
					output.push(value);
					counter--;
				}
			} else {
				output.push(value);
			}
		}
		return output;
	}

	/**
	 * Creates a string based on an array of numeric code points.
	 * @see `punycode.ucs2.decode`
	 * @memberOf punycode.ucs2
	 * @name encode
	 * @param {Array} codePoints The array of numeric code points.
	 * @returns {String} The new Unicode string (UCS-2).
	 */
	function ucs2encode(array) {
		return map(array, function(value) {
			var output = '';
			if (value > 0xFFFF) {
				value -= 0x10000;
				output += stringFromCharCode(value >>> 10 & 0x3FF | 0xD800);
				value = 0xDC00 | value & 0x3FF;
			}
			output += stringFromCharCode(value);
			return output;
		}).join('');
	}

	/**
	 * Converts a basic code point into a digit/integer.
	 * @see `digitToBasic()`
	 * @private
	 * @param {Number} codePoint The basic numeric code point value.
	 * @returns {Number} The numeric value of a basic code point (for use in
	 * representing integers) in the range `0` to `base - 1`, or `base` if
	 * the code point does not represent a value.
	 */
	function basicToDigit(codePoint) {
		if (codePoint - 48 < 10) {
			return codePoint - 22;
		}
		if (codePoint - 65 < 26) {
			return codePoint - 65;
		}
		if (codePoint - 97 < 26) {
			return codePoint - 97;
		}
		return base;
	}

	/**
	 * Converts a digit/integer into a basic code point.
	 * @see `basicToDigit()`
	 * @private
	 * @param {Number} digit The numeric value of a basic code point.
	 * @returns {Number} The basic code point whose value (when used for
	 * representing integers) is `digit`, which needs to be in the range
	 * `0` to `base - 1`. If `flag` is non-zero, the uppercase form is
	 * used; else, the lowercase form is used. The behavior is undefined
	 * if `flag` is non-zero and `digit` has no uppercase form.
	 */
	function digitToBasic(digit, flag) {
		//  0..25 map to ASCII a..z or A..Z
		// 26..35 map to ASCII 0..9
		return digit + 22 + 75 * (digit < 26) - ((flag != 0) << 5);
	}

	/**
	 * Bias adaptation function as per section 3.4 of RFC 3492.
	 * https://tools.ietf.org/html/rfc3492#section-3.4
	 * @private
	 */
	function adapt(delta, numPoints, firstTime) {
		var k = 0;
		delta = firstTime ? floor(delta / damp) : delta >> 1;
		delta += floor(delta / numPoints);
		for (/* no initialization */; delta > baseMinusTMin * tMax >> 1; k += base) {
			delta = floor(delta / baseMinusTMin);
		}
		return floor(k + (baseMinusTMin + 1) * delta / (delta + skew));
	}

	/**
	 * Converts a Punycode string of ASCII-only symbols to a string of Unicode
	 * symbols.
	 * @memberOf punycode
	 * @param {String} input The Punycode string of ASCII-only symbols.
	 * @returns {String} The resulting string of Unicode symbols.
	 */
	function decode(input) {
		// Don't use UCS-2
		var output = [],
		    inputLength = input.length,
		    out,
		    i = 0,
		    n = initialN,
		    bias = initialBias,
		    basic,
		    j,
		    index,
		    oldi,
		    w,
		    k,
		    digit,
		    t,
		    /** Cached calculation results */
		    baseMinusT;

		// Handle the basic code points: let `basic` be the number of input code
		// points before the last delimiter, or `0` if there is none, then copy
		// the first basic code points to the output.

		basic = input.lastIndexOf(delimiter);
		if (basic < 0) {
			basic = 0;
		}

		for (j = 0; j < basic; ++j) {
			// if it's not a basic code point
			if (input.charCodeAt(j) >= 0x80) {
				error('not-basic');
			}
			output.push(input.charCodeAt(j));
		}

		// Main decoding loop: start just after the last delimiter if any basic code
		// points were copied; start at the beginning otherwise.

		for (index = basic > 0 ? basic + 1 : 0; index < inputLength; /* no final expression */) {

			// `index` is the index of the next character to be consumed.
			// Decode a generalized variable-length integer into `delta`,
			// which gets added to `i`. The overflow checking is easier
			// if we increase `i` as we go, then subtract off its starting
			// value at the end to obtain `delta`.
			for (oldi = i, w = 1, k = base; /* no condition */; k += base) {

				if (index >= inputLength) {
					error('invalid-input');
				}

				digit = basicToDigit(input.charCodeAt(index++));

				if (digit >= base || digit > floor((maxInt - i) / w)) {
					error('overflow');
				}

				i += digit * w;
				t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);

				if (digit < t) {
					break;
				}

				baseMinusT = base - t;
				if (w > floor(maxInt / baseMinusT)) {
					error('overflow');
				}

				w *= baseMinusT;

			}

			out = output.length + 1;
			bias = adapt(i - oldi, out, oldi == 0);

			// `i` was supposed to wrap around from `out` to `0`,
			// incrementing `n` each time, so we'll fix that now:
			if (floor(i / out) > maxInt - n) {
				error('overflow');
			}

			n += floor(i / out);
			i %= out;

			// Insert `n` at position `i` of the output
			output.splice(i++, 0, n);

		}

		return ucs2encode(output);
	}

	/**
	 * Converts a string of Unicode symbols (e.g. a domain name label) to a
	 * Punycode string of ASCII-only symbols.
	 * @memberOf punycode
	 * @param {String} input The string of Unicode symbols.
	 * @returns {String} The resulting Punycode string of ASCII-only symbols.
	 */
	function encode(input) {
		var n,
		    delta,
		    handledCPCount,
		    basicLength,
		    bias,
		    j,
		    m,
		    q,
		    k,
		    t,
		    currentValue,
		    output = [],
		    /** `inputLength` will hold the number of code points in `input`. */
		    inputLength,
		    /** Cached calculation results */
		    handledCPCountPlusOne,
		    baseMinusT,
		    qMinusT;

		// Convert the input in UCS-2 to Unicode
		input = ucs2decode(input);

		// Cache the length
		inputLength = input.length;

		// Initialize the state
		n = initialN;
		delta = 0;
		bias = initialBias;

		// Handle the basic code points
		for (j = 0; j < inputLength; ++j) {
			currentValue = input[j];
			if (currentValue < 0x80) {
				output.push(stringFromCharCode(currentValue));
			}
		}

		handledCPCount = basicLength = output.length;

		// `handledCPCount` is the number of code points that have been handled;
		// `basicLength` is the number of basic code points.

		// Finish the basic string - if it is not empty - with a delimiter
		if (basicLength) {
			output.push(delimiter);
		}

		// Main encoding loop:
		while (handledCPCount < inputLength) {

			// All non-basic code points < n have been handled already. Find the next
			// larger one:
			for (m = maxInt, j = 0; j < inputLength; ++j) {
				currentValue = input[j];
				if (currentValue >= n && currentValue < m) {
					m = currentValue;
				}
			}

			// Increase `delta` enough to advance the decoder's <n,i> state to <m,0>,
			// but guard against overflow
			handledCPCountPlusOne = handledCPCount + 1;
			if (m - n > floor((maxInt - delta) / handledCPCountPlusOne)) {
				error('overflow');
			}

			delta += (m - n) * handledCPCountPlusOne;
			n = m;

			for (j = 0; j < inputLength; ++j) {
				currentValue = input[j];

				if (currentValue < n && ++delta > maxInt) {
					error('overflow');
				}

				if (currentValue == n) {
					// Represent delta as a generalized variable-length integer
					for (q = delta, k = base; /* no condition */; k += base) {
						t = k <= bias ? tMin : (k >= bias + tMax ? tMax : k - bias);
						if (q < t) {
							break;
						}
						qMinusT = q - t;
						baseMinusT = base - t;
						output.push(
							stringFromCharCode(digitToBasic(t + qMinusT % baseMinusT, 0))
						);
						q = floor(qMinusT / baseMinusT);
					}

					output.push(stringFromCharCode(digitToBasic(q, 0)));
					bias = adapt(delta, handledCPCountPlusOne, handledCPCount == basicLength);
					delta = 0;
					++handledCPCount;
				}
			}

			++delta;
			++n;

		}
		return output.join('');
	}

	/**
	 * Converts a Punycode string representing a domain name or an email address
	 * to Unicode. Only the Punycoded parts of the input will be converted, i.e.
	 * it doesn't matter if you call it on a string that has already been
	 * converted to Unicode.
	 * @memberOf punycode
	 * @param {String} input The Punycoded domain name or email address to
	 * convert to Unicode.
	 * @returns {String} The Unicode representation of the given Punycode
	 * string.
	 */
	function toUnicode(input) {
		return mapDomain(input, function(string) {
			return regexPunycode.test(string)
				? decode(string.slice(4).toLowerCase())
				: string;
		});
	}

	/**
	 * Converts a Unicode string representing a domain name or an email address to
	 * Punycode. Only the non-ASCII parts of the domain name will be converted,
	 * i.e. it doesn't matter if you call it with a domain that's already in
	 * ASCII.
	 * @memberOf punycode
	 * @param {String} input The domain name or email address to convert, as a
	 * Unicode string.
	 * @returns {String} The Punycode representation of the given domain name or
	 * email address.
	 */
	function toASCII(input) {
		return mapDomain(input, function(string) {
			return regexNonASCII.test(string)
				? 'xn--' + encode(string)
				: string;
		});
	}

	/*--------------------------------------------------------------------------*/

	/** Define the public API */
	punycode = {
		/**
		 * A string representing the current Punycode.js version number.
		 * @memberOf punycode
		 * @type String
		 */
		'version': '1.4.1',
		/**
		 * An object of methods to convert from JavaScript's internal character
		 * representation (UCS-2) to Unicode code points, and back.
		 * @see <https://mathiasbynens.be/notes/javascript-encoding>
		 * @memberOf punycode
		 * @type Object
		 */
		'ucs2': {
			'decode': ucs2decode,
			'encode': ucs2encode
		},
		'decode': decode,
		'encode': encode,
		'toASCII': toASCII,
		'toUnicode': toUnicode
	};

	/** Expose `punycode` */
	// Some AMD build optimizers, like r.js, check for specific condition patterns
	// like the following:
	if (
		true
	) {
		!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
			return punycode;
		}.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (freeExports && freeModule) {
		if (module.exports == freeExports) {
			// in Node.js, io.js, or RingoJS v0.8.0+
			freeModule.exports = punycode;
		} else {
			// in Narwhal or RingoJS v0.7.0-
			for (key in punycode) {
				punycode.hasOwnProperty(key) && (freeExports[key] = punycode[key]);
			}
		}
	} else {
		// in Rhino or a web browser
		root.punycode = punycode;
	}

}(this));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(15)(module), __webpack_require__(4)))

/***/ }),
/* 501 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "four-corners-wrapper",
    domProps: {
      "innerHTML": _vm._s(_vm.html)
    }
  })
},staticRenderFns: []}

/***/ }),
/* 502 */
/***/ (function(module, exports) {

const embedRE = /@\[([\w-]+)\]\((.+)\)/im

module.exports = function plugin (md, options) {
  md.renderer.rules.custom = function tokenizeBlock (tokens, idx) {
    const { tag, arg } = tokens[idx].info
    if (!tag) return ''
    return options[tag](arg) + '\n'
  }

  md.block.ruler.before(
    'fence',
    'custom',
    function customEmbed (state, startLine, endLine, silent) {
      let startPos = state.bMarks[startLine] + state.tShift[startLine]
      let maxPos = state.eMarks[startLine]
      const block = state.src.slice(startPos, maxPos)
      let pointer = { line: startLine, pos: startPos }

      // XXX wtf
      if (startLine !== 0) {
        let prevLineStartPos = state.bMarks[startLine - 1] +
              state.tShift[startLine - 1]
        let prevLineMaxPos = state.eMarks[startLine - 1]
        if (prevLineMaxPos > prevLineStartPos) return false
      }

      // Check if it's @[tag](arg)
      if (state.src.charCodeAt(pointer.pos) !== 0x40/* @ */ ||
          state.src.charCodeAt(pointer.pos + 1) !== 0x5B/* [ */) {
        return false
      }

      const match = embedRE.exec(block)

      if (!match || match.length < 3) {
        return false
      }

      const [all, tag, arg] = match

      pointer.pos += all.length

      // Block embed must be at end of input or the next line must be blank.
      // TODO something can be done here to make it work without blank lines
      if (endLine !== pointer.line + 1) {
        let nextLineStartPos = state.bMarks[pointer.line + 1] + state.tShift[pointer.line + 1]
        let nextLineMaxPos = state.eMarks[pointer.line + 1]
        if (nextLineMaxPos > nextLineStartPos) return false
      }

      if (pointer.line >= endLine) return false

      if (!silent) {
        let token = state.push('custom', 'div', 0)
        token.markup = state.src.slice(startPos, pointer.pos)
        token.info = { arg, tag }
        token.block = true
        token.map = [ startLine, pointer.line + 1 ]
        state.line = pointer.line + 1
      }

      return true
    },
    { alt: [ 'paragraph', 'reference', 'blockquote', 'list' ] }
  )
}


/***/ }),
/* 503 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Process front matter and pass to cb
//


module.exports = function front_matter_plugin(md, cb) {
  var min_markers = 3,
      marker_str  = '-',
      marker_char = marker_str.charCodeAt(0),
      marker_len  = marker_str.length

  function frontMatter(state, startLine, endLine, silent) {
    var pos, nextLine, marker_count, markup, token,
        old_parent, old_line_max, start_content,
        auto_closed = false,
        start = state.bMarks[startLine] + state.tShift[startLine],
        max = state.eMarks[startLine];

    // Check out the first character of the first line quickly,
    // this should filter out non-front matter
    //
    if (startLine !== 0 || marker_char !== state.src.charCodeAt(0)) { return false; }

    // Check out the rest of the marker string
    //
    for (pos = start + 1; pos <= max; pos++) { // while pos <= 3
      if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
        start_content = pos + 1
        break;
      }
    }

    marker_count = Math.floor((pos - start) / marker_len);

    if (marker_count < min_markers) { return false; }
    pos -= (pos - start) % marker_len;

    // Since start is found, we can report success here in validation mode
    //
    if (silent) { return true; }

    // Search for the end of the block
    //
    nextLine = startLine;

    for (;;) {
      nextLine++;
      if (nextLine >= endLine) {
        // unclosed block should be autoclosed by end of document.
        // also block seems to be autoclosed by end of parent
        break;
      }

      start = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];

      if (start < max && state.sCount[nextLine] < state.blkIndent) {
        // non-empty line with negative indent should stop the list:
        // - ```
        //  test
        break;
      }

      if (marker_char !== state.src.charCodeAt(start)) { continue; }

      if (state.sCount[nextLine] - state.blkIndent >= 4) {
        // closing fence should be indented less than 4 spaces
        continue;
      }

      for (pos = start + 1; pos <= max; pos++) {
        if (marker_str[(pos - start) % marker_len] !== state.src[pos]) {
          break;
        }
      }

      // closing code fence must be at least as long as the opening one
      if (Math.floor((pos - start) / marker_len) < marker_count) { continue; }

      // make sure tail has spaces only
      pos -= (pos - start) % marker_len;
      pos = state.skipSpaces(pos);

      if (pos < max) { continue; }

      // found!
      auto_closed = true;
      break;
    }

    old_parent = state.parentType;
    old_line_max = state.lineMax;
    state.parentType = 'container';

    // this will prevent lazy continuations from ever going past our end marker
    state.lineMax = nextLine;

    token        = state.push('front_matter', null, 0);
    token.hidden = true;
    token.markup = state.src.slice(startLine, pos)
    token.block  = true;
    token.map    = [ startLine, pos ];

    state.parentType = old_parent;
    state.lineMax = old_line_max;
    state.line = nextLine + (auto_closed ? 1 : 0);

    cb(state.src.slice(start_content, start - 1))

    return true;
  }

  md.block.ruler.before('table', 'front_matter', frontMatter, {
    alt: [ 'paragraph', 'reference', 'blockquote', 'list' ]
  });
};

/***/ }),
/* 504 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


function replaceAttr(token, attrName, replace, env) {
    token.attrs.forEach(function (attr) {
        if (attr[0] === attrName) {
            attr[1] = replace(attr[1], env, token);
        }
    });
}

module.exports = function (md) {
    md.core.ruler.after(
        'inline',
        'replace-link',
        function (state) {
            var replace = md.options.replaceLink;
            if (typeof replace === 'function') {
                state.tokens.forEach(function (blockToken) {
                    if (blockToken.type === 'inline' && blockToken.children) {
                        blockToken.children.forEach(function (token) {
                            var type = token.type;
                            if (type === 'link_open') {
                                replaceAttr(token, 'href', replace, state.env);
                            } else if (type === 'image') {
                                replaceAttr(token, 'src', replace, state.env);
                            }
                        }); 
                    }
                }); 
            }
            return false;
        }
    );
};

/***/ }),
/* 505 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Process @[youtube](youtubeVideoID)
// Process @[vimeo](vimeoVideoID)
// Process @[vine](vineVideoID)
// Process @[prezi](preziID)




var yt_regex = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
function youtube_parser (url) {
  var match = url.match(yt_regex);
  return match && match[7].length === 11 ? match[7] : url;
}

/*eslint-disable max-len */
var vimeo_regex = /https?:\/\/(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/([^\/]*)\/videos\/|album\/(\d+)\/video\/|)(\d+)(?:$|\/|\?)/;
/*eslint-enable max-len */
function vimeo_parser (url) {
  var match = url.match(vimeo_regex);
  return match && typeof match[3] === 'string' ? match[3] : url;
}

var vine_regex = /^http(?:s?):\/\/(?:www\.)?vine\.co\/v\/([a-zA-Z0-9]{1,13}).*/;
function vine_parser (url) {
  var match = url.match(vine_regex);
  return match && match[1].length === 11 ? match[1] : url;
}

var prezi_regex = /^https:\/\/prezi.com\/(.[^/]+)/;
function prezi_parser(url) {
  var match = url.match(prezi_regex);
  return match ? match[1] : url;
}

var EMBED_REGEX = /@\[([a-zA-Z].+)\]\([\s]*(.*?)[\s]*[\)]/im;

function video_embed(md, options) {
  function video_return(state, silent) {
    var serviceEnd,
      serviceStart,
      token,
      oldPos = state.pos;

    if (state.src.charCodeAt(oldPos) !== 0x40/* @ */ ||
        state.src.charCodeAt(oldPos + 1) !== 0x5B/* [ */) {
      return false;
    }

    var match = EMBED_REGEX.exec(state.src);

    if (!match || match.length < 3) {
      return false;
    }

    var service = match[1];
    var videoID = match[2];
    var serviceLower = service.toLowerCase();

    if (serviceLower === 'youtube') {
      videoID = youtube_parser(videoID);
    } else if (serviceLower === 'vimeo') {
      videoID = vimeo_parser(videoID);
    } else if (serviceLower === 'vine') {
      videoID = vine_parser(videoID);
    } else if (serviceLower === 'prezi') {
      videoID = prezi_parser(videoID);
    } else if (!options[serviceLower]) {
      return false;
    }

    // If the videoID field is empty, regex currently make it the close parenthesis.
    if (videoID === ')') {
      videoID = '';
    }

    serviceStart = oldPos + 2;
    serviceEnd = md.helpers.parseLinkLabel(state, oldPos + 1, false);

    //
    // We found the end of the link, and know for a fact it's a valid link;
    // so all that's left to do is to call tokenizer.
    //
    if (!silent) {
      state.pos = serviceStart;
      state.posMax = serviceEnd;
      state.service = state.src.slice(serviceStart, serviceEnd);
      var newState = new state.md.inline.State(service, state.md, state.env, []);
      newState.md.inline.tokenize(newState);

      token = state.push('video', '');
      token.videoID = videoID;
      token.service = service;
      token.level = state.level;
    }

    state.pos = state.pos + state.src.indexOf(')', state.pos);
    state.posMax = state.tokens.length;
    return true;
  }

  return video_return;
}

function video_url(service, videoID, options) {
  switch (service) {
    case 'youtube':
      return '//www.youtube.com/embed/' + videoID;
    case 'vimeo':
      return '//player.vimeo.com/video/' + videoID;
    case 'vine':
      return '//vine.co/v/' + videoID + '/embed/' + options.vine.embed;
    case 'prezi':
      return 'https://prezi.com/embed/' + videoID +
      '/?bgcolor=ffffff&amp;lock_to_path=0&amp;autoplay=0&amp;autohide_ctrls=0&amp;' +
      'landing_data=bHVZZmNaNDBIWnNjdEVENDRhZDFNZGNIUE43MHdLNWpsdFJLb2ZHanI5N1lQVHkxSHFxazZ0UUNCRHloSXZROHh3PT0&amp;' +
      'landing_sign=1kD6c0N6aYpMUS0wxnQjxzSqZlEB8qNFdxtdjYhwSuI';
  }
}

function tokenize_video(md, options) {
  function tokenize_return(tokens, idx) {
    var videoID = md.utils.escapeHtml(tokens[idx].videoID);
    var service = md.utils.escapeHtml(tokens[idx].service).toLowerCase();
    return videoID === '' ? '' :
      '<div class="embed-responsive embed-responsive-16by9"><iframe class="embed-responsive-item" id="' +
      service + 'player" type="text/html" width="' + (options[service].width) +
      '" height="' + (options[service].height) +
      '" src="' + options.url(service, videoID, options) +
      '" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe></div>';
  }

  return tokenize_return;
}

var defaults = {
  url: video_url,
  youtube: { width: 640, height: 390 },
  vimeo: { width: 500, height: 281 },
  vine: { width: 600, height: 600, embed: 'simple' },
  prezi: { width: 550, height: 400 }
};

module.exports = function video_plugin(md, options) {
  if (options) {
    Object.keys(defaults).forEach(function(key) {
      if (typeof options[key] === 'undefined') {
        options[key] = defaults[key];
      }
    });
  } else {
    options = defaults;
  }
  md.renderer.rules.video = tokenize_video(md, options);
  md.inline.ruler.before('emphasis', 'video', video_embed(md, options));
};


/***/ }),
/* 506 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(510)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(507),
  /* template */
  __webpack_require__(564),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 507 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_core__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__mixins_FourCorners__ = __webpack_require__(484);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__fourcorners_FourCorners__ = __webpack_require__(494);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__fourcorners_FourCorners___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2__fourcorners_FourCorners__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_markdown_it__ = __webpack_require__(499);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_markdown_it___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_markdown_it__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_markdown_it_replace_link__ = __webpack_require__(504);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_markdown_it_replace_link___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_markdown_it_replace_link__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_markdown_it_video__ = __webpack_require__(505);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_markdown_it_video___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_markdown_it_video__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_markdown_it_front_matter__ = __webpack_require__(503);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_markdown_it_front_matter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_markdown_it_front_matter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_markdown_it_custom_block__ = __webpack_require__(502);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_markdown_it_custom_block___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_markdown_it_custom_block__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__api__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__store_mutation_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_lodash_startsWith__ = __webpack_require__(498);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_lodash_startsWith___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11_lodash_startsWith__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_lodash_endsWith__ = __webpack_require__(513);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_lodash_endsWith___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12_lodash_endsWith__);




















/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'markdown-renderer',
  mixins: [__WEBPACK_IMPORTED_MODULE_1__mixins_FourCorners__["a" /* default */]],
  components: {
    FourCorners: __WEBPACK_IMPORTED_MODULE_2__fourcorners_FourCorners___default.a
  },
  watch: {
    '$route': {
      handler: function handler(nV, oV) {
        this.loadMarkdown();
      },
      deep: true
    }
  },
  mounted: function mounted() {
    this.loadMarkdown();
  },

  props: ['markdownUrl', 'frontMatterVisible'],
  data: function data() {
    return {
      loading: true,
      renderedMarkdown: 'Loading...',
      frontMatter: {}
    };
  },

  methods: {
    getUrl: function getUrl() {
      if (this.markdownUrl) {
        return this.markdownUrl;
      }
      var url = this.$route.params.url;
      if (__WEBPACK_IMPORTED_MODULE_11_lodash_startsWith___default()(url, 'http')) {
        return url;
      } else {
        if (!(this.$store.getters.course && this.$store.getters.course.baseUri)) {
          return '';
        } else {
          return '' + this.$store.getters.course.baseUri + url;
        }
      }
    },
    loadMarkdown: function loadMarkdown() {
      var _this = this;

      this.loading = true;
      __WEBPACK_IMPORTED_MODULE_9__api__["a" /* default */].markdown.fetchMarkdown(this.getUrl(), function (response) {
        _this.renderedMarkdown = response;
        _this.loading = false;
        _this.renderMarkdown();
      }, function (response) {
        _this.renderedMarkdown = '';
      });
    },
    renderMarkdown: function renderMarkdown() {
      var _this4 = this;

      this.$log.info('Rendering markdown');

      var res = __WEBPACK_IMPORTED_MODULE_8_vue__["default"].compile(this.rawMarkdown);

      var parent = this;
      var RenderedMarkdown = new __WEBPACK_IMPORTED_MODULE_8_vue__["default"]({
        name: 'rendered-markdown',
        parent: this,
        mounted: function mounted() {
          var _this2 = this;

          this.checkingSubmissions = true;

          var request = { class: parent.theClass, content: parent.theContent };

          __WEBPACK_IMPORTED_MODULE_9__api__["a" /* default */].feedback.getFeedbackItems(request, function (response) {
            _this2.$log.info('Submission check response');
            _this2.$log.info(response);
            _this2.checkingSubmissions = false;
            _this2.submitted = false;
          }, function (response) {
            _this2.checkingSubmissions = false;
          });
        },
        data: function data() {
          return {
            fourcornersLink: '',
            checkingSubmissions: true,
            submitting: false,
            submitted: false
          };
        },

        computed: {
          contentUrl: function contentUrl() {
            return window.location.protocol + '//' + window.location.host + '/#/submission/' + parent.theClass + '/' + parent.theContent;
          },
          tweet: function tweet() {
            return this.fourcornersLink + ' ' + this.contentUrl + ' ' + this.$parent.$store.getters.course.hashtag;
          }
        },
        methods: {
          showAuth: function showAuth() {
            this.$store.commit(__WEBPACK_IMPORTED_MODULE_10__store_mutation_types__["l" /* SHOW_AUTH */]);
          },
          goToLink: function goToLink(href) {
            this.$router.push(href.replace('/#/markdown', '/markdown'));
          },
          postTweet: function postTweet() {
            var _this3 = this;

            this.submitting = true;
            this.submitted = false;

            var postData = {
              text: this.tweet
            };

            __WEBPACK_IMPORTED_MODULE_9__api__["a" /* default */].message.sendMessage(postData, function (response) {
              _this3.submitting = false;
              _this3.submitted = true;
              _this3.$store.commit(__WEBPACK_IMPORTED_MODULE_10__store_mutation_types__["g" /* SEND_MESSAGE_SUCCESS */], { response: response });
            }, function (response) {
              alert('Submission failed, please try again.');
              _this3.submitting = false;
              _this3.submitted = false;
              _this3.$store.commit(__WEBPACK_IMPORTED_MODULE_10__store_mutation_types__["h" /* SEND_MESSAGE_FAILURE */], { response: response });
            });
          }
        },
        render: res.render,
        staticRenderFns: res.staticRenderFns
      }).$mount();

      this.$refs.renderedmarkdown.replaceChild(RenderedMarkdown.$el, this.$refs.renderedmarkdown.childNodes[0]);

      setTimeout(function () {
        _this4.loadFourCornersScript();
      }, 500);
    }
  },
  computed: {
    rawMarkdown: function rawMarkdown() {
      var _this5 = this;

      var parent = this;

      var md = new __WEBPACK_IMPORTED_MODULE_3_markdown_it___default.a({
        html: true,
        linkify: true,
        replaceLink: function replaceLink(link, env) {

          if (__WEBPACK_IMPORTED_MODULE_11_lodash_startsWith___default()(link, 'http')) {
            return link;
          }
          if (__WEBPACK_IMPORTED_MODULE_12_lodash_endsWith___default()(link, '.md')) {
            var url = _this5.getUrl();
            var currentUrl = url.substring(0, url.lastIndexOf('/') + 1);
            return '/#/markdown/' + encodeURIComponent(link);
          }

          if (!_this5.$store.getters.course) {
            return '';
          } else {
            return '' + _this5.$store.getters.course.baseUri + link;
          }
        }
      }).use(__WEBPACK_IMPORTED_MODULE_4_markdown_it_replace_link___default.a).use(__WEBPACK_IMPORTED_MODULE_5_markdown_it_video___default.a, {
        youtube: { width: 640, height: 390 },
        vimeo: { width: 500, height: 281 }
      }).use(__WEBPACK_IMPORTED_MODULE_6_markdown_it_front_matter___default.a, function (fm) {
        _this5.frontMatter = fm;
      }).use(__WEBPACK_IMPORTED_MODULE_7_markdown_it_custom_block___default.a, {
        bio: function bio(arg) {
          if (!arg) {
            return 'loading...';
          }

          var parts = arg.split('|');

          var caption = parts[0].trim();
          var image = parts[1].trim();

          if (parts.length > 2) {
            var bio = parts[2].trim();
            var link = parts[3].trim();

            return '\n            <div class="md-bio md-bio--with-bio">\n              <img class="md-bio--image" src="' + image + '" />\n              <div class="md-bio--content">\n                <h5 class="md-bio--caption">' + caption + '</h5>\n                <p class="md-bio--bio">' + bio + '</p>\n                <a href="' + link + '" target="_blank" class="md-bio--link">' + link + '</a>\n              </div>\n            </div>\n            ';
          } else {
            return '\n            <div class="md-bio">\n              <img class="md-bio--image" src="' + image + '" />\n              <h5 class="md-bio--caption">' + caption + '</h5>\n            </div>\n            ';
          }
        }
      });

      md.renderer.rules.link_open = function (tokens, idx) {
        var href = md.utils.escapeHtml(tokens[idx].attrs[0][1]);
        if (href.startsWith('http')) {
          return '<a href="' + href + '" target="_blank">';
        } else {
          return '<a v-on:click="goToLink(\'' + href + '\')">';
        }
      };

      return '<div>' + md.render(this.renderedMarkdown) + '</div>';
    }
  }
});

/***/ }),
/* 508 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width{display:block;margin-bottom:10px}.pure-button.pure-button-primary{background-color:#29b474;color:#fff}.pure-button.pure-button-primary:hover{background-color:#25a268}.pure-button.pure-button-white{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success{background-color:#29b474;color:#fff}.pure-button.pure-button-success:hover{background-color:#25a268}.pure-button.pure-button-twitter{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter:hover{background-color:#2088ff}.pure-button.pure-button-subtle{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text{border-color:transparent}.pure-button.pure-button-homework{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework:hover{background-color:#fd3c51;color:#fff}body,html{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left{float:left}.pull-right{float:right}.clearfix{clear:both;float:none}.fa-icon{width:auto;height:1em}.no-margin{margin:0!important}.no-padding{padding:0!important}.background-white{background-color:#fff!important}.text-white{color:#fff}.fade-enter-active,.fade-leave-active{transition:opacity .2s}.fade-enter,.fade-leave-to{opacity:0}.fade-enter-to,.fade-leave{opacity:1}.main-container{border-radius:4px;position:relative}.main-container.main-container-padded{padding:20px}.content-block{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block{background-color:#fff}.icon-margin{margin:0 5px}.rendered-markdown h1{margin:0;padding:0;color:#444;margin-bottom:5px}.rendered-markdown a,.rendered-markdown h1,.rendered-markdown h2,.rendered-markdown h3,.rendered-markdown h4,.rendered-markdown h5,.rendered-markdown li,.rendered-markdown p{color:#444}.rendered-markdown a:first-child,.rendered-markdown h1:first-child,.rendered-markdown h2:first-child,.rendered-markdown h3:first-child,.rendered-markdown h4:first-child,.rendered-markdown h5:first-child,.rendered-markdown li:first-child,.rendered-markdown p:first-child{margin-top:0}.rendered-markdown h1,.rendered-markdown h2,.rendered-markdown h3,.rendered-markdown h4,.rendered-markdown h5{font-weight:300}.rendered-markdown h2{color:#444;font-size:1.3em;font-weight:700}.rendered-markdown p{margin:10px 0}.rendered-markdown a{color:#29b474!important;text-decoration:underline}.rendered-markdown a:hover{color:#29b474;cursor:pointer}.rendered-markdown blockquote{border-left:3px solid #29b474;color:#ccc;margin:30px 20px 30px 0;padding-left:20px;font-style:italic}.rendered-markdown pre{border-radius:6px;background-color:#e9e9e9;max-width:100%;padding:20px}.rendered-markdown img{display:inline-block;margin:10px;width:100%;max-width:160px}.rendered-markdown .fc-image>img,.rendered-markdown .fc-image img,.rendered-markdown img[data-4c]{display:block;margin:0;max-width:100%;padding:0;width:100%}.rendered-markdown .md-bio{display:inline-block;min-height:100px;overflow:hidden;padding:10px;position:relative;width:160px}.rendered-markdown .md-bio img.md-bio--image{border-radius:50%;margin:0;padding:0;margin:0 20px;height:120px;width:120px}.rendered-markdown .md-bio .md-bio--content{border-left:1px solid #e9e9e9;padding:10px}.rendered-markdown .md-bio h5.md-bio--caption{margin:0;padding:0;font-size:1em;font-weight:700;height:20px;line-height:20px;margin:5px 0;max-width:160px;overflow:hidden;text-align:center}.rendered-markdown .md-bio.md-bio--with-bio{border-radius:6px;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:10px;padding-left:100px;max-width:100%;width:100%}.rendered-markdown .md-bio.md-bio--with-bio img.md-bio--image{margin:0;padding:0;position:absolute;top:10px;left:10px;height:80px;width:80px}.rendered-markdown .md-bio.md-bio--with-bio h5.md-bio--caption{margin:0;padding:0;height:20px;max-width:100%;text-align:left;width:100%}.rendered-markdown .md-bio.md-bio--with-bio p.md-bio--bio{margin:0;padding:0;color:#666;text-align:left}", "", {"version":3,"sources":["/root/connectedacademy/src/components/MarkdownRenderer.vue"],"names":[],"mappings":"AACA,aACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,mBACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,wBACE,cAAe,AACf,kBAAoB,CACrB,AACD,iCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,uCACE,wBAA0B,CAC3B,AACD,+BACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,qCACE,+BAAkC,CACnC,AACD,iCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,uCACE,wBAA0B,CAC3B,AACD,iCACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,uCACE,wBAA0B,CAC3B,AACD,gCACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,8BACE,wBAA0B,CAC3B,AACD,kCACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,wCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,UAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,WACE,UAAY,CACb,AACD,YACE,WAAa,CACd,AACD,UACE,WAAY,AACZ,UAAY,CACb,AACD,SACE,WAAY,AACZ,UAAY,CACb,AACD,WACE,kBAAqB,CACtB,AACD,YACE,mBAAsB,CACvB,AACD,kBACE,+BAAkC,CACnC,AACD,YACE,UAAY,CACb,AACD,sCAEE,sBAAyB,CAC1B,AACD,2BAEE,SAAW,CACZ,AACD,2BAEE,SAAW,CACZ,AACD,gBACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,sCACE,YAAc,CACf,AACD,eACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,2BACE,qBAAuB,CACxB,AACD,aACE,YAAc,CACf,AACD,sBACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,iBAAmB,CACpB,AACD,8KAQE,UAAY,CACb,AACD,8QAQE,YAAc,CACf,AACD,8GAKE,eAAiB,CAClB,AACD,sBACE,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,qBACE,aAAe,CAChB,AACD,qBACE,wBAA0B,AAC1B,yBAA2B,CAC5B,AACD,2BACE,cAAe,AACf,cAAgB,CACjB,AACD,8BACE,8BAA+B,AAC/B,WAAY,AACZ,wBAA2B,AAC3B,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uBACE,kBAAmB,AACnB,yBAA0B,AAC1B,eAAgB,AAChB,YAAc,CACf,AACD,uBACE,qBAAsB,AACtB,YAAa,AACb,WAAY,AACZ,eAAiB,CAClB,AACD,kGAGE,cAAe,AACf,SAAU,AACV,eAAgB,AAChB,UAAW,AACX,UAAY,CACb,AACD,2BACE,qBAAsB,AACtB,iBAAkB,AAClB,gBAAiB,AACjB,aAAc,AACd,kBAAmB,AACnB,WAAa,CACd,AACD,6CACE,kBAAmB,AACnB,SAAU,AACV,UAAW,AACX,cAAe,AACf,aAAc,AACd,WAAa,CACd,AACD,4CACE,8BAA+B,AAC/B,YAAc,CACf,AACD,8CACE,SAAU,AACV,UAAW,AACX,cAAe,AACf,gBAAkB,AAClB,YAAa,AACb,iBAAkB,AAClB,aAAc,AACd,gBAAiB,AACjB,gBAAiB,AACjB,iBAAmB,CACpB,AACD,4CACE,kBAAmB,AACnB,sBAAuB,AACvB,2BAA4B,AAC5B,8BAA+B,AAC/B,aAAc,AACd,mBAAoB,AACpB,eAAgB,AAChB,UAAY,CACb,AACD,8DACE,SAAU,AACV,UAAW,AACX,kBAAmB,AACnB,SAAU,AACV,UAAW,AACX,YAAa,AACb,UAAY,CACb,AACD,+DACE,SAAU,AACV,UAAW,AACX,YAAa,AACb,eAAgB,AAChB,gBAAiB,AACjB,UAAY,CACb,AACD,0DACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,eAAiB,CAClB","file":"MarkdownRenderer.vue","sourcesContent":["\n.pure-button {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml,\nbody {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left {\n  float: left;\n}\n.pull-right {\n  float: right;\n}\n.clearfix {\n  clear: both;\n  float: none;\n}\n.fa-icon {\n  width: auto;\n  height: 1em;\n}\n.no-margin {\n  margin: 0 !important;\n}\n.no-padding {\n  padding: 0 !important;\n}\n.background-white {\n  background-color: #fff !important;\n}\n.text-white {\n  color: #fff;\n}\n.fade-enter-active,\n.fade-leave-active {\n  transition: opacity 0.2s;\n}\n.fade-enter,\n.fade-leave-to {\n  opacity: 0;\n}\n.fade-enter-to,\n.fade-leave {\n  opacity: 1;\n}\n.main-container {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded {\n  padding: 20px;\n}\n.content-block {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block {\n  background-color: #fff;\n}\n.icon-margin {\n  margin: 0 5px;\n}\n.rendered-markdown h1 {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  margin-bottom: 5px;\n}\n.rendered-markdown h1,\n.rendered-markdown h2,\n.rendered-markdown h3,\n.rendered-markdown h4,\n.rendered-markdown h5,\n.rendered-markdown p,\n.rendered-markdown a,\n.rendered-markdown li {\n  color: #444;\n}\n.rendered-markdown h1:first-child,\n.rendered-markdown h2:first-child,\n.rendered-markdown h3:first-child,\n.rendered-markdown h4:first-child,\n.rendered-markdown h5:first-child,\n.rendered-markdown p:first-child,\n.rendered-markdown a:first-child,\n.rendered-markdown li:first-child {\n  margin-top: 0;\n}\n.rendered-markdown h1,\n.rendered-markdown h2,\n.rendered-markdown h3,\n.rendered-markdown h4,\n.rendered-markdown h5 {\n  font-weight: 300;\n}\n.rendered-markdown h2 {\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.rendered-markdown p {\n  margin: 10px 0;\n}\n.rendered-markdown a {\n  color: #29b474 !important;\n  text-decoration: underline;\n}\n.rendered-markdown a:hover {\n  color: #29b474;\n  cursor: pointer;\n}\n.rendered-markdown blockquote {\n  border-left: #29b474 3px solid;\n  color: #ccc;\n  margin: 30px 20px 30px 0px;\n  padding-left: 20px;\n  font-style: italic;\n}\n.rendered-markdown pre {\n  border-radius: 6px;\n  background-color: #e9e9e9;\n  max-width: 100%;\n  padding: 20px;\n}\n.rendered-markdown img {\n  display: inline-block;\n  margin: 10px;\n  width: 100%;\n  max-width: 160px;\n}\n.rendered-markdown img[data-4c],\n.rendered-markdown .fc-image img,\n.rendered-markdown .fc-image > img {\n  display: block;\n  margin: 0;\n  max-width: 100%;\n  padding: 0;\n  width: 100%;\n}\n.rendered-markdown .md-bio {\n  display: inline-block;\n  min-height: 100px;\n  overflow: hidden;\n  padding: 10px;\n  position: relative;\n  width: 160px;\n}\n.rendered-markdown .md-bio img.md-bio--image {\n  border-radius: 50%;\n  margin: 0;\n  padding: 0;\n  margin: 0 20px;\n  height: 120px;\n  width: 120px;\n}\n.rendered-markdown .md-bio .md-bio--content {\n  border-left: #e9e9e9 1px solid;\n  padding: 10px;\n}\n.rendered-markdown .md-bio h5.md-bio--caption {\n  margin: 0;\n  padding: 0;\n  font-size: 1em;\n  font-weight: bold;\n  height: 20px;\n  line-height: 20px;\n  margin: 5px 0;\n  max-width: 160px;\n  overflow: hidden;\n  text-align: center;\n}\n.rendered-markdown .md-bio.md-bio--with-bio {\n  border-radius: 6px;\n  box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  padding: 10px;\n  padding-left: 100px;\n  max-width: 100%;\n  width: 100%;\n}\n.rendered-markdown .md-bio.md-bio--with-bio img.md-bio--image {\n  margin: 0;\n  padding: 0;\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  height: 80px;\n  width: 80px;\n}\n.rendered-markdown .md-bio.md-bio--with-bio h5.md-bio--caption {\n  margin: 0;\n  padding: 0;\n  height: 20px;\n  max-width: 100%;\n  text-align: left;\n  width: 100%;\n}\n.rendered-markdown .md-bio.md-bio--with-bio p.md-bio--bio {\n  margin: 0;\n  padding: 0;\n  color: #666;\n  text-align: left;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 509 */
/***/ (function(module, exports) {

module.exports = {"Aacute":"Á","aacute":"á","Abreve":"Ă","abreve":"ă","ac":"∾","acd":"∿","acE":"∾̳","Acirc":"Â","acirc":"â","acute":"´","Acy":"А","acy":"а","AElig":"Æ","aelig":"æ","af":"⁡","Afr":"𝔄","afr":"𝔞","Agrave":"À","agrave":"à","alefsym":"ℵ","aleph":"ℵ","Alpha":"Α","alpha":"α","Amacr":"Ā","amacr":"ā","amalg":"⨿","amp":"&","AMP":"&","andand":"⩕","And":"⩓","and":"∧","andd":"⩜","andslope":"⩘","andv":"⩚","ang":"∠","ange":"⦤","angle":"∠","angmsdaa":"⦨","angmsdab":"⦩","angmsdac":"⦪","angmsdad":"⦫","angmsdae":"⦬","angmsdaf":"⦭","angmsdag":"⦮","angmsdah":"⦯","angmsd":"∡","angrt":"∟","angrtvb":"⊾","angrtvbd":"⦝","angsph":"∢","angst":"Å","angzarr":"⍼","Aogon":"Ą","aogon":"ą","Aopf":"𝔸","aopf":"𝕒","apacir":"⩯","ap":"≈","apE":"⩰","ape":"≊","apid":"≋","apos":"'","ApplyFunction":"⁡","approx":"≈","approxeq":"≊","Aring":"Å","aring":"å","Ascr":"𝒜","ascr":"𝒶","Assign":"≔","ast":"*","asymp":"≈","asympeq":"≍","Atilde":"Ã","atilde":"ã","Auml":"Ä","auml":"ä","awconint":"∳","awint":"⨑","backcong":"≌","backepsilon":"϶","backprime":"‵","backsim":"∽","backsimeq":"⋍","Backslash":"∖","Barv":"⫧","barvee":"⊽","barwed":"⌅","Barwed":"⌆","barwedge":"⌅","bbrk":"⎵","bbrktbrk":"⎶","bcong":"≌","Bcy":"Б","bcy":"б","bdquo":"„","becaus":"∵","because":"∵","Because":"∵","bemptyv":"⦰","bepsi":"϶","bernou":"ℬ","Bernoullis":"ℬ","Beta":"Β","beta":"β","beth":"ℶ","between":"≬","Bfr":"𝔅","bfr":"𝔟","bigcap":"⋂","bigcirc":"◯","bigcup":"⋃","bigodot":"⨀","bigoplus":"⨁","bigotimes":"⨂","bigsqcup":"⨆","bigstar":"★","bigtriangledown":"▽","bigtriangleup":"△","biguplus":"⨄","bigvee":"⋁","bigwedge":"⋀","bkarow":"⤍","blacklozenge":"⧫","blacksquare":"▪","blacktriangle":"▴","blacktriangledown":"▾","blacktriangleleft":"◂","blacktriangleright":"▸","blank":"␣","blk12":"▒","blk14":"░","blk34":"▓","block":"█","bne":"=⃥","bnequiv":"≡⃥","bNot":"⫭","bnot":"⌐","Bopf":"𝔹","bopf":"𝕓","bot":"⊥","bottom":"⊥","bowtie":"⋈","boxbox":"⧉","boxdl":"┐","boxdL":"╕","boxDl":"╖","boxDL":"╗","boxdr":"┌","boxdR":"╒","boxDr":"╓","boxDR":"╔","boxh":"─","boxH":"═","boxhd":"┬","boxHd":"╤","boxhD":"╥","boxHD":"╦","boxhu":"┴","boxHu":"╧","boxhU":"╨","boxHU":"╩","boxminus":"⊟","boxplus":"⊞","boxtimes":"⊠","boxul":"┘","boxuL":"╛","boxUl":"╜","boxUL":"╝","boxur":"└","boxuR":"╘","boxUr":"╙","boxUR":"╚","boxv":"│","boxV":"║","boxvh":"┼","boxvH":"╪","boxVh":"╫","boxVH":"╬","boxvl":"┤","boxvL":"╡","boxVl":"╢","boxVL":"╣","boxvr":"├","boxvR":"╞","boxVr":"╟","boxVR":"╠","bprime":"‵","breve":"˘","Breve":"˘","brvbar":"¦","bscr":"𝒷","Bscr":"ℬ","bsemi":"⁏","bsim":"∽","bsime":"⋍","bsolb":"⧅","bsol":"\\","bsolhsub":"⟈","bull":"•","bullet":"•","bump":"≎","bumpE":"⪮","bumpe":"≏","Bumpeq":"≎","bumpeq":"≏","Cacute":"Ć","cacute":"ć","capand":"⩄","capbrcup":"⩉","capcap":"⩋","cap":"∩","Cap":"⋒","capcup":"⩇","capdot":"⩀","CapitalDifferentialD":"ⅅ","caps":"∩︀","caret":"⁁","caron":"ˇ","Cayleys":"ℭ","ccaps":"⩍","Ccaron":"Č","ccaron":"č","Ccedil":"Ç","ccedil":"ç","Ccirc":"Ĉ","ccirc":"ĉ","Cconint":"∰","ccups":"⩌","ccupssm":"⩐","Cdot":"Ċ","cdot":"ċ","cedil":"¸","Cedilla":"¸","cemptyv":"⦲","cent":"¢","centerdot":"·","CenterDot":"·","cfr":"𝔠","Cfr":"ℭ","CHcy":"Ч","chcy":"ч","check":"✓","checkmark":"✓","Chi":"Χ","chi":"χ","circ":"ˆ","circeq":"≗","circlearrowleft":"↺","circlearrowright":"↻","circledast":"⊛","circledcirc":"⊚","circleddash":"⊝","CircleDot":"⊙","circledR":"®","circledS":"Ⓢ","CircleMinus":"⊖","CirclePlus":"⊕","CircleTimes":"⊗","cir":"○","cirE":"⧃","cire":"≗","cirfnint":"⨐","cirmid":"⫯","cirscir":"⧂","ClockwiseContourIntegral":"∲","CloseCurlyDoubleQuote":"”","CloseCurlyQuote":"’","clubs":"♣","clubsuit":"♣","colon":":","Colon":"∷","Colone":"⩴","colone":"≔","coloneq":"≔","comma":",","commat":"@","comp":"∁","compfn":"∘","complement":"∁","complexes":"ℂ","cong":"≅","congdot":"⩭","Congruent":"≡","conint":"∮","Conint":"∯","ContourIntegral":"∮","copf":"𝕔","Copf":"ℂ","coprod":"∐","Coproduct":"∐","copy":"©","COPY":"©","copysr":"℗","CounterClockwiseContourIntegral":"∳","crarr":"↵","cross":"✗","Cross":"⨯","Cscr":"𝒞","cscr":"𝒸","csub":"⫏","csube":"⫑","csup":"⫐","csupe":"⫒","ctdot":"⋯","cudarrl":"⤸","cudarrr":"⤵","cuepr":"⋞","cuesc":"⋟","cularr":"↶","cularrp":"⤽","cupbrcap":"⩈","cupcap":"⩆","CupCap":"≍","cup":"∪","Cup":"⋓","cupcup":"⩊","cupdot":"⊍","cupor":"⩅","cups":"∪︀","curarr":"↷","curarrm":"⤼","curlyeqprec":"⋞","curlyeqsucc":"⋟","curlyvee":"⋎","curlywedge":"⋏","curren":"¤","curvearrowleft":"↶","curvearrowright":"↷","cuvee":"⋎","cuwed":"⋏","cwconint":"∲","cwint":"∱","cylcty":"⌭","dagger":"†","Dagger":"‡","daleth":"ℸ","darr":"↓","Darr":"↡","dArr":"⇓","dash":"‐","Dashv":"⫤","dashv":"⊣","dbkarow":"⤏","dblac":"˝","Dcaron":"Ď","dcaron":"ď","Dcy":"Д","dcy":"д","ddagger":"‡","ddarr":"⇊","DD":"ⅅ","dd":"ⅆ","DDotrahd":"⤑","ddotseq":"⩷","deg":"°","Del":"∇","Delta":"Δ","delta":"δ","demptyv":"⦱","dfisht":"⥿","Dfr":"𝔇","dfr":"𝔡","dHar":"⥥","dharl":"⇃","dharr":"⇂","DiacriticalAcute":"´","DiacriticalDot":"˙","DiacriticalDoubleAcute":"˝","DiacriticalGrave":"`","DiacriticalTilde":"˜","diam":"⋄","diamond":"⋄","Diamond":"⋄","diamondsuit":"♦","diams":"♦","die":"¨","DifferentialD":"ⅆ","digamma":"ϝ","disin":"⋲","div":"÷","divide":"÷","divideontimes":"⋇","divonx":"⋇","DJcy":"Ђ","djcy":"ђ","dlcorn":"⌞","dlcrop":"⌍","dollar":"$","Dopf":"𝔻","dopf":"𝕕","Dot":"¨","dot":"˙","DotDot":"⃜","doteq":"≐","doteqdot":"≑","DotEqual":"≐","dotminus":"∸","dotplus":"∔","dotsquare":"⊡","doublebarwedge":"⌆","DoubleContourIntegral":"∯","DoubleDot":"¨","DoubleDownArrow":"⇓","DoubleLeftArrow":"⇐","DoubleLeftRightArrow":"⇔","DoubleLeftTee":"⫤","DoubleLongLeftArrow":"⟸","DoubleLongLeftRightArrow":"⟺","DoubleLongRightArrow":"⟹","DoubleRightArrow":"⇒","DoubleRightTee":"⊨","DoubleUpArrow":"⇑","DoubleUpDownArrow":"⇕","DoubleVerticalBar":"∥","DownArrowBar":"⤓","downarrow":"↓","DownArrow":"↓","Downarrow":"⇓","DownArrowUpArrow":"⇵","DownBreve":"̑","downdownarrows":"⇊","downharpoonleft":"⇃","downharpoonright":"⇂","DownLeftRightVector":"⥐","DownLeftTeeVector":"⥞","DownLeftVectorBar":"⥖","DownLeftVector":"↽","DownRightTeeVector":"⥟","DownRightVectorBar":"⥗","DownRightVector":"⇁","DownTeeArrow":"↧","DownTee":"⊤","drbkarow":"⤐","drcorn":"⌟","drcrop":"⌌","Dscr":"𝒟","dscr":"𝒹","DScy":"Ѕ","dscy":"ѕ","dsol":"⧶","Dstrok":"Đ","dstrok":"đ","dtdot":"⋱","dtri":"▿","dtrif":"▾","duarr":"⇵","duhar":"⥯","dwangle":"⦦","DZcy":"Џ","dzcy":"џ","dzigrarr":"⟿","Eacute":"É","eacute":"é","easter":"⩮","Ecaron":"Ě","ecaron":"ě","Ecirc":"Ê","ecirc":"ê","ecir":"≖","ecolon":"≕","Ecy":"Э","ecy":"э","eDDot":"⩷","Edot":"Ė","edot":"ė","eDot":"≑","ee":"ⅇ","efDot":"≒","Efr":"𝔈","efr":"𝔢","eg":"⪚","Egrave":"È","egrave":"è","egs":"⪖","egsdot":"⪘","el":"⪙","Element":"∈","elinters":"⏧","ell":"ℓ","els":"⪕","elsdot":"⪗","Emacr":"Ē","emacr":"ē","empty":"∅","emptyset":"∅","EmptySmallSquare":"◻","emptyv":"∅","EmptyVerySmallSquare":"▫","emsp13":" ","emsp14":" ","emsp":" ","ENG":"Ŋ","eng":"ŋ","ensp":" ","Eogon":"Ę","eogon":"ę","Eopf":"𝔼","eopf":"𝕖","epar":"⋕","eparsl":"⧣","eplus":"⩱","epsi":"ε","Epsilon":"Ε","epsilon":"ε","epsiv":"ϵ","eqcirc":"≖","eqcolon":"≕","eqsim":"≂","eqslantgtr":"⪖","eqslantless":"⪕","Equal":"⩵","equals":"=","EqualTilde":"≂","equest":"≟","Equilibrium":"⇌","equiv":"≡","equivDD":"⩸","eqvparsl":"⧥","erarr":"⥱","erDot":"≓","escr":"ℯ","Escr":"ℰ","esdot":"≐","Esim":"⩳","esim":"≂","Eta":"Η","eta":"η","ETH":"Ð","eth":"ð","Euml":"Ë","euml":"ë","euro":"€","excl":"!","exist":"∃","Exists":"∃","expectation":"ℰ","exponentiale":"ⅇ","ExponentialE":"ⅇ","fallingdotseq":"≒","Fcy":"Ф","fcy":"ф","female":"♀","ffilig":"ﬃ","fflig":"ﬀ","ffllig":"ﬄ","Ffr":"𝔉","ffr":"𝔣","filig":"ﬁ","FilledSmallSquare":"◼","FilledVerySmallSquare":"▪","fjlig":"fj","flat":"♭","fllig":"ﬂ","fltns":"▱","fnof":"ƒ","Fopf":"𝔽","fopf":"𝕗","forall":"∀","ForAll":"∀","fork":"⋔","forkv":"⫙","Fouriertrf":"ℱ","fpartint":"⨍","frac12":"½","frac13":"⅓","frac14":"¼","frac15":"⅕","frac16":"⅙","frac18":"⅛","frac23":"⅔","frac25":"⅖","frac34":"¾","frac35":"⅗","frac38":"⅜","frac45":"⅘","frac56":"⅚","frac58":"⅝","frac78":"⅞","frasl":"⁄","frown":"⌢","fscr":"𝒻","Fscr":"ℱ","gacute":"ǵ","Gamma":"Γ","gamma":"γ","Gammad":"Ϝ","gammad":"ϝ","gap":"⪆","Gbreve":"Ğ","gbreve":"ğ","Gcedil":"Ģ","Gcirc":"Ĝ","gcirc":"ĝ","Gcy":"Г","gcy":"г","Gdot":"Ġ","gdot":"ġ","ge":"≥","gE":"≧","gEl":"⪌","gel":"⋛","geq":"≥","geqq":"≧","geqslant":"⩾","gescc":"⪩","ges":"⩾","gesdot":"⪀","gesdoto":"⪂","gesdotol":"⪄","gesl":"⋛︀","gesles":"⪔","Gfr":"𝔊","gfr":"𝔤","gg":"≫","Gg":"⋙","ggg":"⋙","gimel":"ℷ","GJcy":"Ѓ","gjcy":"ѓ","gla":"⪥","gl":"≷","glE":"⪒","glj":"⪤","gnap":"⪊","gnapprox":"⪊","gne":"⪈","gnE":"≩","gneq":"⪈","gneqq":"≩","gnsim":"⋧","Gopf":"𝔾","gopf":"𝕘","grave":"`","GreaterEqual":"≥","GreaterEqualLess":"⋛","GreaterFullEqual":"≧","GreaterGreater":"⪢","GreaterLess":"≷","GreaterSlantEqual":"⩾","GreaterTilde":"≳","Gscr":"𝒢","gscr":"ℊ","gsim":"≳","gsime":"⪎","gsiml":"⪐","gtcc":"⪧","gtcir":"⩺","gt":">","GT":">","Gt":"≫","gtdot":"⋗","gtlPar":"⦕","gtquest":"⩼","gtrapprox":"⪆","gtrarr":"⥸","gtrdot":"⋗","gtreqless":"⋛","gtreqqless":"⪌","gtrless":"≷","gtrsim":"≳","gvertneqq":"≩︀","gvnE":"≩︀","Hacek":"ˇ","hairsp":" ","half":"½","hamilt":"ℋ","HARDcy":"Ъ","hardcy":"ъ","harrcir":"⥈","harr":"↔","hArr":"⇔","harrw":"↭","Hat":"^","hbar":"ℏ","Hcirc":"Ĥ","hcirc":"ĥ","hearts":"♥","heartsuit":"♥","hellip":"…","hercon":"⊹","hfr":"𝔥","Hfr":"ℌ","HilbertSpace":"ℋ","hksearow":"⤥","hkswarow":"⤦","hoarr":"⇿","homtht":"∻","hookleftarrow":"↩","hookrightarrow":"↪","hopf":"𝕙","Hopf":"ℍ","horbar":"―","HorizontalLine":"─","hscr":"𝒽","Hscr":"ℋ","hslash":"ℏ","Hstrok":"Ħ","hstrok":"ħ","HumpDownHump":"≎","HumpEqual":"≏","hybull":"⁃","hyphen":"‐","Iacute":"Í","iacute":"í","ic":"⁣","Icirc":"Î","icirc":"î","Icy":"И","icy":"и","Idot":"İ","IEcy":"Е","iecy":"е","iexcl":"¡","iff":"⇔","ifr":"𝔦","Ifr":"ℑ","Igrave":"Ì","igrave":"ì","ii":"ⅈ","iiiint":"⨌","iiint":"∭","iinfin":"⧜","iiota":"℩","IJlig":"Ĳ","ijlig":"ĳ","Imacr":"Ī","imacr":"ī","image":"ℑ","ImaginaryI":"ⅈ","imagline":"ℐ","imagpart":"ℑ","imath":"ı","Im":"ℑ","imof":"⊷","imped":"Ƶ","Implies":"⇒","incare":"℅","in":"∈","infin":"∞","infintie":"⧝","inodot":"ı","intcal":"⊺","int":"∫","Int":"∬","integers":"ℤ","Integral":"∫","intercal":"⊺","Intersection":"⋂","intlarhk":"⨗","intprod":"⨼","InvisibleComma":"⁣","InvisibleTimes":"⁢","IOcy":"Ё","iocy":"ё","Iogon":"Į","iogon":"į","Iopf":"𝕀","iopf":"𝕚","Iota":"Ι","iota":"ι","iprod":"⨼","iquest":"¿","iscr":"𝒾","Iscr":"ℐ","isin":"∈","isindot":"⋵","isinE":"⋹","isins":"⋴","isinsv":"⋳","isinv":"∈","it":"⁢","Itilde":"Ĩ","itilde":"ĩ","Iukcy":"І","iukcy":"і","Iuml":"Ï","iuml":"ï","Jcirc":"Ĵ","jcirc":"ĵ","Jcy":"Й","jcy":"й","Jfr":"𝔍","jfr":"𝔧","jmath":"ȷ","Jopf":"𝕁","jopf":"𝕛","Jscr":"𝒥","jscr":"𝒿","Jsercy":"Ј","jsercy":"ј","Jukcy":"Є","jukcy":"є","Kappa":"Κ","kappa":"κ","kappav":"ϰ","Kcedil":"Ķ","kcedil":"ķ","Kcy":"К","kcy":"к","Kfr":"𝔎","kfr":"𝔨","kgreen":"ĸ","KHcy":"Х","khcy":"х","KJcy":"Ќ","kjcy":"ќ","Kopf":"𝕂","kopf":"𝕜","Kscr":"𝒦","kscr":"𝓀","lAarr":"⇚","Lacute":"Ĺ","lacute":"ĺ","laemptyv":"⦴","lagran":"ℒ","Lambda":"Λ","lambda":"λ","lang":"⟨","Lang":"⟪","langd":"⦑","langle":"⟨","lap":"⪅","Laplacetrf":"ℒ","laquo":"«","larrb":"⇤","larrbfs":"⤟","larr":"←","Larr":"↞","lArr":"⇐","larrfs":"⤝","larrhk":"↩","larrlp":"↫","larrpl":"⤹","larrsim":"⥳","larrtl":"↢","latail":"⤙","lAtail":"⤛","lat":"⪫","late":"⪭","lates":"⪭︀","lbarr":"⤌","lBarr":"⤎","lbbrk":"❲","lbrace":"{","lbrack":"[","lbrke":"⦋","lbrksld":"⦏","lbrkslu":"⦍","Lcaron":"Ľ","lcaron":"ľ","Lcedil":"Ļ","lcedil":"ļ","lceil":"⌈","lcub":"{","Lcy":"Л","lcy":"л","ldca":"⤶","ldquo":"“","ldquor":"„","ldrdhar":"⥧","ldrushar":"⥋","ldsh":"↲","le":"≤","lE":"≦","LeftAngleBracket":"⟨","LeftArrowBar":"⇤","leftarrow":"←","LeftArrow":"←","Leftarrow":"⇐","LeftArrowRightArrow":"⇆","leftarrowtail":"↢","LeftCeiling":"⌈","LeftDoubleBracket":"⟦","LeftDownTeeVector":"⥡","LeftDownVectorBar":"⥙","LeftDownVector":"⇃","LeftFloor":"⌊","leftharpoondown":"↽","leftharpoonup":"↼","leftleftarrows":"⇇","leftrightarrow":"↔","LeftRightArrow":"↔","Leftrightarrow":"⇔","leftrightarrows":"⇆","leftrightharpoons":"⇋","leftrightsquigarrow":"↭","LeftRightVector":"⥎","LeftTeeArrow":"↤","LeftTee":"⊣","LeftTeeVector":"⥚","leftthreetimes":"⋋","LeftTriangleBar":"⧏","LeftTriangle":"⊲","LeftTriangleEqual":"⊴","LeftUpDownVector":"⥑","LeftUpTeeVector":"⥠","LeftUpVectorBar":"⥘","LeftUpVector":"↿","LeftVectorBar":"⥒","LeftVector":"↼","lEg":"⪋","leg":"⋚","leq":"≤","leqq":"≦","leqslant":"⩽","lescc":"⪨","les":"⩽","lesdot":"⩿","lesdoto":"⪁","lesdotor":"⪃","lesg":"⋚︀","lesges":"⪓","lessapprox":"⪅","lessdot":"⋖","lesseqgtr":"⋚","lesseqqgtr":"⪋","LessEqualGreater":"⋚","LessFullEqual":"≦","LessGreater":"≶","lessgtr":"≶","LessLess":"⪡","lesssim":"≲","LessSlantEqual":"⩽","LessTilde":"≲","lfisht":"⥼","lfloor":"⌊","Lfr":"𝔏","lfr":"𝔩","lg":"≶","lgE":"⪑","lHar":"⥢","lhard":"↽","lharu":"↼","lharul":"⥪","lhblk":"▄","LJcy":"Љ","ljcy":"љ","llarr":"⇇","ll":"≪","Ll":"⋘","llcorner":"⌞","Lleftarrow":"⇚","llhard":"⥫","lltri":"◺","Lmidot":"Ŀ","lmidot":"ŀ","lmoustache":"⎰","lmoust":"⎰","lnap":"⪉","lnapprox":"⪉","lne":"⪇","lnE":"≨","lneq":"⪇","lneqq":"≨","lnsim":"⋦","loang":"⟬","loarr":"⇽","lobrk":"⟦","longleftarrow":"⟵","LongLeftArrow":"⟵","Longleftarrow":"⟸","longleftrightarrow":"⟷","LongLeftRightArrow":"⟷","Longleftrightarrow":"⟺","longmapsto":"⟼","longrightarrow":"⟶","LongRightArrow":"⟶","Longrightarrow":"⟹","looparrowleft":"↫","looparrowright":"↬","lopar":"⦅","Lopf":"𝕃","lopf":"𝕝","loplus":"⨭","lotimes":"⨴","lowast":"∗","lowbar":"_","LowerLeftArrow":"↙","LowerRightArrow":"↘","loz":"◊","lozenge":"◊","lozf":"⧫","lpar":"(","lparlt":"⦓","lrarr":"⇆","lrcorner":"⌟","lrhar":"⇋","lrhard":"⥭","lrm":"‎","lrtri":"⊿","lsaquo":"‹","lscr":"𝓁","Lscr":"ℒ","lsh":"↰","Lsh":"↰","lsim":"≲","lsime":"⪍","lsimg":"⪏","lsqb":"[","lsquo":"‘","lsquor":"‚","Lstrok":"Ł","lstrok":"ł","ltcc":"⪦","ltcir":"⩹","lt":"<","LT":"<","Lt":"≪","ltdot":"⋖","lthree":"⋋","ltimes":"⋉","ltlarr":"⥶","ltquest":"⩻","ltri":"◃","ltrie":"⊴","ltrif":"◂","ltrPar":"⦖","lurdshar":"⥊","luruhar":"⥦","lvertneqq":"≨︀","lvnE":"≨︀","macr":"¯","male":"♂","malt":"✠","maltese":"✠","Map":"⤅","map":"↦","mapsto":"↦","mapstodown":"↧","mapstoleft":"↤","mapstoup":"↥","marker":"▮","mcomma":"⨩","Mcy":"М","mcy":"м","mdash":"—","mDDot":"∺","measuredangle":"∡","MediumSpace":" ","Mellintrf":"ℳ","Mfr":"𝔐","mfr":"𝔪","mho":"℧","micro":"µ","midast":"*","midcir":"⫰","mid":"∣","middot":"·","minusb":"⊟","minus":"−","minusd":"∸","minusdu":"⨪","MinusPlus":"∓","mlcp":"⫛","mldr":"…","mnplus":"∓","models":"⊧","Mopf":"𝕄","mopf":"𝕞","mp":"∓","mscr":"𝓂","Mscr":"ℳ","mstpos":"∾","Mu":"Μ","mu":"μ","multimap":"⊸","mumap":"⊸","nabla":"∇","Nacute":"Ń","nacute":"ń","nang":"∠⃒","nap":"≉","napE":"⩰̸","napid":"≋̸","napos":"ŉ","napprox":"≉","natural":"♮","naturals":"ℕ","natur":"♮","nbsp":" ","nbump":"≎̸","nbumpe":"≏̸","ncap":"⩃","Ncaron":"Ň","ncaron":"ň","Ncedil":"Ņ","ncedil":"ņ","ncong":"≇","ncongdot":"⩭̸","ncup":"⩂","Ncy":"Н","ncy":"н","ndash":"–","nearhk":"⤤","nearr":"↗","neArr":"⇗","nearrow":"↗","ne":"≠","nedot":"≐̸","NegativeMediumSpace":"​","NegativeThickSpace":"​","NegativeThinSpace":"​","NegativeVeryThinSpace":"​","nequiv":"≢","nesear":"⤨","nesim":"≂̸","NestedGreaterGreater":"≫","NestedLessLess":"≪","NewLine":"\n","nexist":"∄","nexists":"∄","Nfr":"𝔑","nfr":"𝔫","ngE":"≧̸","nge":"≱","ngeq":"≱","ngeqq":"≧̸","ngeqslant":"⩾̸","nges":"⩾̸","nGg":"⋙̸","ngsim":"≵","nGt":"≫⃒","ngt":"≯","ngtr":"≯","nGtv":"≫̸","nharr":"↮","nhArr":"⇎","nhpar":"⫲","ni":"∋","nis":"⋼","nisd":"⋺","niv":"∋","NJcy":"Њ","njcy":"њ","nlarr":"↚","nlArr":"⇍","nldr":"‥","nlE":"≦̸","nle":"≰","nleftarrow":"↚","nLeftarrow":"⇍","nleftrightarrow":"↮","nLeftrightarrow":"⇎","nleq":"≰","nleqq":"≦̸","nleqslant":"⩽̸","nles":"⩽̸","nless":"≮","nLl":"⋘̸","nlsim":"≴","nLt":"≪⃒","nlt":"≮","nltri":"⋪","nltrie":"⋬","nLtv":"≪̸","nmid":"∤","NoBreak":"⁠","NonBreakingSpace":" ","nopf":"𝕟","Nopf":"ℕ","Not":"⫬","not":"¬","NotCongruent":"≢","NotCupCap":"≭","NotDoubleVerticalBar":"∦","NotElement":"∉","NotEqual":"≠","NotEqualTilde":"≂̸","NotExists":"∄","NotGreater":"≯","NotGreaterEqual":"≱","NotGreaterFullEqual":"≧̸","NotGreaterGreater":"≫̸","NotGreaterLess":"≹","NotGreaterSlantEqual":"⩾̸","NotGreaterTilde":"≵","NotHumpDownHump":"≎̸","NotHumpEqual":"≏̸","notin":"∉","notindot":"⋵̸","notinE":"⋹̸","notinva":"∉","notinvb":"⋷","notinvc":"⋶","NotLeftTriangleBar":"⧏̸","NotLeftTriangle":"⋪","NotLeftTriangleEqual":"⋬","NotLess":"≮","NotLessEqual":"≰","NotLessGreater":"≸","NotLessLess":"≪̸","NotLessSlantEqual":"⩽̸","NotLessTilde":"≴","NotNestedGreaterGreater":"⪢̸","NotNestedLessLess":"⪡̸","notni":"∌","notniva":"∌","notnivb":"⋾","notnivc":"⋽","NotPrecedes":"⊀","NotPrecedesEqual":"⪯̸","NotPrecedesSlantEqual":"⋠","NotReverseElement":"∌","NotRightTriangleBar":"⧐̸","NotRightTriangle":"⋫","NotRightTriangleEqual":"⋭","NotSquareSubset":"⊏̸","NotSquareSubsetEqual":"⋢","NotSquareSuperset":"⊐̸","NotSquareSupersetEqual":"⋣","NotSubset":"⊂⃒","NotSubsetEqual":"⊈","NotSucceeds":"⊁","NotSucceedsEqual":"⪰̸","NotSucceedsSlantEqual":"⋡","NotSucceedsTilde":"≿̸","NotSuperset":"⊃⃒","NotSupersetEqual":"⊉","NotTilde":"≁","NotTildeEqual":"≄","NotTildeFullEqual":"≇","NotTildeTilde":"≉","NotVerticalBar":"∤","nparallel":"∦","npar":"∦","nparsl":"⫽⃥","npart":"∂̸","npolint":"⨔","npr":"⊀","nprcue":"⋠","nprec":"⊀","npreceq":"⪯̸","npre":"⪯̸","nrarrc":"⤳̸","nrarr":"↛","nrArr":"⇏","nrarrw":"↝̸","nrightarrow":"↛","nRightarrow":"⇏","nrtri":"⋫","nrtrie":"⋭","nsc":"⊁","nsccue":"⋡","nsce":"⪰̸","Nscr":"𝒩","nscr":"𝓃","nshortmid":"∤","nshortparallel":"∦","nsim":"≁","nsime":"≄","nsimeq":"≄","nsmid":"∤","nspar":"∦","nsqsube":"⋢","nsqsupe":"⋣","nsub":"⊄","nsubE":"⫅̸","nsube":"⊈","nsubset":"⊂⃒","nsubseteq":"⊈","nsubseteqq":"⫅̸","nsucc":"⊁","nsucceq":"⪰̸","nsup":"⊅","nsupE":"⫆̸","nsupe":"⊉","nsupset":"⊃⃒","nsupseteq":"⊉","nsupseteqq":"⫆̸","ntgl":"≹","Ntilde":"Ñ","ntilde":"ñ","ntlg":"≸","ntriangleleft":"⋪","ntrianglelefteq":"⋬","ntriangleright":"⋫","ntrianglerighteq":"⋭","Nu":"Ν","nu":"ν","num":"#","numero":"№","numsp":" ","nvap":"≍⃒","nvdash":"⊬","nvDash":"⊭","nVdash":"⊮","nVDash":"⊯","nvge":"≥⃒","nvgt":">⃒","nvHarr":"⤄","nvinfin":"⧞","nvlArr":"⤂","nvle":"≤⃒","nvlt":"<⃒","nvltrie":"⊴⃒","nvrArr":"⤃","nvrtrie":"⊵⃒","nvsim":"∼⃒","nwarhk":"⤣","nwarr":"↖","nwArr":"⇖","nwarrow":"↖","nwnear":"⤧","Oacute":"Ó","oacute":"ó","oast":"⊛","Ocirc":"Ô","ocirc":"ô","ocir":"⊚","Ocy":"О","ocy":"о","odash":"⊝","Odblac":"Ő","odblac":"ő","odiv":"⨸","odot":"⊙","odsold":"⦼","OElig":"Œ","oelig":"œ","ofcir":"⦿","Ofr":"𝔒","ofr":"𝔬","ogon":"˛","Ograve":"Ò","ograve":"ò","ogt":"⧁","ohbar":"⦵","ohm":"Ω","oint":"∮","olarr":"↺","olcir":"⦾","olcross":"⦻","oline":"‾","olt":"⧀","Omacr":"Ō","omacr":"ō","Omega":"Ω","omega":"ω","Omicron":"Ο","omicron":"ο","omid":"⦶","ominus":"⊖","Oopf":"𝕆","oopf":"𝕠","opar":"⦷","OpenCurlyDoubleQuote":"“","OpenCurlyQuote":"‘","operp":"⦹","oplus":"⊕","orarr":"↻","Or":"⩔","or":"∨","ord":"⩝","order":"ℴ","orderof":"ℴ","ordf":"ª","ordm":"º","origof":"⊶","oror":"⩖","orslope":"⩗","orv":"⩛","oS":"Ⓢ","Oscr":"𝒪","oscr":"ℴ","Oslash":"Ø","oslash":"ø","osol":"⊘","Otilde":"Õ","otilde":"õ","otimesas":"⨶","Otimes":"⨷","otimes":"⊗","Ouml":"Ö","ouml":"ö","ovbar":"⌽","OverBar":"‾","OverBrace":"⏞","OverBracket":"⎴","OverParenthesis":"⏜","para":"¶","parallel":"∥","par":"∥","parsim":"⫳","parsl":"⫽","part":"∂","PartialD":"∂","Pcy":"П","pcy":"п","percnt":"%","period":".","permil":"‰","perp":"⊥","pertenk":"‱","Pfr":"𝔓","pfr":"𝔭","Phi":"Φ","phi":"φ","phiv":"ϕ","phmmat":"ℳ","phone":"☎","Pi":"Π","pi":"π","pitchfork":"⋔","piv":"ϖ","planck":"ℏ","planckh":"ℎ","plankv":"ℏ","plusacir":"⨣","plusb":"⊞","pluscir":"⨢","plus":"+","plusdo":"∔","plusdu":"⨥","pluse":"⩲","PlusMinus":"±","plusmn":"±","plussim":"⨦","plustwo":"⨧","pm":"±","Poincareplane":"ℌ","pointint":"⨕","popf":"𝕡","Popf":"ℙ","pound":"£","prap":"⪷","Pr":"⪻","pr":"≺","prcue":"≼","precapprox":"⪷","prec":"≺","preccurlyeq":"≼","Precedes":"≺","PrecedesEqual":"⪯","PrecedesSlantEqual":"≼","PrecedesTilde":"≾","preceq":"⪯","precnapprox":"⪹","precneqq":"⪵","precnsim":"⋨","pre":"⪯","prE":"⪳","precsim":"≾","prime":"′","Prime":"″","primes":"ℙ","prnap":"⪹","prnE":"⪵","prnsim":"⋨","prod":"∏","Product":"∏","profalar":"⌮","profline":"⌒","profsurf":"⌓","prop":"∝","Proportional":"∝","Proportion":"∷","propto":"∝","prsim":"≾","prurel":"⊰","Pscr":"𝒫","pscr":"𝓅","Psi":"Ψ","psi":"ψ","puncsp":" ","Qfr":"𝔔","qfr":"𝔮","qint":"⨌","qopf":"𝕢","Qopf":"ℚ","qprime":"⁗","Qscr":"𝒬","qscr":"𝓆","quaternions":"ℍ","quatint":"⨖","quest":"?","questeq":"≟","quot":"\"","QUOT":"\"","rAarr":"⇛","race":"∽̱","Racute":"Ŕ","racute":"ŕ","radic":"√","raemptyv":"⦳","rang":"⟩","Rang":"⟫","rangd":"⦒","range":"⦥","rangle":"⟩","raquo":"»","rarrap":"⥵","rarrb":"⇥","rarrbfs":"⤠","rarrc":"⤳","rarr":"→","Rarr":"↠","rArr":"⇒","rarrfs":"⤞","rarrhk":"↪","rarrlp":"↬","rarrpl":"⥅","rarrsim":"⥴","Rarrtl":"⤖","rarrtl":"↣","rarrw":"↝","ratail":"⤚","rAtail":"⤜","ratio":"∶","rationals":"ℚ","rbarr":"⤍","rBarr":"⤏","RBarr":"⤐","rbbrk":"❳","rbrace":"}","rbrack":"]","rbrke":"⦌","rbrksld":"⦎","rbrkslu":"⦐","Rcaron":"Ř","rcaron":"ř","Rcedil":"Ŗ","rcedil":"ŗ","rceil":"⌉","rcub":"}","Rcy":"Р","rcy":"р","rdca":"⤷","rdldhar":"⥩","rdquo":"”","rdquor":"”","rdsh":"↳","real":"ℜ","realine":"ℛ","realpart":"ℜ","reals":"ℝ","Re":"ℜ","rect":"▭","reg":"®","REG":"®","ReverseElement":"∋","ReverseEquilibrium":"⇋","ReverseUpEquilibrium":"⥯","rfisht":"⥽","rfloor":"⌋","rfr":"𝔯","Rfr":"ℜ","rHar":"⥤","rhard":"⇁","rharu":"⇀","rharul":"⥬","Rho":"Ρ","rho":"ρ","rhov":"ϱ","RightAngleBracket":"⟩","RightArrowBar":"⇥","rightarrow":"→","RightArrow":"→","Rightarrow":"⇒","RightArrowLeftArrow":"⇄","rightarrowtail":"↣","RightCeiling":"⌉","RightDoubleBracket":"⟧","RightDownTeeVector":"⥝","RightDownVectorBar":"⥕","RightDownVector":"⇂","RightFloor":"⌋","rightharpoondown":"⇁","rightharpoonup":"⇀","rightleftarrows":"⇄","rightleftharpoons":"⇌","rightrightarrows":"⇉","rightsquigarrow":"↝","RightTeeArrow":"↦","RightTee":"⊢","RightTeeVector":"⥛","rightthreetimes":"⋌","RightTriangleBar":"⧐","RightTriangle":"⊳","RightTriangleEqual":"⊵","RightUpDownVector":"⥏","RightUpTeeVector":"⥜","RightUpVectorBar":"⥔","RightUpVector":"↾","RightVectorBar":"⥓","RightVector":"⇀","ring":"˚","risingdotseq":"≓","rlarr":"⇄","rlhar":"⇌","rlm":"‏","rmoustache":"⎱","rmoust":"⎱","rnmid":"⫮","roang":"⟭","roarr":"⇾","robrk":"⟧","ropar":"⦆","ropf":"𝕣","Ropf":"ℝ","roplus":"⨮","rotimes":"⨵","RoundImplies":"⥰","rpar":")","rpargt":"⦔","rppolint":"⨒","rrarr":"⇉","Rrightarrow":"⇛","rsaquo":"›","rscr":"𝓇","Rscr":"ℛ","rsh":"↱","Rsh":"↱","rsqb":"]","rsquo":"’","rsquor":"’","rthree":"⋌","rtimes":"⋊","rtri":"▹","rtrie":"⊵","rtrif":"▸","rtriltri":"⧎","RuleDelayed":"⧴","ruluhar":"⥨","rx":"℞","Sacute":"Ś","sacute":"ś","sbquo":"‚","scap":"⪸","Scaron":"Š","scaron":"š","Sc":"⪼","sc":"≻","sccue":"≽","sce":"⪰","scE":"⪴","Scedil":"Ş","scedil":"ş","Scirc":"Ŝ","scirc":"ŝ","scnap":"⪺","scnE":"⪶","scnsim":"⋩","scpolint":"⨓","scsim":"≿","Scy":"С","scy":"с","sdotb":"⊡","sdot":"⋅","sdote":"⩦","searhk":"⤥","searr":"↘","seArr":"⇘","searrow":"↘","sect":"§","semi":";","seswar":"⤩","setminus":"∖","setmn":"∖","sext":"✶","Sfr":"𝔖","sfr":"𝔰","sfrown":"⌢","sharp":"♯","SHCHcy":"Щ","shchcy":"щ","SHcy":"Ш","shcy":"ш","ShortDownArrow":"↓","ShortLeftArrow":"←","shortmid":"∣","shortparallel":"∥","ShortRightArrow":"→","ShortUpArrow":"↑","shy":"­","Sigma":"Σ","sigma":"σ","sigmaf":"ς","sigmav":"ς","sim":"∼","simdot":"⩪","sime":"≃","simeq":"≃","simg":"⪞","simgE":"⪠","siml":"⪝","simlE":"⪟","simne":"≆","simplus":"⨤","simrarr":"⥲","slarr":"←","SmallCircle":"∘","smallsetminus":"∖","smashp":"⨳","smeparsl":"⧤","smid":"∣","smile":"⌣","smt":"⪪","smte":"⪬","smtes":"⪬︀","SOFTcy":"Ь","softcy":"ь","solbar":"⌿","solb":"⧄","sol":"/","Sopf":"𝕊","sopf":"𝕤","spades":"♠","spadesuit":"♠","spar":"∥","sqcap":"⊓","sqcaps":"⊓︀","sqcup":"⊔","sqcups":"⊔︀","Sqrt":"√","sqsub":"⊏","sqsube":"⊑","sqsubset":"⊏","sqsubseteq":"⊑","sqsup":"⊐","sqsupe":"⊒","sqsupset":"⊐","sqsupseteq":"⊒","square":"□","Square":"□","SquareIntersection":"⊓","SquareSubset":"⊏","SquareSubsetEqual":"⊑","SquareSuperset":"⊐","SquareSupersetEqual":"⊒","SquareUnion":"⊔","squarf":"▪","squ":"□","squf":"▪","srarr":"→","Sscr":"𝒮","sscr":"𝓈","ssetmn":"∖","ssmile":"⌣","sstarf":"⋆","Star":"⋆","star":"☆","starf":"★","straightepsilon":"ϵ","straightphi":"ϕ","strns":"¯","sub":"⊂","Sub":"⋐","subdot":"⪽","subE":"⫅","sube":"⊆","subedot":"⫃","submult":"⫁","subnE":"⫋","subne":"⊊","subplus":"⪿","subrarr":"⥹","subset":"⊂","Subset":"⋐","subseteq":"⊆","subseteqq":"⫅","SubsetEqual":"⊆","subsetneq":"⊊","subsetneqq":"⫋","subsim":"⫇","subsub":"⫕","subsup":"⫓","succapprox":"⪸","succ":"≻","succcurlyeq":"≽","Succeeds":"≻","SucceedsEqual":"⪰","SucceedsSlantEqual":"≽","SucceedsTilde":"≿","succeq":"⪰","succnapprox":"⪺","succneqq":"⪶","succnsim":"⋩","succsim":"≿","SuchThat":"∋","sum":"∑","Sum":"∑","sung":"♪","sup1":"¹","sup2":"²","sup3":"³","sup":"⊃","Sup":"⋑","supdot":"⪾","supdsub":"⫘","supE":"⫆","supe":"⊇","supedot":"⫄","Superset":"⊃","SupersetEqual":"⊇","suphsol":"⟉","suphsub":"⫗","suplarr":"⥻","supmult":"⫂","supnE":"⫌","supne":"⊋","supplus":"⫀","supset":"⊃","Supset":"⋑","supseteq":"⊇","supseteqq":"⫆","supsetneq":"⊋","supsetneqq":"⫌","supsim":"⫈","supsub":"⫔","supsup":"⫖","swarhk":"⤦","swarr":"↙","swArr":"⇙","swarrow":"↙","swnwar":"⤪","szlig":"ß","Tab":"\t","target":"⌖","Tau":"Τ","tau":"τ","tbrk":"⎴","Tcaron":"Ť","tcaron":"ť","Tcedil":"Ţ","tcedil":"ţ","Tcy":"Т","tcy":"т","tdot":"⃛","telrec":"⌕","Tfr":"𝔗","tfr":"𝔱","there4":"∴","therefore":"∴","Therefore":"∴","Theta":"Θ","theta":"θ","thetasym":"ϑ","thetav":"ϑ","thickapprox":"≈","thicksim":"∼","ThickSpace":"  ","ThinSpace":" ","thinsp":" ","thkap":"≈","thksim":"∼","THORN":"Þ","thorn":"þ","tilde":"˜","Tilde":"∼","TildeEqual":"≃","TildeFullEqual":"≅","TildeTilde":"≈","timesbar":"⨱","timesb":"⊠","times":"×","timesd":"⨰","tint":"∭","toea":"⤨","topbot":"⌶","topcir":"⫱","top":"⊤","Topf":"𝕋","topf":"𝕥","topfork":"⫚","tosa":"⤩","tprime":"‴","trade":"™","TRADE":"™","triangle":"▵","triangledown":"▿","triangleleft":"◃","trianglelefteq":"⊴","triangleq":"≜","triangleright":"▹","trianglerighteq":"⊵","tridot":"◬","trie":"≜","triminus":"⨺","TripleDot":"⃛","triplus":"⨹","trisb":"⧍","tritime":"⨻","trpezium":"⏢","Tscr":"𝒯","tscr":"𝓉","TScy":"Ц","tscy":"ц","TSHcy":"Ћ","tshcy":"ћ","Tstrok":"Ŧ","tstrok":"ŧ","twixt":"≬","twoheadleftarrow":"↞","twoheadrightarrow":"↠","Uacute":"Ú","uacute":"ú","uarr":"↑","Uarr":"↟","uArr":"⇑","Uarrocir":"⥉","Ubrcy":"Ў","ubrcy":"ў","Ubreve":"Ŭ","ubreve":"ŭ","Ucirc":"Û","ucirc":"û","Ucy":"У","ucy":"у","udarr":"⇅","Udblac":"Ű","udblac":"ű","udhar":"⥮","ufisht":"⥾","Ufr":"𝔘","ufr":"𝔲","Ugrave":"Ù","ugrave":"ù","uHar":"⥣","uharl":"↿","uharr":"↾","uhblk":"▀","ulcorn":"⌜","ulcorner":"⌜","ulcrop":"⌏","ultri":"◸","Umacr":"Ū","umacr":"ū","uml":"¨","UnderBar":"_","UnderBrace":"⏟","UnderBracket":"⎵","UnderParenthesis":"⏝","Union":"⋃","UnionPlus":"⊎","Uogon":"Ų","uogon":"ų","Uopf":"𝕌","uopf":"𝕦","UpArrowBar":"⤒","uparrow":"↑","UpArrow":"↑","Uparrow":"⇑","UpArrowDownArrow":"⇅","updownarrow":"↕","UpDownArrow":"↕","Updownarrow":"⇕","UpEquilibrium":"⥮","upharpoonleft":"↿","upharpoonright":"↾","uplus":"⊎","UpperLeftArrow":"↖","UpperRightArrow":"↗","upsi":"υ","Upsi":"ϒ","upsih":"ϒ","Upsilon":"Υ","upsilon":"υ","UpTeeArrow":"↥","UpTee":"⊥","upuparrows":"⇈","urcorn":"⌝","urcorner":"⌝","urcrop":"⌎","Uring":"Ů","uring":"ů","urtri":"◹","Uscr":"𝒰","uscr":"𝓊","utdot":"⋰","Utilde":"Ũ","utilde":"ũ","utri":"▵","utrif":"▴","uuarr":"⇈","Uuml":"Ü","uuml":"ü","uwangle":"⦧","vangrt":"⦜","varepsilon":"ϵ","varkappa":"ϰ","varnothing":"∅","varphi":"ϕ","varpi":"ϖ","varpropto":"∝","varr":"↕","vArr":"⇕","varrho":"ϱ","varsigma":"ς","varsubsetneq":"⊊︀","varsubsetneqq":"⫋︀","varsupsetneq":"⊋︀","varsupsetneqq":"⫌︀","vartheta":"ϑ","vartriangleleft":"⊲","vartriangleright":"⊳","vBar":"⫨","Vbar":"⫫","vBarv":"⫩","Vcy":"В","vcy":"в","vdash":"⊢","vDash":"⊨","Vdash":"⊩","VDash":"⊫","Vdashl":"⫦","veebar":"⊻","vee":"∨","Vee":"⋁","veeeq":"≚","vellip":"⋮","verbar":"|","Verbar":"‖","vert":"|","Vert":"‖","VerticalBar":"∣","VerticalLine":"|","VerticalSeparator":"❘","VerticalTilde":"≀","VeryThinSpace":" ","Vfr":"𝔙","vfr":"𝔳","vltri":"⊲","vnsub":"⊂⃒","vnsup":"⊃⃒","Vopf":"𝕍","vopf":"𝕧","vprop":"∝","vrtri":"⊳","Vscr":"𝒱","vscr":"𝓋","vsubnE":"⫋︀","vsubne":"⊊︀","vsupnE":"⫌︀","vsupne":"⊋︀","Vvdash":"⊪","vzigzag":"⦚","Wcirc":"Ŵ","wcirc":"ŵ","wedbar":"⩟","wedge":"∧","Wedge":"⋀","wedgeq":"≙","weierp":"℘","Wfr":"𝔚","wfr":"𝔴","Wopf":"𝕎","wopf":"𝕨","wp":"℘","wr":"≀","wreath":"≀","Wscr":"𝒲","wscr":"𝓌","xcap":"⋂","xcirc":"◯","xcup":"⋃","xdtri":"▽","Xfr":"𝔛","xfr":"𝔵","xharr":"⟷","xhArr":"⟺","Xi":"Ξ","xi":"ξ","xlarr":"⟵","xlArr":"⟸","xmap":"⟼","xnis":"⋻","xodot":"⨀","Xopf":"𝕏","xopf":"𝕩","xoplus":"⨁","xotime":"⨂","xrarr":"⟶","xrArr":"⟹","Xscr":"𝒳","xscr":"𝓍","xsqcup":"⨆","xuplus":"⨄","xutri":"△","xvee":"⋁","xwedge":"⋀","Yacute":"Ý","yacute":"ý","YAcy":"Я","yacy":"я","Ycirc":"Ŷ","ycirc":"ŷ","Ycy":"Ы","ycy":"ы","yen":"¥","Yfr":"𝔜","yfr":"𝔶","YIcy":"Ї","yicy":"ї","Yopf":"𝕐","yopf":"𝕪","Yscr":"𝒴","yscr":"𝓎","YUcy":"Ю","yucy":"ю","yuml":"ÿ","Yuml":"Ÿ","Zacute":"Ź","zacute":"ź","Zcaron":"Ž","zcaron":"ž","Zcy":"З","zcy":"з","Zdot":"Ż","zdot":"ż","zeetrf":"ℨ","ZeroWidthSpace":"​","Zeta":"Ζ","zeta":"ζ","zfr":"𝔷","Zfr":"ℨ","ZHcy":"Ж","zhcy":"ж","zigrarr":"⇝","zopf":"𝕫","Zopf":"ℤ","Zscr":"𝒵","zscr":"𝓏","zwj":"‍","zwnj":"‌"}

/***/ }),
/* 510 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(508);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("30da0989", content, true);

/***/ }),
/* 511 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



////////////////////////////////////////////////////////////////////////////////
// Helpers

// Merge objects
//
function assign(obj /*from1, from2, from3, ...*/) {
  var sources = Array.prototype.slice.call(arguments, 1);

  sources.forEach(function (source) {
    if (!source) { return; }

    Object.keys(source).forEach(function (key) {
      obj[key] = source[key];
    });
  });

  return obj;
}

function _class(obj) { return Object.prototype.toString.call(obj); }
function isString(obj) { return _class(obj) === '[object String]'; }
function isObject(obj) { return _class(obj) === '[object Object]'; }
function isRegExp(obj) { return _class(obj) === '[object RegExp]'; }
function isFunction(obj) { return _class(obj) === '[object Function]'; }


function escapeRE(str) { return str.replace(/[.?*+^$[\]\\(){}|-]/g, '\\$&'); }

////////////////////////////////////////////////////////////////////////////////


var defaultOptions = {
  fuzzyLink: true,
  fuzzyEmail: true,
  fuzzyIP: false
};


function isOptionsObj(obj) {
  return Object.keys(obj || {}).reduce(function (acc, k) {
    return acc || defaultOptions.hasOwnProperty(k);
  }, false);
}


var defaultSchemas = {
  'http:': {
    validate: function (text, pos, self) {
      var tail = text.slice(pos);

      if (!self.re.http) {
        // compile lazily, because "host"-containing variables can change on tlds update.
        self.re.http =  new RegExp(
          '^\\/\\/' + self.re.src_auth + self.re.src_host_port_strict + self.re.src_path, 'i'
        );
      }
      if (self.re.http.test(tail)) {
        return tail.match(self.re.http)[0].length;
      }
      return 0;
    }
  },
  'https:':  'http:',
  'ftp:':    'http:',
  '//':      {
    validate: function (text, pos, self) {
      var tail = text.slice(pos);

      if (!self.re.no_http) {
      // compile lazily, because "host"-containing variables can change on tlds update.
        self.re.no_http =  new RegExp(
          '^' +
          self.re.src_auth +
          // Don't allow single-level domains, because of false positives like '//test'
          // with code comments
          '(?:localhost|(?:(?:' + self.re.src_domain + ')\\.)+' + self.re.src_domain_root + ')' +
          self.re.src_port +
          self.re.src_host_terminator +
          self.re.src_path,

          'i'
        );
      }

      if (self.re.no_http.test(tail)) {
        // should not be `://` & `///`, that protects from errors in protocol name
        if (pos >= 3 && text[pos - 3] === ':') { return 0; }
        if (pos >= 3 && text[pos - 3] === '/') { return 0; }
        return tail.match(self.re.no_http)[0].length;
      }
      return 0;
    }
  },
  'mailto:': {
    validate: function (text, pos, self) {
      var tail = text.slice(pos);

      if (!self.re.mailto) {
        self.re.mailto =  new RegExp(
          '^' + self.re.src_email_name + '@' + self.re.src_host_strict, 'i'
        );
      }
      if (self.re.mailto.test(tail)) {
        return tail.match(self.re.mailto)[0].length;
      }
      return 0;
    }
  }
};

/*eslint-disable max-len*/

// RE pattern for 2-character tlds (autogenerated by ./support/tlds_2char_gen.js)
var tlds_2ch_src_re = 'a[cdefgilmnoqrstuwxz]|b[abdefghijmnorstvwyz]|c[acdfghiklmnoruvwxyz]|d[ejkmoz]|e[cegrstu]|f[ijkmor]|g[abdefghilmnpqrstuwy]|h[kmnrtu]|i[delmnoqrst]|j[emop]|k[eghimnprwyz]|l[abcikrstuvy]|m[acdeghklmnopqrstuvwxyz]|n[acefgilopruz]|om|p[aefghklmnrstwy]|qa|r[eosuw]|s[abcdeghijklmnortuvxyz]|t[cdfghjklmnortvwz]|u[agksyz]|v[aceginu]|w[fs]|y[et]|z[amw]';

// DON'T try to make PRs with changes. Extend TLDs with LinkifyIt.tlds() instead
var tlds_default = 'biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф'.split('|');

/*eslint-enable max-len*/

////////////////////////////////////////////////////////////////////////////////

function resetScanCache(self) {
  self.__index__ = -1;
  self.__text_cache__   = '';
}

function createValidator(re) {
  return function (text, pos) {
    var tail = text.slice(pos);

    if (re.test(tail)) {
      return tail.match(re)[0].length;
    }
    return 0;
  };
}

function createNormalizer() {
  return function (match, self) {
    self.normalize(match);
  };
}

// Schemas compiler. Build regexps.
//
function compile(self) {

  // Load & clone RE patterns.
  var re = self.re = __webpack_require__(512)(self.__opts__);

  // Define dynamic patterns
  var tlds = self.__tlds__.slice();

  self.onCompile();

  if (!self.__tlds_replaced__) {
    tlds.push(tlds_2ch_src_re);
  }
  tlds.push(re.src_xn);

  re.src_tlds = tlds.join('|');

  function untpl(tpl) { return tpl.replace('%TLDS%', re.src_tlds); }

  re.email_fuzzy      = RegExp(untpl(re.tpl_email_fuzzy), 'i');
  re.link_fuzzy       = RegExp(untpl(re.tpl_link_fuzzy), 'i');
  re.link_no_ip_fuzzy = RegExp(untpl(re.tpl_link_no_ip_fuzzy), 'i');
  re.host_fuzzy_test  = RegExp(untpl(re.tpl_host_fuzzy_test), 'i');

  //
  // Compile each schema
  //

  var aliases = [];

  self.__compiled__ = {}; // Reset compiled data

  function schemaError(name, val) {
    throw new Error('(LinkifyIt) Invalid schema "' + name + '": ' + val);
  }

  Object.keys(self.__schemas__).forEach(function (name) {
    var val = self.__schemas__[name];

    // skip disabled methods
    if (val === null) { return; }

    var compiled = { validate: null, link: null };

    self.__compiled__[name] = compiled;

    if (isObject(val)) {
      if (isRegExp(val.validate)) {
        compiled.validate = createValidator(val.validate);
      } else if (isFunction(val.validate)) {
        compiled.validate = val.validate;
      } else {
        schemaError(name, val);
      }

      if (isFunction(val.normalize)) {
        compiled.normalize = val.normalize;
      } else if (!val.normalize) {
        compiled.normalize = createNormalizer();
      } else {
        schemaError(name, val);
      }

      return;
    }

    if (isString(val)) {
      aliases.push(name);
      return;
    }

    schemaError(name, val);
  });

  //
  // Compile postponed aliases
  //

  aliases.forEach(function (alias) {
    if (!self.__compiled__[self.__schemas__[alias]]) {
      // Silently fail on missed schemas to avoid errons on disable.
      // schemaError(alias, self.__schemas__[alias]);
      return;
    }

    self.__compiled__[alias].validate =
      self.__compiled__[self.__schemas__[alias]].validate;
    self.__compiled__[alias].normalize =
      self.__compiled__[self.__schemas__[alias]].normalize;
  });

  //
  // Fake record for guessed links
  //
  self.__compiled__[''] = { validate: null, normalize: createNormalizer() };

  //
  // Build schema condition
  //
  var slist = Object.keys(self.__compiled__)
                      .filter(function (name) {
                        // Filter disabled & fake schemas
                        return name.length > 0 && self.__compiled__[name];
                      })
                      .map(escapeRE)
                      .join('|');
  // (?!_) cause 1.5x slowdown
  self.re.schema_test   = RegExp('(^|(?!_)(?:[><\uff5c]|' + re.src_ZPCc + '))(' + slist + ')', 'i');
  self.re.schema_search = RegExp('(^|(?!_)(?:[><\uff5c]|' + re.src_ZPCc + '))(' + slist + ')', 'ig');

  self.re.pretest       = RegExp(
                            '(' + self.re.schema_test.source + ')|' +
                            '(' + self.re.host_fuzzy_test.source + ')|' +
                            '@',
                            'i');

  //
  // Cleanup
  //

  resetScanCache(self);
}

/**
 * class Match
 *
 * Match result. Single element of array, returned by [[LinkifyIt#match]]
 **/
function Match(self, shift) {
  var start = self.__index__,
      end   = self.__last_index__,
      text  = self.__text_cache__.slice(start, end);

  /**
   * Match#schema -> String
   *
   * Prefix (protocol) for matched string.
   **/
  this.schema    = self.__schema__.toLowerCase();
  /**
   * Match#index -> Number
   *
   * First position of matched string.
   **/
  this.index     = start + shift;
  /**
   * Match#lastIndex -> Number
   *
   * Next position after matched string.
   **/
  this.lastIndex = end + shift;
  /**
   * Match#raw -> String
   *
   * Matched string.
   **/
  this.raw       = text;
  /**
   * Match#text -> String
   *
   * Notmalized text of matched string.
   **/
  this.text      = text;
  /**
   * Match#url -> String
   *
   * Normalized url of matched string.
   **/
  this.url       = text;
}

function createMatch(self, shift) {
  var match = new Match(self, shift);

  self.__compiled__[match.schema].normalize(match, self);

  return match;
}


/**
 * class LinkifyIt
 **/

/**
 * new LinkifyIt(schemas, options)
 * - schemas (Object): Optional. Additional schemas to validate (prefix/validator)
 * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
 *
 * Creates new linkifier instance with optional additional schemas.
 * Can be called without `new` keyword for convenience.
 *
 * By default understands:
 *
 * - `http(s)://...` , `ftp://...`, `mailto:...` & `//...` links
 * - "fuzzy" links and emails (example.com, foo@bar.com).
 *
 * `schemas` is an object, where each key/value describes protocol/rule:
 *
 * - __key__ - link prefix (usually, protocol name with `:` at the end, `skype:`
 *   for example). `linkify-it` makes shure that prefix is not preceeded with
 *   alphanumeric char and symbols. Only whitespaces and punctuation allowed.
 * - __value__ - rule to check tail after link prefix
 *   - _String_ - just alias to existing rule
 *   - _Object_
 *     - _validate_ - validator function (should return matched length on success),
 *       or `RegExp`.
 *     - _normalize_ - optional function to normalize text & url of matched result
 *       (for example, for @twitter mentions).
 *
 * `options`:
 *
 * - __fuzzyLink__ - recognige URL-s without `http(s):` prefix. Default `true`.
 * - __fuzzyIP__ - allow IPs in fuzzy links above. Can conflict with some texts
 *   like version numbers. Default `false`.
 * - __fuzzyEmail__ - recognize emails without `mailto:` prefix.
 *
 **/
function LinkifyIt(schemas, options) {
  if (!(this instanceof LinkifyIt)) {
    return new LinkifyIt(schemas, options);
  }

  if (!options) {
    if (isOptionsObj(schemas)) {
      options = schemas;
      schemas = {};
    }
  }

  this.__opts__           = assign({}, defaultOptions, options);

  // Cache last tested result. Used to skip repeating steps on next `match` call.
  this.__index__          = -1;
  this.__last_index__     = -1; // Next scan position
  this.__schema__         = '';
  this.__text_cache__     = '';

  this.__schemas__        = assign({}, defaultSchemas, schemas);
  this.__compiled__       = {};

  this.__tlds__           = tlds_default;
  this.__tlds_replaced__  = false;

  this.re = {};

  compile(this);
}


/** chainable
 * LinkifyIt#add(schema, definition)
 * - schema (String): rule name (fixed pattern prefix)
 * - definition (String|RegExp|Object): schema definition
 *
 * Add new rule definition. See constructor description for details.
 **/
LinkifyIt.prototype.add = function add(schema, definition) {
  this.__schemas__[schema] = definition;
  compile(this);
  return this;
};


/** chainable
 * LinkifyIt#set(options)
 * - options (Object): { fuzzyLink|fuzzyEmail|fuzzyIP: true|false }
 *
 * Set recognition options for links without schema.
 **/
LinkifyIt.prototype.set = function set(options) {
  this.__opts__ = assign(this.__opts__, options);
  return this;
};


/**
 * LinkifyIt#test(text) -> Boolean
 *
 * Searches linkifiable pattern and returns `true` on success or `false` on fail.
 **/
LinkifyIt.prototype.test = function test(text) {
  // Reset scan cache
  this.__text_cache__ = text;
  this.__index__      = -1;

  if (!text.length) { return false; }

  var m, ml, me, len, shift, next, re, tld_pos, at_pos;

  // try to scan for link with schema - that's the most simple rule
  if (this.re.schema_test.test(text)) {
    re = this.re.schema_search;
    re.lastIndex = 0;
    while ((m = re.exec(text)) !== null) {
      len = this.testSchemaAt(text, m[2], re.lastIndex);
      if (len) {
        this.__schema__     = m[2];
        this.__index__      = m.index + m[1].length;
        this.__last_index__ = m.index + m[0].length + len;
        break;
      }
    }
  }

  if (this.__opts__.fuzzyLink && this.__compiled__['http:']) {
    // guess schemaless links
    tld_pos = text.search(this.re.host_fuzzy_test);
    if (tld_pos >= 0) {
      // if tld is located after found link - no need to check fuzzy pattern
      if (this.__index__ < 0 || tld_pos < this.__index__) {
        if ((ml = text.match(this.__opts__.fuzzyIP ? this.re.link_fuzzy : this.re.link_no_ip_fuzzy)) !== null) {

          shift = ml.index + ml[1].length;

          if (this.__index__ < 0 || shift < this.__index__) {
            this.__schema__     = '';
            this.__index__      = shift;
            this.__last_index__ = ml.index + ml[0].length;
          }
        }
      }
    }
  }

  if (this.__opts__.fuzzyEmail && this.__compiled__['mailto:']) {
    // guess schemaless emails
    at_pos = text.indexOf('@');
    if (at_pos >= 0) {
      // We can't skip this check, because this cases are possible:
      // 192.168.1.1@gmail.com, my.in@example.com
      if ((me = text.match(this.re.email_fuzzy)) !== null) {

        shift = me.index + me[1].length;
        next  = me.index + me[0].length;

        if (this.__index__ < 0 || shift < this.__index__ ||
            (shift === this.__index__ && next > this.__last_index__)) {
          this.__schema__     = 'mailto:';
          this.__index__      = shift;
          this.__last_index__ = next;
        }
      }
    }
  }

  return this.__index__ >= 0;
};


/**
 * LinkifyIt#pretest(text) -> Boolean
 *
 * Very quick check, that can give false positives. Returns true if link MAY BE
 * can exists. Can be used for speed optimization, when you need to check that
 * link NOT exists.
 **/
LinkifyIt.prototype.pretest = function pretest(text) {
  return this.re.pretest.test(text);
};


/**
 * LinkifyIt#testSchemaAt(text, name, position) -> Number
 * - text (String): text to scan
 * - name (String): rule (schema) name
 * - position (Number): text offset to check from
 *
 * Similar to [[LinkifyIt#test]] but checks only specific protocol tail exactly
 * at given position. Returns length of found pattern (0 on fail).
 **/
LinkifyIt.prototype.testSchemaAt = function testSchemaAt(text, schema, pos) {
  // If not supported schema check requested - terminate
  if (!this.__compiled__[schema.toLowerCase()]) {
    return 0;
  }
  return this.__compiled__[schema.toLowerCase()].validate(text, pos, this);
};


/**
 * LinkifyIt#match(text) -> Array|null
 *
 * Returns array of found link descriptions or `null` on fail. We strongly
 * recommend to use [[LinkifyIt#test]] first, for best speed.
 *
 * ##### Result match description
 *
 * - __schema__ - link schema, can be empty for fuzzy links, or `//` for
 *   protocol-neutral  links.
 * - __index__ - offset of matched text
 * - __lastIndex__ - index of next char after mathch end
 * - __raw__ - matched text
 * - __text__ - normalized text
 * - __url__ - link, generated from matched text
 **/
LinkifyIt.prototype.match = function match(text) {
  var shift = 0, result = [];

  // Try to take previous element from cache, if .test() called before
  if (this.__index__ >= 0 && this.__text_cache__ === text) {
    result.push(createMatch(this, shift));
    shift = this.__last_index__;
  }

  // Cut head if cache was used
  var tail = shift ? text.slice(shift) : text;

  // Scan string until end reached
  while (this.test(tail)) {
    result.push(createMatch(this, shift));

    tail = tail.slice(this.__last_index__);
    shift += this.__last_index__;
  }

  if (result.length) {
    return result;
  }

  return null;
};


/** chainable
 * LinkifyIt#tlds(list [, keepOld]) -> this
 * - list (Array): list of tlds
 * - keepOld (Boolean): merge with current list if `true` (`false` by default)
 *
 * Load (or merge) new tlds list. Those are user for fuzzy links (without prefix)
 * to avoid false positives. By default this algorythm used:
 *
 * - hostname with any 2-letter root zones are ok.
 * - biz|com|edu|gov|net|org|pro|web|xxx|aero|asia|coop|info|museum|name|shop|рф
 *   are ok.
 * - encoded (`xn--...`) root zones are ok.
 *
 * If list is replaced, then exact match for 2-chars root zones will be checked.
 **/
LinkifyIt.prototype.tlds = function tlds(list, keepOld) {
  list = Array.isArray(list) ? list : [ list ];

  if (!keepOld) {
    this.__tlds__ = list.slice();
    this.__tlds_replaced__ = true;
    compile(this);
    return this;
  }

  this.__tlds__ = this.__tlds__.concat(list)
                                  .sort()
                                  .filter(function (el, idx, arr) {
                                    return el !== arr[idx - 1];
                                  })
                                  .reverse();

  compile(this);
  return this;
};

/**
 * LinkifyIt#normalize(match)
 *
 * Default normalizer (if schema does not define it's own).
 **/
LinkifyIt.prototype.normalize = function normalize(match) {

  // Do minimal possible changes by default. Need to collect feedback prior
  // to move forward https://github.com/markdown-it/linkify-it/issues/1

  if (!match.schema) { match.url = 'http://' + match.url; }

  if (match.schema === 'mailto:' && !/^mailto:/i.test(match.url)) {
    match.url = 'mailto:' + match.url;
  }
};


/**
 * LinkifyIt#onCompile()
 *
 * Override to modify basic RegExp-s.
 **/
LinkifyIt.prototype.onCompile = function onCompile() {
};


module.exports = LinkifyIt;


/***/ }),
/* 512 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



module.exports = function (opts) {
  var re = {};

  // Use direct extract instead of `regenerate` to reduse browserified size
  re.src_Any = __webpack_require__(493).source;
  re.src_Cc  = __webpack_require__(491).source;
  re.src_Z   = __webpack_require__(492).source;
  re.src_P   = __webpack_require__(483).source;

  // \p{\Z\P\Cc\CF} (white spaces + control + format + punctuation)
  re.src_ZPCc = [ re.src_Z, re.src_P, re.src_Cc ].join('|');

  // \p{\Z\Cc} (white spaces + control)
  re.src_ZCc = [ re.src_Z, re.src_Cc ].join('|');

  // Experimental. List of chars, completely prohibited in links
  // because can separate it from other part of text
  var text_separators = '[><\uff5c]';

  // All possible word characters (everything without punctuation, spaces & controls)
  // Defined via punctuation & spaces to save space
  // Should be something like \p{\L\N\S\M} (\w but without `_`)
  re.src_pseudo_letter       = '(?:(?!' + text_separators + '|' + re.src_ZPCc + ')' + re.src_Any + ')';
  // The same as abothe but without [0-9]
  // var src_pseudo_letter_non_d = '(?:(?![0-9]|' + src_ZPCc + ')' + src_Any + ')';

  ////////////////////////////////////////////////////////////////////////////////

  re.src_ip4 =

    '(?:(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)';

  // Prohibit any of "@/[]()" in user/pass to avoid wrong domain fetch.
  re.src_auth    = '(?:(?:(?!' + re.src_ZCc + '|[@/\\[\\]()]).)+@)?';

  re.src_port =

    '(?::(?:6(?:[0-4]\\d{3}|5(?:[0-4]\\d{2}|5(?:[0-2]\\d|3[0-5])))|[1-5]?\\d{1,4}))?';

  re.src_host_terminator =

    '(?=$|' + text_separators + '|' + re.src_ZPCc + ')(?!-|_|:\\d|\\.-|\\.(?!$|' + re.src_ZPCc + '))';

  re.src_path =

    '(?:' +
      '[/?#]' +
        '(?:' +
          '(?!' + re.src_ZCc + '|' + text_separators + '|[()[\\]{}.,"\'?!\\-]).|' +
          '\\[(?:(?!' + re.src_ZCc + '|\\]).)*\\]|' +
          '\\((?:(?!' + re.src_ZCc + '|[)]).)*\\)|' +
          '\\{(?:(?!' + re.src_ZCc + '|[}]).)*\\}|' +
          '\\"(?:(?!' + re.src_ZCc + '|["]).)+\\"|' +
          "\\'(?:(?!" + re.src_ZCc + "|[']).)+\\'|" +
          "\\'(?=" + re.src_pseudo_letter + '|[-]).|' +  // allow `I'm_king` if no pair found
          '\\.{2,3}[a-zA-Z0-9%/]|' + // github has ... in commit range links. Restrict to
                                     // - english
                                     // - percent-encoded
                                     // - parts of file path
                                     // until more examples found.
          '\\.(?!' + re.src_ZCc + '|[.]).|' +
          (opts && opts['---'] ?
            '\\-(?!--(?:[^-]|$))(?:-*)|' // `---` => long dash, terminate
          :
            '\\-+|'
          ) +
          '\\,(?!' + re.src_ZCc + ').|' +      // allow `,,,` in paths
          '\\!(?!' + re.src_ZCc + '|[!]).|' +
          '\\?(?!' + re.src_ZCc + '|[?]).' +
        ')+' +
      '|\\/' +
    ')?';

  re.src_email_name =

    '[\\-;:&=\\+\\$,\\"\\.a-zA-Z0-9_]+';

  re.src_xn =

    'xn--[a-z0-9\\-]{1,59}';

  // More to read about domain names
  // http://serverfault.com/questions/638260/

  re.src_domain_root =

    // Allow letters & digits (http://test1)
    '(?:' +
      re.src_xn +
      '|' +
      re.src_pseudo_letter + '{1,63}' +
    ')';

  re.src_domain =

    '(?:' +
      re.src_xn +
      '|' +
      '(?:' + re.src_pseudo_letter + ')' +
      '|' +
      // don't allow `--` in domain names, because:
      // - that can conflict with markdown &mdash; / &ndash;
      // - nobody use those anyway
      '(?:' + re.src_pseudo_letter + '(?:-(?!-)|' + re.src_pseudo_letter + '){0,61}' + re.src_pseudo_letter + ')' +
    ')';

  re.src_host =

    '(?:' +
    // Don't need IP check, because digits are already allowed in normal domain names
    //   src_ip4 +
    // '|' +
      '(?:(?:(?:' + re.src_domain + ')\\.)*' + re.src_domain/*_root*/ + ')' +
    ')';

  re.tpl_host_fuzzy =

    '(?:' +
      re.src_ip4 +
    '|' +
      '(?:(?:(?:' + re.src_domain + ')\\.)+(?:%TLDS%))' +
    ')';

  re.tpl_host_no_ip_fuzzy =

    '(?:(?:(?:' + re.src_domain + ')\\.)+(?:%TLDS%))';

  re.src_host_strict =

    re.src_host + re.src_host_terminator;

  re.tpl_host_fuzzy_strict =

    re.tpl_host_fuzzy + re.src_host_terminator;

  re.src_host_port_strict =

    re.src_host + re.src_port + re.src_host_terminator;

  re.tpl_host_port_fuzzy_strict =

    re.tpl_host_fuzzy + re.src_port + re.src_host_terminator;

  re.tpl_host_port_no_ip_fuzzy_strict =

    re.tpl_host_no_ip_fuzzy + re.src_port + re.src_host_terminator;


  ////////////////////////////////////////////////////////////////////////////////
  // Main rules

  // Rude test fuzzy links by host, for quick deny
  re.tpl_host_fuzzy_test =

    'localhost|www\\.|\\.\\d{1,3}\\.|(?:\\.(?:%TLDS%)(?:' + re.src_ZPCc + '|>|$))';

  re.tpl_email_fuzzy =

      '(^|' + text_separators + '|\\(|' + re.src_ZCc + ')(' + re.src_email_name + '@' + re.tpl_host_fuzzy_strict + ')';

  re.tpl_link_fuzzy =
      // Fuzzy link can't be prepended with .:/\- and non punctuation.
      // but can start with > (markdown blockquote)
      '(^|(?![.:/\\-_@])(?:[$+<=>^`|\uff5c]|' + re.src_ZPCc + '))' +
      '((?![$+<=>^`|\uff5c])' + re.tpl_host_port_fuzzy_strict + re.src_path + ')';

  re.tpl_link_no_ip_fuzzy =
      // Fuzzy link can't be prepended with .:/\- and non punctuation.
      // but can start with > (markdown blockquote)
      '(^|(?![.:/\\-_@])(?:[$+<=>^`|\uff5c]|' + re.src_ZPCc + '))' +
      '((?![$+<=>^`|\uff5c])' + re.tpl_host_port_no_ip_fuzzy_strict + re.src_path + ')';

  return re;
};


/***/ }),
/* 513 */
/***/ (function(module, exports, __webpack_require__) {

var baseClamp = __webpack_require__(485),
    baseToString = __webpack_require__(69),
    toInteger = __webpack_require__(68),
    toString = __webpack_require__(70);

/**
 * Checks if `string` ends with the given target string.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {string} [target] The string to search for.
 * @param {number} [position=string.length] The position to search up to.
 * @returns {boolean} Returns `true` if `string` ends with `target`,
 *  else `false`.
 * @example
 *
 * _.endsWith('abc', 'c');
 * // => true
 *
 * _.endsWith('abc', 'b');
 * // => false
 *
 * _.endsWith('abc', 'b', 2);
 * // => true
 */
function endsWith(string, target, position) {
  string = toString(string);
  target = baseToString(target);

  var length = string.length;
  position = position === undefined
    ? length
    : baseClamp(toInteger(position), 0, length);

  var end = position;
  position -= target.length;
  return position >= 0 && string.slice(position, end) == target;
}

module.exports = endsWith;


/***/ }),
/* 514 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// List of valid html blocks names, accorting to commonmark spec
// http://jgm.github.io/CommonMark/spec.html#html-blocks




module.exports = [
  'address',
  'article',
  'aside',
  'base',
  'basefont',
  'blockquote',
  'body',
  'caption',
  'center',
  'col',
  'colgroup',
  'dd',
  'details',
  'dialog',
  'dir',
  'div',
  'dl',
  'dt',
  'fieldset',
  'figcaption',
  'figure',
  'footer',
  'form',
  'frame',
  'frameset',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'head',
  'header',
  'hr',
  'html',
  'iframe',
  'legend',
  'li',
  'link',
  'main',
  'menu',
  'menuitem',
  'meta',
  'nav',
  'noframes',
  'ol',
  'optgroup',
  'option',
  'p',
  'param',
  'section',
  'source',
  'summary',
  'table',
  'tbody',
  'td',
  'tfoot',
  'th',
  'thead',
  'title',
  'tr',
  'track',
  'ul'
];


/***/ }),
/* 515 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Just a shortcut for bulk export



exports.parseLinkLabel       = __webpack_require__(517);
exports.parseLinkDestination = __webpack_require__(516);
exports.parseLinkTitle       = __webpack_require__(518);


/***/ }),
/* 516 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Parse link destination
//



var isSpace     = __webpack_require__(479).isSpace;
var unescapeAll = __webpack_require__(479).unescapeAll;


module.exports = function parseLinkDestination(str, pos, max) {
  var code, level,
      lines = 0,
      start = pos,
      result = {
        ok: false,
        pos: 0,
        lines: 0,
        str: ''
      };

  if (str.charCodeAt(pos) === 0x3C /* < */) {
    pos++;
    while (pos < max) {
      code = str.charCodeAt(pos);
      if (code === 0x0A /* \n */ || isSpace(code)) { return result; }
      if (code === 0x3E /* > */) {
        result.pos = pos + 1;
        result.str = unescapeAll(str.slice(start + 1, pos));
        result.ok = true;
        return result;
      }
      if (code === 0x5C /* \ */ && pos + 1 < max) {
        pos += 2;
        continue;
      }

      pos++;
    }

    // no closing '>'
    return result;
  }

  // this should be ... } else { ... branch

  level = 0;
  while (pos < max) {
    code = str.charCodeAt(pos);

    if (code === 0x20) { break; }

    // ascii control characters
    if (code < 0x20 || code === 0x7F) { break; }

    if (code === 0x5C /* \ */ && pos + 1 < max) {
      pos += 2;
      continue;
    }

    if (code === 0x28 /* ( */) {
      level++;
    }

    if (code === 0x29 /* ) */) {
      if (level === 0) { break; }
      level--;
    }

    pos++;
  }

  if (start === pos) { return result; }
  if (level !== 0) { return result; }

  result.str = unescapeAll(str.slice(start, pos));
  result.lines = lines;
  result.pos = pos;
  result.ok = true;
  return result;
};


/***/ }),
/* 517 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Parse link label
//
// this function assumes that first character ("[") already matches;
// returns the end of the label
//


module.exports = function parseLinkLabel(state, start, disableNested) {
  var level, found, marker, prevPos,
      labelEnd = -1,
      max = state.posMax,
      oldPos = state.pos;

  state.pos = start + 1;
  level = 1;

  while (state.pos < max) {
    marker = state.src.charCodeAt(state.pos);
    if (marker === 0x5D /* ] */) {
      level--;
      if (level === 0) {
        found = true;
        break;
      }
    }

    prevPos = state.pos;
    state.md.inline.skipToken(state);
    if (marker === 0x5B /* [ */) {
      if (prevPos === state.pos - 1) {
        // increase level if we find text `[`, which is not a part of any token
        level++;
      } else if (disableNested) {
        state.pos = oldPos;
        return -1;
      }
    }
  }

  if (found) {
    labelEnd = state.pos;
  }

  // restore old state
  state.pos = oldPos;

  return labelEnd;
};


/***/ }),
/* 518 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Parse link title
//



var unescapeAll = __webpack_require__(479).unescapeAll;


module.exports = function parseLinkTitle(str, pos, max) {
  var code,
      marker,
      lines = 0,
      start = pos,
      result = {
        ok: false,
        pos: 0,
        lines: 0,
        str: ''
      };

  if (pos >= max) { return result; }

  marker = str.charCodeAt(pos);

  if (marker !== 0x22 /* " */ && marker !== 0x27 /* ' */ && marker !== 0x28 /* ( */) { return result; }

  pos++;

  // if opening marker is "(", switch it to closing marker ")"
  if (marker === 0x28) { marker = 0x29; }

  while (pos < max) {
    code = str.charCodeAt(pos);
    if (code === marker) {
      result.pos = pos + 1;
      result.lines = lines;
      result.str = unescapeAll(str.slice(start + 1, pos));
      result.ok = true;
      return result;
    } else if (code === 0x0A) {
      lines++;
    } else if (code === 0x5C /* \ */ && pos + 1 < max) {
      pos++;
      if (str.charCodeAt(pos) === 0x0A) {
        lines++;
      }
    }

    pos++;
  }

  return result;
};


/***/ }),
/* 519 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Main parser class




var utils        = __webpack_require__(479);
var helpers      = __webpack_require__(515);
var Renderer     = __webpack_require__(526);
var ParserCore   = __webpack_require__(521);
var ParserBlock  = __webpack_require__(520);
var ParserInline = __webpack_require__(522);
var LinkifyIt    = __webpack_require__(511);
var mdurl        = __webpack_require__(490);
var punycode     = __webpack_require__(500);


var config = {
  'default': __webpack_require__(524),
  zero: __webpack_require__(525),
  commonmark: __webpack_require__(523)
};

////////////////////////////////////////////////////////////////////////////////
//
// This validator can prohibit more than really needed to prevent XSS. It's a
// tradeoff to keep code simple and to be secure by default.
//
// If you need different setup - override validator method as you wish. Or
// replace it with dummy function and use external sanitizer.
//

var BAD_PROTO_RE = /^(vbscript|javascript|file|data):/;
var GOOD_DATA_RE = /^data:image\/(gif|png|jpeg|webp);/;

function validateLink(url) {
  // url should be normalized at this point, and existing entities are decoded
  var str = url.trim().toLowerCase();

  return BAD_PROTO_RE.test(str) ? (GOOD_DATA_RE.test(str) ? true : false) : true;
}

////////////////////////////////////////////////////////////////////////////////


var RECODE_HOSTNAME_FOR = [ 'http:', 'https:', 'mailto:' ];

function normalizeLink(url) {
  var parsed = mdurl.parse(url, true);

  if (parsed.hostname) {
    // Encode hostnames in urls like:
    // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
    //
    // We don't encode unknown schemas, because it's likely that we encode
    // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
    //
    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
      try {
        parsed.hostname = punycode.toASCII(parsed.hostname);
      } catch (er) { /**/ }
    }
  }

  return mdurl.encode(mdurl.format(parsed));
}

function normalizeLinkText(url) {
  var parsed = mdurl.parse(url, true);

  if (parsed.hostname) {
    // Encode hostnames in urls like:
    // `http://host/`, `https://host/`, `mailto:user@host`, `//host/`
    //
    // We don't encode unknown schemas, because it's likely that we encode
    // something we shouldn't (e.g. `skype:name` treated as `skype:host`)
    //
    if (!parsed.protocol || RECODE_HOSTNAME_FOR.indexOf(parsed.protocol) >= 0) {
      try {
        parsed.hostname = punycode.toUnicode(parsed.hostname);
      } catch (er) { /**/ }
    }
  }

  return mdurl.decode(mdurl.format(parsed));
}


/**
 * class MarkdownIt
 *
 * Main parser/renderer class.
 *
 * ##### Usage
 *
 * ```javascript
 * // node.js, "classic" way:
 * var MarkdownIt = require('markdown-it'),
 *     md = new MarkdownIt();
 * var result = md.render('# markdown-it rulezz!');
 *
 * // node.js, the same, but with sugar:
 * var md = require('markdown-it')();
 * var result = md.render('# markdown-it rulezz!');
 *
 * // browser without AMD, added to "window" on script load
 * // Note, there are no dash.
 * var md = window.markdownit();
 * var result = md.render('# markdown-it rulezz!');
 * ```
 *
 * Single line rendering, without paragraph wrap:
 *
 * ```javascript
 * var md = require('markdown-it')();
 * var result = md.renderInline('__markdown-it__ rulezz!');
 * ```
 **/

/**
 * new MarkdownIt([presetName, options])
 * - presetName (String): optional, `commonmark` / `zero`
 * - options (Object)
 *
 * Creates parser instanse with given config. Can be called without `new`.
 *
 * ##### presetName
 *
 * MarkdownIt provides named presets as a convenience to quickly
 * enable/disable active syntax rules and options for common use cases.
 *
 * - ["commonmark"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/commonmark.js) -
 *   configures parser to strict [CommonMark](http://commonmark.org/) mode.
 * - [default](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/default.js) -
 *   similar to GFM, used when no preset name given. Enables all available rules,
 *   but still without html, typographer & autolinker.
 * - ["zero"](https://github.com/markdown-it/markdown-it/blob/master/lib/presets/zero.js) -
 *   all rules disabled. Useful to quickly setup your config via `.enable()`.
 *   For example, when you need only `bold` and `italic` markup and nothing else.
 *
 * ##### options:
 *
 * - __html__ - `false`. Set `true` to enable HTML tags in source. Be careful!
 *   That's not safe! You may need external sanitizer to protect output from XSS.
 *   It's better to extend features via plugins, instead of enabling HTML.
 * - __xhtmlOut__ - `false`. Set `true` to add '/' when closing single tags
 *   (`<br />`). This is needed only for full CommonMark compatibility. In real
 *   world you will need HTML output.
 * - __breaks__ - `false`. Set `true` to convert `\n` in paragraphs into `<br>`.
 * - __langPrefix__ - `language-`. CSS language class prefix for fenced blocks.
 *   Can be useful for external highlighters.
 * - __linkify__ - `false`. Set `true` to autoconvert URL-like text to links.
 * - __typographer__  - `false`. Set `true` to enable [some language-neutral
 *   replacement](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/replacements.js) +
 *   quotes beautification (smartquotes).
 * - __quotes__ - `“”‘’`, String or Array. Double + single quotes replacement
 *   pairs, when typographer enabled and smartquotes on. For example, you can
 *   use `'«»„“'` for Russian, `'„“‚‘'` for German, and
 *   `['«\xA0', '\xA0»', '‹\xA0', '\xA0›']` for French (including nbsp).
 * - __highlight__ - `null`. Highlighter function for fenced code blocks.
 *   Highlighter `function (str, lang)` should return escaped HTML. It can also
 *   return empty string if the source was not changed and should be escaped
 *   externaly. If result starts with <pre... internal wrapper is skipped.
 *
 * ##### Example
 *
 * ```javascript
 * // commonmark mode
 * var md = require('markdown-it')('commonmark');
 *
 * // default mode
 * var md = require('markdown-it')();
 *
 * // enable everything
 * var md = require('markdown-it')({
 *   html: true,
 *   linkify: true,
 *   typographer: true
 * });
 * ```
 *
 * ##### Syntax highlighting
 *
 * ```js
 * var hljs = require('highlight.js') // https://highlightjs.org/
 *
 * var md = require('markdown-it')({
 *   highlight: function (str, lang) {
 *     if (lang && hljs.getLanguage(lang)) {
 *       try {
 *         return hljs.highlight(lang, str, true).value;
 *       } catch (__) {}
 *     }
 *
 *     return ''; // use external default escaping
 *   }
 * });
 * ```
 *
 * Or with full wrapper override (if you need assign class to `<pre>`):
 *
 * ```javascript
 * var hljs = require('highlight.js') // https://highlightjs.org/
 *
 * // Actual default values
 * var md = require('markdown-it')({
 *   highlight: function (str, lang) {
 *     if (lang && hljs.getLanguage(lang)) {
 *       try {
 *         return '<pre class="hljs"><code>' +
 *                hljs.highlight(lang, str, true).value +
 *                '</code></pre>';
 *       } catch (__) {}
 *     }
 *
 *     return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
 *   }
 * });
 * ```
 *
 **/
function MarkdownIt(presetName, options) {
  if (!(this instanceof MarkdownIt)) {
    return new MarkdownIt(presetName, options);
  }

  if (!options) {
    if (!utils.isString(presetName)) {
      options = presetName || {};
      presetName = 'default';
    }
  }

  /**
   * MarkdownIt#inline -> ParserInline
   *
   * Instance of [[ParserInline]]. You may need it to add new rules when
   * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
   * [[MarkdownIt.enable]].
   **/
  this.inline = new ParserInline();

  /**
   * MarkdownIt#block -> ParserBlock
   *
   * Instance of [[ParserBlock]]. You may need it to add new rules when
   * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
   * [[MarkdownIt.enable]].
   **/
  this.block = new ParserBlock();

  /**
   * MarkdownIt#core -> Core
   *
   * Instance of [[Core]] chain executor. You may need it to add new rules when
   * writing plugins. For simple rules control use [[MarkdownIt.disable]] and
   * [[MarkdownIt.enable]].
   **/
  this.core = new ParserCore();

  /**
   * MarkdownIt#renderer -> Renderer
   *
   * Instance of [[Renderer]]. Use it to modify output look. Or to add rendering
   * rules for new token types, generated by plugins.
   *
   * ##### Example
   *
   * ```javascript
   * var md = require('markdown-it')();
   *
   * function myToken(tokens, idx, options, env, self) {
   *   //...
   *   return result;
   * };
   *
   * md.renderer.rules['my_token'] = myToken
   * ```
   *
   * See [[Renderer]] docs and [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js).
   **/
  this.renderer = new Renderer();

  /**
   * MarkdownIt#linkify -> LinkifyIt
   *
   * [linkify-it](https://github.com/markdown-it/linkify-it) instance.
   * Used by [linkify](https://github.com/markdown-it/markdown-it/blob/master/lib/rules_core/linkify.js)
   * rule.
   **/
  this.linkify = new LinkifyIt();

  /**
   * MarkdownIt#validateLink(url) -> Boolean
   *
   * Link validation function. CommonMark allows too much in links. By default
   * we disable `javascript:`, `vbscript:`, `file:` schemas, and almost all `data:...` schemas
   * except some embedded image types.
   *
   * You can change this behaviour:
   *
   * ```javascript
   * var md = require('markdown-it')();
   * // enable everything
   * md.validateLink = function () { return true; }
   * ```
   **/
  this.validateLink = validateLink;

  /**
   * MarkdownIt#normalizeLink(url) -> String
   *
   * Function used to encode link url to a machine-readable format,
   * which includes url-encoding, punycode, etc.
   **/
  this.normalizeLink = normalizeLink;

  /**
   * MarkdownIt#normalizeLinkText(url) -> String
   *
   * Function used to decode link url to a human-readable format`
   **/
  this.normalizeLinkText = normalizeLinkText;


  // Expose utils & helpers for easy acces from plugins

  /**
   * MarkdownIt#utils -> utils
   *
   * Assorted utility functions, useful to write plugins. See details
   * [here](https://github.com/markdown-it/markdown-it/blob/master/lib/common/utils.js).
   **/
  this.utils = utils;

  /**
   * MarkdownIt#helpers -> helpers
   *
   * Link components parser functions, useful to write plugins. See details
   * [here](https://github.com/markdown-it/markdown-it/blob/master/lib/helpers).
   **/
  this.helpers = utils.assign({}, helpers);


  this.options = {};
  this.configure(presetName);

  if (options) { this.set(options); }
}


/** chainable
 * MarkdownIt.set(options)
 *
 * Set parser options (in the same format as in constructor). Probably, you
 * will never need it, but you can change options after constructor call.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')()
 *             .set({ html: true, breaks: true })
 *             .set({ typographer, true });
 * ```
 *
 * __Note:__ To achieve the best possible performance, don't modify a
 * `markdown-it` instance options on the fly. If you need multiple configurations
 * it's best to create multiple instances and initialize each with separate
 * config.
 **/
MarkdownIt.prototype.set = function (options) {
  utils.assign(this.options, options);
  return this;
};


/** chainable, internal
 * MarkdownIt.configure(presets)
 *
 * Batch load of all options and compenent settings. This is internal method,
 * and you probably will not need it. But if you with - see available presets
 * and data structure [here](https://github.com/markdown-it/markdown-it/tree/master/lib/presets)
 *
 * We strongly recommend to use presets instead of direct config loads. That
 * will give better compatibility with next versions.
 **/
MarkdownIt.prototype.configure = function (presets) {
  var self = this, presetName;

  if (utils.isString(presets)) {
    presetName = presets;
    presets = config[presetName];
    if (!presets) { throw new Error('Wrong `markdown-it` preset "' + presetName + '", check name'); }
  }

  if (!presets) { throw new Error('Wrong `markdown-it` preset, can\'t be empty'); }

  if (presets.options) { self.set(presets.options); }

  if (presets.components) {
    Object.keys(presets.components).forEach(function (name) {
      if (presets.components[name].rules) {
        self[name].ruler.enableOnly(presets.components[name].rules);
      }
      if (presets.components[name].rules2) {
        self[name].ruler2.enableOnly(presets.components[name].rules2);
      }
    });
  }
  return this;
};


/** chainable
 * MarkdownIt.enable(list, ignoreInvalid)
 * - list (String|Array): rule name or list of rule names to enable
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * Enable list or rules. It will automatically find appropriate components,
 * containing rules with given names. If rule not found, and `ignoreInvalid`
 * not set - throws exception.
 *
 * ##### Example
 *
 * ```javascript
 * var md = require('markdown-it')()
 *             .enable(['sub', 'sup'])
 *             .disable('smartquotes');
 * ```
 **/
MarkdownIt.prototype.enable = function (list, ignoreInvalid) {
  var result = [];

  if (!Array.isArray(list)) { list = [ list ]; }

  [ 'core', 'block', 'inline' ].forEach(function (chain) {
    result = result.concat(this[chain].ruler.enable(list, true));
  }, this);

  result = result.concat(this.inline.ruler2.enable(list, true));

  var missed = list.filter(function (name) { return result.indexOf(name) < 0; });

  if (missed.length && !ignoreInvalid) {
    throw new Error('MarkdownIt. Failed to enable unknown rule(s): ' + missed);
  }

  return this;
};


/** chainable
 * MarkdownIt.disable(list, ignoreInvalid)
 * - list (String|Array): rule name or list of rule names to disable.
 * - ignoreInvalid (Boolean): set `true` to ignore errors when rule not found.
 *
 * The same as [[MarkdownIt.enable]], but turn specified rules off.
 **/
MarkdownIt.prototype.disable = function (list, ignoreInvalid) {
  var result = [];

  if (!Array.isArray(list)) { list = [ list ]; }

  [ 'core', 'block', 'inline' ].forEach(function (chain) {
    result = result.concat(this[chain].ruler.disable(list, true));
  }, this);

  result = result.concat(this.inline.ruler2.disable(list, true));

  var missed = list.filter(function (name) { return result.indexOf(name) < 0; });

  if (missed.length && !ignoreInvalid) {
    throw new Error('MarkdownIt. Failed to disable unknown rule(s): ' + missed);
  }
  return this;
};


/** chainable
 * MarkdownIt.use(plugin, params)
 *
 * Load specified plugin with given params into current parser instance.
 * It's just a sugar to call `plugin(md, params)` with curring.
 *
 * ##### Example
 *
 * ```javascript
 * var iterator = require('markdown-it-for-inline');
 * var md = require('markdown-it')()
 *             .use(iterator, 'foo_replace', 'text', function (tokens, idx) {
 *               tokens[idx].content = tokens[idx].content.replace(/foo/g, 'bar');
 *             });
 * ```
 **/
MarkdownIt.prototype.use = function (plugin /*, params, ... */) {
  var args = [ this ].concat(Array.prototype.slice.call(arguments, 1));
  plugin.apply(plugin, args);
  return this;
};


/** internal
 * MarkdownIt.parse(src, env) -> Array
 * - src (String): source string
 * - env (Object): environment sandbox
 *
 * Parse input string and returns list of block tokens (special token type
 * "inline" will contain list of inline tokens). You should not call this
 * method directly, until you write custom renderer (for example, to produce
 * AST).
 *
 * `env` is used to pass data between "distributed" rules and return additional
 * metadata like reference info, needed for the renderer. It also can be used to
 * inject data in specific cases. Usually, you will be ok to pass `{}`,
 * and then pass updated object to renderer.
 **/
MarkdownIt.prototype.parse = function (src, env) {
  if (typeof src !== 'string') {
    throw new Error('Input data should be a String');
  }

  var state = new this.core.State(src, this, env);

  this.core.process(state);

  return state.tokens;
};


/**
 * MarkdownIt.render(src [, env]) -> String
 * - src (String): source string
 * - env (Object): environment sandbox
 *
 * Render markdown string into html. It does all magic for you :).
 *
 * `env` can be used to inject additional metadata (`{}` by default).
 * But you will not need it with high probability. See also comment
 * in [[MarkdownIt.parse]].
 **/
MarkdownIt.prototype.render = function (src, env) {
  env = env || {};

  return this.renderer.render(this.parse(src, env), this.options, env);
};


/** internal
 * MarkdownIt.parseInline(src, env) -> Array
 * - src (String): source string
 * - env (Object): environment sandbox
 *
 * The same as [[MarkdownIt.parse]] but skip all block rules. It returns the
 * block tokens list with the single `inline` element, containing parsed inline
 * tokens in `children` property. Also updates `env` object.
 **/
MarkdownIt.prototype.parseInline = function (src, env) {
  var state = new this.core.State(src, this, env);

  state.inlineMode = true;
  this.core.process(state);

  return state.tokens;
};


/**
 * MarkdownIt.renderInline(src [, env]) -> String
 * - src (String): source string
 * - env (Object): environment sandbox
 *
 * Similar to [[MarkdownIt.render]] but for single paragraph content. Result
 * will NOT be wrapped into `<p>` tags.
 **/
MarkdownIt.prototype.renderInline = function (src, env) {
  env = env || {};

  return this.renderer.render(this.parseInline(src, env), this.options, env);
};


module.exports = MarkdownIt;


/***/ }),
/* 520 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** internal
 * class ParserBlock
 *
 * Block-level tokenizer.
 **/



var Ruler           = __webpack_require__(481);


var _rules = [
  // First 2 params - rule name & source. Secondary array - list of rules,
  // which can be terminated by this one.
  [ 'table',      __webpack_require__(538),      [ 'paragraph', 'reference' ] ],
  [ 'code',       __webpack_require__(528) ],
  [ 'fence',      __webpack_require__(529),      [ 'paragraph', 'reference', 'blockquote', 'list' ] ],
  [ 'blockquote', __webpack_require__(527), [ 'paragraph', 'reference', 'blockquote', 'list' ] ],
  [ 'hr',         __webpack_require__(531),         [ 'paragraph', 'reference', 'blockquote', 'list' ] ],
  [ 'list',       __webpack_require__(534),       [ 'paragraph', 'reference', 'blockquote' ] ],
  [ 'reference',  __webpack_require__(536) ],
  [ 'heading',    __webpack_require__(530),    [ 'paragraph', 'reference', 'blockquote' ] ],
  [ 'lheading',   __webpack_require__(533) ],
  [ 'html_block', __webpack_require__(532), [ 'paragraph', 'reference', 'blockquote' ] ],
  [ 'paragraph',  __webpack_require__(535) ]
];


/**
 * new ParserBlock()
 **/
function ParserBlock() {
  /**
   * ParserBlock#ruler -> Ruler
   *
   * [[Ruler]] instance. Keep configuration of block rules.
   **/
  this.ruler = new Ruler();

  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1], { alt: (_rules[i][2] || []).slice() });
  }
}


// Generate tokens for input range
//
ParserBlock.prototype.tokenize = function (state, startLine, endLine) {
  var ok, i,
      rules = this.ruler.getRules(''),
      len = rules.length,
      line = startLine,
      hasEmptyLines = false,
      maxNesting = state.md.options.maxNesting;

  while (line < endLine) {
    state.line = line = state.skipEmptyLines(line);
    if (line >= endLine) { break; }

    // Termination condition for nested calls.
    // Nested calls currently used for blockquotes & lists
    if (state.sCount[line] < state.blkIndent) { break; }

    // If nesting level exceeded - skip tail to the end. That's not ordinary
    // situation and we should not care about content.
    if (state.level >= maxNesting) {
      state.line = endLine;
      break;
    }

    // Try all possible rules.
    // On success, rule should:
    //
    // - update `state.line`
    // - update `state.tokens`
    // - return true

    for (i = 0; i < len; i++) {
      ok = rules[i](state, line, endLine, false);
      if (ok) { break; }
    }

    // set state.tight if we had an empty line before current tag
    // i.e. latest empty line should not count
    state.tight = !hasEmptyLines;

    // paragraph might "eat" one newline after it in nested lists
    if (state.isEmpty(state.line - 1)) {
      hasEmptyLines = true;
    }

    line = state.line;

    if (line < endLine && state.isEmpty(line)) {
      hasEmptyLines = true;
      line++;
      state.line = line;
    }
  }
};


/**
 * ParserBlock.parse(str, md, env, outTokens)
 *
 * Process input string and push block tokens into `outTokens`
 **/
ParserBlock.prototype.parse = function (src, md, env, outTokens) {
  var state;

  if (!src) { return; }

  state = new this.State(src, md, env, outTokens);

  this.tokenize(state, state.line, state.lineMax);
};


ParserBlock.prototype.State = __webpack_require__(537);


module.exports = ParserBlock;


/***/ }),
/* 521 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** internal
 * class Core
 *
 * Top-level rules executor. Glues block/inline parsers and does intermediate
 * transformations.
 **/



var Ruler  = __webpack_require__(481);


var _rules = [
  [ 'normalize',      __webpack_require__(542)      ],
  [ 'block',          __webpack_require__(539)          ],
  [ 'inline',         __webpack_require__(540)         ],
  [ 'linkify',        __webpack_require__(541)        ],
  [ 'replacements',   __webpack_require__(543)   ],
  [ 'smartquotes',    __webpack_require__(544)    ]
];


/**
 * new Core()
 **/
function Core() {
  /**
   * Core#ruler -> Ruler
   *
   * [[Ruler]] instance. Keep configuration of core rules.
   **/
  this.ruler = new Ruler();

  for (var i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }
}


/**
 * Core.process(state)
 *
 * Executes core chain rules.
 **/
Core.prototype.process = function (state) {
  var i, l, rules;

  rules = this.ruler.getRules('');

  for (i = 0, l = rules.length; i < l; i++) {
    rules[i](state);
  }
};

Core.prototype.State = __webpack_require__(545);


module.exports = Core;


/***/ }),
/* 522 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/** internal
 * class ParserInline
 *
 * Tokenizes paragraph content.
 **/



var Ruler           = __webpack_require__(481);


////////////////////////////////////////////////////////////////////////////////
// Parser rules

var _rules = [
  [ 'text',            __webpack_require__(556) ],
  [ 'newline',         __webpack_require__(554) ],
  [ 'escape',          __webpack_require__(550) ],
  [ 'backticks',       __webpack_require__(547) ],
  [ 'strikethrough',   __webpack_require__(489).tokenize ],
  [ 'emphasis',        __webpack_require__(488).tokenize ],
  [ 'link',            __webpack_require__(553) ],
  [ 'image',           __webpack_require__(552) ],
  [ 'autolink',        __webpack_require__(546) ],
  [ 'html_inline',     __webpack_require__(551) ],
  [ 'entity',          __webpack_require__(549) ]
];

var _rules2 = [
  [ 'balance_pairs',   __webpack_require__(548) ],
  [ 'strikethrough',   __webpack_require__(489).postProcess ],
  [ 'emphasis',        __webpack_require__(488).postProcess ],
  [ 'text_collapse',   __webpack_require__(557) ]
];


/**
 * new ParserInline()
 **/
function ParserInline() {
  var i;

  /**
   * ParserInline#ruler -> Ruler
   *
   * [[Ruler]] instance. Keep configuration of inline rules.
   **/
  this.ruler = new Ruler();

  for (i = 0; i < _rules.length; i++) {
    this.ruler.push(_rules[i][0], _rules[i][1]);
  }

  /**
   * ParserInline#ruler2 -> Ruler
   *
   * [[Ruler]] instance. Second ruler used for post-processing
   * (e.g. in emphasis-like rules).
   **/
  this.ruler2 = new Ruler();

  for (i = 0; i < _rules2.length; i++) {
    this.ruler2.push(_rules2[i][0], _rules2[i][1]);
  }
}


// Skip single token by running all rules in validation mode;
// returns `true` if any rule reported success
//
ParserInline.prototype.skipToken = function (state) {
  var ok, i, pos = state.pos,
      rules = this.ruler.getRules(''),
      len = rules.length,
      maxNesting = state.md.options.maxNesting,
      cache = state.cache;


  if (typeof cache[pos] !== 'undefined') {
    state.pos = cache[pos];
    return;
  }

  if (state.level < maxNesting) {
    for (i = 0; i < len; i++) {
      // Increment state.level and decrement it later to limit recursion.
      // It's harmless to do here, because no tokens are created. But ideally,
      // we'd need a separate private state variable for this purpose.
      //
      state.level++;
      ok = rules[i](state, true);
      state.level--;

      if (ok) { break; }
    }
  } else {
    // Too much nesting, just skip until the end of the paragraph.
    //
    // NOTE: this will cause links to behave incorrectly in the following case,
    //       when an amount of `[` is exactly equal to `maxNesting + 1`:
    //
    //       [[[[[[[[[[[[[[[[[[[[[foo]()
    //
    // TODO: remove this workaround when CM standard will allow nested links
    //       (we can replace it by preventing links from being parsed in
    //       validation mode)
    //
    state.pos = state.posMax;
  }

  if (!ok) { state.pos++; }
  cache[pos] = state.pos;
};


// Generate tokens for input range
//
ParserInline.prototype.tokenize = function (state) {
  var ok, i,
      rules = this.ruler.getRules(''),
      len = rules.length,
      end = state.posMax,
      maxNesting = state.md.options.maxNesting;

  while (state.pos < end) {
    // Try all possible rules.
    // On success, rule should:
    //
    // - update `state.pos`
    // - update `state.tokens`
    // - return true

    if (state.level < maxNesting) {
      for (i = 0; i < len; i++) {
        ok = rules[i](state, false);
        if (ok) { break; }
      }
    }

    if (ok) {
      if (state.pos >= end) { break; }
      continue;
    }

    state.pending += state.src[state.pos++];
  }

  if (state.pending) {
    state.pushPending();
  }
};


/**
 * ParserInline.parse(str, md, env, outTokens)
 *
 * Process input string and push inline tokens into `outTokens`
 **/
ParserInline.prototype.parse = function (str, md, env, outTokens) {
  var i, rules, len;
  var state = new this.State(str, md, env, outTokens);

  this.tokenize(state);

  rules = this.ruler2.getRules('');
  len = rules.length;

  for (i = 0; i < len; i++) {
    rules[i](state);
  }
};


ParserInline.prototype.State = __webpack_require__(555);


module.exports = ParserInline;


/***/ }),
/* 523 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Commonmark default options




module.exports = {
  options: {
    html:         true,         // Enable HTML tags in source
    xhtmlOut:     true,         // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      false,        // autoconvert URL-like texts to links

    // Enable some language-neutral replacements + quotes beautification
    typographer:  false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '\u201c\u201d\u2018\u2019', /* “”‘’ */

    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,

    maxNesting:   20            // Internal protection, recursion limit
  },

  components: {

    core: {
      rules: [
        'normalize',
        'block',
        'inline'
      ]
    },

    block: {
      rules: [
        'blockquote',
        'code',
        'fence',
        'heading',
        'hr',
        'html_block',
        'lheading',
        'list',
        'reference',
        'paragraph'
      ]
    },

    inline: {
      rules: [
        'autolink',
        'backticks',
        'emphasis',
        'entity',
        'escape',
        'html_inline',
        'image',
        'link',
        'newline',
        'text'
      ],
      rules2: [
        'balance_pairs',
        'emphasis',
        'text_collapse'
      ]
    }
  }
};


/***/ }),
/* 524 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// markdown-it default options




module.exports = {
  options: {
    html:         false,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      false,        // autoconvert URL-like texts to links

    // Enable some language-neutral replacements + quotes beautification
    typographer:  false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '\u201c\u201d\u2018\u2019', /* “”‘’ */

    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,

    maxNesting:   100            // Internal protection, recursion limit
  },

  components: {

    core: {},
    block: {},
    inline: {}
  }
};


/***/ }),
/* 525 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// "Zero" preset, with nothing enabled. Useful for manual configuring of simple
// modes. For example, to parse bold/italic only.




module.exports = {
  options: {
    html:         false,        // Enable HTML tags in source
    xhtmlOut:     false,        // Use '/' to close single tags (<br />)
    breaks:       false,        // Convert '\n' in paragraphs into <br>
    langPrefix:   'language-',  // CSS language prefix for fenced blocks
    linkify:      false,        // autoconvert URL-like texts to links

    // Enable some language-neutral replacements + quotes beautification
    typographer:  false,

    // Double + single quotes replacement pairs, when typographer enabled,
    // and smartquotes on. Could be either a String or an Array.
    //
    // For example, you can use '«»„“' for Russian, '„“‚‘' for German,
    // and ['«\xA0', '\xA0»', '‹\xA0', '\xA0›'] for French (including nbsp).
    quotes: '\u201c\u201d\u2018\u2019', /* “”‘’ */

    // Highlighter function. Should return escaped HTML,
    // or '' if the source string is not changed and should be escaped externaly.
    // If result starts with <pre... internal wrapper is skipped.
    //
    // function (/*str, lang*/) { return ''; }
    //
    highlight: null,

    maxNesting:   20            // Internal protection, recursion limit
  },

  components: {

    core: {
      rules: [
        'normalize',
        'block',
        'inline'
      ]
    },

    block: {
      rules: [
        'paragraph'
      ]
    },

    inline: {
      rules: [
        'text'
      ],
      rules2: [
        'balance_pairs',
        'text_collapse'
      ]
    }
  }
};


/***/ }),
/* 526 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * class Renderer
 *
 * Generates HTML from parsed token stream. Each instance has independent
 * copy of rules. Those can be rewritten with ease. Also, you can add new
 * rules if you create plugin and adds new token types.
 **/



var assign          = __webpack_require__(479).assign;
var unescapeAll     = __webpack_require__(479).unescapeAll;
var escapeHtml      = __webpack_require__(479).escapeHtml;


////////////////////////////////////////////////////////////////////////////////

var default_rules = {};


default_rules.code_inline = function (tokens, idx, options, env, slf) {
  var token = tokens[idx];

  return  '<code' + slf.renderAttrs(token) + '>' +
          escapeHtml(tokens[idx].content) +
          '</code>';
};


default_rules.code_block = function (tokens, idx, options, env, slf) {
  var token = tokens[idx];

  return  '<pre' + slf.renderAttrs(token) + '><code>' +
          escapeHtml(tokens[idx].content) +
          '</code></pre>\n';
};


default_rules.fence = function (tokens, idx, options, env, slf) {
  var token = tokens[idx],
      info = token.info ? unescapeAll(token.info).trim() : '',
      langName = '',
      highlighted, i, tmpAttrs, tmpToken;

  if (info) {
    langName = info.split(/\s+/g)[0];
  }

  if (options.highlight) {
    highlighted = options.highlight(token.content, langName) || escapeHtml(token.content);
  } else {
    highlighted = escapeHtml(token.content);
  }

  if (highlighted.indexOf('<pre') === 0) {
    return highlighted + '\n';
  }

  // If language exists, inject class gently, without modifying original token.
  // May be, one day we will add .clone() for token and simplify this part, but
  // now we prefer to keep things local.
  if (info) {
    i        = token.attrIndex('class');
    tmpAttrs = token.attrs ? token.attrs.slice() : [];

    if (i < 0) {
      tmpAttrs.push([ 'class', options.langPrefix + langName ]);
    } else {
      tmpAttrs[i][1] += ' ' + options.langPrefix + langName;
    }

    // Fake token just to render attributes
    tmpToken = {
      attrs: tmpAttrs
    };

    return  '<pre><code' + slf.renderAttrs(tmpToken) + '>'
          + highlighted
          + '</code></pre>\n';
  }


  return  '<pre><code' + slf.renderAttrs(token) + '>'
        + highlighted
        + '</code></pre>\n';
};


default_rules.image = function (tokens, idx, options, env, slf) {
  var token = tokens[idx];

  // "alt" attr MUST be set, even if empty. Because it's mandatory and
  // should be placed on proper position for tests.
  //
  // Replace content with actual value

  token.attrs[token.attrIndex('alt')][1] =
    slf.renderInlineAsText(token.children, options, env);

  return slf.renderToken(tokens, idx, options);
};


default_rules.hardbreak = function (tokens, idx, options /*, env */) {
  return options.xhtmlOut ? '<br />\n' : '<br>\n';
};
default_rules.softbreak = function (tokens, idx, options /*, env */) {
  return options.breaks ? (options.xhtmlOut ? '<br />\n' : '<br>\n') : '\n';
};


default_rules.text = function (tokens, idx /*, options, env */) {
  return escapeHtml(tokens[idx].content);
};


default_rules.html_block = function (tokens, idx /*, options, env */) {
  return tokens[idx].content;
};
default_rules.html_inline = function (tokens, idx /*, options, env */) {
  return tokens[idx].content;
};


/**
 * new Renderer()
 *
 * Creates new [[Renderer]] instance and fill [[Renderer#rules]] with defaults.
 **/
function Renderer() {

  /**
   * Renderer#rules -> Object
   *
   * Contains render rules for tokens. Can be updated and extended.
   *
   * ##### Example
   *
   * ```javascript
   * var md = require('markdown-it')();
   *
   * md.renderer.rules.strong_open  = function () { return '<b>'; };
   * md.renderer.rules.strong_close = function () { return '</b>'; };
   *
   * var result = md.renderInline(...);
   * ```
   *
   * Each rule is called as independed static function with fixed signature:
   *
   * ```javascript
   * function my_token_render(tokens, idx, options, env, renderer) {
   *   // ...
   *   return renderedHTML;
   * }
   * ```
   *
   * See [source code](https://github.com/markdown-it/markdown-it/blob/master/lib/renderer.js)
   * for more details and examples.
   **/
  this.rules = assign({}, default_rules);
}


/**
 * Renderer.renderAttrs(token) -> String
 *
 * Render token attributes to string.
 **/
Renderer.prototype.renderAttrs = function renderAttrs(token) {
  var i, l, result;

  if (!token.attrs) { return ''; }

  result = '';

  for (i = 0, l = token.attrs.length; i < l; i++) {
    result += ' ' + escapeHtml(token.attrs[i][0]) + '="' + escapeHtml(token.attrs[i][1]) + '"';
  }

  return result;
};


/**
 * Renderer.renderToken(tokens, idx, options) -> String
 * - tokens (Array): list of tokens
 * - idx (Numbed): token index to render
 * - options (Object): params of parser instance
 *
 * Default token renderer. Can be overriden by custom function
 * in [[Renderer#rules]].
 **/
Renderer.prototype.renderToken = function renderToken(tokens, idx, options) {
  var nextToken,
      result = '',
      needLf = false,
      token = tokens[idx];

  // Tight list paragraphs
  if (token.hidden) {
    return '';
  }

  // Insert a newline between hidden paragraph and subsequent opening
  // block-level tag.
  //
  // For example, here we should insert a newline before blockquote:
  //  - a
  //    >
  //
  if (token.block && token.nesting !== -1 && idx && tokens[idx - 1].hidden) {
    result += '\n';
  }

  // Add token name, e.g. `<img`
  result += (token.nesting === -1 ? '</' : '<') + token.tag;

  // Encode attributes, e.g. `<img src="foo"`
  result += this.renderAttrs(token);

  // Add a slash for self-closing tags, e.g. `<img src="foo" /`
  if (token.nesting === 0 && options.xhtmlOut) {
    result += ' /';
  }

  // Check if we need to add a newline after this tag
  if (token.block) {
    needLf = true;

    if (token.nesting === 1) {
      if (idx + 1 < tokens.length) {
        nextToken = tokens[idx + 1];

        if (nextToken.type === 'inline' || nextToken.hidden) {
          // Block-level tag containing an inline tag.
          //
          needLf = false;

        } else if (nextToken.nesting === -1 && nextToken.tag === token.tag) {
          // Opening tag + closing tag of the same type. E.g. `<li></li>`.
          //
          needLf = false;
        }
      }
    }
  }

  result += needLf ? '>\n' : '>';

  return result;
};


/**
 * Renderer.renderInline(tokens, options, env) -> String
 * - tokens (Array): list on block tokens to renter
 * - options (Object): params of parser instance
 * - env (Object): additional data from parsed input (references, for example)
 *
 * The same as [[Renderer.render]], but for single token of `inline` type.
 **/
Renderer.prototype.renderInline = function (tokens, options, env) {
  var type,
      result = '',
      rules = this.rules;

  for (var i = 0, len = tokens.length; i < len; i++) {
    type = tokens[i].type;

    if (typeof rules[type] !== 'undefined') {
      result += rules[type](tokens, i, options, env, this);
    } else {
      result += this.renderToken(tokens, i, options);
    }
  }

  return result;
};


/** internal
 * Renderer.renderInlineAsText(tokens, options, env) -> String
 * - tokens (Array): list on block tokens to renter
 * - options (Object): params of parser instance
 * - env (Object): additional data from parsed input (references, for example)
 *
 * Special kludge for image `alt` attributes to conform CommonMark spec.
 * Don't try to use it! Spec requires to show `alt` content with stripped markup,
 * instead of simple escaping.
 **/
Renderer.prototype.renderInlineAsText = function (tokens, options, env) {
  var result = '';

  for (var i = 0, len = tokens.length; i < len; i++) {
    if (tokens[i].type === 'text') {
      result += tokens[i].content;
    } else if (tokens[i].type === 'image') {
      result += this.renderInlineAsText(tokens[i].children, options, env);
    }
  }

  return result;
};


/**
 * Renderer.render(tokens, options, env) -> String
 * - tokens (Array): list on block tokens to renter
 * - options (Object): params of parser instance
 * - env (Object): additional data from parsed input (references, for example)
 *
 * Takes token stream and generates HTML. Probably, you will never need to call
 * this method directly.
 **/
Renderer.prototype.render = function (tokens, options, env) {
  var i, len, type,
      result = '',
      rules = this.rules;

  for (i = 0, len = tokens.length; i < len; i++) {
    type = tokens[i].type;

    if (type === 'inline') {
      result += this.renderInline(tokens[i].children, options, env);
    } else if (typeof rules[type] !== 'undefined') {
      result += rules[tokens[i].type](tokens, i, options, env, this);
    } else {
      result += this.renderToken(tokens, i, options, env);
    }
  }

  return result;
};

module.exports = Renderer;


/***/ }),
/* 527 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Block quotes



var isSpace = __webpack_require__(479).isSpace;


module.exports = function blockquote(state, startLine, endLine, silent) {
  var adjustTab,
      ch,
      i,
      initial,
      l,
      lastLineEmpty,
      lines,
      nextLine,
      offset,
      oldBMarks,
      oldBSCount,
      oldIndent,
      oldParentType,
      oldSCount,
      oldTShift,
      spaceAfterMarker,
      terminate,
      terminatorRules,
      token,
      wasOutdented,
      oldLineMax = state.lineMax,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  // check the block quote marker
  if (state.src.charCodeAt(pos++) !== 0x3E/* > */) { return false; }

  // we know that it's going to be a valid blockquote,
  // so no point trying to find the end of it in silent mode
  if (silent) { return true; }

  // skip spaces after ">" and re-calculate offset
  initial = offset = state.sCount[startLine] + pos - (state.bMarks[startLine] + state.tShift[startLine]);

  // skip one optional space after '>'
  if (state.src.charCodeAt(pos) === 0x20 /* space */) {
    // ' >   test '
    //     ^ -- position start of line here:
    pos++;
    initial++;
    offset++;
    adjustTab = false;
    spaceAfterMarker = true;
  } else if (state.src.charCodeAt(pos) === 0x09 /* tab */) {
    spaceAfterMarker = true;

    if ((state.bsCount[startLine] + offset) % 4 === 3) {
      // '  >\t  test '
      //       ^ -- position start of line here (tab has width===1)
      pos++;
      initial++;
      offset++;
      adjustTab = false;
    } else {
      // ' >\t  test '
      //    ^ -- position start of line here + shift bsCount slightly
      //         to make extra space appear
      adjustTab = true;
    }
  } else {
    spaceAfterMarker = false;
  }

  oldBMarks = [ state.bMarks[startLine] ];
  state.bMarks[startLine] = pos;

  while (pos < max) {
    ch = state.src.charCodeAt(pos);

    if (isSpace(ch)) {
      if (ch === 0x09) {
        offset += 4 - (offset + state.bsCount[startLine] + (adjustTab ? 1 : 0)) % 4;
      } else {
        offset++;
      }
    } else {
      break;
    }

    pos++;
  }

  oldBSCount = [ state.bsCount[startLine] ];
  state.bsCount[startLine] = state.sCount[startLine] + 1 + (spaceAfterMarker ? 1 : 0);

  lastLineEmpty = pos >= max;

  oldSCount = [ state.sCount[startLine] ];
  state.sCount[startLine] = offset - initial;

  oldTShift = [ state.tShift[startLine] ];
  state.tShift[startLine] = pos - state.bMarks[startLine];

  terminatorRules = state.md.block.ruler.getRules('blockquote');

  oldParentType = state.parentType;
  state.parentType = 'blockquote';
  wasOutdented = false;

  // Search the end of the block
  //
  // Block ends with either:
  //  1. an empty line outside:
  //     ```
  //     > test
  //
  //     ```
  //  2. an empty line inside:
  //     ```
  //     >
  //     test
  //     ```
  //  3. another tag:
  //     ```
  //     > test
  //      - - -
  //     ```
  for (nextLine = startLine + 1; nextLine < endLine; nextLine++) {
    // check if it's outdented, i.e. it's inside list item and indented
    // less than said list item:
    //
    // ```
    // 1. anything
    //    > current blockquote
    // 2. checking this line
    // ```
    if (state.sCount[nextLine] < state.blkIndent) wasOutdented = true;

    pos = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos >= max) {
      // Case 1: line is not inside the blockquote, and this line is empty.
      break;
    }

    if (state.src.charCodeAt(pos++) === 0x3E/* > */ && !wasOutdented) {
      // This line is inside the blockquote.

      // skip spaces after ">" and re-calculate offset
      initial = offset = state.sCount[nextLine] + pos - (state.bMarks[nextLine] + state.tShift[nextLine]);

      // skip one optional space after '>'
      if (state.src.charCodeAt(pos) === 0x20 /* space */) {
        // ' >   test '
        //     ^ -- position start of line here:
        pos++;
        initial++;
        offset++;
        adjustTab = false;
        spaceAfterMarker = true;
      } else if (state.src.charCodeAt(pos) === 0x09 /* tab */) {
        spaceAfterMarker = true;

        if ((state.bsCount[nextLine] + offset) % 4 === 3) {
          // '  >\t  test '
          //       ^ -- position start of line here (tab has width===1)
          pos++;
          initial++;
          offset++;
          adjustTab = false;
        } else {
          // ' >\t  test '
          //    ^ -- position start of line here + shift bsCount slightly
          //         to make extra space appear
          adjustTab = true;
        }
      } else {
        spaceAfterMarker = false;
      }

      oldBMarks.push(state.bMarks[nextLine]);
      state.bMarks[nextLine] = pos;

      while (pos < max) {
        ch = state.src.charCodeAt(pos);

        if (isSpace(ch)) {
          if (ch === 0x09) {
            offset += 4 - (offset + state.bsCount[nextLine] + (adjustTab ? 1 : 0)) % 4;
          } else {
            offset++;
          }
        } else {
          break;
        }

        pos++;
      }

      lastLineEmpty = pos >= max;

      oldBSCount.push(state.bsCount[nextLine]);
      state.bsCount[nextLine] = state.sCount[nextLine] + 1 + (spaceAfterMarker ? 1 : 0);

      oldSCount.push(state.sCount[nextLine]);
      state.sCount[nextLine] = offset - initial;

      oldTShift.push(state.tShift[nextLine]);
      state.tShift[nextLine] = pos - state.bMarks[nextLine];
      continue;
    }

    // Case 2: line is not inside the blockquote, and the last line was empty.
    if (lastLineEmpty) { break; }

    // Case 3: another tag found.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }

    if (terminate) {
      // Quirk to enforce "hard termination mode" for paragraphs;
      // normally if you call `tokenize(state, startLine, nextLine)`,
      // paragraphs will look below nextLine for paragraph continuation,
      // but if blockquote is terminated by another tag, they shouldn't
      state.lineMax = nextLine;

      if (state.blkIndent !== 0) {
        // state.blkIndent was non-zero, we now set it to zero,
        // so we need to re-calculate all offsets to appear as
        // if indent wasn't changed
        oldBMarks.push(state.bMarks[nextLine]);
        oldBSCount.push(state.bsCount[nextLine]);
        oldTShift.push(state.tShift[nextLine]);
        oldSCount.push(state.sCount[nextLine]);
        state.sCount[nextLine] -= state.blkIndent;
      }

      break;
    }

    oldBMarks.push(state.bMarks[nextLine]);
    oldBSCount.push(state.bsCount[nextLine]);
    oldTShift.push(state.tShift[nextLine]);
    oldSCount.push(state.sCount[nextLine]);

    // A negative indentation means that this is a paragraph continuation
    //
    state.sCount[nextLine] = -1;
  }

  oldIndent = state.blkIndent;
  state.blkIndent = 0;

  token        = state.push('blockquote_open', 'blockquote', 1);
  token.markup = '>';
  token.map    = lines = [ startLine, 0 ];

  state.md.block.tokenize(state, startLine, nextLine);

  token        = state.push('blockquote_close', 'blockquote', -1);
  token.markup = '>';

  state.lineMax = oldLineMax;
  state.parentType = oldParentType;
  lines[1] = state.line;

  // Restore original tShift; this might not be necessary since the parser
  // has already been here, but just to make sure we can do that.
  for (i = 0; i < oldTShift.length; i++) {
    state.bMarks[i + startLine] = oldBMarks[i];
    state.tShift[i + startLine] = oldTShift[i];
    state.sCount[i + startLine] = oldSCount[i];
    state.bsCount[i + startLine] = oldBSCount[i];
  }
  state.blkIndent = oldIndent;

  return true;
};


/***/ }),
/* 528 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Code block (4 spaces padded)




module.exports = function code(state, startLine, endLine/*, silent*/) {
  var nextLine, last, token;

  if (state.sCount[startLine] - state.blkIndent < 4) { return false; }

  last = nextLine = startLine + 1;

  while (nextLine < endLine) {
    if (state.isEmpty(nextLine)) {
      nextLine++;
      continue;
    }

    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      nextLine++;
      last = nextLine;
      continue;
    }
    break;
  }

  state.line = last;

  token         = state.push('code_block', 'code', 0);
  token.content = state.getLines(startLine, last, 4 + state.blkIndent, true);
  token.map     = [ startLine, state.line ];

  return true;
};


/***/ }),
/* 529 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// fences (``` lang, ~~~ lang)




module.exports = function fence(state, startLine, endLine, silent) {
  var marker, len, params, nextLine, mem, token, markup,
      haveEndMarker = false,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  if (pos + 3 > max) { return false; }

  marker = state.src.charCodeAt(pos);

  if (marker !== 0x7E/* ~ */ && marker !== 0x60 /* ` */) {
    return false;
  }

  // scan marker length
  mem = pos;
  pos = state.skipChars(pos, marker);

  len = pos - mem;

  if (len < 3) { return false; }

  markup = state.src.slice(mem, pos);
  params = state.src.slice(pos, max);

  if (params.indexOf(String.fromCharCode(marker)) >= 0) { return false; }

  // Since start is found, we can report success here in validation mode
  if (silent) { return true; }

  // search end of block
  nextLine = startLine;

  for (;;) {
    nextLine++;
    if (nextLine >= endLine) {
      // unclosed block should be autoclosed by end of document.
      // also block seems to be autoclosed by end of parent
      break;
    }

    pos = mem = state.bMarks[nextLine] + state.tShift[nextLine];
    max = state.eMarks[nextLine];

    if (pos < max && state.sCount[nextLine] < state.blkIndent) {
      // non-empty line with negative indent should stop the list:
      // - ```
      //  test
      break;
    }

    if (state.src.charCodeAt(pos) !== marker) { continue; }

    if (state.sCount[nextLine] - state.blkIndent >= 4) {
      // closing fence should be indented less than 4 spaces
      continue;
    }

    pos = state.skipChars(pos, marker);

    // closing code fence must be at least as long as the opening one
    if (pos - mem < len) { continue; }

    // make sure tail has spaces only
    pos = state.skipSpaces(pos);

    if (pos < max) { continue; }

    haveEndMarker = true;
    // found!
    break;
  }

  // If a fence has heading spaces, they should be removed from its inner block
  len = state.sCount[startLine];

  state.line = nextLine + (haveEndMarker ? 1 : 0);

  token         = state.push('fence', 'code', 0);
  token.info    = params;
  token.content = state.getLines(startLine + 1, nextLine, len, true);
  token.markup  = markup;
  token.map     = [ startLine, state.line ];

  return true;
};


/***/ }),
/* 530 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// heading (#, ##, ...)



var isSpace = __webpack_require__(479).isSpace;


module.exports = function heading(state, startLine, endLine, silent) {
  var ch, level, tmp, token,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  ch  = state.src.charCodeAt(pos);

  if (ch !== 0x23/* # */ || pos >= max) { return false; }

  // count heading level
  level = 1;
  ch = state.src.charCodeAt(++pos);
  while (ch === 0x23/* # */ && pos < max && level <= 6) {
    level++;
    ch = state.src.charCodeAt(++pos);
  }

  if (level > 6 || (pos < max && !isSpace(ch))) { return false; }

  if (silent) { return true; }

  // Let's cut tails like '    ###  ' from the end of string

  max = state.skipSpacesBack(max, pos);
  tmp = state.skipCharsBack(max, 0x23, pos); // #
  if (tmp > pos && isSpace(state.src.charCodeAt(tmp - 1))) {
    max = tmp;
  }

  state.line = startLine + 1;

  token        = state.push('heading_open', 'h' + String(level), 1);
  token.markup = '########'.slice(0, level);
  token.map    = [ startLine, state.line ];

  token          = state.push('inline', '', 0);
  token.content  = state.src.slice(pos, max).trim();
  token.map      = [ startLine, state.line ];
  token.children = [];

  token        = state.push('heading_close', 'h' + String(level), -1);
  token.markup = '########'.slice(0, level);

  return true;
};


/***/ }),
/* 531 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Horizontal rule



var isSpace = __webpack_require__(479).isSpace;


module.exports = function hr(state, startLine, endLine, silent) {
  var marker, cnt, ch, token,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  marker = state.src.charCodeAt(pos++);

  // Check hr marker
  if (marker !== 0x2A/* * */ &&
      marker !== 0x2D/* - */ &&
      marker !== 0x5F/* _ */) {
    return false;
  }

  // markers can be mixed with spaces, but there should be at least 3 of them

  cnt = 1;
  while (pos < max) {
    ch = state.src.charCodeAt(pos++);
    if (ch !== marker && !isSpace(ch)) { return false; }
    if (ch === marker) { cnt++; }
  }

  if (cnt < 3) { return false; }

  if (silent) { return true; }

  state.line = startLine + 1;

  token        = state.push('hr', 'hr', 0);
  token.map    = [ startLine, state.line ];
  token.markup = Array(cnt + 1).join(String.fromCharCode(marker));

  return true;
};


/***/ }),
/* 532 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// HTML block




var block_names = __webpack_require__(514);
var HTML_OPEN_CLOSE_TAG_RE = __webpack_require__(487).HTML_OPEN_CLOSE_TAG_RE;

// An array of opening and corresponding closing sequences for html tags,
// last argument defines whether it can terminate a paragraph or not
//
var HTML_SEQUENCES = [
  [ /^<(script|pre|style)(?=(\s|>|$))/i, /<\/(script|pre|style)>/i, true ],
  [ /^<!--/,        /-->/,   true ],
  [ /^<\?/,         /\?>/,   true ],
  [ /^<![A-Z]/,     />/,     true ],
  [ /^<!\[CDATA\[/, /\]\]>/, true ],
  [ new RegExp('^</?(' + block_names.join('|') + ')(?=(\\s|/?>|$))', 'i'), /^$/, true ],
  [ new RegExp(HTML_OPEN_CLOSE_TAG_RE.source + '\\s*$'),  /^$/, false ]
];


module.exports = function html_block(state, startLine, endLine, silent) {
  var i, nextLine, token, lineText,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine];

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  if (!state.md.options.html) { return false; }

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  lineText = state.src.slice(pos, max);

  for (i = 0; i < HTML_SEQUENCES.length; i++) {
    if (HTML_SEQUENCES[i][0].test(lineText)) { break; }
  }

  if (i === HTML_SEQUENCES.length) { return false; }

  if (silent) {
    // true if this sequence can be a terminator, false otherwise
    return HTML_SEQUENCES[i][2];
  }

  nextLine = startLine + 1;

  // If we are here - we detected HTML block.
  // Let's roll down till block end.
  if (!HTML_SEQUENCES[i][1].test(lineText)) {
    for (; nextLine < endLine; nextLine++) {
      if (state.sCount[nextLine] < state.blkIndent) { break; }

      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];
      lineText = state.src.slice(pos, max);

      if (HTML_SEQUENCES[i][1].test(lineText)) {
        if (lineText.length !== 0) { nextLine++; }
        break;
      }
    }
  }

  state.line = nextLine;

  token         = state.push('html_block', '', 0);
  token.map     = [ startLine, nextLine ];
  token.content = state.getLines(startLine, nextLine, state.blkIndent, true);

  return true;
};


/***/ }),
/* 533 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// lheading (---, ===)




module.exports = function lheading(state, startLine, endLine/*, silent*/) {
  var content, terminate, i, l, token, pos, max, level, marker,
      nextLine = startLine + 1, oldParentType,
      terminatorRules = state.md.block.ruler.getRules('paragraph');

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  oldParentType = state.parentType;
  state.parentType = 'paragraph'; // use paragraph to match terminatorRules

  // jump line-by-line until empty one or EOF
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }

    //
    // Check for underline in setext header
    //
    if (state.sCount[nextLine] >= state.blkIndent) {
      pos = state.bMarks[nextLine] + state.tShift[nextLine];
      max = state.eMarks[nextLine];

      if (pos < max) {
        marker = state.src.charCodeAt(pos);

        if (marker === 0x2D/* - */ || marker === 0x3D/* = */) {
          pos = state.skipChars(pos, marker);
          pos = state.skipSpaces(pos);

          if (pos >= max) {
            level = (marker === 0x3D/* = */ ? 1 : 2);
            break;
          }
        }
      }
    }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue; }

    // Some tags can terminate paragraph without empty line.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }
  }

  if (!level) {
    // Didn't find valid underline
    return false;
  }

  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

  state.line = nextLine + 1;

  token          = state.push('heading_open', 'h' + String(level), 1);
  token.markup   = String.fromCharCode(marker);
  token.map      = [ startLine, state.line ];

  token          = state.push('inline', '', 0);
  token.content  = content;
  token.map      = [ startLine, state.line - 1 ];
  token.children = [];

  token          = state.push('heading_close', 'h' + String(level), -1);
  token.markup   = String.fromCharCode(marker);

  state.parentType = oldParentType;

  return true;
};


/***/ }),
/* 534 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Lists



var isSpace = __webpack_require__(479).isSpace;


// Search `[-+*][\n ]`, returns next pos after marker on success
// or -1 on fail.
function skipBulletListMarker(state, startLine) {
  var marker, pos, max, ch;

  pos = state.bMarks[startLine] + state.tShift[startLine];
  max = state.eMarks[startLine];

  marker = state.src.charCodeAt(pos++);
  // Check bullet
  if (marker !== 0x2A/* * */ &&
      marker !== 0x2D/* - */ &&
      marker !== 0x2B/* + */) {
    return -1;
  }

  if (pos < max) {
    ch = state.src.charCodeAt(pos);

    if (!isSpace(ch)) {
      // " -test " - is not a list item
      return -1;
    }
  }

  return pos;
}

// Search `\d+[.)][\n ]`, returns next pos after marker on success
// or -1 on fail.
function skipOrderedListMarker(state, startLine) {
  var ch,
      start = state.bMarks[startLine] + state.tShift[startLine],
      pos = start,
      max = state.eMarks[startLine];

  // List marker should have at least 2 chars (digit + dot)
  if (pos + 1 >= max) { return -1; }

  ch = state.src.charCodeAt(pos++);

  if (ch < 0x30/* 0 */ || ch > 0x39/* 9 */) { return -1; }

  for (;;) {
    // EOL -> fail
    if (pos >= max) { return -1; }

    ch = state.src.charCodeAt(pos++);

    if (ch >= 0x30/* 0 */ && ch <= 0x39/* 9 */) {

      // List marker should have no more than 9 digits
      // (prevents integer overflow in browsers)
      if (pos - start >= 10) { return -1; }

      continue;
    }

    // found valid marker
    if (ch === 0x29/* ) */ || ch === 0x2e/* . */) {
      break;
    }

    return -1;
  }


  if (pos < max) {
    ch = state.src.charCodeAt(pos);

    if (!isSpace(ch)) {
      // " 1.test " - is not a list item
      return -1;
    }
  }
  return pos;
}

function markTightParagraphs(state, idx) {
  var i, l,
      level = state.level + 2;

  for (i = idx + 2, l = state.tokens.length - 2; i < l; i++) {
    if (state.tokens[i].level === level && state.tokens[i].type === 'paragraph_open') {
      state.tokens[i + 2].hidden = true;
      state.tokens[i].hidden = true;
      i += 2;
    }
  }
}


module.exports = function list(state, startLine, endLine, silent) {
  var ch,
      contentStart,
      i,
      indent,
      indentAfterMarker,
      initial,
      isOrdered,
      itemLines,
      l,
      listLines,
      listTokIdx,
      markerCharCode,
      markerValue,
      max,
      nextLine,
      offset,
      oldIndent,
      oldLIndent,
      oldParentType,
      oldTShift,
      oldTight,
      pos,
      posAfterMarker,
      prevEmptyEnd,
      start,
      terminate,
      terminatorRules,
      token,
      isTerminatingParagraph = false,
      tight = true;

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  // limit conditions when list can interrupt
  // a paragraph (validation mode only)
  if (silent && state.parentType === 'paragraph') {
    // Next list item should still terminate previous list item;
    //
    // This code can fail if plugins use blkIndent as well as lists,
    // but I hope the spec gets fixed long before that happens.
    //
    if (state.tShift[startLine] >= state.blkIndent) {
      isTerminatingParagraph = true;
    }
  }

  // Detect list type and position after marker
  if ((posAfterMarker = skipOrderedListMarker(state, startLine)) >= 0) {
    isOrdered = true;
    start = state.bMarks[startLine] + state.tShift[startLine];
    markerValue = Number(state.src.substr(start, posAfterMarker - start - 1));

    // If we're starting a new ordered list right after
    // a paragraph, it should start with 1.
    if (isTerminatingParagraph && markerValue !== 1) return false;

  } else if ((posAfterMarker = skipBulletListMarker(state, startLine)) >= 0) {
    isOrdered = false;

  } else {
    return false;
  }

  // If we're starting a new unordered list right after
  // a paragraph, first line should not be empty.
  if (isTerminatingParagraph) {
    if (state.skipSpaces(posAfterMarker) >= state.eMarks[startLine]) return false;
  }

  // We should terminate list on style change. Remember first one to compare.
  markerCharCode = state.src.charCodeAt(posAfterMarker - 1);

  // For validation mode we can terminate immediately
  if (silent) { return true; }

  // Start list
  listTokIdx = state.tokens.length;

  if (isOrdered) {
    token       = state.push('ordered_list_open', 'ol', 1);
    if (markerValue !== 1) {
      token.attrs = [ [ 'start', markerValue ] ];
    }

  } else {
    token       = state.push('bullet_list_open', 'ul', 1);
  }

  token.map    = listLines = [ startLine, 0 ];
  token.markup = String.fromCharCode(markerCharCode);

  //
  // Iterate list items
  //

  nextLine = startLine;
  prevEmptyEnd = false;
  terminatorRules = state.md.block.ruler.getRules('list');

  oldParentType = state.parentType;
  state.parentType = 'list';

  while (nextLine < endLine) {
    pos = posAfterMarker;
    max = state.eMarks[nextLine];

    initial = offset = state.sCount[nextLine] + posAfterMarker - (state.bMarks[startLine] + state.tShift[startLine]);

    while (pos < max) {
      ch = state.src.charCodeAt(pos);

      if (ch === 0x09) {
        offset += 4 - (offset + state.bsCount[nextLine]) % 4;
      } else if (ch === 0x20) {
        offset++;
      } else {
        break;
      }

      pos++;
    }

    contentStart = pos;

    if (contentStart >= max) {
      // trimming space in "-    \n  3" case, indent is 1 here
      indentAfterMarker = 1;
    } else {
      indentAfterMarker = offset - initial;
    }

    // If we have more than 4 spaces, the indent is 1
    // (the rest is just indented code block)
    if (indentAfterMarker > 4) { indentAfterMarker = 1; }

    // "  -  test"
    //  ^^^^^ - calculating total length of this thing
    indent = initial + indentAfterMarker;

    // Run subparser & write tokens
    token        = state.push('list_item_open', 'li', 1);
    token.markup = String.fromCharCode(markerCharCode);
    token.map    = itemLines = [ startLine, 0 ];

    oldIndent = state.blkIndent;
    oldTight = state.tight;
    oldTShift = state.tShift[startLine];
    oldLIndent = state.sCount[startLine];
    state.blkIndent = indent;
    state.tight = true;
    state.tShift[startLine] = contentStart - state.bMarks[startLine];
    state.sCount[startLine] = offset;

    if (contentStart >= max && state.isEmpty(startLine + 1)) {
      // workaround for this case
      // (list item is empty, list terminates before "foo"):
      // ~~~~~~~~
      //   -
      //
      //     foo
      // ~~~~~~~~
      state.line = Math.min(state.line + 2, endLine);
    } else {
      state.md.block.tokenize(state, startLine, endLine, true);
    }

    // If any of list item is tight, mark list as tight
    if (!state.tight || prevEmptyEnd) {
      tight = false;
    }
    // Item become loose if finish with empty line,
    // but we should filter last element, because it means list finish
    prevEmptyEnd = (state.line - startLine) > 1 && state.isEmpty(state.line - 1);

    state.blkIndent = oldIndent;
    state.tShift[startLine] = oldTShift;
    state.sCount[startLine] = oldLIndent;
    state.tight = oldTight;

    token        = state.push('list_item_close', 'li', -1);
    token.markup = String.fromCharCode(markerCharCode);

    nextLine = startLine = state.line;
    itemLines[1] = nextLine;
    contentStart = state.bMarks[startLine];

    if (nextLine >= endLine) { break; }

    //
    // Try to check if list is terminated or continued.
    //
    if (state.sCount[nextLine] < state.blkIndent) { break; }

    // fail if terminating block found
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }

    // fail if list has another type
    if (isOrdered) {
      posAfterMarker = skipOrderedListMarker(state, nextLine);
      if (posAfterMarker < 0) { break; }
    } else {
      posAfterMarker = skipBulletListMarker(state, nextLine);
      if (posAfterMarker < 0) { break; }
    }

    if (markerCharCode !== state.src.charCodeAt(posAfterMarker - 1)) { break; }
  }

  // Finalize list
  if (isOrdered) {
    token = state.push('ordered_list_close', 'ol', -1);
  } else {
    token = state.push('bullet_list_close', 'ul', -1);
  }
  token.markup = String.fromCharCode(markerCharCode);

  listLines[1] = nextLine;
  state.line = nextLine;

  state.parentType = oldParentType;

  // mark paragraphs tight if needed
  if (tight) {
    markTightParagraphs(state, listTokIdx);
  }

  return true;
};


/***/ }),
/* 535 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Paragraph




module.exports = function paragraph(state, startLine/*, endLine*/) {
  var content, terminate, i, l, token, oldParentType,
      nextLine = startLine + 1,
      terminatorRules = state.md.block.ruler.getRules('paragraph'),
      endLine = state.lineMax;

  oldParentType = state.parentType;
  state.parentType = 'paragraph';

  // jump line-by-line until empty one or EOF
  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue; }

    // Some tags can terminate paragraph without empty line.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }
  }

  content = state.getLines(startLine, nextLine, state.blkIndent, false).trim();

  state.line = nextLine;

  token          = state.push('paragraph_open', 'p', 1);
  token.map      = [ startLine, state.line ];

  token          = state.push('inline', '', 0);
  token.content  = content;
  token.map      = [ startLine, state.line ];
  token.children = [];

  token          = state.push('paragraph_close', 'p', -1);

  state.parentType = oldParentType;

  return true;
};


/***/ }),
/* 536 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



var normalizeReference   = __webpack_require__(479).normalizeReference;
var isSpace              = __webpack_require__(479).isSpace;


module.exports = function reference(state, startLine, _endLine, silent) {
  var ch,
      destEndPos,
      destEndLineNo,
      endLine,
      href,
      i,
      l,
      label,
      labelEnd,
      oldParentType,
      res,
      start,
      str,
      terminate,
      terminatorRules,
      title,
      lines = 0,
      pos = state.bMarks[startLine] + state.tShift[startLine],
      max = state.eMarks[startLine],
      nextLine = startLine + 1;

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }

  if (state.src.charCodeAt(pos) !== 0x5B/* [ */) { return false; }

  // Simple check to quickly interrupt scan on [link](url) at the start of line.
  // Can be useful on practice: https://github.com/markdown-it/markdown-it/issues/54
  while (++pos < max) {
    if (state.src.charCodeAt(pos) === 0x5D /* ] */ &&
        state.src.charCodeAt(pos - 1) !== 0x5C/* \ */) {
      if (pos + 1 === max) { return false; }
      if (state.src.charCodeAt(pos + 1) !== 0x3A/* : */) { return false; }
      break;
    }
  }

  endLine = state.lineMax;

  // jump line-by-line until empty one or EOF
  terminatorRules = state.md.block.ruler.getRules('reference');

  oldParentType = state.parentType;
  state.parentType = 'reference';

  for (; nextLine < endLine && !state.isEmpty(nextLine); nextLine++) {
    // this would be a code block normally, but after paragraph
    // it's considered a lazy continuation regardless of what's there
    if (state.sCount[nextLine] - state.blkIndent > 3) { continue; }

    // quirk for blockquotes, this line should already be checked by that rule
    if (state.sCount[nextLine] < 0) { continue; }

    // Some tags can terminate paragraph without empty line.
    terminate = false;
    for (i = 0, l = terminatorRules.length; i < l; i++) {
      if (terminatorRules[i](state, nextLine, endLine, true)) {
        terminate = true;
        break;
      }
    }
    if (terminate) { break; }
  }

  str = state.getLines(startLine, nextLine, state.blkIndent, false).trim();
  max = str.length;

  for (pos = 1; pos < max; pos++) {
    ch = str.charCodeAt(pos);
    if (ch === 0x5B /* [ */) {
      return false;
    } else if (ch === 0x5D /* ] */) {
      labelEnd = pos;
      break;
    } else if (ch === 0x0A /* \n */) {
      lines++;
    } else if (ch === 0x5C /* \ */) {
      pos++;
      if (pos < max && str.charCodeAt(pos) === 0x0A) {
        lines++;
      }
    }
  }

  if (labelEnd < 0 || str.charCodeAt(labelEnd + 1) !== 0x3A/* : */) { return false; }

  // [label]:   destination   'title'
  //         ^^^ skip optional whitespace here
  for (pos = labelEnd + 2; pos < max; pos++) {
    ch = str.charCodeAt(pos);
    if (ch === 0x0A) {
      lines++;
    } else if (isSpace(ch)) {
      /*eslint no-empty:0*/
    } else {
      break;
    }
  }

  // [label]:   destination   'title'
  //            ^^^^^^^^^^^ parse this
  res = state.md.helpers.parseLinkDestination(str, pos, max);
  if (!res.ok) { return false; }

  href = state.md.normalizeLink(res.str);
  if (!state.md.validateLink(href)) { return false; }

  pos = res.pos;
  lines += res.lines;

  // save cursor state, we could require to rollback later
  destEndPos = pos;
  destEndLineNo = lines;

  // [label]:   destination   'title'
  //                       ^^^ skipping those spaces
  start = pos;
  for (; pos < max; pos++) {
    ch = str.charCodeAt(pos);
    if (ch === 0x0A) {
      lines++;
    } else if (isSpace(ch)) {
      /*eslint no-empty:0*/
    } else {
      break;
    }
  }

  // [label]:   destination   'title'
  //                          ^^^^^^^ parse this
  res = state.md.helpers.parseLinkTitle(str, pos, max);
  if (pos < max && start !== pos && res.ok) {
    title = res.str;
    pos = res.pos;
    lines += res.lines;
  } else {
    title = '';
    pos = destEndPos;
    lines = destEndLineNo;
  }

  // skip trailing spaces until the rest of the line
  while (pos < max) {
    ch = str.charCodeAt(pos);
    if (!isSpace(ch)) { break; }
    pos++;
  }

  if (pos < max && str.charCodeAt(pos) !== 0x0A) {
    if (title) {
      // garbage at the end of the line after title,
      // but it could still be a valid reference if we roll back
      title = '';
      pos = destEndPos;
      lines = destEndLineNo;
      while (pos < max) {
        ch = str.charCodeAt(pos);
        if (!isSpace(ch)) { break; }
        pos++;
      }
    }
  }

  if (pos < max && str.charCodeAt(pos) !== 0x0A) {
    // garbage at the end of the line
    return false;
  }

  label = normalizeReference(str.slice(1, labelEnd));
  if (!label) {
    // CommonMark 0.20 disallows empty labels
    return false;
  }

  // Reference can not terminate anything. This check is for safety only.
  /*istanbul ignore if*/
  if (silent) { return true; }

  if (typeof state.env.references === 'undefined') {
    state.env.references = {};
  }
  if (typeof state.env.references[label] === 'undefined') {
    state.env.references[label] = { title: title, href: href };
  }

  state.parentType = oldParentType;

  state.line = startLine + lines + 1;
  return true;
};


/***/ }),
/* 537 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Parser state class



var Token = __webpack_require__(482);
var isSpace = __webpack_require__(479).isSpace;


function StateBlock(src, md, env, tokens) {
  var ch, s, start, pos, len, indent, offset, indent_found;

  this.src = src;

  // link to parser instance
  this.md     = md;

  this.env = env;

  //
  // Internal state vartiables
  //

  this.tokens = tokens;

  this.bMarks = [];  // line begin offsets for fast jumps
  this.eMarks = [];  // line end offsets for fast jumps
  this.tShift = [];  // offsets of the first non-space characters (tabs not expanded)
  this.sCount = [];  // indents for each line (tabs expanded)

  // An amount of virtual spaces (tabs expanded) between beginning
  // of each line (bMarks) and real beginning of that line.
  //
  // It exists only as a hack because blockquotes override bMarks
  // losing information in the process.
  //
  // It's used only when expanding tabs, you can think about it as
  // an initial tab length, e.g. bsCount=21 applied to string `\t123`
  // means first tab should be expanded to 4-21%4 === 3 spaces.
  //
  this.bsCount = [];

  // block parser variables
  this.blkIndent  = 0; // required block content indent
                       // (for example, if we are in list)
  this.line       = 0; // line index in src
  this.lineMax    = 0; // lines count
  this.tight      = false;  // loose/tight mode for lists
  this.ddIndent   = -1; // indent of the current dd block (-1 if there isn't any)

  // can be 'blockquote', 'list', 'root', 'paragraph' or 'reference'
  // used in lists to determine if they interrupt a paragraph
  this.parentType = 'root';

  this.level = 0;

  // renderer
  this.result = '';

  // Create caches
  // Generate markers.
  s = this.src;
  indent_found = false;

  for (start = pos = indent = offset = 0, len = s.length; pos < len; pos++) {
    ch = s.charCodeAt(pos);

    if (!indent_found) {
      if (isSpace(ch)) {
        indent++;

        if (ch === 0x09) {
          offset += 4 - offset % 4;
        } else {
          offset++;
        }
        continue;
      } else {
        indent_found = true;
      }
    }

    if (ch === 0x0A || pos === len - 1) {
      if (ch !== 0x0A) { pos++; }
      this.bMarks.push(start);
      this.eMarks.push(pos);
      this.tShift.push(indent);
      this.sCount.push(offset);
      this.bsCount.push(0);

      indent_found = false;
      indent = 0;
      offset = 0;
      start = pos + 1;
    }
  }

  // Push fake entry to simplify cache bounds checks
  this.bMarks.push(s.length);
  this.eMarks.push(s.length);
  this.tShift.push(0);
  this.sCount.push(0);
  this.bsCount.push(0);

  this.lineMax = this.bMarks.length - 1; // don't count last fake line
}

// Push new token to "stream".
//
StateBlock.prototype.push = function (type, tag, nesting) {
  var token = new Token(type, tag, nesting);
  token.block = true;

  if (nesting < 0) { this.level--; }
  token.level = this.level;
  if (nesting > 0) { this.level++; }

  this.tokens.push(token);
  return token;
};

StateBlock.prototype.isEmpty = function isEmpty(line) {
  return this.bMarks[line] + this.tShift[line] >= this.eMarks[line];
};

StateBlock.prototype.skipEmptyLines = function skipEmptyLines(from) {
  for (var max = this.lineMax; from < max; from++) {
    if (this.bMarks[from] + this.tShift[from] < this.eMarks[from]) {
      break;
    }
  }
  return from;
};

// Skip spaces from given position.
StateBlock.prototype.skipSpaces = function skipSpaces(pos) {
  var ch;

  for (var max = this.src.length; pos < max; pos++) {
    ch = this.src.charCodeAt(pos);
    if (!isSpace(ch)) { break; }
  }
  return pos;
};

// Skip spaces from given position in reverse.
StateBlock.prototype.skipSpacesBack = function skipSpacesBack(pos, min) {
  if (pos <= min) { return pos; }

  while (pos > min) {
    if (!isSpace(this.src.charCodeAt(--pos))) { return pos + 1; }
  }
  return pos;
};

// Skip char codes from given position
StateBlock.prototype.skipChars = function skipChars(pos, code) {
  for (var max = this.src.length; pos < max; pos++) {
    if (this.src.charCodeAt(pos) !== code) { break; }
  }
  return pos;
};

// Skip char codes reverse from given position - 1
StateBlock.prototype.skipCharsBack = function skipCharsBack(pos, code, min) {
  if (pos <= min) { return pos; }

  while (pos > min) {
    if (code !== this.src.charCodeAt(--pos)) { return pos + 1; }
  }
  return pos;
};

// cut lines range from source.
StateBlock.prototype.getLines = function getLines(begin, end, indent, keepLastLF) {
  var i, lineIndent, ch, first, last, queue, lineStart,
      line = begin;

  if (begin >= end) {
    return '';
  }

  queue = new Array(end - begin);

  for (i = 0; line < end; line++, i++) {
    lineIndent = 0;
    lineStart = first = this.bMarks[line];

    if (line + 1 < end || keepLastLF) {
      // No need for bounds check because we have fake entry on tail.
      last = this.eMarks[line] + 1;
    } else {
      last = this.eMarks[line];
    }

    while (first < last && lineIndent < indent) {
      ch = this.src.charCodeAt(first);

      if (isSpace(ch)) {
        if (ch === 0x09) {
          lineIndent += 4 - (lineIndent + this.bsCount[line]) % 4;
        } else {
          lineIndent++;
        }
      } else if (first - lineStart < this.tShift[line]) {
        // patched tShift masked characters to look like spaces (blockquotes, list markers)
        lineIndent++;
      } else {
        break;
      }

      first++;
    }

    if (lineIndent > indent) {
      // partially expanding tabs in code blocks, e.g '\t\tfoobar'
      // with indent=2 becomes '  \tfoobar'
      queue[i] = new Array(lineIndent - indent + 1).join(' ') + this.src.slice(first, last);
    } else {
      queue[i] = this.src.slice(first, last);
    }
  }

  return queue.join('');
};

// re-export Token class to use in block rules
StateBlock.prototype.Token = Token;


module.exports = StateBlock;


/***/ }),
/* 538 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// GFM table, non-standard



var isSpace = __webpack_require__(479).isSpace;


function getLine(state, line) {
  var pos = state.bMarks[line] + state.blkIndent,
      max = state.eMarks[line];

  return state.src.substr(pos, max - pos);
}

function escapedSplit(str) {
  var result = [],
      pos = 0,
      max = str.length,
      ch,
      escapes = 0,
      lastPos = 0,
      backTicked = false,
      lastBackTick = 0;

  ch  = str.charCodeAt(pos);

  while (pos < max) {
    if (ch === 0x60/* ` */) {
      if (backTicked) {
        // make \` close code sequence, but not open it;
        // the reason is: `\` is correct code block
        backTicked = false;
        lastBackTick = pos;
      } else if (escapes % 2 === 0) {
        backTicked = true;
        lastBackTick = pos;
      }
    } else if (ch === 0x7c/* | */ && (escapes % 2 === 0) && !backTicked) {
      result.push(str.substring(lastPos, pos));
      lastPos = pos + 1;
    }

    if (ch === 0x5c/* \ */) {
      escapes++;
    } else {
      escapes = 0;
    }

    pos++;

    // If there was an un-closed backtick, go back to just after
    // the last backtick, but as if it was a normal character
    if (pos === max && backTicked) {
      backTicked = false;
      pos = lastBackTick + 1;
    }

    ch = str.charCodeAt(pos);
  }

  result.push(str.substring(lastPos));

  return result;
}


module.exports = function table(state, startLine, endLine, silent) {
  var ch, lineText, pos, i, nextLine, columns, columnCount, token,
      aligns, t, tableLines, tbodyLines;

  // should have at least two lines
  if (startLine + 2 > endLine) { return false; }

  nextLine = startLine + 1;

  if (state.sCount[nextLine] < state.blkIndent) { return false; }

  // if it's indented more than 3 spaces, it should be a code block
  if (state.sCount[nextLine] - state.blkIndent >= 4) { return false; }

  // first character of the second line should be '|', '-', ':',
  // and no other characters are allowed but spaces;
  // basically, this is the equivalent of /^[-:|][-:|\s]*$/ regexp

  pos = state.bMarks[nextLine] + state.tShift[nextLine];
  if (pos >= state.eMarks[nextLine]) { return false; }

  ch = state.src.charCodeAt(pos++);
  if (ch !== 0x7C/* | */ && ch !== 0x2D/* - */ && ch !== 0x3A/* : */) { return false; }

  while (pos < state.eMarks[nextLine]) {
    ch = state.src.charCodeAt(pos);

    if (ch !== 0x7C/* | */ && ch !== 0x2D/* - */ && ch !== 0x3A/* : */ && !isSpace(ch)) { return false; }

    pos++;
  }

  lineText = getLine(state, startLine + 1);

  columns = lineText.split('|');
  aligns = [];
  for (i = 0; i < columns.length; i++) {
    t = columns[i].trim();
    if (!t) {
      // allow empty columns before and after table, but not in between columns;
      // e.g. allow ` |---| `, disallow ` ---||--- `
      if (i === 0 || i === columns.length - 1) {
        continue;
      } else {
        return false;
      }
    }

    if (!/^:?-+:?$/.test(t)) { return false; }
    if (t.charCodeAt(t.length - 1) === 0x3A/* : */) {
      aligns.push(t.charCodeAt(0) === 0x3A/* : */ ? 'center' : 'right');
    } else if (t.charCodeAt(0) === 0x3A/* : */) {
      aligns.push('left');
    } else {
      aligns.push('');
    }
  }

  lineText = getLine(state, startLine).trim();
  if (lineText.indexOf('|') === -1) { return false; }
  if (state.sCount[startLine] - state.blkIndent >= 4) { return false; }
  columns = escapedSplit(lineText.replace(/^\||\|$/g, ''));

  // header row will define an amount of columns in the entire table,
  // and align row shouldn't be smaller than that (the rest of the rows can)
  columnCount = columns.length;
  if (columnCount > aligns.length) { return false; }

  if (silent) { return true; }

  token     = state.push('table_open', 'table', 1);
  token.map = tableLines = [ startLine, 0 ];

  token     = state.push('thead_open', 'thead', 1);
  token.map = [ startLine, startLine + 1 ];

  token     = state.push('tr_open', 'tr', 1);
  token.map = [ startLine, startLine + 1 ];

  for (i = 0; i < columns.length; i++) {
    token          = state.push('th_open', 'th', 1);
    token.map      = [ startLine, startLine + 1 ];
    if (aligns[i]) {
      token.attrs  = [ [ 'style', 'text-align:' + aligns[i] ] ];
    }

    token          = state.push('inline', '', 0);
    token.content  = columns[i].trim();
    token.map      = [ startLine, startLine + 1 ];
    token.children = [];

    token          = state.push('th_close', 'th', -1);
  }

  token     = state.push('tr_close', 'tr', -1);
  token     = state.push('thead_close', 'thead', -1);

  token     = state.push('tbody_open', 'tbody', 1);
  token.map = tbodyLines = [ startLine + 2, 0 ];

  for (nextLine = startLine + 2; nextLine < endLine; nextLine++) {
    if (state.sCount[nextLine] < state.blkIndent) { break; }

    lineText = getLine(state, nextLine).trim();
    if (lineText.indexOf('|') === -1) { break; }
    if (state.sCount[nextLine] - state.blkIndent >= 4) { break; }
    columns = escapedSplit(lineText.replace(/^\||\|$/g, ''));

    token = state.push('tr_open', 'tr', 1);
    for (i = 0; i < columnCount; i++) {
      token          = state.push('td_open', 'td', 1);
      if (aligns[i]) {
        token.attrs  = [ [ 'style', 'text-align:' + aligns[i] ] ];
      }

      token          = state.push('inline', '', 0);
      token.content  = columns[i] ? columns[i].trim() : '';
      token.children = [];

      token          = state.push('td_close', 'td', -1);
    }
    token = state.push('tr_close', 'tr', -1);
  }
  token = state.push('tbody_close', 'tbody', -1);
  token = state.push('table_close', 'table', -1);

  tableLines[1] = tbodyLines[1] = nextLine;
  state.line = nextLine;
  return true;
};


/***/ }),
/* 539 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";



module.exports = function block(state) {
  var token;

  if (state.inlineMode) {
    token          = new state.Token('inline', '', 0);
    token.content  = state.src;
    token.map      = [ 0, 1 ];
    token.children = [];
    state.tokens.push(token);
  } else {
    state.md.block.parse(state.src, state.md, state.env, state.tokens);
  }
};


/***/ }),
/* 540 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function inline(state) {
  var tokens = state.tokens, tok, i, l;

  // Parse inlines
  for (i = 0, l = tokens.length; i < l; i++) {
    tok = tokens[i];
    if (tok.type === 'inline') {
      state.md.inline.parse(tok.content, state.md, state.env, tok.children);
    }
  }
};


/***/ }),
/* 541 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Replace link-like texts with link nodes.
//
// Currently restricted by `md.validateLink()` to http/https/ftp
//



var arrayReplaceAt = __webpack_require__(479).arrayReplaceAt;


function isLinkOpen(str) {
  return /^<a[>\s]/i.test(str);
}
function isLinkClose(str) {
  return /^<\/a\s*>/i.test(str);
}


module.exports = function linkify(state) {
  var i, j, l, tokens, token, currentToken, nodes, ln, text, pos, lastPos,
      level, htmlLinkLevel, url, fullUrl, urlText,
      blockTokens = state.tokens,
      links;

  if (!state.md.options.linkify) { return; }

  for (j = 0, l = blockTokens.length; j < l; j++) {
    if (blockTokens[j].type !== 'inline' ||
        !state.md.linkify.pretest(blockTokens[j].content)) {
      continue;
    }

    tokens = blockTokens[j].children;

    htmlLinkLevel = 0;

    // We scan from the end, to keep position when new tags added.
    // Use reversed logic in links start/end match
    for (i = tokens.length - 1; i >= 0; i--) {
      currentToken = tokens[i];

      // Skip content of markdown links
      if (currentToken.type === 'link_close') {
        i--;
        while (tokens[i].level !== currentToken.level && tokens[i].type !== 'link_open') {
          i--;
        }
        continue;
      }

      // Skip content of html tag links
      if (currentToken.type === 'html_inline') {
        if (isLinkOpen(currentToken.content) && htmlLinkLevel > 0) {
          htmlLinkLevel--;
        }
        if (isLinkClose(currentToken.content)) {
          htmlLinkLevel++;
        }
      }
      if (htmlLinkLevel > 0) { continue; }

      if (currentToken.type === 'text' && state.md.linkify.test(currentToken.content)) {

        text = currentToken.content;
        links = state.md.linkify.match(text);

        // Now split string to nodes
        nodes = [];
        level = currentToken.level;
        lastPos = 0;

        for (ln = 0; ln < links.length; ln++) {

          url = links[ln].url;
          fullUrl = state.md.normalizeLink(url);
          if (!state.md.validateLink(fullUrl)) { continue; }

          urlText = links[ln].text;

          // Linkifier might send raw hostnames like "example.com", where url
          // starts with domain name. So we prepend http:// in those cases,
          // and remove it afterwards.
          //
          if (!links[ln].schema) {
            urlText = state.md.normalizeLinkText('http://' + urlText).replace(/^http:\/\//, '');
          } else if (links[ln].schema === 'mailto:' && !/^mailto:/i.test(urlText)) {
            urlText = state.md.normalizeLinkText('mailto:' + urlText).replace(/^mailto:/, '');
          } else {
            urlText = state.md.normalizeLinkText(urlText);
          }

          pos = links[ln].index;

          if (pos > lastPos) {
            token         = new state.Token('text', '', 0);
            token.content = text.slice(lastPos, pos);
            token.level   = level;
            nodes.push(token);
          }

          token         = new state.Token('link_open', 'a', 1);
          token.attrs   = [ [ 'href', fullUrl ] ];
          token.level   = level++;
          token.markup  = 'linkify';
          token.info    = 'auto';
          nodes.push(token);

          token         = new state.Token('text', '', 0);
          token.content = urlText;
          token.level   = level;
          nodes.push(token);

          token         = new state.Token('link_close', 'a', -1);
          token.level   = --level;
          token.markup  = 'linkify';
          token.info    = 'auto';
          nodes.push(token);

          lastPos = links[ln].lastIndex;
        }
        if (lastPos < text.length) {
          token         = new state.Token('text', '', 0);
          token.content = text.slice(lastPos);
          token.level   = level;
          nodes.push(token);
        }

        // replace current node
        blockTokens[j].children = tokens = arrayReplaceAt(tokens, i, nodes);
      }
    }
  }
};


/***/ }),
/* 542 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Normalize input string




var NEWLINES_RE  = /\r[\n\u0085]?|[\u2424\u2028\u0085]/g;
var NULL_RE      = /\u0000/g;


module.exports = function inline(state) {
  var str;

  // Normalize newlines
  str = state.src.replace(NEWLINES_RE, '\n');

  // Replace NULL characters
  str = str.replace(NULL_RE, '\uFFFD');

  state.src = str;
};


/***/ }),
/* 543 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Simple typographyc replacements
//
// (c) (C) → ©
// (tm) (TM) → ™
// (r) (R) → ®
// +- → ±
// (p) (P) -> §
// ... → … (also ?.... → ?.., !.... → !..)
// ???????? → ???, !!!!! → !!!, `,,` → `,`
// -- → &ndash;, --- → &mdash;
//


// TODO:
// - fractionals 1/2, 1/4, 3/4 -> ½, ¼, ¾
// - miltiplication 2 x 4 -> 2 × 4

var RARE_RE = /\+-|\.\.|\?\?\?\?|!!!!|,,|--/;

// Workaround for phantomjs - need regex without /g flag,
// or root check will fail every second time
var SCOPED_ABBR_TEST_RE = /\((c|tm|r|p)\)/i;

var SCOPED_ABBR_RE = /\((c|tm|r|p)\)/ig;
var SCOPED_ABBR = {
  c: '©',
  r: '®',
  p: '§',
  tm: '™'
};

function replaceFn(match, name) {
  return SCOPED_ABBR[name.toLowerCase()];
}

function replace_scoped(inlineTokens) {
  var i, token, inside_autolink = 0;

  for (i = inlineTokens.length - 1; i >= 0; i--) {
    token = inlineTokens[i];

    if (token.type === 'text' && !inside_autolink) {
      token.content = token.content.replace(SCOPED_ABBR_RE, replaceFn);
    }

    if (token.type === 'link_open' && token.info === 'auto') {
      inside_autolink--;
    }

    if (token.type === 'link_close' && token.info === 'auto') {
      inside_autolink++;
    }
  }
}

function replace_rare(inlineTokens) {
  var i, token, inside_autolink = 0;

  for (i = inlineTokens.length - 1; i >= 0; i--) {
    token = inlineTokens[i];

    if (token.type === 'text' && !inside_autolink) {
      if (RARE_RE.test(token.content)) {
        token.content = token.content
                    .replace(/\+-/g, '±')
                    // .., ..., ....... -> …
                    // but ?..... & !..... -> ?.. & !..
                    .replace(/\.{2,}/g, '…').replace(/([?!])…/g, '$1..')
                    .replace(/([?!]){4,}/g, '$1$1$1').replace(/,{2,}/g, ',')
                    // em-dash
                    .replace(/(^|[^-])---([^-]|$)/mg, '$1\u2014$2')
                    // en-dash
                    .replace(/(^|\s)--(\s|$)/mg, '$1\u2013$2')
                    .replace(/(^|[^-\s])--([^-\s]|$)/mg, '$1\u2013$2');
      }
    }

    if (token.type === 'link_open' && token.info === 'auto') {
      inside_autolink--;
    }

    if (token.type === 'link_close' && token.info === 'auto') {
      inside_autolink++;
    }
  }
}


module.exports = function replace(state) {
  var blkIdx;

  if (!state.md.options.typographer) { return; }

  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

    if (state.tokens[blkIdx].type !== 'inline') { continue; }

    if (SCOPED_ABBR_TEST_RE.test(state.tokens[blkIdx].content)) {
      replace_scoped(state.tokens[blkIdx].children);
    }

    if (RARE_RE.test(state.tokens[blkIdx].content)) {
      replace_rare(state.tokens[blkIdx].children);
    }

  }
};


/***/ }),
/* 544 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Convert straight quotation marks to typographic ones
//



var isWhiteSpace   = __webpack_require__(479).isWhiteSpace;
var isPunctChar    = __webpack_require__(479).isPunctChar;
var isMdAsciiPunct = __webpack_require__(479).isMdAsciiPunct;

var QUOTE_TEST_RE = /['"]/;
var QUOTE_RE = /['"]/g;
var APOSTROPHE = '\u2019'; /* ’ */


function replaceAt(str, index, ch) {
  return str.substr(0, index) + ch + str.substr(index + 1);
}

function process_inlines(tokens, state) {
  var i, token, text, t, pos, max, thisLevel, item, lastChar, nextChar,
      isLastPunctChar, isNextPunctChar, isLastWhiteSpace, isNextWhiteSpace,
      canOpen, canClose, j, isSingle, stack, openQuote, closeQuote;

  stack = [];

  for (i = 0; i < tokens.length; i++) {
    token = tokens[i];

    thisLevel = tokens[i].level;

    for (j = stack.length - 1; j >= 0; j--) {
      if (stack[j].level <= thisLevel) { break; }
    }
    stack.length = j + 1;

    if (token.type !== 'text') { continue; }

    text = token.content;
    pos = 0;
    max = text.length;

    /*eslint no-labels:0,block-scoped-var:0*/
    OUTER:
    while (pos < max) {
      QUOTE_RE.lastIndex = pos;
      t = QUOTE_RE.exec(text);
      if (!t) { break; }

      canOpen = canClose = true;
      pos = t.index + 1;
      isSingle = (t[0] === "'");

      // Find previous character,
      // default to space if it's the beginning of the line
      //
      lastChar = 0x20;

      if (t.index - 1 >= 0) {
        lastChar = text.charCodeAt(t.index - 1);
      } else {
        for (j = i - 1; j >= 0; j--) {
          if (tokens[j].type !== 'text') { continue; }

          lastChar = tokens[j].content.charCodeAt(tokens[j].content.length - 1);
          break;
        }
      }

      // Find next character,
      // default to space if it's the end of the line
      //
      nextChar = 0x20;

      if (pos < max) {
        nextChar = text.charCodeAt(pos);
      } else {
        for (j = i + 1; j < tokens.length; j++) {
          if (tokens[j].type !== 'text') { continue; }

          nextChar = tokens[j].content.charCodeAt(0);
          break;
        }
      }

      isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
      isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

      isLastWhiteSpace = isWhiteSpace(lastChar);
      isNextWhiteSpace = isWhiteSpace(nextChar);

      if (isNextWhiteSpace) {
        canOpen = false;
      } else if (isNextPunctChar) {
        if (!(isLastWhiteSpace || isLastPunctChar)) {
          canOpen = false;
        }
      }

      if (isLastWhiteSpace) {
        canClose = false;
      } else if (isLastPunctChar) {
        if (!(isNextWhiteSpace || isNextPunctChar)) {
          canClose = false;
        }
      }

      if (nextChar === 0x22 /* " */ && t[0] === '"') {
        if (lastChar >= 0x30 /* 0 */ && lastChar <= 0x39 /* 9 */) {
          // special case: 1"" - count first quote as an inch
          canClose = canOpen = false;
        }
      }

      if (canOpen && canClose) {
        // treat this as the middle of the word
        canOpen = false;
        canClose = isNextPunctChar;
      }

      if (!canOpen && !canClose) {
        // middle of word
        if (isSingle) {
          token.content = replaceAt(token.content, t.index, APOSTROPHE);
        }
        continue;
      }

      if (canClose) {
        // this could be a closing quote, rewind the stack to get a match
        for (j = stack.length - 1; j >= 0; j--) {
          item = stack[j];
          if (stack[j].level < thisLevel) { break; }
          if (item.single === isSingle && stack[j].level === thisLevel) {
            item = stack[j];

            if (isSingle) {
              openQuote = state.md.options.quotes[2];
              closeQuote = state.md.options.quotes[3];
            } else {
              openQuote = state.md.options.quotes[0];
              closeQuote = state.md.options.quotes[1];
            }

            // replace token.content *before* tokens[item.token].content,
            // because, if they are pointing at the same token, replaceAt
            // could mess up indices when quote length != 1
            token.content = replaceAt(token.content, t.index, closeQuote);
            tokens[item.token].content = replaceAt(
              tokens[item.token].content, item.pos, openQuote);

            pos += closeQuote.length - 1;
            if (item.token === i) { pos += openQuote.length - 1; }

            text = token.content;
            max = text.length;

            stack.length = j;
            continue OUTER;
          }
        }
      }

      if (canOpen) {
        stack.push({
          token: i,
          pos: t.index,
          single: isSingle,
          level: thisLevel
        });
      } else if (canClose && isSingle) {
        token.content = replaceAt(token.content, t.index, APOSTROPHE);
      }
    }
  }
}


module.exports = function smartquotes(state) {
  /*eslint max-depth:0*/
  var blkIdx;

  if (!state.md.options.typographer) { return; }

  for (blkIdx = state.tokens.length - 1; blkIdx >= 0; blkIdx--) {

    if (state.tokens[blkIdx].type !== 'inline' ||
        !QUOTE_TEST_RE.test(state.tokens[blkIdx].content)) {
      continue;
    }

    process_inlines(state.tokens[blkIdx].children, state);
  }
};


/***/ }),
/* 545 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Core state object
//


var Token = __webpack_require__(482);


function StateCore(src, md, env) {
  this.src = src;
  this.env = env;
  this.tokens = [];
  this.inlineMode = false;
  this.md = md; // link to parser instance
}

// re-export Token class to use in core rules
StateCore.prototype.Token = Token;


module.exports = StateCore;


/***/ }),
/* 546 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Process autolinks '<protocol:...>'




/*eslint max-len:0*/
var EMAIL_RE    = /^<([a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*)>/;
var AUTOLINK_RE = /^<([a-zA-Z][a-zA-Z0-9+.\-]{1,31}):([^<>\x00-\x20]*)>/;


module.exports = function autolink(state, silent) {
  var tail, linkMatch, emailMatch, url, fullUrl, token,
      pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x3C/* < */) { return false; }

  tail = state.src.slice(pos);

  if (tail.indexOf('>') < 0) { return false; }

  if (AUTOLINK_RE.test(tail)) {
    linkMatch = tail.match(AUTOLINK_RE);

    url = linkMatch[0].slice(1, -1);
    fullUrl = state.md.normalizeLink(url);
    if (!state.md.validateLink(fullUrl)) { return false; }

    if (!silent) {
      token         = state.push('link_open', 'a', 1);
      token.attrs   = [ [ 'href', fullUrl ] ];
      token.markup  = 'autolink';
      token.info    = 'auto';

      token         = state.push('text', '', 0);
      token.content = state.md.normalizeLinkText(url);

      token         = state.push('link_close', 'a', -1);
      token.markup  = 'autolink';
      token.info    = 'auto';
    }

    state.pos += linkMatch[0].length;
    return true;
  }

  if (EMAIL_RE.test(tail)) {
    emailMatch = tail.match(EMAIL_RE);

    url = emailMatch[0].slice(1, -1);
    fullUrl = state.md.normalizeLink('mailto:' + url);
    if (!state.md.validateLink(fullUrl)) { return false; }

    if (!silent) {
      token         = state.push('link_open', 'a', 1);
      token.attrs   = [ [ 'href', fullUrl ] ];
      token.markup  = 'autolink';
      token.info    = 'auto';

      token         = state.push('text', '', 0);
      token.content = state.md.normalizeLinkText(url);

      token         = state.push('link_close', 'a', -1);
      token.markup  = 'autolink';
      token.info    = 'auto';
    }

    state.pos += emailMatch[0].length;
    return true;
  }

  return false;
};


/***/ }),
/* 547 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Parse backticks



module.exports = function backtick(state, silent) {
  var start, max, marker, matchStart, matchEnd, token,
      pos = state.pos,
      ch = state.src.charCodeAt(pos);

  if (ch !== 0x60/* ` */) { return false; }

  start = pos;
  pos++;
  max = state.posMax;

  while (pos < max && state.src.charCodeAt(pos) === 0x60/* ` */) { pos++; }

  marker = state.src.slice(start, pos);

  matchStart = matchEnd = pos;

  while ((matchStart = state.src.indexOf('`', matchEnd)) !== -1) {
    matchEnd = matchStart + 1;

    while (matchEnd < max && state.src.charCodeAt(matchEnd) === 0x60/* ` */) { matchEnd++; }

    if (matchEnd - matchStart === marker.length) {
      if (!silent) {
        token         = state.push('code_inline', 'code', 0);
        token.markup  = marker;
        token.content = state.src.slice(pos, matchStart)
                                 .replace(/[ \n]+/g, ' ')
                                 .trim();
      }
      state.pos = matchEnd;
      return true;
    }
  }

  if (!silent) { state.pending += marker; }
  state.pos += marker.length;
  return true;
};


/***/ }),
/* 548 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// For each opening emphasis-like marker find a matching closing one
//



module.exports = function link_pairs(state) {
  var i, j, lastDelim, currDelim,
      delimiters = state.delimiters,
      max = state.delimiters.length;

  for (i = 0; i < max; i++) {
    lastDelim = delimiters[i];

    if (!lastDelim.close) { continue; }

    j = i - lastDelim.jump - 1;

    while (j >= 0) {
      currDelim = delimiters[j];

      if (currDelim.open &&
          currDelim.marker === lastDelim.marker &&
          currDelim.end < 0 &&
          currDelim.level === lastDelim.level) {

        // typeofs are for backward compatibility with plugins
        var odd_match = (currDelim.close || lastDelim.open) &&
                        typeof currDelim.length !== 'undefined' &&
                        typeof lastDelim.length !== 'undefined' &&
                        (currDelim.length + lastDelim.length) % 3 === 0;

        if (!odd_match) {
          lastDelim.jump = i - j;
          lastDelim.open = false;
          currDelim.end  = i;
          currDelim.jump = 0;
          break;
        }
      }

      j -= currDelim.jump + 1;
    }
  }
};


/***/ }),
/* 549 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Process html entity - &#123;, &#xAF;, &quot;, ...



var entities          = __webpack_require__(486);
var has               = __webpack_require__(479).has;
var isValidEntityCode = __webpack_require__(479).isValidEntityCode;
var fromCodePoint     = __webpack_require__(479).fromCodePoint;


var DIGITAL_RE = /^&#((?:x[a-f0-9]{1,8}|[0-9]{1,8}));/i;
var NAMED_RE   = /^&([a-z][a-z0-9]{1,31});/i;


module.exports = function entity(state, silent) {
  var ch, code, match, pos = state.pos, max = state.posMax;

  if (state.src.charCodeAt(pos) !== 0x26/* & */) { return false; }

  if (pos + 1 < max) {
    ch = state.src.charCodeAt(pos + 1);

    if (ch === 0x23 /* # */) {
      match = state.src.slice(pos).match(DIGITAL_RE);
      if (match) {
        if (!silent) {
          code = match[1][0].toLowerCase() === 'x' ? parseInt(match[1].slice(1), 16) : parseInt(match[1], 10);
          state.pending += isValidEntityCode(code) ? fromCodePoint(code) : fromCodePoint(0xFFFD);
        }
        state.pos += match[0].length;
        return true;
      }
    } else {
      match = state.src.slice(pos).match(NAMED_RE);
      if (match) {
        if (has(entities, match[1])) {
          if (!silent) { state.pending += entities[match[1]]; }
          state.pos += match[0].length;
          return true;
        }
      }
    }
  }

  if (!silent) { state.pending += '&'; }
  state.pos++;
  return true;
};


/***/ }),
/* 550 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Process escaped chars and hardbreaks



var isSpace = __webpack_require__(479).isSpace;

var ESCAPED = [];

for (var i = 0; i < 256; i++) { ESCAPED.push(0); }

'\\!"#$%&\'()*+,./:;<=>?@[]^_`{|}~-'
  .split('').forEach(function (ch) { ESCAPED[ch.charCodeAt(0)] = 1; });


module.exports = function escape(state, silent) {
  var ch, pos = state.pos, max = state.posMax;

  if (state.src.charCodeAt(pos) !== 0x5C/* \ */) { return false; }

  pos++;

  if (pos < max) {
    ch = state.src.charCodeAt(pos);

    if (ch < 256 && ESCAPED[ch] !== 0) {
      if (!silent) { state.pending += state.src[pos]; }
      state.pos += 2;
      return true;
    }

    if (ch === 0x0A) {
      if (!silent) {
        state.push('hardbreak', 'br', 0);
      }

      pos++;
      // skip leading whitespaces from next line
      while (pos < max) {
        ch = state.src.charCodeAt(pos);
        if (!isSpace(ch)) { break; }
        pos++;
      }

      state.pos = pos;
      return true;
    }
  }

  if (!silent) { state.pending += '\\'; }
  state.pos++;
  return true;
};


/***/ }),
/* 551 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Process html tags




var HTML_TAG_RE = __webpack_require__(487).HTML_TAG_RE;


function isLetter(ch) {
  /*eslint no-bitwise:0*/
  var lc = ch | 0x20; // to lower case
  return (lc >= 0x61/* a */) && (lc <= 0x7a/* z */);
}


module.exports = function html_inline(state, silent) {
  var ch, match, max, token,
      pos = state.pos;

  if (!state.md.options.html) { return false; }

  // Check start
  max = state.posMax;
  if (state.src.charCodeAt(pos) !== 0x3C/* < */ ||
      pos + 2 >= max) {
    return false;
  }

  // Quick fail on second char
  ch = state.src.charCodeAt(pos + 1);
  if (ch !== 0x21/* ! */ &&
      ch !== 0x3F/* ? */ &&
      ch !== 0x2F/* / */ &&
      !isLetter(ch)) {
    return false;
  }

  match = state.src.slice(pos).match(HTML_TAG_RE);
  if (!match) { return false; }

  if (!silent) {
    token         = state.push('html_inline', '', 0);
    token.content = state.src.slice(pos, pos + match[0].length);
  }
  state.pos += match[0].length;
  return true;
};


/***/ }),
/* 552 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Process ![image](<src> "title")



var normalizeReference   = __webpack_require__(479).normalizeReference;
var isSpace              = __webpack_require__(479).isSpace;


module.exports = function image(state, silent) {
  var attrs,
      code,
      content,
      label,
      labelEnd,
      labelStart,
      pos,
      ref,
      res,
      title,
      token,
      tokens,
      start,
      href = '',
      oldPos = state.pos,
      max = state.posMax;

  if (state.src.charCodeAt(state.pos) !== 0x21/* ! */) { return false; }
  if (state.src.charCodeAt(state.pos + 1) !== 0x5B/* [ */) { return false; }

  labelStart = state.pos + 2;
  labelEnd = state.md.helpers.parseLinkLabel(state, state.pos + 1, false);

  // parser failed to find ']', so it's not a valid link
  if (labelEnd < 0) { return false; }

  pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {
    //
    // Inline link
    //

    // [link](  <href>  "title"  )
    //        ^^ skipping these spaces
    pos++;
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (!isSpace(code) && code !== 0x0A) { break; }
    }
    if (pos >= max) { return false; }

    // [link](  <href>  "title"  )
    //          ^^^^^^ parsing link destination
    start = pos;
    res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
    if (res.ok) {
      href = state.md.normalizeLink(res.str);
      if (state.md.validateLink(href)) {
        pos = res.pos;
      } else {
        href = '';
      }
    }

    // [link](  <href>  "title"  )
    //                ^^ skipping these spaces
    start = pos;
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (!isSpace(code) && code !== 0x0A) { break; }
    }

    // [link](  <href>  "title"  )
    //                  ^^^^^^^ parsing link title
    res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
    if (pos < max && start !== pos && res.ok) {
      title = res.str;
      pos = res.pos;

      // [link](  <href>  "title"  )
      //                         ^^ skipping these spaces
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos);
        if (!isSpace(code) && code !== 0x0A) { break; }
      }
    } else {
      title = '';
    }

    if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {
      state.pos = oldPos;
      return false;
    }
    pos++;
  } else {
    //
    // Link reference
    //
    if (typeof state.env.references === 'undefined') { return false; }

    if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {
      start = pos + 1;
      pos = state.md.helpers.parseLinkLabel(state, pos);
      if (pos >= 0) {
        label = state.src.slice(start, pos++);
      } else {
        pos = labelEnd + 1;
      }
    } else {
      pos = labelEnd + 1;
    }

    // covers label === '' and label === undefined
    // (collapsed reference link and shortcut reference link respectively)
    if (!label) { label = state.src.slice(labelStart, labelEnd); }

    ref = state.env.references[normalizeReference(label)];
    if (!ref) {
      state.pos = oldPos;
      return false;
    }
    href = ref.href;
    title = ref.title;
  }

  //
  // We found the end of the link, and know for a fact it's a valid link;
  // so all that's left to do is to call tokenizer.
  //
  if (!silent) {
    content = state.src.slice(labelStart, labelEnd);

    state.md.inline.parse(
      content,
      state.md,
      state.env,
      tokens = []
    );

    token          = state.push('image', 'img', 0);
    token.attrs    = attrs = [ [ 'src', href ], [ 'alt', '' ] ];
    token.children = tokens;
    token.content  = content;

    if (title) {
      attrs.push([ 'title', title ]);
    }
  }

  state.pos = pos;
  state.posMax = max;
  return true;
};


/***/ }),
/* 553 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Process [link](<to> "stuff")



var normalizeReference   = __webpack_require__(479).normalizeReference;
var isSpace              = __webpack_require__(479).isSpace;


module.exports = function link(state, silent) {
  var attrs,
      code,
      label,
      labelEnd,
      labelStart,
      pos,
      res,
      ref,
      title,
      token,
      href = '',
      oldPos = state.pos,
      max = state.posMax,
      start = state.pos,
      parseReference = true;

  if (state.src.charCodeAt(state.pos) !== 0x5B/* [ */) { return false; }

  labelStart = state.pos + 1;
  labelEnd = state.md.helpers.parseLinkLabel(state, state.pos, true);

  // parser failed to find ']', so it's not a valid link
  if (labelEnd < 0) { return false; }

  pos = labelEnd + 1;
  if (pos < max && state.src.charCodeAt(pos) === 0x28/* ( */) {
    //
    // Inline link
    //

    // might have found a valid shortcut link, disable reference parsing
    parseReference = false;

    // [link](  <href>  "title"  )
    //        ^^ skipping these spaces
    pos++;
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (!isSpace(code) && code !== 0x0A) { break; }
    }
    if (pos >= max) { return false; }

    // [link](  <href>  "title"  )
    //          ^^^^^^ parsing link destination
    start = pos;
    res = state.md.helpers.parseLinkDestination(state.src, pos, state.posMax);
    if (res.ok) {
      href = state.md.normalizeLink(res.str);
      if (state.md.validateLink(href)) {
        pos = res.pos;
      } else {
        href = '';
      }
    }

    // [link](  <href>  "title"  )
    //                ^^ skipping these spaces
    start = pos;
    for (; pos < max; pos++) {
      code = state.src.charCodeAt(pos);
      if (!isSpace(code) && code !== 0x0A) { break; }
    }

    // [link](  <href>  "title"  )
    //                  ^^^^^^^ parsing link title
    res = state.md.helpers.parseLinkTitle(state.src, pos, state.posMax);
    if (pos < max && start !== pos && res.ok) {
      title = res.str;
      pos = res.pos;

      // [link](  <href>  "title"  )
      //                         ^^ skipping these spaces
      for (; pos < max; pos++) {
        code = state.src.charCodeAt(pos);
        if (!isSpace(code) && code !== 0x0A) { break; }
      }
    } else {
      title = '';
    }

    if (pos >= max || state.src.charCodeAt(pos) !== 0x29/* ) */) {
      // parsing a valid shortcut link failed, fallback to reference
      parseReference = true;
    }
    pos++;
  }

  if (parseReference) {
    //
    // Link reference
    //
    if (typeof state.env.references === 'undefined') { return false; }

    if (pos < max && state.src.charCodeAt(pos) === 0x5B/* [ */) {
      start = pos + 1;
      pos = state.md.helpers.parseLinkLabel(state, pos);
      if (pos >= 0) {
        label = state.src.slice(start, pos++);
      } else {
        pos = labelEnd + 1;
      }
    } else {
      pos = labelEnd + 1;
    }

    // covers label === '' and label === undefined
    // (collapsed reference link and shortcut reference link respectively)
    if (!label) { label = state.src.slice(labelStart, labelEnd); }

    ref = state.env.references[normalizeReference(label)];
    if (!ref) {
      state.pos = oldPos;
      return false;
    }
    href = ref.href;
    title = ref.title;
  }

  //
  // We found the end of the link, and know for a fact it's a valid link;
  // so all that's left to do is to call tokenizer.
  //
  if (!silent) {
    state.pos = labelStart;
    state.posMax = labelEnd;

    token        = state.push('link_open', 'a', 1);
    token.attrs  = attrs = [ [ 'href', href ] ];
    if (title) {
      attrs.push([ 'title', title ]);
    }

    state.md.inline.tokenize(state);

    token        = state.push('link_close', 'a', -1);
  }

  state.pos = pos;
  state.posMax = max;
  return true;
};


/***/ }),
/* 554 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Proceess '\n'



var isSpace = __webpack_require__(479).isSpace;


module.exports = function newline(state, silent) {
  var pmax, max, pos = state.pos;

  if (state.src.charCodeAt(pos) !== 0x0A/* \n */) { return false; }

  pmax = state.pending.length - 1;
  max = state.posMax;

  // '  \n' -> hardbreak
  // Lookup in pending chars is bad practice! Don't copy to other rules!
  // Pending string is stored in concat mode, indexed lookups will cause
  // convertion to flat mode.
  if (!silent) {
    if (pmax >= 0 && state.pending.charCodeAt(pmax) === 0x20) {
      if (pmax >= 1 && state.pending.charCodeAt(pmax - 1) === 0x20) {
        state.pending = state.pending.replace(/ +$/, '');
        state.push('hardbreak', 'br', 0);
      } else {
        state.pending = state.pending.slice(0, -1);
        state.push('softbreak', 'br', 0);
      }

    } else {
      state.push('softbreak', 'br', 0);
    }
  }

  pos++;

  // skip heading spaces for next line
  while (pos < max && isSpace(state.src.charCodeAt(pos))) { pos++; }

  state.pos = pos;
  return true;
};


/***/ }),
/* 555 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Inline parser state




var Token          = __webpack_require__(482);
var isWhiteSpace   = __webpack_require__(479).isWhiteSpace;
var isPunctChar    = __webpack_require__(479).isPunctChar;
var isMdAsciiPunct = __webpack_require__(479).isMdAsciiPunct;


function StateInline(src, md, env, outTokens) {
  this.src = src;
  this.env = env;
  this.md = md;
  this.tokens = outTokens;

  this.pos = 0;
  this.posMax = this.src.length;
  this.level = 0;
  this.pending = '';
  this.pendingLevel = 0;

  this.cache = {};        // Stores { start: end } pairs. Useful for backtrack
                          // optimization of pairs parse (emphasis, strikes).

  this.delimiters = [];   // Emphasis-like delimiters
}


// Flush pending text
//
StateInline.prototype.pushPending = function () {
  var token = new Token('text', '', 0);
  token.content = this.pending;
  token.level = this.pendingLevel;
  this.tokens.push(token);
  this.pending = '';
  return token;
};


// Push new token to "stream".
// If pending text exists - flush it as text token
//
StateInline.prototype.push = function (type, tag, nesting) {
  if (this.pending) {
    this.pushPending();
  }

  var token = new Token(type, tag, nesting);

  if (nesting < 0) { this.level--; }
  token.level = this.level;
  if (nesting > 0) { this.level++; }

  this.pendingLevel = this.level;
  this.tokens.push(token);
  return token;
};


// Scan a sequence of emphasis-like markers, and determine whether
// it can start an emphasis sequence or end an emphasis sequence.
//
//  - start - position to scan from (it should point at a valid marker);
//  - canSplitWord - determine if these markers can be found inside a word
//
StateInline.prototype.scanDelims = function (start, canSplitWord) {
  var pos = start, lastChar, nextChar, count, can_open, can_close,
      isLastWhiteSpace, isLastPunctChar,
      isNextWhiteSpace, isNextPunctChar,
      left_flanking = true,
      right_flanking = true,
      max = this.posMax,
      marker = this.src.charCodeAt(start);

  // treat beginning of the line as a whitespace
  lastChar = start > 0 ? this.src.charCodeAt(start - 1) : 0x20;

  while (pos < max && this.src.charCodeAt(pos) === marker) { pos++; }

  count = pos - start;

  // treat end of the line as a whitespace
  nextChar = pos < max ? this.src.charCodeAt(pos) : 0x20;

  isLastPunctChar = isMdAsciiPunct(lastChar) || isPunctChar(String.fromCharCode(lastChar));
  isNextPunctChar = isMdAsciiPunct(nextChar) || isPunctChar(String.fromCharCode(nextChar));

  isLastWhiteSpace = isWhiteSpace(lastChar);
  isNextWhiteSpace = isWhiteSpace(nextChar);

  if (isNextWhiteSpace) {
    left_flanking = false;
  } else if (isNextPunctChar) {
    if (!(isLastWhiteSpace || isLastPunctChar)) {
      left_flanking = false;
    }
  }

  if (isLastWhiteSpace) {
    right_flanking = false;
  } else if (isLastPunctChar) {
    if (!(isNextWhiteSpace || isNextPunctChar)) {
      right_flanking = false;
    }
  }

  if (!canSplitWord) {
    can_open  = left_flanking  && (!right_flanking || isLastPunctChar);
    can_close = right_flanking && (!left_flanking  || isNextPunctChar);
  } else {
    can_open  = left_flanking;
    can_close = right_flanking;
  }

  return {
    can_open:  can_open,
    can_close: can_close,
    length:    count
  };
};


// re-export Token class to use in block rules
StateInline.prototype.Token = Token;


module.exports = StateInline;


/***/ }),
/* 556 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Skip text characters for text token, place those to pending buffer
// and increment current pos




// Rule to skip pure text
// '{}$%@~+=:' reserved for extentions

// !, ", #, $, %, &, ', (, ), *, +, ,, -, ., /, :, ;, <, =, >, ?, @, [, \, ], ^, _, `, {, |, }, or ~

// !!!! Don't confuse with "Markdown ASCII Punctuation" chars
// http://spec.commonmark.org/0.15/#ascii-punctuation-character
function isTerminatorChar(ch) {
  switch (ch) {
    case 0x0A/* \n */:
    case 0x21/* ! */:
    case 0x23/* # */:
    case 0x24/* $ */:
    case 0x25/* % */:
    case 0x26/* & */:
    case 0x2A/* * */:
    case 0x2B/* + */:
    case 0x2D/* - */:
    case 0x3A/* : */:
    case 0x3C/* < */:
    case 0x3D/* = */:
    case 0x3E/* > */:
    case 0x40/* @ */:
    case 0x5B/* [ */:
    case 0x5C/* \ */:
    case 0x5D/* ] */:
    case 0x5E/* ^ */:
    case 0x5F/* _ */:
    case 0x60/* ` */:
    case 0x7B/* { */:
    case 0x7D/* } */:
    case 0x7E/* ~ */:
      return true;
    default:
      return false;
  }
}

module.exports = function text(state, silent) {
  var pos = state.pos;

  while (pos < state.posMax && !isTerminatorChar(state.src.charCodeAt(pos))) {
    pos++;
  }

  if (pos === state.pos) { return false; }

  if (!silent) { state.pending += state.src.slice(state.pos, pos); }

  state.pos = pos;

  return true;
};

// Alternative implementation, for memory.
//
// It costs 10% of performance, but allows extend terminators list, if place it
// to `ParcerInline` property. Probably, will switch to it sometime, such
// flexibility required.

/*
var TERMINATOR_RE = /[\n!#$%&*+\-:<=>@[\\\]^_`{}~]/;

module.exports = function text(state, silent) {
  var pos = state.pos,
      idx = state.src.slice(pos).search(TERMINATOR_RE);

  // first char is terminator -> empty text
  if (idx === 0) { return false; }

  // no terminator -> text till end of string
  if (idx < 0) {
    if (!silent) { state.pending += state.src.slice(pos); }
    state.pos = state.src.length;
    return true;
  }

  if (!silent) { state.pending += state.src.slice(pos, pos + idx); }

  state.pos += idx;

  return true;
};*/


/***/ }),
/* 557 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Merge adjacent text nodes into one, and re-calculate all token levels
//



module.exports = function text_collapse(state) {
  var curr, last,
      level = 0,
      tokens = state.tokens,
      max = state.tokens.length;

  for (curr = last = 0; curr < max; curr++) {
    // re-calculate levels
    level += tokens[curr].nesting;
    tokens[curr].level = level;

    if (tokens[curr].type === 'text' &&
        curr + 1 < max &&
        tokens[curr + 1].type === 'text') {

      // collapse two adjacent text nodes
      tokens[curr + 1].content = tokens[curr].content + tokens[curr + 1].content;
    } else {
      if (curr !== last) { tokens[last] = tokens[curr]; }

      last++;
    }
  }

  if (curr !== last) {
    tokens.length = last;
  }
};


/***/ }),
/* 558 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




/* eslint-disable no-bitwise */

var decodeCache = {};

function getDecodeCache(exclude) {
  var i, ch, cache = decodeCache[exclude];
  if (cache) { return cache; }

  cache = decodeCache[exclude] = [];

  for (i = 0; i < 128; i++) {
    ch = String.fromCharCode(i);
    cache.push(ch);
  }

  for (i = 0; i < exclude.length; i++) {
    ch = exclude.charCodeAt(i);
    cache[ch] = '%' + ('0' + ch.toString(16).toUpperCase()).slice(-2);
  }

  return cache;
}


// Decode percent-encoded string.
//
function decode(string, exclude) {
  var cache;

  if (typeof exclude !== 'string') {
    exclude = decode.defaultChars;
  }

  cache = getDecodeCache(exclude);

  return string.replace(/(%[a-f0-9]{2})+/gi, function(seq) {
    var i, l, b1, b2, b3, b4, chr,
        result = '';

    for (i = 0, l = seq.length; i < l; i += 3) {
      b1 = parseInt(seq.slice(i + 1, i + 3), 16);

      if (b1 < 0x80) {
        result += cache[b1];
        continue;
      }

      if ((b1 & 0xE0) === 0xC0 && (i + 3 < l)) {
        // 110xxxxx 10xxxxxx
        b2 = parseInt(seq.slice(i + 4, i + 6), 16);

        if ((b2 & 0xC0) === 0x80) {
          chr = ((b1 << 6) & 0x7C0) | (b2 & 0x3F);

          if (chr < 0x80) {
            result += '\ufffd\ufffd';
          } else {
            result += String.fromCharCode(chr);
          }

          i += 3;
          continue;
        }
      }

      if ((b1 & 0xF0) === 0xE0 && (i + 6 < l)) {
        // 1110xxxx 10xxxxxx 10xxxxxx
        b2 = parseInt(seq.slice(i + 4, i + 6), 16);
        b3 = parseInt(seq.slice(i + 7, i + 9), 16);

        if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80) {
          chr = ((b1 << 12) & 0xF000) | ((b2 << 6) & 0xFC0) | (b3 & 0x3F);

          if (chr < 0x800 || (chr >= 0xD800 && chr <= 0xDFFF)) {
            result += '\ufffd\ufffd\ufffd';
          } else {
            result += String.fromCharCode(chr);
          }

          i += 6;
          continue;
        }
      }

      if ((b1 & 0xF8) === 0xF0 && (i + 9 < l)) {
        // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx
        b2 = parseInt(seq.slice(i + 4, i + 6), 16);
        b3 = parseInt(seq.slice(i + 7, i + 9), 16);
        b4 = parseInt(seq.slice(i + 10, i + 12), 16);

        if ((b2 & 0xC0) === 0x80 && (b3 & 0xC0) === 0x80 && (b4 & 0xC0) === 0x80) {
          chr = ((b1 << 18) & 0x1C0000) | ((b2 << 12) & 0x3F000) | ((b3 << 6) & 0xFC0) | (b4 & 0x3F);

          if (chr < 0x10000 || chr > 0x10FFFF) {
            result += '\ufffd\ufffd\ufffd\ufffd';
          } else {
            chr -= 0x10000;
            result += String.fromCharCode(0xD800 + (chr >> 10), 0xDC00 + (chr & 0x3FF));
          }

          i += 9;
          continue;
        }
      }

      result += '\ufffd';
    }

    return result;
  });
}


decode.defaultChars   = ';/?:@&=+$,#';
decode.componentChars = '';


module.exports = decode;


/***/ }),
/* 559 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




var encodeCache = {};


// Create a lookup array where anything but characters in `chars` string
// and alphanumeric chars is percent-encoded.
//
function getEncodeCache(exclude) {
  var i, ch, cache = encodeCache[exclude];
  if (cache) { return cache; }

  cache = encodeCache[exclude] = [];

  for (i = 0; i < 128; i++) {
    ch = String.fromCharCode(i);

    if (/^[0-9a-z]$/i.test(ch)) {
      // always allow unencoded alphanumeric characters
      cache.push(ch);
    } else {
      cache.push('%' + ('0' + i.toString(16).toUpperCase()).slice(-2));
    }
  }

  for (i = 0; i < exclude.length; i++) {
    cache[exclude.charCodeAt(i)] = exclude[i];
  }

  return cache;
}


// Encode unsafe characters with percent-encoding, skipping already
// encoded sequences.
//
//  - string       - string to encode
//  - exclude      - list of characters to ignore (in addition to a-zA-Z0-9)
//  - keepEscaped  - don't encode '%' in a correct escape sequence (default: true)
//
function encode(string, exclude, keepEscaped) {
  var i, l, code, nextCode, cache,
      result = '';

  if (typeof exclude !== 'string') {
    // encode(string, keepEscaped)
    keepEscaped  = exclude;
    exclude = encode.defaultChars;
  }

  if (typeof keepEscaped === 'undefined') {
    keepEscaped = true;
  }

  cache = getEncodeCache(exclude);

  for (i = 0, l = string.length; i < l; i++) {
    code = string.charCodeAt(i);

    if (keepEscaped && code === 0x25 /* % */ && i + 2 < l) {
      if (/^[0-9a-f]{2}$/i.test(string.slice(i + 1, i + 3))) {
        result += string.slice(i, i + 3);
        i += 2;
        continue;
      }
    }

    if (code < 128) {
      result += cache[code];
      continue;
    }

    if (code >= 0xD800 && code <= 0xDFFF) {
      if (code >= 0xD800 && code <= 0xDBFF && i + 1 < l) {
        nextCode = string.charCodeAt(i + 1);
        if (nextCode >= 0xDC00 && nextCode <= 0xDFFF) {
          result += encodeURIComponent(string[i] + string[i + 1]);
          i++;
          continue;
        }
      }
      result += '%EF%BF%BD';
      continue;
    }

    result += encodeURIComponent(string[i]);
  }

  return result;
}

encode.defaultChars   = ";/?:@&=+$,-_.!~*'()#";
encode.componentChars = "-_.!~*'()";


module.exports = encode;


/***/ }),
/* 560 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";




module.exports = function format(url) {
  var result = '';

  result += url.protocol || '';
  result += url.slashes ? '//' : '';
  result += url.auth ? url.auth + '@' : '';

  if (url.hostname && url.hostname.indexOf(':') !== -1) {
    // ipv6 address
    result += '[' + url.hostname + ']';
  } else {
    result += url.hostname || '';
  }

  result += url.port ? ':' + url.port : '';
  result += url.pathname || '';
  result += url.search || '';
  result += url.hash || '';

  return result;
};


/***/ }),
/* 561 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



//
// Changes from joyent/node:
//
// 1. No leading slash in paths,
//    e.g. in `url.parse('http://foo?bar')` pathname is ``, not `/`
//
// 2. Backslashes are not replaced with slashes,
//    so `http:\\example.org\` is treated like a relative path
//
// 3. Trailing colon is treated like a part of the path,
//    i.e. in `http://example.org:foo` pathname is `:foo`
//
// 4. Nothing is URL-encoded in the resulting object,
//    (in joyent/node some chars in auth and paths are encoded)
//
// 5. `url.parse()` does not have `parseQueryString` argument
//
// 6. Removed extraneous result properties: `host`, `path`, `query`, etc.,
//    which can be constructed using other parts of the url.
//


function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.pathname = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = [ '<', '>', '"', '`', ' ', '\r', '\n', '\t' ],

    // RFC 2396: characters not allowed for various reasons.
    unwise = [ '{', '}', '|', '\\', '^', '`' ].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = [ '\'' ].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = [ '%', '/', '?', ';', '#' ].concat(autoEscape),
    hostEndingChars = [ '/', '?', '#' ],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    /* eslint-disable no-script-url */
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    };
    /* eslint-enable no-script-url */

function urlParse(url, slashesDenoteHost) {
  if (url && url instanceof Url) { return url; }

  var u = new Url();
  u.parse(url, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, slashesDenoteHost) {
  var i, l, lowerProto, hec, slashes,
      rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    lowerProto = proto.toLowerCase();
    this.protocol = proto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (i = 0; i < hostEndingChars.length; i++) {
      hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = auth;
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (i = 0; i < nonHostChars.length; i++) {
      hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd)) {
        hostEnd = hec;
      }
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1) {
      hostEnd = rest.length;
    }

    if (rest[hostEnd - 1] === ':') { hostEnd--; }
    var host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost(host);

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) { continue; }
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    }

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
    }
  }

  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    rest = rest.slice(0, qm);
  }
  if (rest) { this.pathname = rest; }
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '';
  }

  return this;
};

Url.prototype.parseHost = function(host) {
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) { this.hostname = host; }
};

module.exports = urlParse;


/***/ }),
/* 562 */
/***/ (function(module, exports) {

module.exports=/[\xAD\u0600-\u0605\u061C\u06DD\u070F\u08E2\u180E\u200B-\u200F\u202A-\u202E\u2060-\u2064\u2066-\u206F\uFEFF\uFFF9-\uFFFB]|\uD804\uDCBD|\uD82F[\uDCA0-\uDCA3]|\uD834[\uDD73-\uDD7A]|\uDB40[\uDC01\uDC20-\uDC7F]/

/***/ }),
/* 563 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.Any = __webpack_require__(493);
exports.Cc  = __webpack_require__(491);
exports.Cf  = __webpack_require__(562);
exports.P   = __webpack_require__(483);
exports.Z   = __webpack_require__(492);


/***/ }),
/* 564 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "markdown-wrapper"
  }, [(_vm.frontMatterVisible) ? _c('div', {
    staticClass: "content-block white-block"
  }, [_c('pre', [_vm._v(_vm._s(_vm.frontMatter))])]) : _vm._e(), _c('div', {
    ref: "renderedmarkdown",
    staticClass: "rendered-markdown"
  }, [_c('p', [_vm._v(_vm._s(_vm.$t('common.loading')))])])])
},staticRenderFns: []}

/***/ }),
/* 565 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__);


__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default.a.register({"angle-left":{"width":640,"height":1792,"paths":[{"d":"M627 544q0 13-10 23l-393 393 393 393q10 10 10 23t-10 23l-50 50q-10 10-23 10t-23-10l-466-466q-10-10-10-23t10-23l466-466q10-10 23-10t23 10l50 50q10 10 10 23z"}]}})


/***/ }),
/* 566 */
/***/ (function(module, exports, __webpack_require__) {

var baseForOwn = __webpack_require__(568),
    createBaseEach = __webpack_require__(569);

/**
 * The base implementation of `_.forEach` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array|Object} Returns `collection`.
 */
var baseEach = createBaseEach(baseForOwn);

module.exports = baseEach;


/***/ }),
/* 567 */
/***/ (function(module, exports, __webpack_require__) {

var createBaseFor = __webpack_require__(570);

/**
 * The base implementation of `baseForOwn` which iterates over `object`
 * properties returned by `keysFunc` and invokes `iteratee` for each property.
 * Iteratee functions may exit iteration early by explicitly returning `false`.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @param {Function} keysFunc The function to get the keys of `object`.
 * @returns {Object} Returns `object`.
 */
var baseFor = createBaseFor();

module.exports = baseFor;


/***/ }),
/* 568 */
/***/ (function(module, exports, __webpack_require__) {

var baseFor = __webpack_require__(567),
    keys = __webpack_require__(47);

/**
 * The base implementation of `_.forOwn` without support for iteratee shorthands.
 *
 * @private
 * @param {Object} object The object to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Object} Returns `object`.
 */
function baseForOwn(object, iteratee) {
  return object && baseFor(object, iteratee, keys);
}

module.exports = baseForOwn;


/***/ }),
/* 569 */
/***/ (function(module, exports, __webpack_require__) {

var isArrayLike = __webpack_require__(71);

/**
 * Creates a `baseEach` or `baseEachRight` function.
 *
 * @private
 * @param {Function} eachFunc The function to iterate over a collection.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseEach(eachFunc, fromRight) {
  return function(collection, iteratee) {
    if (collection == null) {
      return collection;
    }
    if (!isArrayLike(collection)) {
      return eachFunc(collection, iteratee);
    }
    var length = collection.length,
        index = fromRight ? length : -1,
        iterable = Object(collection);

    while ((fromRight ? index-- : ++index < length)) {
      if (iteratee(iterable[index], index, iterable) === false) {
        break;
      }
    }
    return collection;
  };
}

module.exports = createBaseEach;


/***/ }),
/* 570 */
/***/ (function(module, exports) {

/**
 * Creates a base function for methods like `_.forIn` and `_.forOwn`.
 *
 * @private
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {Function} Returns the new base function.
 */
function createBaseFor(fromRight) {
  return function(object, iteratee, keysFunc) {
    var index = -1,
        iterable = Object(object),
        props = keysFunc(object),
        length = props.length;

    while (length--) {
      var key = props[fromRight ? length : ++index];
      if (iteratee(iterable[key], key, iterable) === false) {
        break;
      }
    }
    return object;
  };
}

module.exports = createBaseFor;


/***/ }),
/* 571 */
/***/ (function(module, exports, __webpack_require__) {

var baseOrderBy = __webpack_require__(582),
    isArray = __webpack_require__(12);

/**
 * This method is like `_.sortBy` except that it allows specifying the sort
 * orders of the iteratees to sort by. If `orders` is unspecified, all values
 * are sorted in ascending order. Otherwise, specify an order of "desc" for
 * descending or "asc" for ascending sort order of corresponding values.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Array[]|Function[]|Object[]|string[]} [iteratees=[_.identity]]
 *  The iteratees to sort by.
 * @param {string[]} [orders] The sort orders of `iteratees`.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
 * @returns {Array} Returns the new sorted array.
 * @example
 *
 * var users = [
 *   { 'user': 'fred',   'age': 48 },
 *   { 'user': 'barney', 'age': 34 },
 *   { 'user': 'fred',   'age': 40 },
 *   { 'user': 'barney', 'age': 36 }
 * ];
 *
 * // Sort by `user` in ascending order and by `age` in descending order.
 * _.orderBy(users, ['user', 'age'], ['asc', 'desc']);
 * // => objects for [['barney', 36], ['barney', 34], ['fred', 48], ['fred', 40]]
 */
function orderBy(collection, iteratees, orders, guard) {
  if (collection == null) {
    return [];
  }
  if (!isArray(iteratees)) {
    iteratees = iteratees == null ? [] : [iteratees];
  }
  orders = guard ? undefined : orders;
  if (!isArray(orders)) {
    orders = orders == null ? [] : [orders];
  }
  return baseOrderBy(collection, iteratees, orders);
}

module.exports = orderBy;


/***/ }),
/* 572 */,
/* 573 */,
/* 574 */,
/* 575 */,
/* 576 */,
/* 577 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__);


__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default.a.register({"lock":{"width":1152,"height":1792,"paths":[{"d":"M320 768h512v-192q0-106-75-181t-181-75-181 75-75 181v192zM1152 864v576q0 40-28 68t-68 28h-960q-40 0-68-28t-28-68v-576q0-40 28-68t68-28h32v-192q0-184 132-316t316-132 316 132 132 316v192h32q40 0 68 28t28 68z"}]}})


/***/ }),
/* 578 */,
/* 579 */,
/* 580 */,
/* 581 */
/***/ (function(module, exports, __webpack_require__) {

var baseEach = __webpack_require__(566),
    isArrayLike = __webpack_require__(71);

/**
 * The base implementation of `_.map` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function baseMap(collection, iteratee) {
  var index = -1,
      result = isArrayLike(collection) ? Array(collection.length) : [];

  baseEach(collection, function(value, key, collection) {
    result[++index] = iteratee(value, key, collection);
  });
  return result;
}

module.exports = baseMap;


/***/ }),
/* 582 */
/***/ (function(module, exports, __webpack_require__) {

var arrayMap = __webpack_require__(72),
    baseIteratee = __webpack_require__(29),
    baseMap = __webpack_require__(581),
    baseSortBy = __webpack_require__(583),
    baseUnary = __webpack_require__(143),
    compareMultiple = __webpack_require__(585),
    identity = __webpack_require__(24);

/**
 * The base implementation of `_.orderBy` without param guards.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function[]|Object[]|string[]} iteratees The iteratees to sort by.
 * @param {string[]} orders The sort orders of `iteratees`.
 * @returns {Array} Returns the new sorted array.
 */
function baseOrderBy(collection, iteratees, orders) {
  var index = -1;
  iteratees = arrayMap(iteratees.length ? iteratees : [identity], baseUnary(baseIteratee));

  var result = baseMap(collection, function(value, key, collection) {
    var criteria = arrayMap(iteratees, function(iteratee) {
      return iteratee(value);
    });
    return { 'criteria': criteria, 'index': ++index, 'value': value };
  });

  return baseSortBy(result, function(object, other) {
    return compareMultiple(object, other, orders);
  });
}

module.exports = baseOrderBy;


/***/ }),
/* 583 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.sortBy` which uses `comparer` to define the
 * sort order of `array` and replaces criteria objects with their corresponding
 * values.
 *
 * @private
 * @param {Array} array The array to sort.
 * @param {Function} comparer The function to define sort order.
 * @returns {Array} Returns `array`.
 */
function baseSortBy(array, comparer) {
  var length = array.length;

  array.sort(comparer);
  while (length--) {
    array[length] = array[length].value;
  }
  return array;
}

module.exports = baseSortBy;


/***/ }),
/* 584 */
/***/ (function(module, exports, __webpack_require__) {

var isSymbol = __webpack_require__(16);

/**
 * Compares values to sort them in ascending order.
 *
 * @private
 * @param {*} value The value to compare.
 * @param {*} other The other value to compare.
 * @returns {number} Returns the sort order indicator for `value`.
 */
function compareAscending(value, other) {
  if (value !== other) {
    var valIsDefined = value !== undefined,
        valIsNull = value === null,
        valIsReflexive = value === value,
        valIsSymbol = isSymbol(value);

    var othIsDefined = other !== undefined,
        othIsNull = other === null,
        othIsReflexive = other === other,
        othIsSymbol = isSymbol(other);

    if ((!othIsNull && !othIsSymbol && !valIsSymbol && value > other) ||
        (valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol) ||
        (valIsNull && othIsDefined && othIsReflexive) ||
        (!valIsDefined && othIsReflexive) ||
        !valIsReflexive) {
      return 1;
    }
    if ((!valIsNull && !valIsSymbol && !othIsSymbol && value < other) ||
        (othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol) ||
        (othIsNull && valIsDefined && valIsReflexive) ||
        (!othIsDefined && valIsReflexive) ||
        !othIsReflexive) {
      return -1;
    }
  }
  return 0;
}

module.exports = compareAscending;


/***/ }),
/* 585 */
/***/ (function(module, exports, __webpack_require__) {

var compareAscending = __webpack_require__(584);

/**
 * Used by `_.orderBy` to compare multiple properties of a value to another
 * and stable sort them.
 *
 * If `orders` is unspecified, all values are sorted in ascending order. Otherwise,
 * specify an order of "desc" for descending or "asc" for ascending sort order
 * of corresponding values.
 *
 * @private
 * @param {Object} object The object to compare.
 * @param {Object} other The other object to compare.
 * @param {boolean[]|string[]} orders The order to sort by for each property.
 * @returns {number} Returns the sort order indicator for `object`.
 */
function compareMultiple(object, other, orders) {
  var index = -1,
      objCriteria = object.criteria,
      othCriteria = other.criteria,
      length = objCriteria.length,
      ordersLength = orders.length;

  while (++index < length) {
    var result = compareAscending(objCriteria[index], othCriteria[index]);
    if (result) {
      if (index >= ordersLength) {
        return result;
      }
      var order = orders[index];
      return result * (order == 'desc' ? -1 : 1);
    }
  }
  // Fixes an `Array#sort` bug in the JS engine embedded in Adobe applications
  // that causes it, under certain circumstances, to provide the same value for
  // `object` and `other`. See https://github.com/jashkenas/underscore/pull/1247
  // for more details.
  //
  // This also ensures a stable sort in V8 and other engines.
  // See https://bugs.chromium.org/p/v8/issues/detail?id=90 for more details.
  return object.index - other.index;
}

module.exports = compareMultiple;


/***/ }),
/* 586 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMCIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA2NDkuMSAxMTkuNSIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNjQ5LjEgMTE5LjU7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4KPHN0eWxlIHR5cGU9InRleHQvY3NzIj4KCS5zdDB7ZGlzcGxheTpub25lO2ZpbGw6IzMzMzMzMzt9Cgkuc3Qxe2ZpbGw6bm9uZTtzdHJva2U6IzAwMDAwMDtzdHJva2Utd2lkdGg6MTI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0MntmaWxsOiNGRkZGRkY7fQoJLnN0M3tmaWxsOm5vbmU7c3Ryb2tlOiNGRkZGRkY7c3Ryb2tlLXdpZHRoOjEyO3N0cm9rZS1taXRlcmxpbWl0OjEwO30KCS5zdDR7ZmlsbDpub25lO3N0cm9rZTojRkZGRkZGO3N0cm9rZS13aWR0aDoxMjtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cgkuc3Q1e2ZpbGw6bm9uZTtzdHJva2U6IzNGQTlGNTtzdHJva2Utd2lkdGg6Ni45NzM1O3N0cm9rZS1taXRlcmxpbWl0OjEwO30KCS5zdDZ7ZmlsbDpub25lO3N0cm9rZTojMDAwMDAwO3N0cm9rZS13aWR0aDo2Ljk3MzU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0N3tmaWxsOm5vbmU7c3Ryb2tlOiMwMDAwMDA7c3Ryb2tlLXdpZHRoOjE5LjA4Mzg7c3Ryb2tlLW1pdGVybGltaXQ6MTA7fQoJLnN0OHtmaWxsOm5vbmU7c3Ryb2tlOiNGRkZGRkY7c3Ryb2tlLXdpZHRoOjYuOTczNTtzdHJva2UtbWl0ZXJsaW1pdDoxMDt9Cjwvc3R5bGU+CjxnPgoJPHBvbHlsaW5lIGNsYXNzPSJzdDUiIHBvaW50cz0iNjI5LjcsNjYuMiA2MjkuNyw5OC45IDU5Nyw5OC45IAkiLz4KCTxwb2x5bGluZSBjbGFzcz0ic3Q2IiBwb2ludHM9IjU5NywyMC42IDYyOS43LDIwLjYgNjI5LjcsNTMuMyAJIi8+Cgk8cG9seWxpbmUgY2xhc3M9InN0NiIgcG9pbnRzPSI1ODQuMyw5OC45IDU1MS41LDk4LjkgNTUxLjUsNjYuMiAJIi8+Cgk8cG9seWxpbmUgY2xhc3M9InN0NiIgcG9pbnRzPSI1NTEuNSw1My4zIDU1MS41LDIwLjYgNTg0LjMsMjAuNiAJIi8+CjwvZz4KPGc+Cgk8cGF0aCBkPSJNNTQuNiwzOC43djQuN0gzMi41djEzLjRoMTkuNHY0LjdIMzIuNXYxOS4zaC01LjZWMzguN0g1NC42eiIvPgoJPHBhdGggZD0iTTY1LjYsNTEuNWMwLjgtMi43LDIuMS01LDMuOC03LjFjMS43LTIsMy44LTMuNyw2LjMtNC45YzIuNS0xLjIsNS41LTEuOCw4LjgtMS44YzMuMywwLDYuMywwLjYsOC44LDEuOAoJCWMyLjUsMS4yLDQuNiwyLjksNi4zLDQuOWMxLjcsMiwzLDQuNCwzLjgsNy4xYzAuOCwyLjcsMS4zLDUuNCwxLjMsOC4zYzAsMi45LTAuNCw1LjYtMS4zLDguM2MtMC44LDIuNy0yLjEsNS0zLjgsNy4xCgkJYy0xLjcsMi0zLjgsMy43LTYuMyw0LjljLTIuNSwxLjItNS41LDEuOC04LjgsMS44Yy0zLjMsMC02LjMtMC42LTguOC0xLjhjLTIuNS0xLjItNC42LTIuOC02LjMtNC45Yy0xLjctMi0zLTQuNC0zLjgtNy4xCgkJYy0wLjgtMi43LTEuMy01LjQtMS4zLTguM0M2NC4zLDU2LjksNjQuNyw1NC4xLDY1LjYsNTEuNXogTTcwLjcsNjYuMWMwLjYsMi4xLDEuNCwzLjksMi42LDUuNnMyLjcsMyw0LjUsNGMxLjksMSw0LjEsMS41LDYuNiwxLjUKCQljMi42LDAsNC44LTAuNSw2LjYtMS41YzEuOS0xLDMuNC0yLjMsNC41LTRzMi0zLjUsMi42LTUuNmMwLjYtMi4xLDAuOC00LjIsMC44LTYuM2MwLTIuMS0wLjMtNC4yLTAuOC02LjMKCQljLTAuNi0yLjEtMS40LTMuOS0yLjYtNS42Yy0xLjItMS43LTIuNy0zLTQuNS00Yy0xLjktMS00LjEtMS41LTYuNi0xLjVjLTIuNiwwLTQuOCwwLjUtNi42LDEuNWMtMS45LDEtMy40LDIuMy00LjUsNAoJCWMtMS4yLDEuNy0yLDMuNS0yLjYsNS42Yy0wLjYsMi4xLTAuOCw0LjItMC44LDYuM0M2OS45LDYxLjksNzAuMiw2NCw3MC43LDY2LjF6Ii8+Cgk8cGF0aCBkPSJNMTQ2LjgsNzcuOGMtMi45LDIuNy03LDQtMTIuMyw0Yy01LjQsMC05LjctMS4zLTEyLjctMy45Yy0zLjEtMi42LTQuNi02LjctNC42LTEyLjNWMzguN2g1LjZ2MjYuOWMwLDMuOCwxLDYuNiwzLDguNgoJCXM0LjksMi45LDguNywyLjljMy42LDAsNi4zLTEsOC4yLTIuOWMxLjktMS45LDIuOC00LjgsMi44LTguNlYzOC43aDUuNnYyNi45QzE1MS4xLDcxLDE0OS43LDc1LjEsMTQ2LjgsNzcuOHoiLz4KCTxwYXRoIGQ9Ik0xODUuOCwzOC43YzQsMCw3LjIsMSw5LjQsM2MyLjMsMiwzLjQsNC43LDMuNCw4LjFjMCwyLjYtMC42LDQuOC0xLjcsNi43Yy0xLjIsMS45LTMsMy4yLTUuNiw0djAuMWMxLjIsMC4yLDIuMiwwLjYsMywxLjIKCQljMC44LDAuNiwxLjQsMS4yLDEuOCwyYzAuNSwwLjgsMC44LDEuNiwxLDIuNmMwLjIsMC45LDAuNCwxLjksMC41LDNjMC4xLDEsMC4xLDIuMSwwLjIsMy4xYzAsMS4xLDAuMSwyLjEsMC4zLDMuMQoJCWMwLjIsMSwwLjQsMiwwLjcsMi45YzAuMywwLjksMC43LDEuNywxLjMsMi41aC02LjNjLTAuNC0wLjQtMC43LTEtMC44LTEuOGMtMC4xLTAuNy0wLjItMS42LTAuMy0yLjVjMC0wLjktMC4xLTEuOS0wLjEtMwoJCWMwLTEuMS0wLjItMi4xLTAuNC0zLjFjLTAuMi0xLTAuNC0yLTAuNi0yLjljLTAuMi0wLjktMC42LTEuNy0xLjEtMi40Yy0wLjUtMC43LTEuMi0xLjItMi0xLjdjLTAuOC0wLjQtMS45LTAuNi0zLjMtMC42aC0xMy43djE4CgkJSDE2NlYzOC43SDE4NS44eiBNMTg3LDU3LjhjMS4yLTAuMiwyLjItMC42LDMuMS0xLjJjMC45LTAuNiwxLjYtMS4zLDIuMS0yLjNjMC41LTEsMC44LTIuMiwwLjgtMy44YzAtMi4xLTAuNi0zLjktMS44LTUuMgoJCWMtMS4yLTEuMy0zLjEtMi01LjctMmgtMTMuOXYxNC43aDExLjdDMTg0LjYsNTguMSwxODUuOCw1OCwxODcsNTcuOHoiLz4KCTxwYXRoIGQ9Ik0yMzcuOCw0NC43Yy0yLjEtMS41LTQuNy0yLjItNy42LTIuMmMtMi41LDAtNC43LDAuNS02LjUsMS40Yy0xLjgsMC45LTMuMywyLjItNC40LDMuOGMtMS4yLDEuNi0yLDMuNC0yLjYsNS41CgkJYy0wLjYsMi0wLjgsNC4yLTAuOCw2LjRjMCwyLjQsMC4zLDQuNywwLjgsNi44YzAuNiwyLjEsMS40LDQsMi42LDUuNmMxLjIsMS42LDIuNiwyLjksNC41LDMuOGMxLjgsMC45LDQsMS40LDYuNSwxLjQKCQljMS44LDAsMy41LTAuMyw0LjktMC45YzEuNC0wLjYsMi43LTEuNSwzLjctMi41YzEtMS4xLDEuOS0yLjQsMi41LTMuOWMwLjYtMS41LDAuOS0zLjEsMS4xLTQuOGg1LjZjLTAuNiw1LjMtMi40LDkuNC01LjUsMTIuNAoJCWMtMy4xLDMtNy40LDQuNC0xMi44LDQuNGMtMy4zLDAtNi4xLTAuNi04LjYtMS43cy00LjUtMi43LTYuMS00LjZjLTEuNi0yLTIuOC00LjMtMy42LTdjLTAuOC0yLjctMS4yLTUuNi0xLjItOC42CgkJYzAtMy4xLDAuNC02LDEuMy04LjdjMC45LTIuNywyLjEtNSwzLjgtNy4xYzEuNy0yLDMuOC0zLjYsNi4zLTQuOGMyLjUtMS4yLDUuNC0xLjcsOC42LTEuN2MyLjIsMCw0LjMsMC4zLDYuMywwLjkKCQljMiwwLjYsMy43LDEuNSw1LjMsMi42YzEuNSwxLjEsMi44LDIuNiwzLjgsNC4zYzEsMS43LDEuNywzLjcsMiw1LjlIMjQyQzI0MS40LDQ4LjQsMjQwLDQ2LjIsMjM3LjgsNDQuN3oiLz4KCTxwYXRoIGQ9Ik0yNTkuOCw1MS41YzAuOC0yLjcsMi4xLTUsMy44LTcuMWMxLjctMiwzLjgtMy43LDYuMy00LjljMi41LTEuMiw1LjUtMS44LDguOC0xLjhjMy4zLDAsNi4zLDAuNiw4LjgsMS44CgkJYzIuNSwxLjIsNC42LDIuOSw2LjMsNC45YzEuNywyLDMsNC40LDMuOCw3LjFjMC44LDIuNywxLjMsNS40LDEuMyw4LjNjMCwyLjktMC40LDUuNi0xLjMsOC4zYy0wLjgsMi43LTIuMSw1LTMuOCw3LjEKCQljLTEuNywyLTMuOCwzLjctNi4zLDQuOWMtMi41LDEuMi01LjUsMS44LTguOCwxLjhjLTMuMywwLTYuMy0wLjYtOC44LTEuOGMtMi41LTEuMi00LjYtMi44LTYuMy00LjljLTEuNy0yLTMtNC40LTMuOC03LjEKCQljLTAuOC0yLjctMS4zLTUuNC0xLjMtOC4zQzI1OC41LDU2LjksMjU4LjksNTQuMSwyNTkuOCw1MS41eiBNMjY1LDY2LjFjMC42LDIuMSwxLjQsMy45LDIuNiw1LjZjMS4yLDEuNywyLjcsMyw0LjUsNAoJCWMxLjgsMSw0LjEsMS41LDYuNiwxLjVjMi42LDAsNC44LTAuNSw2LjYtMS41czMuNC0yLjMsNC41LTRjMS4yLTEuNywyLTMuNSwyLjYtNS42YzAuNi0yLjEsMC44LTQuMiwwLjgtNi4zYzAtMi4xLTAuMy00LjItMC44LTYuMwoJCWMtMC42LTIuMS0xLjQtMy45LTIuNi01LjZjLTEuMi0xLjctMi43LTMtNC41LTRzLTQuMS0xLjUtNi42LTEuNWMtMi42LDAtNC44LDAuNS02LjYsMS41Yy0xLjksMS0zLjQsMi4zLTQuNSw0CgkJYy0xLjIsMS43LTIsMy41LTIuNiw1LjZjLTAuNiwyLjEtMC44LDQuMi0wLjgsNi4zQzI2NC4xLDYxLjksMjY0LjQsNjQsMjY1LDY2LjF6Ii8+Cgk8cGF0aCBkPSJNMzMxLjUsMzguN2M0LDAsNy4yLDEsOS40LDNjMi4zLDIsMy40LDQuNywzLjQsOC4xYzAsMi42LTAuNiw0LjgtMS43LDYuN2MtMS4yLDEuOS0zLDMuMi01LjYsNHYwLjFjMS4yLDAuMiwyLjIsMC42LDMsMS4yCgkJYzAuOCwwLjYsMS40LDEuMiwxLjgsMmMwLjUsMC44LDAuOCwxLjYsMSwyLjZjMC4yLDAuOSwwLjQsMS45LDAuNSwzYzAuMSwxLDAuMSwyLjEsMC4yLDMuMWMwLDEuMSwwLjEsMi4xLDAuMywzLjEKCQljMC4yLDEsMC40LDIsMC43LDIuOWMwLjMsMC45LDAuNywxLjcsMS4zLDIuNWgtNi4zYy0wLjQtMC40LTAuNy0xLTAuOC0xLjhjLTAuMS0wLjctMC4yLTEuNi0wLjMtMi41YzAtMC45LTAuMS0xLjktMC4xLTMKCQlzLTAuMi0yLjEtMC40LTMuMWMtMC4yLTEtMC40LTItMC42LTIuOWMtMC4yLTAuOS0wLjYtMS43LTEuMS0yLjRjLTAuNS0wLjctMS4yLTEuMi0yLTEuN2MtMC44LTAuNC0xLjktMC42LTMuMy0wLjZoLTEzLjd2MThoLTUuNgoJCVYzOC43SDMzMS41eiBNMzMyLjcsNTcuOGMxLjItMC4yLDIuMi0wLjYsMy4xLTEuMmMwLjktMC42LDEuNi0xLjMsMi4xLTIuM2MwLjUtMSwwLjgtMi4yLDAuOC0zLjhjMC0yLjEtMC42LTMuOS0xLjgtNS4yCgkJYy0xLjItMS4zLTMuMS0yLTUuNy0yaC0xMy45djE0LjdIMzI5QzMzMC4zLDU4LjEsMzMxLjUsNTgsMzMyLjcsNTcuOHoiLz4KCTxwYXRoIGQ9Ik0zNjMuOSwzOC43bDIyLjIsMzQuMmgwLjFWMzguN2g1LjN2NDIuMmgtNi4xbC0yMi0zMy44aC0wLjF2MzMuOEgzNThWMzguN0gzNjMuOXoiLz4KCTxwYXRoIGQ9Ik00MzUuNywzOC43djQuN2gtMjMuNXYxMy40aDIxLjl2NC43aC0yMS45djE0LjZoMjMuN3Y0LjdoLTI5LjNWMzguN0g0MzUuN3oiLz4KCTxwYXRoIGQ9Ik00NjguNCwzOC43YzQsMCw3LjIsMSw5LjQsM2MyLjMsMiwzLjQsNC43LDMuNCw4LjFjMCwyLjYtMC42LDQuOC0xLjcsNi43Yy0xLjIsMS45LTMsMy4yLTUuNiw0djAuMWMxLjIsMC4yLDIuMiwwLjYsMywxLjIKCQljMC44LDAuNiwxLjQsMS4yLDEuOCwyYzAuNSwwLjgsMC44LDEuNiwxLDIuNmMwLjIsMC45LDAuNCwxLjksMC41LDNjMC4xLDEsMC4xLDIuMSwwLjIsMy4xYzAsMS4xLDAuMSwyLjEsMC4zLDMuMQoJCWMwLjIsMSwwLjQsMiwwLjcsMi45YzAuMywwLjksMC43LDEuNywxLjMsMi41aC02LjNjLTAuNC0wLjQtMC43LTEtMC44LTEuOGMtMC4xLTAuNy0wLjItMS42LTAuMy0yLjVjMC0wLjktMC4xLTEuOS0wLjEtMwoJCXMtMC4yLTIuMS0wLjQtMy4xYy0wLjItMS0wLjQtMi0wLjYtMi45Yy0wLjItMC45LTAuNi0xLjctMS4xLTIuNGMtMC41LTAuNy0xLjItMS4yLTItMS43Yy0wLjgtMC40LTEuOS0wLjYtMy4zLTAuNmgtMTMuN3YxOGgtNS42CgkJVjM4LjdINDY4LjR6IE00NjkuNiw1Ny44YzEuMi0wLjIsMi4yLTAuNiwzLjEtMS4yYzAuOS0wLjYsMS42LTEuMywyLjEtMi4zYzAuNS0xLDAuOC0yLjIsMC44LTMuOGMwLTIuMS0wLjYtMy45LTEuOC01LjIKCQljLTEuMi0xLjMtMy4xLTItNS43LTJoLTEzLjl2MTQuN2gxMS43QzQ2Ny4xLDU4LjEsNDY4LjQsNTgsNDY5LjYsNTcuOHoiLz4KCTxwYXRoIGQ9Ik01MTYsNDQuNWMtMS45LTEuNC00LjMtMi03LjItMmMtMS4yLDAtMi4zLDAuMS0zLjUsMC40cy0yLjIsMC42LTMsMS4yYy0wLjksMC42LTEuNiwxLjMtMi4xLDIuMmMtMC41LDAuOS0wLjgsMi4xLTAuOCwzLjUKCQljMCwxLjMsMC40LDIuNCwxLjIsMy4yYzAuOCwwLjgsMS44LDEuNSwzLjEsMmMxLjMsMC41LDIuNywwLjksNC4zLDEuM2MxLjYsMC4zLDMuMywwLjcsNC45LDEuMWMxLjcsMC40LDMuMywwLjksNC45LDEuNAoJCWMxLjYsMC41LDMuMSwxLjMsNC4zLDIuMmMxLjMsMC45LDIuMywyLDMuMSwzLjRjMC44LDEuNCwxLjIsMy4xLDEuMiw1LjJjMCwyLjItMC41LDQuMi0xLjUsNS44Yy0xLDEuNi0yLjMsMi45LTMuOSwzLjkKCQljLTEuNiwxLTMuMywxLjctNS4zLDIuMmMtMS45LDAuNS0zLjksMC43LTUuOCwwLjdjLTIuNCwwLTQuNi0wLjMtNi43LTAuOWMtMi4xLTAuNi00LTEuNS01LjYtMi43Yy0xLjYtMS4yLTIuOS0yLjctMy44LTQuNgoJCWMtMC45LTEuOS0xLjQtNC4xLTEuNC02LjZoNS4zYzAsMS44LDAuMywzLjMsMSw0LjZjMC43LDEuMywxLjYsMi4zLDIuNywzLjJjMS4xLDAuOCwyLjQsMS40LDMuOSwxLjhjMS41LDAuNCwzLDAuNiw0LjYsMC42CgkJYzEuMywwLDIuNS0wLjEsMy44LTAuNGMxLjMtMC4yLDIuNC0wLjYsMy41LTEuMmMxLTAuNiwxLjktMS4zLDIuNS0yLjNjMC42LTEsMC45LTIuMiwwLjktMy44YzAtMS41LTAuNC0yLjYtMS4yLTMuNQoJCWMtMC44LTAuOS0xLjgtMS42LTMuMS0yLjJjLTEuMy0wLjYtMi43LTEtNC4zLTEuNGMtMS42LTAuNC0zLjMtMC43LTQuOS0xLjFjLTEuNy0wLjQtMy4zLTAuOC00LjktMS4zYy0xLjYtMC41LTMuMS0xLjEtNC4zLTEuOQoJCWMtMS4zLTAuOC0yLjMtMS45LTMuMS0zLjFjLTAuOC0xLjMtMS4yLTIuOS0xLjItNC44YzAtMi4xLDAuNC00LDEuMy01LjVjMC45LTEuNiwyLTIuOCwzLjUtMy44YzEuNC0xLDMuMS0xLjgsNC45LTIuMgoJCWMxLjgtMC41LDMuNy0wLjcsNS42LTAuN2MyLjIsMCw0LjIsMC4zLDYsMC44YzEuOCwwLjUsMy41LDEuMyw0LjksMi40YzEuNCwxLjEsMi41LDIuNSwzLjMsNC4yYzAuOCwxLjcsMS4yLDMuNywxLjMsNmgtNS4zCgkJQzUxOSw0OCw1MTcuOSw0NS44LDUxNiw0NC41eiIvPgo8L2c+Cjwvc3ZnPgo="

/***/ }),
/* 587 */,
/* 588 */,
/* 589 */,
/* 590 */,
/* 591 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__);


__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default.a.register({"angle-right":{"width":640,"height":1792,"paths":[{"d":"M595 960q0 13-10 23l-466 466q-10 10-23 10t-23-10l-50-50q-10-10-10-23t10-23l393-393-393-393q-10-10-10-23t10-23l50-50q10-10 23-10t23 10l466 466q10 10 10 23z"}]}})


/***/ }),
/* 592 */,
/* 593 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_startsWith__ = __webpack_require__(498);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_startsWith___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_startsWith__);




/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'video-embed',
  props: ['contentType', 'videoSrc'],
  computed: {
    type: function type() {
      if (this.contentType === 'webinar') {
        return 'live';
      } else {
        return 'default';
      }
    },
    href: function href() {
      return 'http://youtube.com/watch?v=' + this.videoSrc;
    },
    src: function src() {
      switch (this.type) {
        case 'default':
          return 'https://www.youtube.com/embed/' + this.videoSrc;
          break;
        case 'live':
          return __WEBPACK_IMPORTED_MODULE_0_lodash_startsWith___default()(this.videoSrc, 'http') ? this.videoSrc : 'https://www.youtube.com/embed/' + this.videoSrc;
          break;
        default:
          return this.videoSrc;
      }
    }
  }
});

/***/ }),
/* 594 */,
/* 595 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'four-corners-link',
  props: ['message']
});

/***/ }),
/* 596 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".video-wrapper .video-container[data-v-22d732ae]{margin-bottom:20px;position:relative;padding-bottom:56.25%;height:0;overflow:hidden;max-width:100%}.video-wrapper .video-container embed[data-v-22d732ae],.video-wrapper .video-container iframe[data-v-22d732ae],.video-wrapper .video-container object[data-v-22d732ae]{position:absolute;top:0;left:0;width:100%;height:100%}", "", {"version":3,"sources":["/root/connectedacademy/src/components/VideoEmbed.vue"],"names":[],"mappings":"AACA,iDACE,mBAAoB,AACpB,kBAAmB,AACnB,sBAAuB,AACvB,SAAU,AACV,gBAAiB,AACjB,cAAgB,CACjB,AACD,uKAGE,kBAAmB,AACnB,MAAO,AACP,OAAQ,AACR,WAAY,AACZ,WAAa,CACd","file":"VideoEmbed.vue","sourcesContent":["\n.video-wrapper .video-container[data-v-22d732ae] {\n  margin-bottom: 20px;\n  position: relative;\n  padding-bottom: 56.25%;\n  height: 0;\n  overflow: hidden;\n  max-width: 100%;\n}\n.video-wrapper .video-container iframe[data-v-22d732ae],\n.video-wrapper .video-container object[data-v-22d732ae],\n.video-wrapper .video-container embed[data-v-22d732ae] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 597 */,
/* 598 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width{display:block;margin-bottom:10px}.pure-button.pure-button-primary{background-color:#29b474;color:#fff}.pure-button.pure-button-primary:hover{background-color:#25a268}.pure-button.pure-button-white{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success{background-color:#29b474;color:#fff}.pure-button.pure-button-success:hover{background-color:#25a268}.pure-button.pure-button-twitter{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter:hover{background-color:#2088ff}.pure-button.pure-button-subtle{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text{border-color:transparent}.pure-button.pure-button-homework{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework:hover{background-color:#fd3c51;color:#fff}body,html{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left{float:left}.pull-right{float:right}.clearfix{clear:both;float:none}.fa-icon{width:auto;height:1em}.no-margin{margin:0!important}.no-padding{padding:0!important}.background-white{background-color:#fff!important}.text-white{color:#fff}.fade-enter-active,.fade-leave-active{transition:opacity .2s}.fade-enter,.fade-leave-to{opacity:0}.fade-enter-to,.fade-leave{opacity:1}.main-container{border-radius:4px;position:relative}.main-container.main-container-padded{padding:20px}.content-block{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block{background-color:#fff}.icon-margin{margin:0 5px}.four-corners-link{border-radius:6px;background-color:#f9f9f9;border:1px solid #e9e9e9;overflow:hidden;margin:20px 0}.four-corners-link .four-corners-link--body{border-bottom:1px solid #e9e9e9;height:32px;padding:10px}.four-corners-link .four-corners-link--body img{height:32px}.four-corners-link .four-corners-link--footer{padding:15px}.four-corners-link .four-corners-link--footer h1,.four-corners-link .four-corners-link--footer p{color:#000}.four-corners-link .four-corners-link--footer p{margin:0;padding:0;padding:0 0 20px}", "", {"version":3,"sources":["/root/connectedacademy/src/components/fourcorners/FourCornersLink.vue"],"names":[],"mappings":"AACA,aACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,mBACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,wBACE,cAAe,AACf,kBAAoB,CACrB,AACD,iCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,uCACE,wBAA0B,CAC3B,AACD,+BACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,qCACE,+BAAkC,CACnC,AACD,iCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,uCACE,wBAA0B,CAC3B,AACD,iCACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,uCACE,wBAA0B,CAC3B,AACD,gCACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,8BACE,wBAA0B,CAC3B,AACD,kCACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,wCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,UAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,WACE,UAAY,CACb,AACD,YACE,WAAa,CACd,AACD,UACE,WAAY,AACZ,UAAY,CACb,AACD,SACE,WAAY,AACZ,UAAY,CACb,AACD,WACE,kBAAqB,CACtB,AACD,YACE,mBAAsB,CACvB,AACD,kBACE,+BAAkC,CACnC,AACD,YACE,UAAY,CACb,AACD,sCAEE,sBAAyB,CAC1B,AACD,2BAEE,SAAW,CACZ,AACD,2BAEE,SAAW,CACZ,AACD,gBACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,sCACE,YAAc,CACf,AACD,eACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,2BACE,qBAAuB,CACxB,AACD,aACE,YAAc,CACf,AACD,mBACE,kBAAmB,AACnB,yBAA0B,AAC1B,yBAA0B,AAC1B,gBAAiB,AACjB,aAAe,CAChB,AACD,4CACE,gCAAiC,AACjC,YAAa,AACb,YAAc,CACf,AACD,gDACE,WAAa,CACd,AACD,8CACE,YAAc,CACf,AACD,iGAEE,UAAY,CACb,AACD,gDACE,SAAU,AACV,UAAW,AACX,gBAAsB,CACvB","file":"FourCornersLink.vue","sourcesContent":["\n.pure-button {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml,\nbody {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left {\n  float: left;\n}\n.pull-right {\n  float: right;\n}\n.clearfix {\n  clear: both;\n  float: none;\n}\n.fa-icon {\n  width: auto;\n  height: 1em;\n}\n.no-margin {\n  margin: 0 !important;\n}\n.no-padding {\n  padding: 0 !important;\n}\n.background-white {\n  background-color: #fff !important;\n}\n.text-white {\n  color: #fff;\n}\n.fade-enter-active,\n.fade-leave-active {\n  transition: opacity 0.2s;\n}\n.fade-enter,\n.fade-leave-to {\n  opacity: 0;\n}\n.fade-enter-to,\n.fade-leave {\n  opacity: 1;\n}\n.main-container {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded {\n  padding: 20px;\n}\n.content-block {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block {\n  background-color: #fff;\n}\n.icon-margin {\n  margin: 0 5px;\n}\n.four-corners-link {\n  border-radius: 6px;\n  background-color: #f9f9f9;\n  border: #e9e9e9 1px solid;\n  overflow: hidden;\n  margin: 20px 0;\n}\n.four-corners-link .four-corners-link--body {\n  border-bottom: #e9e9e9 1px solid;\n  height: 32px;\n  padding: 10px;\n}\n.four-corners-link .four-corners-link--body img {\n  height: 32px;\n}\n.four-corners-link .four-corners-link--footer {\n  padding: 15px;\n}\n.four-corners-link .four-corners-link--footer h1,\n.four-corners-link .four-corners-link--footer p {\n  color: #000;\n}\n.four-corners-link .four-corners-link--footer p {\n  margin: 0;\n  padding: 0;\n  padding: 0px 0 20px 0;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 599 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(596);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("17c7f754", content, true);

/***/ }),
/* 600 */,
/* 601 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(598);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("77bec712", content, true);

/***/ }),
/* 602 */
/***/ (function(module, exports, __webpack_require__) {

var baseEach = __webpack_require__(566);

/**
 * The base implementation of `_.filter` without support for iteratee shorthands.
 *
 * @private
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} predicate The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 */
function baseFilter(collection, predicate) {
  var result = [];
  baseEach(collection, function(value, index, collection) {
    if (predicate(value, index, collection)) {
      result.push(value);
    }
  });
  return result;
}

module.exports = baseFilter;


/***/ }),
/* 603 */
/***/ (function(module, exports, __webpack_require__) {

var arrayFilter = __webpack_require__(146),
    baseFilter = __webpack_require__(602),
    baseIteratee = __webpack_require__(29),
    isArray = __webpack_require__(12);

/**
 * Iterates over elements of `collection`, returning an array of all elements
 * `predicate` returns truthy for. The predicate is invoked with three
 * arguments: (value, index|key, collection).
 *
 * **Note:** Unlike `_.remove`, this method returns a new array.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Collection
 * @param {Array|Object} collection The collection to iterate over.
 * @param {Function} [predicate=_.identity] The function invoked per iteration.
 * @returns {Array} Returns the new filtered array.
 * @see _.reject
 * @example
 *
 * var users = [
 *   { 'user': 'barney', 'age': 36, 'active': true },
 *   { 'user': 'fred',   'age': 40, 'active': false }
 * ];
 *
 * _.filter(users, function(o) { return !o.active; });
 * // => objects for ['fred']
 *
 * // The `_.matches` iteratee shorthand.
 * _.filter(users, { 'age': 36, 'active': true });
 * // => objects for ['barney']
 *
 * // The `_.matchesProperty` iteratee shorthand.
 * _.filter(users, ['active', false]);
 * // => objects for ['fred']
 *
 * // The `_.property` iteratee shorthand.
 * _.filter(users, 'active');
 * // => objects for ['barney']
 */
function filter(collection, predicate) {
  var func = isArray(collection) ? arrayFilter : baseFilter;
  return func(collection, baseIteratee(predicate, 3));
}

module.exports = filter;


/***/ }),
/* 604 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 605 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/lake.78527af.jpg";

/***/ }),
/* 606 */
/***/ (function(module, exports) {

module.exports = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0OTkuNTEiIGhlaWdodD0iNDQuMTEiIHZpZXdCb3g9IjAgMCA0OTkuNTEgNDQuMTEiPgogIDx0aXRsZT53aGl0ZS10ZXh0PC90aXRsZT4KICA8Zz4KICAgIDxwYXRoIGQ9Ik01NS4zNiwyMjcuN3Y0LjcySDMzLjI3djEzLjRINTIuNjR2NC43MkgzMy4yN3YxOS4zMUgyNy42NlYyMjcuN0g1NS4zNloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNy42NiAtMjI2LjY5KSIgc3R5bGU9ImZpbGw6ICNmZmYiLz4KICAgIDxwYXRoIGQ9Ik02Ni4zNywyNDAuNDhhMjAuOSwyMC45LDAsMCwxLDMuODEtNy4wNiwxOC42LDE4LjYsMCwwLDEsNi4zMi00LjksMjAsMjAsMCwwLDEsOC44LTEuODMsMjAsMjAsMCwwLDEsOC44LDEuODMsMTguNjEsMTguNjEsMCwwLDEsNi4zMiw0LjksMjAuOTQsMjAuOTQsMCwwLDEsMy44MSw3LjA2LDI3Ljc0LDI3Ljc0LDAsMCwxLDAsMTYuNTksMjAuOTMsMjAuOTMsMCwwLDEtMy44MSw3LjA2QTE4LjI4LDE4LjI4LDAsMCwxLDk0LjEsMjY5YTIwLjI0LDIwLjI0LDAsMCwxLTguOCwxLjgsMjAuMjQsMjAuMjQsMCwwLDEtOC44LTEuOCwxOC4yNiwxOC4yNiwwLDAsMS02LjMyLTQuODcsMjAuOSwyMC45LDAsMCwxLTMuODEtNy4wNkEyNy43NCwyNy43NCwwLDAsMSw2Ni4zNywyNDAuNDhabTUuMTcsMTQuNTlhMTcuMDcsMTcuMDcsMCwwLDAsMi42LDUuNTgsMTMuMjgsMTMuMjgsMCwwLDAsNC41NSw0LDE1LjI4LDE1LjI4LDAsMCwwLDEzLjIzLDAsMTMuMjksMTMuMjksMCwwLDAsNC41NS00LDE3LjA5LDE3LjA5LDAsMCwwLDIuNi01LjU4LDI0LjMzLDI0LjMzLDAsMCwwLDAtMTIuNTgsMTcuMDksMTcuMDksMCwwLDAtMi42LTUuNTgsMTMuMjksMTMuMjksMCwwLDAtNC41NS00LDE1LjI4LDE1LjI4LDAsMCwwLTEzLjIzLDAsMTMuMjgsMTMuMjgsMCwwLDAtNC41NSw0LDE3LjA3LDE3LjA3LDAsMCwwLTIuNiw1LjU4QTI0LjMzLDI0LjMzLDAsMCwwLDcxLjU0LDI1NS4wN1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNy42NiAtMjI2LjY5KSIgc3R5bGU9ImZpbGw6ICNmZmYiLz4KICAgIDxwYXRoIGQ9Ik0xNDcuNiwyNjYuNzZxLTQuMzEsNC0xMi4yOCw0LTguMTUsMC0xMi43My0zLjg3VDExOCwyNTQuNjNWMjI3LjdoNS42MXYyNi45M3EwLDUuNjcsMyw4LjU5dDguNjgsMi45MnE1LjM3LDAsOC4xOC0yLjkydDIuODEtOC41OVYyMjcuN2g1LjYxdjI2LjkzUTE1MS45MSwyNjIuNzIsMTQ3LjYsMjY2Ljc2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3LjY2IC0yMjYuNjkpIiBzdHlsZT0iZmlsbDogI2ZmZiIvPgogICAgPHBhdGggZD0iTTE4Ni42MywyMjcuN3E2LDAsOS40MiwzYTEwLjE2LDEwLjE2LDAsMCwxLDMuNCw4LjA5LDEyLjgsMTIuOCwwLDAsMS0xLjc0LDYuNzMsOSw5LDAsMCwxLTUuNTgsNHYwLjEyYTcuNTEsNy41MSwwLDAsMSwzLDEuMTgsNi40OSw2LjQ5LDAsMCwxLDEuODMsMiw5LDksMCwwLDEsMSwyLjU3LDI3LjM0LDI3LjM0LDAsMCwxLC41LDNxMC4xMiwxLjU0LjE4LDMuMTNhMjYuODUsMjYuODUsMCwwLDAsLjMsMy4xMywxOS4xMiwxOS4xMiwwLDAsMCwuNjgsMi45Miw3LjIsNy4yLDAsMCwwLDEuMzMsMi40NWgtNi4yNmEzLjUxLDMuNTEsMCwwLDEtLjgtMS43NywxOCwxOCwwLDAsMS0uMjctMi41MXEtMC4wNi0xLjM5LS4xMi0zYTIwLjY5LDIwLjY5LDAsMCwwLS4zNS0zLjEzcS0wLjI0LTEuNTMtLjU5LTIuOTJhNi44Nyw2Ljg3LDAsMCwwLTEuMTItMi40Miw1LjU1LDUuNTUsMCwwLDAtMi0xLjY1LDcuNDUsNy40NSwwLDAsMC0zLjMxLS42MkgxNzIuNHYxOGgtNS42MVYyMjcuN2gxOS44NFptMS4xOCwxOS4xM2E4LjExLDguMTEsMCwwLDAsMy4xLTEuMTUsNi4yOSw2LjI5LDAsMCwwLDIuMTMtMi4zLDcuNzMsNy43MywwLDAsMCwuOC0zLjc1LDcuNTYsNy41NiwwLDAsMC0xLjc3LTUuMnEtMS43Ny0yLTUuNzMtMkgxNzIuNHYxNC43aDExLjY5QTIyLjU3LDIyLjU3LDAsMCwwLDE4Ny44MSwyNDYuODNaIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjcuNjYgLTIyNi42OSkiIHN0eWxlPSJmaWxsOiAjZmZmIi8+CiAgICA8cGF0aCBkPSJNMjM4LjYyLDIzMy42NmExMywxMywwLDAsMC03LjY1LTIuMjQsMTMuNywxMy43LDAsMCwwLTYuNDcsMS40MiwxMi43NCwxMi43NCwwLDAsMC00LjQzLDMuODEsMTYuNDIsMTYuNDIsMCwwLDAtMi41Nyw1LjQ2LDI0LjQsMjQuNCwwLDAsMC0uODMsNi4zOCwyNy4yOSwyNy4yOSwwLDAsMCwuODMsNi44MiwxNi4yOSwxNi4yOSwwLDAsMCwyLjU3LDUuNjEsMTIuNjcsMTIuNjcsMCwwLDAsNC40NiwzLjgxLDEzLjg4LDEzLjg4LDAsMCwwLDYuNSwxLjQyLDEyLjUxLDEyLjUxLDAsMCwwLDQuOTMtLjkyLDExLjE1LDExLjE1LDAsMCwwLDMuNzItMi41NCwxMS42NywxMS42NywwLDAsMCwyLjQ1LTMuODdBMTYuMDcsMTYuMDcsMCwwLDAsMjQzLjIsMjU0aDUuNjFxLTAuODMsOC01LjQ5LDEyLjR0LTEyLjc2LDQuNDNhMjAuMzIsMjAuMzIsMCwwLDEtOC41Ni0xLjY4LDE2LjgsMTYuOCwwLDAsMS02LjA4LTQuNjQsMTkuODgsMTkuODgsMCwwLDEtMy42My03LDI5LjcxLDI5LjcxLDAsMCwxLTEuMjEtOC42MiwyOC4xMywyOC4xMywwLDAsMSwxLjMtOC42NSwyMC44MywyMC44MywwLDAsMSwzLjgxLTcuMDYsMTcuNzUsMTcuNzUsMCwwLDEsNi4yNi00Ljc1LDIwLjE5LDIwLjE5LDAsMCwxLDguNTktMS43NCwyMS42OCwyMS42OCwwLDAsMSw2LjI2Ljg5LDE2Ljg1LDE2Ljg1LDAsMCwxLDUuMjYsMi42LDE0LjYzLDE0LjYzLDAsMCwxLDMuODQsNC4yOCwxNS43MiwxNS43MiwwLDAsMSwyLDUuOTRoLTUuNjFBMTAuNDQsMTAuNDQsMCwwLDAsMjM4LjYyLDIzMy42NloiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNy42NiAtMjI2LjY5KSIgc3R5bGU9ImZpbGw6ICNmZmYiLz4KICAgIDxwYXRoIGQ9Ik0yNjAuNTksMjQwLjQ4YTIwLjg5LDIwLjg5LDAsMCwxLDMuODEtNy4wNiwxOC42LDE4LjYsMCwwLDEsNi4zMi00LjksMjIuMDYsMjIuMDYsMCwwLDEsMTcuNiwwLDE4LjYyLDE4LjYyLDAsMCwxLDYuMzIsNC45LDIwLjkyLDIwLjkyLDAsMCwxLDMuODEsNy4wNiwyNy43NCwyNy43NCwwLDAsMSwwLDE2LjU5LDIwLjkxLDIwLjkxLDAsMCwxLTMuODEsNy4wNiwxOC4yOCwxOC4yOCwwLDAsMS02LjMyLDQuODcsMjIuMzksMjIuMzksMCwwLDEtMTcuNiwwLDE4LjI2LDE4LjI2LDAsMCwxLTYuMzItNC44NywyMC44OCwyMC44OCwwLDAsMS0zLjgxLTcuMDZBMjcuNzQsMjcuNzQsMCwwLDEsMjYwLjU5LDI0MC40OFptNS4xNywxNC41OWExNy4wOCwxNy4wOCwwLDAsMCwyLjYsNS41OCwxMy4yOCwxMy4yOCwwLDAsMCw0LjU1LDQsMTUuMjcsMTUuMjcsMCwwLDAsMTMuMjMsMCwxMy4yOCwxMy4yOCwwLDAsMCw0LjU1LTQsMTcuMDgsMTcuMDgsMCwwLDAsMi42LTUuNTgsMjQuMzIsMjQuMzIsMCwwLDAsMC0xMi41OCwxNy4wOCwxNy4wOCwwLDAsMC0yLjYtNS41OCwxMy4yOCwxMy4yOCwwLDAsMC00LjU1LTQsMTUuMjcsMTUuMjcsMCwwLDAtMTMuMjMsMCwxMy4yOCwxMy4yOCwwLDAsMC00LjU1LDQsMTcuMDgsMTcuMDgsMCwwLDAtMi42LDUuNThBMjQuMzIsMjQuMzIsMCwwLDAsMjY1Ljc2LDI1NS4wN1oiIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0yNy42NiAtMjI2LjY5KSIgc3R5bGU9ImZpbGw6ICNmZmYiLz4KICAgIDxwYXRoIGQ9Ik0zMzIuMzEsMjI3LjdxNiwwLDkuNDIsM2ExMC4xNywxMC4xNywwLDAsMSwzLjQsOC4wOSwxMi44LDEyLjgsMCwwLDEtMS43NCw2LjczLDksOSwwLDAsMS01LjU4LDR2MC4xMmE3LjUyLDcuNTIsMCwwLDEsMywxLjE4LDYuNDksNi40OSwwLDAsMSwxLjgzLDIsOSw5LDAsMCwxLDEsMi41NywyNy4zNCwyNy4zNCwwLDAsMSwuNSwzcTAuMTIsMS41NC4xOCwzLjEzYTI3LjE3LDI3LjE3LDAsMCwwLC4yOSwzLjEzLDE5LjA3LDE5LjA3LDAsMCwwLC42OCwyLjkyLDcuMjEsNy4yMSwwLDAsMCwxLjMzLDIuNDVoLTYuMjZhMy41MSwzLjUxLDAsMCwxLS44LTEuNzcsMTguMTYsMTguMTYsMCwwLDEtLjI3LTIuNTFxLTAuMDYtMS4zOS0uMTItM2EyMC41LDIwLjUsMCwwLDAtLjM1LTMuMTNxLTAuMjQtMS41My0uNTktMi45MmE2Ljg4LDYuODgsMCwwLDAtMS4xMi0yLjQyLDUuNTYsNS41NiwwLDAsMC0yLTEuNjUsNy40NSw3LjQ1LDAsMCwwLTMuMzEtLjYyaC0xMy43djE4aC01LjYxVjIyNy43aDE5Ljg0Wm0xLjE4LDE5LjEzYTguMTEsOC4xMSwwLDAsMCwzLjEtMS4xNSw2LjMsNi4zLDAsMCwwLDIuMTMtMi4zLDcuNzQsNy43NCwwLDAsMCwuOC0zLjc1LDcuNTcsNy41NywwLDAsMC0xLjc3LTUuMnEtMS43Ny0yLTUuNzMtMkgzMTguMDd2MTQuN2gxMS42OUEyMi41NiwyMi41NiwwLDAsMCwzMzMuNDksMjQ2LjgzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3LjY2IC0yMjYuNjkpIiBzdHlsZT0iZmlsbDogI2ZmZiIvPgogICAgPHBhdGggZD0iTTM2NC43MywyMjcuN2wyMi4yLDM0LjE5SDM4N1YyMjcuN2g1LjMydjQyLjE2aC02LjE0bC0yMi0zMy44NGgtMC4xMnYzMy44NGgtNS4zMVYyMjcuN2g2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3LjY2IC0yMjYuNjkpIiBzdHlsZT0iZmlsbDogI2ZmZiIvPgogICAgPHBhdGggZD0iTTQzNi40NywyMjcuN3Y0LjcySDQxM3YxMy40aDIxLjkxdjQuNzJINDEzdjE0LjU5aDIzLjY4djQuNzJINDA3LjM2VjIyNy43aDI5LjExWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3LjY2IC0yMjYuNjkpIiBzdHlsZT0iZmlsbDogI2ZmZiIvPgogICAgPHBhdGggZD0iTTQ2OS4xOSwyMjcuN3E2LDAsOS40MiwzYTEwLjE3LDEwLjE3LDAsMCwxLDMuNCw4LjA5LDEyLjgsMTIuOCwwLDAsMS0xLjc0LDYuNzMsOSw5LDAsMCwxLTUuNTgsNHYwLjEyYTcuNTIsNy41MiwwLDAsMSwzLDEuMTgsNi40OSw2LjQ5LDAsMCwxLDEuODMsMiw5LDksMCwwLDEsMSwyLjU3LDI3LjM0LDI3LjM0LDAsMCwxLC41LDNxMC4xMiwxLjU0LjE4LDMuMTNhMjcuMTcsMjcuMTcsMCwwLDAsLjI5LDMuMTMsMTkuMDcsMTkuMDcsMCwwLDAsLjY4LDIuOTIsNy4yMSw3LjIxLDAsMCwwLDEuMzMsMi40NWgtNi4yNmEzLjUxLDMuNTEsMCwwLDEtLjgtMS43NywxOC4xNiwxOC4xNiwwLDAsMS0uMjctMi41MXEtMC4wNi0xLjM5LS4xMi0zYTIwLjUsMjAuNSwwLDAsMC0uMzUtMy4xM3EtMC4yNC0xLjUzLS41OS0yLjkyYTYuODgsNi44OCwwLDAsMC0xLjEyLTIuNDIsNS41Niw1LjU2LDAsMCwwLTItMS42NSw3LjQ1LDcuNDUsMCwwLDAtMy4zMS0uNjJINDU1djE4aC01LjYxVjIyNy43aDE5Ljg0Wm0xLjE4LDE5LjEzYTguMTEsOC4xMSwwLDAsMCwzLjEtMS4xNSw2LjMsNi4zLDAsMCwwLDIuMTMtMi4zLDcuNzQsNy43NCwwLDAsMCwuOC0zLjc1LDcuNTcsNy41NywwLDAsMC0xLjc3LTUuMnEtMS43Ny0yLTUuNzMtMkg0NTV2MTQuN2gxMS42OUEyMi41NiwyMi41NiwwLDAsMCw0NzAuMzcsMjQ2LjgzWiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3LjY2IC0yMjYuNjkpIiBzdHlsZT0iZmlsbDogI2ZmZiIvPgogICAgPHBhdGggZD0iTTUxNi44MSwyMzMuNDZhMTEuOSwxMS45LDAsMCwwLTcuMTctMiwxNy4xNSwxNy4xNSwwLDAsMC0zLjQ4LjM1LDkuMjUsOS4yNSwwLDAsMC0zLDEuMTgsNi4yMSw2LjIxLDAsMCwwLTIuMTMsMi4yMSw2Ljg1LDYuODUsMCwwLDAtLjgsMy40NSw0LjM5LDQuMzksMCwwLDAsMS4xNSwzLjE2LDguNTIsOC41MiwwLDAsMCwzLjA3LDIsMjUuNjgsMjUuNjgsMCwwLDAsNC4zNCwxLjI3cTIuNDIsMC41LDQuOTMsMS4wOXQ0LjkzLDEuMzlhMTYuMjksMTYuMjksMCwwLDEsNC4zNCwyLjE2LDEwLjI3LDEwLjI3LDAsMCwxLDMuMDcsMy40MiwxMiwxMiwwLDAsMS0uMzUsMTEsMTIuNDEsMTIuNDEsMCwwLDEtMy44NywzLjksMTYuODQsMTYuODQsMCwwLDEtNS4yOSwyLjE4LDI1LjY4LDI1LjY4LDAsMCwxLTUuODIuNjgsMjQuNzMsMjQuNzMsMCwwLDEtNi43LS44OSwxNi41MywxNi41MywwLDAsMS01LjU1LTIuNjksMTIuNzMsMTIuNzMsMCwwLDEtMy43OC00LjYxLDE0LjgzLDE0LjgzLDAsMCwxLTEuMzktNi42NGg1LjMxYTkuNTEsOS41MSwwLDAsMCwxLDQuNTgsOS4zOSw5LjM5LDAsMCwwLDIuNzIsMy4xNiwxMS40NSwxMS40NSwwLDAsMCwzLjkzLDEuODMsMTgsMTgsMCwwLDAsNC42MS41OSwyMC45MywyMC45MywwLDAsMCwzLjgxLS4zNSwxMS4yLDExLjIsMCwwLDAsMy40NS0xLjIxLDYuNDgsNi40OCwwLDAsMCwzLjQzLTYuMTEsNS4yOSw1LjI5LDAsMCwwLTEuMTUtMy41NCw4LjQ4LDguNDgsMCwwLDAtMy4wNy0yLjIxLDIyLjU0LDIyLjU0LDAsMCwwLTQuMzQtMS4zOWwtNC45My0xLjA5cS0yLjUxLS41Ni00LjkzLTEuM0ExNy44MSwxNy44MSwwLDAsMSw0OTguOCwyNDdhOS4zMiw5LjMyLDAsMCwxLTMuMDctMy4xMyw5LjIyLDkuMjIsMCwwLDEtMS4xNS00LjgxLDExLjE3LDExLjE3LDAsMCwxLDEuMy01LjUyLDExLjM0LDExLjM0LDAsMCwxLDMuNDUtMy44NCwxNS41MiwxNS41MiwwLDAsMSw0LjktMi4yNCwyMS42NSwyMS42NSwwLDAsMSw1LjY0LS43NCwyMi41OSwyMi41OSwwLDAsMSw2LC43NywxMy42NiwxMy42NiwwLDAsMSw0Ljg3LDIuNDIsMTEuNjksMTEuNjksMCwwLDEsMy4zMSw0LjE2LDE0LjksMTQuOSwwLDAsMSwxLjMzLDZoLTUuMzFRNTE5LjYxLDIzNS40OSw1MTYuODEsMjMzLjQ2WiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTI3LjY2IC0yMjYuNjkpIiBzdHlsZT0iZmlsbDogI2ZmZiIvPgogIDwvZz4KPC9zdmc+Cg=="

/***/ }),
/* 607 */,
/* 608 */,
/* 609 */,
/* 610 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(599)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(593),
  /* template */
  __webpack_require__(612),
  /* scopeId */
  "data-v-22d732ae",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 611 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(601)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(595),
  /* template */
  __webpack_require__(614),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 612 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.videoSrc) ? _c('div', {
    staticClass: "video-wrapper"
  }, [_c('div', {
    staticClass: "video-container"
  }, [_c('iframe', {
    attrs: {
      "src": _vm.src,
      "frameborder": "0",
      "allowfullscreen": "allowfullscreen"
    }
  })])]) : _vm._e()
},staticRenderFns: []}

/***/ }),
/* 613 */,
/* 614 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "four-corners-link"
  }, [_vm._m(0), _c('div', {
    staticClass: "four-corners-link--footer"
  }, [_c('p', [_vm._v(_vm._s(_vm.message))]), _c('router-link', {
    staticClass: "pure-button pure-button-subtle pull-right",
    attrs: {
      "to": "/fourcorners"
    }
  }, [_vm._v("Learn More")]), _c('div', {
    staticClass: "clearfix"
  })], 1)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "four-corners-link--body"
  }, [_c('img', {
    attrs: {
      "src": __webpack_require__(586)
    }
  })])
}]}

/***/ }),
/* 615 */
/***/ (function(module, exports, __webpack_require__) {

!function(t,e){ true?module.exports=e():"function"==typeof define&&define.amd?define("vue-slider-component",[],e):"object"==typeof exports?exports["vue-slider-component"]=e():t["vue-slider-component"]=e()}(this,function(){return function(t){function e(s){if(i[s])return i[s].exports;var r=i[s]={i:s,l:!1,exports:{}};return t[s].call(r.exports,r,r.exports,e),r.l=!0,r.exports}var i={};return e.m=t,e.c=i,e.i=function(t){return t},e.d=function(t,i,s){e.o(t,i)||Object.defineProperty(t,i,{configurable:!1,enumerable:!0,get:s})},e.n=function(t){var i=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(i,"a",i),i},e.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},e.p="",e(e.s=2)}([function(t,e,i){i(7);var s=i(5)(i(1),i(6),null,null);t.exports=s.exports},function(t,e,i){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={data:function(){return{flag:!1,size:0,currentValue:0,currentSlider:0}},props:{width:{type:[Number,String],default:"auto"},height:{type:[Number,String],default:6},data:{type:Array,default:null},dotSize:{type:Number,default:16},min:{type:Number,default:0},max:{type:Number,default:100},interval:{type:Number,default:1},show:{type:Boolean,default:!0},disabled:{type:Boolean,default:!1},piecewise:{type:Boolean,default:!1},tooltip:{type:[String,Boolean],default:"always"},eventType:{type:String,default:"auto"},direction:{type:String,default:"horizontal"},reverse:{type:Boolean,default:!1},lazy:{type:Boolean,default:!1},clickable:{type:Boolean,default:!0},speed:{type:Number,default:.5},realTime:{type:Boolean,default:!1},value:{type:[String,Number,Array],default:0},piecewiseLabel:{type:Boolean,default:!1},sliderStyle:[Array,Object],tooltipDir:[Array,String],formatter:[String,Function],piecewiseStyle:Object,piecewiseActiveStyle:Object,processStyle:Object,bgStyle:Object,tooltipStyle:[Array,Object],labelStyle:Object,labelActiveStyle:Object},computed:{flowDirection:function(){return"vue-slider-"+this.direction+(this.reverse?"-reverse":"")},tooltipDirection:function(){var t=this.tooltipDir||("vertical"===this.direction?"left":"top");return Array.isArray(t)?this.isRange?t:t[1]:this.isRange?[t,t]:t},tooltipStatus:function(){return"hover"===this.tooltip&&this.flag?"vue-slider-always":this.tooltip?"vue-slider-"+this.tooltip:""},tooltipClass:function(){return["vue-slider-tooltip-"+this.tooltipDirection,"vue-slider-tooltip"]},isDisabled:function(){return"none"===this.eventType||this.disabled},disabledClass:function(){return this.disabled?"vue-slider-disabled":""},isRange:function(){return Array.isArray(this.value)},slider:function(){return this.isRange?[this.$refs.dot0,this.$refs.dot1]:this.$refs.dot},minimum:function(){return this.data?0:this.min},val:{get:function(){return this.data?this.isRange?[this.data[this.currentValue[0]],this.data[this.currentValue[1]]]:this.data[this.currentValue]:this.currentValue},set:function(t){if(this.data)if(this.isRange){var e=this.data.indexOf(t[0]),i=this.data.indexOf(t[1]);e>-1&&i>-1&&(this.currentValue=[e,i])}else{var s=this.data.indexOf(t);s>-1&&(this.currentValue=s)}else this.currentValue=t}},currentIndex:function(){return this.isRange?this.data?this.currentValue:[(this.currentValue[0]-this.minimum)/this.spacing,(this.currentValue[1]-this.minimum)/this.spacing]:(this.currentValue-this.minimum)/this.spacing},indexRange:function(){return this.isRange?this.currentIndex:[0,this.currentIndex]},maximum:function(){return this.data?this.data.length-1:this.max},multiple:function(){var t=(""+this.interval).split(".")[1];return t?Math.pow(10,t.length):1},spacing:function(){return this.data?1:this.interval},total:function(){return this.data?this.data.length-1:(~~((this.maximum-this.minimum)*this.multiple)%(this.interval*this.multiple)!=0&&console.error("[Vue-slider warn]: Prop[interval] is illegal, Please make sure that the interval can be divisible"),(this.maximum-this.minimum)/this.interval)},gap:function(){return this.size/this.total},position:function(){return this.isRange?[(this.currentValue[0]-this.minimum)/this.spacing*this.gap,(this.currentValue[1]-this.minimum)/this.spacing*this.gap]:(this.currentValue-this.minimum)/this.spacing*this.gap},limit:function(){return this.isRange?[[0,this.position[1]],[this.position[0],this.size]]:[0,this.size]},valueLimit:function(){return this.isRange?[[this.minimum,this.currentValue[1]],[this.currentValue[0],this.maximum]]:[this.minimum,this.maximum]},wrapStyles:function(){return"vertical"===this.direction?{height:"number"==typeof this.height?this.height+"px":this.height,padding:this.dotSize/2+"px"}:{width:"number"==typeof this.width?this.width+"px":this.width,padding:this.dotSize/2+"px"}},sliderStyles:function(){return Array.isArray(this.sliderStyle)?this.isRange?this.sliderStyle:this.sliderStyle[1]:this.isRange?[this.sliderStyle,this.sliderStyle]:this.sliderStyle},tooltipStyles:function(){return Array.isArray(this.tooltipStyle)?this.isRange?this.tooltipStyle:this.tooltipStyle[1]:this.isRange?[this.tooltipStyle,this.tooltipStyle]:this.tooltipStyle},elemStyles:function(){return"vertical"===this.direction?{width:this.width+"px",height:"100%"}:{height:this.height+"px"}},dotStyles:function(){return"vertical"===this.direction?{width:this.dotSize+"px",height:this.dotSize+"px",left:-(this.dotSize-this.width)/2+"px"}:{width:this.dotSize+"px",height:this.dotSize+"px",top:-(this.dotSize-this.height)/2+"px"}},piecewiseDotStyle:function(){return"vertical"===this.direction?{width:this.width+"px",height:this.width+"px"}:{width:this.height+"px",height:this.height+"px"}},piecewiseDotWrap:function(){if(!this.piecewise&&!this.piecewiseLabel)return!1;for(var t=[],e=0;e<=this.total;e++){var i="vertical"===this.direction?{bottom:this.gap*e-this.width/2+"px",left:0}:{left:this.gap*e-this.height/2+"px",top:0},s=this.reverse?this.total-e:e,r=this.data?this.data[s]:this.spacing*s+this.min;t.push({style:i,label:this.formatter?this.formatting(r):r,inRange:s>=this.indexRange[0]&&s<=this.indexRange[1]})}return t}},watch:{value:function(t){this.flag||this.setValue(t,!0)},max:function(t){var e=this.limitValue(this.val);!1!==e&&this.setValue(e),this.refresh()},min:function(t){var e=this.limitValue(this.val);!1!==e&&this.setValue(e),this.refresh()},show:function(t){var e=this;t&&!this.size&&this.$nextTick(function(){e.refresh()})}},methods:{bindEvents:function(){document.addEventListener("touchmove",this.moving,{passive:!1}),document.addEventListener("touchend",this.moveEnd,{passive:!1}),document.addEventListener("mousemove",this.moving),document.addEventListener("mouseup",this.moveEnd),document.addEventListener("mouseleave",this.moveEnd),window.addEventListener("resize",this.refresh)},unbindEvents:function(){window.removeEventListener("resize",this.refresh),document.removeEventListener("touchmove",this.moving),document.removeEventListener("touchend",this.moveEnd),document.removeEventListener("mousemove",this.moving),document.removeEventListener("mouseup",this.moveEnd),document.removeEventListener("mouseleave",this.moveEnd)},formatting:function(t){return"string"==typeof this.formatter?this.formatter.replace(/\{value\}/,t):this.formatter(t)},getPos:function(t){return this.realTime&&this.getStaticData(),"vertical"===this.direction?this.reverse?t.pageY-this.offset:this.size-(t.pageY-this.offset):this.reverse?this.size-(t.clientX-this.offset):t.clientX-this.offset},wrapClick:function(t){if(this.isDisabled||!this.clickable)return!1;var e=this.getPos(t);this.isRange&&(this.currentSlider=e>(this.position[1]-this.position[0])/2+this.position[0]?1:0),this.setValueOnPos(e)},moveStart:function(t){if(this.isDisabled)return!1;this.isRange&&(this.currentSlider=t),this.flag=!0,this.$emit("drag-start",this)},moving:function(t){if(!this.flag)return!1;t.preventDefault(),t.targetTouches&&t.targetTouches[0]&&(t=t.targetTouches[0]),this.setValueOnPos(this.getPos(t),!0)},moveEnd:function(t){if(!this.flag)return!1;this.$emit("drag-end",this),this.lazy&&this.isDiff(this.val,this.value)&&this.syncValue(),this.flag=!1,this.setPosition()},setValueOnPos:function(t,e){var i=this.isRange?this.limit[this.currentSlider]:this.limit,s=this.isRange?this.valueLimit[this.currentSlider]:this.valueLimit;if(t>=i[0]&&t<=i[1]){this.setTransform(t);var r=(Math.round(t/this.gap)*(this.spacing*this.multiple)+this.minimum*this.multiple)/this.multiple;this.setCurrentValue(r,e)}else t<i[0]?(this.setTransform(i[0]),this.setCurrentValue(s[0]),1===this.currentSlider&&(this.currentSlider=0)):(this.setTransform(i[1]),this.setCurrentValue(s[1]),0===this.currentSlider&&(this.currentSlider=1))},isDiff:function(t,e){return Object.prototype.toString.call(t)!==Object.prototype.toString.call(e)||(Array.isArray(t)&&t.length===e.length?t.some(function(t,i){return t!==e[i]}):t!==e)},setCurrentValue:function(t,e){if(t<this.minimum||t>this.maximum)return!1;this.isRange?this.isDiff(this.currentValue[this.currentSlider],t)&&(this.currentValue.splice(this.currentSlider,1,t),this.lazy&&this.flag||this.syncValue()):this.isDiff(this.currentValue,t)&&(this.currentValue=t,this.lazy&&this.flag||this.syncValue()),e||this.setPosition()},setIndex:function(t){if(Array.isArray(t)&&this.isRange){var e=void 0;e=this.data?[this.data[t[0]],this.data[t[1]]]:[this.spacing*t[0]+this.minimum,this.spacing*t[1]+this.minimum],this.setValue(e)}else t=this.spacing*t+this.minimum,this.isRange&&(this.currentSlider=t>(this.currentValue[1]-this.currentValue[0])/2+this.currentValue[0]?1:0),this.setCurrentValue(t)},setValue:function(t,e,i){var s=this;if(this.isDiff(this.val,t)){var r=this.limitValue(t);this.val=!1!==r?this.isRange?r.concat():r:this.isRange?t.concat():t,this.syncValue(e)}this.$nextTick(function(){return s.setPosition(i)})},setPosition:function(t){this.flag||this.setTransitionTime(void 0===t?this.speed:t),this.isRange?(this.currentSlider=0,this.setTransform(this.position[this.currentSlider]),this.currentSlider=1,this.setTransform(this.position[this.currentSlider])):this.setTransform(this.position),this.flag||this.setTransitionTime(0)},setTransform:function(t){var e=("vertical"===this.direction?this.dotSize/2-t:t-this.dotSize/2)*(this.reverse?-1:1),i="vertical"===this.direction?"translateY("+e+"px)":"translateX("+e+"px)",s=(0===this.currentSlider?this.position[1]-t:t-this.position[0])+"px",r=(0===this.currentSlider?t:this.position[0])+"px";this.isRange?(this.slider[this.currentSlider].style.transform=i,this.slider[this.currentSlider].style.WebkitTransform=i,this.slider[this.currentSlider].style.msTransform=i,"vertical"===this.direction?(this.$refs.process.style.height=s,this.$refs.process.style[this.reverse?"top":"bottom"]=r):(this.$refs.process.style.width=s,this.$refs.process.style[this.reverse?"right":"left"]=r)):(this.slider.style.transform=i,this.slider.style.WebkitTransform=i,this.slider.style.msTransform=i,"vertical"===this.direction?(this.$refs.process.style.height=t+"px",this.$refs.process.style[this.reverse?"top":"bottom"]=0):(this.$refs.process.style.width=t+"px",this.$refs.process.style[this.reverse?"right":"left"]=0))},setTransitionTime:function(t){if(t||this.$refs.process.offsetWidth,this.isRange){for(var e=0;e<this.slider.length;e++)this.slider[e].style.transitionDuration=t+"s",this.slider[e].style.WebkitTransitionDuration=t+"s";this.$refs.process.style.transitionDuration=t+"s",this.$refs.process.style.WebkitTransitionDuration=t+"s"}else this.slider.style.transitionDuration=t+"s",this.slider.style.WebkitTransitionDuration=t+"s",this.$refs.process.style.transitionDuration=t+"s",this.$refs.process.style.WebkitTransitionDuration=t+"s"},limitValue:function(t){var e=this;if(this.data)return t;var i=!1;return this.isRange?t=t.map(function(t){return t<e.min?(i=!0,e.min):t>e.max?(i=!0,e.max):t}):t>this.max?(i=!0,t=this.max):t<this.min&&(i=!0,t=this.min),i&&t},syncValue:function(t){t||this.$emit("callback",this.val),this.$emit("input",this.isRange?this.val.concat():this.val)},getValue:function(){return this.val},getIndex:function(){return this.currentIndex},getStaticData:function(){this.$refs.elem&&(this.size="vertical"===this.direction?this.$refs.elem.offsetHeight:this.$refs.elem.offsetWidth,this.offset="vertical"===this.direction?this.$refs.elem.getBoundingClientRect().top+window.pageYOffset||document.documentElement.scrollTop:this.$refs.elem.getBoundingClientRect().left)},refresh:function(){this.$refs.elem&&(this.getStaticData(),this.setPosition())}},mounted:function(){var t=this;"undefined"!=typeof window&&"undefined"!=typeof document&&this.$nextTick(function(){t.getStaticData(),t.setValue(t.value,!0,0),t.bindEvents()})},beforeDestroy:function(){this.unbindEvents()}}},function(t,e,i){"use strict";var s=i(0);t.exports=s},function(t,e,i){e=t.exports=i(4)(),e.push([t.i,'.vue-slider-component{position:relative;-webkit-box-sizing:border-box;box-sizing:border-box;-webkit-user-select:none;-moz-user-select:none;-ms-user-select:none;user-select:none}.vue-slider-component.vue-slider-disabled{opacity:.5;cursor:not-allowed}.vue-slider-component.vue-slider-has-label{margin-bottom:15px}.vue-slider-component.vue-slider-disabled .vue-slider-dot{cursor:not-allowed}.vue-slider-component .vue-slider{position:relative;display:block;border-radius:15px;background-color:#ccc}.vue-slider-component .vue-slider:after{content:"";position:absolute;left:0;top:0;width:100%;height:100%;z-index:2}.vue-slider-component .vue-slider-process{position:absolute;border-radius:15px;background-color:#3498db;-webkit-transition:all 0s;transition:all 0s;z-index:1}.vue-slider-component.vue-slider-horizontal .vue-slider-process{width:0;height:100%;top:0;left:0;will-change:width}.vue-slider-component.vue-slider-vertical .vue-slider-process{width:100%;height:0;bottom:0;left:0;will-change:height}.vue-slider-component.vue-slider-horizontal-reverse .vue-slider-process{width:0;height:100%;top:0;right:0}.vue-slider-component.vue-slider-vertical-reverse .vue-slider-process{width:100%;height:0;top:0;left:0}.vue-slider-component .vue-slider-dot{position:absolute;border-radius:50%;background-color:#fff;-webkit-box-shadow:.5px .5px 2px 1px rgba(0,0,0,.32);box-shadow:.5px .5px 2px 1px rgba(0,0,0,.32);-webkit-transition:all 0s;transition:all 0s;will-change:transform;cursor:pointer;z-index:3}.vue-slider-component.vue-slider-horizontal .vue-slider-dot{left:0}.vue-slider-component.vue-slider-vertical .vue-slider-dot{bottom:0}.vue-slider-component.vue-slider-horizontal-reverse .vue-slider-dot{right:0}.vue-slider-component.vue-slider-vertical-reverse .vue-slider-dot{top:0}.vue-slider-component .vue-slider-tooltip-wrap{display:none;position:absolute;z-index:9}.vue-slider-component .vue-slider-tooltip{display:block;font-size:14px;white-space:nowrap;padding:2px 5px;min-width:20px;text-align:center;color:#fff;border-radius:5px;border:1px solid #3498db;background-color:#3498db}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-top{top:-9px;left:50%;-webkit-transform:translate(-50%,-100%);transform:translate(-50%,-100%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-bottom{bottom:-9px;left:50%;-webkit-transform:translate(-50%,100%);transform:translate(-50%,100%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-left{top:50%;left:-9px;-webkit-transform:translate(-100%,-50%);transform:translate(-100%,-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-right{top:50%;right:-9px;-webkit-transform:translate(100%,-50%);transform:translate(100%,-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-top .vue-slider-tooltip:before{content:"";position:absolute;bottom:-10px;left:50%;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-top-color:inherit;-webkit-transform:translate(-50%);transform:translate(-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-bottom .vue-slider-tooltip:before{content:"";position:absolute;top:-10px;left:50%;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-bottom-color:inherit;-webkit-transform:translate(-50%);transform:translate(-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-left .vue-slider-tooltip:before{content:"";position:absolute;top:50%;right:-10px;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-left-color:inherit;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.vue-slider-component .vue-slider-tooltip-wrap.vue-slider-tooltip-right .vue-slider-tooltip:before{content:"";position:absolute;top:50%;left:-10px;width:0;height:0;border:5px solid transparent;border:6px solid transparent\\0;border-right-color:inherit;-webkit-transform:translateY(-50%);transform:translateY(-50%)}.vue-slider-component .vue-slider-dot.vue-slider-hover:hover .vue-slider-tooltip-wrap{display:block}.vue-slider-component .vue-slider-dot.vue-slider-always .vue-slider-tooltip-wrap{display:block!important}.vue-slider-component .vue-slider-piecewise{position:absolute;width:100%;padding:0;margin:0;left:0;top:0;height:100%;list-style:none}.vue-slider-component .vue-slider-piecewise-item{position:absolute;width:8px;height:8px}.vue-slider-component .vue-slider-piecewise-dot{position:absolute;left:50%;top:50%;width:100%;height:100%;display:inline-block;background-color:rgba(0,0,0,.16);border-radius:50%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);z-index:2;-webkit-transition:all .3s;transition:all .3s}.vue-slider-component .vue-slider-piecewise-item:first-child .vue-slider-piecewise-dot,.vue-slider-component .vue-slider-piecewise-item:last-child .vue-slider-piecewise-dot{visibility:hidden}.vue-slider-component.vue-slider-horizontal-reverse .vue-slider-piecewise-label,.vue-slider-component.vue-slider-horizontal .vue-slider-piecewise-label{position:absolute;display:inline-block;top:100%;left:50%;white-space:nowrap;font-size:12px;color:#333;-webkit-transform:translate(-50%,8px);transform:translate(-50%,8px);visibility:visible}.vue-slider-component.vue-slider-vertical-reverse .vue-slider-piecewise-label,.vue-slider-component.vue-slider-vertical .vue-slider-piecewise-label{position:absolute;display:inline-block;top:50%;left:100%;white-space:nowrap;font-size:12px;color:#333;-webkit-transform:translate(8px,-50%);transform:translate(8px,-50%);visibility:visible}.vue-slider-component .vue-slider-sr-only{clip:rect(1px,1px,1px,1px);height:1px;width:1px;overflow:hidden;position:absolute!important}',""])},function(t,e){t.exports=function(){var t=[];return t.toString=function(){for(var t=[],e=0;e<this.length;e++){var i=this[e];i[2]?t.push("@media "+i[2]+"{"+i[1]+"}"):t.push(i[1])}return t.join("")},t.i=function(e,i){"string"==typeof e&&(e=[[null,e,""]]);for(var s={},r=0;r<this.length;r++){var n=this[r][0];"number"==typeof n&&(s[n]=!0)}for(r=0;r<e.length;r++){var o=e[r];"number"==typeof o[0]&&s[o[0]]||(i&&!o[2]?o[2]=i:i&&(o[2]="("+o[2]+") and ("+i+")"),t.push(o))}},t}},function(t,e){t.exports=function(t,e,i,s){var r,n=t=t||{},o=typeof t.default;"object"!==o&&"function"!==o||(r=t,n=t.default);var l="function"==typeof n?n.options:n;if(e&&(l.render=e.render,l.staticRenderFns=e.staticRenderFns),i&&(l._scopeId=i),s){var a=Object.create(l.computed||null);Object.keys(s).forEach(function(t){var e=s[t];a[t]=function(){return e}}),l.computed=a}return{esModule:r,exports:n,options:l}}},function(t,e){t.exports={render:function(){var t=this,e=t.$createElement,i=t._self._c||e;return i("div",{directives:[{name:"show",rawName:"v-show",value:t.show,expression:"show"}],ref:"wrap",class:["vue-slider-component",t.flowDirection,t.disabledClass,{"vue-slider-has-label":t.piecewiseLabel}],style:t.wrapStyles,on:{click:t.wrapClick}},[i("div",{ref:"elem",staticClass:"vue-slider",style:[t.elemStyles,t.bgStyle],attrs:{"aria-hidden":"true"}},[t.isRange?[i("div",{ref:"dot0",class:[t.tooltipStatus,"vue-slider-dot"],style:[t.dotStyles,t.sliderStyles[0]],on:{mousedown:function(e){t.moveStart(0)},touchstart:function(e){t.moveStart(0)}}},[i("span",{class:["vue-slider-tooltip-"+t.tooltipDirection[0],"vue-slider-tooltip-wrap"]},[t._t("tooltip",[i("span",{staticClass:"vue-slider-tooltip",style:t.tooltipStyles[0]},[t._v(t._s(t.formatter?t.formatting(t.val[0]):t.val[0]))])],{value:t.val[0],index:0})],2)]),t._v(" "),i("div",{ref:"dot1",class:[t.tooltipStatus,"vue-slider-dot"],style:[t.dotStyles,t.sliderStyles[1]],on:{mousedown:function(e){t.moveStart(1)},touchstart:function(e){t.moveStart(1)}}},[i("span",{class:["vue-slider-tooltip-"+t.tooltipDirection[1],"vue-slider-tooltip-wrap"]},[t._t("tooltip",[i("span",{staticClass:"vue-slider-tooltip",style:t.tooltipStyles[1]},[t._v(t._s(t.formatter?t.formatting(t.val[1]):t.val[1]))])],{value:t.val[1],index:1})],2)])]:[i("div",{ref:"dot",class:[t.tooltipStatus,"vue-slider-dot"],style:[t.dotStyles,t.sliderStyles],on:{mousedown:t.moveStart,touchstart:t.moveStart}},[i("span",{class:["vue-slider-tooltip-"+t.tooltipDirection,"vue-slider-tooltip-wrap"]},[t._t("tooltip",[i("span",{staticClass:"vue-slider-tooltip",style:t.tooltipStyles},[t._v(t._s(t.formatter?t.formatting(t.val):t.val))])],{value:t.val})],2)])],t._v(" "),i("ul",{staticClass:"vue-slider-piecewise"},t._l(t.piecewiseDotWrap,function(e,s){return i("li",{key:s,staticClass:"vue-slider-piecewise-item",style:[t.piecewiseDotStyle,e.style]},[t._t("piecewise",[t.piecewise?i("span",{staticClass:"vue-slider-piecewise-dot",style:[t.piecewiseStyle,e.inRange?t.piecewiseActiveStyle:null]}):t._e()],{label:e.label,index:s,first:0===s,last:s===t.piecewiseDotWrap.length-1}),t._v(" "),t._t("label",[t.piecewiseLabel?i("span",{staticClass:"vue-slider-piecewise-label",style:[t.labelStyle,e.inRange?t.labelActiveStyle:null]},[t._v("\n\t\t\t\t\t\t"+t._s(e.label)+"\n\t\t\t\t\t")]):t._e()],{label:e.label,index:s,first:0===s,last:s===t.piecewiseDotWrap.length-1})],2)})),t._v(" "),i("div",{ref:"process",staticClass:"vue-slider-process",style:t.processStyle})],2),t._v(" "),t.isRange||t.data?t._e():i("input",{directives:[{name:"model",rawName:"v-model",value:t.val,expression:"val"}],staticClass:"vue-slider-sr-only",attrs:{type:"range",min:t.min,max:t.max},domProps:{value:t.val},on:{__r:function(e){t.val=e.target.value}}})])},staticRenderFns:[]}},function(t,e,i){var s=i(3);"string"==typeof s&&(s=[[t.i,s,""]]),s.locals&&(t.exports=s.locals);i(8)("743d98f5",s,!0)},function(t,e,i){function s(t){for(var e=0;e<t.length;e++){var i=t[e],s=h[i.id];if(s){s.refs++;for(var r=0;r<s.parts.length;r++)s.parts[r](i.parts[r]);for(;r<i.parts.length;r++)s.parts.push(n(i.parts[r]));s.parts.length>i.parts.length&&(s.parts.length=i.parts.length)}else{for(var o=[],r=0;r<i.parts.length;r++)o.push(n(i.parts[r]));h[i.id]={id:i.id,refs:1,parts:o}}}}function r(){var t=document.createElement("style");return t.type="text/css",d.appendChild(t),t}function n(t){var e,i,s=document.querySelector('style[data-vue-ssr-id~="'+t.id+'"]');if(s){if(f)return v;s.parentNode.removeChild(s)}if(m){var n=p++;s=c||(c=r()),e=o.bind(null,s,n,!1),i=o.bind(null,s,n,!0)}else s=r(),e=l.bind(null,s),i=function(){s.parentNode.removeChild(s)};return e(t),function(s){if(s){if(s.css===t.css&&s.media===t.media&&s.sourceMap===t.sourceMap)return;e(t=s)}else i()}}function o(t,e,i,s){var r=i?"":s.css;if(t.styleSheet)t.styleSheet.cssText=g(e,r);else{var n=document.createTextNode(r),o=t.childNodes;o[e]&&t.removeChild(o[e]),o.length?t.insertBefore(n,o[e]):t.appendChild(n)}}function l(t,e){var i=e.css,s=e.media,r=e.sourceMap;if(s&&t.setAttribute("media",s),r&&(i+="\n/*# sourceURL="+r.sources[0]+" */",i+="\n/*# sourceMappingURL=data:application/json;base64,"+btoa(unescape(encodeURIComponent(JSON.stringify(r))))+" */"),t.styleSheet)t.styleSheet.cssText=i;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(i))}}var a="undefined"!=typeof document;if("undefined"!=typeof DEBUG&&DEBUG&&!a)throw new Error("vue-style-loader cannot be used in a non-browser environment. Use { target: 'node' } in your Webpack config to indicate a server-rendering environment.");var u=i(9),h={},d=a&&(document.head||document.getElementsByTagName("head")[0]),c=null,p=0,f=!1,v=function(){},m="undefined"!=typeof navigator&&/msie [6-9]\b/.test(navigator.userAgent.toLowerCase());t.exports=function(t,e,i){f=i;var r=u(t,e);return s(r),function(e){for(var i=[],n=0;n<r.length;n++){var o=r[n],l=h[o.id];l.refs--,i.push(l)}e?(r=u(t,e),s(r)):r=[];for(var n=0;n<i.length;n++){var l=i[n];if(0===l.refs){for(var a=0;a<l.parts.length;a++)l.parts[a]();delete h[l.id]}}}};var g=function(){var t=[];return function(e,i){return t[e]=i,t.filter(Boolean).join("\n")}}()},function(t,e){t.exports=function(t,e){for(var i=[],s={},r=0;r<e.length;r++){var n=e[r],o=n[0],l=n[1],a=n[2],u=n[3],h={id:t+":"+r,css:l,media:a,sourceMap:u};s[o]?s[o].parts.push(h):i.push(s[o]={id:o,parts:[h]})}return i}}])});

/***/ }),
/* 616 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// there's 3 implementations written in increasing order of efficiency

// 1 - no Set type is defined
function uniqNoSet(arr) {
	var ret = [];

	for (var i = 0; i < arr.length; i++) {
		if (ret.indexOf(arr[i]) === -1) {
			ret.push(arr[i]);
		}
	}

	return ret;
}

// 2 - a simple Set type is defined
function uniqSet(arr) {
	var seen = new Set();
	return arr.filter(function (el) {
		if (!seen.has(el)) {
			seen.add(el);
			return true;
		}

		return false;
	});
}

// 3 - a standard Set type is defined and it has a forEach method
function uniqSetWithForEach(arr) {
	var ret = [];

	(new Set(arr)).forEach(function (el) {
		ret.push(el);
	});

	return ret;
}

// V8 currently has a broken implementation
// https://github.com/joyent/node/issues/8449
function doesForEachActuallyWork() {
	var ret = false;

	(new Set([true])).forEach(function (el) {
		ret = el;
	});

	return ret === true;
}

if ('Set' in global) {
	if (typeof Set.prototype.forEach === 'function' && doesForEachActuallyWork()) {
		module.exports = uniqSetWithForEach;
	} else {
		module.exports = uniqSet;
	}
} else {
	module.exports = uniqNoSet;
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 617 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__store_mutation_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash_floor__ = __webpack_require__(149);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash_floor___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash_floor__);








/* harmony default export */ __webpack_exports__["a"] = ({
  mounted: function mounted() {
    var _this = this;

    __WEBPACK_IMPORTED_MODULE_1_vue__["default"].io.socket.on('message', function (obj) {

      if (obj.msgtype === 'message') {

        __WEBPACK_IMPORTED_MODULE_1_vue__["default"].$log.info('message received over socket connection');
        __WEBPACK_IMPORTED_MODULE_1_vue__["default"].$log.info(obj);

        var key = '' + _.round(parseInt(obj.msg.segment) * 0.2);
        var updateMessage = _this.messages[key];

        if (!obj.msg.tag && updateMessage) {
          updateMessage.message = obj.msg;

          updateMessage.info.total = updateMessage.info.total + 1;

          __WEBPACK_IMPORTED_MODULE_1_vue__["default"].set(_this.messages, key, updateMessage);

          if (_this.peekSegment === _.round(parseInt(obj.msg.segment) * 0.2)) {
            __WEBPACK_IMPORTED_MODULE_1_vue__["default"].$log.info('Pushing message');
            _this.$store.commit(__WEBPACK_IMPORTED_MODULE_3__store_mutation_types__["v" /* PUSH_SEGMENT_MESSAGE */], obj.msg);
          }
        }

        if (obj.msg.tag === _this.classSlug + '/' + _this.contentSlug) {

          __WEBPACK_IMPORTED_MODULE_1_vue__["default"].$log.info('message received over socket connection');
          __WEBPACK_IMPORTED_MODULE_1_vue__["default"].$log.info(obj);

          __WEBPACK_IMPORTED_MODULE_1_vue__["default"].$log.info('Pushing message to webinar ticker');
          _this.webinarMessages.push(obj.msg);
        }
      }
    });
  },
  data: function data() {
    return {
      messages: {}
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_vuex__["b" /* mapGetters */])(['currentClass', 'currentSection', 'currentSegmentGroup']), {
    chunkedMessages: function chunkedMessages() {
      return this.messages;
    }
  }),
  methods: {
    loadSegmentSummary: function loadSegmentSummary(segmentGroup) {
      var _this2 = this;

      if (this.content === undefined) {
        return;
      }
      if (this.currentClass === undefined) {
        return;
      }

      if (segmentGroup !== 0) {
        if (this.currentSection === undefined) {
          return;
        }
        if (this.content.slug !== this.currentSection.slug) {
          return;
        }
      }

      __WEBPACK_IMPORTED_MODULE_1_vue__["default"].$log.info('Getting message summary for - ' + segmentGroup);

      var thinkAhead = 10;
      var thinkBehind = 10;

      var segmentViewport = __WEBPACK_IMPORTED_MODULE_5_lodash_floor___default()(window.innerHeight / 158.0) + thinkBehind;

      var endSegment = (segmentGroup + thinkAhead) / 0.2;
      var startSegment = endSegment - segmentViewport / 0.2;

      startSegment = startSegment < 0 ? 0 : startSegment;
      endSegment = endSegment < 5 ? 5 : endSegment;

      var theRequest = {
        theClass: this.currentClass.slug,
        theContent: this.content.slug,
        startSegment: '' + parseInt(startSegment),
        endSegment: '' + parseInt(endSegment)
      };

      if (startSegment % 10 === 0 || startSegment === 0) {
        __WEBPACK_IMPORTED_MODULE_2__api__["a" /* default */].message.getSegmentSummary(theRequest, function (response) {

          for (var group in response.data) {

            var newMessage = response.data[group];
            newMessage.segmentGroup = parseInt(parseInt(group) * 0.2);

            if (newMessage.segmentGroup < _this2.content.duration * 0.2) {
              __WEBPACK_IMPORTED_MODULE_1_vue__["default"].set(_this2.messages, newMessage.segmentGroup, newMessage);
            }
          }
        }, function (response) {
          __WEBPACK_IMPORTED_MODULE_1_vue__["default"].$log.info('Failed to get messages summary');
        });
      }

      __WEBPACK_IMPORTED_MODULE_2__api__["a" /* default */].message.getSegmentSummarySocket(theRequest, function (response) {
        __WEBPACK_IMPORTED_MODULE_1_vue__["default"].$log.info('Subscribed to messages summary');
        __WEBPACK_IMPORTED_MODULE_1_vue__["default"].$log.info(theRequest);
      }, function (response) {
        __WEBPACK_IMPORTED_MODULE_1_vue__["default"].$log.info('Failed to subscribe to messages summary');
      });
    }
  }
});

/***/ }),
/* 618 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;


/***/ }),
/* 619 */,
/* 620 */,
/* 621 */,
/* 622 */,
/* 623 */,
/* 624 */,
/* 625 */,
/* 626 */,
/* 627 */,
/* 628 */,
/* 629 */,
/* 630 */,
/* 631 */,
/* 632 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(751)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(664),
  /* template */
  __webpack_require__(903),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 633 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);


/* harmony default export */ __webpack_exports__["a"] = ({
  methods: {
    loadMedia: function loadMedia() {
      __WEBPACK_IMPORTED_MODULE_0_vue__["default"].$log.info('Getting media...');
      this.$store.dispatch('getMedia', { slug: '' + this.content.slug, path: '' + this.course.baseUri + this.currentClass.dir + '/' + this.content.images });
    }
  }
});

/***/ }),
/* 634 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash_math__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_lodash_math___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_lodash_math__);







/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      subtitles: []
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_vuex__["b" /* mapGetters */])(['course', 'currentClass', 'currentSection'])),
  methods: {
    loadSubtitles: function loadSubtitles(content) {
      var _this = this;

      __WEBPACK_IMPORTED_MODULE_2_vue__["default"].$log.info('Getting subtitles...');

      this.subtitles = [];

      __WEBPACK_IMPORTED_MODULE_3__api__["a" /* default */].message.getSubtitles('' + content.slug, '' + this.course.baseUri + this.currentClass.dir + '/' + content.transcript, function (response) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {

          for (var _iterator = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default()(response.response), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var subtitle = _step.value;


            var group = __WEBPACK_IMPORTED_MODULE_5_lodash_math___default.a.divide(__WEBPACK_IMPORTED_MODULE_5_lodash_math___default.a.floor(subtitle.start + 2.5), 5);

            var segmentGroup = parseInt(group);

            var newSubtitle = subtitle;

            newSubtitle.segmentGroup = segmentGroup;

            __WEBPACK_IMPORTED_MODULE_2_vue__["default"].set(_this.subtitles, segmentGroup, _this.subtitles[segmentGroup] ? _this.subtitles[segmentGroup] + ' ' + newSubtitle.text : newSubtitle.text);
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }, function (response) {});
    }
  }
});

/***/ }),
/* 635 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_core__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_mean__ = __webpack_require__(151);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_mean___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_lodash_mean__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash_chunk__ = __webpack_require__(775);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_lodash_chunk___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_lodash_chunk__);









/* harmony default export */ __webpack_exports__["a"] = ({
  data: function data() {
    return {
      points: ''
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_5_vuex__["b" /* mapGetters */])(['currentClass', 'currentSection'])),
  methods: {
    loadVisualisation: function loadVisualisation(content) {
      var _this = this;

      var request = { class: this.currentClass.slug, content: this.content.slug };

      __WEBPACK_IMPORTED_MODULE_2__api__["a" /* default */].visualisation.getVisualisation(request, function (response) {
        var visualisation = response.data;

        var segmentHeight = 158.0;
        var handleOffset = segmentHeight / 4.0;
        var width = 200.0;
        var parentOffsetTop = segmentHeight / 2.0;

        _this.points = '';

        var chunkedVis = __WEBPACK_IMPORTED_MODULE_6_lodash_chunk___default()(__WEBPACK_IMPORTED_MODULE_3_lodash_core___default.a.values(visualisation), 5);

        chunkedVis = __WEBPACK_IMPORTED_MODULE_3_lodash_core___default.a.map(chunkedVis, function (val) {
          return __WEBPACK_IMPORTED_MODULE_4_lodash_mean___default()(val);
        });

        __WEBPACK_IMPORTED_MODULE_3_lodash_core___default.a.forEach(chunkedVis, function (value, index) {
          var offsetTop = index * segmentHeight + parentOffsetTop;
          _this.points += 'S ' + value * width + ' ' + (offsetTop - handleOffset) + ', ' + value * width + ' ' + offsetTop + ' ';
        });

        _this.points = 'M0 0 ' + _this.points + ' L 0 ' + __WEBPACK_IMPORTED_MODULE_3_lodash_core___default.a.size(chunkedVis) * segmentHeight + ' Z';
      }, function (response) {
        return function (response) {
          _this.points = '';
        };
      });
    }
  }
});

/***/ }),
/* 636 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_get_iterator__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_get_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_get_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__store_mutation_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vue_scroll__ = __webpack_require__(123);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vue_scroll___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_vue_scroll__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__api__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_vue_awesome_icons_angle_left__ = __webpack_require__(565);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_vue_awesome_icons_angle_right__ = __webpack_require__(591);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_vue_awesome_icons_info__ = __webpack_require__(723);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_vue_awesome_icons_check_circle__ = __webpack_require__(721);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_vue_awesome_icons_lock__ = __webpack_require__(577);















/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'class-selector',
  watch: {
    currentClass: function currentClass(nV, oV) {
      this.activeClass = nV.slug;
      this.$router.replace('/course/' + nV.slug);
    }
  },
  data: function data() {
    return {
      activeClass: undefined,
      offset: 0,
      remainingOffset: 1,
      leftPos: 0,
      introClass: {
        slug: 'intro'
      }
    };
  },

  methods: {
    onScroll: function onScroll(e, position) {
      this.offset = position.scrollLeft;
      this.remainingOffset = this.$refs.classselector.scrollWidth - this.$refs.classselector.offsetWidth - position.scrollLeft;
    },
    setInitalClass: function setInitalClass() {
      if (this.isRegistered) {
        this.viewCurrentClass();
      } else {
        this.viewIntroClass();
      }
    },
    viewIntroClass: function viewIntroClass() {
      this.$ga.event('class-selector', 'click', 'class-switched', 'class-intro');
      this.$store.dispatch('resetState');
      this.$store.commit(__WEBPACK_IMPORTED_MODULE_3__store_mutation_types__["y" /* SET_CURRENT_CLASS */], this.introClass);
    },
    viewCurrentClass: function viewCurrentClass() {
      if (!this.currentExists) {
        this.viewIntroClass();
      }
      if (!(this.course && this.course.classes)) {
        return false;
      }
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_get_iterator___default()(this.course.classes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var theClass = _step.value;

          if (theClass.status === 'CURRENT') {
            this.$store.dispatch('getSpec', theClass.slug);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    },
    setCurrentClass: function setCurrentClass(newClass) {
      var _this = this;

      this.$ga.event('class-selector', 'click', 'class-switched', newClass);

      this.$store.dispatch('resetState').then(function () {
        if (newClass === undefined) {
          _this.setInitalClass();
        } else {
          _this.activeClass = newClass;
          _this.$store.dispatch('getSpec', newClass);
        }
      });
    },
    scrollLeft: function scrollLeft() {
      this.$refs.classselector.scrollLeft -= 80;
    },
    scrollRight: function scrollRight() {
      this.$refs.classselector.scrollLeft += 80;
    }
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_vuex__["b" /* mapGetters */])(['course', 'currentClass', 'isRegistered']), {
    theWidth: function theWidth() {
      return this.course && this.course.classes ? this.course.classes.length * 190.0 - 10 + 190.0 : 190.0;
    },
    currentExists: function currentExists() {
      if (!(this.course && this.course.classes)) {
        return false;
      }
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = __WEBPACK_IMPORTED_MODULE_1_babel_runtime_core_js_get_iterator___default()(this.course.classes), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var theClass = _step2.value;

          if (theClass.status === 'CURRENT') {
            return true;
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return false;
    }
  })
});

/***/ }),
/* 637 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_core__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__mixins_Messages__ = __webpack_require__(617);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__mixins_Media__ = __webpack_require__(633);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__mixins_Subtitles__ = __webpack_require__(634);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__mixins_Visualisation__ = __webpack_require__(635);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_conversation_TimeSegment__ = __webpack_require__(875);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_conversation_TimeSegment___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__components_conversation_TimeSegment__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_vue_awesome_icons_twitter__ = __webpack_require__(145);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_vue_awesome_icons_quote_right__ = __webpack_require__(725);

















/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'conversation-container',
  mixins: [__WEBPACK_IMPORTED_MODULE_4__mixins_Messages__["a" /* default */], __WEBPACK_IMPORTED_MODULE_5__mixins_Media__["a" /* default */], __WEBPACK_IMPORTED_MODULE_6__mixins_Subtitles__["a" /* default */], __WEBPACK_IMPORTED_MODULE_7__mixins_Visualisation__["a" /* default */]],
  components: {
    TimeSegment: __WEBPACK_IMPORTED_MODULE_8__components_conversation_TimeSegment___default.a
  },
  props: ['content'],
  mounted: function mounted() {
    var _this = this;

    this.loadMedia(this.content);
    this.loadVisualisation(this.content);
    this.loadSubtitles(this.content);
    setTimeout(function () {
      _this.$log.info('Getting messages for segment ' + 0);
      _this.loadSegmentSummary(0);
    }, 100);
  },
  data: function data() {
    return {
      messagePriority: true
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_vuex__["b" /* mapGetters */])(['currentClass', 'currentSegmentGroup', 'currentSegment', 'peekSegment', 'course']), {
    containerHeight: function containerHeight() {
      return this.content.duration * 0.2 * 158.0 + 124 + 'px';
    }
  }),
  watch: {
    currentSegmentGroup: function currentSegmentGroup(nV, oV) {
      if (nV === undefined) {
        return;
      }
      if (oV !== nV) {
        this.$log.info('Getting messages for segment ' + nV);

        this.loadSegmentSummary(nV);
      }
    }
  }
});

/***/ }),
/* 638 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_core__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__store_mutation_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_AnimatedLogo__ = __webpack_require__(152);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_AnimatedLogo___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_AnimatedLogo__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_ClassSelector__ = __webpack_require__(850);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_ClassSelector___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__components_ClassSelector__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_conversation_CourseContent__ = __webpack_require__(866);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__components_conversation_CourseContent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6__components_conversation_CourseContent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_MarkdownRenderer__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_MarkdownRenderer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__components_MarkdownRenderer__);














/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'course',
  beforeRouteEnter: function beforeRouteEnter(to, from, next) {
    next(function (vm) {
      vm.$store.commit(__WEBPACK_IMPORTED_MODULE_3__store_mutation_types__["t" /* SET_NAV_STATE */], { minimized: false });
      vm.$store.commit(__WEBPACK_IMPORTED_MODULE_3__store_mutation_types__["u" /* SET_PAGE_STYLE */], undefined);
    });
  },
  beforeRouteLeave: function beforeRouteLeave(to, from, next) {
    this.$store.dispatch('resetState');
    next();
  },
  mounted: function mounted() {
    this.$store.dispatch('checkAuth');

    this.toMessage(this.$route.query);
  },
  data: function data() {
    return {
      navTitle: 'Connected Academy - Main',
      infoVisible: false,
      loaded: false
    };
  },

  components: {
    AnimatedLogo: __WEBPACK_IMPORTED_MODULE_4__components_AnimatedLogo___default.a,
    ClassSelector: __WEBPACK_IMPORTED_MODULE_5__components_ClassSelector___default.a,
    CourseContent: __WEBPACK_IMPORTED_MODULE_6__components_conversation_CourseContent___default.a,
    MarkdownRenderer: __WEBPACK_IMPORTED_MODULE_7__components_MarkdownRenderer___default.a
  },
  watch: {
    'isAutoScrolling': {
      handler: function handler(nV, oV) {
        this.$store.commit('setAutoPlaying', nV);
      },
      deep: true
    }
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_vuex__["b" /* mapGetters */])(['currentClass', 'courseContent'])),
  methods: {
    leaveClass: function leaveClass() {
      this.$store.dispatch('getSpec', undefined);
    },
    toMessage: function toMessage(query) {
      var _this = this;

      if (query.class && query.content) {
        this.$store.dispatch('getSpec', query.class);

        setTimeout(function () {
          var scrollPoint = _this.$store.state.scrollPoints[query.content];
          _this.$refs.main.scrollTop = scrollPoint.top + query.segment * (158.0 * 0.2);
        }, 1000);
      } else {
        this.$log.info('No query passed');
      }
    }
  }
});

/***/ }),
/* 639 */,
/* 640 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__store_mutation_types__ = __webpack_require__(1);







/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'like-indicator',
  props: ['contentSlug', 'classSlug', 'haveliked', 'likes'],
  created: function created() {
    this.hasLiked = this.haveliked;
    this.likeCount = this.likes;
  },
  data: function data() {
    return {
      firstTime: false,
      hasLiked: false,
      likeCount: 0
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_vuex__["b" /* mapGetters */])(['isRegistered'])),
  methods: {
    showAuth: function showAuth() {
      this.$store.commit(__WEBPACK_IMPORTED_MODULE_3__store_mutation_types__["l" /* SHOW_AUTH */]);
    },
    toggleLike: function toggleLike() {
      var _this = this;

      if (this.firstTime) {
        this.showModal();
        return;
      }

      if (!this.isRegistered) {
        this.showAuth();
        return;
      }

      var request = { class: this.classSlug, content: this.contentSlug };

      if (this.haveliked) {
        __WEBPACK_IMPORTED_MODULE_1__api__["a" /* default */].like.unlikeContent(request, function (response) {
          _this.$log.info('Response from unlike request - \'' + _this.contentSlug + '\'');
          _this.$log.info(response);
          _this.likeCount = _this.likeCount - 1;
          _this.$emit('update:hasLiked', false);
          _this.$emit('update:likeCount', _this.likeCount);
        }, function (response) {
          _this.$log.info('Failed to unlike content - \'' + _this.contentSlug + '\'');
        });
      } else {
        __WEBPACK_IMPORTED_MODULE_1__api__["a" /* default */].like.likeContent(request, function (response) {
          _this.$log.info('Response from like request - \'' + _this.contentSlug + '\'');
          _this.$log.info(response);
          _this.likeCount = _this.likeCount + 1;
          _this.$emit('update:hasLiked', true);
          _this.$emit('update:likeCount', _this.likeCount);
        }, function (response) {
          _this.$log.info('Failed to like content - \'' + _this.contentSlug + '\'');
        });
      }
    },
    showModal: function showModal() {
      this.$store.commit(__WEBPACK_IMPORTED_MODULE_3__store_mutation_types__["w" /* SHOW_LIKE */]);
    },
    hideModal: function hideModal() {
      this.getLikeCount();
      this.$store.commit(__WEBPACK_IMPORTED_MODULE_3__store_mutation_types__["b" /* DISMISS_LIKE */]);
    },
    getLikeCount: function getLikeCount() {
      var _this2 = this;

      var request = { class: this.classSlug, content: this.contentSlug };
      __WEBPACK_IMPORTED_MODULE_1__api__["a" /* default */].course.getLikeCount(request, function (response) {
        _this2.$log.info('123Response from like count request - \'' + _this2.contentSlug + '\'');
        _this2.$log.info(response);
      }, function (response) {
        _this2.$log.info('Failed to retrieve like count for \'' + _this2.contentSlug + '\'');
      });
    }
  }
});

/***/ }),
/* 641 */,
/* 642 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_core__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_markdown_it__ = __webpack_require__(499);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_markdown_it___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_markdown_it__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_markdown_it_replace_link__ = __webpack_require__(504);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_markdown_it_replace_link___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_markdown_it_replace_link__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_markdown_it_video__ = __webpack_require__(505);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_markdown_it_video___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_markdown_it_video__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_markdown_it_front_matter__ = __webpack_require__(503);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_markdown_it_front_matter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_markdown_it_front_matter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_markdown_it_custom_block__ = __webpack_require__(502);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_markdown_it_custom_block___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_markdown_it_custom_block__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__api__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__store_mutation_types__ = __webpack_require__(1);
















/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'markdown-content',
  props: ['markdown'],
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_vuex__["b" /* mapGetters */])(['course']), {
    renderedMarkdown: function renderedMarkdown() {

      var md = new __WEBPACK_IMPORTED_MODULE_4_markdown_it___default.a().use(__WEBPACK_IMPORTED_MODULE_8_markdown_it_custom_block___default.a, {
        testexample: function testexample(arg) {
          return '<h1>' + arg + '</h1>';
        },
        bio: function bio(arg) {
          if (!arg) {
            return 'loading...';
          }

          var parts = arg.split('|');

          var caption = parts[0].trim();
          var image = parts[1].trim();

          if (parts.length > 2) {
            var bio = parts[2].trim();
            var link = parts[3].trim();

            return '\n              <div class="md-bio md-bio--with-bio">\n                <img class="md-bio--image" src="' + image + '" />\n                <div class="md-bio--content">\n                  <h5 class="md-bio--caption">' + caption + '</h5>\n                  <p class="md-bio--bio">' + bio + '</p>\n                  <a href="' + link + '" target="_blank" class="md-bio--link">' + link + '</a>\n                </div>\n              </div>\n              ';
          } else {

            return '\n              <div class="md-bio">\n                <img class="md-bio--image" src="' + image + '" />\n                <h5 class="md-bio--caption">' + caption + '</h5>\n              </div>\n              ';
          }
        }
      });

      return md.render(this.markdown.replace("@", "\n\n@"));
    }
  })
});

/***/ }),
/* 643 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_core__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__store_mutation_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vue_awesome_icons_angle_right__ = __webpack_require__(591);









/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'markdown-link',
  props: ['mdContent'],
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_vuex__["b" /* mapGetters */])(['isRegistered']), {
    url: function url() {
      var encodedURI = encodeURIComponent(this.$store.getters.currentClass.dir + '/' + this.mdContent.url);
      return '/markdown/' + encodedURI;
    }
  }),
  methods: {
    showAuth: function showAuth() {
      this.$store.commit(__WEBPACK_IMPORTED_MODULE_3__store_mutation_types__["l" /* SHOW_AUTH */]);
    }
  }
});

/***/ }),
/* 644 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_awesome_swiper__ = __webpack_require__(148);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vue_awesome_swiper___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_vue_awesome_swiper__);






__webpack_require__(728);

/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'media-carousel',
  props: ['media'],
  components: {
    swiper: __WEBPACK_IMPORTED_MODULE_2_vue_awesome_swiper__["swiper"],
    swiperSlide: __WEBPACK_IMPORTED_MODULE_2_vue_awesome_swiper__["swiperSlide"]
  },
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_vuex__["b" /* mapGetters */])(['course'])),
  data: function data() {
    return {
      swiperOption: {
        nextButton: '.swiper-button-next',
        prevButton: '.swiper-button-prev',
        slidesPerView: 1,
        centeredSlides: true,
        spaceBetween: 0,
        loop: true,
        paginationClickable: true,
        preloadImages: false,
        lazyLoading: true
      }
    };
  }
});

/***/ }),
/* 645 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'media-thumbnails',
  props: ['thumbnails']
});

/***/ }),
/* 646 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'soundcloud-embed',
  props: ['soundcloudSrc'],
  computed: {
    src: function src() {
      return 'https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/' + this.soundcloudSrc;
    }
  }
});

/***/ }),
/* 647 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'submission-grid',
  props: ['content'],
  methods: {
    viewSubmissions: function viewSubmissions() {
      this.$router.push('/feedback/browse/' + this.$store.getters.currentClass.slug + '/' + this.content.slug);
    }
  }
});

/***/ }),
/* 648 */,
/* 649 */,
/* 650 */,
/* 651 */,
/* 652 */,
/* 653 */,
/* 654 */,
/* 655 */,
/* 656 */,
/* 657 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__store_mutation_types__ = __webpack_require__(1);






/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'join-banner',
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_vuex__["b" /* mapGetters */])(['isRegistered'])),
  methods: {
    attemptAuth: function attemptAuth() {
      this.$store.commit('attemptAuth');
    }
  }
});

/***/ }),
/* 658 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator__ = __webpack_require__(142);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_filter__ = __webpack_require__(603);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_filter___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_filter__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__store_mutation_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment_mini__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_moment_mini___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_moment_mini__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__mixins_Auth__ = __webpack_require__(144);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_MarkdownRenderer__ = __webpack_require__(506);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_MarkdownRenderer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__components_MarkdownRenderer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_MarkdownContent__ = __webpack_require__(854);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_MarkdownContent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__components_MarkdownContent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_MarkdownLink__ = __webpack_require__(855);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_MarkdownLink___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__components_MarkdownLink__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_SoundcloudEmbed__ = __webpack_require__(858);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_SoundcloudEmbed___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__components_SoundcloudEmbed__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_VideoEmbed__ = __webpack_require__(610);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__components_VideoEmbed___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_11__components_VideoEmbed__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_LikeIndicator__ = __webpack_require__(853);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__components_LikeIndicator___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_12__components_LikeIndicator__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_conversation_LiveClass__ = __webpack_require__(871);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__components_conversation_LiveClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_13__components_conversation_LiveClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_conversation_Homework__ = __webpack_require__(869);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__components_conversation_Homework___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_14__components_conversation_Homework__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_conversation_FourCorners__ = __webpack_require__(867);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__components_conversation_FourCorners___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_15__components_conversation_FourCorners__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_conversation_FutureContent__ = __webpack_require__(868);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__components_conversation_FutureContent___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_16__components_conversation_FutureContent__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_conversation_InjectedQuestion__ = __webpack_require__(870);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__components_conversation_InjectedQuestion___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_17__components_conversation_InjectedQuestion__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__components_conversation_NextClass__ = __webpack_require__(873);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__components_conversation_NextClass___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_18__components_conversation_NextClass__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__components_webinar_WebinarMessageTicker__ = __webpack_require__(880);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__components_webinar_WebinarMessageTicker___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_19__components_webinar_WebinarMessageTicker__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__components_banners_JoinBanner__ = __webpack_require__(865);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__components_banners_JoinBanner___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_20__components_banners_JoinBanner__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__components_MediaCarousel__ = __webpack_require__(856);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__components_MediaCarousel___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_21__components_MediaCarousel__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__components_MediaThumbnails__ = __webpack_require__(857);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__components_MediaThumbnails___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_22__components_MediaThumbnails__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__components_MessageComposer__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__components_MessageComposer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_23__components_MessageComposer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__components_fourcorners_FourCornersLink__ = __webpack_require__(611);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__components_fourcorners_FourCornersLink___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_24__components_fourcorners_FourCornersLink__);































/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'course-content',
  mixins: [__WEBPACK_IMPORTED_MODULE_6__mixins_Auth__["a" /* default */]],
  props: ['courseContent'],
  components: {
    LiveClass: __WEBPACK_IMPORTED_MODULE_13__components_conversation_LiveClass___default.a,
    MarkdownContent: __WEBPACK_IMPORTED_MODULE_8__components_MarkdownContent___default.a,
    MarkdownLink: __WEBPACK_IMPORTED_MODULE_9__components_MarkdownLink___default.a,
    VideoEmbed: __WEBPACK_IMPORTED_MODULE_11__components_VideoEmbed___default.a,
    SoundcloudEmbed: __WEBPACK_IMPORTED_MODULE_10__components_SoundcloudEmbed___default.a,
    LikeIndicator: __WEBPACK_IMPORTED_MODULE_12__components_LikeIndicator___default.a,
    Homework: __WEBPACK_IMPORTED_MODULE_14__components_conversation_Homework___default.a,
    FourCorners: __WEBPACK_IMPORTED_MODULE_15__components_conversation_FourCorners___default.a,
    FutureContent: __WEBPACK_IMPORTED_MODULE_16__components_conversation_FutureContent___default.a,
    MarkdownRenderer: __WEBPACK_IMPORTED_MODULE_7__components_MarkdownRenderer___default.a,
    InjectedQuestion: __WEBPACK_IMPORTED_MODULE_17__components_conversation_InjectedQuestion___default.a,
    NextClass: __WEBPACK_IMPORTED_MODULE_18__components_conversation_NextClass___default.a,
    MessageComposer: __WEBPACK_IMPORTED_MODULE_23__components_MessageComposer___default.a,
    WebinarMessageTicker: __WEBPACK_IMPORTED_MODULE_19__components_webinar_WebinarMessageTicker___default.a,
    JoinBanner: __WEBPACK_IMPORTED_MODULE_20__components_banners_JoinBanner___default.a,
    MediaCarousel: __WEBPACK_IMPORTED_MODULE_21__components_MediaCarousel___default.a,
    MediaThumbnails: __WEBPACK_IMPORTED_MODULE_22__components_MediaThumbnails___default.a,
    FourCornersLink: __WEBPACK_IMPORTED_MODULE_24__components_fourcorners_FourCornersLink___default.a
  },
  created: function created() {
    var _this = this;

    this.$store.dispatch('getCourse').then(function () {
      setTimeout(function () {
        _this.viewCurrentClass();
      }, 500);
    });
  },

  computed: __WEBPACK_IMPORTED_MODULE_1_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_vuex__["b" /* mapGetters */])(['course', 'currentClass']), {
    infoMarkdown: function infoMarkdown() {
      if (!this.course.baseUri) return undefined;
      return this.course.baseUri + '/info.md';
    },
    isIntroduction: function isIntroduction() {
      return this.currentClass && this.currentClass.slug === 'intro';
    },
    releasedContent: function releasedContent() {
      return __WEBPACK_IMPORTED_MODULE_2_lodash_filter___default()(this.courseContent, function (o) {
        return o.status === 'RELEASED';
      });
    },
    futureContent: function futureContent() {
      return __WEBPACK_IMPORTED_MODULE_2_lodash_filter___default()(this.courseContent, function (o) {
        return o.status === 'FUTURE';
      });
    }
  }),
  methods: {
    showAuth: function showAuth() {
      this.$store.commit(__WEBPACK_IMPORTED_MODULE_4__store_mutation_types__["l" /* SHOW_AUTH */]);
    },
    viewCurrentClass: function viewCurrentClass() {
      if (!this.course) {
        return;
      }
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = __WEBPACK_IMPORTED_MODULE_0_babel_runtime_core_js_get_iterator___default()(this.course.classes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var theClass = _step.value;

          if (theClass.status === 'CURRENT') {
            this.$store.dispatch('getSpec', theClass.slug);
          }
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }
});

/***/ }),
/* 659 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'four-corners',
  props: ['content'],
  data: function data() {
    return {
      expanded: false,
      tease: false,
      bannerText: 'Tap the bottom right corner to learn how FourCorners offers a new way of enriching photographs with rich metadata',
      corners: {
        default: {
          icon: 'picture-o',
          title: 'FourCorners',
          text: 'Explore each corner to learn the types of contextual information that can be linked in a FourCorners image'
        },
        topLeft: {
          icon: 'history',
          title: 'Image Context',
          text: 'You can add photographs and video that add more information and context, such as those made before or after the event shown, or from other perspectives, or images that supplement a portrait.'
        },
        topRight: {
          icon: 'share-square',
          title: 'Links',
          text: 'Include links here to websites that contain an accompanying article, related video, historical explanation, or any other contextualizing information; you can also link to the photographer’s website or that of an agency or publication.'
        },
        bottomLeft: {
          icon: 'info-circle',
          title: 'Backstory',
          text: 'Here you can describe in text or video what was going on behind the scenes that is not obvious in the photograph itself, or include the point of view of the subject or a witness.'
        },
        bottomRight: {
          icon: 'copyright',
          title: 'Copyright/License',
          text: 'Here you can specify how you want to protect the copyright of your image, asserting a copyright for yourself or another entity. Alternatively you could add a Creative Commons license.'
        }
      },
      currentCorner: 'default'
    };
  },

  methods: {
    toggleCorner: function toggleCorner(corner) {
      if (this.expanded) {
        if (corner === this.currentCorner) {
          this.currentCorner = 'default';
        } else {
          this.currentCorner = corner;
        }
      } else {
        this.currentCorner = 'bottomRight';
        this.expanded = true;
      }
    }
  }
});

/***/ }),
/* 660 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment_mini__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment_mini___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_moment_mini__);






/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'future-content',
  props: ['content'],
  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_vuex__["b" /* mapGetters */])(['fauxTime', 'currentClass']), {
    releaseIn: function releaseIn() {
      return __WEBPACK_IMPORTED_MODULE_2_moment_mini___default()(this.content.release_at).from(this.fauxTime, true);
    },
    releaseAt: function releaseAt() {
      return __WEBPACK_IMPORTED_MODULE_2_moment_mini___default()(this.content.release_at).format('MMMM Do YYYY, HH:mm');
    },
    time: function time() {
      return __WEBPACK_IMPORTED_MODULE_2_moment_mini___default()(this.fauxTime).format('MMMM Do YYYY, HH:mm');
    }
  }),
  methods: {
    jumpForwardInTime: function jumpForwardInTime() {
      this.$log.info('this.content');
      this.$log.info(this.content);
      var jumpTime = __WEBPACK_IMPORTED_MODULE_2_moment_mini___default()(this.content.release_at);
      jumpTime = jumpTime.add(2, 'hours').format();
      this.$store.commit('setFauxTime', jumpTime);

      this.$store.dispatch('getSpec', this.currentClass.slug);
    }
  }
});

/***/ }),
/* 661 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_core__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api_config__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment_mini__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_moment_mini___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_moment_mini__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_SubmissionGrid__ = __webpack_require__(859);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_SubmissionGrid___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_SubmissionGrid__);









/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'homework',
  props: ['content'],
  components: {
    SubmissionGrid: __WEBPACK_IMPORTED_MODULE_4__components_SubmissionGrid___default.a
  },
  methods: {
    openHomework: function openHomework() {
      this.$router.push('/feedback/browse/' + this.$store.getters.currentClass.slug + '/' + this.content.slug);
    }
  }
});

/***/ }),
/* 662 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_core__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__api__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vue_slider_component__ = __webpack_require__(615);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vue_slider_component___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_vue_slider_component__);








/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'injected-question',
  components: {
    VueSlider: __WEBPACK_IMPORTED_MODULE_4_vue_slider_component___default.a
  },
  props: ['slug'],
  data: function data() {
    return {
      hidden: false,
      question: undefined,
      answer: undefined
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_vuex__["b" /* mapGetters */])(['currentClass', 'isRegistered'])),
  mounted: function mounted() {
    var _this = this;

    var request = { theClass: this.currentClass.slug, slug: this.slug };

    __WEBPACK_IMPORTED_MODULE_3__api__["a" /* default */].question.getQuestion(request, function (response) {
      _this.$log.info(response);
      _this.question = response;
    }, function (response) {
      _this.$log.info('Failed to retrieve question');
    });
  },

  methods: {
    postAnswer: function postAnswer() {
      var _this2 = this;

      var request = {
        class: this.currentClass.slug,
        content: this.slug,
        question_id: this.question.id,
        answer: this.answer
      };

      __WEBPACK_IMPORTED_MODULE_3__api__["a" /* default */].question.postAnswer(request, function (response) {
        _this2.hidden = true;
      }, function (response) {
        _this2.$log.info('Failed to post answer');
      });
    }
  }
});

/***/ }),
/* 663 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_core__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__api_config__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_conversation_ActionPanel__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__components_conversation_ActionPanel___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4__components_conversation_ActionPanel__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_ConversationContainer__ = __webpack_require__(851);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_ConversationContainer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__components_ConversationContainer__);










/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'live-class',
  props: ['content'],
  components: {
    ActionPanel: __WEBPACK_IMPORTED_MODULE_4__components_conversation_ActionPanel___default.a,
    ConversationContainer: __WEBPACK_IMPORTED_MODULE_5__components_ConversationContainer___default.a
  },
  data: function data() {
    return {
      collapsed: true
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_3_vuex__["b" /* mapGetters */])(['activeSegment', 'videoIsActive']))
});

/***/ }),
/* 664 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_core__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_tweet_patch__ = __webpack_require__(790);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_tweet_patch___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_tweet_patch__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment_mini__ = __webpack_require__(46);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_moment_mini___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_moment_mini__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_vue_awesome_icons_heart__ = __webpack_require__(722);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vue_awesome_icons_retweet__ = __webpack_require__(727);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_vue_awesome_icons_reply__ = __webpack_require__(726);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_vue_awesome_icons_twitter__ = __webpack_require__(145);











/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'message',
  props: ['message'],
  computed: {
    html: function html() {
      var urlRegex = /(https?:\/\/[^\s]+)/g;
      var html = this.message.text.replace(urlRegex, '');
      return __WEBPACK_IMPORTED_MODULE_1_tweet_patch___default()(html, { hrefProps: { class: 'tweet-link', target: '_blank' } });
    },
    authorLink: function authorLink() {
      return 'https://twitter.com/' + this.message.author.account;
    },
    tweetLink: function tweetLink() {
      return 'https://twitter.com/statuses/' + this.message.message_id;
    },
    replyLink: function replyLink() {
      return 'https://twitter.com/intent/tweet?in_reply_to=' + this.message.message_id;
    },
    retweetLink: function retweetLink() {
      return 'https://twitter.com/intent/retweet?tweet_id=' + this.message.message_id;
    },
    likeLink: function likeLink() {
      return 'https://twitter.com/intent/like?tweet_id=' + this.message.message_id;
    },
    timeStamp: function timeStamp() {
      return __WEBPACK_IMPORTED_MODULE_2_moment_mini___default()(this.message.createdAt).fromNow();
    }
  }
});

/***/ }),
/* 665 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'mock-message',
  props: ['message']
});

/***/ }),
/* 666 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });


/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'next-class',
  props: ['content']
});

/***/ }),
/* 667 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_core__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_core__);



/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'subtitle',
  props: ['subtitle']
});

/***/ }),
/* 668 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_core__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_core___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_core__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_orderBy__ = __webpack_require__(571);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_orderBy___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash_orderBy__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_vuex__ = __webpack_require__(3);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__api__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__store_mutation_types__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_MessageComposer__ = __webpack_require__(147);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__components_MessageComposer___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7__components_MessageComposer__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_conversation_Subtitle__ = __webpack_require__(874);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__components_conversation_Subtitle___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8__components_conversation_Subtitle__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_conversation_Message__ = __webpack_require__(632);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__components_conversation_Message___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9__components_conversation_Message__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_conversation_MockMessage__ = __webpack_require__(872);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__components_conversation_MockMessage___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_10__components_conversation_MockMessage__);















/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'time-segment',
  props: ['index', 'message', 'subtitle'],
  components: {
    MessageComposer: __WEBPACK_IMPORTED_MODULE_7__components_MessageComposer___default.a,
    Message: __WEBPACK_IMPORTED_MODULE_9__components_conversation_Message___default.a,
    MockMessage: __WEBPACK_IMPORTED_MODULE_10__components_conversation_MockMessage___default.a,
    Subtitle: __WEBPACK_IMPORTED_MODULE_8__components_conversation_Subtitle___default.a
  },
  watch: {
    'activeSegment': {
      handler: function handler(nV, oV) {
        if (oV === this.message.segmentGroup) {
          this.closeSegment();
        }
      },
      deep: false
    },
    'peekSegment': {
      handler: function handler(nV, oV) {
        var _this = this;

        if (nV === this.message.segmentGroup) {

          this.segmentPeeking = this.segmentPeeking ? this.segmentPeeking : true;
        } else if (oV === this.message.segmentGroup) {

          this.segmentStyle = {
            transition: 'all .3s ease',
            position: 'absolute',
            height: '157px',
            'z-index': 56
          };

          setTimeout(function () {
            _this.unpeek();
          }, 50);
        }
      },
      deep: false
    }
  },
  data: function data() {
    return {
      segmentExpanded: false,
      segmentOpened: false,
      segmentPeeking: false,
      loadingMessages: false,
      segmentStyle: {},
      calculatedOffset: 0,
      calculatedOffsetBottom: 0
    };
  },

  computed: __WEBPACK_IMPORTED_MODULE_0_babel_runtime_helpers_extends___default()({}, __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_4_vuex__["b" /* mapGetters */])(['activeSegment', 'peekSegment', 'currentSegmentGroup', 'activeSegmentMessages']), {
    orderedMessages: function orderedMessages() {
      return __WEBPACK_IMPORTED_MODULE_3_lodash_orderBy___default()(this.activeSegmentMessages, ['createdAt'], ['asc']);
    },
    isCurrent: function isCurrent() {
      return this.currentSegmentGroup === this.message.segmentGroup;
    }
  }),
  methods: {
    peek: function peek() {

      if (!this.segmentOpened) {

        this.segmentStyle = {
          transition: 'height .3s ease'
        };

        this.$store.commit(__WEBPACK_IMPORTED_MODULE_6__store_mutation_types__["e" /* PAUSE_VIDEO */]);
        this.$store.commit(__WEBPACK_IMPORTED_MODULE_6__store_mutation_types__["s" /* SET_PEEK_SEGMENT */], this.message.segmentGroup);
      }
    },
    unpeek: function unpeek() {
      var _this2 = this;

      this.$store.commit(__WEBPACK_IMPORTED_MODULE_6__store_mutation_types__["f" /* PLAY_VIDEO */]);

      this.segmentStyle = {
        position: 'absolute',
        height: '157px',
        'z-index': 56
      };

      setTimeout(function () {

        _this2.segmentStyle = {};
        _this2.segmentOpened = _this2.segmentPeeking = false;
        _this2.$store.commit(__WEBPACK_IMPORTED_MODULE_6__store_mutation_types__["s" /* SET_PEEK_SEGMENT */], undefined);
      }, 300);
    },
    openSegment: function openSegment() {
      var _this3 = this;

      if (this.segmentOpened) {
        return;
      }

      this.$store.commit(__WEBPACK_IMPORTED_MODULE_6__store_mutation_types__["x" /* SET_SEGMENT_MESSAGES */], []);

      this.loadingMessages = true;

      this.$store.commit(__WEBPACK_IMPORTED_MODULE_6__store_mutation_types__["r" /* SET_ACTIVE_SEGMENT */], this.message.segmentGroup);

      var calculatedOffset = document.getElementsByClassName('peek')[0].getBoundingClientRect().top;
      var calculatedOffsetBottom = window.innerHeight - document.getElementsByClassName('peek')[0].getBoundingClientRect().bottom;

      this.calculatedOffset = calculatedOffset;
      this.calculatedOffsetBottom = calculatedOffsetBottom;

      this.segmentStyle = {
        top: calculatedOffset + 'px',
        bottom: calculatedOffsetBottom + 'px',
        position: 'fixed'
      };

      setTimeout(function () {
        _this3.segmentOpened = true;
        _this3.segmentStyle = {
          transition: 'all .3s ease',
          top: '60px',
          bottom: '10px',
          position: 'fixed'
        };

        setTimeout(function () {
          _this3.loadSegmentMessages();
        }, 300);
      }, 50);
    },
    closeSegment: function closeSegment() {
      var _this4 = this;

      if (this.opened) {
        return;
      }

      this.$store.commit(__WEBPACK_IMPORTED_MODULE_6__store_mutation_types__["x" /* SET_SEGMENT_MESSAGES */], []);

      this.segmentStyle = {
        transition: 'all .3s ease',
        top: this.calculatedOffset + 'px',
        bottom: this.calculatedOffsetBottom + 90 + 'px',
        position: 'fixed'
      };

      setTimeout(function () {
        _this4.unpeek();
      }, 300);
    },
    loadSegmentMessages: function loadSegmentMessages() {
      var _this5 = this;

      __WEBPACK_IMPORTED_MODULE_1_vue__["default"].$log.info('Loading segment messages');

      this.loadingMessages = true;

      var theContent = this.message.message && this.message.message.content ? this.message.message.content : this.$store.getters.currentSection.slug;

      var theRequest = {
        theClass: this.$store.getters.currentClass.slug,
        theContent: theContent,
        startSegment: '' + parseInt(this.message.segmentGroup) / 0.2,
        endSegment: '' + (parseInt(this.message.segmentGroup) / 0.2 + 4)
      };

      __WEBPACK_IMPORTED_MODULE_5__api__["a" /* default */].message.getMessages(theRequest, function (response) {
        _this5.$store.commit(__WEBPACK_IMPORTED_MODULE_6__store_mutation_types__["x" /* SET_SEGMENT_MESSAGES */], response.data);
        _this5.loadingMessages = false;
      }, function (response) {
        alert('There was an error');
        _this5.$store.commit(__WEBPACK_IMPORTED_MODULE_6__store_mutation_types__["x" /* SET_SEGMENT_MESSAGES */], []);
        _this5.loadingMessages = false;
      });
    }
  }
});

/***/ }),
/* 669 */,
/* 670 */,
/* 671 */,
/* 672 */,
/* 673 */,
/* 674 */,
/* 675 */,
/* 676 */,
/* 677 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_vue__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__api__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_take__ = __webpack_require__(777);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_take___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_take__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_reverse__ = __webpack_require__(776);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_lodash_reverse___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_lodash_reverse__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_orderBy__ = __webpack_require__(571);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_orderBy___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_lodash_orderBy__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_conversation_Message__ = __webpack_require__(632);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__components_conversation_Message___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5__components_conversation_Message__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__mixins_Messages__ = __webpack_require__(617);











/* harmony default export */ __webpack_exports__["default"] = ({
  name: 'webinar-message-ticker',
  props: ['classSlug', 'contentSlug'],
  components: {
    Message: __WEBPACK_IMPORTED_MODULE_5__components_conversation_Message___default.a
  },
  mixins: [__WEBPACK_IMPORTED_MODULE_6__mixins_Messages__["a" /* default */]],
  created: function created() {
    var _this = this;

    setTimeout(function () {
      _this.fetchMessages();
    }, 2000);
  },
  data: function data() {
    return {
      webinarMessages: []
    };
  },

  computed: {
    orderedMessages: function orderedMessages() {
      return __WEBPACK_IMPORTED_MODULE_3_lodash_reverse___default()(__WEBPACK_IMPORTED_MODULE_2_lodash_take___default()(__WEBPACK_IMPORTED_MODULE_4_lodash_orderBy___default()(this.webinarMessages, ['createdAt'], ['desc']), 3));
    }
  },
  methods: {
    fetchMessages: function fetchMessages() {
      var _this2 = this;

      var theRequest = {
        theClass: this.classSlug,
        theContent: this.contentSlug
      };

      __WEBPACK_IMPORTED_MODULE_1__api__["a" /* default */].message.getContentMessages(theRequest, function (response) {
        _this2.loadingMessages = false;
        _this2.webinarMessages = response.data;
      }, function (response) {
        alert('There was an error');
        _this2.loadingMessages = false;
      });
    }
  }
});

/***/ }),
/* 678 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".swiper-container{margin-left:auto;margin-right:auto;position:relative;overflow:hidden;z-index:1}.swiper-container-no-flexbox .swiper-slide{float:left}.swiper-container-vertical>.swiper-wrapper{-webkit-box-orient:vertical;-moz-box-orient:vertical;-ms-flex-direction:column;-webkit-flex-direction:column;flex-direction:column}.swiper-wrapper{position:relative;width:100%;height:100%;z-index:1;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-transition-property:-webkit-transform;-moz-transition-property:-moz-transform;-o-transition-property:-o-transform;-ms-transition-property:-ms-transform;transition-property:transform;-webkit-box-sizing:content-box;-moz-box-sizing:content-box;box-sizing:content-box}.swiper-container-android .swiper-slide,.swiper-wrapper{-webkit-transform:translateZ(0);-moz-transform:translateZ(0);-o-transform:translate(0);-ms-transform:translateZ(0);transform:translateZ(0)}.swiper-container-multirow>.swiper-wrapper{-webkit-box-lines:multiple;-moz-box-lines:multiple;-ms-flex-wrap:wrap;-webkit-flex-wrap:wrap;flex-wrap:wrap}.swiper-container-free-mode>.swiper-wrapper{-webkit-transition-timing-function:ease-out;-moz-transition-timing-function:ease-out;-ms-transition-timing-function:ease-out;-o-transition-timing-function:ease-out;transition-timing-function:ease-out;margin:0 auto}.swiper-slide{-webkit-flex-shrink:0;-ms-flex:0 0 auto;flex-shrink:0;width:100%;height:100%;position:relative}.swiper-container-autoheight,.swiper-container-autoheight .swiper-slide{height:auto}.swiper-container-autoheight .swiper-wrapper{-webkit-box-align:start;-ms-flex-align:start;-webkit-align-items:flex-start;align-items:flex-start;-webkit-transition-property:-webkit-transform,height;-moz-transition-property:-moz-transform;-o-transition-property:-o-transform;-ms-transition-property:-ms-transform;transition-property:transform,height}.swiper-container .swiper-notification{position:absolute;left:0;top:0;pointer-events:none;opacity:0;z-index:-1000}.swiper-wp8-horizontal{-ms-touch-action:pan-y;touch-action:pan-y}.swiper-wp8-vertical{-ms-touch-action:pan-x;touch-action:pan-x}.swiper-button-next,.swiper-button-prev{position:absolute;top:50%;width:27px;height:44px;margin-top:-22px;z-index:10;cursor:pointer;-moz-background-size:27px 44px;-webkit-background-size:27px 44px;background-size:27px 44px;background-position:50%;background-repeat:no-repeat}.swiper-button-next.swiper-button-disabled,.swiper-button-prev.swiper-button-disabled{opacity:.35;cursor:auto;pointer-events:none}.swiper-button-prev,.swiper-container-rtl .swiper-button-next{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M0 22L22 0l2.1 2.1L4.2 22l19.9 19.9L22 44 0 22z' fill='%23007aff'/%3E%3C/svg%3E\");left:10px;right:auto}.swiper-button-prev.swiper-button-black,.swiper-container-rtl .swiper-button-next.swiper-button-black{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M0 22L22 0l2.1 2.1L4.2 22l19.9 19.9L22 44 0 22z'/%3E%3C/svg%3E\")}.swiper-button-prev.swiper-button-white,.swiper-container-rtl .swiper-button-next.swiper-button-white{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M0 22L22 0l2.1 2.1L4.2 22l19.9 19.9L22 44 0 22z' fill='%23fff'/%3E%3C/svg%3E\")}.swiper-button-next,.swiper-container-rtl .swiper-button-prev{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M27 22L5 44l-2.1-2.1L22.8 22 2.9 2.1 5 0l22 22z' fill='%23007aff'/%3E%3C/svg%3E\");right:10px;left:auto}.swiper-button-next.swiper-button-black,.swiper-container-rtl .swiper-button-prev.swiper-button-black{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M27 22L5 44l-2.1-2.1L22.8 22 2.9 2.1 5 0l22 22z'/%3E%3C/svg%3E\")}.swiper-button-next.swiper-button-white,.swiper-container-rtl .swiper-button-prev.swiper-button-white{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 27 44'%3E%3Cpath d='M27 22L5 44l-2.1-2.1L22.8 22 2.9 2.1 5 0l22 22z' fill='%23fff'/%3E%3C/svg%3E\")}.swiper-pagination{position:absolute;text-align:center;-webkit-transition:.3s;-moz-transition:.3s;-o-transition:.3s;transition:.3s;-webkit-transform:translateZ(0);-ms-transform:translateZ(0);-o-transform:translateZ(0);transform:translateZ(0);z-index:10}.swiper-pagination.swiper-pagination-hidden{opacity:0}.swiper-container-horizontal>.swiper-pagination-bullets,.swiper-pagination-custom,.swiper-pagination-fraction{bottom:10px;left:0;width:100%}.swiper-pagination-bullet{width:8px;height:8px;display:inline-block;border-radius:100%;background:#000;opacity:.2}button.swiper-pagination-bullet{border:none;margin:0;padding:0;box-shadow:none;-moz-appearance:none;-ms-appearance:none;-webkit-appearance:none;appearance:none}.swiper-pagination-clickable .swiper-pagination-bullet{cursor:pointer}.swiper-pagination-white .swiper-pagination-bullet{background:#fff}.swiper-pagination-bullet-active{opacity:1;background:#007aff}.swiper-pagination-white .swiper-pagination-bullet-active{background:#fff}.swiper-pagination-black .swiper-pagination-bullet-active{background:#000}.swiper-container-vertical>.swiper-pagination-bullets{right:10px;top:50%;-webkit-transform:translate3d(0,-50%,0);-moz-transform:translate3d(0,-50%,0);-o-transform:translateY(-50%);-ms-transform:translate3d(0,-50%,0);transform:translate3d(0,-50%,0)}.swiper-container-vertical>.swiper-pagination-bullets .swiper-pagination-bullet{margin:5px 0;display:block}.swiper-container-horizontal>.swiper-pagination-bullets .swiper-pagination-bullet{margin:0 5px}.swiper-pagination-progress{background:rgba(0,0,0,.25);position:absolute}.swiper-pagination-progress .swiper-pagination-progressbar{background:#007aff;position:absolute;left:0;top:0;width:100%;height:100%;-webkit-transform:scale(0);-ms-transform:scale(0);-o-transform:scale(0);transform:scale(0);-webkit-transform-origin:left top;-moz-transform-origin:left top;-ms-transform-origin:left top;-o-transform-origin:left top;transform-origin:left top}.swiper-container-rtl .swiper-pagination-progress .swiper-pagination-progressbar{-webkit-transform-origin:right top;-moz-transform-origin:right top;-ms-transform-origin:right top;-o-transform-origin:right top;transform-origin:right top}.swiper-container-horizontal>.swiper-pagination-progress{width:100%;height:4px;left:0;top:0}.swiper-container-vertical>.swiper-pagination-progress{width:4px;height:100%;left:0;top:0}.swiper-pagination-progress.swiper-pagination-white{background:hsla(0,0%,100%,.5)}.swiper-pagination-progress.swiper-pagination-white .swiper-pagination-progressbar{background:#fff}.swiper-pagination-progress.swiper-pagination-black .swiper-pagination-progressbar{background:#000}.swiper-container-3d{-webkit-perspective:1200px;-moz-perspective:1200px;-o-perspective:1200px;perspective:1200px}.swiper-container-3d .swiper-cube-shadow,.swiper-container-3d .swiper-slide,.swiper-container-3d .swiper-slide-shadow-bottom,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-top,.swiper-container-3d .swiper-wrapper{-webkit-transform-style:preserve-3d;-moz-transform-style:preserve-3d;-ms-transform-style:preserve-3d;transform-style:preserve-3d}.swiper-container-3d .swiper-slide-shadow-bottom,.swiper-container-3d .swiper-slide-shadow-left,.swiper-container-3d .swiper-slide-shadow-right,.swiper-container-3d .swiper-slide-shadow-top{position:absolute;left:0;top:0;width:100%;height:100%;pointer-events:none;z-index:10}.swiper-container-3d .swiper-slide-shadow-left{background-image:-webkit-gradient(linear,left top,right top,from(rgba(0,0,0,.5)),to(transparent));background-image:-webkit-linear-gradient(right,rgba(0,0,0,.5),transparent);background-image:-moz-linear-gradient(right,rgba(0,0,0,.5),transparent);background-image:-o-linear-gradient(right,rgba(0,0,0,.5),transparent);background-image:linear-gradient(270deg,rgba(0,0,0,.5),transparent)}.swiper-container-3d .swiper-slide-shadow-right{background-image:-webkit-gradient(linear,right top,left top,from(rgba(0,0,0,.5)),to(transparent));background-image:-webkit-linear-gradient(left,rgba(0,0,0,.5),transparent);background-image:-moz-linear-gradient(left,rgba(0,0,0,.5),transparent);background-image:-o-linear-gradient(left,rgba(0,0,0,.5),transparent);background-image:linear-gradient(90deg,rgba(0,0,0,.5),transparent)}.swiper-container-3d .swiper-slide-shadow-top{background-image:-webkit-gradient(linear,left top,left bottom,from(rgba(0,0,0,.5)),to(transparent));background-image:-webkit-linear-gradient(bottom,rgba(0,0,0,.5),transparent);background-image:-moz-linear-gradient(bottom,rgba(0,0,0,.5),transparent);background-image:-o-linear-gradient(bottom,rgba(0,0,0,.5),transparent);background-image:linear-gradient(0deg,rgba(0,0,0,.5),transparent)}.swiper-container-3d .swiper-slide-shadow-bottom{background-image:-webkit-gradient(linear,left bottom,left top,from(rgba(0,0,0,.5)),to(transparent));background-image:-webkit-linear-gradient(top,rgba(0,0,0,.5),transparent);background-image:-moz-linear-gradient(top,rgba(0,0,0,.5),transparent);background-image:-o-linear-gradient(top,rgba(0,0,0,.5),transparent);background-image:linear-gradient(180deg,rgba(0,0,0,.5),transparent)}.swiper-container-coverflow .swiper-wrapper,.swiper-container-flip .swiper-wrapper{-ms-perspective:1200px}.swiper-container-cube,.swiper-container-flip{overflow:visible}.swiper-container-cube .swiper-slide,.swiper-container-flip .swiper-slide{pointer-events:none;-webkit-backface-visibility:hidden;-moz-backface-visibility:hidden;-ms-backface-visibility:hidden;backface-visibility:hidden;z-index:1}.swiper-container-cube .swiper-slide .swiper-slide,.swiper-container-flip .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-cube .swiper-slide-active,.swiper-container-cube .swiper-slide-active .swiper-slide-active,.swiper-container-flip .swiper-slide-active,.swiper-container-flip .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-container-cube .swiper-slide-shadow-bottom,.swiper-container-cube .swiper-slide-shadow-left,.swiper-container-cube .swiper-slide-shadow-right,.swiper-container-cube .swiper-slide-shadow-top,.swiper-container-flip .swiper-slide-shadow-bottom,.swiper-container-flip .swiper-slide-shadow-left,.swiper-container-flip .swiper-slide-shadow-right,.swiper-container-flip .swiper-slide-shadow-top{z-index:0;-webkit-backface-visibility:hidden;-moz-backface-visibility:hidden;-ms-backface-visibility:hidden;backface-visibility:hidden}.swiper-container-cube .swiper-slide{visibility:hidden;-webkit-transform-origin:0 0;-moz-transform-origin:0 0;-ms-transform-origin:0 0;transform-origin:0 0;width:100%;height:100%}.swiper-container-cube.swiper-container-rtl .swiper-slide{-webkit-transform-origin:100% 0;-moz-transform-origin:100% 0;-ms-transform-origin:100% 0;transform-origin:100% 0}.swiper-container-cube .swiper-slide-active,.swiper-container-cube .swiper-slide-next,.swiper-container-cube .swiper-slide-next+.swiper-slide,.swiper-container-cube .swiper-slide-prev{pointer-events:auto;visibility:visible}.swiper-container-cube .swiper-cube-shadow{position:absolute;left:0;bottom:0;width:100%;height:100%;background:#000;opacity:.6;-webkit-filter:blur(50px);filter:blur(50px);z-index:0}.swiper-container-fade.swiper-container-free-mode .swiper-slide{-webkit-transition-timing-function:ease-out;-moz-transition-timing-function:ease-out;-ms-transition-timing-function:ease-out;-o-transition-timing-function:ease-out;transition-timing-function:ease-out}.swiper-container-fade .swiper-slide{pointer-events:none;-webkit-transition-property:opacity;-moz-transition-property:opacity;-o-transition-property:opacity;transition-property:opacity}.swiper-container-fade .swiper-slide .swiper-slide{pointer-events:none}.swiper-container-fade .swiper-slide-active,.swiper-container-fade .swiper-slide-active .swiper-slide-active{pointer-events:auto}.swiper-zoom-container{width:100%;height:100%;display:-webkit-box;display:-moz-box;display:-ms-flexbox;display:-webkit-flex;display:flex;-webkit-box-pack:center;-moz-box-pack:center;-ms-flex-pack:center;-webkit-justify-content:center;justify-content:center;-webkit-box-align:center;-moz-box-align:center;-ms-flex-align:center;-webkit-align-items:center;align-items:center;text-align:center}.swiper-zoom-container>canvas,.swiper-zoom-container>img,.swiper-zoom-container>svg{max-width:100%;max-height:100%;object-fit:contain}.swiper-scrollbar{border-radius:10px;position:relative;-ms-touch-action:none;background:rgba(0,0,0,.1)}.swiper-container-horizontal>.swiper-scrollbar{position:absolute;left:1%;bottom:3px;z-index:50;height:5px;width:98%}.swiper-container-vertical>.swiper-scrollbar{position:absolute;right:3px;top:1%;z-index:50;width:5px;height:98%}.swiper-scrollbar-drag{height:100%;width:100%;position:relative;background:rgba(0,0,0,.5);border-radius:10px;left:0;top:0}.swiper-scrollbar-cursor-drag{cursor:move}.swiper-lazy-preloader{width:42px;height:42px;position:absolute;left:50%;top:50%;margin-left:-21px;margin-top:-21px;z-index:10;-webkit-transform-origin:50%;-moz-transform-origin:50%;transform-origin:50%;-webkit-animation:swiper-preloader-spin 1s steps(12) infinite;-moz-animation:swiper-preloader-spin 1s steps(12) infinite;animation:swiper-preloader-spin 1s steps(12) infinite}.swiper-lazy-preloader:after{display:block;content:\"\";width:100%;height:100%;background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3Cpath id='a' stroke='%236c6c6c' stroke-width='11' stroke-linecap='round' d='M60 7v20'/%3E%3C/defs%3E%3Cuse xlink:href='%23a' opacity='.27'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(30 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(60 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(90 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(120 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(150 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.37' transform='rotate(180 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.46' transform='rotate(210 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.56' transform='rotate(240 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.66' transform='rotate(270 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.75' transform='rotate(300 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.85' transform='rotate(330 60 60)'/%3E%3C/svg%3E\");background-position:50%;-webkit-background-size:100%;background-size:100%;background-repeat:no-repeat}.swiper-lazy-preloader-white:after{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg viewBox='0 0 120 120' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink'%3E%3Cdefs%3E%3Cpath id='a' stroke='%23fff' stroke-width='11' stroke-linecap='round' d='M60 7v20'/%3E%3C/defs%3E%3Cuse xlink:href='%23a' opacity='.27'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(30 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(60 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(90 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(120 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.27' transform='rotate(150 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.37' transform='rotate(180 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.46' transform='rotate(210 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.56' transform='rotate(240 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.66' transform='rotate(270 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.75' transform='rotate(300 60 60)'/%3E%3Cuse xlink:href='%23a' opacity='.85' transform='rotate(330 60 60)'/%3E%3C/svg%3E\")}@-webkit-keyframes swiper-preloader-spin{to{-webkit-transform:rotate(1turn)}}@keyframes swiper-preloader-spin{to{transform:rotate(1turn)}}", "", {"version":3,"sources":["/root/connectedacademy/node_modules/swiper/dist/css/swiper.css"],"names":[],"mappings":"AAcA,kBACE,iBAAkB,AAClB,kBAAmB,AACnB,kBAAmB,AACnB,gBAAiB,AAEjB,SAAW,CACZ,AACD,2CACE,UAAY,CACb,AACD,2CACE,4BAA6B,AAC7B,yBAA0B,AAC1B,0BAA2B,AAC3B,8BAA+B,AAC/B,qBAAuB,CACxB,AACD,gBACE,kBAAmB,AACnB,WAAY,AACZ,YAAa,AACb,UAAW,AACX,oBAAqB,AACrB,iBAAkB,AAClB,oBAAqB,AACrB,qBAAsB,AACtB,aAAc,AACd,8CAA+C,AAC/C,wCAAyC,AACzC,oCAAqC,AACrC,sCAAuC,AACvC,8BAA+B,AAC/B,+BAAgC,AAChC,4BAA6B,AAC7B,sBAAwB,CACzB,AACD,wDAEE,gCAA0C,AAC1C,6BAAuC,AACvC,0BAAkC,AAClC,4BAAsC,AACtC,uBAAkC,CACnC,AACD,2CACE,2BAA4B,AAC5B,wBAAyB,AACzB,mBAAoB,AACpB,uBAAwB,AACxB,cAAgB,CACjB,AACD,4CACE,4CAA6C,AAC7C,yCAA0C,AAC1C,wCAAyC,AACzC,uCAAwC,AACxC,oCAAqC,AACrC,aAAe,CAChB,AACD,cACE,sBAAuB,AACvB,kBAAmB,AACnB,cAAe,AACf,WAAY,AACZ,YAAa,AACb,iBAAmB,CACpB,AAED,wEAEE,WAAa,CACd,AACD,6CACE,wBAAyB,AACzB,qBAAsB,AACtB,+BAAgC,AAChC,uBAAwB,AACxB,qDAAuD,AACvD,wCAAyC,AACzC,oCAAqC,AACrC,sCAAuC,AACvC,oCAAuC,CACxC,AAED,uCACE,kBAAmB,AACnB,OAAQ,AACR,MAAO,AACP,oBAAqB,AACrB,UAAW,AACX,aAAe,CAChB,AAED,uBACE,uBAAwB,AACxB,kBAAoB,CACrB,AACD,qBACE,uBAAwB,AACxB,kBAAoB,CACrB,AAED,wCAEE,kBAAmB,AACnB,QAAS,AACT,WAAY,AACZ,YAAa,AACb,iBAAkB,AAClB,WAAY,AACZ,eAAgB,AAChB,+BAAgC,AAChC,kCAAmC,AACnC,0BAA2B,AAC3B,wBAA4B,AAC5B,2BAA6B,CAC9B,AACD,sFAEE,YAAc,AACd,YAAa,AACb,mBAAqB,CACtB,AACD,8DAEE,oNAAqR,AACrR,UAAW,AACX,UAAY,CACb,AACD,sGAEE,kMAAqR,CACtR,AACD,sGAEE,gNAAqR,CACtR,AACD,8DAEE,oNAAqR,AACrR,WAAY,AACZ,SAAW,CACZ,AACD,sGAEE,kMAAqR,CACtR,AACD,sGAEE,gNAAqR,CACtR,AAED,mBACE,kBAAmB,AACnB,kBAAmB,AACnB,uBAA0B,AAC1B,oBAAuB,AACvB,kBAAqB,AACrB,eAAkB,AAClB,gCAAwC,AACxC,4BAAoC,AACpC,2BAAmC,AACnC,wBAAgC,AAChC,UAAY,CACb,AACD,4CACE,SAAW,CACZ,AAED,8GAGE,YAAa,AACb,OAAQ,AACR,UAAY,CACb,AAED,0BACE,UAAW,AACX,WAAY,AACZ,qBAAsB,AACtB,mBAAoB,AACpB,gBAAiB,AACjB,UAAa,CACd,AACD,gCACE,YAAa,AACb,SAAU,AACV,UAAW,AACX,gBAAiB,AACjB,qBAAsB,AACtB,oBAAqB,AACrB,wBAAyB,AACzB,eAAiB,CAClB,AACD,uDACE,cAAgB,CACjB,AACD,mDACE,eAAiB,CAClB,AACD,iCACE,UAAW,AACX,kBAAoB,CACrB,AACD,0DACE,eAAiB,CAClB,AACD,0DACE,eAAiB,CAClB,AACD,sDACE,WAAY,AACZ,QAAS,AACT,wCAA6C,AAC7C,qCAA0C,AAC1C,8BAAmC,AACnC,oCAAyC,AACzC,+BAAqC,CACtC,AACD,gFACE,aAAc,AACd,aAAe,CAChB,AACD,kFACE,YAAc,CACf,AAED,4BACE,2BAAgC,AAChC,iBAAmB,CACpB,AACD,2DACE,mBAAoB,AACpB,kBAAmB,AACnB,OAAQ,AACR,MAAO,AACP,WAAY,AACZ,YAAa,AACb,2BAA4B,AAC5B,uBAAwB,AACxB,sBAAuB,AACvB,mBAAoB,AACpB,kCAAmC,AACnC,+BAAgC,AAChC,8BAA+B,AAC/B,6BAA8B,AAC9B,yBAA2B,CAC5B,AACD,iFACE,mCAAoC,AACpC,gCAAiC,AACjC,+BAAgC,AAChC,8BAA+B,AAC/B,0BAA4B,CAC7B,AACD,yDACE,WAAY,AACZ,WAAY,AACZ,OAAQ,AACR,KAAO,CACR,AACD,uDACE,UAAW,AACX,YAAa,AACb,OAAQ,AACR,KAAO,CACR,AACD,oDACE,6BAAqC,CACtC,AACD,mFACE,eAAiB,CAClB,AACD,mFACE,eAAiB,CAClB,AAED,qBACE,2BAA4B,AAC5B,wBAAyB,AACzB,sBAAuB,AACvB,kBAAoB,CACrB,AACD,+SAOE,oCAAqC,AACrC,iCAAkC,AAClC,gCAAiC,AACjC,2BAA6B,CAC9B,AACD,8LAIE,kBAAmB,AACnB,OAAQ,AACR,MAAO,AACP,WAAY,AACZ,YAAa,AACb,oBAAqB,AACrB,UAAY,CACb,AACD,+CACE,kGAAgH,AAEhH,2EAAuF,AAEvF,wEAAoF,AAEpF,sEAAkF,AAElF,mEAAiF,CAElF,AACD,gDACE,kGAAgH,AAEhH,0EAAsF,AAEtF,uEAAmF,AAEnF,qEAAiF,AAEjF,kEAAkF,CAEnF,AACD,8CACE,oGAAkH,AAElH,4EAAwF,AAExF,yEAAqF,AAErF,uEAAmF,AAEnF,iEAAgF,CAEjF,AACD,iDACE,oGAAkH,AAElH,yEAAqF,AAErF,sEAAkF,AAElF,oEAAgF,AAEhF,mEAAmF,CAEpF,AAED,mFAGE,sBAAwB,CACzB,AAED,8CAEE,gBAAkB,CACnB,AACD,0EAEE,oBAAqB,AACrB,mCAAoC,AACpC,gCAAiC,AACjC,+BAAgC,AAChC,2BAA4B,AAC5B,SAAW,CACZ,AACD,sGAEE,mBAAqB,CACtB,AACD,0NAIE,mBAAqB,CACtB,AACD,4YAQE,UAAW,AACX,mCAAoC,AACpC,gCAAiC,AACjC,+BAAgC,AAChC,0BAA4B,CAC7B,AAED,qCACE,kBAAmB,AACnB,6BAA8B,AAC9B,0BAA2B,AAC3B,yBAA0B,AAC1B,qBAAsB,AACtB,WAAY,AACZ,WAAa,CACd,AACD,0DACE,gCAAiC,AACjC,6BAA8B,AAC9B,4BAA6B,AAC7B,uBAAyB,CAC1B,AACD,wLAIE,oBAAqB,AACrB,kBAAoB,CACrB,AACD,2CACE,kBAAmB,AACnB,OAAQ,AACR,SAAY,AACZ,WAAY,AACZ,YAAa,AACb,gBAAiB,AACjB,WAAa,AACb,0BAA2B,AAC3B,kBAAmB,AACnB,SAAW,CACZ,AAED,gEACE,4CAA6C,AAC7C,yCAA0C,AAC1C,wCAAyC,AACzC,uCAAwC,AACxC,mCAAqC,CACtC,AACD,qCACE,oBAAqB,AACrB,oCAAqC,AACrC,iCAAkC,AAClC,+BAAgC,AAChC,2BAA6B,CAC9B,AACD,mDACE,mBAAqB,CACtB,AACD,6GAEE,mBAAqB,CACtB,AACD,uBACE,WAAY,AACZ,YAAa,AACb,oBAAqB,AACrB,iBAAkB,AAClB,oBAAqB,AACrB,qBAAsB,AACtB,aAAc,AACd,wBAAyB,AACzB,qBAAsB,AACtB,qBAAsB,AACtB,+BAAgC,AAChC,uBAAwB,AACxB,yBAA0B,AAC1B,sBAAuB,AACvB,sBAAuB,AACvB,2BAA4B,AAC5B,mBAAoB,AACpB,iBAAmB,CACpB,AACD,oFAGE,eAAgB,AAChB,gBAAiB,AACjB,kBAAoB,CACrB,AAED,kBACE,mBAAoB,AACpB,kBAAmB,AACnB,sBAAuB,AACvB,yBAA+B,CAChC,AACD,+CACE,kBAAmB,AACnB,QAAS,AACT,WAAY,AACZ,WAAY,AACZ,WAAY,AACZ,SAAW,CACZ,AACD,6CACE,kBAAmB,AACnB,UAAW,AACX,OAAQ,AACR,WAAY,AACZ,UAAW,AACX,UAAY,CACb,AACD,uBACE,YAAa,AACb,WAAY,AACZ,kBAAmB,AACnB,0BAA+B,AAC/B,mBAAoB,AACpB,OAAQ,AACR,KAAO,CACR,AACD,8BACE,WAAa,CACd,AAED,uBACE,WAAY,AACZ,YAAa,AACb,kBAAmB,AACnB,SAAU,AACV,QAAS,AACT,kBAAmB,AACnB,iBAAkB,AAClB,WAAY,AACZ,6BAA8B,AAC9B,0BAA2B,AAC3B,qBAAsB,AACtB,8DAAoE,AACpE,2DAAiE,AACjE,qDAA4D,CAC7D,AACD,6BACE,cAAe,AACf,WAAY,AACZ,WAAY,AACZ,YAAa,AACb,gmCAA07C,AAC17C,wBAAyB,AACzB,6BAA8B,AAC9B,qBAAsB,AACtB,2BAA6B,CAC9B,AACD,mCACE,4lCAAu7C,CACx7C,AACD,yCACE,GACE,+BAAkC,CACnC,CACF,AACD,iCACE,GACE,uBAA0B,CAC3B,CACF","file":"swiper.css","sourcesContent":["/**\n * Swiper 3.4.2\n * Most modern mobile touch slider and framework with hardware accelerated transitions\n * \n * http://www.idangero.us/swiper/\n * \n * Copyright 2017, Vladimir Kharlampidi\n * The iDangero.us\n * http://www.idangero.us/\n * \n * Licensed under MIT\n * \n * Released on: March 10, 2017\n */\n.swiper-container {\n  margin-left: auto;\n  margin-right: auto;\n  position: relative;\n  overflow: hidden;\n  /* Fix of Webkit flickering */\n  z-index: 1;\n}\n.swiper-container-no-flexbox .swiper-slide {\n  float: left;\n}\n.swiper-container-vertical > .swiper-wrapper {\n  -webkit-box-orient: vertical;\n  -moz-box-orient: vertical;\n  -ms-flex-direction: column;\n  -webkit-flex-direction: column;\n  flex-direction: column;\n}\n.swiper-wrapper {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  z-index: 1;\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-transition-property: -webkit-transform;\n  -moz-transition-property: -moz-transform;\n  -o-transition-property: -o-transform;\n  -ms-transition-property: -ms-transform;\n  transition-property: transform;\n  -webkit-box-sizing: content-box;\n  -moz-box-sizing: content-box;\n  box-sizing: content-box;\n}\n.swiper-container-android .swiper-slide,\n.swiper-wrapper {\n  -webkit-transform: translate3d(0px, 0, 0);\n  -moz-transform: translate3d(0px, 0, 0);\n  -o-transform: translate(0px, 0px);\n  -ms-transform: translate3d(0px, 0, 0);\n  transform: translate3d(0px, 0, 0);\n}\n.swiper-container-multirow > .swiper-wrapper {\n  -webkit-box-lines: multiple;\n  -moz-box-lines: multiple;\n  -ms-flex-wrap: wrap;\n  -webkit-flex-wrap: wrap;\n  flex-wrap: wrap;\n}\n.swiper-container-free-mode > .swiper-wrapper {\n  -webkit-transition-timing-function: ease-out;\n  -moz-transition-timing-function: ease-out;\n  -ms-transition-timing-function: ease-out;\n  -o-transition-timing-function: ease-out;\n  transition-timing-function: ease-out;\n  margin: 0 auto;\n}\n.swiper-slide {\n  -webkit-flex-shrink: 0;\n  -ms-flex: 0 0 auto;\n  flex-shrink: 0;\n  width: 100%;\n  height: 100%;\n  position: relative;\n}\n/* Auto Height */\n.swiper-container-autoheight,\n.swiper-container-autoheight .swiper-slide {\n  height: auto;\n}\n.swiper-container-autoheight .swiper-wrapper {\n  -webkit-box-align: start;\n  -ms-flex-align: start;\n  -webkit-align-items: flex-start;\n  align-items: flex-start;\n  -webkit-transition-property: -webkit-transform, height;\n  -moz-transition-property: -moz-transform;\n  -o-transition-property: -o-transform;\n  -ms-transition-property: -ms-transform;\n  transition-property: transform, height;\n}\n/* a11y */\n.swiper-container .swiper-notification {\n  position: absolute;\n  left: 0;\n  top: 0;\n  pointer-events: none;\n  opacity: 0;\n  z-index: -1000;\n}\n/* IE10 Windows Phone 8 Fixes */\n.swiper-wp8-horizontal {\n  -ms-touch-action: pan-y;\n  touch-action: pan-y;\n}\n.swiper-wp8-vertical {\n  -ms-touch-action: pan-x;\n  touch-action: pan-x;\n}\n/* Arrows */\n.swiper-button-prev,\n.swiper-button-next {\n  position: absolute;\n  top: 50%;\n  width: 27px;\n  height: 44px;\n  margin-top: -22px;\n  z-index: 10;\n  cursor: pointer;\n  -moz-background-size: 27px 44px;\n  -webkit-background-size: 27px 44px;\n  background-size: 27px 44px;\n  background-position: center;\n  background-repeat: no-repeat;\n}\n.swiper-button-prev.swiper-button-disabled,\n.swiper-button-next.swiper-button-disabled {\n  opacity: 0.35;\n  cursor: auto;\n  pointer-events: none;\n}\n.swiper-button-prev,\n.swiper-container-rtl .swiper-button-next {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23007aff'%2F%3E%3C%2Fsvg%3E\");\n  left: 10px;\n  right: auto;\n}\n.swiper-button-prev.swiper-button-black,\n.swiper-container-rtl .swiper-button-next.swiper-button-black {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23000000'%2F%3E%3C%2Fsvg%3E\");\n}\n.swiper-button-prev.swiper-button-white,\n.swiper-container-rtl .swiper-button-next.swiper-button-white {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M0%2C22L22%2C0l2.1%2C2.1L4.2%2C22l19.9%2C19.9L22%2C44L0%2C22L0%2C22L0%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E\");\n}\n.swiper-button-next,\n.swiper-container-rtl .swiper-button-prev {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23007aff'%2F%3E%3C%2Fsvg%3E\");\n  right: 10px;\n  left: auto;\n}\n.swiper-button-next.swiper-button-black,\n.swiper-container-rtl .swiper-button-prev.swiper-button-black {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23000000'%2F%3E%3C%2Fsvg%3E\");\n}\n.swiper-button-next.swiper-button-white,\n.swiper-container-rtl .swiper-button-prev.swiper-button-white {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2027%2044'%3E%3Cpath%20d%3D'M27%2C22L27%2C22L5%2C44l-2.1-2.1L22.8%2C22L2.9%2C2.1L5%2C0L27%2C22L27%2C22z'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E\");\n}\n/* Pagination Styles */\n.swiper-pagination {\n  position: absolute;\n  text-align: center;\n  -webkit-transition: 300ms;\n  -moz-transition: 300ms;\n  -o-transition: 300ms;\n  transition: 300ms;\n  -webkit-transform: translate3d(0, 0, 0);\n  -ms-transform: translate3d(0, 0, 0);\n  -o-transform: translate3d(0, 0, 0);\n  transform: translate3d(0, 0, 0);\n  z-index: 10;\n}\n.swiper-pagination.swiper-pagination-hidden {\n  opacity: 0;\n}\n/* Common Styles */\n.swiper-pagination-fraction,\n.swiper-pagination-custom,\n.swiper-container-horizontal > .swiper-pagination-bullets {\n  bottom: 10px;\n  left: 0;\n  width: 100%;\n}\n/* Bullets */\n.swiper-pagination-bullet {\n  width: 8px;\n  height: 8px;\n  display: inline-block;\n  border-radius: 100%;\n  background: #000;\n  opacity: 0.2;\n}\nbutton.swiper-pagination-bullet {\n  border: none;\n  margin: 0;\n  padding: 0;\n  box-shadow: none;\n  -moz-appearance: none;\n  -ms-appearance: none;\n  -webkit-appearance: none;\n  appearance: none;\n}\n.swiper-pagination-clickable .swiper-pagination-bullet {\n  cursor: pointer;\n}\n.swiper-pagination-white .swiper-pagination-bullet {\n  background: #fff;\n}\n.swiper-pagination-bullet-active {\n  opacity: 1;\n  background: #007aff;\n}\n.swiper-pagination-white .swiper-pagination-bullet-active {\n  background: #fff;\n}\n.swiper-pagination-black .swiper-pagination-bullet-active {\n  background: #000;\n}\n.swiper-container-vertical > .swiper-pagination-bullets {\n  right: 10px;\n  top: 50%;\n  -webkit-transform: translate3d(0px, -50%, 0);\n  -moz-transform: translate3d(0px, -50%, 0);\n  -o-transform: translate(0px, -50%);\n  -ms-transform: translate3d(0px, -50%, 0);\n  transform: translate3d(0px, -50%, 0);\n}\n.swiper-container-vertical > .swiper-pagination-bullets .swiper-pagination-bullet {\n  margin: 5px 0;\n  display: block;\n}\n.swiper-container-horizontal > .swiper-pagination-bullets .swiper-pagination-bullet {\n  margin: 0 5px;\n}\n/* Progress */\n.swiper-pagination-progress {\n  background: rgba(0, 0, 0, 0.25);\n  position: absolute;\n}\n.swiper-pagination-progress .swiper-pagination-progressbar {\n  background: #007aff;\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  -webkit-transform: scale(0);\n  -ms-transform: scale(0);\n  -o-transform: scale(0);\n  transform: scale(0);\n  -webkit-transform-origin: left top;\n  -moz-transform-origin: left top;\n  -ms-transform-origin: left top;\n  -o-transform-origin: left top;\n  transform-origin: left top;\n}\n.swiper-container-rtl .swiper-pagination-progress .swiper-pagination-progressbar {\n  -webkit-transform-origin: right top;\n  -moz-transform-origin: right top;\n  -ms-transform-origin: right top;\n  -o-transform-origin: right top;\n  transform-origin: right top;\n}\n.swiper-container-horizontal > .swiper-pagination-progress {\n  width: 100%;\n  height: 4px;\n  left: 0;\n  top: 0;\n}\n.swiper-container-vertical > .swiper-pagination-progress {\n  width: 4px;\n  height: 100%;\n  left: 0;\n  top: 0;\n}\n.swiper-pagination-progress.swiper-pagination-white {\n  background: rgba(255, 255, 255, 0.5);\n}\n.swiper-pagination-progress.swiper-pagination-white .swiper-pagination-progressbar {\n  background: #fff;\n}\n.swiper-pagination-progress.swiper-pagination-black .swiper-pagination-progressbar {\n  background: #000;\n}\n/* 3D Container */\n.swiper-container-3d {\n  -webkit-perspective: 1200px;\n  -moz-perspective: 1200px;\n  -o-perspective: 1200px;\n  perspective: 1200px;\n}\n.swiper-container-3d .swiper-wrapper,\n.swiper-container-3d .swiper-slide,\n.swiper-container-3d .swiper-slide-shadow-left,\n.swiper-container-3d .swiper-slide-shadow-right,\n.swiper-container-3d .swiper-slide-shadow-top,\n.swiper-container-3d .swiper-slide-shadow-bottom,\n.swiper-container-3d .swiper-cube-shadow {\n  -webkit-transform-style: preserve-3d;\n  -moz-transform-style: preserve-3d;\n  -ms-transform-style: preserve-3d;\n  transform-style: preserve-3d;\n}\n.swiper-container-3d .swiper-slide-shadow-left,\n.swiper-container-3d .swiper-slide-shadow-right,\n.swiper-container-3d .swiper-slide-shadow-top,\n.swiper-container-3d .swiper-slide-shadow-bottom {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  z-index: 10;\n}\n.swiper-container-3d .swiper-slide-shadow-left {\n  background-image: -webkit-gradient(linear, left top, right top, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0)));\n  /* Safari 4+, Chrome */\n  background-image: -webkit-linear-gradient(right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Chrome 10+, Safari 5.1+, iOS 5+ */\n  background-image: -moz-linear-gradient(right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Firefox 3.6-15 */\n  background-image: -o-linear-gradient(right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Opera 11.10-12.00 */\n  background-image: linear-gradient(to left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Firefox 16+, IE10, Opera 12.50+ */\n}\n.swiper-container-3d .swiper-slide-shadow-right {\n  background-image: -webkit-gradient(linear, right top, left top, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0)));\n  /* Safari 4+, Chrome */\n  background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Chrome 10+, Safari 5.1+, iOS 5+ */\n  background-image: -moz-linear-gradient(left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Firefox 3.6-15 */\n  background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Opera 11.10-12.00 */\n  background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Firefox 16+, IE10, Opera 12.50+ */\n}\n.swiper-container-3d .swiper-slide-shadow-top {\n  background-image: -webkit-gradient(linear, left top, left bottom, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0)));\n  /* Safari 4+, Chrome */\n  background-image: -webkit-linear-gradient(bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Chrome 10+, Safari 5.1+, iOS 5+ */\n  background-image: -moz-linear-gradient(bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Firefox 3.6-15 */\n  background-image: -o-linear-gradient(bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Opera 11.10-12.00 */\n  background-image: linear-gradient(to top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Firefox 16+, IE10, Opera 12.50+ */\n}\n.swiper-container-3d .swiper-slide-shadow-bottom {\n  background-image: -webkit-gradient(linear, left bottom, left top, from(rgba(0, 0, 0, 0.5)), to(rgba(0, 0, 0, 0)));\n  /* Safari 4+, Chrome */\n  background-image: -webkit-linear-gradient(top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Chrome 10+, Safari 5.1+, iOS 5+ */\n  background-image: -moz-linear-gradient(top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Firefox 3.6-15 */\n  background-image: -o-linear-gradient(top, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Opera 11.10-12.00 */\n  background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0));\n  /* Firefox 16+, IE10, Opera 12.50+ */\n}\n/* Coverflow */\n.swiper-container-coverflow .swiper-wrapper,\n.swiper-container-flip .swiper-wrapper {\n  /* Windows 8 IE 10 fix */\n  -ms-perspective: 1200px;\n}\n/* Cube + Flip */\n.swiper-container-cube,\n.swiper-container-flip {\n  overflow: visible;\n}\n.swiper-container-cube .swiper-slide,\n.swiper-container-flip .swiper-slide {\n  pointer-events: none;\n  -webkit-backface-visibility: hidden;\n  -moz-backface-visibility: hidden;\n  -ms-backface-visibility: hidden;\n  backface-visibility: hidden;\n  z-index: 1;\n}\n.swiper-container-cube .swiper-slide .swiper-slide,\n.swiper-container-flip .swiper-slide .swiper-slide {\n  pointer-events: none;\n}\n.swiper-container-cube .swiper-slide-active,\n.swiper-container-flip .swiper-slide-active,\n.swiper-container-cube .swiper-slide-active .swiper-slide-active,\n.swiper-container-flip .swiper-slide-active .swiper-slide-active {\n  pointer-events: auto;\n}\n.swiper-container-cube .swiper-slide-shadow-top,\n.swiper-container-flip .swiper-slide-shadow-top,\n.swiper-container-cube .swiper-slide-shadow-bottom,\n.swiper-container-flip .swiper-slide-shadow-bottom,\n.swiper-container-cube .swiper-slide-shadow-left,\n.swiper-container-flip .swiper-slide-shadow-left,\n.swiper-container-cube .swiper-slide-shadow-right,\n.swiper-container-flip .swiper-slide-shadow-right {\n  z-index: 0;\n  -webkit-backface-visibility: hidden;\n  -moz-backface-visibility: hidden;\n  -ms-backface-visibility: hidden;\n  backface-visibility: hidden;\n}\n/* Cube */\n.swiper-container-cube .swiper-slide {\n  visibility: hidden;\n  -webkit-transform-origin: 0 0;\n  -moz-transform-origin: 0 0;\n  -ms-transform-origin: 0 0;\n  transform-origin: 0 0;\n  width: 100%;\n  height: 100%;\n}\n.swiper-container-cube.swiper-container-rtl .swiper-slide {\n  -webkit-transform-origin: 100% 0;\n  -moz-transform-origin: 100% 0;\n  -ms-transform-origin: 100% 0;\n  transform-origin: 100% 0;\n}\n.swiper-container-cube .swiper-slide-active,\n.swiper-container-cube .swiper-slide-next,\n.swiper-container-cube .swiper-slide-prev,\n.swiper-container-cube .swiper-slide-next + .swiper-slide {\n  pointer-events: auto;\n  visibility: visible;\n}\n.swiper-container-cube .swiper-cube-shadow {\n  position: absolute;\n  left: 0;\n  bottom: 0px;\n  width: 100%;\n  height: 100%;\n  background: #000;\n  opacity: 0.6;\n  -webkit-filter: blur(50px);\n  filter: blur(50px);\n  z-index: 0;\n}\n/* Fade */\n.swiper-container-fade.swiper-container-free-mode .swiper-slide {\n  -webkit-transition-timing-function: ease-out;\n  -moz-transition-timing-function: ease-out;\n  -ms-transition-timing-function: ease-out;\n  -o-transition-timing-function: ease-out;\n  transition-timing-function: ease-out;\n}\n.swiper-container-fade .swiper-slide {\n  pointer-events: none;\n  -webkit-transition-property: opacity;\n  -moz-transition-property: opacity;\n  -o-transition-property: opacity;\n  transition-property: opacity;\n}\n.swiper-container-fade .swiper-slide .swiper-slide {\n  pointer-events: none;\n}\n.swiper-container-fade .swiper-slide-active,\n.swiper-container-fade .swiper-slide-active .swiper-slide-active {\n  pointer-events: auto;\n}\n.swiper-zoom-container {\n  width: 100%;\n  height: 100%;\n  display: -webkit-box;\n  display: -moz-box;\n  display: -ms-flexbox;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-box-pack: center;\n  -moz-box-pack: center;\n  -ms-flex-pack: center;\n  -webkit-justify-content: center;\n  justify-content: center;\n  -webkit-box-align: center;\n  -moz-box-align: center;\n  -ms-flex-align: center;\n  -webkit-align-items: center;\n  align-items: center;\n  text-align: center;\n}\n.swiper-zoom-container > img,\n.swiper-zoom-container > svg,\n.swiper-zoom-container > canvas {\n  max-width: 100%;\n  max-height: 100%;\n  object-fit: contain;\n}\n/* Scrollbar */\n.swiper-scrollbar {\n  border-radius: 10px;\n  position: relative;\n  -ms-touch-action: none;\n  background: rgba(0, 0, 0, 0.1);\n}\n.swiper-container-horizontal > .swiper-scrollbar {\n  position: absolute;\n  left: 1%;\n  bottom: 3px;\n  z-index: 50;\n  height: 5px;\n  width: 98%;\n}\n.swiper-container-vertical > .swiper-scrollbar {\n  position: absolute;\n  right: 3px;\n  top: 1%;\n  z-index: 50;\n  width: 5px;\n  height: 98%;\n}\n.swiper-scrollbar-drag {\n  height: 100%;\n  width: 100%;\n  position: relative;\n  background: rgba(0, 0, 0, 0.5);\n  border-radius: 10px;\n  left: 0;\n  top: 0;\n}\n.swiper-scrollbar-cursor-drag {\n  cursor: move;\n}\n/* Preloader */\n.swiper-lazy-preloader {\n  width: 42px;\n  height: 42px;\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  margin-left: -21px;\n  margin-top: -21px;\n  z-index: 10;\n  -webkit-transform-origin: 50%;\n  -moz-transform-origin: 50%;\n  transform-origin: 50%;\n  -webkit-animation: swiper-preloader-spin 1s steps(12, end) infinite;\n  -moz-animation: swiper-preloader-spin 1s steps(12, end) infinite;\n  animation: swiper-preloader-spin 1s steps(12, end) infinite;\n}\n.swiper-lazy-preloader:after {\n  display: block;\n  content: \"\";\n  width: 100%;\n  height: 100%;\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%236c6c6c'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\");\n  background-position: 50%;\n  -webkit-background-size: 100%;\n  background-size: 100%;\n  background-repeat: no-repeat;\n}\n.swiper-lazy-preloader-white:after {\n  background-image: url(\"data:image/svg+xml;charset=utf-8,%3Csvg%20viewBox%3D'0%200%20120%20120'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20xmlns%3Axlink%3D'http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink'%3E%3Cdefs%3E%3Cline%20id%3D'l'%20x1%3D'60'%20x2%3D'60'%20y1%3D'7'%20y2%3D'27'%20stroke%3D'%23fff'%20stroke-width%3D'11'%20stroke-linecap%3D'round'%2F%3E%3C%2Fdefs%3E%3Cg%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(30%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(60%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(90%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(120%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.27'%20transform%3D'rotate(150%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.37'%20transform%3D'rotate(180%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.46'%20transform%3D'rotate(210%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.56'%20transform%3D'rotate(240%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.66'%20transform%3D'rotate(270%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.75'%20transform%3D'rotate(300%2060%2C60)'%2F%3E%3Cuse%20xlink%3Ahref%3D'%23l'%20opacity%3D'.85'%20transform%3D'rotate(330%2060%2C60)'%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E\");\n}\n@-webkit-keyframes swiper-preloader-spin {\n  100% {\n    -webkit-transform: rotate(360deg);\n  }\n}\n@keyframes swiper-preloader-spin {\n  100% {\n    transform: rotate(360deg);\n  }\n}\n"],"sourceRoot":""}]);

// exports


/***/ }),
/* 679 */,
/* 680 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-081a9a5c]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-081a9a5c]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-081a9a5c]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-081a9a5c]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-081a9a5c]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-081a9a5c]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-081a9a5c]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-081a9a5c]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-081a9a5c]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-081a9a5c]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-081a9a5c]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-081a9a5c]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-081a9a5c]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-081a9a5c]{border-color:transparent}.pure-button.pure-button-homework[data-v-081a9a5c]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-081a9a5c]:hover{background-color:#fd3c51;color:#fff}body[data-v-081a9a5c],html[data-v-081a9a5c]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-081a9a5c]{float:left}.pull-right[data-v-081a9a5c]{float:right}.clearfix[data-v-081a9a5c]{clear:both;float:none}.fa-icon[data-v-081a9a5c]{width:auto;height:1em}.no-margin[data-v-081a9a5c]{margin:0!important}.no-padding[data-v-081a9a5c]{padding:0!important}.background-white[data-v-081a9a5c]{background-color:#fff!important}.text-white[data-v-081a9a5c]{color:#fff}.fade-enter-active[data-v-081a9a5c],.fade-leave-active[data-v-081a9a5c]{transition:opacity .2s}.fade-enter[data-v-081a9a5c],.fade-leave-to[data-v-081a9a5c]{opacity:0}.fade-enter-to[data-v-081a9a5c],.fade-leave[data-v-081a9a5c]{opacity:1}.main-container[data-v-081a9a5c]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-081a9a5c]{padding:20px}.content-block[data-v-081a9a5c]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-081a9a5c]{background-color:#fff}.icon-margin[data-v-081a9a5c]{margin:0 5px}.course-content-wrapper[data-v-081a9a5c]{margin-bottom:10px}.course-content-wrapper[data-v-081a9a5c]:last-child{margin-bottom:0}.course-content-wrapper .course-content-group .course-content[data-v-081a9a5c]{border-radius:4px;box-shadow:0 0 10px 5px rgba(0,0,0,.01);-moz-box-shadow:0 0 10px 5px rgba(0,0,0,.01);-webkit-box-shadow:0 0 10px 5px rgba(0,0,0,.01);background-color:#fff;margin:20px 0 0;min-height:100px;padding:0;position:relative}@media (max-width:800px){.course-content-wrapper .course-content-group .course-content[data-v-081a9a5c]{border-radius:0;margin:20px 0 0}}.course-content-wrapper .course-content-group .course-content h5.content-subheader[data-v-081a9a5c]{margin:0;padding:0;color:#444;font-weight:300}.course-content-wrapper .course-content-group .course-content p.content-description[data-v-081a9a5c]{margin:0;padding:0;color:#666;font-size:1em}.course-content-wrapper .course-content-group .course-content a[data-v-081a9a5c]{text-decoration:none}.course-content-wrapper .course-content-group .course-content .course-content--header[data-v-081a9a5c]{background-color:transparent;overflow:hidden;padding:20px 20px 10px}.course-content-wrapper .course-content-group .course-content .course-content--header h1.content-title[data-v-081a9a5c]{margin:0;padding:0;color:#444;font-size:1.3em;font-weight:700}.course-content-wrapper .course-content-group .course-content .course-content--header.block[data-v-081a9a5c]{background-color:#29b474;padding:30px;text-align:center}.course-content-wrapper .course-content-group .course-content .course-content--header.block h1.content-title[data-v-081a9a5c]{color:#fff;font-size:2em;font-weight:700;margin-bottom:10px}.course-content-wrapper .course-content-group .course-content .course-content--header.block p.content-description[data-v-081a9a5c]{color:#fff;margin:0 auto}.course-content-wrapper .course-content-group .course-content .course-content--body[data-v-081a9a5c]{overflow:hidden;padding:0 20px 10px}.course-content-wrapper .course-content-group .course-content .course-content--body h1[data-v-081a9a5c],.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-081a9a5c],.course-content-wrapper .course-content-group .course-content .course-content--body h3[data-v-081a9a5c],.course-content-wrapper .course-content-group .course-content .course-content--body h4[data-v-081a9a5c],.course-content-wrapper .course-content-group .course-content .course-content--body h5[data-v-081a9a5c]{font-weight:300}.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-081a9a5c]{color:#444;font-size:1.3em;font-weight:700}.course-content-wrapper .course-content-group .course-content .course-content--footer[data-v-081a9a5c]{padding:20px}.course-content-wrapper .course-content-group.course-content-group--question[data-v-081a9a5c]{border-radius:6px;background-color:hsla(0,0%,100%,.15);padding:15px;margin-top:10px}.course-content-wrapper .course-content-group.course-content-group--question .course-content[data-v-081a9a5c]{margin:0}.course-content[data-v-081a9a5c]{overflow:hidden;position:relative}.course-content .course-content--header[data-v-081a9a5c],.course-content[data-v-081a9a5c]{background-color:#fd3c51!important}.course-content .course-content--header h1.content-title[data-v-081a9a5c]{color:#fff!important}.course-content .course-content--header .submission-button-wrapper[data-v-081a9a5c]{margin:10px auto 0;text-align:center}.course-content .course-content--header .submission-button-wrapper .pure-button[data-v-081a9a5c]{background-color:transparent;border:1px solid #fff;color:#fff;display:inline-block;margin:5px}.course-content .course-content--header .submission-button-wrapper .pure-button[data-v-081a9a5c]:hover{background-color:#fff;color:#fd3c51}", "", {"version":3,"sources":["/root/connectedacademy/src/components/conversation/Homework.vue"],"names":[],"mappings":"AAsIA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,yCACE,kBAAoB,CACrB,AACD,oDACE,eAAiB,CAClB,AACD,+EACE,kBAAmB,AACnB,wCAA0C,AAC1C,6CAA+C,AAC/C,gDAAkD,AAClD,sBAAuB,AACvB,gBAAmB,AACnB,iBAAkB,AAClB,UAAW,AACX,iBAAmB,CACpB,AACD,yBACA,+EACI,gBAAiB,AACjB,eAAmB,CACtB,CACA,AACD,oGACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,eAAiB,CAClB,AACD,qGACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,aAAe,CAChB,AACD,iFACE,oBAAsB,CACvB,AACD,uGACE,6BAA8B,AAC9B,gBAAiB,AACjB,sBAA6B,CAC9B,AACD,wHACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,6GACE,yBAA0B,AAC1B,aAAc,AACd,iBAAmB,CACpB,AACD,8HACE,WAAY,AACZ,cAAe,AACf,gBAAkB,AAClB,kBAAoB,CACrB,AACD,mIACE,WAAY,AACZ,aAAe,CAChB,AACD,qGACE,gBAAiB,AACjB,mBAA4B,CAC7B,AACD,wgBAKE,eAAiB,CAClB,AACD,wGACE,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,uGACE,YAAc,CACf,AACD,8FACE,kBAAmB,AACnB,qCAAyC,AACzC,aAAc,AACd,eAAiB,CAClB,AACD,8GACE,QAAU,CACX,AACD,iCAEE,gBAAiB,AACjB,iBAAmB,CACpB,AACD,0FAJE,kCAAqC,CAOtC,AACD,0EACE,oBAAuB,CACxB,AACD,oFACE,mBAAyB,AACzB,iBAAmB,CACpB,AACD,iGACE,6BAA8B,AAC9B,sBAAuB,AACvB,WAAY,AACZ,qBAAsB,AACtB,UAAY,CACb,AACD,uGACE,sBAAuB,AACvB,aAAe,CAChB","file":"Homework.vue","sourcesContent":["\n.pure-button[data-v-081a9a5c] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-081a9a5c]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-081a9a5c] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-081a9a5c] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-081a9a5c]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-081a9a5c] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-081a9a5c]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-081a9a5c] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-081a9a5c]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-081a9a5c] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-081a9a5c]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-081a9a5c] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-081a9a5c]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-081a9a5c] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-081a9a5c] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-081a9a5c]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-081a9a5c],\nbody[data-v-081a9a5c] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-081a9a5c] {\n  float: left;\n}\n.pull-right[data-v-081a9a5c] {\n  float: right;\n}\n.clearfix[data-v-081a9a5c] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-081a9a5c] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-081a9a5c] {\n  margin: 0 !important;\n}\n.no-padding[data-v-081a9a5c] {\n  padding: 0 !important;\n}\n.background-white[data-v-081a9a5c] {\n  background-color: #fff !important;\n}\n.text-white[data-v-081a9a5c] {\n  color: #fff;\n}\n.fade-enter-active[data-v-081a9a5c],\n.fade-leave-active[data-v-081a9a5c] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-081a9a5c],\n.fade-leave-to[data-v-081a9a5c] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-081a9a5c],\n.fade-leave[data-v-081a9a5c] {\n  opacity: 1;\n}\n.main-container[data-v-081a9a5c] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-081a9a5c] {\n  padding: 20px;\n}\n.content-block[data-v-081a9a5c] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-081a9a5c] {\n  background-color: #fff;\n}\n.icon-margin[data-v-081a9a5c] {\n  margin: 0 5px;\n}\n.pure-button[data-v-081a9a5c] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-081a9a5c]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-081a9a5c] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-081a9a5c] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-081a9a5c]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-081a9a5c] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-081a9a5c]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-081a9a5c] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-081a9a5c]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-081a9a5c] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-081a9a5c]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-081a9a5c] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-081a9a5c]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-081a9a5c] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-081a9a5c] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-081a9a5c]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-081a9a5c],\nbody[data-v-081a9a5c] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-081a9a5c] {\n  float: left;\n}\n.pull-right[data-v-081a9a5c] {\n  float: right;\n}\n.clearfix[data-v-081a9a5c] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-081a9a5c] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-081a9a5c] {\n  margin: 0 !important;\n}\n.no-padding[data-v-081a9a5c] {\n  padding: 0 !important;\n}\n.background-white[data-v-081a9a5c] {\n  background-color: #fff !important;\n}\n.text-white[data-v-081a9a5c] {\n  color: #fff;\n}\n.fade-enter-active[data-v-081a9a5c],\n.fade-leave-active[data-v-081a9a5c] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-081a9a5c],\n.fade-leave-to[data-v-081a9a5c] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-081a9a5c],\n.fade-leave[data-v-081a9a5c] {\n  opacity: 1;\n}\n.main-container[data-v-081a9a5c] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-081a9a5c] {\n  padding: 20px;\n}\n.content-block[data-v-081a9a5c] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-081a9a5c] {\n  background-color: #fff;\n}\n.icon-margin[data-v-081a9a5c] {\n  margin: 0 5px;\n}\n.course-content-wrapper[data-v-081a9a5c] {\n  margin-bottom: 10px;\n}\n.course-content-wrapper[data-v-081a9a5c]:last-child {\n  margin-bottom: 0;\n}\n.course-content-wrapper .course-content-group .course-content[data-v-081a9a5c] {\n  border-radius: 4px;\n  box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -moz-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -webkit-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  background-color: #fff;\n  margin: 20px 0 0 0;\n  min-height: 100px;\n  padding: 0;\n  position: relative;\n}\n@media (max-width: 800px) {\n.course-content-wrapper .course-content-group .course-content[data-v-081a9a5c] {\n    border-radius: 0;\n    margin: 20px 0 0 0;\n}\n}\n.course-content-wrapper .course-content-group .course-content h5.content-subheader[data-v-081a9a5c] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  font-weight: 300;\n}\n.course-content-wrapper .course-content-group .course-content p.content-description[data-v-081a9a5c] {\n  margin: 0;\n  padding: 0;\n  color: #666;\n  font-size: 1em;\n}\n.course-content-wrapper .course-content-group .course-content a[data-v-081a9a5c] {\n  text-decoration: none;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header[data-v-081a9a5c] {\n  background-color: transparent;\n  overflow: hidden;\n  padding: 20px 20px 10px 20px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header h1.content-title[data-v-081a9a5c] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block[data-v-081a9a5c] {\n  background-color: #29b474;\n  padding: 30px;\n  text-align: center;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block h1.content-title[data-v-081a9a5c] {\n  color: #fff;\n  font-size: 2em;\n  font-weight: bold;\n  margin-bottom: 10px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block p.content-description[data-v-081a9a5c] {\n  color: #fff;\n  margin: 0 auto;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body[data-v-081a9a5c] {\n  overflow: hidden;\n  padding: 0px 20px 10px 20px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body h1[data-v-081a9a5c],\n.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-081a9a5c],\n.course-content-wrapper .course-content-group .course-content .course-content--body h3[data-v-081a9a5c],\n.course-content-wrapper .course-content-group .course-content .course-content--body h4[data-v-081a9a5c],\n.course-content-wrapper .course-content-group .course-content .course-content--body h5[data-v-081a9a5c] {\n  font-weight: 300;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-081a9a5c] {\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--footer[data-v-081a9a5c] {\n  padding: 20px;\n}\n.course-content-wrapper .course-content-group.course-content-group--question[data-v-081a9a5c] {\n  border-radius: 6px;\n  background-color: rgba(255,255,255,0.15);\n  padding: 15px;\n  margin-top: 10px;\n}\n.course-content-wrapper .course-content-group.course-content-group--question .course-content[data-v-081a9a5c] {\n  margin: 0;\n}\n.course-content[data-v-081a9a5c] {\n  background-color: #fd3c51 !important;\n  overflow: hidden;\n  position: relative;\n}\n.course-content .course-content--header[data-v-081a9a5c] {\n  background-color: #fd3c51 !important;\n/*text-align center*/\n}\n.course-content .course-content--header h1.content-title[data-v-081a9a5c] {\n  color: #fff !important;\n}\n.course-content .course-content--header .submission-button-wrapper[data-v-081a9a5c] {\n  margin: 10px auto 0 auto;\n  text-align: center;\n}\n.course-content .course-content--header .submission-button-wrapper .pure-button[data-v-081a9a5c] {\n  background-color: transparent;\n  border: #fff 1px solid;\n  color: #fff;\n  display: inline-block;\n  margin: 5px;\n}\n.course-content .course-content--header .submission-button-wrapper .pure-button[data-v-081a9a5c]:hover {\n  background-color: #fff;\n  color: #fd3c51;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 681 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-08b8d0a0]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-08b8d0a0]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-08b8d0a0]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-08b8d0a0]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-08b8d0a0]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-08b8d0a0]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-08b8d0a0]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-08b8d0a0]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-08b8d0a0]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-08b8d0a0]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-08b8d0a0]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-08b8d0a0]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-08b8d0a0]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-08b8d0a0]{border-color:transparent}.pure-button.pure-button-homework[data-v-08b8d0a0]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-08b8d0a0]:hover{background-color:#fd3c51;color:#fff}body[data-v-08b8d0a0],html[data-v-08b8d0a0]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-08b8d0a0]{float:left}.pull-right[data-v-08b8d0a0]{float:right}.clearfix[data-v-08b8d0a0]{clear:both;float:none}.fa-icon[data-v-08b8d0a0]{width:auto;height:1em}.no-margin[data-v-08b8d0a0]{margin:0!important}.no-padding[data-v-08b8d0a0]{padding:0!important}.background-white[data-v-08b8d0a0]{background-color:#fff!important}.text-white[data-v-08b8d0a0]{color:#fff}.fade-enter-active[data-v-08b8d0a0],.fade-leave-active[data-v-08b8d0a0]{transition:opacity .2s}.fade-enter[data-v-08b8d0a0],.fade-leave-to[data-v-08b8d0a0]{opacity:0}.fade-enter-to[data-v-08b8d0a0],.fade-leave[data-v-08b8d0a0]{opacity:1}.main-container[data-v-08b8d0a0]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-08b8d0a0]{padding:20px}.content-block[data-v-08b8d0a0]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-08b8d0a0]{background-color:#fff}.icon-margin[data-v-08b8d0a0]{margin:0 5px}.course-content-wrapper[data-v-08b8d0a0]{margin-bottom:10px}.course-content-wrapper[data-v-08b8d0a0]:last-child{margin-bottom:0}.course-content-wrapper .course-content-group .course-content[data-v-08b8d0a0]{border-radius:4px;box-shadow:0 0 10px 5px rgba(0,0,0,.01);-moz-box-shadow:0 0 10px 5px rgba(0,0,0,.01);-webkit-box-shadow:0 0 10px 5px rgba(0,0,0,.01);background-color:#fff;margin:20px 0 0;min-height:100px;padding:0;position:relative}@media (max-width:800px){.course-content-wrapper .course-content-group .course-content[data-v-08b8d0a0]{border-radius:0;margin:20px 0 0}}.course-content-wrapper .course-content-group .course-content h5.content-subheader[data-v-08b8d0a0]{margin:0;padding:0;color:#444;font-weight:300}.course-content-wrapper .course-content-group .course-content p.content-description[data-v-08b8d0a0]{margin:0;padding:0;color:#666;font-size:1em}.course-content-wrapper .course-content-group .course-content a[data-v-08b8d0a0]{text-decoration:none}.course-content-wrapper .course-content-group .course-content .course-content--header[data-v-08b8d0a0]{background-color:transparent;overflow:hidden;padding:20px 20px 10px}.course-content-wrapper .course-content-group .course-content .course-content--header h1.content-title[data-v-08b8d0a0]{margin:0;padding:0;color:#444;font-size:1.3em;font-weight:700}.course-content-wrapper .course-content-group .course-content .course-content--header.block[data-v-08b8d0a0]{background-color:#29b474;padding:30px;text-align:center}.course-content-wrapper .course-content-group .course-content .course-content--header.block h1.content-title[data-v-08b8d0a0]{color:#fff;font-size:2em;font-weight:700;margin-bottom:10px}.course-content-wrapper .course-content-group .course-content .course-content--header.block p.content-description[data-v-08b8d0a0]{color:#fff;margin:0 auto}.course-content-wrapper .course-content-group .course-content .course-content--body[data-v-08b8d0a0]{overflow:hidden;padding:0 20px 10px}.course-content-wrapper .course-content-group .course-content .course-content--body h1[data-v-08b8d0a0],.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-08b8d0a0],.course-content-wrapper .course-content-group .course-content .course-content--body h3[data-v-08b8d0a0],.course-content-wrapper .course-content-group .course-content .course-content--body h4[data-v-08b8d0a0],.course-content-wrapper .course-content-group .course-content .course-content--body h5[data-v-08b8d0a0]{font-weight:300}.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-08b8d0a0]{color:#444;font-size:1.3em;font-weight:700}.course-content-wrapper .course-content-group .course-content .course-content--footer[data-v-08b8d0a0]{padding:20px}.course-content-wrapper .course-content-group.course-content-group--question[data-v-08b8d0a0]{border-radius:6px;background-color:hsla(0,0%,100%,.15);padding:15px;margin-top:10px}.course-content-wrapper .course-content-group.course-content-group--question .course-content[data-v-08b8d0a0]{margin:0}.course-content#course-content-liveclass[data-v-08b8d0a0]{background-color:#161616!important;position:relative}.course-content#course-content-liveclass .course-content--header.block[data-v-08b8d0a0]{background-color:#161616;border-top-left-radius:6px;border-top-right-radius:6px}.course-content#course-content-liveclass .course-content--header.block .pure-button[data-v-08b8d0a0]{background-color:transparent;border:1px solid #fff;color:#fff;margin:10px auto 5px}.course-content#course-content-liveclass .course-content--header.block .pure-button[data-v-08b8d0a0]:hover{background-color:#fff;color:#fd853c}.course-content#course-content-liveclass .course-content--container[data-v-08b8d0a0]{background-color:#fff;position:relative}.course-content#course-content-liveclass .course-content--container.collapsed[data-v-08b8d0a0]{max-height:1000px;overflow:hidden}.course-content#course-content-liveclass .course-content--footer[data-v-08b8d0a0]{background-color:#fff;text-align:center}#fade-out[data-v-08b8d0a0]{top:0;bottom:0;left:0;right:0;background:transparent;background:linear-gradient(bottom,#fff,hsla(0,0%,100%,0));position:absolute;z-index:1;height:300px;top:auto;pointer-events:none}", "", {"version":3,"sources":["/root/connectedacademy/src/components/conversation/LiveClass.vue"],"names":[],"mappings":"AAsIA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,yCACE,kBAAoB,CACrB,AACD,oDACE,eAAiB,CAClB,AACD,+EACE,kBAAmB,AACnB,wCAA0C,AAC1C,6CAA+C,AAC/C,gDAAkD,AAClD,sBAAuB,AACvB,gBAAmB,AACnB,iBAAkB,AAClB,UAAW,AACX,iBAAmB,CACpB,AACD,yBACA,+EACI,gBAAiB,AACjB,eAAmB,CACtB,CACA,AACD,oGACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,eAAiB,CAClB,AACD,qGACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,aAAe,CAChB,AACD,iFACE,oBAAsB,CACvB,AACD,uGACE,6BAA8B,AAC9B,gBAAiB,AACjB,sBAA6B,CAC9B,AACD,wHACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,6GACE,yBAA0B,AAC1B,aAAc,AACd,iBAAmB,CACpB,AACD,8HACE,WAAY,AACZ,cAAe,AACf,gBAAkB,AAClB,kBAAoB,CACrB,AACD,mIACE,WAAY,AACZ,aAAe,CAChB,AACD,qGACE,gBAAiB,AACjB,mBAA4B,CAC7B,AACD,wgBAKE,eAAiB,CAClB,AACD,wGACE,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,uGACE,YAAc,CACf,AACD,8FACE,kBAAmB,AACnB,qCAAyC,AACzC,aAAc,AACd,eAAiB,CAClB,AACD,8GACE,QAAU,CACX,AACD,0DACE,mCAAqC,AACrC,iBAAmB,CACpB,AACD,wFACE,yBAA0B,AAC1B,2BAA4B,AAC5B,2BAA6B,CAC9B,AACD,qGACE,6BAA8B,AAC9B,sBAAuB,AACvB,WAAY,AACZ,oBAA2B,CAC5B,AACD,2GACE,sBAAuB,AACvB,aAAe,CAChB,AACD,qFACE,sBAAuB,AACvB,iBAAmB,CACpB,AACD,+FACE,kBAAmB,AACnB,eAAiB,CAClB,AACD,kFACE,sBAAuB,AACvB,iBAAmB,CACpB,AACD,2BACE,MAAO,AACP,SAAU,AACV,OAAQ,AACR,QAAS,AACT,uBAAwB,AACxB,0DAA+D,AAC/D,kBAAmB,AACnB,UAAW,AACX,aAAc,AACd,SAAU,AACV,mBAAqB,CACtB","file":"LiveClass.vue","sourcesContent":["\n.pure-button[data-v-08b8d0a0] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-08b8d0a0]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-08b8d0a0] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-08b8d0a0] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-08b8d0a0]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-08b8d0a0] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-08b8d0a0]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-08b8d0a0] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-08b8d0a0]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-08b8d0a0] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-08b8d0a0]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-08b8d0a0] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-08b8d0a0]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-08b8d0a0] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-08b8d0a0] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-08b8d0a0]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-08b8d0a0],\nbody[data-v-08b8d0a0] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-08b8d0a0] {\n  float: left;\n}\n.pull-right[data-v-08b8d0a0] {\n  float: right;\n}\n.clearfix[data-v-08b8d0a0] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-08b8d0a0] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-08b8d0a0] {\n  margin: 0 !important;\n}\n.no-padding[data-v-08b8d0a0] {\n  padding: 0 !important;\n}\n.background-white[data-v-08b8d0a0] {\n  background-color: #fff !important;\n}\n.text-white[data-v-08b8d0a0] {\n  color: #fff;\n}\n.fade-enter-active[data-v-08b8d0a0],\n.fade-leave-active[data-v-08b8d0a0] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-08b8d0a0],\n.fade-leave-to[data-v-08b8d0a0] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-08b8d0a0],\n.fade-leave[data-v-08b8d0a0] {\n  opacity: 1;\n}\n.main-container[data-v-08b8d0a0] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-08b8d0a0] {\n  padding: 20px;\n}\n.content-block[data-v-08b8d0a0] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-08b8d0a0] {\n  background-color: #fff;\n}\n.icon-margin[data-v-08b8d0a0] {\n  margin: 0 5px;\n}\n.pure-button[data-v-08b8d0a0] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-08b8d0a0]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-08b8d0a0] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-08b8d0a0] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-08b8d0a0]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-08b8d0a0] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-08b8d0a0]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-08b8d0a0] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-08b8d0a0]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-08b8d0a0] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-08b8d0a0]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-08b8d0a0] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-08b8d0a0]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-08b8d0a0] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-08b8d0a0] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-08b8d0a0]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-08b8d0a0],\nbody[data-v-08b8d0a0] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-08b8d0a0] {\n  float: left;\n}\n.pull-right[data-v-08b8d0a0] {\n  float: right;\n}\n.clearfix[data-v-08b8d0a0] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-08b8d0a0] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-08b8d0a0] {\n  margin: 0 !important;\n}\n.no-padding[data-v-08b8d0a0] {\n  padding: 0 !important;\n}\n.background-white[data-v-08b8d0a0] {\n  background-color: #fff !important;\n}\n.text-white[data-v-08b8d0a0] {\n  color: #fff;\n}\n.fade-enter-active[data-v-08b8d0a0],\n.fade-leave-active[data-v-08b8d0a0] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-08b8d0a0],\n.fade-leave-to[data-v-08b8d0a0] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-08b8d0a0],\n.fade-leave[data-v-08b8d0a0] {\n  opacity: 1;\n}\n.main-container[data-v-08b8d0a0] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-08b8d0a0] {\n  padding: 20px;\n}\n.content-block[data-v-08b8d0a0] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-08b8d0a0] {\n  background-color: #fff;\n}\n.icon-margin[data-v-08b8d0a0] {\n  margin: 0 5px;\n}\n.course-content-wrapper[data-v-08b8d0a0] {\n  margin-bottom: 10px;\n}\n.course-content-wrapper[data-v-08b8d0a0]:last-child {\n  margin-bottom: 0;\n}\n.course-content-wrapper .course-content-group .course-content[data-v-08b8d0a0] {\n  border-radius: 4px;\n  box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -moz-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -webkit-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  background-color: #fff;\n  margin: 20px 0 0 0;\n  min-height: 100px;\n  padding: 0;\n  position: relative;\n}\n@media (max-width: 800px) {\n.course-content-wrapper .course-content-group .course-content[data-v-08b8d0a0] {\n    border-radius: 0;\n    margin: 20px 0 0 0;\n}\n}\n.course-content-wrapper .course-content-group .course-content h5.content-subheader[data-v-08b8d0a0] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  font-weight: 300;\n}\n.course-content-wrapper .course-content-group .course-content p.content-description[data-v-08b8d0a0] {\n  margin: 0;\n  padding: 0;\n  color: #666;\n  font-size: 1em;\n}\n.course-content-wrapper .course-content-group .course-content a[data-v-08b8d0a0] {\n  text-decoration: none;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header[data-v-08b8d0a0] {\n  background-color: transparent;\n  overflow: hidden;\n  padding: 20px 20px 10px 20px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header h1.content-title[data-v-08b8d0a0] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block[data-v-08b8d0a0] {\n  background-color: #29b474;\n  padding: 30px;\n  text-align: center;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block h1.content-title[data-v-08b8d0a0] {\n  color: #fff;\n  font-size: 2em;\n  font-weight: bold;\n  margin-bottom: 10px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block p.content-description[data-v-08b8d0a0] {\n  color: #fff;\n  margin: 0 auto;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body[data-v-08b8d0a0] {\n  overflow: hidden;\n  padding: 0px 20px 10px 20px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body h1[data-v-08b8d0a0],\n.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-08b8d0a0],\n.course-content-wrapper .course-content-group .course-content .course-content--body h3[data-v-08b8d0a0],\n.course-content-wrapper .course-content-group .course-content .course-content--body h4[data-v-08b8d0a0],\n.course-content-wrapper .course-content-group .course-content .course-content--body h5[data-v-08b8d0a0] {\n  font-weight: 300;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-08b8d0a0] {\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--footer[data-v-08b8d0a0] {\n  padding: 20px;\n}\n.course-content-wrapper .course-content-group.course-content-group--question[data-v-08b8d0a0] {\n  border-radius: 6px;\n  background-color: rgba(255,255,255,0.15);\n  padding: 15px;\n  margin-top: 10px;\n}\n.course-content-wrapper .course-content-group.course-content-group--question .course-content[data-v-08b8d0a0] {\n  margin: 0;\n}\n.course-content#course-content-liveclass[data-v-08b8d0a0] {\n  background-color: #161616 !important;\n  position: relative;\n}\n.course-content#course-content-liveclass .course-content--header.block[data-v-08b8d0a0] {\n  background-color: #161616;\n  border-top-left-radius: 6px;\n  border-top-right-radius: 6px;\n}\n.course-content#course-content-liveclass .course-content--header.block .pure-button[data-v-08b8d0a0] {\n  background-color: transparent;\n  border: #fff 1px solid;\n  color: #fff;\n  margin: 10px auto 5px auto;\n}\n.course-content#course-content-liveclass .course-content--header.block .pure-button[data-v-08b8d0a0]:hover {\n  background-color: #fff;\n  color: #fd853c;\n}\n.course-content#course-content-liveclass .course-content--container[data-v-08b8d0a0] {\n  background-color: #fff;\n  position: relative;\n}\n.course-content#course-content-liveclass .course-content--container.collapsed[data-v-08b8d0a0] {\n  max-height: 1000px;\n  overflow: hidden;\n}\n.course-content#course-content-liveclass .course-content--footer[data-v-08b8d0a0] {\n  background-color: #fff;\n  text-align: center;\n}\n#fade-out[data-v-08b8d0a0] {\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background: transparent;\n  background: linear-gradient(bottom, #fff, rgba(255,255,255,0));\n  position: absolute;\n  z-index: 1;\n  height: 300px;\n  top: auto;\n  pointer-events: none;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 682 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-0f47a13e]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-0f47a13e]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-0f47a13e]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-0f47a13e]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-0f47a13e]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-0f47a13e]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-0f47a13e]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-0f47a13e]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-0f47a13e]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-0f47a13e]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-0f47a13e]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-0f47a13e]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-0f47a13e]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-0f47a13e]{border-color:transparent}.pure-button.pure-button-homework[data-v-0f47a13e]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-0f47a13e]:hover{background-color:#fd3c51;color:#fff}body[data-v-0f47a13e],html[data-v-0f47a13e]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-0f47a13e]{float:left}.pull-right[data-v-0f47a13e]{float:right}.clearfix[data-v-0f47a13e]{clear:both;float:none}.fa-icon[data-v-0f47a13e]{width:auto;height:1em}.no-margin[data-v-0f47a13e]{margin:0!important}.no-padding[data-v-0f47a13e]{padding:0!important}.background-white[data-v-0f47a13e]{background-color:#fff!important}.text-white[data-v-0f47a13e]{color:#fff}.fade-enter-active[data-v-0f47a13e],.fade-leave-active[data-v-0f47a13e]{transition:opacity .2s}.fade-enter[data-v-0f47a13e],.fade-leave-to[data-v-0f47a13e]{opacity:0}.fade-enter-to[data-v-0f47a13e],.fade-leave[data-v-0f47a13e]{opacity:1}.main-container[data-v-0f47a13e]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-0f47a13e]{padding:20px}.content-block[data-v-0f47a13e]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-0f47a13e]{background-color:#fff}.icon-margin[data-v-0f47a13e]{margin:0 5px}.mock-message[data-v-0f47a13e]{height:140px;padding-left:60px;top:0;left:0;right:30px}.mock-message .mock-message--user[data-v-0f47a13e]{border-radius:50%;height:40px;width:40px;position:absolute;top:20px;left:15px}.mock-message .mock-message--body[data-v-0f47a13e]{border-radius:6px;height:100px;padding:10px}.mock-message .mock-message--body .mock-message--line[data-v-0f47a13e]{border-radius:6px;height:20px;margin-top:15px}.mock-message .mock-message--body .mock-message--line[data-v-0f47a13e]:first-child{max-width:100px}.mock-message .mock-message--line[data-v-0f47a13e],.mock-message .mock-message--user[data-v-0f47a13e]{background-color:#e9e9e9;transition:all .3s ease}.mock-message.loading .mock-message--line[data-v-0f47a13e],.mock-message.loading .mock-message--user[data-v-0f47a13e]{background-color:#ebebeb}", "", {"version":3,"sources":["/root/connectedacademy/src/components/conversation/MockMessage.vue"],"names":[],"mappings":"AACA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,+BACE,aAAc,AACd,kBAAmB,AACnB,MAAO,AACP,OAAQ,AACR,UAAY,CACb,AACD,mDACE,kBAAmB,AACnB,YAAa,AACb,WAAY,AACZ,kBAAmB,AACnB,SAAU,AACV,SAAW,CACZ,AACD,mDACE,kBAAmB,AACnB,aAAc,AACd,YAAc,CACf,AACD,uEACE,kBAAmB,AACnB,YAAa,AACb,eAAiB,CAClB,AACD,mFACE,eAAiB,CAClB,AACD,sGAEE,yBAA0B,AAC1B,uBAA0B,CAC3B,AACD,sHAEE,wBAA0B,CAC3B","file":"MockMessage.vue","sourcesContent":["\n.pure-button[data-v-0f47a13e] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-0f47a13e]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-0f47a13e] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-0f47a13e] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-0f47a13e]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-0f47a13e] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-0f47a13e]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-0f47a13e] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-0f47a13e]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-0f47a13e] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-0f47a13e]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-0f47a13e] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-0f47a13e]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-0f47a13e] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-0f47a13e] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-0f47a13e]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-0f47a13e],\nbody[data-v-0f47a13e] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-0f47a13e] {\n  float: left;\n}\n.pull-right[data-v-0f47a13e] {\n  float: right;\n}\n.clearfix[data-v-0f47a13e] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-0f47a13e] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-0f47a13e] {\n  margin: 0 !important;\n}\n.no-padding[data-v-0f47a13e] {\n  padding: 0 !important;\n}\n.background-white[data-v-0f47a13e] {\n  background-color: #fff !important;\n}\n.text-white[data-v-0f47a13e] {\n  color: #fff;\n}\n.fade-enter-active[data-v-0f47a13e],\n.fade-leave-active[data-v-0f47a13e] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-0f47a13e],\n.fade-leave-to[data-v-0f47a13e] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-0f47a13e],\n.fade-leave[data-v-0f47a13e] {\n  opacity: 1;\n}\n.main-container[data-v-0f47a13e] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-0f47a13e] {\n  padding: 20px;\n}\n.content-block[data-v-0f47a13e] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-0f47a13e] {\n  background-color: #fff;\n}\n.icon-margin[data-v-0f47a13e] {\n  margin: 0 5px;\n}\n.mock-message[data-v-0f47a13e] {\n  height: 140px;\n  padding-left: 60px;\n  top: 0;\n  left: 0;\n  right: 30px;\n}\n.mock-message .mock-message--user[data-v-0f47a13e] {\n  border-radius: 50%;\n  height: 40px;\n  width: 40px;\n  position: absolute;\n  top: 20px;\n  left: 15px;\n}\n.mock-message .mock-message--body[data-v-0f47a13e] {\n  border-radius: 6px;\n  height: 100px;\n  padding: 10px;\n}\n.mock-message .mock-message--body .mock-message--line[data-v-0f47a13e] {\n  border-radius: 6px;\n  height: 20px;\n  margin-top: 15px;\n}\n.mock-message .mock-message--body .mock-message--line[data-v-0f47a13e]:first-child {\n  max-width: 100px;\n}\n.mock-message .mock-message--user[data-v-0f47a13e],\n.mock-message .mock-message--line[data-v-0f47a13e] {\n  background-color: #e9e9e9;\n  transition: all 0.3s ease;\n}\n.mock-message.loading .mock-message--user[data-v-0f47a13e],\n.mock-message.loading .mock-message--line[data-v-0f47a13e] {\n  background-color: #ebebeb;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 683 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-0fbc9bd8]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-0fbc9bd8]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-0fbc9bd8]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-0fbc9bd8]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-0fbc9bd8]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-0fbc9bd8]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-0fbc9bd8]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-0fbc9bd8]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-0fbc9bd8]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-0fbc9bd8]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-0fbc9bd8]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-0fbc9bd8]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-0fbc9bd8]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-0fbc9bd8]{border-color:transparent}.pure-button.pure-button-homework[data-v-0fbc9bd8]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-0fbc9bd8]:hover{background-color:#fd3c51;color:#fff}body[data-v-0fbc9bd8],html[data-v-0fbc9bd8]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-0fbc9bd8]{float:left}.pull-right[data-v-0fbc9bd8]{float:right}.clearfix[data-v-0fbc9bd8]{clear:both;float:none}.fa-icon[data-v-0fbc9bd8]{width:auto;height:1em}.no-margin[data-v-0fbc9bd8]{margin:0!important}.no-padding[data-v-0fbc9bd8]{padding:0!important}.background-white[data-v-0fbc9bd8]{background-color:#fff!important}.text-white[data-v-0fbc9bd8]{color:#fff}.fade-enter-active[data-v-0fbc9bd8],.fade-leave-active[data-v-0fbc9bd8]{transition:opacity .2s}.fade-enter[data-v-0fbc9bd8],.fade-leave-to[data-v-0fbc9bd8]{opacity:0}.fade-enter-to[data-v-0fbc9bd8],.fade-leave[data-v-0fbc9bd8]{opacity:1}.main-container[data-v-0fbc9bd8]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-0fbc9bd8]{padding:20px}.content-block[data-v-0fbc9bd8]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-0fbc9bd8]{background-color:#fff}.icon-margin[data-v-0fbc9bd8]{margin:0 5px}.like-indicator[data-v-0fbc9bd8]{border-radius:6px;font-size:1em;position:absolute;top:0;right:0}.like-indicator .like-indicator-wrapper[data-v-0fbc9bd8]{height:50px;width:50px;position:relative}.like-indicator .like-indicator-wrapper .heart[data-v-0fbc9bd8]{padding:0 8px}.like-indicator .like-indicator-wrapper .like-count[data-v-0fbc9bd8]{color:#666;font-size:.9em;position:absolute;line-height:50px;top:1px;left:0}.heart[data-v-0fbc9bd8]{width:100px;height:100px;position:absolute;left:50%;top:50%;opacity:.5;-webkit-transform:translate(-50%,-50%) scale(.5);transform:translate(-50%,-50%) scale(.5);background:url(" + __webpack_require__(796) + ") no-repeat;background-position:0 0;background-size:auto 100px;cursor:pointer;-webkit-animation:opacity .3s,fave-heart 1s steps(28);animation:opacity .3s,fave-heart 1s steps(28)}.heart.active[data-v-0fbc9bd8]{background-position:-2800px 0;transition:background 1s steps(28);opacity:1}.heart[data-v-0fbc9bd8]:hover{opacity:1}@-webkit-keyframes fave-heart{0%{background-position:0 0}to{background-position:-2800px 0}}@keyframes fave-heart{0%{background-position:0 0}to{background-position:-2800px 0}}", "", {"version":3,"sources":["/root/connectedacademy/src/components/LikeIndicator.vue"],"names":[],"mappings":"AACA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,iCACE,kBAAmB,AACnB,cAAe,AACf,kBAAmB,AACnB,MAAO,AACP,OAAS,CACV,AACD,yDACE,YAAa,AACb,WAAY,AACZ,iBAAmB,CACpB,AACD,gEACE,aAAe,CAChB,AACD,qEACE,WAAY,AACZ,eAAiB,AACjB,kBAAmB,AACnB,iBAAkB,AAClB,QAAS,AACT,MAAU,CACX,AACD,wBACE,YAAa,AACb,aAAc,AACd,kBAAmB,AACnB,SAAU,AACV,QAAS,AACT,WAAa,AACb,iDAAoD,AACpD,yCAA4C,AAC5C,mDAAuD,AACvD,wBAAyB,AACzB,2BAA4B,AAC5B,eAAgB,AAChB,sDAAyD,AACjD,6CAAiD,CAC1D,AACD,+BACE,8BAA+B,AAC/B,mCAAoC,AACpC,SAAW,CACZ,AACD,8BACE,SAAW,CACZ,AACD,8BACA,GACI,uBAAyB,CAC5B,AACD,GACI,6BAA+B,CAClC,CACA,AACD,sBACA,GACI,uBAAyB,CAC5B,AACD,GACI,6BAA+B,CAClC,CACA","file":"LikeIndicator.vue","sourcesContent":["\n.pure-button[data-v-0fbc9bd8] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-0fbc9bd8]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-0fbc9bd8] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-0fbc9bd8] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-0fbc9bd8]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-0fbc9bd8] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-0fbc9bd8]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-0fbc9bd8] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-0fbc9bd8]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-0fbc9bd8] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-0fbc9bd8]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-0fbc9bd8] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-0fbc9bd8]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-0fbc9bd8] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-0fbc9bd8] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-0fbc9bd8]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-0fbc9bd8],\nbody[data-v-0fbc9bd8] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-0fbc9bd8] {\n  float: left;\n}\n.pull-right[data-v-0fbc9bd8] {\n  float: right;\n}\n.clearfix[data-v-0fbc9bd8] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-0fbc9bd8] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-0fbc9bd8] {\n  margin: 0 !important;\n}\n.no-padding[data-v-0fbc9bd8] {\n  padding: 0 !important;\n}\n.background-white[data-v-0fbc9bd8] {\n  background-color: #fff !important;\n}\n.text-white[data-v-0fbc9bd8] {\n  color: #fff;\n}\n.fade-enter-active[data-v-0fbc9bd8],\n.fade-leave-active[data-v-0fbc9bd8] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-0fbc9bd8],\n.fade-leave-to[data-v-0fbc9bd8] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-0fbc9bd8],\n.fade-leave[data-v-0fbc9bd8] {\n  opacity: 1;\n}\n.main-container[data-v-0fbc9bd8] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-0fbc9bd8] {\n  padding: 20px;\n}\n.content-block[data-v-0fbc9bd8] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-0fbc9bd8] {\n  background-color: #fff;\n}\n.icon-margin[data-v-0fbc9bd8] {\n  margin: 0 5px;\n}\n.like-indicator[data-v-0fbc9bd8] {\n  border-radius: 6px;\n  font-size: 1em;\n  position: absolute;\n  top: 0;\n  right: 0;\n}\n.like-indicator .like-indicator-wrapper[data-v-0fbc9bd8] {\n  height: 50px;\n  width: 50px;\n  position: relative;\n}\n.like-indicator .like-indicator-wrapper .heart[data-v-0fbc9bd8] {\n  padding: 0 8px;\n}\n.like-indicator .like-indicator-wrapper .like-count[data-v-0fbc9bd8] {\n  color: #666;\n  font-size: 0.9em;\n  position: absolute;\n  line-height: 50px;\n  top: 1px;\n  left: 0px;\n}\n.heart[data-v-0fbc9bd8] {\n  width: 100px;\n  height: 100px;\n  position: absolute;\n  left: 50%;\n  top: 50%;\n  opacity: 0.5;\n  -webkit-transform: translate(-50%, -50%) scale(0.5);\n  transform: translate(-50%, -50%) scale(0.5);\n  background: url(\"../assets/icons/heart.png\") no-repeat;\n  background-position: 0 0;\n  background-size: auto 100px;\n  cursor: pointer;\n  -webkit-animation: opacity 0.3s, fave-heart 1s steps(28);\n          animation: opacity 0.3s, fave-heart 1s steps(28);\n}\n.heart.active[data-v-0fbc9bd8] {\n  background-position: -2800px 0;\n  transition: background 1s steps(28);\n  opacity: 1;\n}\n.heart[data-v-0fbc9bd8]:hover {\n  opacity: 1;\n}\n@-webkit-keyframes fave-heart {\n0% {\n    background-position: 0 0;\n}\n100% {\n    background-position: -2800px 0;\n}\n}\n@keyframes fave-heart {\n0% {\n    background-position: 0 0;\n}\n100% {\n    background-position: -2800px 0;\n}\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 684 */,
/* 685 */,
/* 686 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width{display:block;margin-bottom:10px}.pure-button.pure-button-primary{background-color:#29b474;color:#fff}.pure-button.pure-button-primary:hover{background-color:#25a268}.pure-button.pure-button-white{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success{background-color:#29b474;color:#fff}.pure-button.pure-button-success:hover{background-color:#25a268}.pure-button.pure-button-twitter{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter:hover{background-color:#2088ff}.pure-button.pure-button-subtle{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text{border-color:transparent}.pure-button.pure-button-homework{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework:hover{background-color:#fd3c51;color:#fff}body,html{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left{float:left}.pull-right{float:right}.clearfix{clear:both;float:none}.fa-icon{width:auto;height:1em}.no-margin{margin:0!important}.no-padding{padding:0!important}.background-white{background-color:#fff!important}.text-white{color:#fff}.fade-enter-active,.fade-leave-active{transition:opacity .2s}.fade-enter,.fade-leave-to{opacity:0}.fade-enter-to,.fade-leave{opacity:1}.main-container{border-radius:4px;position:relative}.main-container.main-container-padded{padding:20px}.content-block{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block{background-color:#fff}.icon-margin{margin:0 5px}.conversation-container{background-color:#fff;position:relative}.conversation-container.collapsed{max-height:600px;overflow:hidden}.conversation-container h5{margin:0;padding:0;color:#444;height:60px;line-height:60px;width:100%}.conversation-container #activity-visualisation{pointer-events:none;position:absolute;right:0;top:0;z-index:0}.conversation-container #activity-visualisation svg{overflow:visible}.conversation-container #activity-visualisation svg path{fill:#29b474}@media (max-width:600px){.conversation-container #activity-visualisation{z-index:50;left:-400px;right:auto}.conversation-container #activity-visualisation svg path{fill:rgba(41,180,116,.3)}}.conversation-container .inner-wrapper{overflow:hidden}.conversation-container .inner-wrapper .message-wrapper,.conversation-container .inner-wrapper .subtitle-wrapper{transition:all .3s ease;width:50%}.conversation-container .inner-wrapper .message-wrapper.subtitle-wrapper,.conversation-container .inner-wrapper .subtitle-wrapper.subtitle-wrapper{-webkit-transform:translateY(-50%);transform:translateY(-50%)}.conversation-container .inner-wrapper .message-wrapper.message-wrapper,.conversation-container .inner-wrapper .subtitle-wrapper.message-wrapper{-webkit-transform:translate(100%,-50%);transform:translate(100%,-50%)}@media (max-width:600px){.conversation-container .inner-wrapper .message-wrapper,.conversation-container .inner-wrapper .subtitle-wrapper{width:100%}.conversation-container .inner-wrapper .message-wrapper.subtitle-wrapper,.conversation-container .inner-wrapper .subtitle-wrapper.subtitle-wrapper{-webkit-transform:translateY(-50%);transform:translateY(-50%)}.conversation-container .inner-wrapper .message-wrapper.message-wrapper,.conversation-container .inner-wrapper .subtitle-wrapper.message-wrapper{-webkit-transform:translate(100%,-50%);transform:translate(100%,-50%)}.conversation-container .inner-wrapper.message-priority .message-wrapper,.conversation-container .inner-wrapper.message-priority .subtitle-wrapper{width:100%}.conversation-container .inner-wrapper.message-priority .message-wrapper.subtitle-wrapper,.conversation-container .inner-wrapper.message-priority .subtitle-wrapper.subtitle-wrapper{-webkit-transform:translate(-100%,-50%);transform:translate(-100%,-50%)}.conversation-container .inner-wrapper.message-priority .message-wrapper.message-wrapper,.conversation-container .inner-wrapper.message-priority .subtitle-wrapper.message-wrapper{-webkit-transform:translateY(-50%);transform:translateY(-50%)}}#view-toggle{transition:all .3s ease;border-radius:50%;background-color:#29b474;color:#fff;display:none;height:80px;width:80px;position:fixed;z-index:57;top:50%;left:calc(100% - 40px);-webkit-transform:translateY(-50%);transform:translateY(-50%);text-align:left}@media (max-width:600px){#view-toggle{display:block}}#view-toggle .fa-icon{transition:all .3s ease;float:left;height:80px;padding:0 10px;width:20px}#view-toggle.message-priority{left:-40px;-webkit-transform:translateY(-50%);transform:translateY(-50%)}", "", {"version":3,"sources":["/root/connectedacademy/src/components/ConversationContainer.vue"],"names":[],"mappings":"AACA,aACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,mBACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,wBACE,cAAe,AACf,kBAAoB,CACrB,AACD,iCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,uCACE,wBAA0B,CAC3B,AACD,+BACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,qCACE,+BAAkC,CACnC,AACD,iCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,uCACE,wBAA0B,CAC3B,AACD,iCACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,uCACE,wBAA0B,CAC3B,AACD,gCACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,8BACE,wBAA0B,CAC3B,AACD,kCACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,wCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,UAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,WACE,UAAY,CACb,AACD,YACE,WAAa,CACd,AACD,UACE,WAAY,AACZ,UAAY,CACb,AACD,SACE,WAAY,AACZ,UAAY,CACb,AACD,WACE,kBAAqB,CACtB,AACD,YACE,mBAAsB,CACvB,AACD,kBACE,+BAAkC,CACnC,AACD,YACE,UAAY,CACb,AACD,sCAEE,sBAAyB,CAC1B,AACD,2BAEE,SAAW,CACZ,AACD,2BAEE,SAAW,CACZ,AACD,gBACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,sCACE,YAAc,CACf,AACD,eACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,2BACE,qBAAuB,CACxB,AACD,aACE,YAAc,CACf,AACD,wBACE,sBAAuB,AACvB,iBAAmB,CACpB,AACD,kCACE,iBAAkB,AAClB,eAAiB,CAClB,AACD,2BACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,YAAa,AACb,iBAAkB,AAClB,UAAY,CACb,AACD,gDACE,oBAAqB,AACrB,kBAAmB,AACnB,QAAS,AACT,MAAO,AACP,SAAW,CACZ,AACD,oDACE,gBAAkB,CACnB,AACD,yDACE,YAAc,CACf,AACD,yBACA,gDACI,WAAY,AACZ,YAAa,AACb,UAAY,CACf,AACD,yDACI,wBAA2B,CAC9B,CACA,AACD,uCACE,eAAiB,CAClB,AACD,iHAEE,wBAA0B,AAC1B,SAAW,CACZ,AACD,mJAEE,mCAAuC,AACvC,0BAA+B,CAChC,AACD,iJAEE,uCAAyC,AACzC,8BAAiC,CAClC,AACD,yBACA,iHAEI,UAAY,CACf,AACD,mJAEI,mCAAuC,AACvC,0BAA+B,CAClC,AACD,iJAEI,uCAAyC,AACzC,8BAAiC,CACpC,AACD,mJAEI,UAAY,CACf,AACD,qLAEI,wCAA0C,AAC1C,+BAAkC,CACrC,AACD,mLAEI,mCAAuC,AACvC,0BAA+B,CAClC,CACA,AACD,aACE,wBAA0B,AAC1B,kBAAmB,AACnB,yBAA0B,AAC1B,WAAY,AACZ,aAAc,AACd,YAAa,AACb,WAAY,AACZ,eAAgB,AAChB,WAAY,AACZ,QAAS,AACT,uBAAwB,AACxB,mCAAuC,AACvC,2BAA+B,AAC/B,eAAiB,CAClB,AACD,yBACA,aACI,aAAe,CAClB,CACA,AACD,sBACE,wBAA0B,AAC1B,WAAY,AACZ,YAAa,AACb,eAAgB,AAChB,UAAY,CACb,AACD,8BACE,WAAY,AACZ,mCAAuC,AACvC,0BAA+B,CAChC","file":"ConversationContainer.vue","sourcesContent":["\n.pure-button {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml,\nbody {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left {\n  float: left;\n}\n.pull-right {\n  float: right;\n}\n.clearfix {\n  clear: both;\n  float: none;\n}\n.fa-icon {\n  width: auto;\n  height: 1em;\n}\n.no-margin {\n  margin: 0 !important;\n}\n.no-padding {\n  padding: 0 !important;\n}\n.background-white {\n  background-color: #fff !important;\n}\n.text-white {\n  color: #fff;\n}\n.fade-enter-active,\n.fade-leave-active {\n  transition: opacity 0.2s;\n}\n.fade-enter,\n.fade-leave-to {\n  opacity: 0;\n}\n.fade-enter-to,\n.fade-leave {\n  opacity: 1;\n}\n.main-container {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded {\n  padding: 20px;\n}\n.content-block {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block {\n  background-color: #fff;\n}\n.icon-margin {\n  margin: 0 5px;\n}\n.conversation-container {\n  background-color: #fff;\n  position: relative;\n}\n.conversation-container.collapsed {\n  max-height: 600px;\n  overflow: hidden;\n}\n.conversation-container h5 {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  height: 60px;\n  line-height: 60px;\n  width: 100%;\n}\n.conversation-container #activity-visualisation {\n  pointer-events: none;\n  position: absolute;\n  right: 0;\n  top: 0;\n  z-index: 0;\n}\n.conversation-container #activity-visualisation svg {\n  overflow: visible;\n}\n.conversation-container #activity-visualisation svg path {\n  fill: #29b474;\n}\n@media (max-width: 600px) {\n.conversation-container #activity-visualisation {\n    z-index: 50;\n    left: -400px;\n    right: auto;\n}\n.conversation-container #activity-visualisation svg path {\n    fill: rgba(41,180,116,0.3);\n}\n}\n.conversation-container .inner-wrapper {\n  overflow: hidden;\n}\n.conversation-container .inner-wrapper .subtitle-wrapper,\n.conversation-container .inner-wrapper .message-wrapper {\n  transition: all 0.3s ease;\n  width: 50%;\n}\n.conversation-container .inner-wrapper .subtitle-wrapper.subtitle-wrapper,\n.conversation-container .inner-wrapper .message-wrapper.subtitle-wrapper {\n  -webkit-transform: translate(0%, -50%);\n  transform: translate(0%, -50%);\n}\n.conversation-container .inner-wrapper .subtitle-wrapper.message-wrapper,\n.conversation-container .inner-wrapper .message-wrapper.message-wrapper {\n  -webkit-transform: translate(100%, -50%);\n  transform: translate(100%, -50%);\n}\n@media (max-width: 600px) {\n.conversation-container .inner-wrapper .subtitle-wrapper,\n  .conversation-container .inner-wrapper .message-wrapper {\n    width: 100%;\n}\n.conversation-container .inner-wrapper .subtitle-wrapper.subtitle-wrapper,\n  .conversation-container .inner-wrapper .message-wrapper.subtitle-wrapper {\n    -webkit-transform: translate(0%, -50%);\n    transform: translate(0%, -50%);\n}\n.conversation-container .inner-wrapper .subtitle-wrapper.message-wrapper,\n  .conversation-container .inner-wrapper .message-wrapper.message-wrapper {\n    -webkit-transform: translate(100%, -50%);\n    transform: translate(100%, -50%);\n}\n.conversation-container .inner-wrapper.message-priority .subtitle-wrapper,\n  .conversation-container .inner-wrapper.message-priority .message-wrapper {\n    width: 100%;\n}\n.conversation-container .inner-wrapper.message-priority .subtitle-wrapper.subtitle-wrapper,\n  .conversation-container .inner-wrapper.message-priority .message-wrapper.subtitle-wrapper {\n    -webkit-transform: translate(-100%, -50%);\n    transform: translate(-100%, -50%);\n}\n.conversation-container .inner-wrapper.message-priority .subtitle-wrapper.message-wrapper,\n  .conversation-container .inner-wrapper.message-priority .message-wrapper.message-wrapper {\n    -webkit-transform: translate(0%, -50%);\n    transform: translate(0%, -50%);\n}\n}\n#view-toggle {\n  transition: all 0.3s ease;\n  border-radius: 50%;\n  background-color: #29b474;\n  color: #fff;\n  display: none;\n  height: 80px;\n  width: 80px;\n  position: fixed;\n  z-index: 57;\n  top: 50%;\n  left: calc(100% - 40px);\n  -webkit-transform: translate(0%, -50%);\n  transform: translate(0%, -50%);\n  text-align: left;\n}\n@media (max-width: 600px) {\n#view-toggle {\n    display: block;\n}\n}\n#view-toggle .fa-icon {\n  transition: all 0.3s ease;\n  float: left;\n  height: 80px;\n  padding: 0 10px;\n  width: 20px;\n}\n#view-toggle.message-priority {\n  left: -40px;\n  -webkit-transform: translate(0%, -50%);\n  transform: translate(0%, -50%);\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 687 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-1fe69ebc]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-1fe69ebc]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-1fe69ebc]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-1fe69ebc]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-1fe69ebc]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-1fe69ebc]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-1fe69ebc]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-1fe69ebc]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-1fe69ebc]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-1fe69ebc]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-1fe69ebc]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-1fe69ebc]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-1fe69ebc]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-1fe69ebc]{border-color:transparent}.pure-button.pure-button-homework[data-v-1fe69ebc]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-1fe69ebc]:hover{background-color:#fd3c51;color:#fff}body[data-v-1fe69ebc],html[data-v-1fe69ebc]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-1fe69ebc]{float:left}.pull-right[data-v-1fe69ebc]{float:right}.clearfix[data-v-1fe69ebc]{clear:both;float:none}.fa-icon[data-v-1fe69ebc]{width:auto;height:1em}.no-margin[data-v-1fe69ebc]{margin:0!important}.no-padding[data-v-1fe69ebc]{padding:0!important}.background-white[data-v-1fe69ebc]{background-color:#fff!important}.text-white[data-v-1fe69ebc]{color:#fff}.fade-enter-active[data-v-1fe69ebc],.fade-leave-active[data-v-1fe69ebc]{transition:opacity .2s}.fade-enter[data-v-1fe69ebc],.fade-leave-to[data-v-1fe69ebc]{opacity:0}.fade-enter-to[data-v-1fe69ebc],.fade-leave[data-v-1fe69ebc]{opacity:1}.main-container[data-v-1fe69ebc]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-1fe69ebc]{padding:20px}.content-block[data-v-1fe69ebc]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-1fe69ebc]{background-color:#fff}.icon-margin[data-v-1fe69ebc]{margin:0 5px}", "", {"version":3,"sources":["/root/connectedacademy/src/components/webinar/WebinarMessageTicker.vue"],"names":[],"mappings":"AACA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf","file":"WebinarMessageTicker.vue","sourcesContent":["\n.pure-button[data-v-1fe69ebc] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-1fe69ebc]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-1fe69ebc] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-1fe69ebc] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-1fe69ebc]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-1fe69ebc] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-1fe69ebc]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-1fe69ebc] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-1fe69ebc]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-1fe69ebc] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-1fe69ebc]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-1fe69ebc] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-1fe69ebc]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-1fe69ebc] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-1fe69ebc] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-1fe69ebc]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-1fe69ebc],\nbody[data-v-1fe69ebc] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-1fe69ebc] {\n  float: left;\n}\n.pull-right[data-v-1fe69ebc] {\n  float: right;\n}\n.clearfix[data-v-1fe69ebc] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-1fe69ebc] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-1fe69ebc] {\n  margin: 0 !important;\n}\n.no-padding[data-v-1fe69ebc] {\n  padding: 0 !important;\n}\n.background-white[data-v-1fe69ebc] {\n  background-color: #fff !important;\n}\n.text-white[data-v-1fe69ebc] {\n  color: #fff;\n}\n.fade-enter-active[data-v-1fe69ebc],\n.fade-leave-active[data-v-1fe69ebc] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-1fe69ebc],\n.fade-leave-to[data-v-1fe69ebc] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-1fe69ebc],\n.fade-leave[data-v-1fe69ebc] {\n  opacity: 1;\n}\n.main-container[data-v-1fe69ebc] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-1fe69ebc] {\n  padding: 20px;\n}\n.content-block[data-v-1fe69ebc] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-1fe69ebc] {\n  background-color: #fff;\n}\n.icon-margin[data-v-1fe69ebc] {\n  margin: 0 5px;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 688 */,
/* 689 */,
/* 690 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".soundcloud-wrapper .soundcloud-container[data-v-25b27813]{margin-bottom:20px;position:relative}", "", {"version":3,"sources":["/root/connectedacademy/src/components/SoundcloudEmbed.vue"],"names":[],"mappings":"AACA,2DACE,mBAAoB,AACpB,iBAAmB,CACpB","file":"SoundcloudEmbed.vue","sourcesContent":["\n.soundcloud-wrapper .soundcloud-container[data-v-25b27813] {\n  margin-bottom: 20px;\n  position: relative;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 691 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-28db7dfa]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-28db7dfa]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-28db7dfa]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-28db7dfa]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-28db7dfa]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-28db7dfa]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-28db7dfa]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-28db7dfa]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-28db7dfa]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-28db7dfa]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-28db7dfa]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-28db7dfa]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-28db7dfa]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-28db7dfa]{border-color:transparent}.pure-button.pure-button-homework[data-v-28db7dfa]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-28db7dfa]:hover{background-color:#fd3c51;color:#fff}body[data-v-28db7dfa],html[data-v-28db7dfa]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-28db7dfa]{float:left}.pull-right[data-v-28db7dfa]{float:right}.clearfix[data-v-28db7dfa]{clear:both;float:none}.fa-icon[data-v-28db7dfa]{width:auto;height:1em}.no-margin[data-v-28db7dfa]{margin:0!important}.no-padding[data-v-28db7dfa]{padding:0!important}.background-white[data-v-28db7dfa]{background-color:#fff!important}.text-white[data-v-28db7dfa]{color:#fff}.fade-enter-active[data-v-28db7dfa],.fade-leave-active[data-v-28db7dfa]{transition:opacity .2s}.fade-enter[data-v-28db7dfa],.fade-leave-to[data-v-28db7dfa]{opacity:0}.fade-enter-to[data-v-28db7dfa],.fade-leave[data-v-28db7dfa]{opacity:1}.main-container[data-v-28db7dfa]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-28db7dfa]{padding:20px}.content-block[data-v-28db7dfa]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-28db7dfa]{background-color:#fff}.icon-margin[data-v-28db7dfa]{margin:0 5px}.course-content-wrapper[data-v-28db7dfa]{margin-bottom:10px}.course-content-wrapper[data-v-28db7dfa]:last-child{margin-bottom:0}.course-content-wrapper .course-content-group .course-content[data-v-28db7dfa]{border-radius:4px;box-shadow:0 0 10px 5px rgba(0,0,0,.01);-moz-box-shadow:0 0 10px 5px rgba(0,0,0,.01);-webkit-box-shadow:0 0 10px 5px rgba(0,0,0,.01);background-color:#fff;margin:20px 0 0;min-height:100px;padding:0;position:relative}@media (max-width:800px){.course-content-wrapper .course-content-group .course-content[data-v-28db7dfa]{border-radius:0;margin:20px 0 0}}.course-content-wrapper .course-content-group .course-content h5.content-subheader[data-v-28db7dfa]{margin:0;padding:0;color:#444;font-weight:300}.course-content-wrapper .course-content-group .course-content p.content-description[data-v-28db7dfa]{margin:0;padding:0;color:#666;font-size:1em}.course-content-wrapper .course-content-group .course-content a[data-v-28db7dfa]{text-decoration:none}.course-content-wrapper .course-content-group .course-content .course-content--header[data-v-28db7dfa]{background-color:transparent;overflow:hidden;padding:20px 20px 10px}.course-content-wrapper .course-content-group .course-content .course-content--header h1.content-title[data-v-28db7dfa]{margin:0;padding:0;color:#444;font-size:1.3em;font-weight:700}.course-content-wrapper .course-content-group .course-content .course-content--header.block[data-v-28db7dfa]{background-color:#29b474;padding:30px;text-align:center}.course-content-wrapper .course-content-group .course-content .course-content--header.block h1.content-title[data-v-28db7dfa]{color:#fff;font-size:2em;font-weight:700;margin-bottom:10px}.course-content-wrapper .course-content-group .course-content .course-content--header.block p.content-description[data-v-28db7dfa]{color:#fff;margin:0 auto}.course-content-wrapper .course-content-group .course-content .course-content--body[data-v-28db7dfa]{overflow:hidden;padding:0 20px 10px}.course-content-wrapper .course-content-group .course-content .course-content--body h1[data-v-28db7dfa],.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-28db7dfa],.course-content-wrapper .course-content-group .course-content .course-content--body h3[data-v-28db7dfa],.course-content-wrapper .course-content-group .course-content .course-content--body h4[data-v-28db7dfa],.course-content-wrapper .course-content-group .course-content .course-content--body h5[data-v-28db7dfa]{font-weight:300}.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-28db7dfa]{color:#444;font-size:1.3em;font-weight:700}.course-content-wrapper .course-content-group .course-content .course-content--footer[data-v-28db7dfa]{padding:20px}.course-content-wrapper .course-content-group.course-content-group--question[data-v-28db7dfa]{border-radius:6px;background-color:hsla(0,0%,100%,.15);padding:15px;margin-top:10px}.course-content-wrapper .course-content-group.course-content-group--question .course-content[data-v-28db7dfa]{margin:0}.course-content[data-v-28db7dfa]{position:relative}.course-content .course-content--header[data-v-28db7dfa]{background-color:#fd853c!important;text-align:center}.course-content .course-content--header h1.content-title[data-v-28db7dfa]{color:#fff;text-transform:capitalize}.course-content .course-content--header h2.content-subtitle[data-v-28db7dfa]{color:#fff;font-weight:400}.course-content .course-content--body[data-v-28db7dfa]{background-color:transparent;padding:20px 40px!important;text-align:center}.course-content .course-content--body h1[data-v-28db7dfa],.course-content .course-content--body h2[data-v-28db7dfa],.course-content .course-content--body h5[data-v-28db7dfa]{margin:0;padding:0;color:#fff;padding:5px}.course-content .course-content--body h5[data-v-28db7dfa]{opacity:.5}.course-content .pure-button[data-v-28db7dfa]{background-color:transparent;border:1px solid #fff;color:#fff;margin:10px auto 5px}.course-content .pure-button[data-v-28db7dfa]:hover{background-color:#fff;color:#fd853c}", "", {"version":3,"sources":["/root/connectedacademy/src/components/conversation/FutureContent.vue"],"names":[],"mappings":"AAsIA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,yCACE,kBAAoB,CACrB,AACD,oDACE,eAAiB,CAClB,AACD,+EACE,kBAAmB,AACnB,wCAA0C,AAC1C,6CAA+C,AAC/C,gDAAkD,AAClD,sBAAuB,AACvB,gBAAmB,AACnB,iBAAkB,AAClB,UAAW,AACX,iBAAmB,CACpB,AACD,yBACA,+EACI,gBAAiB,AACjB,eAAmB,CACtB,CACA,AACD,oGACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,eAAiB,CAClB,AACD,qGACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,aAAe,CAChB,AACD,iFACE,oBAAsB,CACvB,AACD,uGACE,6BAA8B,AAC9B,gBAAiB,AACjB,sBAA6B,CAC9B,AACD,wHACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,6GACE,yBAA0B,AAC1B,aAAc,AACd,iBAAmB,CACpB,AACD,8HACE,WAAY,AACZ,cAAe,AACf,gBAAkB,AAClB,kBAAoB,CACrB,AACD,mIACE,WAAY,AACZ,aAAe,CAChB,AACD,qGACE,gBAAiB,AACjB,mBAA4B,CAC7B,AACD,wgBAKE,eAAiB,CAClB,AACD,wGACE,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,uGACE,YAAc,CACf,AACD,8FACE,kBAAmB,AACnB,qCAAyC,AACzC,aAAc,AACd,eAAiB,CAClB,AACD,8GACE,QAAU,CACX,AACD,iCACE,iBAAmB,CACpB,AACD,yDACE,mCAAqC,AACrC,iBAAmB,CACpB,AACD,0EACE,WAAY,AACZ,yBAA2B,CAC5B,AACD,6EACE,WAAY,AACZ,eAAoB,CACrB,AACD,uDACE,6BAA8B,AAC9B,4BAA8B,AAC9B,iBAAmB,CACpB,AACD,8KAGE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,WAAa,CACd,AACD,0DACE,UAAa,CACd,AACD,8CACE,6BAA8B,AAC9B,sBAAuB,AACvB,WAAY,AACZ,oBAA2B,CAC5B,AACD,oDACE,sBAAuB,AACvB,aAAe,CAChB","file":"FutureContent.vue","sourcesContent":["\n.pure-button[data-v-28db7dfa] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-28db7dfa]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-28db7dfa] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-28db7dfa] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-28db7dfa]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-28db7dfa] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-28db7dfa]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-28db7dfa] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-28db7dfa]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-28db7dfa] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-28db7dfa]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-28db7dfa] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-28db7dfa]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-28db7dfa] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-28db7dfa] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-28db7dfa]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-28db7dfa],\nbody[data-v-28db7dfa] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-28db7dfa] {\n  float: left;\n}\n.pull-right[data-v-28db7dfa] {\n  float: right;\n}\n.clearfix[data-v-28db7dfa] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-28db7dfa] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-28db7dfa] {\n  margin: 0 !important;\n}\n.no-padding[data-v-28db7dfa] {\n  padding: 0 !important;\n}\n.background-white[data-v-28db7dfa] {\n  background-color: #fff !important;\n}\n.text-white[data-v-28db7dfa] {\n  color: #fff;\n}\n.fade-enter-active[data-v-28db7dfa],\n.fade-leave-active[data-v-28db7dfa] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-28db7dfa],\n.fade-leave-to[data-v-28db7dfa] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-28db7dfa],\n.fade-leave[data-v-28db7dfa] {\n  opacity: 1;\n}\n.main-container[data-v-28db7dfa] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-28db7dfa] {\n  padding: 20px;\n}\n.content-block[data-v-28db7dfa] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-28db7dfa] {\n  background-color: #fff;\n}\n.icon-margin[data-v-28db7dfa] {\n  margin: 0 5px;\n}\n.pure-button[data-v-28db7dfa] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-28db7dfa]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-28db7dfa] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-28db7dfa] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-28db7dfa]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-28db7dfa] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-28db7dfa]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-28db7dfa] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-28db7dfa]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-28db7dfa] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-28db7dfa]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-28db7dfa] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-28db7dfa]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-28db7dfa] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-28db7dfa] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-28db7dfa]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-28db7dfa],\nbody[data-v-28db7dfa] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-28db7dfa] {\n  float: left;\n}\n.pull-right[data-v-28db7dfa] {\n  float: right;\n}\n.clearfix[data-v-28db7dfa] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-28db7dfa] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-28db7dfa] {\n  margin: 0 !important;\n}\n.no-padding[data-v-28db7dfa] {\n  padding: 0 !important;\n}\n.background-white[data-v-28db7dfa] {\n  background-color: #fff !important;\n}\n.text-white[data-v-28db7dfa] {\n  color: #fff;\n}\n.fade-enter-active[data-v-28db7dfa],\n.fade-leave-active[data-v-28db7dfa] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-28db7dfa],\n.fade-leave-to[data-v-28db7dfa] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-28db7dfa],\n.fade-leave[data-v-28db7dfa] {\n  opacity: 1;\n}\n.main-container[data-v-28db7dfa] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-28db7dfa] {\n  padding: 20px;\n}\n.content-block[data-v-28db7dfa] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-28db7dfa] {\n  background-color: #fff;\n}\n.icon-margin[data-v-28db7dfa] {\n  margin: 0 5px;\n}\n.course-content-wrapper[data-v-28db7dfa] {\n  margin-bottom: 10px;\n}\n.course-content-wrapper[data-v-28db7dfa]:last-child {\n  margin-bottom: 0;\n}\n.course-content-wrapper .course-content-group .course-content[data-v-28db7dfa] {\n  border-radius: 4px;\n  box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -moz-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -webkit-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  background-color: #fff;\n  margin: 20px 0 0 0;\n  min-height: 100px;\n  padding: 0;\n  position: relative;\n}\n@media (max-width: 800px) {\n.course-content-wrapper .course-content-group .course-content[data-v-28db7dfa] {\n    border-radius: 0;\n    margin: 20px 0 0 0;\n}\n}\n.course-content-wrapper .course-content-group .course-content h5.content-subheader[data-v-28db7dfa] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  font-weight: 300;\n}\n.course-content-wrapper .course-content-group .course-content p.content-description[data-v-28db7dfa] {\n  margin: 0;\n  padding: 0;\n  color: #666;\n  font-size: 1em;\n}\n.course-content-wrapper .course-content-group .course-content a[data-v-28db7dfa] {\n  text-decoration: none;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header[data-v-28db7dfa] {\n  background-color: transparent;\n  overflow: hidden;\n  padding: 20px 20px 10px 20px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header h1.content-title[data-v-28db7dfa] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block[data-v-28db7dfa] {\n  background-color: #29b474;\n  padding: 30px;\n  text-align: center;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block h1.content-title[data-v-28db7dfa] {\n  color: #fff;\n  font-size: 2em;\n  font-weight: bold;\n  margin-bottom: 10px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block p.content-description[data-v-28db7dfa] {\n  color: #fff;\n  margin: 0 auto;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body[data-v-28db7dfa] {\n  overflow: hidden;\n  padding: 0px 20px 10px 20px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body h1[data-v-28db7dfa],\n.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-28db7dfa],\n.course-content-wrapper .course-content-group .course-content .course-content--body h3[data-v-28db7dfa],\n.course-content-wrapper .course-content-group .course-content .course-content--body h4[data-v-28db7dfa],\n.course-content-wrapper .course-content-group .course-content .course-content--body h5[data-v-28db7dfa] {\n  font-weight: 300;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-28db7dfa] {\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--footer[data-v-28db7dfa] {\n  padding: 20px;\n}\n.course-content-wrapper .course-content-group.course-content-group--question[data-v-28db7dfa] {\n  border-radius: 6px;\n  background-color: rgba(255,255,255,0.15);\n  padding: 15px;\n  margin-top: 10px;\n}\n.course-content-wrapper .course-content-group.course-content-group--question .course-content[data-v-28db7dfa] {\n  margin: 0;\n}\n.course-content[data-v-28db7dfa] {\n  position: relative;\n}\n.course-content .course-content--header[data-v-28db7dfa] {\n  background-color: #fd853c !important;\n  text-align: center;\n}\n.course-content .course-content--header h1.content-title[data-v-28db7dfa] {\n  color: #fff;\n  text-transform: capitalize;\n}\n.course-content .course-content--header h2.content-subtitle[data-v-28db7dfa] {\n  color: #fff;\n  font-weight: normal;\n}\n.course-content .course-content--body[data-v-28db7dfa] {\n  background-color: transparent;\n  padding: 20px 40px !important;\n  text-align: center;\n}\n.course-content .course-content--body h1[data-v-28db7dfa],\n.course-content .course-content--body h2[data-v-28db7dfa],\n.course-content .course-content--body h5[data-v-28db7dfa] {\n  margin: 0;\n  padding: 0;\n  color: #fff;\n  padding: 5px;\n}\n.course-content .course-content--body h5[data-v-28db7dfa] {\n  opacity: 0.5;\n}\n.course-content .pure-button[data-v-28db7dfa] {\n  background-color: transparent;\n  border: #fff 1px solid;\n  color: #fff;\n  margin: 10px auto 5px auto;\n}\n.course-content .pure-button[data-v-28db7dfa]:hover {\n  background-color: #fff;\n  color: #fd853c;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 692 */,
/* 693 */,
/* 694 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-33fa1589]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-33fa1589]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-33fa1589]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-33fa1589]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-33fa1589]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-33fa1589]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-33fa1589]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-33fa1589]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-33fa1589]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-33fa1589]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-33fa1589]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-33fa1589]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-33fa1589]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-33fa1589]{border-color:transparent}.pure-button.pure-button-homework[data-v-33fa1589]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-33fa1589]:hover{background-color:#fd3c51;color:#fff}body[data-v-33fa1589],html[data-v-33fa1589]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-33fa1589]{float:left}.pull-right[data-v-33fa1589]{float:right}.clearfix[data-v-33fa1589]{clear:both;float:none}.fa-icon[data-v-33fa1589]{width:auto;height:1em}.no-margin[data-v-33fa1589]{margin:0!important}.no-padding[data-v-33fa1589]{padding:0!important}.background-white[data-v-33fa1589]{background-color:#fff!important}.text-white[data-v-33fa1589]{color:#fff}.fade-enter-active[data-v-33fa1589],.fade-leave-active[data-v-33fa1589]{transition:opacity .2s}.fade-enter[data-v-33fa1589],.fade-leave-to[data-v-33fa1589]{opacity:0}.fade-enter-to[data-v-33fa1589],.fade-leave[data-v-33fa1589]{opacity:1}.main-container[data-v-33fa1589]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-33fa1589]{padding:20px}.content-block[data-v-33fa1589]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-33fa1589]{background-color:#fff}.icon-margin[data-v-33fa1589]{margin:0 5px}.course-content-wrapper[data-v-33fa1589]{margin-bottom:10px}.course-content-wrapper[data-v-33fa1589]:last-child{margin-bottom:0}.course-content-wrapper .course-content-group .course-content[data-v-33fa1589]{border-radius:4px;box-shadow:0 0 10px 5px rgba(0,0,0,.01);-moz-box-shadow:0 0 10px 5px rgba(0,0,0,.01);-webkit-box-shadow:0 0 10px 5px rgba(0,0,0,.01);background-color:#fff;margin:20px 0 0;min-height:100px;padding:0;position:relative}@media (max-width:800px){.course-content-wrapper .course-content-group .course-content[data-v-33fa1589]{border-radius:0;margin:20px 0 0}}.course-content-wrapper .course-content-group .course-content h5.content-subheader[data-v-33fa1589]{margin:0;padding:0;color:#444;font-weight:300}.course-content-wrapper .course-content-group .course-content p.content-description[data-v-33fa1589]{margin:0;padding:0;color:#666;font-size:1em}.course-content-wrapper .course-content-group .course-content a[data-v-33fa1589]{text-decoration:none}.course-content-wrapper .course-content-group .course-content .course-content--header[data-v-33fa1589]{background-color:transparent;overflow:hidden;padding:20px 20px 10px}.course-content-wrapper .course-content-group .course-content .course-content--header h1.content-title[data-v-33fa1589]{margin:0;padding:0;color:#444;font-size:1.3em;font-weight:700}.course-content-wrapper .course-content-group .course-content .course-content--header.block[data-v-33fa1589]{background-color:#29b474;padding:30px;text-align:center}.course-content-wrapper .course-content-group .course-content .course-content--header.block h1.content-title[data-v-33fa1589]{color:#fff;font-size:2em;font-weight:700;margin-bottom:10px}.course-content-wrapper .course-content-group .course-content .course-content--header.block p.content-description[data-v-33fa1589]{color:#fff;margin:0 auto}.course-content-wrapper .course-content-group .course-content .course-content--body[data-v-33fa1589]{overflow:hidden;padding:0 20px 10px}.course-content-wrapper .course-content-group .course-content .course-content--body h1[data-v-33fa1589],.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-33fa1589],.course-content-wrapper .course-content-group .course-content .course-content--body h3[data-v-33fa1589],.course-content-wrapper .course-content-group .course-content .course-content--body h4[data-v-33fa1589],.course-content-wrapper .course-content-group .course-content .course-content--body h5[data-v-33fa1589]{font-weight:300}.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-33fa1589]{color:#444;font-size:1.3em;font-weight:700}.course-content-wrapper .course-content-group .course-content .course-content--footer[data-v-33fa1589]{padding:20px}.course-content-wrapper .course-content-group.course-content-group--question[data-v-33fa1589]{border-radius:6px;background-color:hsla(0,0%,100%,.15);padding:15px;margin-top:10px}.course-content-wrapper .course-content-group.course-content-group--question .course-content[data-v-33fa1589]{margin:0}.course-content[data-v-33fa1589]{position:relative}.course-content .course-content--header[data-v-33fa1589]{background-color:#161616!important;text-align:center}.course-content .course-content--header h1.content-title[data-v-33fa1589]{color:#fff;text-transform:capitalize}.course-content .course-content--header h2.content-subtitle[data-v-33fa1589]{color:#fff;font-weight:400}.course-content .course-content--body[data-v-33fa1589]{background-color:transparent;padding:20px 40px!important;text-align:center}.course-content .course-content--body h1[data-v-33fa1589],.course-content .course-content--body h2[data-v-33fa1589],.course-content .course-content--body h5[data-v-33fa1589]{margin:0;padding:0;color:#fff;padding:5px}.course-content .course-content--body h5[data-v-33fa1589]{opacity:.5}.course-content .pure-button[data-v-33fa1589]{background-color:transparent;border:1px solid #fff;color:#fff;margin:20px auto 5px}.course-content .pure-button[data-v-33fa1589]:hover{background-color:#fff;color:#161616}", "", {"version":3,"sources":["/root/connectedacademy/src/components/conversation/NextClass.vue"],"names":[],"mappings":"AAsIA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,yCACE,kBAAoB,CACrB,AACD,oDACE,eAAiB,CAClB,AACD,+EACE,kBAAmB,AACnB,wCAA0C,AAC1C,6CAA+C,AAC/C,gDAAkD,AAClD,sBAAuB,AACvB,gBAAmB,AACnB,iBAAkB,AAClB,UAAW,AACX,iBAAmB,CACpB,AACD,yBACA,+EACI,gBAAiB,AACjB,eAAmB,CACtB,CACA,AACD,oGACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,eAAiB,CAClB,AACD,qGACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,aAAe,CAChB,AACD,iFACE,oBAAsB,CACvB,AACD,uGACE,6BAA8B,AAC9B,gBAAiB,AACjB,sBAA6B,CAC9B,AACD,wHACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,6GACE,yBAA0B,AAC1B,aAAc,AACd,iBAAmB,CACpB,AACD,8HACE,WAAY,AACZ,cAAe,AACf,gBAAkB,AAClB,kBAAoB,CACrB,AACD,mIACE,WAAY,AACZ,aAAe,CAChB,AACD,qGACE,gBAAiB,AACjB,mBAA4B,CAC7B,AACD,wgBAKE,eAAiB,CAClB,AACD,wGACE,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,uGACE,YAAc,CACf,AACD,8FACE,kBAAmB,AACnB,qCAAyC,AACzC,aAAc,AACd,eAAiB,CAClB,AACD,8GACE,QAAU,CACX,AACD,iCACE,iBAAmB,CACpB,AACD,yDACE,mCAAqC,AACrC,iBAAmB,CACpB,AACD,0EACE,WAAY,AACZ,yBAA2B,CAC5B,AACD,6EACE,WAAY,AACZ,eAAoB,CACrB,AACD,uDACE,6BAA8B,AAC9B,4BAA8B,AAC9B,iBAAmB,CACpB,AACD,8KAGE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,WAAa,CACd,AACD,0DACE,UAAa,CACd,AACD,8CACE,6BAA8B,AAC9B,sBAAuB,AACvB,WAAY,AACZ,oBAA2B,CAC5B,AACD,oDACE,sBAAuB,AACvB,aAAe,CAChB","file":"NextClass.vue","sourcesContent":["\n.pure-button[data-v-33fa1589] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-33fa1589]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-33fa1589] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-33fa1589] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-33fa1589]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-33fa1589] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-33fa1589]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-33fa1589] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-33fa1589]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-33fa1589] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-33fa1589]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-33fa1589] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-33fa1589]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-33fa1589] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-33fa1589] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-33fa1589]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-33fa1589],\nbody[data-v-33fa1589] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-33fa1589] {\n  float: left;\n}\n.pull-right[data-v-33fa1589] {\n  float: right;\n}\n.clearfix[data-v-33fa1589] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-33fa1589] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-33fa1589] {\n  margin: 0 !important;\n}\n.no-padding[data-v-33fa1589] {\n  padding: 0 !important;\n}\n.background-white[data-v-33fa1589] {\n  background-color: #fff !important;\n}\n.text-white[data-v-33fa1589] {\n  color: #fff;\n}\n.fade-enter-active[data-v-33fa1589],\n.fade-leave-active[data-v-33fa1589] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-33fa1589],\n.fade-leave-to[data-v-33fa1589] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-33fa1589],\n.fade-leave[data-v-33fa1589] {\n  opacity: 1;\n}\n.main-container[data-v-33fa1589] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-33fa1589] {\n  padding: 20px;\n}\n.content-block[data-v-33fa1589] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-33fa1589] {\n  background-color: #fff;\n}\n.icon-margin[data-v-33fa1589] {\n  margin: 0 5px;\n}\n.pure-button[data-v-33fa1589] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-33fa1589]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-33fa1589] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-33fa1589] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-33fa1589]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-33fa1589] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-33fa1589]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-33fa1589] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-33fa1589]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-33fa1589] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-33fa1589]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-33fa1589] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-33fa1589]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-33fa1589] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-33fa1589] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-33fa1589]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-33fa1589],\nbody[data-v-33fa1589] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-33fa1589] {\n  float: left;\n}\n.pull-right[data-v-33fa1589] {\n  float: right;\n}\n.clearfix[data-v-33fa1589] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-33fa1589] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-33fa1589] {\n  margin: 0 !important;\n}\n.no-padding[data-v-33fa1589] {\n  padding: 0 !important;\n}\n.background-white[data-v-33fa1589] {\n  background-color: #fff !important;\n}\n.text-white[data-v-33fa1589] {\n  color: #fff;\n}\n.fade-enter-active[data-v-33fa1589],\n.fade-leave-active[data-v-33fa1589] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-33fa1589],\n.fade-leave-to[data-v-33fa1589] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-33fa1589],\n.fade-leave[data-v-33fa1589] {\n  opacity: 1;\n}\n.main-container[data-v-33fa1589] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-33fa1589] {\n  padding: 20px;\n}\n.content-block[data-v-33fa1589] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-33fa1589] {\n  background-color: #fff;\n}\n.icon-margin[data-v-33fa1589] {\n  margin: 0 5px;\n}\n.course-content-wrapper[data-v-33fa1589] {\n  margin-bottom: 10px;\n}\n.course-content-wrapper[data-v-33fa1589]:last-child {\n  margin-bottom: 0;\n}\n.course-content-wrapper .course-content-group .course-content[data-v-33fa1589] {\n  border-radius: 4px;\n  box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -moz-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -webkit-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  background-color: #fff;\n  margin: 20px 0 0 0;\n  min-height: 100px;\n  padding: 0;\n  position: relative;\n}\n@media (max-width: 800px) {\n.course-content-wrapper .course-content-group .course-content[data-v-33fa1589] {\n    border-radius: 0;\n    margin: 20px 0 0 0;\n}\n}\n.course-content-wrapper .course-content-group .course-content h5.content-subheader[data-v-33fa1589] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  font-weight: 300;\n}\n.course-content-wrapper .course-content-group .course-content p.content-description[data-v-33fa1589] {\n  margin: 0;\n  padding: 0;\n  color: #666;\n  font-size: 1em;\n}\n.course-content-wrapper .course-content-group .course-content a[data-v-33fa1589] {\n  text-decoration: none;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header[data-v-33fa1589] {\n  background-color: transparent;\n  overflow: hidden;\n  padding: 20px 20px 10px 20px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header h1.content-title[data-v-33fa1589] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block[data-v-33fa1589] {\n  background-color: #29b474;\n  padding: 30px;\n  text-align: center;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block h1.content-title[data-v-33fa1589] {\n  color: #fff;\n  font-size: 2em;\n  font-weight: bold;\n  margin-bottom: 10px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block p.content-description[data-v-33fa1589] {\n  color: #fff;\n  margin: 0 auto;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body[data-v-33fa1589] {\n  overflow: hidden;\n  padding: 0px 20px 10px 20px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body h1[data-v-33fa1589],\n.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-33fa1589],\n.course-content-wrapper .course-content-group .course-content .course-content--body h3[data-v-33fa1589],\n.course-content-wrapper .course-content-group .course-content .course-content--body h4[data-v-33fa1589],\n.course-content-wrapper .course-content-group .course-content .course-content--body h5[data-v-33fa1589] {\n  font-weight: 300;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-33fa1589] {\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--footer[data-v-33fa1589] {\n  padding: 20px;\n}\n.course-content-wrapper .course-content-group.course-content-group--question[data-v-33fa1589] {\n  border-radius: 6px;\n  background-color: rgba(255,255,255,0.15);\n  padding: 15px;\n  margin-top: 10px;\n}\n.course-content-wrapper .course-content-group.course-content-group--question .course-content[data-v-33fa1589] {\n  margin: 0;\n}\n.course-content[data-v-33fa1589] {\n  position: relative;\n}\n.course-content .course-content--header[data-v-33fa1589] {\n  background-color: #161616 !important;\n  text-align: center;\n}\n.course-content .course-content--header h1.content-title[data-v-33fa1589] {\n  color: #fff;\n  text-transform: capitalize;\n}\n.course-content .course-content--header h2.content-subtitle[data-v-33fa1589] {\n  color: #fff;\n  font-weight: normal;\n}\n.course-content .course-content--body[data-v-33fa1589] {\n  background-color: transparent;\n  padding: 20px 40px !important;\n  text-align: center;\n}\n.course-content .course-content--body h1[data-v-33fa1589],\n.course-content .course-content--body h2[data-v-33fa1589],\n.course-content .course-content--body h5[data-v-33fa1589] {\n  margin: 0;\n  padding: 0;\n  color: #fff;\n  padding: 5px;\n}\n.course-content .course-content--body h5[data-v-33fa1589] {\n  opacity: 0.5;\n}\n.course-content .pure-button[data-v-33fa1589] {\n  background-color: transparent;\n  border: #fff 1px solid;\n  color: #fff;\n  margin: 20px auto 5px auto;\n}\n.course-content .pure-button[data-v-33fa1589]:hover {\n  background-color: #fff;\n  color: #161616;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 695 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-346e64ce]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-346e64ce]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-346e64ce]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-346e64ce]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-346e64ce]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-346e64ce]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-346e64ce]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-346e64ce]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-346e64ce]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-346e64ce]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-346e64ce]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-346e64ce]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-346e64ce]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-346e64ce]{border-color:transparent}.pure-button.pure-button-homework[data-v-346e64ce]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-346e64ce]:hover{background-color:#fd3c51;color:#fff}body[data-v-346e64ce],html[data-v-346e64ce]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-346e64ce]{float:left}.pull-right[data-v-346e64ce]{float:right}.clearfix[data-v-346e64ce]{clear:both;float:none}.fa-icon[data-v-346e64ce]{width:auto;height:1em}.no-margin[data-v-346e64ce]{margin:0!important}.no-padding[data-v-346e64ce]{padding:0!important}.background-white[data-v-346e64ce]{background-color:#fff!important}.text-white[data-v-346e64ce]{color:#fff}.fade-enter-active[data-v-346e64ce],.fade-leave-active[data-v-346e64ce]{transition:opacity .2s}.fade-enter[data-v-346e64ce],.fade-leave-to[data-v-346e64ce]{opacity:0}.fade-enter-to[data-v-346e64ce],.fade-leave[data-v-346e64ce]{opacity:1}.main-container[data-v-346e64ce]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-346e64ce]{padding:20px}.content-block[data-v-346e64ce]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-346e64ce]{background-color:#fff}.icon-margin[data-v-346e64ce]{margin:0 5px}.course-content-wrapper[data-v-346e64ce]{margin-bottom:10px}.course-content-wrapper[data-v-346e64ce]:last-child{margin-bottom:0}.course-content-wrapper .course-content-group .course-content[data-v-346e64ce]{border-radius:4px;box-shadow:0 0 10px 5px rgba(0,0,0,.01);-moz-box-shadow:0 0 10px 5px rgba(0,0,0,.01);-webkit-box-shadow:0 0 10px 5px rgba(0,0,0,.01);background-color:#fff;margin:20px 0 0;min-height:100px;padding:0;position:relative}@media (max-width:800px){.course-content-wrapper .course-content-group .course-content[data-v-346e64ce]{border-radius:0;margin:20px 0 0}}.course-content-wrapper .course-content-group .course-content h5.content-subheader[data-v-346e64ce]{margin:0;padding:0;color:#444;font-weight:300}.course-content-wrapper .course-content-group .course-content p.content-description[data-v-346e64ce]{margin:0;padding:0;color:#666;font-size:1em}.course-content-wrapper .course-content-group .course-content a[data-v-346e64ce]{text-decoration:none}.course-content-wrapper .course-content-group .course-content .course-content--header[data-v-346e64ce]{background-color:transparent;overflow:hidden;padding:20px 20px 10px}.course-content-wrapper .course-content-group .course-content .course-content--header h1.content-title[data-v-346e64ce]{margin:0;padding:0;color:#444;font-size:1.3em;font-weight:700}.course-content-wrapper .course-content-group .course-content .course-content--header.block[data-v-346e64ce]{background-color:#29b474;padding:30px;text-align:center}.course-content-wrapper .course-content-group .course-content .course-content--header.block h1.content-title[data-v-346e64ce]{color:#fff;font-size:2em;font-weight:700;margin-bottom:10px}.course-content-wrapper .course-content-group .course-content .course-content--header.block p.content-description[data-v-346e64ce]{color:#fff;margin:0 auto}.course-content-wrapper .course-content-group .course-content .course-content--body[data-v-346e64ce]{overflow:hidden;padding:0 20px 10px}.course-content-wrapper .course-content-group .course-content .course-content--body h1[data-v-346e64ce],.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-346e64ce],.course-content-wrapper .course-content-group .course-content .course-content--body h3[data-v-346e64ce],.course-content-wrapper .course-content-group .course-content .course-content--body h4[data-v-346e64ce],.course-content-wrapper .course-content-group .course-content .course-content--body h5[data-v-346e64ce]{font-weight:300}.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-346e64ce]{color:#444;font-size:1.3em;font-weight:700}.course-content-wrapper .course-content-group .course-content .course-content--footer[data-v-346e64ce]{padding:20px}.course-content-wrapper .course-content-group.course-content-group--question[data-v-346e64ce]{border-radius:6px;background-color:hsla(0,0%,100%,.15);padding:15px;margin-top:10px}.course-content-wrapper .course-content-group.course-content-group--question .course-content[data-v-346e64ce]{margin:0}#join-banner.course-content[data-v-346e64ce]{border-radius:4px;box-shadow:0 0 10px 5px rgba(0,0,0,.01);-moz-box-shadow:0 0 10px 5px rgba(0,0,0,.01);-webkit-box-shadow:0 0 10px 5px rgba(0,0,0,.01);background-color:#fff}#join-banner.course-content .course-content--header[data-v-346e64ce]{padding:10px 20px 30px;text-align:center}#join-banner.course-content .course-content--header h1.content-title[data-v-346e64ce]{color:#444;margin:20px auto}#join-banner.course-content .course-content--header .auth-button-wrapper[data-v-346e64ce]{margin:10px auto 0;text-align:center}", "", {"version":3,"sources":["/root/connectedacademy/src/components/banners/JoinBanner.vue"],"names":[],"mappings":"AACA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,yCACE,kBAAoB,CACrB,AACD,oDACE,eAAiB,CAClB,AACD,+EACE,kBAAmB,AACnB,wCAA0C,AAC1C,6CAA+C,AAC/C,gDAAkD,AAClD,sBAAuB,AACvB,gBAAmB,AACnB,iBAAkB,AAClB,UAAW,AACX,iBAAmB,CACpB,AACD,yBACA,+EACI,gBAAiB,AACjB,eAAmB,CACtB,CACA,AACD,oGACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,eAAiB,CAClB,AACD,qGACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,aAAe,CAChB,AACD,iFACE,oBAAsB,CACvB,AACD,uGACE,6BAA8B,AAC9B,gBAAiB,AACjB,sBAA6B,CAC9B,AACD,wHACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,6GACE,yBAA0B,AAC1B,aAAc,AACd,iBAAmB,CACpB,AACD,8HACE,WAAY,AACZ,cAAe,AACf,gBAAkB,AAClB,kBAAoB,CACrB,AACD,mIACE,WAAY,AACZ,aAAe,CAChB,AACD,qGACE,gBAAiB,AACjB,mBAA4B,CAC7B,AACD,wgBAKE,eAAiB,CAClB,AACD,wGACE,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,uGACE,YAAc,CACf,AACD,8FACE,kBAAmB,AACnB,qCAAyC,AACzC,aAAc,AACd,eAAiB,CAClB,AACD,8GACE,QAAU,CACX,AACD,6CACE,kBAAmB,AACnB,wCAA0C,AAC1C,6CAA+C,AAC/C,gDAAkD,AAClD,qBAAuB,CACxB,AACD,qEACE,uBAA6B,AAC7B,iBAAmB,CACpB,AACD,sFACE,WAAY,AACZ,gBAAkB,CACnB,AACD,0FACE,mBAAyB,AACzB,iBAAmB,CACpB","file":"JoinBanner.vue","sourcesContent":["\n.pure-button[data-v-346e64ce] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-346e64ce]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-346e64ce] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-346e64ce] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-346e64ce]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-346e64ce] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-346e64ce]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-346e64ce] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-346e64ce]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-346e64ce] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-346e64ce]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-346e64ce] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-346e64ce]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-346e64ce] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-346e64ce] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-346e64ce]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-346e64ce],\nbody[data-v-346e64ce] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-346e64ce] {\n  float: left;\n}\n.pull-right[data-v-346e64ce] {\n  float: right;\n}\n.clearfix[data-v-346e64ce] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-346e64ce] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-346e64ce] {\n  margin: 0 !important;\n}\n.no-padding[data-v-346e64ce] {\n  padding: 0 !important;\n}\n.background-white[data-v-346e64ce] {\n  background-color: #fff !important;\n}\n.text-white[data-v-346e64ce] {\n  color: #fff;\n}\n.fade-enter-active[data-v-346e64ce],\n.fade-leave-active[data-v-346e64ce] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-346e64ce],\n.fade-leave-to[data-v-346e64ce] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-346e64ce],\n.fade-leave[data-v-346e64ce] {\n  opacity: 1;\n}\n.main-container[data-v-346e64ce] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-346e64ce] {\n  padding: 20px;\n}\n.content-block[data-v-346e64ce] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-346e64ce] {\n  background-color: #fff;\n}\n.icon-margin[data-v-346e64ce] {\n  margin: 0 5px;\n}\n.course-content-wrapper[data-v-346e64ce] {\n  margin-bottom: 10px;\n}\n.course-content-wrapper[data-v-346e64ce]:last-child {\n  margin-bottom: 0;\n}\n.course-content-wrapper .course-content-group .course-content[data-v-346e64ce] {\n  border-radius: 4px;\n  box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -moz-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -webkit-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  background-color: #fff;\n  margin: 20px 0 0 0;\n  min-height: 100px;\n  padding: 0;\n  position: relative;\n}\n@media (max-width: 800px) {\n.course-content-wrapper .course-content-group .course-content[data-v-346e64ce] {\n    border-radius: 0;\n    margin: 20px 0 0 0;\n}\n}\n.course-content-wrapper .course-content-group .course-content h5.content-subheader[data-v-346e64ce] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  font-weight: 300;\n}\n.course-content-wrapper .course-content-group .course-content p.content-description[data-v-346e64ce] {\n  margin: 0;\n  padding: 0;\n  color: #666;\n  font-size: 1em;\n}\n.course-content-wrapper .course-content-group .course-content a[data-v-346e64ce] {\n  text-decoration: none;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header[data-v-346e64ce] {\n  background-color: transparent;\n  overflow: hidden;\n  padding: 20px 20px 10px 20px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header h1.content-title[data-v-346e64ce] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block[data-v-346e64ce] {\n  background-color: #29b474;\n  padding: 30px;\n  text-align: center;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block h1.content-title[data-v-346e64ce] {\n  color: #fff;\n  font-size: 2em;\n  font-weight: bold;\n  margin-bottom: 10px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block p.content-description[data-v-346e64ce] {\n  color: #fff;\n  margin: 0 auto;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body[data-v-346e64ce] {\n  overflow: hidden;\n  padding: 0px 20px 10px 20px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body h1[data-v-346e64ce],\n.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-346e64ce],\n.course-content-wrapper .course-content-group .course-content .course-content--body h3[data-v-346e64ce],\n.course-content-wrapper .course-content-group .course-content .course-content--body h4[data-v-346e64ce],\n.course-content-wrapper .course-content-group .course-content .course-content--body h5[data-v-346e64ce] {\n  font-weight: 300;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-346e64ce] {\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--footer[data-v-346e64ce] {\n  padding: 20px;\n}\n.course-content-wrapper .course-content-group.course-content-group--question[data-v-346e64ce] {\n  border-radius: 6px;\n  background-color: rgba(255,255,255,0.15);\n  padding: 15px;\n  margin-top: 10px;\n}\n.course-content-wrapper .course-content-group.course-content-group--question .course-content[data-v-346e64ce] {\n  margin: 0;\n}\n#join-banner.course-content[data-v-346e64ce] {\n  border-radius: 4px;\n  box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -moz-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -webkit-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  background-color: #fff;\n}\n#join-banner.course-content .course-content--header[data-v-346e64ce] {\n  padding: 10px 20px 30px 20px;\n  text-align: center;\n}\n#join-banner.course-content .course-content--header h1.content-title[data-v-346e64ce] {\n  color: #444;\n  margin: 20px auto;\n}\n#join-banner.course-content .course-content--header .auth-button-wrapper[data-v-346e64ce] {\n  margin: 10px auto 0 auto;\n  text-align: center;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 696 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-35ffccce]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-35ffccce]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-35ffccce]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-35ffccce]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-35ffccce]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-35ffccce]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-35ffccce]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-35ffccce]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-35ffccce]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-35ffccce]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-35ffccce]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-35ffccce]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-35ffccce]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-35ffccce]{border-color:transparent}.pure-button.pure-button-homework[data-v-35ffccce]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-35ffccce]:hover{background-color:#fd3c51;color:#fff}body[data-v-35ffccce],html[data-v-35ffccce]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-35ffccce]{float:left}.pull-right[data-v-35ffccce]{float:right}.clearfix[data-v-35ffccce]{clear:both;float:none}.fa-icon[data-v-35ffccce]{width:auto;height:1em}.no-margin[data-v-35ffccce]{margin:0!important}.no-padding[data-v-35ffccce]{padding:0!important}.background-white[data-v-35ffccce]{background-color:#fff!important}.text-white[data-v-35ffccce]{color:#fff}.fade-enter-active[data-v-35ffccce],.fade-leave-active[data-v-35ffccce]{transition:opacity .2s}.fade-enter[data-v-35ffccce],.fade-leave-to[data-v-35ffccce]{opacity:0}.fade-enter-to[data-v-35ffccce],.fade-leave[data-v-35ffccce]{opacity:1}.main-container[data-v-35ffccce]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-35ffccce]{padding:20px}.content-block[data-v-35ffccce]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-35ffccce]{background-color:#fff}.icon-margin[data-v-35ffccce]{margin:0 5px}.angle-icon[data-v-35ffccce]{top:3px;position:relative;margin-left:7px}", "", {"version":3,"sources":["/root/connectedacademy/src/components/MarkdownLink.vue"],"names":[],"mappings":"AACA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,6BACE,QAAS,AACT,kBAAmB,AACnB,eAAiB,CAClB","file":"MarkdownLink.vue","sourcesContent":["\n.pure-button[data-v-35ffccce] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-35ffccce]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-35ffccce] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-35ffccce] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-35ffccce]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-35ffccce] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-35ffccce]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-35ffccce] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-35ffccce]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-35ffccce] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-35ffccce]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-35ffccce] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-35ffccce]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-35ffccce] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-35ffccce] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-35ffccce]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-35ffccce],\nbody[data-v-35ffccce] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-35ffccce] {\n  float: left;\n}\n.pull-right[data-v-35ffccce] {\n  float: right;\n}\n.clearfix[data-v-35ffccce] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-35ffccce] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-35ffccce] {\n  margin: 0 !important;\n}\n.no-padding[data-v-35ffccce] {\n  padding: 0 !important;\n}\n.background-white[data-v-35ffccce] {\n  background-color: #fff !important;\n}\n.text-white[data-v-35ffccce] {\n  color: #fff;\n}\n.fade-enter-active[data-v-35ffccce],\n.fade-leave-active[data-v-35ffccce] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-35ffccce],\n.fade-leave-to[data-v-35ffccce] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-35ffccce],\n.fade-leave[data-v-35ffccce] {\n  opacity: 1;\n}\n.main-container[data-v-35ffccce] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-35ffccce] {\n  padding: 20px;\n}\n.content-block[data-v-35ffccce] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-35ffccce] {\n  background-color: #fff;\n}\n.icon-margin[data-v-35ffccce] {\n  margin: 0 5px;\n}\n.angle-icon[data-v-35ffccce] {\n  top: 3px;\n  position: relative;\n  margin-left: 7px;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 697 */,
/* 698 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width{display:block;margin-bottom:10px}.pure-button.pure-button-primary{background-color:#29b474;color:#fff}.pure-button.pure-button-primary:hover{background-color:#25a268}.pure-button.pure-button-white{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success{background-color:#29b474;color:#fff}.pure-button.pure-button-success:hover{background-color:#25a268}.pure-button.pure-button-twitter{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter:hover{background-color:#2088ff}.pure-button.pure-button-subtle{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text{border-color:transparent}.pure-button.pure-button-homework{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework:hover{background-color:#fd3c51;color:#fff}body,html{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left{float:left}.pull-right{float:right}.clearfix{clear:both;float:none}.fa-icon{width:auto;height:1em}.no-margin{margin:0!important}.no-padding{padding:0!important}.background-white{background-color:#fff!important}.text-white{color:#fff}.fade-enter-active,.fade-leave-active{transition:opacity .2s}.fade-enter,.fade-leave-to{opacity:0}.fade-enter-to,.fade-leave{opacity:1}.main-container{border-radius:4px;position:relative}.main-container.main-container-padded{padding:20px}.content-block{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block{background-color:#fff}.icon-margin{margin:0 5px}.time-segment{background-color:#fff;height:157px;min-height:157px;overflow:hidden;position:absolute;left:50%;margin-left:-390px;z-index:0;width:780px}@media (max-width:800px){.time-segment{left:10px;margin-left:0;width:calc(100% - 20px)}}.time-segment .primary-wrapper{background-color:#fff;border-bottom:1px solid #e9e9e9;height:156px;min-height:156px;position:relative;z-index:2}.time-segment .primary-wrapper .segment-label--group{border-radius:4px;transition:all .3s ease;background:#f9f9f9;font-size:.8em;opacity:.05;padding:6px 12px;position:absolute;top:10px;left:10px;z-index:2}.time-segment .primary-wrapper .suggestion{padding:20px;text-align:center}.time-segment .primary-wrapper .suggestion h3{margin:0;padding:0;color:#444}.time-segment .primary-wrapper .message-wrapper,.time-segment .primary-wrapper .subtitle-wrapper{transition:all .3s ease;position:absolute;top:50%}.time-segment .primary-wrapper:hover{cursor:pointer}.time-segment .primary-wrapper:hover .segment-label--group{opacity:1}.time-segment.current .primary-wrapper:after{border-radius:50%;background-color:#29b474;content:\"\";position:absolute;top:10px;left:10px;height:12px;width:12px}.time-segment.active,.time-segment.peek{border-radius:4px;z-index:56;border:none}.time-segment.peek{height:240px}.time-segment.opened{height:auto}.time-segment.opened .segment-expansion-bar{opacity:0;pointer-events:none}.time-segment .meta-container{transition:all .3s ease;background-color:#f9f9f9;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;opacity:0;padding:10px;position:absolute;top:157px;bottom:50px;right:0;left:0;overflow:scroll}.time-segment .meta-container .message-wrapper{-webkit-transform:translate(0)!important;transform:translate(0)!important;position:relative;width:100%}.time-segment .meta-container .message-wrapper.featured:before{border-radius:50%;content:\"\";background-color:#29b474;position:absolute;top:0;left:0;height:8px;width:8px}.time-segment .meta-container .message-wrapper .tweet-actions{background-color:inherit}.time-segment .meta-container.active{opacity:1}.quick-note{border-top:1px solid #e9e9e9;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;position:absolute;bottom:0;left:0;right:0;z-index:0}.status-indicator{color:#666;padding:40px;text-align:center}.segment-expansion-bar{transition:all .3s ease;background-color:#fff;color:#999;cursor:pointer;padding:5px 20px;position:absolute;bottom:51px;left:0;right:0;z-index:1;text-align:center}.segment-expansion-bar:hover{background-color:#f9f9f9}", "", {"version":3,"sources":["/root/connectedacademy/src/components/conversation/TimeSegment.vue"],"names":[],"mappings":"AACA,aACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,mBACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,wBACE,cAAe,AACf,kBAAoB,CACrB,AACD,iCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,uCACE,wBAA0B,CAC3B,AACD,+BACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,qCACE,+BAAkC,CACnC,AACD,iCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,uCACE,wBAA0B,CAC3B,AACD,iCACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,uCACE,wBAA0B,CAC3B,AACD,gCACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,8BACE,wBAA0B,CAC3B,AACD,kCACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,wCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,UAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,WACE,UAAY,CACb,AACD,YACE,WAAa,CACd,AACD,UACE,WAAY,AACZ,UAAY,CACb,AACD,SACE,WAAY,AACZ,UAAY,CACb,AACD,WACE,kBAAqB,CACtB,AACD,YACE,mBAAsB,CACvB,AACD,kBACE,+BAAkC,CACnC,AACD,YACE,UAAY,CACb,AACD,sCAEE,sBAAyB,CAC1B,AACD,2BAEE,SAAW,CACZ,AACD,2BAEE,SAAW,CACZ,AACD,gBACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,sCACE,YAAc,CACf,AACD,eACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,2BACE,qBAAuB,CACxB,AACD,aACE,YAAc,CACf,AACD,cACE,sBAAuB,AACvB,aAAc,AACd,iBAAkB,AAClB,gBAAiB,AACjB,kBAAmB,AACnB,SAAU,AACV,mBAAoB,AACpB,UAAW,AACX,WAAa,CACd,AACD,yBACA,cACI,UAAW,AACX,cAAe,AACf,uBAAyB,CAC5B,CACA,AACD,+BACE,sBAAuB,AACvB,gCAAiC,AACjC,aAAc,AACd,iBAAkB,AAClB,kBAAmB,AACnB,SAAW,CACZ,AACD,qDACE,kBAAmB,AACnB,wBAA0B,AAC1B,mBAAoB,AACpB,eAAiB,AACjB,YAAc,AACd,iBAAkB,AAClB,kBAAmB,AACnB,SAAU,AACV,UAAW,AACX,SAAW,CACZ,AACD,2CACE,aAAc,AACd,iBAAmB,CACpB,AACD,8CACE,SAAU,AACV,UAAW,AACX,UAAY,CACb,AAMD,iGACE,wBAA0B,AAC1B,kBAAmB,AACnB,OAAS,CACV,AACD,qCACE,cAAgB,CACjB,AACD,2DACE,SAAW,CACZ,AACD,6CACE,kBAAmB,AACnB,yBAA0B,AAC1B,WAAY,AACZ,kBAAmB,AACnB,SAAU,AACV,UAAW,AACX,YAAa,AACb,UAAY,CACb,AACD,wCAEE,kBAAmB,AACnB,WAAY,AACZ,WAAa,CACd,AACD,mBACE,YAAc,CACf,AACD,qBACE,WAAa,CACd,AACD,4CACE,UAAW,AACX,mBAAqB,CACtB,AACD,8BACE,wBAA0B,AAC1B,yBAA0B,AAC1B,sBAAuB,AACvB,2BAA4B,AAC5B,8BAA+B,AAC/B,UAAW,AACX,aAAc,AACd,kBAAmB,AACnB,UAAW,AACX,YAAa,AACb,QAAS,AACT,OAAQ,AACR,eAAiB,CAClB,AACD,+CACE,yCAA8C,AAC9C,iCAAsC,AACtC,kBAAmB,AACnB,UAAY,CACb,AACD,+DACE,kBAAmB,AACnB,WAAY,AACZ,yBAA0B,AAC1B,kBAAmB,AACnB,MAAO,AACP,OAAQ,AACR,WAAY,AACZ,SAAW,CACZ,AACD,8DACE,wBAA0B,CAC3B,AACD,qCACE,SAAW,CACZ,AACD,YACE,6BAA8B,AAC9B,sBAAuB,AACvB,2BAA4B,AAC5B,8BAA+B,AAC/B,kBAAmB,AACnB,SAAU,AACV,OAAQ,AACR,QAAS,AACT,SAAW,CACZ,AACD,kBACE,WAAY,AACZ,aAAc,AACd,iBAAmB,CACpB,AACD,uBACE,wBAA0B,AAC1B,sBAAuB,AACvB,WAAY,AACZ,eAAgB,AAChB,iBAAkB,AAClB,kBAAmB,AACnB,YAAa,AACb,OAAQ,AACR,QAAS,AACT,UAAW,AACX,iBAAmB,CACpB,AACD,6BACE,wBAA0B,CAC3B","file":"TimeSegment.vue","sourcesContent":["\n.pure-button {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml,\nbody {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left {\n  float: left;\n}\n.pull-right {\n  float: right;\n}\n.clearfix {\n  clear: both;\n  float: none;\n}\n.fa-icon {\n  width: auto;\n  height: 1em;\n}\n.no-margin {\n  margin: 0 !important;\n}\n.no-padding {\n  padding: 0 !important;\n}\n.background-white {\n  background-color: #fff !important;\n}\n.text-white {\n  color: #fff;\n}\n.fade-enter-active,\n.fade-leave-active {\n  transition: opacity 0.2s;\n}\n.fade-enter,\n.fade-leave-to {\n  opacity: 0;\n}\n.fade-enter-to,\n.fade-leave {\n  opacity: 1;\n}\n.main-container {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded {\n  padding: 20px;\n}\n.content-block {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block {\n  background-color: #fff;\n}\n.icon-margin {\n  margin: 0 5px;\n}\n.time-segment {\n  background-color: #fff;\n  height: 157px;\n  min-height: 157px;\n  overflow: hidden;\n  position: absolute;\n  left: 50%;\n  margin-left: -390px;\n  z-index: 0;\n  width: 780px;\n}\n@media (max-width: 800px) {\n.time-segment {\n    left: 10px;\n    margin-left: 0;\n    width: calc(100% - 20px);\n}\n}\n.time-segment .primary-wrapper {\n  background-color: #fff;\n  border-bottom: #e9e9e9 1px solid;\n  height: 156px;\n  min-height: 156px;\n  position: relative;\n  z-index: 2;\n}\n.time-segment .primary-wrapper .segment-label--group {\n  border-radius: 4px;\n  transition: all 0.3s ease;\n  background: #f9f9f9;\n  font-size: 0.8em;\n  opacity: 0.05;\n  padding: 6px 12px;\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  z-index: 2;\n}\n.time-segment .primary-wrapper .suggestion {\n  padding: 20px;\n  text-align: center;\n}\n.time-segment .primary-wrapper .suggestion h3 {\n  margin: 0;\n  padding: 0;\n  color: #444;\n}\n.time-segment .primary-wrapper .message-wrapper {\n  transition: all 0.3s ease;\n  position: absolute;\n  top: 50%;\n}\n.time-segment .primary-wrapper .subtitle-wrapper {\n  transition: all 0.3s ease;\n  position: absolute;\n  top: 50%;\n}\n.time-segment .primary-wrapper:hover {\n  cursor: pointer;\n}\n.time-segment .primary-wrapper:hover .segment-label--group {\n  opacity: 1;\n}\n.time-segment.current .primary-wrapper:after {\n  border-radius: 50%;\n  background-color: #29b474;\n  content: '';\n  position: absolute;\n  top: 10px;\n  left: 10px;\n  height: 12px;\n  width: 12px;\n}\n.time-segment.peek,\n.time-segment.active {\n  border-radius: 4px;\n  z-index: 56;\n  border: none;\n}\n.time-segment.peek {\n  height: 240px;\n}\n.time-segment.opened {\n  height: auto;\n}\n.time-segment.opened .segment-expansion-bar {\n  opacity: 0;\n  pointer-events: none;\n}\n.time-segment .meta-container {\n  transition: all 0.3s ease;\n  background-color: #f9f9f9;\n  box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  opacity: 0;\n  padding: 10px;\n  position: absolute;\n  top: 157px;\n  bottom: 50px;\n  right: 0;\n  left: 0;\n  overflow: scroll;\n}\n.time-segment .meta-container .message-wrapper {\n  -webkit-transform: translate(0, 0) !important;\n  transform: translate(0, 0) !important;\n  position: relative;\n  width: 100%;\n}\n.time-segment .meta-container .message-wrapper.featured:before {\n  border-radius: 50%;\n  content: '';\n  background-color: #29b474;\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 8px;\n  width: 8px;\n}\n.time-segment .meta-container .message-wrapper .tweet-actions {\n  background-color: inherit;\n}\n.time-segment .meta-container.active {\n  opacity: 1;\n}\n.quick-note {\n  border-top: #e9e9e9 1px solid;\n  box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  z-index: 0;\n}\n.status-indicator {\n  color: #666;\n  padding: 40px;\n  text-align: center;\n}\n.segment-expansion-bar {\n  transition: all 0.3s ease;\n  background-color: #fff;\n  color: #999;\n  cursor: pointer;\n  padding: 5px 20px;\n  position: absolute;\n  bottom: 51px;\n  left: 0;\n  right: 0;\n  z-index: 1;\n  text-align: center;\n}\n.segment-expansion-bar:hover {\n  background-color: #f9f9f9;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 699 */,
/* 700 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-45a5c7aa]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-45a5c7aa]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-45a5c7aa]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-45a5c7aa]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-45a5c7aa]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-45a5c7aa]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-45a5c7aa]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-45a5c7aa]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-45a5c7aa]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-45a5c7aa]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-45a5c7aa]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-45a5c7aa]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-45a5c7aa]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-45a5c7aa]{border-color:transparent}.pure-button.pure-button-homework[data-v-45a5c7aa]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-45a5c7aa]:hover{background-color:#fd3c51;color:#fff}body[data-v-45a5c7aa],html[data-v-45a5c7aa]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-45a5c7aa]{float:left}.pull-right[data-v-45a5c7aa]{float:right}.clearfix[data-v-45a5c7aa]{clear:both;float:none}.fa-icon[data-v-45a5c7aa]{width:auto;height:1em}.no-margin[data-v-45a5c7aa]{margin:0!important}.no-padding[data-v-45a5c7aa]{padding:0!important}.background-white[data-v-45a5c7aa]{background-color:#fff!important}.text-white[data-v-45a5c7aa]{color:#fff}.fade-enter-active[data-v-45a5c7aa],.fade-leave-active[data-v-45a5c7aa]{transition:opacity .2s}.fade-enter[data-v-45a5c7aa],.fade-leave-to[data-v-45a5c7aa]{opacity:0}.fade-enter-to[data-v-45a5c7aa],.fade-leave[data-v-45a5c7aa]{opacity:1}.main-container[data-v-45a5c7aa]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-45a5c7aa]{padding:20px}.content-block[data-v-45a5c7aa]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-45a5c7aa]{background-color:#fff}.icon-margin[data-v-45a5c7aa]{margin:0 5px}.md-thumbnail-row[data-v-45a5c7aa]{height:120px;margin:15px 0;overflow-x:scroll;overflow-y:hidden;position:relative;white-space:nowrap}.md-thumbnail-row[data-v-45a5c7aa]::-webkit-scrollbar{display:none}.md-thumbnail-row .md-thumbnail[data-v-45a5c7aa]{transition:all .3s ease;background-size:cover;background-repeat:no-repeat;background-position:50%;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;display:inline-block;height:0;margin:10px;overflow:hidden;padding:5px;padding-bottom:100px;position:relative;white-space:nowrap;width:160px}.md-thumbnail-row .md-thumbnail .md-thumbnail-caption[data-v-45a5c7aa]{transition:all .3s ease;top:0;bottom:0;left:0;right:0;background-color:rgba(0,0,0,.1);color:#fff;font-weight:700;line-height:110px;position:absolute;text-align:center}.md-thumbnail-row .md-thumbnail[data-v-45a5c7aa]:hover{cursor:pointer;-webkit-transform:scale(1.1);transform:scale(1.1)}.md-thumbnail-row .md-thumbnail:hover .md-thumbnail-caption[data-v-45a5c7aa]{background-color:rgba(0,0,0,.5);-webkit-transform:scale(1.3);transform:scale(1.3)}", "", {"version":3,"sources":["/root/connectedacademy/src/components/MediaThumbnails.vue"],"names":[],"mappings":"AACA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,mCACE,aAAc,AACd,cAAe,AACf,kBAAmB,AACnB,kBAAmB,AACnB,kBAAmB,AACnB,kBAAoB,CACrB,AACD,sDACE,YAAc,CACf,AACD,iDACE,wBAA0B,AAC1B,sBAAuB,AACvB,4BAA6B,AAC7B,wBAA4B,AAC5B,sBAAuB,AACvB,2BAA4B,AAC5B,8BAA+B,AAC/B,qBAAsB,AACtB,SAAU,AACV,YAAa,AACb,gBAAiB,AACjB,YAAa,AACb,qBAAsB,AACtB,kBAAmB,AACnB,mBAAoB,AACpB,WAAa,CACd,AACD,uEACE,wBAA0B,AAC1B,MAAO,AACP,SAAU,AACV,OAAQ,AACR,QAAS,AACT,gCAAkC,AAClC,WAAY,AACZ,gBAAkB,AAClB,kBAAmB,AACnB,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,eAAgB,AAChB,6BAA8B,AAC9B,oBAAsB,CACvB,AACD,6EACE,gCAAkC,AAClC,6BAA8B,AAC9B,oBAAsB,CACvB","file":"MediaThumbnails.vue","sourcesContent":["\n.pure-button[data-v-45a5c7aa] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-45a5c7aa]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-45a5c7aa] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-45a5c7aa] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-45a5c7aa]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-45a5c7aa] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-45a5c7aa]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-45a5c7aa] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-45a5c7aa]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-45a5c7aa] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-45a5c7aa]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-45a5c7aa] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-45a5c7aa]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-45a5c7aa] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-45a5c7aa] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-45a5c7aa]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-45a5c7aa],\nbody[data-v-45a5c7aa] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-45a5c7aa] {\n  float: left;\n}\n.pull-right[data-v-45a5c7aa] {\n  float: right;\n}\n.clearfix[data-v-45a5c7aa] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-45a5c7aa] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-45a5c7aa] {\n  margin: 0 !important;\n}\n.no-padding[data-v-45a5c7aa] {\n  padding: 0 !important;\n}\n.background-white[data-v-45a5c7aa] {\n  background-color: #fff !important;\n}\n.text-white[data-v-45a5c7aa] {\n  color: #fff;\n}\n.fade-enter-active[data-v-45a5c7aa],\n.fade-leave-active[data-v-45a5c7aa] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-45a5c7aa],\n.fade-leave-to[data-v-45a5c7aa] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-45a5c7aa],\n.fade-leave[data-v-45a5c7aa] {\n  opacity: 1;\n}\n.main-container[data-v-45a5c7aa] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-45a5c7aa] {\n  padding: 20px;\n}\n.content-block[data-v-45a5c7aa] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-45a5c7aa] {\n  background-color: #fff;\n}\n.icon-margin[data-v-45a5c7aa] {\n  margin: 0 5px;\n}\n.md-thumbnail-row[data-v-45a5c7aa] {\n  height: 120px;\n  margin: 15px 0;\n  overflow-x: scroll;\n  overflow-y: hidden;\n  position: relative;\n  white-space: nowrap;\n}\n.md-thumbnail-row[data-v-45a5c7aa]::-webkit-scrollbar {\n  display: none;\n}\n.md-thumbnail-row .md-thumbnail[data-v-45a5c7aa] {\n  transition: all 0.3s ease;\n  background-size: cover;\n  background-repeat: no-repeat;\n  background-position: center;\n  box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  display: inline-block;\n  height: 0;\n  margin: 10px;\n  overflow: hidden;\n  padding: 5px;\n  padding-bottom: 100px;\n  position: relative;\n  white-space: nowrap;\n  width: 160px;\n}\n.md-thumbnail-row .md-thumbnail .md-thumbnail-caption[data-v-45a5c7aa] {\n  transition: all 0.3s ease;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(0,0,0,0.1);\n  color: #fff;\n  font-weight: bold;\n  line-height: 110px;\n  position: absolute;\n  text-align: center;\n}\n.md-thumbnail-row .md-thumbnail[data-v-45a5c7aa]:hover {\n  cursor: pointer;\n  -webkit-transform: scale(1.1);\n  transform: scale(1.1);\n}\n.md-thumbnail-row .md-thumbnail:hover .md-thumbnail-caption[data-v-45a5c7aa] {\n  background-color: rgba(0,0,0,0.5);\n  -webkit-transform: scale(1.3);\n  transform: scale(1.3);\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 701 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width{display:block;margin-bottom:10px}.pure-button.pure-button-primary{background-color:#29b474;color:#fff}.pure-button.pure-button-primary:hover{background-color:#25a268}.pure-button.pure-button-white{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success{background-color:#29b474;color:#fff}.pure-button.pure-button-success:hover{background-color:#25a268}.pure-button.pure-button-twitter{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter:hover{background-color:#2088ff}.pure-button.pure-button-subtle{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text{border-color:transparent}.pure-button.pure-button-homework{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework:hover{background-color:#fd3c51;color:#fff}body,html{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left{float:left}.pull-right{float:right}.clearfix{clear:both;float:none}.fa-icon{width:auto;height:1em}.no-margin{margin:0!important}.no-padding{padding:0!important}.background-white{background-color:#fff!important}.text-white{color:#fff}.fade-enter-active,.fade-leave-active{transition:opacity .2s}.fade-enter,.fade-leave-to{opacity:0}.fade-enter-to,.fade-leave{opacity:1}.main-container{border-radius:4px;position:relative}.main-container.main-container-padded{padding:20px}.content-block{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block{background-color:#fff}.icon-margin{margin:0 5px}.message{box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;max-height:128px;margin:10px;padding:0 10px 40px;padding-left:50px;position:relative}.message img.profile-image{border-radius:50%;height:40px;width:40px;position:absolute;top:0;left:0}.message p.message-content{margin:0;padding:0;color:#444;word-break:break-all}.message p.message-content a,.message p.message-content a:active{color:#444}.message a.author-label{color:#46475d;font-weight:700;text-decoration:none;font-size:.9em}.message .message--footer{top:0;bottom:0;left:0;right:0;height:36px;left:42px;top:auto;overflow:hidden;position:absolute}.message .message--footer ul.tweet-actions{margin:0;padding:0;list-style:none;background-color:#fff}.message .message--footer ul.tweet-actions li{margin:0;padding:0;list-style:none;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;float:left;font-size:1em;line-height:36px;margin:0 10px;max-width:15%}.message .message--footer ul.tweet-actions li a{color:#ccc;text-decoration:none}.message .message--footer ul.tweet-actions li a:hover{color:#29b474}.message .message--footer ul.tweet-actions li.message-timestamp{color:#ccc;font-size:.9em;float:right;max-width:55%}", "", {"version":3,"sources":["/root/connectedacademy/src/components/conversation/Message.vue"],"names":[],"mappings":"AACA,aACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,mBACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,wBACE,cAAe,AACf,kBAAoB,CACrB,AACD,iCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,uCACE,wBAA0B,CAC3B,AACD,+BACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,qCACE,+BAAkC,CACnC,AACD,iCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,uCACE,wBAA0B,CAC3B,AACD,iCACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,uCACE,wBAA0B,CAC3B,AACD,gCACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,8BACE,wBAA0B,CAC3B,AACD,kCACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,wCACE,yBAA0B,AAC1B,UAAY,CACb,AACD,UAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,WACE,UAAY,CACb,AACD,YACE,WAAa,CACd,AACD,UACE,WAAY,AACZ,UAAY,CACb,AACD,SACE,WAAY,AACZ,UAAY,CACb,AACD,WACE,kBAAqB,CACtB,AACD,YACE,mBAAsB,CACvB,AACD,kBACE,+BAAkC,CACnC,AACD,YACE,UAAY,CACb,AACD,sCAEE,sBAAyB,CAC1B,AACD,2BAEE,SAAW,CACZ,AACD,2BAEE,SAAW,CACZ,AACD,gBACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,sCACE,YAAc,CACf,AACD,eACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,2BACE,qBAAuB,CACxB,AACD,aACE,YAAc,CACf,AACD,SACE,sBAAuB,AACvB,2BAA4B,AAC5B,8BAA+B,AAC/B,iBAAkB,AAClB,YAAa,AACb,oBAA0B,AAC1B,kBAAmB,AACnB,iBAAmB,CACpB,AACD,2BACE,kBAAmB,AACnB,YAAa,AACb,WAAY,AACZ,kBAAmB,AACnB,MAAS,AACT,MAAU,CACX,AACD,2BACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,oBAAsB,CACvB,AACD,iEAEE,UAAY,CACb,AACD,wBACE,cAAe,AACf,gBAAkB,AAClB,qBAAsB,AACtB,cAAiB,CAClB,AACD,0BACE,MAAO,AACP,SAAU,AACV,OAAQ,AACR,QAAS,AACT,YAAa,AACb,UAAW,AACX,SAAU,AACV,gBAAiB,AACjB,iBAAmB,CACpB,AACD,2CACE,SAAU,AACV,UAAW,AACX,gBAAiB,AACjB,qBAAuB,CACxB,AACD,8CACE,SAAU,AACV,UAAW,AACX,gBAAiB,AACjB,sBAAuB,AACvB,2BAA4B,AAC5B,8BAA+B,AAC/B,WAAY,AACZ,cAAe,AACf,iBAAkB,AAClB,cAAe,AACf,aAAe,CAChB,AACD,gDACE,WAAY,AACZ,oBAAsB,CACvB,AACD,sDACE,aAAe,CAChB,AACD,gEACE,WAAY,AACZ,eAAiB,AACjB,YAAa,AACb,aAAe,CAChB","file":"Message.vue","sourcesContent":["\n.pure-button {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml,\nbody {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left {\n  float: left;\n}\n.pull-right {\n  float: right;\n}\n.clearfix {\n  clear: both;\n  float: none;\n}\n.fa-icon {\n  width: auto;\n  height: 1em;\n}\n.no-margin {\n  margin: 0 !important;\n}\n.no-padding {\n  padding: 0 !important;\n}\n.background-white {\n  background-color: #fff !important;\n}\n.text-white {\n  color: #fff;\n}\n.fade-enter-active,\n.fade-leave-active {\n  transition: opacity 0.2s;\n}\n.fade-enter,\n.fade-leave-to {\n  opacity: 0;\n}\n.fade-enter-to,\n.fade-leave {\n  opacity: 1;\n}\n.main-container {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded {\n  padding: 20px;\n}\n.content-block {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block {\n  background-color: #fff;\n}\n.icon-margin {\n  margin: 0 5px;\n}\n.message {\n  box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  max-height: 128px;\n  margin: 10px;\n  padding: 0 10px 40px 10px;\n  padding-left: 50px;\n  position: relative;\n}\n.message img.profile-image {\n  border-radius: 50%;\n  height: 40px;\n  width: 40px;\n  position: absolute;\n  top: 0px;\n  left: 0px;\n}\n.message p.message-content {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  word-break: break-all;\n}\n.message p.message-content a,\n.message p.message-content a:active {\n  color: #444;\n}\n.message a.author-label {\n  color: #46475d;\n  font-weight: bold;\n  text-decoration: none;\n  font-size: 0.9em;\n}\n.message .message--footer {\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 36px;\n  left: 42px;\n  top: auto;\n  overflow: hidden;\n  position: absolute;\n}\n.message .message--footer ul.tweet-actions {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  background-color: #fff;\n}\n.message .message--footer ul.tweet-actions li {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  float: left;\n  font-size: 1em;\n  line-height: 36px;\n  margin: 0 10px;\n  max-width: 15%;\n}\n.message .message--footer ul.tweet-actions li a {\n  color: #ccc;\n  text-decoration: none;\n}\n.message .message--footer ul.tweet-actions li a:hover {\n  color: #29b474;\n}\n.message .message--footer ul.tweet-actions li.message-timestamp {\n  color: #ccc;\n  font-size: 0.9em;\n  float: right;\n  max-width: 55%;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 702 */,
/* 703 */,
/* 704 */,
/* 705 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-5a909e04]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-5a909e04]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-5a909e04]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-5a909e04]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-5a909e04]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-5a909e04]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-5a909e04]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-5a909e04]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-5a909e04]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-5a909e04]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-5a909e04]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-5a909e04]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-5a909e04]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-5a909e04]{border-color:transparent}.pure-button.pure-button-homework[data-v-5a909e04]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-5a909e04]:hover{background-color:#fd3c51;color:#fff}body[data-v-5a909e04],html[data-v-5a909e04]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-5a909e04]{float:left}.pull-right[data-v-5a909e04]{float:right}.clearfix[data-v-5a909e04]{clear:both;float:none}.fa-icon[data-v-5a909e04]{width:auto;height:1em}.no-margin[data-v-5a909e04]{margin:0!important}.no-padding[data-v-5a909e04]{padding:0!important}.background-white[data-v-5a909e04]{background-color:#fff!important}.text-white[data-v-5a909e04]{color:#fff}.fade-enter-active[data-v-5a909e04],.fade-leave-active[data-v-5a909e04]{transition:opacity .2s}.fade-enter[data-v-5a909e04],.fade-leave-to[data-v-5a909e04]{opacity:0}.fade-enter-to[data-v-5a909e04],.fade-leave[data-v-5a909e04]{opacity:1}.main-container[data-v-5a909e04]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-5a909e04]{padding:20px}.content-block[data-v-5a909e04]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-5a909e04]{background-color:#fff}.icon-margin[data-v-5a909e04]{margin:0 5px}.subtitle[data-v-5a909e04]{padding:15px 20px}.subtitle h1[data-v-5a909e04]{margin:0;padding:0;color:#666;font-family:Avenir,Helvetica,Arial,sans-serif;font-size:1.1em;font-weight:400}@media (max-width:600px){.subtitle h1[data-v-5a909e04]{text-align:center}}", "", {"version":3,"sources":["/root/connectedacademy/src/components/conversation/Subtitle.vue"],"names":[],"mappings":"AACA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,2BACE,iBAAmB,CACpB,AACD,8BACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,8CAAoD,AACpD,gBAAiB,AACjB,eAAoB,CACrB,AACD,yBACA,8BACI,iBAAmB,CACtB,CACA","file":"Subtitle.vue","sourcesContent":["\n.pure-button[data-v-5a909e04] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-5a909e04]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-5a909e04] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-5a909e04] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-5a909e04]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-5a909e04] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-5a909e04]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-5a909e04] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-5a909e04]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-5a909e04] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-5a909e04]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-5a909e04] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-5a909e04]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-5a909e04] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-5a909e04] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-5a909e04]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-5a909e04],\nbody[data-v-5a909e04] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-5a909e04] {\n  float: left;\n}\n.pull-right[data-v-5a909e04] {\n  float: right;\n}\n.clearfix[data-v-5a909e04] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-5a909e04] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-5a909e04] {\n  margin: 0 !important;\n}\n.no-padding[data-v-5a909e04] {\n  padding: 0 !important;\n}\n.background-white[data-v-5a909e04] {\n  background-color: #fff !important;\n}\n.text-white[data-v-5a909e04] {\n  color: #fff;\n}\n.fade-enter-active[data-v-5a909e04],\n.fade-leave-active[data-v-5a909e04] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-5a909e04],\n.fade-leave-to[data-v-5a909e04] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-5a909e04],\n.fade-leave[data-v-5a909e04] {\n  opacity: 1;\n}\n.main-container[data-v-5a909e04] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-5a909e04] {\n  padding: 20px;\n}\n.content-block[data-v-5a909e04] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-5a909e04] {\n  background-color: #fff;\n}\n.icon-margin[data-v-5a909e04] {\n  margin: 0 5px;\n}\n.subtitle[data-v-5a909e04] {\n  padding: 15px 20px;\n}\n.subtitle h1[data-v-5a909e04] {\n  margin: 0;\n  padding: 0;\n  color: #666;\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  font-size: 1.1em;\n  font-weight: normal;\n}\n@media (max-width: 600px) {\n.subtitle h1[data-v-5a909e04] {\n    text-align: center;\n}\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 706 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-5e46292b]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-5e46292b]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-5e46292b]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-5e46292b]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-5e46292b]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-5e46292b]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-5e46292b]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-5e46292b]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-5e46292b]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-5e46292b]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-5e46292b]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-5e46292b]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-5e46292b]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-5e46292b]{border-color:transparent}.pure-button.pure-button-homework[data-v-5e46292b]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-5e46292b]:hover{background-color:#fd3c51;color:#fff}body[data-v-5e46292b],html[data-v-5e46292b]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-5e46292b]{float:left}.pull-right[data-v-5e46292b]{float:right}.clearfix[data-v-5e46292b]{clear:both;float:none}.fa-icon[data-v-5e46292b]{width:auto;height:1em}.no-margin[data-v-5e46292b]{margin:0!important}.no-padding[data-v-5e46292b]{padding:0!important}.background-white[data-v-5e46292b]{background-color:#fff!important}.text-white[data-v-5e46292b]{color:#fff}.fade-enter-active[data-v-5e46292b],.fade-leave-active[data-v-5e46292b]{transition:opacity .2s}.fade-enter[data-v-5e46292b],.fade-leave-to[data-v-5e46292b]{opacity:0}.fade-enter-to[data-v-5e46292b],.fade-leave[data-v-5e46292b]{opacity:1}.main-container[data-v-5e46292b]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-5e46292b]{padding:20px}.content-block[data-v-5e46292b]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-5e46292b]{background-color:#fff}.icon-margin[data-v-5e46292b]{margin:0 5px}", "", {"version":3,"sources":["/root/connectedacademy/src/components/Course.vue"],"names":[],"mappings":"AACA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf","file":"Course.vue","sourcesContent":["\n.pure-button[data-v-5e46292b] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-5e46292b]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-5e46292b] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-5e46292b] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-5e46292b]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-5e46292b] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-5e46292b]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-5e46292b] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-5e46292b]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-5e46292b] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-5e46292b]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-5e46292b] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-5e46292b]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-5e46292b] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-5e46292b] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-5e46292b]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-5e46292b],\nbody[data-v-5e46292b] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-5e46292b] {\n  float: left;\n}\n.pull-right[data-v-5e46292b] {\n  float: right;\n}\n.clearfix[data-v-5e46292b] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-5e46292b] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-5e46292b] {\n  margin: 0 !important;\n}\n.no-padding[data-v-5e46292b] {\n  padding: 0 !important;\n}\n.background-white[data-v-5e46292b] {\n  background-color: #fff !important;\n}\n.text-white[data-v-5e46292b] {\n  color: #fff;\n}\n.fade-enter-active[data-v-5e46292b],\n.fade-leave-active[data-v-5e46292b] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-5e46292b],\n.fade-leave-to[data-v-5e46292b] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-5e46292b],\n.fade-leave[data-v-5e46292b] {\n  opacity: 1;\n}\n.main-container[data-v-5e46292b] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-5e46292b] {\n  padding: 20px;\n}\n.content-block[data-v-5e46292b] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-5e46292b] {\n  background-color: #fff;\n}\n.icon-margin[data-v-5e46292b] {\n  margin: 0 5px;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 707 */,
/* 708 */,
/* 709 */,
/* 710 */,
/* 711 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-71d72597]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-71d72597]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-71d72597]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-71d72597]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-71d72597]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-71d72597]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-71d72597]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-71d72597]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-71d72597]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-71d72597]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-71d72597]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-71d72597]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-71d72597]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-71d72597]{border-color:transparent}.pure-button.pure-button-homework[data-v-71d72597]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-71d72597]:hover{background-color:#fd3c51;color:#fff}body[data-v-71d72597],html[data-v-71d72597]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-71d72597]{float:left}.pull-right[data-v-71d72597]{float:right}.clearfix[data-v-71d72597]{clear:both;float:none}.fa-icon[data-v-71d72597]{width:auto;height:1em}.no-margin[data-v-71d72597]{margin:0!important}.no-padding[data-v-71d72597]{padding:0!important}.background-white[data-v-71d72597]{background-color:#fff!important}.text-white[data-v-71d72597]{color:#fff}.fade-enter-active[data-v-71d72597],.fade-leave-active[data-v-71d72597]{transition:opacity .2s}.fade-enter[data-v-71d72597],.fade-leave-to[data-v-71d72597]{opacity:0}.fade-enter-to[data-v-71d72597],.fade-leave[data-v-71d72597]{opacity:1}.main-container[data-v-71d72597]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-71d72597]{padding:20px}.content-block[data-v-71d72597]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-71d72597]{background-color:#fff}.icon-margin[data-v-71d72597]{margin:0 5px}.class-selector-wrapper[data-v-71d72597]{border-radius:22px;height:44px;margin:0 0 20px;overflow:hidden;position:relative}@media (max-width:800px){.class-selector-wrapper[data-v-71d72597]{margin:0 10px 20px}}.class-selector-wrapper .skip-button[data-v-71d72597]{border-radius:22px;background-color:hsla(0,0%,100%,.5);height:44px;width:44px;position:absolute;top:50%;margin-top:-22px;bottom:0;z-index:1}.class-selector-wrapper .skip-button[data-v-71d72597]:hover{background-color:#fff;cursor:pointer}.class-selector-wrapper .skip-button.skip-button--left[data-v-71d72597]{left:0;border-right:1px solid #29b474}.class-selector-wrapper .skip-button.skip-button--right[data-v-71d72597]{right:0;border-left:1px solid #29b474}.class-selector-wrapper .skip-button .fa-icon[data-v-71d72597]{color:#29b474;height:100%;width:10px;margin:0 18px}.class-selector-wrapper .class-selector-container[data-v-71d72597]{border-radius:22px;height:140px;overflow-x:scroll;overflow-y:hidden}.class-selector-wrapper .class-selector-container ul.class-selector[data-v-71d72597]{margin:0;padding:0;list-style:none;border-bottom:1px solid #e1e1e1;height:44px;white-space:nowrap}.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item[data-v-71d72597]{margin:0;padding:0;list-style:none;transition:all .3s ease;border-radius:22px;background-color:rgba(0,0,0,.1);border:1px solid transparent;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;float:left;overflow:hidden;margin-left:10px;padding:0 15px;position:relative;text-align:center;height:44px;width:180px;white-space:normal}.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item#intro-item[data-v-71d72597]{border:none;width:44px}.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item#intro-item .fa-icon[data-v-71d72597]{height:18px;margin:14px 0}.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item[data-v-71d72597]:first-child{margin-left:0}.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item .status-indicator[data-v-71d72597]{color:#29b474;position:absolute;right:12px;top:50%;margin-top:-8px}.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item h1.class-selector--item--header[data-v-71d72597]{margin:0;padding:0;color:#29b474;font-size:1em;font-weight:400;line-height:44px;text-align:center}.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.released[data-v-71d72597]{background-color:rgba(0,0,0,.1)}.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.released .status-indicator[data-v-71d72597],.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.released h1.class-selector--item--header[data-v-71d72597]{color:#fff}.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.current[data-v-71d72597]{background-color:rgba(0,0,0,.1)}.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.current .status-indicator[data-v-71d72597],.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.current h1.class-selector--item--header[data-v-71d72597]{color:#fff}.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.future[data-v-71d72597]{background-color:hsla(0,0%,100%,.3);pointer-events:none}.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.future .status-indicator[data-v-71d72597]{color:#29b474}.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item[data-v-71d72597]:hover{background-color:#25a268;cursor:pointer}.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.active[data-v-71d72597]{background-color:#fff;transition:none}.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.active .status-indicator[data-v-71d72597],.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.active h1.class-selector--item--header[data-v-71d72597]{color:#29b474}.padded-container[data-v-71d72597]{border-radius:22px;background-color:#fff;padding:30px 0;text-align:center;width:100%}.padded-container h2[data-v-71d72597]{margin:0;padding:0;color:#444;line-height:40px}.padded-container .fa-icon[data-v-71d72597]{color:#46475d;height:40px}.padded-container .pure-button[data-v-71d72597]{margin-top:20px}.padded-container.mock-container[data-v-71d72597]{background-color:hsla(0,0%,100%,.1);margin-bottom:10px}", "", {"version":3,"sources":["/root/connectedacademy/src/components/ClassSelector.vue"],"names":[],"mappings":"AACA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,yCACE,mBAAoB,AACpB,YAAa,AACb,gBAAmB,AACnB,gBAAiB,AACjB,iBAAmB,CACpB,AACD,yBACA,yCACI,kBAAyB,CAC5B,CACA,AACD,sDACE,mBAAoB,AACpB,oCAAwC,AACxC,YAAa,AACb,WAAY,AACZ,kBAAmB,AACnB,QAAS,AACT,iBAAkB,AAClB,SAAU,AACV,SAAW,CACZ,AACD,4DACE,sBAAuB,AACvB,cAAgB,CACjB,AACD,wEACE,OAAU,AACV,8BAAgC,CACjC,AACD,yEACE,QAAW,AACX,6BAA+B,CAChC,AACD,+DACE,cAAe,AACf,YAAa,AACb,WAAY,AACZ,aAAe,CAChB,AACD,mEACE,mBAAoB,AACpB,aAAc,AACd,kBAAmB,AACnB,iBAAmB,CACpB,AACD,qFACE,SAAU,AACV,UAAW,AACX,gBAAiB,AACjB,gCAAiC,AACjC,YAAa,AACb,kBAAoB,CACrB,AACD,6GACE,SAAU,AACV,UAAW,AACX,gBAAiB,AACjB,wBAA0B,AAC1B,mBAAoB,AACpB,gCAAkC,AAClC,6BAA8B,AAC9B,sBAAuB,AACvB,2BAA4B,AAC5B,8BAA+B,AAC/B,WAAY,AACZ,gBAAiB,AACjB,iBAAkB,AAClB,eAAgB,AAChB,kBAAmB,AACnB,kBAAmB,AACnB,YAAa,AACb,YAAa,AACb,kBAAoB,CAIrB,AACD,wHACE,YAAa,AACb,UAAY,CACb,AACD,iIACE,YAAa,AACb,aAAe,CAChB,AACD,yHACE,aAAe,CAChB,AACD,+HACE,cAAe,AACf,kBAAmB,AACnB,WAAY,AACZ,QAAS,AACT,eAAiB,CAClB,AACD,6IACE,SAAU,AACV,UAAW,AACX,cAAe,AACf,cAAe,AACf,gBAAoB,AACpB,iBAAkB,AAClB,iBAAmB,CACpB,AACD,sHACE,+BAAkC,CACnC,AACD,8RAEE,UAAY,CACb,AACD,qHACE,+BAAkC,CACnC,AACD,4RAEE,UAAY,CACb,AACD,oHACE,oCAAwC,AACxC,mBAAqB,CACtB,AACD,sIACE,aAAe,CAChB,AACD,mHACE,yBAA0B,AAC1B,cAAgB,CACjB,AACD,oHACE,sBAAuB,AACvB,eAAiB,CAClB,AACD,0RAEE,aAAe,CAChB,AACD,mCACE,mBAAoB,AACpB,sBAAuB,AACvB,eAAgB,AAChB,kBAAmB,AACnB,UAAY,CACb,AACD,sCACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,gBAAkB,CACnB,AACD,4CACE,cAAe,AACf,WAAa,CACd,AACD,gDACE,eAAiB,CAClB,AACD,kDACE,oCAAwC,AACxC,kBAAoB,CACrB","file":"ClassSelector.vue","sourcesContent":["\n.pure-button[data-v-71d72597] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-71d72597]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-71d72597] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-71d72597] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-71d72597]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-71d72597] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-71d72597]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-71d72597] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-71d72597]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-71d72597] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-71d72597]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-71d72597] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-71d72597]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-71d72597] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-71d72597] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-71d72597]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-71d72597],\nbody[data-v-71d72597] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-71d72597] {\n  float: left;\n}\n.pull-right[data-v-71d72597] {\n  float: right;\n}\n.clearfix[data-v-71d72597] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-71d72597] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-71d72597] {\n  margin: 0 !important;\n}\n.no-padding[data-v-71d72597] {\n  padding: 0 !important;\n}\n.background-white[data-v-71d72597] {\n  background-color: #fff !important;\n}\n.text-white[data-v-71d72597] {\n  color: #fff;\n}\n.fade-enter-active[data-v-71d72597],\n.fade-leave-active[data-v-71d72597] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-71d72597],\n.fade-leave-to[data-v-71d72597] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-71d72597],\n.fade-leave[data-v-71d72597] {\n  opacity: 1;\n}\n.main-container[data-v-71d72597] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-71d72597] {\n  padding: 20px;\n}\n.content-block[data-v-71d72597] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-71d72597] {\n  background-color: #fff;\n}\n.icon-margin[data-v-71d72597] {\n  margin: 0 5px;\n}\n.class-selector-wrapper[data-v-71d72597] {\n  border-radius: 22px;\n  height: 44px;\n  margin: 0 0 20px 0;\n  overflow: hidden;\n  position: relative;\n}\n@media (max-width: 800px) {\n.class-selector-wrapper[data-v-71d72597] {\n    margin: 0 10px 20px 10px;\n}\n}\n.class-selector-wrapper .skip-button[data-v-71d72597] {\n  border-radius: 22px;\n  background-color: rgba(255,255,255,0.5);\n  height: 44px;\n  width: 44px;\n  position: absolute;\n  top: 50%;\n  margin-top: -22px;\n  bottom: 0;\n  z-index: 1;\n}\n.class-selector-wrapper .skip-button[data-v-71d72597]:hover {\n  background-color: #fff;\n  cursor: pointer;\n}\n.class-selector-wrapper .skip-button.skip-button--left[data-v-71d72597] {\n  left: 0px;\n  border-right: #29b474 1px solid;\n}\n.class-selector-wrapper .skip-button.skip-button--right[data-v-71d72597] {\n  right: 0px;\n  border-left: #29b474 1px solid;\n}\n.class-selector-wrapper .skip-button .fa-icon[data-v-71d72597] {\n  color: #29b474;\n  height: 100%;\n  width: 10px;\n  margin: 0 18px;\n}\n.class-selector-wrapper .class-selector-container[data-v-71d72597] {\n  border-radius: 22px;\n  height: 140px;\n  overflow-x: scroll;\n  overflow-y: hidden;\n}\n.class-selector-wrapper .class-selector-container ul.class-selector[data-v-71d72597] {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  border-bottom: #e1e1e1 1px solid;\n  height: 44px;\n  white-space: nowrap;\n}\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item[data-v-71d72597] {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  transition: all 0.3s ease;\n  border-radius: 22px;\n  background-color: rgba(0,0,0,0.1);\n  border: transparent 1px solid;\n  box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  -webkit-box-sizing: border-box;\n  float: left;\n  overflow: hidden;\n  margin-left: 10px;\n  padding: 0 15px;\n  position: relative;\n  text-align: center;\n  height: 44px;\n  width: 180px;\n  white-space: normal;\n/* Released styles */\n/* Current styles */\n/* Future styles */\n}\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item#intro-item[data-v-71d72597] {\n  border: none;\n  width: 44px;\n}\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item#intro-item .fa-icon[data-v-71d72597] {\n  height: 18px;\n  margin: 14px 0;\n}\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item[data-v-71d72597]:first-child {\n  margin-left: 0;\n}\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item .status-indicator[data-v-71d72597] {\n  color: #29b474;\n  position: absolute;\n  right: 12px;\n  top: 50%;\n  margin-top: -8px;\n}\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item h1.class-selector--item--header[data-v-71d72597] {\n  margin: 0;\n  padding: 0;\n  color: #29b474;\n  font-size: 1em;\n  font-weight: normal;\n  line-height: 44px;\n  text-align: center;\n}\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.released[data-v-71d72597] {\n  background-color: rgba(0,0,0,0.1);\n}\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.released h1.class-selector--item--header[data-v-71d72597],\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.released .status-indicator[data-v-71d72597] {\n  color: #fff;\n}\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.current[data-v-71d72597] {\n  background-color: rgba(0,0,0,0.1);\n}\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.current h1.class-selector--item--header[data-v-71d72597],\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.current .status-indicator[data-v-71d72597] {\n  color: #fff;\n}\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.future[data-v-71d72597] {\n  background-color: rgba(255,255,255,0.3);\n  pointer-events: none;\n}\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.future .status-indicator[data-v-71d72597] {\n  color: #29b474;\n}\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item[data-v-71d72597]:hover {\n  background-color: #25a268;\n  cursor: pointer;\n}\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.active[data-v-71d72597] {\n  background-color: #fff;\n  transition: none;\n}\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.active h1.class-selector--item--header[data-v-71d72597],\n.class-selector-wrapper .class-selector-container ul.class-selector li.class-selector--item.active .status-indicator[data-v-71d72597] {\n  color: #29b474;\n}\n.padded-container[data-v-71d72597] {\n  border-radius: 22px;\n  background-color: #fff;\n  padding: 30px 0;\n  text-align: center;\n  width: 100%;\n}\n.padded-container h2[data-v-71d72597] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  line-height: 40px;\n}\n.padded-container .fa-icon[data-v-71d72597] {\n  color: #46475d;\n  height: 40px;\n}\n.padded-container .pure-button[data-v-71d72597] {\n  margin-top: 20px;\n}\n.padded-container.mock-container[data-v-71d72597] {\n  background-color: rgba(255,255,255,0.1);\n  margin-bottom: 10px;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 712 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-7ae66d2a]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-7ae66d2a]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-7ae66d2a]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-7ae66d2a]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-7ae66d2a]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-7ae66d2a]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-7ae66d2a]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-7ae66d2a]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-7ae66d2a]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-7ae66d2a]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-7ae66d2a]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-7ae66d2a]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-7ae66d2a]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-7ae66d2a]{border-color:transparent}.pure-button.pure-button-homework[data-v-7ae66d2a]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-7ae66d2a]:hover{background-color:#fd3c51;color:#fff}body[data-v-7ae66d2a],html[data-v-7ae66d2a]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-7ae66d2a]{float:left}.pull-right[data-v-7ae66d2a]{float:right}.clearfix[data-v-7ae66d2a]{clear:both;float:none}.fa-icon[data-v-7ae66d2a]{width:auto;height:1em}.no-margin[data-v-7ae66d2a]{margin:0!important}.no-padding[data-v-7ae66d2a]{padding:0!important}.background-white[data-v-7ae66d2a]{background-color:#fff!important}.text-white[data-v-7ae66d2a]{color:#fff}.fade-enter-active[data-v-7ae66d2a],.fade-leave-active[data-v-7ae66d2a]{transition:opacity .2s}.fade-enter[data-v-7ae66d2a],.fade-leave-to[data-v-7ae66d2a]{opacity:0}.fade-enter-to[data-v-7ae66d2a],.fade-leave[data-v-7ae66d2a]{opacity:1}.main-container[data-v-7ae66d2a]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-7ae66d2a]{padding:20px}.content-block[data-v-7ae66d2a]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-7ae66d2a]{background-color:#fff}.icon-margin[data-v-7ae66d2a]{margin:0 5px}.rendered-markdown h1[data-v-7ae66d2a]{margin:0;padding:0;color:#444;margin-bottom:5px}.rendered-markdown a[data-v-7ae66d2a],.rendered-markdown h1[data-v-7ae66d2a],.rendered-markdown h2[data-v-7ae66d2a],.rendered-markdown h3[data-v-7ae66d2a],.rendered-markdown h4[data-v-7ae66d2a],.rendered-markdown h5[data-v-7ae66d2a],.rendered-markdown li[data-v-7ae66d2a],.rendered-markdown p[data-v-7ae66d2a]{color:#444}", "", {"version":3,"sources":["/root/connectedacademy/src/components/MarkdownContent.vue"],"names":[],"mappings":"AACA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,uCACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,iBAAmB,CACpB,AACD,sTAQE,UAAY,CACb","file":"MarkdownContent.vue","sourcesContent":["\n.pure-button[data-v-7ae66d2a] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-7ae66d2a]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-7ae66d2a] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-7ae66d2a] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-7ae66d2a]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-7ae66d2a] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-7ae66d2a]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-7ae66d2a] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-7ae66d2a]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-7ae66d2a] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-7ae66d2a]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-7ae66d2a] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-7ae66d2a]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-7ae66d2a] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-7ae66d2a] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-7ae66d2a]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-7ae66d2a],\nbody[data-v-7ae66d2a] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-7ae66d2a] {\n  float: left;\n}\n.pull-right[data-v-7ae66d2a] {\n  float: right;\n}\n.clearfix[data-v-7ae66d2a] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-7ae66d2a] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-7ae66d2a] {\n  margin: 0 !important;\n}\n.no-padding[data-v-7ae66d2a] {\n  padding: 0 !important;\n}\n.background-white[data-v-7ae66d2a] {\n  background-color: #fff !important;\n}\n.text-white[data-v-7ae66d2a] {\n  color: #fff;\n}\n.fade-enter-active[data-v-7ae66d2a],\n.fade-leave-active[data-v-7ae66d2a] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-7ae66d2a],\n.fade-leave-to[data-v-7ae66d2a] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-7ae66d2a],\n.fade-leave[data-v-7ae66d2a] {\n  opacity: 1;\n}\n.main-container[data-v-7ae66d2a] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-7ae66d2a] {\n  padding: 20px;\n}\n.content-block[data-v-7ae66d2a] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-7ae66d2a] {\n  background-color: #fff;\n}\n.icon-margin[data-v-7ae66d2a] {\n  margin: 0 5px;\n}\n.rendered-markdown h1[data-v-7ae66d2a] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  margin-bottom: 5px;\n}\n.rendered-markdown h1[data-v-7ae66d2a],\n.rendered-markdown h2[data-v-7ae66d2a],\n.rendered-markdown h3[data-v-7ae66d2a],\n.rendered-markdown h4[data-v-7ae66d2a],\n.rendered-markdown h5[data-v-7ae66d2a],\n.rendered-markdown p[data-v-7ae66d2a],\n.rendered-markdown a[data-v-7ae66d2a],\n.rendered-markdown li[data-v-7ae66d2a] {\n  color: #444;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 713 */,
/* 714 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-bf1f21f8]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-bf1f21f8]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-bf1f21f8]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-bf1f21f8]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-bf1f21f8]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-bf1f21f8]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-bf1f21f8]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-bf1f21f8]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-bf1f21f8]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-bf1f21f8]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-bf1f21f8]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-bf1f21f8]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-bf1f21f8]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-bf1f21f8]{border-color:transparent}.pure-button.pure-button-homework[data-v-bf1f21f8]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-bf1f21f8]:hover{background-color:#fd3c51;color:#fff}body[data-v-bf1f21f8],html[data-v-bf1f21f8]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-bf1f21f8]{float:left}.pull-right[data-v-bf1f21f8]{float:right}.clearfix[data-v-bf1f21f8]{clear:both;float:none}.fa-icon[data-v-bf1f21f8]{width:auto;height:1em}.no-margin[data-v-bf1f21f8]{margin:0!important}.no-padding[data-v-bf1f21f8]{padding:0!important}.background-white[data-v-bf1f21f8]{background-color:#fff!important}.text-white[data-v-bf1f21f8]{color:#fff}.fade-enter-active[data-v-bf1f21f8],.fade-leave-active[data-v-bf1f21f8]{transition:opacity .2s}.fade-enter[data-v-bf1f21f8],.fade-leave-to[data-v-bf1f21f8]{opacity:0}.fade-enter-to[data-v-bf1f21f8],.fade-leave[data-v-bf1f21f8]{opacity:1}.main-container[data-v-bf1f21f8]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-bf1f21f8]{padding:20px}.content-block[data-v-bf1f21f8]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-bf1f21f8]{background-color:#fff}.icon-margin[data-v-bf1f21f8]{margin:0 5px}.swiper-slide[data-v-bf1f21f8]{background-size:cover;background-repeat:no-repeat;background-position:50%;background-size:contain;background-color:#222;margin:10px auto;min-height:400px}.swiper-slide img[data-v-bf1f21f8]{width:auto;height:auto;max-width:100%;max-height:100%;-webkit-transform:translate(-50%,-50%);transform:translate(-50%,-50%);position:absolute;left:50%;top:50%}", "", {"version":3,"sources":["/root/connectedacademy/src/components/MediaCarousel.vue"],"names":[],"mappings":"AACA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,+BACE,sBAAuB,AACvB,4BAA6B,AAC7B,wBAA4B,AAC5B,wBAAyB,AACzB,sBAAuB,AACvB,iBAAkB,AAClB,gBAAkB,CACnB,AACD,mCACE,WAAY,AACZ,YAAa,AACb,eAAgB,AAChB,gBAAiB,AAEjB,uCAAyC,AACzC,+BAAiC,AACjC,kBAAmB,AACnB,SAAU,AACV,OAAS,CACV","file":"MediaCarousel.vue","sourcesContent":["\n.pure-button[data-v-bf1f21f8] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-bf1f21f8]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-bf1f21f8] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-bf1f21f8] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-bf1f21f8]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-bf1f21f8] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-bf1f21f8]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-bf1f21f8] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-bf1f21f8]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-bf1f21f8] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-bf1f21f8]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-bf1f21f8] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-bf1f21f8]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-bf1f21f8] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-bf1f21f8] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-bf1f21f8]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-bf1f21f8],\nbody[data-v-bf1f21f8] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-bf1f21f8] {\n  float: left;\n}\n.pull-right[data-v-bf1f21f8] {\n  float: right;\n}\n.clearfix[data-v-bf1f21f8] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-bf1f21f8] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-bf1f21f8] {\n  margin: 0 !important;\n}\n.no-padding[data-v-bf1f21f8] {\n  padding: 0 !important;\n}\n.background-white[data-v-bf1f21f8] {\n  background-color: #fff !important;\n}\n.text-white[data-v-bf1f21f8] {\n  color: #fff;\n}\n.fade-enter-active[data-v-bf1f21f8],\n.fade-leave-active[data-v-bf1f21f8] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-bf1f21f8],\n.fade-leave-to[data-v-bf1f21f8] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-bf1f21f8],\n.fade-leave[data-v-bf1f21f8] {\n  opacity: 1;\n}\n.main-container[data-v-bf1f21f8] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-bf1f21f8] {\n  padding: 20px;\n}\n.content-block[data-v-bf1f21f8] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-bf1f21f8] {\n  background-color: #fff;\n}\n.icon-margin[data-v-bf1f21f8] {\n  margin: 0 5px;\n}\n.swiper-slide[data-v-bf1f21f8] {\n  background-size: cover;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-size: contain;\n  background-color: #222;\n  margin: 10px auto;\n  min-height: 400px;\n}\n.swiper-slide img[data-v-bf1f21f8] {\n  width: auto;\n  height: auto;\n  max-width: 100%;\n  max-height: 100%;\n  -webkit-transform: translate(-50%, -50%);\n  -webkit-transform: translate(-50%, -50%);\n  transform: translate(-50%, -50%);\n  position: absolute;\n  left: 50%;\n  top: 50%;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 715 */,
/* 716 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-da893b7c]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-da893b7c]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-da893b7c]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-da893b7c]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-da893b7c]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-da893b7c]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-da893b7c]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-da893b7c]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-da893b7c]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-da893b7c]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-da893b7c]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-da893b7c]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-da893b7c]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-da893b7c]{border-color:transparent}.pure-button.pure-button-homework[data-v-da893b7c]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-da893b7c]:hover{background-color:#fd3c51;color:#fff}body[data-v-da893b7c],html[data-v-da893b7c]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-da893b7c]{float:left}.pull-right[data-v-da893b7c]{float:right}.clearfix[data-v-da893b7c]{clear:both;float:none}.fa-icon[data-v-da893b7c]{width:auto;height:1em}.no-margin[data-v-da893b7c]{margin:0!important}.no-padding[data-v-da893b7c]{padding:0!important}.background-white[data-v-da893b7c]{background-color:#fff!important}.text-white[data-v-da893b7c]{color:#fff}.fade-enter-active[data-v-da893b7c],.fade-leave-active[data-v-da893b7c]{transition:opacity .2s}.fade-enter[data-v-da893b7c],.fade-leave-to[data-v-da893b7c]{opacity:0}.fade-enter-to[data-v-da893b7c],.fade-leave[data-v-da893b7c]{opacity:1}.main-container[data-v-da893b7c]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-da893b7c]{padding:20px}.content-block[data-v-da893b7c]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-da893b7c]{background-color:#fff}.icon-margin[data-v-da893b7c]{margin:0 5px}.submission-grid-wrapper[data-v-da893b7c]{background-color:#fd3c51;border-top:1px solid hsla(0,0%,100%,.2);margin:0 10px;overflow:hidden}.submission-grid-wrapper p.content-description[data-v-da893b7c]{color:hsla(0,0%,100%,.5);text-align:center}.submission-grid-wrapper ul.submission-grid[data-v-da893b7c]{margin:0;padding:0;list-style:none;height:100px;overflow-x:auto;overflow-y:hidden;padding:10px 0;text-align:center}.submission-grid-wrapper ul.submission-grid li.submission-grid--tile[data-v-da893b7c]{margin:0;padding:0;list-style:none;display:inline-block;margin:10px}.submission-grid-wrapper ul.submission-grid li.submission-grid--tile[data-v-da893b7c]:hover{cursor:pointer}.submission-grid-wrapper ul.submission-grid li.submission-grid--tile img[data-v-da893b7c]{background-color:#fff;display:block;height:80px;max-width:300px}", "", {"version":3,"sources":["/root/connectedacademy/src/components/SubmissionGrid.vue"],"names":[],"mappings":"AACA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,0CACE,yBAA0B,AAC1B,wCAA4C,AAC5C,cAAe,AACf,eAAiB,CAClB,AACD,gEACE,yBAA6B,AAC7B,iBAAmB,CACpB,AACD,6DACE,SAAU,AACV,UAAW,AACX,gBAAiB,AACjB,aAAc,AACd,gBAAiB,AACjB,kBAAmB,AACnB,eAAgB,AAChB,iBAAmB,CACpB,AACD,sFACE,SAAU,AACV,UAAW,AACX,gBAAiB,AACjB,qBAAsB,AACtB,WAAa,CACd,AACD,4FACE,cAAgB,CACjB,AACD,0FACE,sBAAuB,AAEvB,cAAe,AACf,YAAa,AACb,eAAiB,CAClB","file":"SubmissionGrid.vue","sourcesContent":["\n.pure-button[data-v-da893b7c] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-da893b7c]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-da893b7c] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-da893b7c] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-da893b7c]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-da893b7c] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-da893b7c]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-da893b7c] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-da893b7c]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-da893b7c] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-da893b7c]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-da893b7c] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-da893b7c]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-da893b7c] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-da893b7c] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-da893b7c]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-da893b7c],\nbody[data-v-da893b7c] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-da893b7c] {\n  float: left;\n}\n.pull-right[data-v-da893b7c] {\n  float: right;\n}\n.clearfix[data-v-da893b7c] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-da893b7c] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-da893b7c] {\n  margin: 0 !important;\n}\n.no-padding[data-v-da893b7c] {\n  padding: 0 !important;\n}\n.background-white[data-v-da893b7c] {\n  background-color: #fff !important;\n}\n.text-white[data-v-da893b7c] {\n  color: #fff;\n}\n.fade-enter-active[data-v-da893b7c],\n.fade-leave-active[data-v-da893b7c] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-da893b7c],\n.fade-leave-to[data-v-da893b7c] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-da893b7c],\n.fade-leave[data-v-da893b7c] {\n  opacity: 1;\n}\n.main-container[data-v-da893b7c] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-da893b7c] {\n  padding: 20px;\n}\n.content-block[data-v-da893b7c] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-da893b7c] {\n  background-color: #fff;\n}\n.icon-margin[data-v-da893b7c] {\n  margin: 0 5px;\n}\n.submission-grid-wrapper[data-v-da893b7c] {\n  background-color: #fd3c51;\n  border-top: rgba(255,255,255,0.2) 1px solid;\n  margin: 0 10px;\n  overflow: hidden;\n}\n.submission-grid-wrapper p.content-description[data-v-da893b7c] {\n  color: rgba(255,255,255,0.5);\n  text-align: center;\n}\n.submission-grid-wrapper ul.submission-grid[data-v-da893b7c] {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  height: 100px;\n  overflow-x: auto;\n  overflow-y: hidden;\n  padding: 10px 0;\n  text-align: center;\n}\n.submission-grid-wrapper ul.submission-grid li.submission-grid--tile[data-v-da893b7c] {\n  margin: 0;\n  padding: 0;\n  list-style: none;\n  display: inline-block;\n  margin: 10px;\n}\n.submission-grid-wrapper ul.submission-grid li.submission-grid--tile[data-v-da893b7c]:hover {\n  cursor: pointer;\n}\n.submission-grid-wrapper ul.submission-grid li.submission-grid--tile img[data-v-da893b7c] {\n  background-color: #fff;\n/*border white 1px solid*/\n  display: block;\n  height: 80px;\n  max-width: 300px;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 717 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-df9076bc]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-df9076bc]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-df9076bc]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-df9076bc]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-df9076bc]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-df9076bc]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-df9076bc]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-df9076bc]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-df9076bc]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-df9076bc]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-df9076bc]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-df9076bc]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-df9076bc]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-df9076bc]{border-color:transparent}.pure-button.pure-button-homework[data-v-df9076bc]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-df9076bc]:hover{background-color:#fd3c51;color:#fff}body[data-v-df9076bc],html[data-v-df9076bc]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-df9076bc]{float:left}.pull-right[data-v-df9076bc]{float:right}.clearfix[data-v-df9076bc]{clear:both;float:none}.fa-icon[data-v-df9076bc]{width:auto;height:1em}.no-margin[data-v-df9076bc]{margin:0!important}.no-padding[data-v-df9076bc]{padding:0!important}.background-white[data-v-df9076bc]{background-color:#fff!important}.text-white[data-v-df9076bc]{color:#fff}.fade-enter-active[data-v-df9076bc],.fade-leave-active[data-v-df9076bc]{transition:opacity .2s}.fade-enter[data-v-df9076bc],.fade-leave-to[data-v-df9076bc]{opacity:0}.fade-enter-to[data-v-df9076bc],.fade-leave[data-v-df9076bc]{opacity:1}.main-container[data-v-df9076bc]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-df9076bc]{padding:20px}.content-block[data-v-df9076bc]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-df9076bc]{background-color:#fff}.icon-margin[data-v-df9076bc]{margin:0 5px}.course-content-wrapper[data-v-df9076bc]{margin-bottom:10px}.course-content-wrapper[data-v-df9076bc]:last-child{margin-bottom:0}.course-content-wrapper .course-content-group .course-content[data-v-df9076bc]{border-radius:4px;box-shadow:0 0 10px 5px rgba(0,0,0,.01);-moz-box-shadow:0 0 10px 5px rgba(0,0,0,.01);-webkit-box-shadow:0 0 10px 5px rgba(0,0,0,.01);background-color:#fff;margin:20px 0 0;min-height:100px;padding:0;position:relative}@media (max-width:800px){.course-content-wrapper .course-content-group .course-content[data-v-df9076bc]{border-radius:0;margin:20px 0 0}}.course-content-wrapper .course-content-group .course-content h5.content-subheader[data-v-df9076bc]{margin:0;padding:0;color:#444;font-weight:300}.course-content-wrapper .course-content-group .course-content p.content-description[data-v-df9076bc]{margin:0;padding:0;color:#666;font-size:1em}.course-content-wrapper .course-content-group .course-content a[data-v-df9076bc]{text-decoration:none}.course-content-wrapper .course-content-group .course-content .course-content--header[data-v-df9076bc]{background-color:transparent;overflow:hidden;padding:20px 20px 10px}.course-content-wrapper .course-content-group .course-content .course-content--header h1.content-title[data-v-df9076bc]{margin:0;padding:0;color:#444;font-size:1.3em;font-weight:700}.course-content-wrapper .course-content-group .course-content .course-content--header.block[data-v-df9076bc]{background-color:#29b474;padding:30px;text-align:center}.course-content-wrapper .course-content-group .course-content .course-content--header.block h1.content-title[data-v-df9076bc]{color:#fff;font-size:2em;font-weight:700;margin-bottom:10px}.course-content-wrapper .course-content-group .course-content .course-content--header.block p.content-description[data-v-df9076bc]{color:#fff;margin:0 auto}.course-content-wrapper .course-content-group .course-content .course-content--body[data-v-df9076bc]{overflow:hidden;padding:0 20px 10px}.course-content-wrapper .course-content-group .course-content .course-content--body h1[data-v-df9076bc],.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-df9076bc],.course-content-wrapper .course-content-group .course-content .course-content--body h3[data-v-df9076bc],.course-content-wrapper .course-content-group .course-content .course-content--body h4[data-v-df9076bc],.course-content-wrapper .course-content-group .course-content .course-content--body h5[data-v-df9076bc]{font-weight:300}.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-df9076bc]{color:#444;font-size:1.3em;font-weight:700}.course-content-wrapper .course-content-group .course-content .course-content--footer[data-v-df9076bc]{padding:20px}.course-content-wrapper .course-content-group.course-content-group--question[data-v-df9076bc]{border-radius:6px;background-color:hsla(0,0%,100%,.15);padding:15px;margin-top:10px}.course-content-wrapper .course-content-group.course-content-group--question .course-content[data-v-df9076bc]{margin:0}", "", {"version":3,"sources":["/root/connectedacademy/src/components/conversation/CourseContent.vue"],"names":[],"mappings":"AACA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,yCACE,kBAAoB,CACrB,AACD,oDACE,eAAiB,CAClB,AACD,+EACE,kBAAmB,AACnB,wCAA0C,AAC1C,6CAA+C,AAC/C,gDAAkD,AAClD,sBAAuB,AACvB,gBAAmB,AACnB,iBAAkB,AAClB,UAAW,AACX,iBAAmB,CACpB,AACD,yBACA,+EACI,gBAAiB,AACjB,eAAmB,CACtB,CACA,AACD,oGACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,eAAiB,CAClB,AACD,qGACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,aAAe,CAChB,AACD,iFACE,oBAAsB,CACvB,AACD,uGACE,6BAA8B,AAC9B,gBAAiB,AACjB,sBAA6B,CAC9B,AACD,wHACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,6GACE,yBAA0B,AAC1B,aAAc,AACd,iBAAmB,CACpB,AACD,8HACE,WAAY,AACZ,cAAe,AACf,gBAAkB,AAClB,kBAAoB,CACrB,AACD,mIACE,WAAY,AACZ,aAAe,CAChB,AACD,qGACE,gBAAiB,AACjB,mBAA4B,CAC7B,AACD,wgBAKE,eAAiB,CAClB,AACD,wGACE,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,uGACE,YAAc,CACf,AACD,8FACE,kBAAmB,AACnB,qCAAyC,AACzC,aAAc,AACd,eAAiB,CAClB,AACD,8GACE,QAAU,CACX","file":"CourseContent.vue","sourcesContent":["\n.pure-button[data-v-df9076bc] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-df9076bc]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-df9076bc] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-df9076bc] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-df9076bc]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-df9076bc] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-df9076bc]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-df9076bc] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-df9076bc]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-df9076bc] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-df9076bc]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-df9076bc] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-df9076bc]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-df9076bc] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-df9076bc] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-df9076bc]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-df9076bc],\nbody[data-v-df9076bc] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-df9076bc] {\n  float: left;\n}\n.pull-right[data-v-df9076bc] {\n  float: right;\n}\n.clearfix[data-v-df9076bc] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-df9076bc] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-df9076bc] {\n  margin: 0 !important;\n}\n.no-padding[data-v-df9076bc] {\n  padding: 0 !important;\n}\n.background-white[data-v-df9076bc] {\n  background-color: #fff !important;\n}\n.text-white[data-v-df9076bc] {\n  color: #fff;\n}\n.fade-enter-active[data-v-df9076bc],\n.fade-leave-active[data-v-df9076bc] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-df9076bc],\n.fade-leave-to[data-v-df9076bc] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-df9076bc],\n.fade-leave[data-v-df9076bc] {\n  opacity: 1;\n}\n.main-container[data-v-df9076bc] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-df9076bc] {\n  padding: 20px;\n}\n.content-block[data-v-df9076bc] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-df9076bc] {\n  background-color: #fff;\n}\n.icon-margin[data-v-df9076bc] {\n  margin: 0 5px;\n}\n.course-content-wrapper[data-v-df9076bc] {\n  margin-bottom: 10px;\n}\n.course-content-wrapper[data-v-df9076bc]:last-child {\n  margin-bottom: 0;\n}\n.course-content-wrapper .course-content-group .course-content[data-v-df9076bc] {\n  border-radius: 4px;\n  box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -moz-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -webkit-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  background-color: #fff;\n  margin: 20px 0 0 0;\n  min-height: 100px;\n  padding: 0;\n  position: relative;\n}\n@media (max-width: 800px) {\n.course-content-wrapper .course-content-group .course-content[data-v-df9076bc] {\n    border-radius: 0;\n    margin: 20px 0 0 0;\n}\n}\n.course-content-wrapper .course-content-group .course-content h5.content-subheader[data-v-df9076bc] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  font-weight: 300;\n}\n.course-content-wrapper .course-content-group .course-content p.content-description[data-v-df9076bc] {\n  margin: 0;\n  padding: 0;\n  color: #666;\n  font-size: 1em;\n}\n.course-content-wrapper .course-content-group .course-content a[data-v-df9076bc] {\n  text-decoration: none;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header[data-v-df9076bc] {\n  background-color: transparent;\n  overflow: hidden;\n  padding: 20px 20px 10px 20px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header h1.content-title[data-v-df9076bc] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block[data-v-df9076bc] {\n  background-color: #29b474;\n  padding: 30px;\n  text-align: center;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block h1.content-title[data-v-df9076bc] {\n  color: #fff;\n  font-size: 2em;\n  font-weight: bold;\n  margin-bottom: 10px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block p.content-description[data-v-df9076bc] {\n  color: #fff;\n  margin: 0 auto;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body[data-v-df9076bc] {\n  overflow: hidden;\n  padding: 0px 20px 10px 20px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body h1[data-v-df9076bc],\n.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-df9076bc],\n.course-content-wrapper .course-content-group .course-content .course-content--body h3[data-v-df9076bc],\n.course-content-wrapper .course-content-group .course-content .course-content--body h4[data-v-df9076bc],\n.course-content-wrapper .course-content-group .course-content .course-content--body h5[data-v-df9076bc] {\n  font-weight: 300;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-df9076bc] {\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--footer[data-v-df9076bc] {\n  padding: 20px;\n}\n.course-content-wrapper .course-content-group.course-content-group--question[data-v-df9076bc] {\n  border-radius: 6px;\n  background-color: rgba(255,255,255,0.15);\n  padding: 15px;\n  margin-top: 10px;\n}\n.course-content-wrapper .course-content-group.course-content-group--question .course-content[data-v-df9076bc] {\n  margin: 0;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 718 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-ed52363c]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-ed52363c]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-ed52363c]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-ed52363c]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-ed52363c]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-ed52363c]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-ed52363c]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-ed52363c]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-ed52363c]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-ed52363c]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-ed52363c]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-ed52363c]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-ed52363c]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-ed52363c]{border-color:transparent}.pure-button.pure-button-homework[data-v-ed52363c]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-ed52363c]:hover{background-color:#fd3c51;color:#fff}body[data-v-ed52363c],html[data-v-ed52363c]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-ed52363c]{float:left}.pull-right[data-v-ed52363c]{float:right}.clearfix[data-v-ed52363c]{clear:both;float:none}.fa-icon[data-v-ed52363c]{width:auto;height:1em}.no-margin[data-v-ed52363c]{margin:0!important}.no-padding[data-v-ed52363c]{padding:0!important}.background-white[data-v-ed52363c]{background-color:#fff!important}.text-white[data-v-ed52363c]{color:#fff}.fade-enter-active[data-v-ed52363c],.fade-leave-active[data-v-ed52363c]{transition:opacity .2s}.fade-enter[data-v-ed52363c],.fade-leave-to[data-v-ed52363c]{opacity:0}.fade-enter-to[data-v-ed52363c],.fade-leave[data-v-ed52363c]{opacity:1}.main-container[data-v-ed52363c]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-ed52363c]{padding:20px}.content-block[data-v-ed52363c]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-ed52363c]{background-color:#fff}.icon-margin[data-v-ed52363c]{margin:0 5px}.course-content-wrapper[data-v-ed52363c]{margin-bottom:10px}.course-content-wrapper[data-v-ed52363c]:last-child{margin-bottom:0}.course-content-wrapper .course-content-group .course-content[data-v-ed52363c]{border-radius:4px;box-shadow:0 0 10px 5px rgba(0,0,0,.01);-moz-box-shadow:0 0 10px 5px rgba(0,0,0,.01);-webkit-box-shadow:0 0 10px 5px rgba(0,0,0,.01);background-color:#fff;margin:20px 0 0;min-height:100px;padding:0;position:relative}@media (max-width:800px){.course-content-wrapper .course-content-group .course-content[data-v-ed52363c]{border-radius:0;margin:20px 0 0}}.course-content-wrapper .course-content-group .course-content h5.content-subheader[data-v-ed52363c]{margin:0;padding:0;color:#444;font-weight:300}.course-content-wrapper .course-content-group .course-content p.content-description[data-v-ed52363c]{margin:0;padding:0;color:#666;font-size:1em}.course-content-wrapper .course-content-group .course-content a[data-v-ed52363c]{text-decoration:none}.course-content-wrapper .course-content-group .course-content .course-content--header[data-v-ed52363c]{background-color:transparent;overflow:hidden;padding:20px 20px 10px}.course-content-wrapper .course-content-group .course-content .course-content--header h1.content-title[data-v-ed52363c]{margin:0;padding:0;color:#444;font-size:1.3em;font-weight:700}.course-content-wrapper .course-content-group .course-content .course-content--header.block[data-v-ed52363c]{background-color:#29b474;padding:30px;text-align:center}.course-content-wrapper .course-content-group .course-content .course-content--header.block h1.content-title[data-v-ed52363c]{color:#fff;font-size:2em;font-weight:700;margin-bottom:10px}.course-content-wrapper .course-content-group .course-content .course-content--header.block p.content-description[data-v-ed52363c]{color:#fff;margin:0 auto}.course-content-wrapper .course-content-group .course-content .course-content--body[data-v-ed52363c]{overflow:hidden;padding:0 20px 10px}.course-content-wrapper .course-content-group .course-content .course-content--body h1[data-v-ed52363c],.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-ed52363c],.course-content-wrapper .course-content-group .course-content .course-content--body h3[data-v-ed52363c],.course-content-wrapper .course-content-group .course-content .course-content--body h4[data-v-ed52363c],.course-content-wrapper .course-content-group .course-content .course-content--body h5[data-v-ed52363c]{font-weight:300}.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-ed52363c]{color:#444;font-size:1.3em;font-weight:700}.course-content-wrapper .course-content-group .course-content .course-content--footer[data-v-ed52363c]{padding:20px}.course-content-wrapper .course-content-group.course-content-group--question[data-v-ed52363c]{border-radius:6px;background-color:hsla(0,0%,100%,.15);padding:15px;margin-top:10px}.course-content-wrapper .course-content-group.course-content-group--question .course-content[data-v-ed52363c]{margin:0}#wrapper[data-v-ed52363c]{transition:all .3s ease}fieldset[data-v-ed52363c]{border:none}fieldset input[data-v-ed52363c],fieldset select[data-v-ed52363c]{border-color:#fd3c51}fieldset.valid input[data-v-ed52363c],fieldset.valid select[data-v-ed52363c]{border-color:#29b474}input[data-v-ed52363c],select[data-v-ed52363c]{margin:10px 0;min-width:200px}input.full-width[data-v-ed52363c],select.full-width[data-v-ed52363c]{width:100%}input[type=checkbox][data-v-ed52363c]{margin-right:10px}.question-wrapper label[data-v-ed52363c]{font-weight:700}button[data-v-ed52363c]{margin-left:10px}.vue-slider-wrapper[data-v-ed52363c]{padding-top:30px}", "", {"version":3,"sources":["/root/connectedacademy/src/components/conversation/InjectedQuestion.vue"],"names":[],"mappings":"AAsIA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,yCACE,kBAAoB,CACrB,AACD,oDACE,eAAiB,CAClB,AACD,+EACE,kBAAmB,AACnB,wCAA0C,AAC1C,6CAA+C,AAC/C,gDAAkD,AAClD,sBAAuB,AACvB,gBAAmB,AACnB,iBAAkB,AAClB,UAAW,AACX,iBAAmB,CACpB,AACD,yBACA,+EACI,gBAAiB,AACjB,eAAmB,CACtB,CACA,AACD,oGACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,eAAiB,CAClB,AACD,qGACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,aAAe,CAChB,AACD,iFACE,oBAAsB,CACvB,AACD,uGACE,6BAA8B,AAC9B,gBAAiB,AACjB,sBAA6B,CAC9B,AACD,wHACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,6GACE,yBAA0B,AAC1B,aAAc,AACd,iBAAmB,CACpB,AACD,8HACE,WAAY,AACZ,cAAe,AACf,gBAAkB,AAClB,kBAAoB,CACrB,AACD,mIACE,WAAY,AACZ,aAAe,CAChB,AACD,qGACE,gBAAiB,AACjB,mBAA4B,CAC7B,AACD,wgBAKE,eAAiB,CAClB,AACD,wGACE,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,uGACE,YAAc,CACf,AACD,8FACE,kBAAmB,AACnB,qCAAyC,AACzC,aAAc,AACd,eAAiB,CAClB,AACD,8GACE,QAAU,CACX,AACD,0BACE,uBAA0B,CAC3B,AACD,0BACE,WAAa,CACd,AACD,iEAEE,oBAAsB,CACvB,AACD,6EAEE,oBAAsB,CACvB,AACD,+CAEE,cAAe,AACf,eAAiB,CAClB,AACD,qEAEE,UAAY,CACb,AACD,sCACE,iBAAmB,CACpB,AACD,yCACE,eAAkB,CACnB,AACD,wBACE,gBAAkB,CACnB,AACD,qCACE,gBAAkB,CACnB","file":"InjectedQuestion.vue","sourcesContent":["\n.pure-button[data-v-ed52363c] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-ed52363c]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-ed52363c] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-ed52363c] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-ed52363c]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-ed52363c] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-ed52363c]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-ed52363c] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-ed52363c]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-ed52363c] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-ed52363c]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-ed52363c] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-ed52363c]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-ed52363c] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-ed52363c] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-ed52363c]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-ed52363c],\nbody[data-v-ed52363c] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-ed52363c] {\n  float: left;\n}\n.pull-right[data-v-ed52363c] {\n  float: right;\n}\n.clearfix[data-v-ed52363c] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-ed52363c] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-ed52363c] {\n  margin: 0 !important;\n}\n.no-padding[data-v-ed52363c] {\n  padding: 0 !important;\n}\n.background-white[data-v-ed52363c] {\n  background-color: #fff !important;\n}\n.text-white[data-v-ed52363c] {\n  color: #fff;\n}\n.fade-enter-active[data-v-ed52363c],\n.fade-leave-active[data-v-ed52363c] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-ed52363c],\n.fade-leave-to[data-v-ed52363c] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-ed52363c],\n.fade-leave[data-v-ed52363c] {\n  opacity: 1;\n}\n.main-container[data-v-ed52363c] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-ed52363c] {\n  padding: 20px;\n}\n.content-block[data-v-ed52363c] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-ed52363c] {\n  background-color: #fff;\n}\n.icon-margin[data-v-ed52363c] {\n  margin: 0 5px;\n}\n.pure-button[data-v-ed52363c] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-ed52363c]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-ed52363c] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-ed52363c] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-ed52363c]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-ed52363c] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-ed52363c]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-ed52363c] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-ed52363c]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-ed52363c] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-ed52363c]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-ed52363c] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-ed52363c]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-ed52363c] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-ed52363c] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-ed52363c]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-ed52363c],\nbody[data-v-ed52363c] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-ed52363c] {\n  float: left;\n}\n.pull-right[data-v-ed52363c] {\n  float: right;\n}\n.clearfix[data-v-ed52363c] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-ed52363c] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-ed52363c] {\n  margin: 0 !important;\n}\n.no-padding[data-v-ed52363c] {\n  padding: 0 !important;\n}\n.background-white[data-v-ed52363c] {\n  background-color: #fff !important;\n}\n.text-white[data-v-ed52363c] {\n  color: #fff;\n}\n.fade-enter-active[data-v-ed52363c],\n.fade-leave-active[data-v-ed52363c] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-ed52363c],\n.fade-leave-to[data-v-ed52363c] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-ed52363c],\n.fade-leave[data-v-ed52363c] {\n  opacity: 1;\n}\n.main-container[data-v-ed52363c] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-ed52363c] {\n  padding: 20px;\n}\n.content-block[data-v-ed52363c] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-ed52363c] {\n  background-color: #fff;\n}\n.icon-margin[data-v-ed52363c] {\n  margin: 0 5px;\n}\n.course-content-wrapper[data-v-ed52363c] {\n  margin-bottom: 10px;\n}\n.course-content-wrapper[data-v-ed52363c]:last-child {\n  margin-bottom: 0;\n}\n.course-content-wrapper .course-content-group .course-content[data-v-ed52363c] {\n  border-radius: 4px;\n  box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -moz-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -webkit-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  background-color: #fff;\n  margin: 20px 0 0 0;\n  min-height: 100px;\n  padding: 0;\n  position: relative;\n}\n@media (max-width: 800px) {\n.course-content-wrapper .course-content-group .course-content[data-v-ed52363c] {\n    border-radius: 0;\n    margin: 20px 0 0 0;\n}\n}\n.course-content-wrapper .course-content-group .course-content h5.content-subheader[data-v-ed52363c] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  font-weight: 300;\n}\n.course-content-wrapper .course-content-group .course-content p.content-description[data-v-ed52363c] {\n  margin: 0;\n  padding: 0;\n  color: #666;\n  font-size: 1em;\n}\n.course-content-wrapper .course-content-group .course-content a[data-v-ed52363c] {\n  text-decoration: none;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header[data-v-ed52363c] {\n  background-color: transparent;\n  overflow: hidden;\n  padding: 20px 20px 10px 20px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header h1.content-title[data-v-ed52363c] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block[data-v-ed52363c] {\n  background-color: #29b474;\n  padding: 30px;\n  text-align: center;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block h1.content-title[data-v-ed52363c] {\n  color: #fff;\n  font-size: 2em;\n  font-weight: bold;\n  margin-bottom: 10px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block p.content-description[data-v-ed52363c] {\n  color: #fff;\n  margin: 0 auto;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body[data-v-ed52363c] {\n  overflow: hidden;\n  padding: 0px 20px 10px 20px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body h1[data-v-ed52363c],\n.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-ed52363c],\n.course-content-wrapper .course-content-group .course-content .course-content--body h3[data-v-ed52363c],\n.course-content-wrapper .course-content-group .course-content .course-content--body h4[data-v-ed52363c],\n.course-content-wrapper .course-content-group .course-content .course-content--body h5[data-v-ed52363c] {\n  font-weight: 300;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-ed52363c] {\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--footer[data-v-ed52363c] {\n  padding: 20px;\n}\n.course-content-wrapper .course-content-group.course-content-group--question[data-v-ed52363c] {\n  border-radius: 6px;\n  background-color: rgba(255,255,255,0.15);\n  padding: 15px;\n  margin-top: 10px;\n}\n.course-content-wrapper .course-content-group.course-content-group--question .course-content[data-v-ed52363c] {\n  margin: 0;\n}\n#wrapper[data-v-ed52363c] {\n  transition: all 0.3s ease;\n}\nfieldset[data-v-ed52363c] {\n  border: none;\n}\nfieldset input[data-v-ed52363c],\nfieldset select[data-v-ed52363c] {\n  border-color: #fd3c51;\n}\nfieldset.valid input[data-v-ed52363c],\nfieldset.valid select[data-v-ed52363c] {\n  border-color: #29b474;\n}\ninput[data-v-ed52363c],\nselect[data-v-ed52363c] {\n  margin: 10px 0;\n  min-width: 200px;\n}\ninput.full-width[data-v-ed52363c],\nselect.full-width[data-v-ed52363c] {\n  width: 100%;\n}\ninput[type=\"checkbox\"][data-v-ed52363c] {\n  margin-right: 10px;\n}\n.question-wrapper label[data-v-ed52363c] {\n  font-weight: bold;\n}\nbutton[data-v-ed52363c] {\n  margin-left: 10px;\n}\n.vue-slider-wrapper[data-v-ed52363c] {\n  padding-top: 30px;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 719 */
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(468)();
// imports


// module
exports.push([module.i, ".pure-button[data-v-f8523108]{transition:all .3s ease;border-radius:4px;background:none;background-color:transparent;border:1px solid #29b474;color:#29b474}.pure-button[data-v-f8523108]:hover{background:none;background-color:#29b474;color:#fff}.pure-button.full-width[data-v-f8523108]{display:block;margin-bottom:10px}.pure-button.pure-button-primary[data-v-f8523108]{background-color:#29b474;color:#fff}.pure-button.pure-button-primary[data-v-f8523108]:hover{background-color:#25a268}.pure-button.pure-button-white[data-v-f8523108]{background-color:transparent;border-color:#fff;color:#fff}.pure-button.pure-button-white[data-v-f8523108]:hover{background-color:rgba(0,0,0,.1)}.pure-button.pure-button-success[data-v-f8523108]{background-color:#29b474;color:#fff}.pure-button.pure-button-success[data-v-f8523108]:hover{background-color:#25a268}.pure-button.pure-button-twitter[data-v-f8523108]{border-radius:25px;background-color:#4099ff;border:none;color:#fff;line-height:50px;padding:0 30px}.pure-button.pure-button-twitter[data-v-f8523108]:hover{background-color:#2088ff}.pure-button.pure-button-subtle[data-v-f8523108]{background-color:transparent;border-color:#ccc;color:#666}.pure-button.pure-button-subtle[data-v-f8523108]:hover{background-color:#e1e1e1;color:#444}.pure-button.pure-button-text[data-v-f8523108]{border-color:transparent}.pure-button.pure-button-homework[data-v-f8523108]{background-color:transparent;border-color:#fd3c51;color:#fd3c51}.pure-button.pure-button-homework[data-v-f8523108]:hover{background-color:#fd3c51;color:#fff}body[data-v-f8523108],html[data-v-f8523108]{font-family:Avenir,Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}.pull-left[data-v-f8523108]{float:left}.pull-right[data-v-f8523108]{float:right}.clearfix[data-v-f8523108]{clear:both;float:none}.fa-icon[data-v-f8523108]{width:auto;height:1em}.no-margin[data-v-f8523108]{margin:0!important}.no-padding[data-v-f8523108]{padding:0!important}.background-white[data-v-f8523108]{background-color:#fff!important}.text-white[data-v-f8523108]{color:#fff}.fade-enter-active[data-v-f8523108],.fade-leave-active[data-v-f8523108]{transition:opacity .2s}.fade-enter[data-v-f8523108],.fade-leave-to[data-v-f8523108]{opacity:0}.fade-enter-to[data-v-f8523108],.fade-leave[data-v-f8523108]{opacity:1}.main-container[data-v-f8523108]{border-radius:4px;position:relative}.main-container.main-container-padded[data-v-f8523108]{padding:20px}.content-block[data-v-f8523108]{border-radius:4px;padding:20px;margin:20px 0 0}.content-block.white-block[data-v-f8523108]{background-color:#fff}.icon-margin[data-v-f8523108]{margin:0 5px}.course-content-wrapper[data-v-f8523108]{margin-bottom:10px}.course-content-wrapper[data-v-f8523108]:last-child{margin-bottom:0}.course-content-wrapper .course-content-group .course-content[data-v-f8523108]{border-radius:4px;box-shadow:0 0 10px 5px rgba(0,0,0,.01);-moz-box-shadow:0 0 10px 5px rgba(0,0,0,.01);-webkit-box-shadow:0 0 10px 5px rgba(0,0,0,.01);background-color:#fff;margin:20px 0 0;min-height:100px;padding:0;position:relative}@media (max-width:800px){.course-content-wrapper .course-content-group .course-content[data-v-f8523108]{border-radius:0;margin:20px 0 0}}.course-content-wrapper .course-content-group .course-content h5.content-subheader[data-v-f8523108]{margin:0;padding:0;color:#444;font-weight:300}.course-content-wrapper .course-content-group .course-content p.content-description[data-v-f8523108]{margin:0;padding:0;color:#666;font-size:1em}.course-content-wrapper .course-content-group .course-content a[data-v-f8523108]{text-decoration:none}.course-content-wrapper .course-content-group .course-content .course-content--header[data-v-f8523108]{background-color:transparent;overflow:hidden;padding:20px 20px 10px}.course-content-wrapper .course-content-group .course-content .course-content--header h1.content-title[data-v-f8523108]{margin:0;padding:0;color:#444;font-size:1.3em;font-weight:700}.course-content-wrapper .course-content-group .course-content .course-content--header.block[data-v-f8523108]{background-color:#29b474;padding:30px;text-align:center}.course-content-wrapper .course-content-group .course-content .course-content--header.block h1.content-title[data-v-f8523108]{color:#fff;font-size:2em;font-weight:700;margin-bottom:10px}.course-content-wrapper .course-content-group .course-content .course-content--header.block p.content-description[data-v-f8523108]{color:#fff;margin:0 auto}.course-content-wrapper .course-content-group .course-content .course-content--body[data-v-f8523108]{overflow:hidden;padding:0 20px 10px}.course-content-wrapper .course-content-group .course-content .course-content--body h1[data-v-f8523108],.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-f8523108],.course-content-wrapper .course-content-group .course-content .course-content--body h3[data-v-f8523108],.course-content-wrapper .course-content-group .course-content .course-content--body h4[data-v-f8523108],.course-content-wrapper .course-content-group .course-content .course-content--body h5[data-v-f8523108]{font-weight:300}.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-f8523108]{color:#444;font-size:1.3em;font-weight:700}.course-content-wrapper .course-content-group .course-content .course-content--footer[data-v-f8523108]{padding:20px}.course-content-wrapper .course-content-group.course-content-group--question[data-v-f8523108]{border-radius:6px;background-color:hsla(0,0%,100%,.15);padding:15px;margin-top:10px}.course-content-wrapper .course-content-group.course-content-group--question .course-content[data-v-f8523108]{margin:0}#fourcorners-banner[data-v-f8523108]{border-radius:6px;background-color:#161616;background:url(" + __webpack_require__(605) + ");background-size:cover;background-repeat:no-repeat;background-position:50%;background-position:100%;margin-top:20px;overflow:hidden;position:relative;text-align:center}@media (max-width:800px){#fourcorners-banner[data-v-f8523108]{border-radius:0;margin:20px 0 0}}#fourcorners-banner[data-v-f8523108]:after{transition:all .3s ease;top:0;bottom:0;left:0;right:0;background-color:rgba(0,0,0,.5);content:\"\";position:absolute;pointer-events:none;z-index:0}#fourcorners-banner #tile-wrapper[data-v-f8523108]{transition:all .3s ease;transition-duration:1s;height:100px;overflow:visible;padding:50px 30px;position:relative;z-index:1}#fourcorners-banner #tile-wrapper h1[data-v-f8523108],#fourcorners-banner #tile-wrapper h2[data-v-f8523108],#fourcorners-banner #tile-wrapper h3[data-v-f8523108],#fourcorners-banner #tile-wrapper h4[data-v-f8523108],#fourcorners-banner #tile-wrapper h5[data-v-f8523108],#fourcorners-banner #tile-wrapper p[data-v-f8523108]{margin:0;padding:0;color:#fff;margin:0 auto;max-width:460px;padding:0 5px}#fourcorners-banner #tile-wrapper h1[data-v-f8523108]{padding:0 20px 10px}#fourcorners-banner #tile-wrapper p[data-v-f8523108]{line-height:20px;margin:0 auto;margin-bottom:10px;min-height:40px;max-height:60px;overflow:hidden}#fourcorners-banner #tile-wrapper .pure-button[data-v-f8523108]{background-color:hsla(0,0%,100%,.1);border-color:transparent;color:#fff;margin:10px auto 5px}#fourcorners-banner #tile-wrapper .pure-button[data-v-f8523108]:hover{background-color:#fff;color:#161616}#fourcorners-banner #tile-wrapper .tile#info-tile img[data-v-f8523108]{padding:10px}#fourcorners-banner #tile-wrapper .tile#info-tile .buttons .pure-button[data-v-f8523108]{display:inline-block;margin:0 5px}#fourcorners-banner #tile-wrapper .tile#info-tile .fa-icon[data-v-f8523108]{color:#fff;font-size:3em;margin:0 auto}#fourcorners-banner #tile-wrapper #corners .corner[data-v-f8523108]{transition:all .3s ease;cursor:pointer;opacity:0;position:absolute;height:50px;width:50px}#fourcorners-banner #tile-wrapper #corners .corner[data-v-f8523108]:hover{opacity:1}#fourcorners-banner #tile-wrapper #corners .corner#corner-top-left[data-v-f8523108]{border-top:8px solid #fff;border-left:8px solid #fff;left:15px;top:15px}#fourcorners-banner #tile-wrapper #corners .corner#corner-top-right[data-v-f8523108]{border-top:8px solid #fff;border-right:8px solid #fff;right:15px;top:15px}#fourcorners-banner #tile-wrapper #corners .corner#corner-bottom-left[data-v-f8523108]{border-bottom:8px solid #fff;border-left:8px solid #fff;left:15px;bottom:15px}#fourcorners-banner #tile-wrapper #corners .corner#corner-bottom-right[data-v-f8523108]{border-bottom:8px solid #fff;border-right:8px solid #fff;right:15px;bottom:15px;opacity:.3}#fourcorners-banner #tile-wrapper #corners .corner#corner-bottom-right[data-v-f8523108]:hover{opacity:1}#fourcorners-banner #tile-wrapper #corners .corner#corner-top-left[data-v-f8523108]{transition-delay:.3s}#fourcorners-banner #tile-wrapper #corners .corner#corner-top-right[data-v-f8523108]{transition-delay:.1s}#fourcorners-banner #tile-wrapper #corners .corner#corner-bottom-left[data-v-f8523108]{transition-delay:.5s}#fourcorners-banner #tile-wrapper #corners .corner.active[data-v-f8523108]{border-color:#0cf!important;opacity:1!important}#fourcorners-banner.expanded[data-v-f8523108]:after{top:0;bottom:0;left:0;right:0;background-color:rgba(0,0,0,.8)}#fourcorners-banner.expanded #tile-wrapper[data-v-f8523108]{padding:90px 40px 120px}#fourcorners-banner.expanded #tile-wrapper #corners .corner[data-v-f8523108]{opacity:.3;transition-delay:0s!important}#fourcorners-banner.expanded #tile-wrapper #corners .corner[data-v-f8523108]:hover{opacity:1}", "", {"version":3,"sources":["/root/connectedacademy/src/components/conversation/FourCorners.vue"],"names":[],"mappings":"AAsIA,8BACE,wBAA0B,AAC1B,kBAAmB,AACnB,gBAAiB,AACjB,6BAA8B,AAC9B,yBAA0B,AAC1B,aAAe,CAChB,AACD,oCACE,gBAAiB,AACjB,yBAA0B,AAC1B,UAAY,CACb,AACD,yCACE,cAAe,AACf,kBAAoB,CACrB,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,gDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,sDACE,+BAAkC,CACnC,AACD,kDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,wDACE,wBAA0B,CAC3B,AACD,kDACE,mBAAoB,AACpB,yBAA0B,AAC1B,YAAa,AACb,WAAY,AACZ,iBAAkB,AAClB,cAAgB,CACjB,AACD,wDACE,wBAA0B,CAC3B,AACD,iDACE,6BAA8B,AAC9B,kBAAmB,AACnB,UAAY,CACb,AACD,uDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,+CACE,wBAA0B,CAC3B,AACD,mDACE,6BAA8B,AAC9B,qBAAsB,AACtB,aAAe,CAChB,AACD,yDACE,yBAA0B,AAC1B,UAAY,CACb,AACD,4CAEE,8CAAoD,AACpD,mCAAoC,AACpC,iCAAmC,CACpC,AACD,4BACE,UAAY,CACb,AACD,6BACE,WAAa,CACd,AACD,2BACE,WAAY,AACZ,UAAY,CACb,AACD,0BACE,WAAY,AACZ,UAAY,CACb,AACD,4BACE,kBAAqB,CACtB,AACD,6BACE,mBAAsB,CACvB,AACD,mCACE,+BAAkC,CACnC,AACD,6BACE,UAAY,CACb,AACD,wEAEE,sBAAyB,CAC1B,AACD,6DAEE,SAAW,CACZ,AACD,6DAEE,SAAW,CACZ,AACD,iCACE,kBAAmB,AACnB,iBAAmB,CACpB,AACD,uDACE,YAAc,CACf,AACD,gCACE,kBAAmB,AACnB,aAAc,AACd,eAAmB,CACpB,AACD,4CACE,qBAAuB,CACxB,AACD,8BACE,YAAc,CACf,AACD,yCACE,kBAAoB,CACrB,AACD,oDACE,eAAiB,CAClB,AACD,+EACE,kBAAmB,AACnB,wCAA0C,AAC1C,6CAA+C,AAC/C,gDAAkD,AAClD,sBAAuB,AACvB,gBAAmB,AACnB,iBAAkB,AAClB,UAAW,AACX,iBAAmB,CACpB,AACD,yBACA,+EACI,gBAAiB,AACjB,eAAmB,CACtB,CACA,AACD,oGACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,eAAiB,CAClB,AACD,qGACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,aAAe,CAChB,AACD,iFACE,oBAAsB,CACvB,AACD,uGACE,6BAA8B,AAC9B,gBAAiB,AACjB,sBAA6B,CAC9B,AACD,wHACE,SAAU,AACV,UAAW,AACX,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,6GACE,yBAA0B,AAC1B,aAAc,AACd,iBAAmB,CACpB,AACD,8HACE,WAAY,AACZ,cAAe,AACf,gBAAkB,AAClB,kBAAoB,CACrB,AACD,mIACE,WAAY,AACZ,aAAe,CAChB,AACD,qGACE,gBAAiB,AACjB,mBAA4B,CAC7B,AACD,wgBAKE,eAAiB,CAClB,AACD,wGACE,WAAY,AACZ,gBAAiB,AACjB,eAAkB,CACnB,AACD,uGACE,YAAc,CACf,AACD,8FACE,kBAAmB,AACnB,qCAAyC,AACzC,aAAc,AACd,eAAiB,CAClB,AACD,8GACE,QAAU,CACX,AACD,qCACE,kBAAmB,AACnB,yBAA0B,AAC1B,yCAAgD,AAChD,sBAAuB,AACvB,4BAA6B,AAC7B,wBAA4B,AAC5B,yBAAkC,AAClC,gBAAiB,AACjB,gBAAiB,AACjB,kBAAmB,AACnB,iBAAmB,CACpB,AACD,yBACA,qCACI,gBAAiB,AACjB,eAAmB,CACtB,CACA,AACD,2CACE,wBAA0B,AAC1B,MAAO,AACP,SAAU,AACV,OAAQ,AACR,QAAS,AACT,gCAAkC,AAClC,WAAY,AACZ,kBAAmB,AACnB,oBAAqB,AACrB,SAAW,CACZ,AACD,mDACE,wBAA0B,AAC1B,uBAAwB,AACxB,aAAc,AACd,iBAAkB,AAClB,kBAAmB,AACnB,kBAAmB,AACnB,SAAW,CACZ,AACD,mUAME,SAAU,AACV,UAAW,AACX,WAAY,AACZ,cAAe,AACf,gBAAiB,AACjB,aAAe,CAChB,AACD,sDACE,mBAA0B,CAC3B,AACD,qDACE,iBAAkB,AAClB,cAAe,AACf,mBAAoB,AACpB,gBAAiB,AACjB,gBAAiB,AACjB,eAAiB,CAClB,AACD,gEACE,oCAAwC,AACxC,yBAA0B,AAC1B,WAAY,AACZ,oBAA2B,CAC5B,AACD,sEACE,sBAAuB,AACvB,aAAe,CAChB,AACD,uEACE,YAAc,CACf,AACD,yFACE,qBAAsB,AACtB,YAAc,CACf,AACD,4EACE,WAAY,AACZ,cAAe,AACf,aAAe,CAChB,AACD,oEACE,wBAA0B,AAC1B,eAAgB,AAChB,UAAW,AACX,kBAAmB,AACnB,YAAa,AACb,UAAY,CACb,AACD,0EACE,SAAW,CACZ,AACD,oFACE,0BAA2B,AAC3B,2BAA4B,AAC5B,UAAW,AACX,QAAU,CACX,AACD,qFACE,0BAA2B,AAC3B,4BAA6B,AAC7B,WAAY,AACZ,QAAU,CACX,AACD,uFACE,6BAA8B,AAC9B,2BAA4B,AAC5B,UAAW,AACX,WAAa,CACd,AACD,wFACE,6BAA8B,AAC9B,4BAA6B,AAC7B,WAAY,AACZ,YAAa,AACb,UAAa,CACd,AACD,8FACE,SAAW,CACZ,AACD,oFACE,oBAAuB,CACxB,AACD,qFACE,oBAAuB,CACxB,AACD,uFACE,oBAAuB,CACxB,AACD,2EACE,4BAA8B,AAC9B,mBAAsB,CACvB,AACD,oDACE,MAAO,AACP,SAAU,AACV,OAAQ,AACR,QAAS,AACT,+BAAkC,CACnC,AACD,4DACE,uBAA8B,CAC/B,AACD,6EACE,WAAa,AACb,6BAAgC,CACjC,AACD,mFACE,SAAW,CACZ","file":"FourCorners.vue","sourcesContent":["\n.pure-button[data-v-f8523108] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-f8523108]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-f8523108] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-f8523108] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-f8523108]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-f8523108] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-f8523108]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-f8523108] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-f8523108]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-f8523108] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-f8523108]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-f8523108] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-f8523108]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-f8523108] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-f8523108] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-f8523108]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-f8523108],\nbody[data-v-f8523108] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-f8523108] {\n  float: left;\n}\n.pull-right[data-v-f8523108] {\n  float: right;\n}\n.clearfix[data-v-f8523108] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-f8523108] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-f8523108] {\n  margin: 0 !important;\n}\n.no-padding[data-v-f8523108] {\n  padding: 0 !important;\n}\n.background-white[data-v-f8523108] {\n  background-color: #fff !important;\n}\n.text-white[data-v-f8523108] {\n  color: #fff;\n}\n.fade-enter-active[data-v-f8523108],\n.fade-leave-active[data-v-f8523108] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-f8523108],\n.fade-leave-to[data-v-f8523108] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-f8523108],\n.fade-leave[data-v-f8523108] {\n  opacity: 1;\n}\n.main-container[data-v-f8523108] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-f8523108] {\n  padding: 20px;\n}\n.content-block[data-v-f8523108] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-f8523108] {\n  background-color: #fff;\n}\n.icon-margin[data-v-f8523108] {\n  margin: 0 5px;\n}\n.pure-button[data-v-f8523108] {\n  transition: all 0.3s ease;\n  border-radius: 4px;\n  background: none;\n  background-color: transparent;\n  border: #29b474 1px solid;\n  color: #29b474;\n}\n.pure-button[data-v-f8523108]:hover {\n  background: none;\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.full-width[data-v-f8523108] {\n  display: block;\n  margin-bottom: 10px;\n}\n.pure-button.pure-button-primary[data-v-f8523108] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-primary[data-v-f8523108]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-white[data-v-f8523108] {\n  background-color: transparent;\n  border-color: #fff;\n  color: #fff;\n}\n.pure-button.pure-button-white[data-v-f8523108]:hover {\n  background-color: rgba(0,0,0,0.1);\n}\n.pure-button.pure-button-success[data-v-f8523108] {\n  background-color: #29b474;\n  color: #fff;\n}\n.pure-button.pure-button-success[data-v-f8523108]:hover {\n  background-color: #25a268;\n}\n.pure-button.pure-button-twitter[data-v-f8523108] {\n  border-radius: 25px;\n  background-color: #4099ff;\n  border: none;\n  color: #fff;\n  line-height: 50px;\n  padding: 0 30px;\n}\n.pure-button.pure-button-twitter[data-v-f8523108]:hover {\n  background-color: #2088ff;\n}\n.pure-button.pure-button-subtle[data-v-f8523108] {\n  background-color: transparent;\n  border-color: #ccc;\n  color: #666;\n}\n.pure-button.pure-button-subtle[data-v-f8523108]:hover {\n  background-color: #e1e1e1;\n  color: #444;\n}\n.pure-button.pure-button-text[data-v-f8523108] {\n  border-color: transparent;\n}\n.pure-button.pure-button-homework[data-v-f8523108] {\n  background-color: transparent;\n  border-color: #fd3c51;\n  color: #fd3c51;\n}\n.pure-button.pure-button-homework[data-v-f8523108]:hover {\n  background-color: #fd3c51;\n  color: #fff;\n}\nhtml[data-v-f8523108],\nbody[data-v-f8523108] {\n  font-family: 'Avenir', Helvetica, Arial, sans-serif;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale;\n}\n.pull-left[data-v-f8523108] {\n  float: left;\n}\n.pull-right[data-v-f8523108] {\n  float: right;\n}\n.clearfix[data-v-f8523108] {\n  clear: both;\n  float: none;\n}\n.fa-icon[data-v-f8523108] {\n  width: auto;\n  height: 1em;\n}\n.no-margin[data-v-f8523108] {\n  margin: 0 !important;\n}\n.no-padding[data-v-f8523108] {\n  padding: 0 !important;\n}\n.background-white[data-v-f8523108] {\n  background-color: #fff !important;\n}\n.text-white[data-v-f8523108] {\n  color: #fff;\n}\n.fade-enter-active[data-v-f8523108],\n.fade-leave-active[data-v-f8523108] {\n  transition: opacity 0.2s;\n}\n.fade-enter[data-v-f8523108],\n.fade-leave-to[data-v-f8523108] {\n  opacity: 0;\n}\n.fade-enter-to[data-v-f8523108],\n.fade-leave[data-v-f8523108] {\n  opacity: 1;\n}\n.main-container[data-v-f8523108] {\n  border-radius: 4px;\n  position: relative;\n}\n.main-container.main-container-padded[data-v-f8523108] {\n  padding: 20px;\n}\n.content-block[data-v-f8523108] {\n  border-radius: 4px;\n  padding: 20px;\n  margin: 20px 0 0 0;\n}\n.content-block.white-block[data-v-f8523108] {\n  background-color: #fff;\n}\n.icon-margin[data-v-f8523108] {\n  margin: 0 5px;\n}\n.course-content-wrapper[data-v-f8523108] {\n  margin-bottom: 10px;\n}\n.course-content-wrapper[data-v-f8523108]:last-child {\n  margin-bottom: 0;\n}\n.course-content-wrapper .course-content-group .course-content[data-v-f8523108] {\n  border-radius: 4px;\n  box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -moz-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  -webkit-box-shadow: 0 0 10px 5px rgba(0,0,0,0.01);\n  background-color: #fff;\n  margin: 20px 0 0 0;\n  min-height: 100px;\n  padding: 0;\n  position: relative;\n}\n@media (max-width: 800px) {\n.course-content-wrapper .course-content-group .course-content[data-v-f8523108] {\n    border-radius: 0;\n    margin: 20px 0 0 0;\n}\n}\n.course-content-wrapper .course-content-group .course-content h5.content-subheader[data-v-f8523108] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  font-weight: 300;\n}\n.course-content-wrapper .course-content-group .course-content p.content-description[data-v-f8523108] {\n  margin: 0;\n  padding: 0;\n  color: #666;\n  font-size: 1em;\n}\n.course-content-wrapper .course-content-group .course-content a[data-v-f8523108] {\n  text-decoration: none;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header[data-v-f8523108] {\n  background-color: transparent;\n  overflow: hidden;\n  padding: 20px 20px 10px 20px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header h1.content-title[data-v-f8523108] {\n  margin: 0;\n  padding: 0;\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block[data-v-f8523108] {\n  background-color: #29b474;\n  padding: 30px;\n  text-align: center;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block h1.content-title[data-v-f8523108] {\n  color: #fff;\n  font-size: 2em;\n  font-weight: bold;\n  margin-bottom: 10px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--header.block p.content-description[data-v-f8523108] {\n  color: #fff;\n  margin: 0 auto;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body[data-v-f8523108] {\n  overflow: hidden;\n  padding: 0px 20px 10px 20px;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body h1[data-v-f8523108],\n.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-f8523108],\n.course-content-wrapper .course-content-group .course-content .course-content--body h3[data-v-f8523108],\n.course-content-wrapper .course-content-group .course-content .course-content--body h4[data-v-f8523108],\n.course-content-wrapper .course-content-group .course-content .course-content--body h5[data-v-f8523108] {\n  font-weight: 300;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--body h2[data-v-f8523108] {\n  color: #444;\n  font-size: 1.3em;\n  font-weight: bold;\n}\n.course-content-wrapper .course-content-group .course-content .course-content--footer[data-v-f8523108] {\n  padding: 20px;\n}\n.course-content-wrapper .course-content-group.course-content-group--question[data-v-f8523108] {\n  border-radius: 6px;\n  background-color: rgba(255,255,255,0.15);\n  padding: 15px;\n  margin-top: 10px;\n}\n.course-content-wrapper .course-content-group.course-content-group--question .course-content[data-v-f8523108] {\n  margin: 0;\n}\n#fourcorners-banner[data-v-f8523108] {\n  border-radius: 6px;\n  background-color: #161616;\n  background: url(\"../../assets/images/lake.jpg\");\n  background-size: cover;\n  background-repeat: no-repeat;\n  background-position: center;\n  background-position: center right;\n  margin-top: 20px;\n  overflow: hidden;\n  position: relative;\n  text-align: center;\n}\n@media (max-width: 800px) {\n#fourcorners-banner[data-v-f8523108] {\n    border-radius: 0;\n    margin: 20px 0 0 0;\n}\n}\n#fourcorners-banner[data-v-f8523108]:after {\n  transition: all 0.3s ease;\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(0,0,0,0.5);\n  content: '';\n  position: absolute;\n  pointer-events: none;\n  z-index: 0;\n}\n#fourcorners-banner #tile-wrapper[data-v-f8523108] {\n  transition: all 0.3s ease;\n  transition-duration: 1s;\n  height: 100px;\n  overflow: visible;\n  padding: 50px 30px;\n  position: relative;\n  z-index: 1;\n}\n#fourcorners-banner #tile-wrapper h1[data-v-f8523108],\n#fourcorners-banner #tile-wrapper h2[data-v-f8523108],\n#fourcorners-banner #tile-wrapper h3[data-v-f8523108],\n#fourcorners-banner #tile-wrapper h4[data-v-f8523108],\n#fourcorners-banner #tile-wrapper h5[data-v-f8523108],\n#fourcorners-banner #tile-wrapper p[data-v-f8523108] {\n  margin: 0;\n  padding: 0;\n  color: #fff;\n  margin: 0 auto;\n  max-width: 460px;\n  padding: 0 5px;\n}\n#fourcorners-banner #tile-wrapper h1[data-v-f8523108] {\n  padding: 0 20px 10px 20px;\n}\n#fourcorners-banner #tile-wrapper p[data-v-f8523108] {\n  line-height: 20px;\n  margin: 0 auto;\n  margin-bottom: 10px;\n  min-height: 40px;\n  max-height: 60px;\n  overflow: hidden;\n}\n#fourcorners-banner #tile-wrapper .pure-button[data-v-f8523108] {\n  background-color: rgba(255,255,255,0.1);\n  border-color: transparent;\n  color: #fff;\n  margin: 10px auto 5px auto;\n}\n#fourcorners-banner #tile-wrapper .pure-button[data-v-f8523108]:hover {\n  background-color: #fff;\n  color: #161616;\n}\n#fourcorners-banner #tile-wrapper .tile#info-tile img[data-v-f8523108] {\n  padding: 10px;\n}\n#fourcorners-banner #tile-wrapper .tile#info-tile .buttons .pure-button[data-v-f8523108] {\n  display: inline-block;\n  margin: 0 5px;\n}\n#fourcorners-banner #tile-wrapper .tile#info-tile .fa-icon[data-v-f8523108] {\n  color: #fff;\n  font-size: 3em;\n  margin: 0 auto;\n}\n#fourcorners-banner #tile-wrapper #corners .corner[data-v-f8523108] {\n  transition: all 0.3s ease;\n  cursor: pointer;\n  opacity: 0;\n  position: absolute;\n  height: 50px;\n  width: 50px;\n}\n#fourcorners-banner #tile-wrapper #corners .corner[data-v-f8523108]:hover {\n  opacity: 1;\n}\n#fourcorners-banner #tile-wrapper #corners .corner#corner-top-left[data-v-f8523108] {\n  border-top: #fff 8px solid;\n  border-left: #fff 8px solid;\n  left: 15px;\n  top: 15px;\n}\n#fourcorners-banner #tile-wrapper #corners .corner#corner-top-right[data-v-f8523108] {\n  border-top: #fff 8px solid;\n  border-right: #fff 8px solid;\n  right: 15px;\n  top: 15px;\n}\n#fourcorners-banner #tile-wrapper #corners .corner#corner-bottom-left[data-v-f8523108] {\n  border-bottom: #fff 8px solid;\n  border-left: #fff 8px solid;\n  left: 15px;\n  bottom: 15px;\n}\n#fourcorners-banner #tile-wrapper #corners .corner#corner-bottom-right[data-v-f8523108] {\n  border-bottom: #fff 8px solid;\n  border-right: #fff 8px solid;\n  right: 15px;\n  bottom: 15px;\n  opacity: 0.3;\n}\n#fourcorners-banner #tile-wrapper #corners .corner#corner-bottom-right[data-v-f8523108]:hover {\n  opacity: 1;\n}\n#fourcorners-banner #tile-wrapper #corners .corner#corner-top-left[data-v-f8523108] {\n  transition-delay: 0.3s;\n}\n#fourcorners-banner #tile-wrapper #corners .corner#corner-top-right[data-v-f8523108] {\n  transition-delay: 0.1s;\n}\n#fourcorners-banner #tile-wrapper #corners .corner#corner-bottom-left[data-v-f8523108] {\n  transition-delay: 0.5s;\n}\n#fourcorners-banner #tile-wrapper #corners .corner.active[data-v-f8523108] {\n  border-color: #0cf !important;\n  opacity: 1 !important;\n}\n#fourcorners-banner.expanded[data-v-f8523108]:after {\n  top: 0;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  background-color: rgba(0,0,0,0.8);\n}\n#fourcorners-banner.expanded #tile-wrapper[data-v-f8523108] {\n  padding: 90px 40px 120px 40px;\n}\n#fourcorners-banner.expanded #tile-wrapper #corners .corner[data-v-f8523108] {\n  opacity: 0.3;\n  transition-delay: 0s !important;\n}\n#fourcorners-banner.expanded #tile-wrapper #corners .corner[data-v-f8523108]:hover {\n  opacity: 1;\n}"],"sourceRoot":""}]);

// exports


/***/ }),
/* 720 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g;

module.exports = function (str) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	return str.replace(matchOperatorsRe, '\\$&');
};


/***/ }),
/* 721 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__);


__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default.a.register({"check-circle":{"width":1536,"height":1792,"paths":[{"d":"M1284 734q0-28-18-46l-91-90q-19-19-45-19t-45 19l-408 407-226-226q-19-19-45-19t-45 19l-91 90q-18 18-18 46 0 27 18 45l362 362q19 19 45 19 27 0 46-19l543-543q18-18 18-45zM1536 896q0 209-103 385.5t-279.5 279.5-385.5 103-385.5-103-279.5-279.5-103-385.5 103-385.5 279.5-279.5 385.5-103 385.5 103 279.5 279.5 103 385.5z"}]}})


/***/ }),
/* 722 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__);


__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default.a.register({"heart":{"width":1792,"height":1792,"paths":[{"d":"M896 1664q-26 0-44-18l-624-602q-10-8-27.5-26t-55.5-65.5-68-97.5-53.5-121-23.5-138q0-220 127-344t351-124q62 0 126.5 21.5t120 58 95.5 68.5 76 68q36-36 76-68t95.5-68.5 120-58 126.5-21.5q224 0 351 124t127 344q0 221-229 450l-623 600q-18 18-44 18z"}]}})


/***/ }),
/* 723 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__);


__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default.a.register({"info":{"width":640,"height":1792,"paths":[{"d":"M640 1344v128q0 26-19 45t-45 19h-512q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64v-384h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h384q26 0 45 19t19 45v576h64q26 0 45 19t19 45zM512 192v192q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-192q0-26 19-45t45-19h256q26 0 45 19t19 45z"}]}})


/***/ }),
/* 724 */,
/* 725 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__);


__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default.a.register({"quote-right":{"width":1664,"height":1792,"paths":[{"d":"M768 320v704q0 104-40.5 198.5t-109.5 163.5-163.5 109.5-198.5 40.5h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64q106 0 181-75t75-181v-32q0-40-28-68t-68-28h-224q-80 0-136-56t-56-136v-384q0-80 56-136t136-56h384q80 0 136 56t56 136zM1664 320v704q0 104-40.5 198.5t-109.5 163.5-163.5 109.5-198.5 40.5h-64q-26 0-45-19t-19-45v-128q0-26 19-45t45-19h64q106 0 181-75t75-181v-32q0-40-28-68t-68-28h-224q-80 0-136-56t-56-136v-384q0-80 56-136t136-56h384q80 0 136 56t56 136z"}]}})


/***/ }),
/* 726 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__);


__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default.a.register({"reply":{"width":1792,"height":1792,"paths":[{"d":"M1792 1120q0 166-127 451-3 7-10.5 24t-13.5 30-13 22q-12 17-28 17-15 0-23.5-10t-8.5-25q0-9 2.5-26.5t2.5-23.5q5-68 5-123 0-101-17.5-181t-48.5-138.5-80-101-105.5-69.5-133-42.5-154-21.5-175.5-6h-224v256q0 26-19 45t-45 19-45-19l-512-512q-19-19-19-45t19-45l512-512q19-19 45-19t45 19 19 45v256h224q713 0 875 403 53 134 53 333z"}]}})


/***/ }),
/* 727 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue__);


__WEBPACK_IMPORTED_MODULE_0__components_Icon_vue___default.a.register({"retweet":{"width":1920,"height":1792,"paths":[{"d":"M1280 1504q0 13-9.5 22.5t-22.5 9.5h-960q-8 0-13.5-2t-9-7-5.5-8-3-11.5-1-11.5v-13-11-160-416h-192q-26 0-45-19t-19-45q0-24 15-41l320-384q19-22 49-22t49 22l320 384q15 17 15 41 0 26-19 45t-45 19h-192v384h576q16 0 25 11l160 192q7 10 7 21zM1920 1088q0 24-15 41l-320 384q-20 23-49 23t-49-23l-320-384q-15-17-15-41 0-26 19-45t45-19h192v-384h-576q-16 0-25-12l-160-192q-7-9-7-20 0-13 9.5-22.5t22.5-9.5h960q8 0 13.5 2t9 7 5.5 8 3 11.5 1 11.5v13 11 160 416h192q26 0 45 19t19 45z"}]}})


/***/ }),
/* 728 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(678);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("3112baa2", content, true);

/***/ }),
/* 729 */,
/* 730 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(680);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("17d6e1b0", content, true);

/***/ }),
/* 731 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(681);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("2d13f23d", content, true);

/***/ }),
/* 732 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(682);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("1751d4ca", content, true);

/***/ }),
/* 733 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(683);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("5ae8e32a", content, true);

/***/ }),
/* 734 */,
/* 735 */,
/* 736 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(686);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("012934a9", content, true);

/***/ }),
/* 737 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(687);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("babab504", content, true);

/***/ }),
/* 738 */,
/* 739 */,
/* 740 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(690);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("ea2e7ce6", content, true);

/***/ }),
/* 741 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(691);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("5b037ba0", content, true);

/***/ }),
/* 742 */,
/* 743 */,
/* 744 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(694);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("4746fc7d", content, true);

/***/ }),
/* 745 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(695);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("89ee17a8", content, true);

/***/ }),
/* 746 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(696);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("6097e959", content, true);

/***/ }),
/* 747 */,
/* 748 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(698);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("3e5f6b2a", content, true);

/***/ }),
/* 749 */,
/* 750 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(700);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("07fef3bc", content, true);

/***/ }),
/* 751 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(701);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("a696b006", content, true);

/***/ }),
/* 752 */,
/* 753 */,
/* 754 */,
/* 755 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(705);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("cfc63c66", content, true);

/***/ }),
/* 756 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(706);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("6f073128", content, true);

/***/ }),
/* 757 */,
/* 758 */,
/* 759 */,
/* 760 */,
/* 761 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(711);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("734cf1de", content, true);

/***/ }),
/* 762 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(712);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("6b847814", content, true);

/***/ }),
/* 763 */,
/* 764 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(714);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("22b2d068", content, true);

/***/ }),
/* 765 */,
/* 766 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(716);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("2f5ce7f6", content, true);

/***/ }),
/* 767 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(717);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("2ac4226b", content, true);

/***/ }),
/* 768 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(718);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("c302c8aa", content, true);

/***/ }),
/* 769 */
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(719);
if(typeof content === 'string') content = [[module.i, content, '']];
if(content.locals) module.exports = content.locals;
// add the styles to the DOM
var update = __webpack_require__(469)("69938816", content, true);

/***/ }),
/* 770 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var arrayUniq = __webpack_require__(616);
var urlRegex = __webpack_require__(798);
var normalizeUrl = __webpack_require__(778);

module.exports = function (str, opts) {
	var urls = str.match(urlRegex());

	if (!urls) {
		return [];
	}

	return arrayUniq(urls.map(function (url) {
		return normalizeUrl(url.trim().replace(/\.*$/, ''), opts);
	}));
};


/***/ }),
/* 771 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var arrayUnique = __webpack_require__(616);

module.exports = function (str, opts) {
	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	opts = opts || {};
	opts.unique = opts.unique || false;

	var users = str.match(/@[a-zA-Z0-9_-\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u00FF]+/igm);

	if (!users) {
		return [];
	}

	if (opts.unique && opts.nameOnly) {
		return arrayUnique(
			users.map(function (user) {
				return user.replace(/^@/, '');
			})
		);
	}

	if (opts.unique) {
		return arrayUnique(users);
	}

	if (opts.nameOnly) {
		return users.map(function (user) {
			return user.replace(/^@/, '');
		});
	}
	return users;
};


/***/ }),
/* 772 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var v4 = '(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])(?:\\.(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])){3}';
var v6 = '(?:(?:[0-9a-fA-F:]){1,4}(?:(?::(?:[0-9a-fA-F]){1,4}|:)){2,7})+';

var ip = module.exports = function (opts) {
	opts = opts || {};
	return opts.exact ? new RegExp('(?:^' + v4 + '$)|(?:^' + v6 + '$)') :
	                    new RegExp('(?:' + v4 + ')|(?:' + v6 + ')', 'g');
};

ip.v4 = function (opts) {
	opts = opts || {};
	return opts.exact ? new RegExp('^' + v4 + '$') : new RegExp(v4, 'g');
};

ip.v6 = function (opts) {
	opts = opts || {};
	return opts.exact ? new RegExp('^' + v6 + '$') : new RegExp(v6, 'g');
};


/***/ }),
/* 773 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var toString = Object.prototype.toString;

module.exports = function (x) {
	var prototype;
	return toString.call(x) === '[object Object]' && (prototype = Object.getPrototypeOf(x), prototype === null || prototype === Object.getPrototypeOf({}));
};


/***/ }),
/* 774 */
/***/ (function(module, exports, __webpack_require__) {

var eq = __webpack_require__(74),
    isArrayLike = __webpack_require__(71),
    isIndex = __webpack_require__(73),
    isObject = __webpack_require__(17);

/**
 * Checks if the given arguments are from an iteratee call.
 *
 * @private
 * @param {*} value The potential iteratee value argument.
 * @param {*} index The potential iteratee index or key argument.
 * @param {*} object The potential iteratee object argument.
 * @returns {boolean} Returns `true` if the arguments are from an iteratee call,
 *  else `false`.
 */
function isIterateeCall(value, index, object) {
  if (!isObject(object)) {
    return false;
  }
  var type = typeof index;
  if (type == 'number'
        ? (isArrayLike(object) && isIndex(index, object.length))
        : (type == 'string' && index in object)
      ) {
    return eq(object[index], value);
  }
  return false;
}

module.exports = isIterateeCall;


/***/ }),
/* 775 */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(618),
    isIterateeCall = __webpack_require__(774),
    toInteger = __webpack_require__(68);

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeCeil = Math.ceil,
    nativeMax = Math.max;

/**
 * Creates an array of elements split into groups the length of `size`.
 * If `array` can't be split evenly, the final chunk will be the remaining
 * elements.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category Array
 * @param {Array} array The array to process.
 * @param {number} [size=1] The length of each chunk
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the new array of chunks.
 * @example
 *
 * _.chunk(['a', 'b', 'c', 'd'], 2);
 * // => [['a', 'b'], ['c', 'd']]
 *
 * _.chunk(['a', 'b', 'c', 'd'], 3);
 * // => [['a', 'b', 'c'], ['d']]
 */
function chunk(array, size, guard) {
  if ((guard ? isIterateeCall(array, size, guard) : size === undefined)) {
    size = 1;
  } else {
    size = nativeMax(toInteger(size), 0);
  }
  var length = array == null ? 0 : array.length;
  if (!length || size < 1) {
    return [];
  }
  var index = 0,
      resIndex = 0,
      result = Array(nativeCeil(length / size));

  while (index < length) {
    result[resIndex++] = baseSlice(array, index, (index += size));
  }
  return result;
}

module.exports = chunk;


/***/ }),
/* 776 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var arrayProto = Array.prototype;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeReverse = arrayProto.reverse;

/**
 * Reverses `array` so that the first element becomes the last, the second
 * element becomes the second to last, and so on.
 *
 * **Note:** This method mutates `array` and is based on
 * [`Array#reverse`](https://mdn.io/Array/reverse).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Array
 * @param {Array} array The array to modify.
 * @returns {Array} Returns `array`.
 * @example
 *
 * var array = [1, 2, 3];
 *
 * _.reverse(array);
 * // => [3, 2, 1]
 *
 * console.log(array);
 * // => [3, 2, 1]
 */
function reverse(array) {
  return array == null ? array : nativeReverse.call(array);
}

module.exports = reverse;


/***/ }),
/* 777 */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(618),
    toInteger = __webpack_require__(68);

/**
 * Creates a slice of `array` with `n` elements taken from the beginning.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @param {number} [n=1] The number of elements to take.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.take([1, 2, 3]);
 * // => [1]
 *
 * _.take([1, 2, 3], 2);
 * // => [1, 2]
 *
 * _.take([1, 2, 3], 5);
 * // => [1, 2, 3]
 *
 * _.take([1, 2, 3], 0);
 * // => []
 */
function take(array, n, guard) {
  if (!(array && array.length)) {
    return [];
  }
  n = (guard || n === undefined) ? 1 : toInteger(n);
  return baseSlice(array, 0, n < 0 ? 0 : n);
}

module.exports = take;


/***/ }),
/* 778 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var url = __webpack_require__(799);
var punycode = __webpack_require__(500);
var queryString = __webpack_require__(779);
var prependHttp = __webpack_require__(783);
var sortKeys = __webpack_require__(787);
var objectAssign = __webpack_require__(604);

var DEFAULT_PORTS = {
	'http:': 80,
	'https:': 443,
	'ftp:': 21
};

// protocols that always contain a `//`` bit
var slashedProtocol = {
	'http': true,
	'https': true,
	'ftp': true,
	'gopher': true,
	'file': true,
	'http:': true,
	'https:': true,
	'ftp:': true,
	'gopher:': true,
	'file:': true
};

function testParameter(name, filters) {
	return filters.some(function (filter) {
		return filter instanceof RegExp ? filter.test(name) : filter === name;
	});
}

module.exports = function (str, opts) {
	opts = objectAssign({
		normalizeProtocol: true,
		normalizeHttps: false,
		stripFragment: true,
		stripWWW: true,
		removeQueryParameters: [/^utm_\w+/i],
		removeTrailingSlash: true,
		removeDirectoryIndex: false
	}, opts);

	if (typeof str !== 'string') {
		throw new TypeError('Expected a string');
	}

	var hasRelativeProtocol = str.indexOf('//') === 0;

	// prepend protocol
	str = prependHttp(str.trim()).replace(/^\/\//, 'http://');

	var urlObj = url.parse(str);

	if (opts.normalizeHttps && urlObj.protocol === 'https:') {
		urlObj.protocol = 'http:';
	}

	if (!urlObj.hostname && !urlObj.pathname) {
		throw new Error('Invalid URL');
	}

	// prevent these from being used by `url.format`
	delete urlObj.host;
	delete urlObj.query;

	// remove fragment
	if (opts.stripFragment) {
		delete urlObj.hash;
	}

	// remove default port
	var port = DEFAULT_PORTS[urlObj.protocol];
	if (Number(urlObj.port) === port) {
		delete urlObj.port;
	}

	// remove duplicate slashes
	if (urlObj.pathname) {
		urlObj.pathname = urlObj.pathname.replace(/\/{2,}/g, '/');
	}

	// decode URI octets
	if (urlObj.pathname) {
		urlObj.pathname = decodeURI(urlObj.pathname);
	}

	// remove directory index
	if (opts.removeDirectoryIndex === true) {
		opts.removeDirectoryIndex = [/^index\.[a-z]+$/];
	}

	if (Array.isArray(opts.removeDirectoryIndex) && opts.removeDirectoryIndex.length) {
		var pathComponents = urlObj.pathname.split('/');
		var lastComponent = pathComponents[pathComponents.length - 1];

		if (testParameter(lastComponent, opts.removeDirectoryIndex)) {
			pathComponents = pathComponents.slice(0, pathComponents.length - 1);
			urlObj.pathname = pathComponents.slice(1).join('/') + '/';
		}
	}

	// resolve relative paths, but only for slashed protocols
	if (slashedProtocol[urlObj.protocol]) {
		var domain = urlObj.protocol + '//' + urlObj.hostname;
		var relative = url.resolve(domain, urlObj.pathname);
		urlObj.pathname = relative.replace(domain, '');
	}

	if (urlObj.hostname) {
		// IDN to Unicode
		urlObj.hostname = punycode.toUnicode(urlObj.hostname).toLowerCase();

		// remove trailing dot
		urlObj.hostname = urlObj.hostname.replace(/\.$/, '');

		// remove `www.`
		if (opts.stripWWW) {
			urlObj.hostname = urlObj.hostname.replace(/^www\./, '');
		}
	}

	// remove URL with empty query string
	if (urlObj.search === '?') {
		delete urlObj.search;
	}

	var queryParameters = queryString.parse(urlObj.search);

	// remove query unwanted parameters
	if (Array.isArray(opts.removeQueryParameters)) {
		for (var key in queryParameters) {
			if (testParameter(key, opts.removeQueryParameters)) {
				delete queryParameters[key];
			}
		}
	}

	// sort query parameters
	urlObj.search = queryString.stringify(sortKeys(queryParameters));

	// decode query parameters
	urlObj.search = decodeURIComponent(urlObj.search);

	// take advantage of many of the Node `url` normalizations
	str = url.format(urlObj);

	// remove ending `/`
	if (opts.removeTrailingSlash || urlObj.pathname === '/') {
		str = str.replace(/\/$/, '');
	}

	// restore relative protocol, if applicable
	if (hasRelativeProtocol && !opts.normalizeProtocol) {
		str = str.replace(/^http:\/\//, '//');
	}

	return str;
};


/***/ }),
/* 779 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var strictUriEncode = __webpack_require__(788);
var objectAssign = __webpack_require__(604);

function encoderForArrayFormat(opts) {
	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, index) {
				return value === null ? [
					encode(key, opts),
					'[',
					index,
					']'
				].join('') : [
					encode(key, opts),
					'[',
					encode(index, opts),
					']=',
					encode(value, opts)
				].join('');
			};

		case 'bracket':
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'[]=',
					encode(value, opts)
				].join('');
			};

		default:
			return function (key, value) {
				return value === null ? encode(key, opts) : [
					encode(key, opts),
					'=',
					encode(value, opts)
				].join('');
			};
	}
}

function parserForArrayFormat(opts) {
	var result;

	switch (opts.arrayFormat) {
		case 'index':
			return function (key, value, accumulator) {
				result = /\[(\d*)\]$/.exec(key);

				key = key.replace(/\[\d*\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				}

				if (accumulator[key] === undefined) {
					accumulator[key] = {};
				}

				accumulator[key][result[1]] = value;
			};

		case 'bracket':
			return function (key, value, accumulator) {
				result = /(\[\])$/.exec(key);
				key = key.replace(/\[\]$/, '');

				if (!result) {
					accumulator[key] = value;
					return;
				} else if (accumulator[key] === undefined) {
					accumulator[key] = [value];
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};

		default:
			return function (key, value, accumulator) {
				if (accumulator[key] === undefined) {
					accumulator[key] = value;
					return;
				}

				accumulator[key] = [].concat(accumulator[key], value);
			};
	}
}

function encode(value, opts) {
	if (opts.encode) {
		return opts.strict ? strictUriEncode(value) : encodeURIComponent(value);
	}

	return value;
}

function keysSorter(input) {
	if (Array.isArray(input)) {
		return input.sort();
	} else if (typeof input === 'object') {
		return keysSorter(Object.keys(input)).sort(function (a, b) {
			return Number(a) - Number(b);
		}).map(function (key) {
			return input[key];
		});
	}

	return input;
}

exports.extract = function (str) {
	return str.split('?')[1] || '';
};

exports.parse = function (str, opts) {
	opts = objectAssign({arrayFormat: 'none'}, opts);

	var formatter = parserForArrayFormat(opts);

	// Create an object with no prototype
	// https://github.com/sindresorhus/query-string/issues/47
	var ret = Object.create(null);

	if (typeof str !== 'string') {
		return ret;
	}

	str = str.trim().replace(/^(\?|#|&)/, '');

	if (!str) {
		return ret;
	}

	str.split('&').forEach(function (param) {
		var parts = param.replace(/\+/g, ' ').split('=');
		// Firefox (pre 40) decodes `%3D` to `=`
		// https://github.com/sindresorhus/query-string/pull/37
		var key = parts.shift();
		var val = parts.length > 0 ? parts.join('=') : undefined;

		// missing `=` should be `null`:
		// http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
		val = val === undefined ? null : decodeURIComponent(val);

		formatter(decodeURIComponent(key), val, ret);
	});

	return Object.keys(ret).sort().reduce(function (result, key) {
		var val = ret[key];
		if (Boolean(val) && typeof val === 'object' && !Array.isArray(val)) {
			// Sort object keys, not values
			result[key] = keysSorter(val);
		} else {
			result[key] = val;
		}

		return result;
	}, Object.create(null));
};

exports.stringify = function (obj, opts) {
	var defaults = {
		encode: true,
		strict: true,
		arrayFormat: 'none'
	};

	opts = objectAssign(defaults, opts);

	var formatter = encoderForArrayFormat(opts);

	return obj ? Object.keys(obj).sort().map(function (key) {
		var val = obj[key];

		if (val === undefined) {
			return '';
		}

		if (val === null) {
			return encode(key, opts);
		}

		if (Array.isArray(val)) {
			var result = [];

			val.slice().forEach(function (val2) {
				if (val2 === undefined) {
					return;
				}

				result.push(formatter(key, val2, result.length));
			});

			return result.join('&');
		}

		return encode(key, opts) + '=' + encode(val, opts);
	}).filter(function (x) {
		return x.length > 0;
	}).join('&') : '';
};


/***/ }),
/* 780 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var keys = Object.keys || __webpack_require__(781);

module.exports = function (obj, opts) {
	if (typeof obj !== 'object' && !Array.isArray(obj)) {
		throw new TypeError('obj-to-property-string expects an object');
	}

	opts = opts || {};

	if ({}.hasOwnProperty.call(opts, 'spacer')) {
		opts.spacer = opts.spacer.length === 0 ? '' : opts.spacer;
	} else {
		opts.spacer = ' ';
	}

	opts.assignment = opts.assignment || '=';
	opts.quoteString = opts.quoteString || '"';
	opts.quoteValues = opts.quoteValues !== false;
	opts.endLineChar = opts.endLineChar || '';
	opts.quoteKeys = opts.quoteKeys === true;

	var str = '';

	keys(obj).forEach(function (key, index, array) {
		str += opts.quoteKeys ? opts.quoteString + key + opts.quoteString : key;
		str += opts.assignment;
		str += opts.quoteValues ? opts.quoteString : '';
		str += obj[key];
		str += opts.quoteValues ? opts.quoteString : '';

		if (++index !== array.length) {
			str += opts.spacer;
			str += opts.endLineChar;
		}
	});

	return str;
};


/***/ }),
/* 781 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// modified from https://github.com/es-shims/es5-shim
var has = Object.prototype.hasOwnProperty;
var toStr = Object.prototype.toString;
var slice = Array.prototype.slice;
var isArgs = __webpack_require__(782);
var isEnumerable = Object.prototype.propertyIsEnumerable;
var hasDontEnumBug = !isEnumerable.call({ toString: null }, 'toString');
var hasProtoEnumBug = isEnumerable.call(function () {}, 'prototype');
var dontEnums = [
	'toString',
	'toLocaleString',
	'valueOf',
	'hasOwnProperty',
	'isPrototypeOf',
	'propertyIsEnumerable',
	'constructor'
];
var equalsConstructorPrototype = function (o) {
	var ctor = o.constructor;
	return ctor && ctor.prototype === o;
};
var excludedKeys = {
	$console: true,
	$external: true,
	$frame: true,
	$frameElement: true,
	$frames: true,
	$innerHeight: true,
	$innerWidth: true,
	$outerHeight: true,
	$outerWidth: true,
	$pageXOffset: true,
	$pageYOffset: true,
	$parent: true,
	$scrollLeft: true,
	$scrollTop: true,
	$scrollX: true,
	$scrollY: true,
	$self: true,
	$webkitIndexedDB: true,
	$webkitStorageInfo: true,
	$window: true
};
var hasAutomationEqualityBug = (function () {
	/* global window */
	if (typeof window === 'undefined') { return false; }
	for (var k in window) {
		try {
			if (!excludedKeys['$' + k] && has.call(window, k) && window[k] !== null && typeof window[k] === 'object') {
				try {
					equalsConstructorPrototype(window[k]);
				} catch (e) {
					return true;
				}
			}
		} catch (e) {
			return true;
		}
	}
	return false;
}());
var equalsConstructorPrototypeIfNotBuggy = function (o) {
	/* global window */
	if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
		return equalsConstructorPrototype(o);
	}
	try {
		return equalsConstructorPrototype(o);
	} catch (e) {
		return false;
	}
};

var keysShim = function keys(object) {
	var isObject = object !== null && typeof object === 'object';
	var isFunction = toStr.call(object) === '[object Function]';
	var isArguments = isArgs(object);
	var isString = isObject && toStr.call(object) === '[object String]';
	var theKeys = [];

	if (!isObject && !isFunction && !isArguments) {
		throw new TypeError('Object.keys called on a non-object');
	}

	var skipProto = hasProtoEnumBug && isFunction;
	if (isString && object.length > 0 && !has.call(object, 0)) {
		for (var i = 0; i < object.length; ++i) {
			theKeys.push(String(i));
		}
	}

	if (isArguments && object.length > 0) {
		for (var j = 0; j < object.length; ++j) {
			theKeys.push(String(j));
		}
	} else {
		for (var name in object) {
			if (!(skipProto && name === 'prototype') && has.call(object, name)) {
				theKeys.push(String(name));
			}
		}
	}

	if (hasDontEnumBug) {
		var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);

		for (var k = 0; k < dontEnums.length; ++k) {
			if (!(skipConstructor && dontEnums[k] === 'constructor') && has.call(object, dontEnums[k])) {
				theKeys.push(dontEnums[k]);
			}
		}
	}
	return theKeys;
};

keysShim.shim = function shimObjectKeys() {
	if (Object.keys) {
		var keysWorksWithArguments = (function () {
			// Safari 5.0 bug
			return (Object.keys(arguments) || '').length === 2;
		}(1, 2));
		if (!keysWorksWithArguments) {
			var originalKeys = Object.keys;
			Object.keys = function keys(object) {
				if (isArgs(object)) {
					return originalKeys(slice.call(object));
				} else {
					return originalKeys(object);
				}
			};
		}
	} else {
		Object.keys = keysShim;
	}
	return Object.keys || keysShim;
};

module.exports = keysShim;


/***/ }),
/* 782 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var toStr = Object.prototype.toString;

module.exports = function isArguments(value) {
	var str = toStr.call(value);
	var isArgs = str === '[object Arguments]';
	if (!isArgs) {
		isArgs = str !== '[object Array]' &&
			value !== null &&
			typeof value === 'object' &&
			typeof value.length === 'number' &&
			value.length >= 0 &&
			toStr.call(value.callee) === '[object Function]';
	}
	return isArgs;
};


/***/ }),
/* 783 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (url) {
	if (typeof url !== 'string') {
		throw new TypeError('Expected a string, got ' + typeof url);
	}

	url = url.trim();

	if (/^\.*\/|^(?!localhost)\w+:/.test(url)) {
		return url;
	}

	return url.replace(/^(?!(?:\w+:)?\/\/)/, 'http://');
};


/***/ }),
/* 784 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 785 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 786 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(784);
exports.encode = exports.stringify = __webpack_require__(785);


/***/ }),
/* 787 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var isPlainObj = __webpack_require__(773);

module.exports = function (obj, opts) {
	if (!isPlainObj(obj)) {
		throw new TypeError('Expected a plain object');
	}

	opts = opts || {};

	// DEPRECATED
	if (typeof opts === 'function') {
		opts = {compare: opts};
	}

	var deep = opts.deep;
	var seenInput = [];
	var seenOutput = [];

	var sortKeys = function (x) {
		var seenIndex = seenInput.indexOf(x);

		if (seenIndex !== -1) {
			return seenOutput[seenIndex];
		}

		var ret = {};
		var keys = Object.keys(x).sort(opts.compare);

		seenInput.push(x);
		seenOutput.push(ret);

		for (var i = 0; i < keys.length; i++) {
			var key = keys[i];
			var val = x[key];

			ret[key] = deep && isPlainObj(val) ? sortKeys(val) : val;
		}

		return ret;
	};

	return sortKeys(obj);
};


/***/ }),
/* 788 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function (str) {
	return encodeURIComponent(str).replace(/[!'()*]/g, function (c) {
		return '%' + c.charCodeAt(0).toString(16).toUpperCase();
	});
};


/***/ }),
/* 789 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function (str, options) {
    if (typeof str !== 'string') {
        throw new TypeError('taghash expects a string');
    }

    options = options || {};
    options.href = options.href || 'https://twitter.com/hashtag/';

    if (!(/#/g).test(str)) {
        return str;
    }

    var hashes = str.match(/[^|\s]?#[\d\w]+/g);

    if (!hashes) {
        return str;
    }

    var s = str;

    hashes.forEach(function (item) {
        var hash = item.slice(1);

        // ignore tags that have a double "##"
        if (hash.substring(0, 1) !== '#') {
            s = s.replace(item, '<a href="' + options.href + '' + hash + '">' + item + '</a>');
        }
    });

    return s;
};


/***/ }),
/* 790 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var getUrls = __webpack_require__(770);
var taghash = __webpack_require__(789);
var mentions = __webpack_require__(771);
var propertyString = __webpack_require__(780);
var objectAssign = __webpack_require__(604);
var escapeStringRegexp = __webpack_require__(720);

module.exports = function (data, opts) {
	var txt;
	var dataType = typeof data;

	if (dataType === 'string') {
		txt = data;
	} else if (dataType === 'object' && data.text) {
		txt = data.text;
	} else {
		throw new TypeError('tweet-patch expects a string or tweet object with a text property.');
	}

	opts = opts || {};

	var defaults = {
		useExistingHTML: false,
		stripTrailingUrl: false,
		hrefProps: {}
	};

	opts = objectAssign(defaults, opts);

	var propString;

	if (typeof opts.hrefProps === 'object') {
		propString = propertyString(opts.hrefProps);
	} else if (typeof opts.hrefProps === 'string') {
		propString = opts.hrefProps;
	}

	if (opts.useExistingHTML && data.html) {
		return data.html;
	}

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
	// convert all the urls
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
	var allUrls = getUrls(txt) || [];
	var twitterUrls = (data.entities && data.entities.urls) ? data.entities.urls : null;

	// Do we want to strip the trailing url? Only in the condition that we are using a
	// Twitter Object with entities.urls and there is at least one url in the entire tweet text.
	if (opts.stripTrailingUrl && dataType === 'object' && allUrls.length > 0 && twitterUrls && twitterUrls.length === 0) {
		var trailingUrl = allUrls.pop();
		txt = txt.replace(trailingUrl, '').trim();
	}

	allUrls.forEach(function (url) {
		try {
			txt = txt.replace(new RegExp(url, 'g'), wrapLink(url, propString));
		} catch (err) {
			if (err.message.indexOf('Invalid regular expression') > -1) {
				txt = txt.replace(new RegExp(escapeStringRegexp(url), 'g'), wrapLink(url, propString));
			}
		}
	});

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
	// convert all the user mentions
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
	var userMentions = mentions(txt) || [];
	userMentions.forEach(function (user) {
		txt = txt.replace(user, wrapUserMention(user));
	});

	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
	// convert all the hashtags
	// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ //
	txt = taghash(txt);

	return txt;
};

function wrapLink(href, props) {
	if ((props.trim && props.trim() !== '') || (typeof props === 'object' && !Object.keys(props).length)) {
		props = ' ' + props;
	}
	return '<a href="' + href + '"' + props + '>' + href + '</a>';
}

function wrapUserMention(screenname) {
	screenname = screenname.replace(/^@/, '');
	return '<a href="https://twitter.com/' + screenname + '">@' + screenname + '</a>';
}


/***/ }),
/* 791 */,
/* 792 */,
/* 793 */,
/* 794 */,
/* 795 */,
/* 796 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "static/img/heart.4559856.png";

/***/ }),
/* 797 */,
/* 798 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ipRegex = __webpack_require__(772);

module.exports = function (opts) {
	opts = opts || {};

	var protocol = '(?:(?:[a-z]+:)?//)';
	var auth = '(?:\\S+(?::\\S*)?@)?';
	var ip = ipRegex.v4().source;
	var host = '(?:(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)';
	var domain = '(?:\\.(?:[a-z\\u00a1-\\uffff0-9]-*)*[a-z\\u00a1-\\uffff0-9]+)*';
	var tld = '(?:\\.(?:[a-z\\u00a1-\\uffff]{2,}))';
	var port = '(?::\\d{2,5})?';
	var path = '(?:[/?#][^\\s"]*)?';
	var regex = [
		'(?:' + protocol + '|www\\.)' + auth, '(?:localhost|' + ip + '|' + host + domain + tld + ')',
		port, path
	].join('');

	return opts.exact ? new RegExp('(?:^' + regex + '$)', 'i') :
						new RegExp(regex, 'ig');
};


/***/ }),
/* 799 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var punycode = __webpack_require__(500);
var util = __webpack_require__(800);

exports.parse = urlParse;
exports.resolve = urlResolve;
exports.resolveObject = urlResolveObject;
exports.format = urlFormat;

exports.Url = Url;

function Url() {
  this.protocol = null;
  this.slashes = null;
  this.auth = null;
  this.host = null;
  this.port = null;
  this.hostname = null;
  this.hash = null;
  this.search = null;
  this.query = null;
  this.pathname = null;
  this.path = null;
  this.href = null;
}

// Reference: RFC 3986, RFC 1808, RFC 2396

// define these here so at least they only have to be
// compiled once on the first module load.
var protocolPattern = /^([a-z0-9.+-]+:)/i,
    portPattern = /:[0-9]*$/,

    // Special case for a simple path URL
    simplePathPattern = /^(\/\/?(?!\/)[^\?\s]*)(\?[^\s]*)?$/,

    // RFC 2396: characters reserved for delimiting URLs.
    // We actually just auto-escape these.
    delims = ['<', '>', '"', '`', ' ', '\r', '\n', '\t'],

    // RFC 2396: characters not allowed for various reasons.
    unwise = ['{', '}', '|', '\\', '^', '`'].concat(delims),

    // Allowed by RFCs, but cause of XSS attacks.  Always escape these.
    autoEscape = ['\''].concat(unwise),
    // Characters that are never ever allowed in a hostname.
    // Note that any invalid chars are also handled, but these
    // are the ones that are *expected* to be seen, so we fast-path
    // them.
    nonHostChars = ['%', '/', '?', ';', '#'].concat(autoEscape),
    hostEndingChars = ['/', '?', '#'],
    hostnameMaxLen = 255,
    hostnamePartPattern = /^[+a-z0-9A-Z_-]{0,63}$/,
    hostnamePartStart = /^([+a-z0-9A-Z_-]{0,63})(.*)$/,
    // protocols that can allow "unsafe" and "unwise" chars.
    unsafeProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that never have a hostname.
    hostlessProtocol = {
      'javascript': true,
      'javascript:': true
    },
    // protocols that always contain a // bit.
    slashedProtocol = {
      'http': true,
      'https': true,
      'ftp': true,
      'gopher': true,
      'file': true,
      'http:': true,
      'https:': true,
      'ftp:': true,
      'gopher:': true,
      'file:': true
    },
    querystring = __webpack_require__(786);

function urlParse(url, parseQueryString, slashesDenoteHost) {
  if (url && util.isObject(url) && url instanceof Url) return url;

  var u = new Url;
  u.parse(url, parseQueryString, slashesDenoteHost);
  return u;
}

Url.prototype.parse = function(url, parseQueryString, slashesDenoteHost) {
  if (!util.isString(url)) {
    throw new TypeError("Parameter 'url' must be a string, not " + typeof url);
  }

  // Copy chrome, IE, opera backslash-handling behavior.
  // Back slashes before the query string get converted to forward slashes
  // See: https://code.google.com/p/chromium/issues/detail?id=25916
  var queryIndex = url.indexOf('?'),
      splitter =
          (queryIndex !== -1 && queryIndex < url.indexOf('#')) ? '?' : '#',
      uSplit = url.split(splitter),
      slashRegex = /\\/g;
  uSplit[0] = uSplit[0].replace(slashRegex, '/');
  url = uSplit.join(splitter);

  var rest = url;

  // trim before proceeding.
  // This is to support parse stuff like "  http://foo.com  \n"
  rest = rest.trim();

  if (!slashesDenoteHost && url.split('#').length === 1) {
    // Try fast path regexp
    var simplePath = simplePathPattern.exec(rest);
    if (simplePath) {
      this.path = rest;
      this.href = rest;
      this.pathname = simplePath[1];
      if (simplePath[2]) {
        this.search = simplePath[2];
        if (parseQueryString) {
          this.query = querystring.parse(this.search.substr(1));
        } else {
          this.query = this.search.substr(1);
        }
      } else if (parseQueryString) {
        this.search = '';
        this.query = {};
      }
      return this;
    }
  }

  var proto = protocolPattern.exec(rest);
  if (proto) {
    proto = proto[0];
    var lowerProto = proto.toLowerCase();
    this.protocol = lowerProto;
    rest = rest.substr(proto.length);
  }

  // figure out if it's got a host
  // user@server is *always* interpreted as a hostname, and url
  // resolution will treat //foo/bar as host=foo,path=bar because that's
  // how the browser resolves relative URLs.
  if (slashesDenoteHost || proto || rest.match(/^\/\/[^@\/]+@[^@\/]+/)) {
    var slashes = rest.substr(0, 2) === '//';
    if (slashes && !(proto && hostlessProtocol[proto])) {
      rest = rest.substr(2);
      this.slashes = true;
    }
  }

  if (!hostlessProtocol[proto] &&
      (slashes || (proto && !slashedProtocol[proto]))) {

    // there's a hostname.
    // the first instance of /, ?, ;, or # ends the host.
    //
    // If there is an @ in the hostname, then non-host chars *are* allowed
    // to the left of the last @ sign, unless some host-ending character
    // comes *before* the @-sign.
    // URLs are obnoxious.
    //
    // ex:
    // http://a@b@c/ => user:a@b host:c
    // http://a@b?@c => user:a host:c path:/?@c

    // v0.12 TODO(isaacs): This is not quite how Chrome does things.
    // Review our test case against browsers more comprehensively.

    // find the first instance of any hostEndingChars
    var hostEnd = -1;
    for (var i = 0; i < hostEndingChars.length; i++) {
      var hec = rest.indexOf(hostEndingChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }

    // at this point, either we have an explicit point where the
    // auth portion cannot go past, or the last @ char is the decider.
    var auth, atSign;
    if (hostEnd === -1) {
      // atSign can be anywhere.
      atSign = rest.lastIndexOf('@');
    } else {
      // atSign must be in auth portion.
      // http://a@b/c@d => host:b auth:a path:/c@d
      atSign = rest.lastIndexOf('@', hostEnd);
    }

    // Now we have a portion which is definitely the auth.
    // Pull that off.
    if (atSign !== -1) {
      auth = rest.slice(0, atSign);
      rest = rest.slice(atSign + 1);
      this.auth = decodeURIComponent(auth);
    }

    // the host is the remaining to the left of the first non-host char
    hostEnd = -1;
    for (var i = 0; i < nonHostChars.length; i++) {
      var hec = rest.indexOf(nonHostChars[i]);
      if (hec !== -1 && (hostEnd === -1 || hec < hostEnd))
        hostEnd = hec;
    }
    // if we still have not hit it, then the entire thing is a host.
    if (hostEnd === -1)
      hostEnd = rest.length;

    this.host = rest.slice(0, hostEnd);
    rest = rest.slice(hostEnd);

    // pull out port.
    this.parseHost();

    // we've indicated that there is a hostname,
    // so even if it's empty, it has to be present.
    this.hostname = this.hostname || '';

    // if hostname begins with [ and ends with ]
    // assume that it's an IPv6 address.
    var ipv6Hostname = this.hostname[0] === '[' &&
        this.hostname[this.hostname.length - 1] === ']';

    // validate a little.
    if (!ipv6Hostname) {
      var hostparts = this.hostname.split(/\./);
      for (var i = 0, l = hostparts.length; i < l; i++) {
        var part = hostparts[i];
        if (!part) continue;
        if (!part.match(hostnamePartPattern)) {
          var newpart = '';
          for (var j = 0, k = part.length; j < k; j++) {
            if (part.charCodeAt(j) > 127) {
              // we replace non-ASCII char with a temporary placeholder
              // we need this to make sure size of hostname is not
              // broken by replacing non-ASCII by nothing
              newpart += 'x';
            } else {
              newpart += part[j];
            }
          }
          // we test again with ASCII char only
          if (!newpart.match(hostnamePartPattern)) {
            var validParts = hostparts.slice(0, i);
            var notHost = hostparts.slice(i + 1);
            var bit = part.match(hostnamePartStart);
            if (bit) {
              validParts.push(bit[1]);
              notHost.unshift(bit[2]);
            }
            if (notHost.length) {
              rest = '/' + notHost.join('.') + rest;
            }
            this.hostname = validParts.join('.');
            break;
          }
        }
      }
    }

    if (this.hostname.length > hostnameMaxLen) {
      this.hostname = '';
    } else {
      // hostnames are always lower case.
      this.hostname = this.hostname.toLowerCase();
    }

    if (!ipv6Hostname) {
      // IDNA Support: Returns a punycoded representation of "domain".
      // It only converts parts of the domain name that
      // have non-ASCII characters, i.e. it doesn't matter if
      // you call it with a domain that already is ASCII-only.
      this.hostname = punycode.toASCII(this.hostname);
    }

    var p = this.port ? ':' + this.port : '';
    var h = this.hostname || '';
    this.host = h + p;
    this.href += this.host;

    // strip [ and ] from the hostname
    // the host field still retains them, though
    if (ipv6Hostname) {
      this.hostname = this.hostname.substr(1, this.hostname.length - 2);
      if (rest[0] !== '/') {
        rest = '/' + rest;
      }
    }
  }

  // now rest is set to the post-host stuff.
  // chop off any delim chars.
  if (!unsafeProtocol[lowerProto]) {

    // First, make 100% sure that any "autoEscape" chars get
    // escaped, even if encodeURIComponent doesn't think they
    // need to be.
    for (var i = 0, l = autoEscape.length; i < l; i++) {
      var ae = autoEscape[i];
      if (rest.indexOf(ae) === -1)
        continue;
      var esc = encodeURIComponent(ae);
      if (esc === ae) {
        esc = escape(ae);
      }
      rest = rest.split(ae).join(esc);
    }
  }


  // chop off from the tail first.
  var hash = rest.indexOf('#');
  if (hash !== -1) {
    // got a fragment string.
    this.hash = rest.substr(hash);
    rest = rest.slice(0, hash);
  }
  var qm = rest.indexOf('?');
  if (qm !== -1) {
    this.search = rest.substr(qm);
    this.query = rest.substr(qm + 1);
    if (parseQueryString) {
      this.query = querystring.parse(this.query);
    }
    rest = rest.slice(0, qm);
  } else if (parseQueryString) {
    // no query string, but parseQueryString still requested
    this.search = '';
    this.query = {};
  }
  if (rest) this.pathname = rest;
  if (slashedProtocol[lowerProto] &&
      this.hostname && !this.pathname) {
    this.pathname = '/';
  }

  //to support http.request
  if (this.pathname || this.search) {
    var p = this.pathname || '';
    var s = this.search || '';
    this.path = p + s;
  }

  // finally, reconstruct the href based on what has been validated.
  this.href = this.format();
  return this;
};

// format a parsed object into a url string
function urlFormat(obj) {
  // ensure it's an object, and not a string url.
  // If it's an obj, this is a no-op.
  // this way, you can call url_format() on strings
  // to clean up potentially wonky urls.
  if (util.isString(obj)) obj = urlParse(obj);
  if (!(obj instanceof Url)) return Url.prototype.format.call(obj);
  return obj.format();
}

Url.prototype.format = function() {
  var auth = this.auth || '';
  if (auth) {
    auth = encodeURIComponent(auth);
    auth = auth.replace(/%3A/i, ':');
    auth += '@';
  }

  var protocol = this.protocol || '',
      pathname = this.pathname || '',
      hash = this.hash || '',
      host = false,
      query = '';

  if (this.host) {
    host = auth + this.host;
  } else if (this.hostname) {
    host = auth + (this.hostname.indexOf(':') === -1 ?
        this.hostname :
        '[' + this.hostname + ']');
    if (this.port) {
      host += ':' + this.port;
    }
  }

  if (this.query &&
      util.isObject(this.query) &&
      Object.keys(this.query).length) {
    query = querystring.stringify(this.query);
  }

  var search = this.search || (query && ('?' + query)) || '';

  if (protocol && protocol.substr(-1) !== ':') protocol += ':';

  // only the slashedProtocols get the //.  Not mailto:, xmpp:, etc.
  // unless they had them to begin with.
  if (this.slashes ||
      (!protocol || slashedProtocol[protocol]) && host !== false) {
    host = '//' + (host || '');
    if (pathname && pathname.charAt(0) !== '/') pathname = '/' + pathname;
  } else if (!host) {
    host = '';
  }

  if (hash && hash.charAt(0) !== '#') hash = '#' + hash;
  if (search && search.charAt(0) !== '?') search = '?' + search;

  pathname = pathname.replace(/[?#]/g, function(match) {
    return encodeURIComponent(match);
  });
  search = search.replace('#', '%23');

  return protocol + host + pathname + search + hash;
};

function urlResolve(source, relative) {
  return urlParse(source, false, true).resolve(relative);
}

Url.prototype.resolve = function(relative) {
  return this.resolveObject(urlParse(relative, false, true)).format();
};

function urlResolveObject(source, relative) {
  if (!source) return relative;
  return urlParse(source, false, true).resolveObject(relative);
}

Url.prototype.resolveObject = function(relative) {
  if (util.isString(relative)) {
    var rel = new Url();
    rel.parse(relative, false, true);
    relative = rel;
  }

  var result = new Url();
  var tkeys = Object.keys(this);
  for (var tk = 0; tk < tkeys.length; tk++) {
    var tkey = tkeys[tk];
    result[tkey] = this[tkey];
  }

  // hash is always overridden, no matter what.
  // even href="" will remove it.
  result.hash = relative.hash;

  // if the relative url is empty, then there's nothing left to do here.
  if (relative.href === '') {
    result.href = result.format();
    return result;
  }

  // hrefs like //foo/bar always cut to the protocol.
  if (relative.slashes && !relative.protocol) {
    // take everything except the protocol from relative
    var rkeys = Object.keys(relative);
    for (var rk = 0; rk < rkeys.length; rk++) {
      var rkey = rkeys[rk];
      if (rkey !== 'protocol')
        result[rkey] = relative[rkey];
    }

    //urlParse appends trailing / to urls like http://www.example.com
    if (slashedProtocol[result.protocol] &&
        result.hostname && !result.pathname) {
      result.path = result.pathname = '/';
    }

    result.href = result.format();
    return result;
  }

  if (relative.protocol && relative.protocol !== result.protocol) {
    // if it's a known url protocol, then changing
    // the protocol does weird things
    // first, if it's not file:, then we MUST have a host,
    // and if there was a path
    // to begin with, then we MUST have a path.
    // if it is file:, then the host is dropped,
    // because that's known to be hostless.
    // anything else is assumed to be absolute.
    if (!slashedProtocol[relative.protocol]) {
      var keys = Object.keys(relative);
      for (var v = 0; v < keys.length; v++) {
        var k = keys[v];
        result[k] = relative[k];
      }
      result.href = result.format();
      return result;
    }

    result.protocol = relative.protocol;
    if (!relative.host && !hostlessProtocol[relative.protocol]) {
      var relPath = (relative.pathname || '').split('/');
      while (relPath.length && !(relative.host = relPath.shift()));
      if (!relative.host) relative.host = '';
      if (!relative.hostname) relative.hostname = '';
      if (relPath[0] !== '') relPath.unshift('');
      if (relPath.length < 2) relPath.unshift('');
      result.pathname = relPath.join('/');
    } else {
      result.pathname = relative.pathname;
    }
    result.search = relative.search;
    result.query = relative.query;
    result.host = relative.host || '';
    result.auth = relative.auth;
    result.hostname = relative.hostname || relative.host;
    result.port = relative.port;
    // to support http.request
    if (result.pathname || result.search) {
      var p = result.pathname || '';
      var s = result.search || '';
      result.path = p + s;
    }
    result.slashes = result.slashes || relative.slashes;
    result.href = result.format();
    return result;
  }

  var isSourceAbs = (result.pathname && result.pathname.charAt(0) === '/'),
      isRelAbs = (
          relative.host ||
          relative.pathname && relative.pathname.charAt(0) === '/'
      ),
      mustEndAbs = (isRelAbs || isSourceAbs ||
                    (result.host && relative.pathname)),
      removeAllDots = mustEndAbs,
      srcPath = result.pathname && result.pathname.split('/') || [],
      relPath = relative.pathname && relative.pathname.split('/') || [],
      psychotic = result.protocol && !slashedProtocol[result.protocol];

  // if the url is a non-slashed url, then relative
  // links like ../.. should be able
  // to crawl up to the hostname, as well.  This is strange.
  // result.protocol has already been set by now.
  // Later on, put the first path part into the host field.
  if (psychotic) {
    result.hostname = '';
    result.port = null;
    if (result.host) {
      if (srcPath[0] === '') srcPath[0] = result.host;
      else srcPath.unshift(result.host);
    }
    result.host = '';
    if (relative.protocol) {
      relative.hostname = null;
      relative.port = null;
      if (relative.host) {
        if (relPath[0] === '') relPath[0] = relative.host;
        else relPath.unshift(relative.host);
      }
      relative.host = null;
    }
    mustEndAbs = mustEndAbs && (relPath[0] === '' || srcPath[0] === '');
  }

  if (isRelAbs) {
    // it's absolute.
    result.host = (relative.host || relative.host === '') ?
                  relative.host : result.host;
    result.hostname = (relative.hostname || relative.hostname === '') ?
                      relative.hostname : result.hostname;
    result.search = relative.search;
    result.query = relative.query;
    srcPath = relPath;
    // fall through to the dot-handling below.
  } else if (relPath.length) {
    // it's relative
    // throw away the existing file, and take the new path instead.
    if (!srcPath) srcPath = [];
    srcPath.pop();
    srcPath = srcPath.concat(relPath);
    result.search = relative.search;
    result.query = relative.query;
  } else if (!util.isNullOrUndefined(relative.search)) {
    // just pull out the search.
    // like href='?foo'.
    // Put this after the other two cases because it simplifies the booleans
    if (psychotic) {
      result.hostname = result.host = srcPath.shift();
      //occationaly the auth can get stuck only in host
      //this especially happens in cases like
      //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
      var authInHost = result.host && result.host.indexOf('@') > 0 ?
                       result.host.split('@') : false;
      if (authInHost) {
        result.auth = authInHost.shift();
        result.host = result.hostname = authInHost.shift();
      }
    }
    result.search = relative.search;
    result.query = relative.query;
    //to support http.request
    if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
      result.path = (result.pathname ? result.pathname : '') +
                    (result.search ? result.search : '');
    }
    result.href = result.format();
    return result;
  }

  if (!srcPath.length) {
    // no path at all.  easy.
    // we've already handled the other stuff above.
    result.pathname = null;
    //to support http.request
    if (result.search) {
      result.path = '/' + result.search;
    } else {
      result.path = null;
    }
    result.href = result.format();
    return result;
  }

  // if a url ENDs in . or .., then it must get a trailing slash.
  // however, if it ends in anything else non-slashy,
  // then it must NOT get a trailing slash.
  var last = srcPath.slice(-1)[0];
  var hasTrailingSlash = (
      (result.host || relative.host || srcPath.length > 1) &&
      (last === '.' || last === '..') || last === '');

  // strip single dots, resolve double dots to parent dir
  // if the path tries to go above the root, `up` ends up > 0
  var up = 0;
  for (var i = srcPath.length; i >= 0; i--) {
    last = srcPath[i];
    if (last === '.') {
      srcPath.splice(i, 1);
    } else if (last === '..') {
      srcPath.splice(i, 1);
      up++;
    } else if (up) {
      srcPath.splice(i, 1);
      up--;
    }
  }

  // if the path is allowed to go above the root, restore leading ..s
  if (!mustEndAbs && !removeAllDots) {
    for (; up--; up) {
      srcPath.unshift('..');
    }
  }

  if (mustEndAbs && srcPath[0] !== '' &&
      (!srcPath[0] || srcPath[0].charAt(0) !== '/')) {
    srcPath.unshift('');
  }

  if (hasTrailingSlash && (srcPath.join('/').substr(-1) !== '/')) {
    srcPath.push('');
  }

  var isAbsolute = srcPath[0] === '' ||
      (srcPath[0] && srcPath[0].charAt(0) === '/');

  // put the host back
  if (psychotic) {
    result.hostname = result.host = isAbsolute ? '' :
                                    srcPath.length ? srcPath.shift() : '';
    //occationaly the auth can get stuck only in host
    //this especially happens in cases like
    //url.resolveObject('mailto:local1@domain1', 'local2@domain2')
    var authInHost = result.host && result.host.indexOf('@') > 0 ?
                     result.host.split('@') : false;
    if (authInHost) {
      result.auth = authInHost.shift();
      result.host = result.hostname = authInHost.shift();
    }
  }

  mustEndAbs = mustEndAbs || (result.host && srcPath.length);

  if (mustEndAbs && !isAbsolute) {
    srcPath.unshift('');
  }

  if (!srcPath.length) {
    result.pathname = null;
    result.path = null;
  } else {
    result.pathname = srcPath.join('/');
  }

  //to support request.http
  if (!util.isNull(result.pathname) || !util.isNull(result.search)) {
    result.path = (result.pathname ? result.pathname : '') +
                  (result.search ? result.search : '');
  }
  result.auth = relative.auth || result.auth;
  result.slashes = result.slashes || relative.slashes;
  result.href = result.format();
  return result;
};

Url.prototype.parseHost = function() {
  var host = this.host;
  var port = portPattern.exec(host);
  if (port) {
    port = port[0];
    if (port !== ':') {
      this.port = port.substr(1);
    }
    host = host.substr(0, host.length - port.length);
  }
  if (host) this.hostname = host;
};


/***/ }),
/* 800 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = {
  isString: function(arg) {
    return typeof(arg) === 'string';
  },
  isObject: function(arg) {
    return typeof(arg) === 'object' && arg !== null;
  },
  isNull: function(arg) {
    return arg === null;
  },
  isNullOrUndefined: function(arg) {
    return arg == null;
  }
};


/***/ }),
/* 801 */,
/* 802 */,
/* 803 */,
/* 804 */,
/* 805 */,
/* 806 */,
/* 807 */,
/* 808 */,
/* 809 */,
/* 810 */,
/* 811 */,
/* 812 */,
/* 813 */,
/* 814 */,
/* 815 */,
/* 816 */,
/* 817 */,
/* 818 */,
/* 819 */,
/* 820 */,
/* 821 */,
/* 822 */,
/* 823 */,
/* 824 */,
/* 825 */,
/* 826 */,
/* 827 */,
/* 828 */,
/* 829 */,
/* 830 */,
/* 831 */,
/* 832 */,
/* 833 */,
/* 834 */,
/* 835 */,
/* 836 */,
/* 837 */,
/* 838 */,
/* 839 */,
/* 840 */,
/* 841 */,
/* 842 */,
/* 843 */,
/* 844 */,
/* 845 */,
/* 846 */,
/* 847 */,
/* 848 */,
/* 849 */,
/* 850 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(761)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(636),
  /* template */
  __webpack_require__(913),
  /* scopeId */
  "data-v-71d72597",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 851 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(736)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(637),
  /* template */
  __webpack_require__(888),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 852 */,
/* 853 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(733)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(640),
  /* template */
  __webpack_require__(885),
  /* scopeId */
  "data-v-0fbc9bd8",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 854 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(762)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(642),
  /* template */
  __webpack_require__(914),
  /* scopeId */
  "data-v-7ae66d2a",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 855 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(746)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(643),
  /* template */
  __webpack_require__(898),
  /* scopeId */
  "data-v-35ffccce",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 856 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(764)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(644),
  /* template */
  __webpack_require__(916),
  /* scopeId */
  "data-v-bf1f21f8",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 857 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(750)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(645),
  /* template */
  __webpack_require__(902),
  /* scopeId */
  "data-v-45a5c7aa",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 858 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(740)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(646),
  /* template */
  __webpack_require__(892),
  /* scopeId */
  "data-v-25b27813",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 859 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(766)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(647),
  /* template */
  __webpack_require__(919),
  /* scopeId */
  "data-v-da893b7c",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 860 */,
/* 861 */,
/* 862 */,
/* 863 */,
/* 864 */,
/* 865 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(745)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(657),
  /* template */
  __webpack_require__(897),
  /* scopeId */
  "data-v-346e64ce",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 866 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(767)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(658),
  /* template */
  __webpack_require__(920),
  /* scopeId */
  "data-v-df9076bc",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 867 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(769)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(659),
  /* template */
  __webpack_require__(922),
  /* scopeId */
  "data-v-f8523108",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 868 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(741)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(660),
  /* template */
  __webpack_require__(893),
  /* scopeId */
  "data-v-28db7dfa",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 869 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(730)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(661),
  /* template */
  __webpack_require__(882),
  /* scopeId */
  "data-v-081a9a5c",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 870 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(768)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(662),
  /* template */
  __webpack_require__(921),
  /* scopeId */
  "data-v-ed52363c",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 871 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(731)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(663),
  /* template */
  __webpack_require__(883),
  /* scopeId */
  "data-v-08b8d0a0",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 872 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(732)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(665),
  /* template */
  __webpack_require__(884),
  /* scopeId */
  "data-v-0f47a13e",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 873 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(744)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(666),
  /* template */
  __webpack_require__(896),
  /* scopeId */
  "data-v-33fa1589",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 874 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(755)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(667),
  /* template */
  __webpack_require__(907),
  /* scopeId */
  "data-v-5a909e04",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 875 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(748)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(668),
  /* template */
  __webpack_require__(900),
  /* scopeId */
  null,
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 876 */,
/* 877 */,
/* 878 */,
/* 879 */,
/* 880 */
/***/ (function(module, exports, __webpack_require__) {


/* styles */
__webpack_require__(737)

var Component = __webpack_require__(2)(
  /* script */
  __webpack_require__(677),
  /* template */
  __webpack_require__(889),
  /* scopeId */
  "data-v-1fe69ebc",
  /* cssModules */
  null
)

module.exports = Component.exports


/***/ }),
/* 881 */,
/* 882 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "course-content"
  }, [_c('div', {
    staticClass: "course-content--header block"
  }, [_c('h1', {
    staticClass: "content-title"
  }, [_vm._v("Homework")]), _c('p', {
    staticClass: "content-description"
  }, [_vm._v(_vm._s(_vm.content.description))]), _c('div', {
    staticClass: "submission-button-wrapper"
  }, [(_vm.content.url) ? _c('div', {
    staticClass: "pure-button",
    on: {
      "click": _vm.openHomework
    }
  }, [_vm._v(_vm._s(_vm.$t('common.participate')))]) : _vm._e()])]), _c('submission-grid', {
    attrs: {
      "content": _vm.content
    }
  })], 1)
},staticRenderFns: []}

/***/ }),
/* 883 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "course-content"
  }, [_c('div', {
    staticClass: "course-content--header block"
  }, [_c('h1', {
    staticClass: "content-title"
  }, [_vm._v(_vm._s(_vm.content.title))]), (_vm.content.description) ? _c('p', {
    staticClass: "content-description"
  }, [_vm._v(_vm._s(_vm.content.description))]) : _vm._e()]), _c('div', {
    staticClass: "course-content--container",
    class: {
      collapsed: _vm.collapsed
    }
  }, [(_vm.collapsed) ? _c('div', {
    attrs: {
      "id": "fade-out"
    }
  }) : _vm._e(), _c('action-panel', {
    attrs: {
      "content": _vm.content,
      "video-is-active": _vm.videoIsActive,
      "active-segment": _vm.activeSegment
    }
  }), (_vm.content.content_type === 'class') ? _c('conversation-container', {
    attrs: {
      "content": _vm.content
    }
  }) : _vm._e()], 1), _c('div', {
    staticClass: "course-content--footer"
  }, [(_vm.collapsed) ? _c('div', {
    staticClass: "pure-button pure-button-primary",
    on: {
      "click": function($event) {
        _vm.collapsed = false
      }
    }
  }, [_vm._v("Continue Listening")]) : _vm._e(), (!_vm.collapsed) ? _c('div', {
    staticClass: "pure-button pure-button-primary",
    on: {
      "click": function($event) {
        _vm.collapsed = true
      }
    }
  }, [_vm._v("Finished Listening")]) : _vm._e()])])
},staticRenderFns: []}

/***/ }),
/* 884 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "mock-message",
    class: {
      loading: _vm.message.loading
    }
  }, [_c('div', {
    staticClass: "mock-message--user"
  }), _vm._m(0)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "mock-message--body"
  }, [_c('div', {
    staticClass: "mock-message--line"
  }), _c('div', {
    staticClass: "mock-message--line"
  }), _c('div', {
    staticClass: "mock-message--line"
  })])
}]}

/***/ }),
/* 885 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "like-indicator animated fadeIn"
  }, [_c('div', {
    staticClass: "like-indicator-wrapper",
    on: {
      "click": _vm.toggleLike
    }
  }, [_c('div', {
    staticClass: "heart",
    class: {
      active: _vm.haveliked
    }
  }), (_vm.likeCount > 0) ? _c('div', {
    staticClass: "like-count"
  }, [_vm._v(_vm._s(_vm.likeCount))]) : _vm._e()])])
},staticRenderFns: []}

/***/ }),
/* 886 */,
/* 887 */,
/* 888 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    ref: "conversationContainer",
    staticClass: "conversation-container"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.currentSegment),
      expression: "currentSegment"
    }],
    class: {
      'message-priority': _vm.messagePriority
    },
    attrs: {
      "id": "view-toggle"
    },
    on: {
      "click": function($event) {
        _vm.messagePriority = !_vm.messagePriority
      }
    }
  }, [_c('icon', {
    attrs: {
      "name": "twitter"
    }
  }), _c('icon', {
    attrs: {
      "name": "quote-right"
    }
  })], 1), (!_vm.peekSegment) ? _c('div', {
    attrs: {
      "id": "activity-visualisation"
    }
  }, [_c('svg', {
    attrs: {
      "width": "400",
      "height": _vm.containerHeight
    }
  }, [_c('g', [_c('path', {
    attrs: {
      "d": _vm.points,
      "transform": "translate(400,0)"
    }
  })])])]) : _vm._e(), _c('div', {
    staticClass: "inner-wrapper",
    class: {
      'message-priority': _vm.messagePriority
    },
    style: ({
      height: _vm.containerHeight
    })
  }, _vm._l((_vm.chunkedMessages), function(message, index) {
    return _c('time-segment', {
      key: index,
      attrs: {
        "index": index,
        "message": _vm.messages[index],
        "subtitle": _vm.subtitles[index]
      }
    })
  }))])
},staticRenderFns: []}

/***/ }),
/* 889 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    attrs: {
      "id": "webinar-message-ticker"
    }
  }, _vm._l((_vm.orderedMessages), function(message, index) {
    return _c('div', {
      staticClass: "message-wrapper"
    }, [_c('message', {
      attrs: {
        "message": message
      }
    })], 1)
  }))
},staticRenderFns: []}

/***/ }),
/* 890 */,
/* 891 */,
/* 892 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "soundcloud-wrapper"
  }, [_c('div', {
    staticClass: "soundcloud-container"
  }, [_c('iframe', {
    attrs: {
      "src": _vm.src,
      "width": "100%",
      "height": "166",
      "scrolling": "no",
      "frameborder": "no"
    }
  })])])
},staticRenderFns: []}

/***/ }),
/* 893 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "course-content"
  }, [_c('div', {
    staticClass: "course-content--header block"
  }, [_c('h1', {
    staticClass: "content-title"
  }, [_vm._v(_vm._s(((_vm.content.slug) + " coming soon")))]), _c('h2', {
    staticClass: "content-subtitle"
  }, [_vm._v(_vm._s(_vm.releaseAt))]), _c('div', {
    staticClass: "pure-button",
    attrs: {
      "name": "circle"
    },
    on: {
      "click": _vm.jumpForwardInTime
    }
  }, [_vm._v("Release Now")])])])
},staticRenderFns: []}

/***/ }),
/* 894 */,
/* 895 */,
/* 896 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "course-content"
  }, [_c('div', {
    staticClass: "course-content--header block"
  }, [_c('h1', {
    staticClass: "content-title"
  }, [_vm._v(_vm._s(_vm.content.title))]), _c('p', {
    staticClass: "content-description"
  }, [_vm._v(_vm._s(_vm.content.description))]), _c('a', {
    staticClass: "pure-button",
    attrs: {
      "href": "https://twitter.com"
    }
  }, [_vm._v("Get in Touch")])])])
},staticRenderFns: []}

/***/ }),
/* 897 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (!_vm.isRegistered) ? _c('div', {
    staticClass: "course-content",
    attrs: {
      "id": "join-banner"
    }
  }, [_c('div', {
    staticClass: "course-content--header"
  }, [_c('h1', {
    staticClass: "content-title"
  }, [_vm._v("Ready to join the class?")]), _c('div', {
    staticClass: "auth-button-wrapper"
  }, [_c('div', {
    staticClass: "pure-button pure-button-twitter",
    on: {
      "click": _vm.attemptAuth
    }
  }, [_vm._v("Login with Twitter")])])])]) : _vm._e()
},staticRenderFns: []}

/***/ }),
/* 898 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "markdown-link"
  }, [(_vm.isRegistered) ? _c('router-link', {
    staticClass: "pure-button",
    attrs: {
      "to": _vm.url
    }
  }, [_vm._v(_vm._s(_vm.$t('common.explore_content'))), _c('icon', {
    staticClass: "angle-icon",
    attrs: {
      "name": "angle-right"
    }
  })], 1) : _c('div', {
    staticClass: "pure-button",
    on: {
      "click": function($event) {
        _vm.showAuth()
      }
    }
  }, [_vm._v(_vm._s(_vm.$t('common.explore_content'))), _c('icon', {
    staticClass: "angle-icon",
    attrs: {
      "name": "angle-right"
    }
  })], 1)], 1)
},staticRenderFns: []}

/***/ }),
/* 899 */,
/* 900 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    ref: "timeSegment",
    staticClass: "time-segment",
    class: {
      peek: _vm.segmentPeeking, current: _vm.isCurrent, opened: _vm.segmentOpened
    },
    style: ([{
      top: ((158.0 * _vm.index) + "px")
    }, _vm.segmentStyle])
  }, [_c('div', {
    staticClass: "primary-wrapper",
    on: {
      "click": function($event) {
        _vm.peek()
      }
    }
  }, [_c('div', {
    staticClass: "subtitle-wrapper"
  }, [_vm._m(0)], 1), _c('div', {
    staticClass: "message-wrapper"
  }, [(_vm.message.info && (_vm.message.info.total > 0) && !_vm.message.message.suggestion) ? _c('message', {
    attrs: {
      "message": _vm.message.message
    }
  }) : _vm._e(), (_vm.message.message && _vm.message.message.suggestion) ? _vm._m(1) : _vm._e(), (_vm.message.loading || (_vm.message.info && (_vm.message.info.total === 0 && !_vm.message.message.suggestion))) ? _vm._m(2) : _vm._e()], 1), _c('div', {
    staticClass: "clearfix"
  })]), (_vm.segmentPeeking) ? _c('div', {
    staticClass: "segment-expansion-bar",
    on: {
      "click": function($event) {
        _vm.openSegment()
      }
    }
  }, [(_vm.message.info && _vm.message.info.total && (_vm.message.info.total > 1)) ? _c('span', [_vm._v(_vm._s(("Read " + (_vm.message.info.total) + " other notes")))]) : (_vm.message.info && _vm.message.info.total && (_vm.message.info.total > 0)) ? _c('span', [_vm._v(_vm._s("Read all notes"))]) : _c('span', [_vm._v("Be the first to make a note.")])]) : _vm._e(), _c('div', {
    staticClass: "meta-container",
    class: {
      active: _vm.segmentOpened
    }
  }, [(_vm.loadingMessages) ? _c('div', {
    staticClass: "status-indicator"
  }, [_vm._v("Looking for notes...")]) : _vm._e(), (!_vm.loadingMessages && (_vm.orderedMessages.length === 0)) ? _c('div', {
    staticClass: "status-indicator",
    on: {
      "click": _vm.loadSegmentMessages
    }
  }, [_vm._v("Be the first to make a note.")]) : _vm._e(), _vm._l((_vm.orderedMessages), function(segmentMessage) {
    return _c('div', {
      staticClass: "message-wrapper animated fadeIn",
      class: {
        featured: (segmentMessage.id === _vm.message.message.id)
      }
    }, [_c('message', {
      attrs: {
        "message": segmentMessage
      }
    })], 1)
  })], 2), (_vm.segmentPeeking || _vm.segmentOpened) ? _c('div', {
    staticClass: "quick-note"
  }, [_c('message-composer')], 1) : _vm._e(), _c('div', {
    staticClass: "clearfix"
  })])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('subtitle', {
    attrs: {
      "subtitle": _vm.subtitle
    }
  })
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "suggestion"
  }, [_c('h3', [_vm._v("\"" + _vm._s(_vm.message.message.text) + "\"")])])
},function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('mock-message', {
    attrs: {
      "message": _vm.message
    }
  })
}]}

/***/ }),
/* 901 */,
/* 902 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "md-thumbnail-row"
  }, [_vm._l((_vm.thumbnails), function(thumbnail) {
    return _c('router-link', {
      key: thumbnail.link,
      attrs: {
        "to": thumbnail.link
      }
    }, [_c('div', {
      staticClass: "md-thumbnail",
      style: ({
        'background-image': ("url('" + (thumbnail.image) + "')")
      })
    }, [_c('div', {
      staticClass: "md-thumbnail-caption"
    }, [_vm._v(_vm._s(thumbnail.caption))])])])
  }), _c('div', {
    staticClass: "clearfix"
  })], 2)
},staticRenderFns: []}

/***/ }),
/* 903 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "message"
  }, [_c('img', {
    staticClass: "profile-image",
    attrs: {
      "src": _vm.message.author.profile
    }
  }), _c('a', {
    staticClass: "author-label",
    attrs: {
      "href": _vm.authorLink,
      "target": "_blank"
    }
  }, [_vm._v(_vm._s(_vm.message.author.account))]), _c('p', {
    staticClass: "message-content",
    domProps: {
      "innerHTML": _vm._s(_vm.html)
    }
  }), _c('div', {
    staticClass: "message--footer"
  }, [_c('ul', {
    staticClass: "tweet-actions"
  }, [_c('li', [_c('a', {
    attrs: {
      "href": _vm.likeLink,
      "target": "_blank"
    }
  }, [_c('icon', {
    attrs: {
      "name": "heart"
    }
  })], 1)]), _c('li', [_c('a', {
    attrs: {
      "href": _vm.retweetLink,
      "target": "_blank"
    }
  }, [_c('icon', {
    attrs: {
      "name": "retweet"
    }
  })], 1)]), _c('li', [_c('a', {
    attrs: {
      "href": _vm.replyLink,
      "target": "_blank"
    }
  }, [_c('icon', {
    attrs: {
      "name": "reply"
    }
  })], 1)]), _c('li', {
    staticClass: "hidden"
  }, [_c('a', {
    attrs: {
      "href": _vm.tweetLink,
      "target": "_blank"
    }
  }, [_c('icon', {
    attrs: {
      "name": "twitter"
    }
  })], 1)]), _c('li', {
    staticClass: "message-timestamp"
  }, [_vm._v(_vm._s(_vm.timeStamp))]), _c('div', {
    staticClass: "clearfix"
  })])])])
},staticRenderFns: []}

/***/ }),
/* 904 */,
/* 905 */,
/* 906 */,
/* 907 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "subtitle"
  }, [_c('h1', {
    domProps: {
      "innerHTML": _vm._s(_vm.subtitle)
    }
  })])
},staticRenderFns: []}

/***/ }),
/* 908 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "course-page"
  }, [_c('div', {
    ref: "main",
    staticClass: "col",
    attrs: {
      "id": "col-main"
    }
  }, [_c('div', {
    staticClass: "main-container"
  }, [_c('class-selector'), _c('course-content', {
    attrs: {
      "course-content": _vm.courseContent
    }
  })], 1)])])
},staticRenderFns: []}

/***/ }),
/* 909 */,
/* 910 */,
/* 911 */,
/* 912 */,
/* 913 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "class-selector"
  }, [_c('div', {
    directives: [{
      name: "show",
      rawName: "v-show",
      value: (_vm.activeClass && _vm.course && _vm.course.classes),
      expression: "activeClass && course && course.classes"
    }],
    staticClass: "class-selector-wrapper"
  }, [_c('transition', {
    attrs: {
      "name": "fade"
    }
  }, [(_vm.offset > 0) ? _c('div', {
    staticClass: "skip-button skip-button--left",
    on: {
      "click": _vm.scrollLeft
    }
  }, [_c('icon', {
    attrs: {
      "name": "angle-left"
    }
  })], 1) : _vm._e()]), _c('transition', {
    attrs: {
      "name": "fade"
    }
  }, [(_vm.remainingOffset > 0) ? _c('div', {
    staticClass: "skip-button skip-button--right",
    on: {
      "click": _vm.scrollRight
    }
  }, [_c('icon', {
    attrs: {
      "name": "angle-right"
    }
  })], 1) : _vm._e()]), _c('div', {
    directives: [{
      name: "scroll",
      rawName: "v-scroll",
      value: (_vm.onScroll),
      expression: "onScroll"
    }],
    ref: "classselector",
    staticClass: "class-selector-container"
  }, [(_vm.course && _vm.course.classes) ? _c('ul', {
    staticClass: "class-selector",
    style: ({
      left: (_vm.leftPos + "px"),
      width: (_vm.theWidth + "px")
    })
  }, [_c('li', {
    staticClass: "class-selector--item released",
    class: {
      active: (_vm.activeClass === 'intro')
    },
    attrs: {
      "id": "intro-item"
    },
    on: {
      "click": function($event) {
        _vm.viewIntroClass()
      }
    }
  }, [_c('h1', {
    staticClass: "class-selector--item--header"
  }, [_c('icon', {
    attrs: {
      "name": "info"
    }
  })], 1)]), _vm._l((_vm.course.classes), function(theClass, index) {
    return _c('li', {
      key: theClass.name,
      ref: "class",
      refInFor: true,
      staticClass: "class-selector--item",
      class: ( _obj = {
        active: (_vm.activeClass === theClass.slug)
      }, _obj[theClass.status.toLowerCase()] = true, _obj ),
      on: {
        "click": function($event) {
          _vm.setCurrentClass(theClass.slug)
        }
      }
    }, [_c('h1', {
      staticClass: "class-selector--item--header"
    }, [_vm._v(_vm._s(theClass.title))]), (theClass.status === 'CURRENT') ? _c('icon', {
      staticClass: "status-indicator",
      attrs: {
        "name": "check-circle"
      }
    }) : _vm._e(), (theClass.status === 'FUTURE') ? _c('icon', {
      staticClass: "status-indicator",
      attrs: {
        "name": "lock"
      }
    }) : _vm._e()], 1)
    var _obj;
  }), _c('div', {
    staticClass: "clearfix"
  })], 2) : _vm._e()]), _vm._l((5), function(n) {
    return _c('div', {
      staticClass: "loading-wrapper"
    }, [_c('div', {
      staticClass: "padded-container mock-container",
      style: ({
        height: (((5 - n) * 50) + "px")
      })
    })])
  })], 2)])
},staticRenderFns: []}

/***/ }),
/* 914 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', [_c('div', {
    staticClass: "rendered-markdown",
    domProps: {
      "innerHTML": _vm._s(_vm.renderedMarkdown)
    }
  })])
},staticRenderFns: []}

/***/ }),
/* 915 */,
/* 916 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "media-carousel-wrapper"
  }, [_c('swiper', {
    attrs: {
      "options": _vm.swiperOption
    }
  }, [_vm._l((_vm.media), function(item, key) {
    return _c('swiper-slide', {
      key: key
    }, [_c('img', {
      staticClass: "swiper-lazy",
      attrs: {
        "data-src": ("https://" + (_vm.course.slug) + ".connectedacademy.io/course/content/media/medium/" + (item.image))
      }
    }), _c('div', {
      staticClass: "swiper-lazy-preloader swiper-lazy-preloader-white"
    })])
  }), _c('div', {
    staticClass: "swiper-button-prev",
    attrs: {
      "slot": "button-prev"
    },
    slot: "button-prev"
  }), _c('div', {
    staticClass: "swiper-button-next",
    attrs: {
      "slot": "button-next"
    },
    slot: "button-next"
  })], 2)], 1)
},staticRenderFns: []}

/***/ }),
/* 917 */,
/* 918 */,
/* 919 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.content.submissions && _vm.content.submissions.length > 0) ? _c('div', {
    staticClass: "submission-grid-wrapper"
  }, [_c('p', {
    staticClass: "content-description"
  }, [_vm._v("You have made " + _vm._s(_vm.content.submissions.length) + " submission(s)")])]) : _vm._e()
},staticRenderFns: []}

/***/ }),
/* 920 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "course-content-wrapper"
  }, [(_vm.isIntroduction) ? _c('div', {
    staticClass: "course-content-group"
  }, [(_vm.infoMarkdown) ? _c('div', {
    staticClass: "course-content"
  }, [_vm._m(0), _c('div', {
    staticClass: "course-content--body"
  }, [_c('markdown-renderer', {
    attrs: {
      "markdown-url": _vm.infoMarkdown
    }
  }), _c('four-corners-link', {
    attrs: {
      "message": "During this course you will use FourCorners to submit images as 'homework', this will allow you to add rich metadata to your images."
    }
  })], 1)]) : _vm._e(), _c('join-banner')], 1) : _c('div', {
    staticClass: "course-content-wrapper"
  }, [_c('div', {
    staticClass: "course-content-group"
  }, [_c('join-banner')], 1), _vm._l((_vm.releasedContent), function(content, index) {
    return _c('div', {
      staticClass: "course-content-group",
      class: ( _obj = {
        optional: content.optional
      }, _obj[content.status.toLowerCase()] = true, _obj )
    }, [(content.content_type === 'question') ? _c('injected-question', {
      attrs: {
        "slug": content.slug
      }
    }) : (content.expectsubmission) ? _c('homework', {
      attrs: {
        "content": content
      }
    }) : (content.fourcornersintro) ? _c('four-corners') : (content.content_type === 'class') ? _c('live-class', {
      attrs: {
        "content": content,
        "id": 'course-content-' + content.slug
      }
    }) : _c('div', {
      staticClass: "course-content",
      class: {
        optional: content.optional
      },
      attrs: {
        "id": 'course-content-' + content.slug
      }
    }, [_c('like-indicator', {
      attrs: {
        "content-slug": content.slug,
        "class-slug": _vm.currentClass.slug,
        "haveliked": content.haveliked,
        "likes": content.likes,
        "has-liked": content.haveliked,
        "like-count": content.likes
      },
      on: {
        "update:hasLiked": function($event) {
          content.haveliked = $event
        },
        "update:likeCount": function($event) {
          content.likes = $event
        }
      }
    }), _c('div', {
      staticClass: "course-content--header"
    }, [(content.title) ? _c('h1', {
      staticClass: "content-title"
    }, [_vm._v(_vm._s(content.title))]) : _vm._e()]), _c('div', {
      staticClass: "course-content--body"
    }, [(content.description) ? _c('p', {
      staticClass: "content-description"
    }, [_c('markdown-content', {
      attrs: {
        "markdown": content.description
      }
    })], 1) : _vm._e(), (content.thumbnails) ? _c('media-thumbnails', {
      attrs: {
        "thumbnails": content.thumbnails
      }
    }) : _vm._e(), (content.carousel) ? _c('media-carousel', {
      attrs: {
        "media": content.carousel
      }
    }) : _vm._e(), (content.video && (content.content_type !== 'class')) ? _c('video-embed', {
      attrs: {
        "video-src": content.video,
        "content-type": content.content_type
      }
    }) : _vm._e(), (content.soundcloud && (content.content_type !== 'class')) ? _c('soundcloud-embed', {
      attrs: {
        "soundcloud-src": content.soundcloud
      }
    }) : _vm._e(), (content.content_type === 'webinar') ? _c('webinar-message-ticker', {
      attrs: {
        "class-slug": _vm.currentClass.slug,
        "content-slug": content.slug
      }
    }) : _vm._e(), (content.content_type === 'webinar') ? _c('message-composer', {
      attrs: {
        "section": content.slug
      }
    }) : _vm._e()], 1), ((content.expectsubmission || (content.url && !content.thumbnails))) ? _c('div', {
      staticClass: "course-content--footer"
    }, [(content.url && !content.thumbnails) ? _c('markdown-link', {
      staticClass: "pull-right",
      attrs: {
        "md-content": content
      }
    }) : _vm._e(), _c('div', {
      staticClass: "clearfix"
    })], 1) : _vm._e()], 1)], 1)
    var _obj;
  }), _vm._l((_vm.futureContent), function(content, index) {
    return _c('div', {
      directives: [{
        name: "show",
        rawName: "v-show",
        value: (index === 0),
        expression: "index === 0"
      }],
      staticClass: "course-content-group course-content-group--future",
      class: ( _obj = {
        optional: content.optional
      }, _obj[content.status.toLowerCase()] = true, _obj )
    }, [(content.content_type !== 'nextclass') ? _c('future-content', {
      attrs: {
        "content": content
      }
    }) : _vm._e(), (content.content_type === 'nextclass') ? _c('next-class', {
      attrs: {
        "content": content
      }
    }) : _vm._e()], 1)
    var _obj;
  })], 2)])
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "course-content--header"
  }, [_c('h1', {
    staticClass: "content-title"
  }, [_vm._v("About the course")])])
}]}

/***/ }),
/* 921 */
/***/ (function(module, exports) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return (_vm.isRegistered && !_vm.hidden) ? _c('div', {
    ref: "question",
    staticClass: "course-content hidden",
    attrs: {
      "id": "wrapper"
    }
  }, [_vm._m(0), (_vm.question && !_vm.question.alreadyanswered) ? _c('div', {
    staticClass: "course-content--body animated fadeIn"
  }, [_c('p', {
    staticClass: "content-description"
  }, [_vm._v(_vm._s(_vm.question.text))]), (_vm.question.response_type === 'scale') ? _c('div', {
    staticClass: "vue-slider-wrapper"
  }, [_c('vue-slider', {
    ref: "slider",
    attrs: {
      "min": 0,
      "max": 5,
      "tooltip-style": {
        'background-color': '#0078E7',
        'border-top-color': '#0078E7'
      },
      "bg-style": {
        'background-color': '#d9d9d9'
      },
      "process-style": {
        'background-color': '#d9d9d9'
      }
    },
    model: {
      value: (_vm.answer),
      callback: function($$v) {
        _vm.answer = $$v
      },
      expression: "answer"
    }
  })], 1) : _vm._e(), (_vm.question.response_type === 'text') ? _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.answer),
      expression: "answer"
    }],
    staticClass: "full-width",
    attrs: {
      "type": "text"
    },
    domProps: {
      "value": (_vm.answer)
    },
    on: {
      "input": function($event) {
        if ($event.target.composing) { return; }
        _vm.answer = $event.target.value
      }
    }
  }) : _vm._e(), (_vm.question.response_type === 'boolean') ? _c('input', {
    directives: [{
      name: "model",
      rawName: "v-model",
      value: (_vm.answer),
      expression: "answer"
    }],
    staticClass: "full-width",
    attrs: {
      "type": "checkbox"
    },
    domProps: {
      "checked": Array.isArray(_vm.answer) ? _vm._i(_vm.answer, null) > -1 : (_vm.answer)
    },
    on: {
      "__c": function($event) {
        var $$a = _vm.answer,
          $$el = $event.target,
          $$c = $$el.checked ? (true) : (false);
        if (Array.isArray($$a)) {
          var $$v = null,
            $$i = _vm._i($$a, $$v);
          if ($$el.checked) {
            $$i < 0 && (_vm.answer = $$a.concat([$$v]))
          } else {
            $$i > -1 && (_vm.answer = $$a.slice(0, $$i).concat($$a.slice($$i + 1)))
          }
        } else {
          _vm.answer = $$c
        }
      }
    }
  }) : _vm._e()]) : _vm._e(), _c('div', {
    staticClass: "course-content--footer"
  }, [_c('div', {
    staticClass: "pure-button pure-button-subtle pure-button-text",
    on: {
      "click": function($event) {
        _vm.hidden = true
      }
    }
  }, [_vm._v("Maybe later")]), _c('div', {
    staticClass: "pure-button pull-right",
    on: {
      "click": _vm.postAnswer
    }
  }, [_vm._v("Answer")])])]) : _vm._e()
},staticRenderFns: [function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    staticClass: "course-content--header"
  }, [_c('h1', {
    staticClass: "content-title"
  }, [_vm._v("Question")])])
}]}

/***/ }),
/* 922 */
/***/ (function(module, exports, __webpack_require__) {

module.exports={render:function (){var _vm=this;var _h=_vm.$createElement;var _c=_vm._self._c||_h;
  return _c('div', {
    class: {
      expanded: _vm.expanded
    },
    attrs: {
      "id": "fourcorners-banner"
    }
  }, [_c('div', {
    attrs: {
      "id": "tile-wrapper"
    }
  }, [_c('div', {
    staticClass: "tile",
    attrs: {
      "id": "info-tile"
    }
  }, [(_vm.expanded && (_vm.currentCorner !== 'default')) ? _c('h1', [_vm._v(_vm._s(_vm.corners[_vm.currentCorner].title))]) : _vm._e(), (!_vm.expanded || (_vm.currentCorner === 'default')) ? _c('img', {
    attrs: {
      "src": __webpack_require__(606),
      "height": "20"
    }
  }) : _vm._e(), _c('p', [_vm._v(_vm._s((_vm.expanded) ? _vm.corners[_vm.currentCorner].text : _vm.bannerText))]), (_vm.expanded) ? _c('div', {
    staticClass: "buttons"
  }, [(_vm.currentCorner !== 'default') ? _c('router-link', {
    staticClass: "pure-button pure-button-subtle",
    attrs: {
      "to": "/fourcorners"
    }
  }, [_vm._v("Learn More")]) : _vm._e(), (_vm.currentCorner === 'default') ? _c('div', {
    staticClass: "pure-button pure-button-subtle",
    on: {
      "click": function($event) {
        _vm.currentCorner = 'default';
        _vm.expanded = false
      }
    }
  }, [_vm._v("Minimize")]) : _vm._e()], 1) : _vm._e()]), _c('div', {
    attrs: {
      "id": "corners"
    }
  }, [_c('div', {
    staticClass: "corner",
    class: {
      active: _vm.currentCorner === 'topLeft'
    },
    attrs: {
      "id": "corner-top-left"
    },
    on: {
      "click": function($event) {
        _vm.toggleCorner('topLeft')
      }
    }
  }), _c('div', {
    staticClass: "corner",
    class: {
      active: _vm.currentCorner === 'topRight'
    },
    attrs: {
      "id": "corner-top-right"
    },
    on: {
      "click": function($event) {
        _vm.toggleCorner('topRight')
      }
    }
  }), _c('div', {
    staticClass: "corner",
    class: {
      active: _vm.currentCorner === 'bottomLeft'
    },
    attrs: {
      "id": "corner-bottom-left"
    },
    on: {
      "click": function($event) {
        _vm.toggleCorner('bottomLeft')
      }
    }
  }), _c('div', {
    staticClass: "corner",
    class: {
      active: _vm.currentCorner === 'bottomRight'
    },
    attrs: {
      "id": "corner-bottom-right"
    },
    on: {
      "click": function($event) {
        _vm.toggleCorner('bottomRight')
      }
    }
  })])])])
},staticRenderFns: []}

/***/ })
]));
//# sourceMappingURL=0.46bfb018bc321509b71e.js.map