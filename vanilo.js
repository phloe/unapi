(function (global, document, config) {
	
	if (config && typeof config.install == "function") {
		return; // vanilo already defined
	}
	
	var html = document.documentElement,
		match = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector || html.oMatchesSelector,
		API = {
		
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
		var parts = method.toString().match(/^function\s?(?:[^( ]+\s)?\(([^)]*)\)\s?\{((?:.|\n)*)\}$/);
		parts.shift();
		return parts;
	}
	
	function assemble (parts) {	
		return (1, eval)("(function(" + parts[0] + "){" + parts[1] + "})");
	}
	
	function wrap (parts) {
		var returnsThis = parts[1].match(/(?:^|\W)return this;/),
			b = [
				"var _that, _i = 0, _l = this.elements.length;",
				"while (_i < _l) {",
				"_that = this.elements[_i++];",
				parts[1]
				.replace(/(^|\W)return ([^;]+);/, returnsThis ? "$1" : "$1_results.push($2);")
				.replace(/(^|\W)this(\W|$)/g, "$1_that$2"),
				"}"
			];
		
		if (!returnsThis) {
			b.unshift("var _results = [];");
		}

		b.push("return " + (returnsThis ? "this" : "_results") + ";");

		parts[1] = b.join("\n");
		return assemble(parts);
	}
	
	function genericize (parts, that) {
		parts[0] = that + "," + parts[0];
		parts[1] = parts[1].replace(/(^|\W)this(\W|$)/g, "$1" + that + "$2");
		
		return assemble(parts);
	}
	
	
	function get (selector, parent) {
		return (parent || document).querySelectorAll(selector);
	}
	
	function vanilo (selector, parent) {
		var elements = (typeof selector == "string") ? get(selector, parent) : selector;
		return elements && new Vanilo(elements) || null;
	}
	
	function Vanilo (elements) {
		this.elements = (elements.nodeType == 1) ? [elements] : elements;
	}

	(function (prototype, parts) {
	
		for (var name in API) {
			if (API.hasOwnProperty(name)) {
				parts = disassemble(API[name]);
				prototype[name] = wrap(parts.slice(0));
				vanilo[name] = genericize(parts, "_that");
			}
		}
		
		Vanilo.prototype = prototype;
	} ({}));
		
	function install () {
		var prototype = global.Element && Element.prototype;
		if (prototype) {
			for (var name in API) {
				if (API.hasOwnProperty(name)) {
					prototype[name] = API[name];
				}
			}
		}
	}
	
	if (config && config.install) {
		install();
	}
	
	vanilo.install = install;
	
	global.vanilo = vanilo;
	
} (this, document, this.vanilo));