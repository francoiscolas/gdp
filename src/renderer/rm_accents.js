'use strict';

let rmAccents = function (str) {
  var accents = {
    "á": "a",
    "à": "a",
    "â": "a",
    "ä": "a",
    "ç": "c",
    "é": "e",
    "è": "e",
    "ê": "e",
    "ë": "e",
    "î": "i",
    "ï": "i",
    "ô": "o",
    "ö": "o",
    "ù": "u",
    "û": "u",
    "ü": "u",
    "Â": "A",
    "Ä": "A",
    "À": "A",
    "Ç": "C",
    "Ê": "E",
    "Ë": "E",
    "É": "E",
    "È": "E",
    "Î": "I",
    "Ï": "I",
    "Ô": "O",
    "Ö": "O",
    "Û": "U",
    "Ü": "U",
    "Ù": "U"
  };

  for (var c in accents)
    str = str.replace(c, accents[c]);
  return str;
};

module.exports = rmAccents;
