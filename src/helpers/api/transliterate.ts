export function transliterate(word: string): string {
  var A: { [key: string]: string } = {};
  var result = "";

  A["Ё"] = "YO";
  A["Й"] = "I";
  A["Ц"] = "TS";
  A["У"] = "U";
  A["К"] = "K";
  A["Е"] = "E";
  A["Н"] = "N";
  A["Г"] = "G";
  A["Ш"] = "SH";
  A["Щ"] = "SCH";
  A["З"] = "Z";
  A["Х"] = "H";
  A["Ъ"] = "Y";
  A["ё"] = "yo";
  A["й"] = "i";
  A["ц"] = "ts";
  A["у"] = "u";
  A["к"] = "k";
  A["е"] = "e";
  A["н"] = "n";
  A["г"] = "g";
  A["ш"] = "sh";
  A["щ"] = "sch";
  A["з"] = "z";
  A["х"] = "h";
  A["ъ"] = "y";
  A["Ф"] = "F";
  A["Ы"] = "I";
  A["В"] = "V";
  A["А"] = "A";
  A["П"] = "P";
  A["Р"] = "R";
  A["О"] = "O";
  A["Л"] = "L";
  A["Д"] = "D";
  A["Ж"] = "ZH";
  A["Э"] = "E";
  A["ф"] = "f";
  A["ы"] = "i";
  A["в"] = "v";
  A["а"] = "a";
  A["п"] = "p";
  A["р"] = "r";
  A["о"] = "o";
  A["л"] = "l";
  A["д"] = "d";
  A["ж"] = "zh";
  A["э"] = "e";
  A["Я"] = "YA";
  A["Ч"] = "CH";
  A["С"] = "S";
  A["М"] = "M";
  A["И"] = "I";
  A["Т"] = "T";
  A["Ь"] = "Y";
  A["Б"] = "B";
  A["Ю"] = "YU";
  A["я"] = "ya";
  A["ч"] = "ch";
  A["с"] = "s";
  A["м"] = "m";
  A["и"] = "i";
  A["т"] = "t";
  A["ь"] = "y";
  A["б"] = "b";
  A["ю"] = "yu";

  for (var i = 0; i < word.length; i++) {
    var c = word.charAt(i);

    result += A[c] || c;
  }

  return result;
}
