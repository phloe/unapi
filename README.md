![unapi](http://cdn.memegenerator.net/instances/400x/34267514.jpg)

unapi
=====

Experiment exposing an API as:

* wrapper-style (jQuery, zepto etc).
* extended element prototypes (Prototype, MooTools etc).
* namespaced generics (YUI, dojo etc).

**ALL** at the same time!

#### Example

```js
// wrapper style
unapi(document.body).addClass("foo");

// extended element prototype
document.body.addClass("bar");

// namespaced generics
unapi.removeClass(document.body, "foo");
```
