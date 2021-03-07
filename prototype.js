var another = {
  a: 2
};
console.log( another.__proto__  === Object.prototype );  // true
console.log( another.__proto__ ); // [Object: null prototype] {}
var myObject = Object.create( another );
console.log( myObject.a ); // 2
console.log( myObject.__proto__ ); // { a: 2 }
for (var v in myObject) {
	console.log( "found: " , v );
}
// found:  a
console.log( "a" in myObject ); // true




// -----------------------属性设置和屏蔽----------------------- //

console.log( "属性设置和屏蔽....." );
var obj1 = {
	a: 'a111',
	get b() { 
		return this._b_;
	},
	set b(val) {
		this._b_ = val;
	},
	c: 'c111',

};
var obj2 = {
	a: 'a222',
	get b() { 
		return this._b_;
	},
	set b(val) {
		this._b_ = val;
	},
	get e() {
		return this._e_;
	},
	set e(val) {
		this._e_ = val;
	},
	g: 'g222'
};
Object.defineProperty(obj2, "c", {
	value: 'c222',
	writable: false
});
Object.defineProperty(obj2, "f", {
	value: 'f222',
	writable: false
});

obj1.__proto__ = obj2;

// ob1有
console.log( 'obj1和obj2都有的属性，且为数据访问属性' );
obj1.a = "aa111";
console.log( 'a', obj1.a, obj2.a ); // a aa111 a222

console.log( 'obj1和obj2都有的属性，且为getter/setter' );
obj1.b = "bb111";
console.log( 'b', obj1.b, obj2.b ); // b bb111 undefined

console.log( 'obj1和obj2都有，且在obj2中为只读' ); // 可被修改
obj1.c = "cc111";
console.log( 'c', obj1.c, obj2.c ); // c cc111 c222

// obj1没有
console.log( '只有obj2有，且为setter' );
obj1.e = "ee111";
console.log( 'e', obj1.e, obj2.e ); // e ee111 undefined
console.log( obj1.hasOwnProperty('e') ); // false
Object.defineProperty(obj1, "e", {
	value: "eee111",
	writable: true,
	enumarable: true
});
console.log( 'e', obj1.e, obj2.e ); // e ee111 undefined
console.log( obj1.hasOwnProperty('e') ); // true

console.log( '只有obj2有，且只读' ); // 无法修改
obj1.f = "ff111"; // 
console.log( 'f', obj1.f, obj2.f ); // f f222 f222
Object.defineProperty(obj1, "f", { // 使用Object.defineProperty可修改
	value: "ff111",
	writable: true
});
console.log( 'f', obj1.f, obj2.f ); // f ff111 f222

console.log( '只有obj2有，且不是只读' ); // 可被添加
obj1.g = "gg111"; // 
console.log( 'g', obj1.g, obj2.g ); // g gg111 g222

// obj1和obj2都无
console.log( 'obj1和obj2中都没有' );
obj1.d = "d111";
console.log( 'd', obj1.d, obj2.d ); // d d111 undefined

console.log( obj1, obj1.hasOwnProperty('e'), obj2 );

//////////////////////////////
console.log( another.hasOwnProperty('a') ); // true
console.log( myObject.hasOwnProperty('a') ); // false
myObject.a ++;
console.log( another.a ); // 2
console.log( myObject.a ); // 3
console.log( another.hasOwnProperty('a') ); // true
console.log( myObject.hasOwnProperty('a') ); // true

function Foo() {}
console.log( Foo.prototype ); // {}
var a = new Foo();
console.log( Object.getPrototypeOf( a ) === Foo.prototype ); // true
console.log( Foo.prototype.constructor ); // [Function: Foo]
console.log( a.constructor === Foo ); // true


console.log( "原型继承---------" );
function Foo(name) {
	this.name = name;
}
Foo.prototype.myName = function () {
	return this.name;
}
function Bar(name, label) {
	Foo.call( this, name );
	this.label = label;
}
console.log( Bar.prototype ); // {}
// Bar.prototype = Object.create( Foo.prototype );
Object.setPrototypeOf( Bar.prototype, Foo.prototype );

Bar.prototype.myLabel = function () {
	return this.label;
}
var a = new Bar( "a", "obj a" );
console.log( a.myName() ); // a
console.log( a.myLabel() ); // obj a
console.log( a instanceof Bar ); // true
console.log( a instanceof Foo ); // true
console.log( a.__proto__ ); // Foo { myLabel: [Function (anonymous)] }
var b = new Foo( "b" );
console.log( b.__proto__ ); // { myName: [Function (anonymous)] }
console.log( a.__proto__.__proto__ === b.__proto__ ); // true

// ------------ Object.create
var myObj = Object.create( another, {
	b: {
		enumerable: false,
		writable: true,
		configurable: false,
		value: 3
	},
	c: {
		enumerable: true,
		writable: false,
		configurable: false,
		value: 4
	}
} );
console.log( myObj.hasOwnProperty( "a" ) ); // false
console.log( myObj.hasOwnProperty( "b" ) ); // true
console.log( myObj.hasOwnProperty( "c" ) ); // true
console.log( myObj.a ); // 2
console.log( myObj.b ); // 3
console.log( myObj.c ); // 4