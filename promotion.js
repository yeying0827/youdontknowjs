//foo();
var a = true;
if (a) {
  function foo() { console.log( "A" ); }
} else {
  function foo() { console.log( "B" ); }
}
foo();