![unapi](http://cdn.memegenerator.net/instances/400x/34267514.jpg)

unapi
=====

Experiment exposing a DOM API as:

* wrapper-style (like jQuery, zepto etc).
* extended element prototypes (like Prototype, MooTools etc).
* namespaced generics (like YUI, dojo etc).

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
