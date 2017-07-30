{
  function p(s){ console.log(s);}

  function toNum(arr){ return parseInt(arr.join("")); }
}

start
  = statement

whitespace
  = "\t"+ { return ""; }
  / " "+ { return ""; }

ws
  = whitespace*

unitChar
  = unit:[A-Z,a-z,0-9,^]+ { return unit.join(""); }

statement 
  = left:varDef endLine right:statement { return left + ";\n" + right; }
  / left:setVar endLine right:statement { return left + ";\n" + right; }
  / left:print endLine right:statement { return left + ";\n" + right; }
  / empty statement:statement { return statement; }
  / endLine

commentChar
  = [A-Z,a-z,0-9,!@#$%^&*()_+-=]
  / " "
  / "\t"

comment
  = "//" comment:commentChar*  "\n" { return "";}

print
  = "print(" name:variableName units:wrappedUnits ")" { return "console.log(" + name + ".toString('" + units + "'))"; }

empty
  = "\n"+ { return "" }
  / " "+ { return "" }
  / "\t"+ { return "" }
  / comment

endLine
  = ";" "\n"*
  /

varDef
  = "var" ws set:setVar { return "var " + set; }

setVar
  = name:variableName ws "=" ws val:additive { return name + " = " + val; }

additive
  = left:multiplicative ws "+" ws right:additive { return left + ".add(" + right + ")"; }
  / left:multiplicative ws "-" ws right:additive { return left + ".sub(" + right + ")"; }
  / multiplicative

multiplicative
  = left:power ws "*" ws right:multiplicative { return left + ".mul(" + right + ")"; }
  / left:power ws "/" ws right:multiplicative { return left + ".div(" + right + ")"; }
  / power

power
  = left:primary "^" right:number { return left + ".pow(" + right + ")"; }
  / primary

primary
  = value
  / number
  / variableNameWithUnits
  / variableName
  / "(" ws additive:additive ws ")" { return additive; }

value
  = num:number+ unit:wrappedUnits { return "Qty('" + num + unit + "')" }

variableName
  = name:[A-Z,a-z]+ { return name.join(""); }

variableNameWithUnits
  = name:variableName unit:wrappedUnits { return name + ".to('"+unit+"')"; }

number
  = whole:[0-9]+ "." dec:[0-9]+ { return toNum(whole) + "." + toNum(dec); }
  / whole:[0-9]+ { return parseInt(whole.join("")); }

unit
  = unitNum:unitChar "/" unitDen:unitChar { return unitNum + "/" + unitDen; }
  / leftUnit:unitChar " " rightUnit:unit { return leftUnit + "*" + rightUnit; }
  / leftUnit:unitChar "*" rightUnit:unit { return leftUnit + "*" + rightUnit; }
  / unit:unitChar { return unit }

wrappedUnits
  = "<" unit:unit+ ">" { return unit; }
