Function.prototype.bind2 = function(oThis) {
	if(typeof this !== 'function') { // 如果this指向的类型不是函数
		throw new TypeError(
			"Function.prototype.bind2 - what is trying " +
			"to be bound is not callable"
		);
	}

	var aArgs = Array.prototype.slice.call( arguments, 1 ), // 获取传递给bind2的参数
		fToBind = this, // 调用bind2的函数本身，此处是[Function: testBind2]
		fNOP = function() {}, // 一个辅助函数
		fBound = function() { // 最后被返回的新生成的函数
			// console.log( this.__proto__, this instanceof fNOP )
			fToBind.apply(
				(
					// fBound调用时的this是fNOP的一个实例(fBound的原型指向testBind2 {}, new 操作)，并且oThis为真值 => 指向fBound调用时的this
					// fBound调用时的this不是fNOP的一个实例，或者 oThis为假值 => 指向oThis
					(this instanceof fNOP && 
					oThis) ? this: oThis
				),
				aArgs.concat(
					Array.prototype.slice.call( arguments )
				)
			);
		};

	// console.log( this.prototype ); // testBind2 {}
	// console.log( fNOP, fNOP.prototype ); // [Function: fNOP] fNOP {}
	fNOP.prototype = this.prototype; 
	// console.log( fNOP, fNOP.prototype ); // [Function: fNOP] testBind2 {}
	fBound.prototype = new fNOP(); 
	// console.log(fBound, fBound.prototype ); // [Function: fBound] testBind2 {}

	return fBound;
}

function testBind2() {
	this.a = 3;
	// console.log( this.a, arguments);
}

const testObj = {
	b: 5
};

var test = testBind2.bind2(testObj);
test(4);
new test(3);

// ------------ another test ------------ //
function foo (p1, p2) {
	this.val = p1 + p2;
}

var bar1 = foo.bind( null, "p1" );

var baz1 = new bar1( "p2" );

console.log( baz1.val ); // p1p2

// ------------ another test ------------ //
function foo1 () {
	console.log( this.a );
}

var a = 2; // 浏览器下如此写
// a = 2; // 直接 a = 2; node下运行如此写
foo1.call( null ); // node里打印undefined，google console里打印2

// ------------ another test ------------ //

function foo2 (a, b) {
  console.log( "a:" + a + ", b:" + b );
}

foo2.apply( null, [2, 3] ); // a:2, b:3

var bar2 = foo2.bind( null, 2 );
bar2( 3 ); // a:2, b:3
foo2(...[2,3]);