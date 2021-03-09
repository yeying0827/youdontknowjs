## ES6中的Class

在JavaScript中实现类有许多语法的缺点：

* 繁琐杂乱的.prototype引用
* 试图调用原型链上层同名函数时的显式伪多态
* 不可靠、不美观且容易被误解成”构造函数“的.constructor

传统面向类的语言中父类和子类、子类和实例之间其实是复制操作，但是在[[Prototype]]中并没有复制，相反，它们之间只有委托关联。



### A.1 class

关于class语法糖，除了更好看，还解决了什么问题？

1. 不再引用杂乱的.prototype
2. Button声明时直接”继承“了Widget，不再需要通过`Object.create(...)`来替换.prototype对象，也不需要设置`.__proto__`或者`Object.setPrototypeOf(...)`。
3. 可以通过`super(...)`来实现相对多态。这样任何方法都可以引用原型链上层的同名方法。
4. class字面语法不能声明属性（只能声明方法）。如果没有这种限制的话，原型链末端的”实例“可能会意外地获取其他地方的属性（这些属性隐式被所有”实例“所”共享“）。所以，class语法实际上可以**帮助你避免犯错**。
5. 可以通过extends很自然地扩展对象（子）类型，甚至是内置的对象（子）类型。



### A.2 class陷阱

class基本上只是现有[[Prototype]]机制的一种语法糖。**并不会**像传统面向类的语言一样在声明时**静态复制**所有行为。

#### 不复制

如果（有意或无意）**修改或替换了父”类“中的一个方法**，那子”类“和所有实例都会受到影响，因为它们在定义时并没有进行复制，只是使用基于[[Prototype]]的实时委托。

```javascript
class C {
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

c1.rand();
```

委托，不会得到”类“的副本。为什么要使用本质上不是类的class语法呢？

#### 实例之间无法共享状态

class语法无法定义类成员属性（ 只能定义方法），如果为了跟踪实例之间**共享状态**必须要这么做，就只能使用丑陋的.prototype语法 

```javascript
class C {
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
console.log( c1.count === c2.count ); // true
```

这种写法违背了class语法的本意，在实现中暴露（泄露！）了.prototype。

#### 面临意外屏蔽

另外，class语法**仍面临意外屏蔽的问题**：

```javascript
class C {
  constructor(id) {
    this.id = id;
  }
  id() {
    console.log( "Id: " + id );
  }
}
var c1 = new C( "c1" );
console.log( c1.id() ); // TypeError: c1.id is not a function
```

#### super静态绑定

此外，`super`也存在一些非常细微的问题。处于性能考虑（this绑定是很大的开销），**super并不是动态绑定**的，它会在声明时”静态“绑定。——大多数人，会用许多不同的方法把函数应用在不同的（使用class定义的）对象上，每次执行这些操作时都必须重新绑定super。

但根据应用方式的不同，super可能不会绑定到合适的对象（和想的不一样），所以可能需要用`toMethod(..)`来手动绑定super（类似用bind(...)来绑定this）。

```javascript
class P {
	foo() {
		console.log( "P.foo" );
	}
}
class C extends P {
	foo() {
		super.foo();
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
// 把E委托到D
Object.setPrototypeOf( E, D );
E.foo(); // P.foo
```

出于性能考虑，super并不像this一样是晚绑定（动态绑定）的，它在[[HomeObject]].[[Prototype]]上，[[HomeObject]]会在创建时静态绑定。

在上例中，super.foo()会调用P.foo()，因为方法的[[HomeObject]]仍然是C，C.[[Prototype]]是P。

可以手动修改super绑定，使用toMethod(..)绑定或重新绑定方法的[[HomeObject]]（？）就可以。

```javascript
var E = Object.create( D );
// 手动把foo的[[HomeObject]]绑定到E，E.[[Prototype]]是D，所以super.foo()是D.foo()
E.foo = C.prototype.foo.toMethod( E, "foo" ); // toMethod是实验性方法，无法验证
E.foo(); // D.foo
```



### A.3 静态大于动态吗

class最大的问题在于，它的语法有时会让人认为，定义了一个class后，它就变成了一个（未来会被实例化的）东西的静态定义。——实际上它是一个对象，一个具体的可以直接交互的东西

在传统面向类的语言中，类定义之后就不会进行修改，所以**类的设计模式就不支持修改**。但是，**JavaScript最强大的特性之一就是它的动态性**，任何对象的定义都可以修改（除非把它设置成不可变）。

class语法想伪装成一种很好的语法问题的解决方案。

注：如果使用.bind(..)函数来硬绑定函数，那么这个函数不会像普通函数那样被ES6的extend扩展到子类中。（？）



### A.4 小结

class隐藏了许多问题并且带来了更多更细小但是危险的问题。

JavaScript对象最重要的机制——对象之间的实时委托关联