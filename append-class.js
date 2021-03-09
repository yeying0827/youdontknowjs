/*class C {
	constructor() {
		this.num = Math.random();
	}
	rand() {
		console.log( "Random: " + this.num );
	}
}

var c1 = new C();
c1.rand();

C.prototype.rand = function () {
	console.log( "Random: " + Math.round( this.num * 1000 ) );
};

var c2 = new C();
c2.rand();

c1.rand();*/

/*class C {
	constructor() {
		// 确保修改的是共享状态而不是在实例上创建一个屏蔽属性！
		C.prototype.count ++;

		// this.count可以通过委托实现我们想要的功能
		console.log( "Hello: " + this.count );
	}
}
// 直接向prototype对象上添加一个共享状态
C.prototype.count = 0;

var c1 = new C(); // Hello: 1

var c2 = new C(); // Hello: 2

console.log( c1.count === 2 ); // true
console.log( c1.count === c2.count ); // true*/

function showName() {
	console.log( this.name );
}

class P {
	foo() {
		console.log( "P.foo" );
	}
	test() {
		showName.bind(this)();
	}
}
class C extends P {
	foo() {
		super.foo();
	}
	test() {
		super.test();
	}
}
var c1 = new C();
c1.foo(); // P.foo

var D = {
	foo: function () {
		console.log( "D.foo" );
	}
};
var E = {
	foo: C.prototype.foo
};
Object.setPrototypeOf( E, D );
E.foo(); // P.foo

/*var E = Object.create( D );
// 手动把foo的[[HomeObject]]绑定到E，E.[[Prototype]]是D，所以super.foo()是D.foo()
E.foo = C.prototype.foo.toMethod( E, "foo" ); // // toMethod是实验性方法，无法验证
E.foo();*/