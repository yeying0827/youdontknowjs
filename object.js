// "use strict";
var strPrimitive = "I am a string";
console.log( typeof strPrimitive ); // string
console.log( strPrimitive instanceof String ); // false

var strObj = new String( "I am a string" );
console.log( typeof strObj ); // object
console.log( strObj instanceof String ); // true

console.log( Object.prototype.toString.call( strObj ) ); // [object String]
console.log( Object.prototype.toString.call( strPrimitive ) ); // [object String]

var prefix = "foo";
var myObject = {
	[ prefix + "bar" ]: "hello",
	[ prefix + "baz" ]: "world",
	[ Symbol.Something ]: "hello wolrd"
};
console.log( myObject[ "foobar" ] ); // hello
console.log( myObject[ "foobaz" ] ); // world
console.log( myObject[ Symbol.Something ] ); // world

// ----- writable
Object.defineProperty(myObject, "a", {
	value: 2,
	writable: false,
	configurable: true,
	enumerable: true
});
myObject.a = 3; // 严格：TypeError: Cannot assign to read only property 'b' of object '#<Object>'
console.log( myObject.a ); // 2

// ----- configurable
Object.defineProperty(myObject, "b", {
	value: 2,
	writable: true,
	configurable: false,
	enumerable: true
});
myObject.b = 5;
console.log( myObject.b ); // 5
/*Object.defineProperty(myObject, "b", { // TypeError: Cannot redefine property: b
	value: 6,
	writable: true,
	configurable: true,
	enumerable: true
});*/
Object.defineProperty(myObject, "b", { // 可以
	value: 6,
	writable: false,
	configurable: false,
	enumerable: true
});
myObject.b = 5; // 严格：TypeError: Cannot assign to read only property 'b' of object '#<Object>'
console.log( myObject.b ); // 6
/*Object.defineProperty(myObject, "b", { // TypeError: Cannot redefine property: b
	value: 6,
	writable: true,
	configurable: false,
	enumerable: true
});*/
delete myObject.b; // 严格：TypeError: Cannot delete property 'b' of #<Object>
console.log( myObject.b ); // 6

// ----- immutable
myObject.d = "dd";
myObject.e = "ee";
Object.preventExtensions( myObject ); // 禁止添加新属性
myObject.f = "ff";
console.log( "myObject.f:", myObject.f ); // undefined
delete myObject.e;
console.log( "myObject.e:", myObject.e ); // undefined
console.log( "myObject.d:", myObject.d ); // dd
//seal
Object.seal( myObject ); // 禁止添加新属性，禁止重新配置或删除旧属性
delete myObject.d;
myObject.d = "dd1";
console.log( "myObject.d:", myObject.d ); // dd1
// freeze
Object.freeze( myObject );
myObject.d = "dd";
console.log( "myObject.d:", myObject.d ); // dd1

// ----- 查找属性
console.log( Symbol.Something in myObject ); // true
console.log( myObject.hasOwnProperty(Symbol.Something) ); // true
console.log( myObject.hasOwnProperty( "foobar" ) ); // true

Object.prototype.test = "123";
for (var k in myObject) {console.log(k, myObject[k]);}
/*
foobar hello
foobaz world
undefined hello wolrd
a 2
b 6
d dd1
*/

// ----- 遍历
const test = [1, 2, 3];
test.every((item, index) => item < 3);
console.log( test.every((item, index) => item < 3) );
console.log( test.forEach(item => item < 3));
console.log( test.some(item => item > 3));
console.log( "for ... of" );
for (var v of [1,2,3]) {
  console.log( v );
}

var arr = [1,2,3];
var it = arr[Symbol.iterator]();
console.log( it.next() );
console.log( it.next() );
console.log( it.next() );
console.log( it.next() );

const newObj = {
	name: "lily",
	age: 12,
	birthday: new Date(),
	/*[Symbol.iterator]: function () {

	}*/
}
Object.defineProperty( newObj, Symbol.iterator, {
	enumerable: false,
	writable: false,
	configurable: true,
	value: function () {
		var o = this; // 对象本身
		var idx = 0; // 
		var ks = Object.keys( o ); // 所有可枚举属性的数组
		return {
			next: function () {
				return {
					value: o[ks[idx++]],
					done: idx > ks.length
				}
			} 
		}
	}
} );
var it = newObj[Symbol.iterator]();
console.log( it.next() ); // { value: 'lily', done: false }
console.log( it.next() ); // { value: 12, done: false }
console.log( it.next() ); // { value: 2021-03-04T04:06:19.669Z, done: false }
console.log( it.next() ); // { value: undefined, done: true }
for (var v of newObj) {
	console.log( v );
}
/*for (var v of myObject) { // myObject is not iterable
	console.log( v );
}*/
var randoms = {
  [Symbol.iterator]: function() {
    return {
      next: function() {
        return {value: Math.random()};
      }
    }
  }
}
var randoms_pool = [];
for (var n of randoms) {
  randoms_pool.push( n );
  if( randoms_pool.length === 10 ) break;
}
console.log( randoms_pool );