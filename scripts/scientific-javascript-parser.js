(function(exports) {

    if (require) sweet = require('sweet.js')

    // The grammar wraps all the math calls in functions, so we define the functions
    // for all objects
    const objMathFunc = 
    `
    Object.prototype.mul = function(other){ return this * other; }
    Object.prototype.div = function(other){ return this / other; }
    Object.prototype.add = function(other){ return this + other; }
    Object.prototype.sub = function(other){ return this - other; }
    Object.prototype.pow = function(other){ throw "Can\'t use power on a non-value" }

    Object.prototype.eq = function(other){ return this == other; }
    Object.prototype.same = function(other){ return this === other; }
    Object.prototype.lt = function(other){ return this < other; }
    Object.prototype.lte = function(other){ return this <= other; }
    Object.prototype.gt = function(other){ return this > other; }
    Object.prototype.gte = function(other){ return this >= other; }
    `;


    const removeObjMathFunc = 
    `
    delete Object.prototype.mul;
    delete Object.prototype.div;
    delete Object.prototype.add;
    delete Object.prototype.sub;
    delete Object.prototype.pow;

    delete Object.prototype.eq;
    delete Object.prototype.same;
    delete Object.prototype.lt;
    delete Object.prototype.lte;
    delete Object.prototype.gt;
    delete Object.prototype.gte;
    `;


    exports.parse = function(code, ...steps) {
        // store the strings in a side table before prcessing
        // to avoid replace this patterns in strings
        let sideTable = [];
        code = code.replace(
            /"(?:[^"\\]|\\.)*"/g,
            function (_) {
              var index = sideTable.length;
              sideTable[index] = _;
              return '"' + index + '"';
            });
        code = code.replace(/\b<([A-Z,a-z,0-9,*\/+-^]+)>/g, '<"$1">');
        code = code.replace(/"(\d+)"/g,
            function (_, index) {
              return sideTable[index];
            });

        // Replace all non-unitted numbers
        // Changed the sidetable to use push / shift
        // here because the strings may have numbers in them
        // we is what we are regexing for
        sideTable = [];
        code = code.replace(
            /"(?:[^"\\]|\\.)*"/g,
            function (_) {
              sideTable.push(_);
              return '"|"';
            });

        // fix all scalar numbers to have "blank" units (100->100<"">)
        code = code.replace(/([-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?)(<"(\|)">)?/g, '$1<"$4">');
        code = code.replace(/(function((\s+\S+)|\s*)\()(.*)(\)\s*[\n.\r]*{(\n|.)*})/g,
            function(all, func,_1,_2,param,body){
                param = param.replace(/\s*(\w+)(<"([^"<>]*)">)?\s*/g, '$1<"$3">');
                console.log(func + param + body);
                return func + param + body;
            });

        code = code.replace(/"\|"/g,
            function (_, index) {
                var val = sideTable.shift();
                return val;
            });

        console.log(code);

        steps.forEach(step => {
            code = `${step}\n${code}`;
            code = sweet.compile(code).code;
        })

        code = `
            ${objMathFunc}
            let err = null
            try{
                ${code} 
            }catch(e) {
                err = e;
            }
            ${removeObjMathFunc}

            if (err) throw err;
            `
        return code;
    }



})(typeof window !== 'undefined' ? window.SJSParser = {} : module.exports = {})