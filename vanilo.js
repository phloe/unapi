(function (global, document, config) {
	
	if (config && typeof config.install == "function") {
		return; // vanilo already defined
	}
	
	var prototype = global.Element && Element.prototype,
		html = document.documentElement,
		match = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector || html.oMatchesSelector,
		_prototype = {
		
			matches: function (selector) {
				return match.call(this, selector);
			},
	
			addClass: function (className) {
				var classList = this.className.split(/\s+/),
					index = classList.indexOf(className);
				
				if (index == -1) {
					classList.push(className);
					this.className = classList.join(" ");
				}
				
				return this;
			},
			
			removeClass: function (className) {
				var classList = this.className.split(/\s+/),
					index = classList.indexOf(className);
				
				if (index > -1) {
					classList.splice(index, 1);
					this.className = classList.join(" ");
				}
				
				return this;
			}
			
		};
	
	function disassemble (method) {
		var match = method.toString().match(/^function\s?(?:[^( ]+\s)?\(([^)]*)\)\s?\{((?:.|\n)*)\}$/);
		return {
			a: match[1].split(/\s*,\s*/),
			b: match[2]
		};
	}
	
	function assemble (parts) {	
		return (1, eval)("(function(" + parts.a.join(", ") + "){" + parts.b + "})");
	}
	
	function wrap (method) {
		var parts = disassemble(method),
			returnsThis = parts.b.match(/(?:^|\W)return this;/),
			b = [
				"var _that, _i = 0, _l = this.elements.length;",
				"while (_i < _l) {",
				"_that = this.elements[_i++];",
				parts.b
				.replace(/(^|\W)return ([^;]+);/, returnsThis ? "$1" : "$1_results.push($2);")
				.replace(/(^|\W)this(\W|$)/g, "$1_that$2"),
				"}"
			];
		
		if (!returnsThis) {
			b.unshift("var _results = [];");
		}

		b.push("return " + (returnsThis ? "this" : "_results") + ";");

		parts.b = b.join("\n");
		return assemble(parts);
	}
	
	function genericize (method, that) {
		var parts = disassemble(method);
		
		parts.b = parts.b.replace(/(^|\W)this(\W|$)/g, "$1" + that + "$2");
		parts.a.unshift(that);
		
		return assemble(parts);
	}
	
	
	function get (selector, parent) {
		return (parent || document).querySelectorAll(selector);
	}
	
	function vanilo (selector, parent) {
		var elements = (typeof selector == "string") ? get(selector, parent) : selector;
		return elements && new Vanilo(elements) || null;
	}
	
	var wrapperPrototype = {};
	
	for (var name in _prototype) {
		if (_prototype.hasOwnProperty(name)) {
			wrapperPrototype[name] = wrap(_prototype[name]);
			vanilo[name] = genericize(_prototype[name], "that");
		}
	}
	
	
	function Vanilo (elements) {
		this.elements = (elements.nodeType == 1) ? [elements] : elements;
	}
	
	Vanilo.prototype = wrapperPrototype;
		
	function install () {
		for (var name in _prototype) {
			if (_prototype.hasOwnProperty(name)) {
				prototype[name] = _prototype[name];
			}
		}
	}
	
	if (config && config.install) {
		install();
	}
	
	vanilo.install = install;
	
	global.vanilo = vanilo;
	
} (this, document, this.vanilo));