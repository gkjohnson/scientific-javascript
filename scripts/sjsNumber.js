/*
Object.prototype.$mul = Object.prototype.mul;
Object.prototype.$div = Object.prototype.div;
Object.prototype.$add = Object.prototype.add;
Object.prototype.$sub = Object.prototype.sub;
Object.prototype.$pow = Object.prototype.pow;

Object.prototype.$eq = Object.prototype.eq;
Object.prototype.$same = Object.prototype.same;
Object.prototype.$lt = Object.prototype.lt;
Object.prototype.$lte = Object.prototype.lte;
Object.prototype.$gt = Object.prototype.gt;
Object.prototype.$gte = Object.prototype.gte;
*/
console.$log = console.log;
console.log = function()
{
    for(var i in arguments)
    {
        if( arguments[i] instanceof Qty )
        {
            arguments[i] = arguments[i].toString();
        }
    }
    console.$log.apply(console, arguments);
}

// MATH Functions
function log(n)
{
    WrapQty(n,"");
    return "TEST";
}

// Handles unit and value creation
// Passes non-number values through, validating if necessary
WrapQty = function(val, unit)
{
    unit = unit || "";

    // validate that all elements in an array have units
    // in the same dimension 
    function validateArray( arr, unit )
    {
        for( var i = 0 ; i < arr.length ; i ++ ){
            var el = arr[i];
            if( el instanceof Array )
            {
                validateArray(el, unit);
            }
            else if( el instanceof Qty )
            {
                el.to(unit);
            }
            else
            {
                throw "Can't apply units to objects when asserting array units";
            }
        }
    }

    // Temporarily treat undefined and null as zeroes
    if( val === undefined || val === null ){
        val = 0;
    }
    // If it's already a unit number, valide the 
    // unit and pass it through
    if( val instanceof Qty ){
        val = val.to(unit);
        return val;
    }
    // If it's an array, validate the elements against
    // the unit
    else if( val instanceof Array )
    {
        if( unit ){
            validateArray(val, unit);
        }
        return val
    }
    // If it's a string with unit, try to parse it into
    // a full value, otherwise pass it through
    else if( val instanceof String || typeof val === "number" || typeof val === "string")
    {
        var qtyStr = val + (unit?unit:"");

        try
        {
            // uses toBase, which creates a new Qty so that
            // units aren't whack when printing
            return Qty( qtyStr ).toBase();
        }
        catch(e)
        {
            console.log(e, typeof val,unit,qtyStr);
            if( unit ){
                throw "Can't apply units to objects";
            }
            return val;
        }
    }

}
