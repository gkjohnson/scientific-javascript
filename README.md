# scientific-javascript
A prototype, proof of concept project that adds syntactic sugar for unit notation to Javascript using Sweet.js. The addition allows for adding units to numbers and automatic unit conversion when performing mathematical operations. Inspired by working with engineers modeling complex systems with manual unit conversion, making it difficult to trace.

This is purely a prototype and should not be considered useable in any kind of real work.

## Syntax
### Units
A unit type is denoted by appending `<unit>` to the value.

### Example
![example](/docs/example.png)

*Gotta love that floating point precision*

## Next Steps
The approach used to process the syntax is particularly hacky and involves a few regex replaces and two Sweet.js compilations in order to get to runnable javascript code. This syntax doesn't seem to be achieveable with the new version of Sweet.js, either.

The better way to handle this is to extend a library that generates an AST, such as [Acorn.js](https://github.com/ternjs/acorn) or [ESPrima](http://esprima.org/) and use something like [ESCodeGen](https://github.com/estools/escodegen) write the javascript back out. Alternatively, a new language could be written with [LLVM](https://llvm.org/) to support this in a more robust fashion.

## How to Run
Run `npm install` in the directory

Run `node app.js`

Load `locahost:3000`
