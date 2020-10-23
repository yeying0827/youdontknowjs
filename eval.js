function foo ( str, a ) {
	eval( str );
	console.log( a, b );
}
var b = 2;
foo( " var b = 3; ", 1 );


function foo1 ( str ) {
	"use strict";
	eval( str );
	console.log( a );
}
foo1 ( " var a = 2; console.log ('inner', a); " );
