define('ace/mode/scientific-javascript', function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    // defines the parent mode
    var TextMode = require("./text").Mode;
    var Tokenizer = require("../tokenizer").Tokenizer;

    // defines the language specific highlighters and folding rules
    var MyNewHighlightRules = require("./scientific-javascript-highlight-rules").MyNewHighlightRules;

    var Mode = function() {
        // set everything up
        this.HighlightRules = MyNewHighlightRules;
    };
    oop.inherits(Mode, TextMode);

    (function() {
        // configure comment start/end characters
        this.lineCommentStart = "//";
        this.blockComment = {start: "/*", end: "*/"};
        
        // special logic for indent/outdent. 
        // By default ace keeps indentation of previous line
        this.getNextLineIndent = function(state, line, tab) {
            var indent = this.$getIndent(line);
            return indent;
        };
        
        // create worker for live syntax checking
        this.createWorker = function(session) {
            var worker = new WorkerClient(["ace"], "ace/mode/mynew_worker", "NewWorker");
            worker.attachToDocument(session.getDocument());
            worker.on("errors", function(e) {
                session.setAnnotations(e.data);
            });
            return worker;
        };
        
    }).call(Mode.prototype);

    exports.Mode = Mode;
});




define('ace/mode/scientific-javascript-highlight-rules', function(require, exports, module) {
    "use strict";

    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;

    var MyNewHighlightRules = function() {
        var numUnitFunction = function(){ return ["number","unit"];}

        // regexp must not have capturing parentheses. Use (?:) instead.
        // regexps are ordered -> the first match is used
       this.$rules = {
            "start" : [
                {
                    token: "units",
                    regex: "<[^<>]*>"
                },
                {
                    token: "kw",
                    regex: "\\b(?:var|let|const|print)"
                },
                {
                    token: "cmt",
                    regex: "//.*"
                },
                {
                    token: "exponent",
                    regex: "\\^[0-9]+"
                },
                {
                    token: "num",
                    regex: "\\b([0-9]*.[0-9]+|[0-9]+)"
                }
            ]
        };
    };

    oop.inherits(MyNewHighlightRules, TextHighlightRules);

    exports.MyNewHighlightRules = MyNewHighlightRules;
});