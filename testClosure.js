/*function foo() {
	var a = 2;
	function bar() {
		console.log( a );
	}
	bar();
}
foo();*/

function foo() {
  var a = 2;
  
  function bar() {
    console.log( a );
  }
  
  return bar;
}

var baz = foo();

baz();