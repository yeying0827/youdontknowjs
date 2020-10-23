var obj = {
	a: 1,
	b: 2,
	c: 3
};
obj.a = 2;
obj.b = 3;
obj.c = 4;
with( obj ) {
	a = 3;
	b = 4;
	c = 5;
}
console.log( obj );

function foo ( obj ) {
	// "use strict"; // 严格模式限制with的使用
	with ( obj ) {
		console.log( obj );
		a = 2;
	}
}
var o1 = {
	a: 3
};
var o2 = {
	b: 3
};
foo( o1 );
console.log( o1.a );
foo ( o2 );
console.log( o2.a );
console.log( a );

