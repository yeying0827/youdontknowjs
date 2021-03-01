Function.prototype.softBind = function(obj) {
	var fn = this;
	var curried = [].slice.call( arguments, 1 );
	var bound = function () {
		return fn.apply(
			(!this || this === (window /*|| global*/))?
				obj : this,
			curried.concat.apply( curried, arguments )
		);
	}
	bound.prototype = Object.create( fn.prototype );
	return bound;
};

function foo() {
	console.log( "name: " + this.name );
}

var obj1 = { name: 'obj1' },
	obj2 = { name: 'obj2' },
	obj3 = { name: 'obj3' };
var fooOBJ = foo.softBind( obj1 );
fooOBJ(); // name: obj1

obj2.foo = foo.softBind( obj1 );
obj2.foo(); // name: obj2

fooOBJ.call( obj3 ); // name: obj3

setTimeout( obj2.foo, 10 ); // name: undefined  | 浏览器：name: obj1
setTimeout( fooOBJ, 10 ); // name: undefined | 浏览器：name: obj1
