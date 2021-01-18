## 第2章 this全面解析

每个函数的this是在调用时被绑定的，完全取决于函数的调用位置（也就是函数的调用方法）



### 2.1 调用位置

函数在代码中被调用的位置（而不是声明的位置）=> this到底引用的是什么？

某些编程模式可能会**隐藏**真正的调用位置。

最重要的是要分析**调用栈**（就是为了到达当前执行位置所调用的所有函数）。调用位置就在当前**正在执行**的函数的**前**一个调用中。

🌰：

```javascript
function baz() {
  // 当前调用栈：baz
  // 当前调用位置是全局作用域
  console.log( "baz" );
  bar(); // bar的调用位置
}

function bar() {
  // 当前调用栈：baz -> bar
  // 当前调用位置是在baz中
  console.log( "bar" );
  foo(); // foo的调用位置
}

function foo() {
  // 当前调用栈：baz -> bar -> foo
  // 当前调用位置是在bar中
  console.log( "foo" );
}

baz(); // baz的调用位置
```

可以把调用栈想象成一个函数调用链，如上例注释；另一个查看调用栈的方法是，使用浏览器的调试工具（设置断点），运行暂停时，会展示当前位置的函数调用列表，这就是调用栈。



### 2.2 绑定规则

调用位置**如何**决定this的绑定对象。

判断应用下面四条规则中的哪一条。默认绑定、隐式绑定、显式绑定、new绑定

* **默认绑定**

  最常用的函数调用类型：独立函数调用。无法应用其他规则时的默认规则。

  🌰：

  ```javascript
  function foo() {
    console.log( this.a );
  }
  var a = 2;
  foo(); // 2
  
  (function() {
    "use strict";
    
    foo();
  })();
  ```

  本例中，函数调用时应用了this的默认绑定，因此this指向全局对象。

  分析：代码中`foo()`是直接使用**不带任何修饰的**函数引用进行调用的，因此只能使用默认绑定。

  如使用严格模式(strict mode)，则不能将全局对象用于默认绑定，因此`this`会绑定到**undefined**。

  🌰：

  ```javascript
  function foo() {
    "use strict";
    
    console.log( this.a );
  }
  var a = 2;
  foo(); //  TypeError: Cannot read property 'a' of undefined
  ```

  注：只有`foo()`运行在非strict mode下时，默认绑定才能绑定到全局对象；在严格模式下**调用**`foo()`则不影响默认绑定。

  注：通常来说不应该混用strict模式和非strict模式；第三方库可能严格程度不一样，需要注意兼容细节。

* **隐式绑定**

  调用位置**是否**有上下文对象，或者说是否**被**某个对象拥有或者包含。

  🌰：

  ```javascript
  function foo() {
    console.log( this.a );
  }
  var obj = {
    a: 2,
    foo: foo
  };
  obj.foo(); // 2 
  ```

  首先，需要注意`foo()`的声明方式，及其之后是**如何**被当作**引用属性**添加到obj中的。

  但无论是直接在obj中定义还是先定义再添加为引用属性，这个函数**严格来说都不属于obj对象**。

  然而调用位置会**使用obj上下文**来引用函数 => 可以说函数**被调用时**obj对象”拥有“或者”包含“它。=> 当`foo()`被调用时，它的前面加上了对obj的引用

  当函数引用有上下文对象时，**隐式绑定**规则会把函数调用中的this绑定到这个上下文对象。=> `this.a`和`obj.a`是一样的

  对象属性引用链中只有**上一层或者说最后一层**在调用位置中起作用。🌰：

  ```javascript
  function foo() {
    console.log( this.a );
  }
  
  var obj2 = {
    a: 42,
    foo: foo
  };
  
  var obj1 = {
    a: 2,
    obj2: obj2
  };
  
  obj1.obj2.foo(); // 42
  ```

  **\**存在问题：隐式丢失**

  被隐式绑定的函数会**丢失**绑定对象，即会应用默认绑定。

  1. 引用函数本身

     ```javascript
     function foo() {
       console.log( this.a );
     }
     var obj = {
       a: 2,
       foo: foo
     };
     var bar = obj.foo; // 函数别名！
     var a = "oops, global";
     bar(); // "oops, global"
     ```

     虽然bar是obj.foo的一个引用，但实际上，它引用的是`foo`函数**本身**=>此时`bar()`是一个不带任何修饰的函数调用，因此应用了默认绑定。

  2. 传入回调函数时

     ```javascript
     function foo() {
       console.log( this.a );
     }
     function doFoo(fn) {
       fn(); // <-- 调用位置
     }
     var obj = {
       a: 2,
       foo: foo
     };
     var a = "oops, global";
     doFoo( obj.foo ); // "oops, global"
     ```

     参数传递就是一种隐式赋值

     **调用回调函数的函数可能会修改this**: 第三方库。=> 我们无法控制回调函数的执行方式，因此就**没有办法**控制调用位置以得到期望的绑定。

* **显式绑定**

  不想在对象内部包含函数引用，而想在某个对象上强制调用函数

  => 可以使用函数的`call(...)`和`apply(...)`方法（绝大多数函数可行）

  => **如何工作？**它们的第一个参数是一个对象，是给`this`准备的，接着在调用函数时将其绑定到`this` -> 即显式绑定

  如果你传入了一个原始值（字符串类型、布尔类型或者数字类型）来当作`this`的绑定对象，这个原始值会被转换成它的对象形式（即`new String(...)`、`new Boolean(...)`或者`new Number(...)`）。这通常被称为“装箱”。

  显式绑定仍**无法解决**丢失绑定问题。（立即执行，无法传递、引用）**可用方案：**

  1. 硬绑定

     显式绑定的一个变种。示例：

     ```javascript
     function foo () {
       console.log( this.a );
     }
     var obj = {
       a: 2
     };
     var bar = function () {
       foo.call( obj );
     }
     bar(); // 2
     setTimeout( bar, 100 ); // 2
     bar.call( window ); // 2
     ```

     分析：创建了函数`bar()`并在它的内部手动调用了`foo.call( obj )`，因此强制把`foo`的**`this`**绑定到了`obj`。=> 无论之后如何调用函数`bar`，它总会手动在`obj`上调用`foo`。

     这是一种显式的强制绑定，我们称之为**硬绑定**。

     **典型应用场景：**创建一个包裹函数，负责接收参数并返回值：

     形如上例的`bar`

     ```javascript
     var bar = function () {
       return foo.apply( obj, arguments );
     }
     ```

     另一种使用方法：是创建一个可以重复使用的辅助函数：

     ```javascript
     function bind(fn, obj) { // 简单的辅助绑定函数
       return function () {
         return fn.apply( obj, arguments );
       }
     }
     
     var bar = bind( foo, obj );
     ```

     由于硬绑定是一种非常常用的模式 => 所以ES5提供了内置的方法`Function.prototype.bind`，它的用法示例如下：

     ```javascript
     var bar = foo.bind( obj );
     ```

     `bind(...)`会返回一个硬编码的***新***函数，它会把你指定的参数设置为**`this`**的上下文并调用原始函数。

  2. API调用的“上下文”

     第三方库的许多函数，以及JavaScript语言和宿主环境中许多新的内置函数，都提供了一个可选的参数，通常被称为“上下文”（context），其作用和`bind`一样，确保你的回调函数使用指定的`this`。

     🌰：

     ```javascript
     function foo(el) {
       console.log( el, this.id );
     }
     var obj = {
       id: 'awesome'
     };
     [1, 2, 3].forEach( foo, obj ); // 1 "awesome" 2 "awesome" 3 "awesome"
     [1, 2, 3].forEach( el => {
       console.log( el );
     } );
     ```

     实际上这些函数就是通过`call(...)`或者`apply(...)`实现了显式绑定。

* **new绑定**

  **前置知识**：

  在传统的面向类的语言中，“构造函数”是**类中**的一些特殊方法，使用`new`初始化类时会调用类中的构造函数。JavaScript也有一个`new`操作符，使用方法看起来也类似，然而两者的`new`机制完全不同。

  在JavaScript中，构造函数只是一些使用**`new`**操作符时被调用的函数，它们并不会属于某个类，也不会实例化一个类。实际上，它们甚至都不能说是一种特殊的函数类型，它们只是被`new`操作符调用的**普通**函数而已。

  包括内置对象函数（如`Number(...)`）在内的所有函数都可以用`new`来调用，这种函数调用被称为**构造函数调用**。=> 实际上并不存在所谓的“构造函数”，只有对于函数的“**构造调用**”。

  使用`new`来调用函数，或者说发生构造函数调用时，会自动执行下面的操作：

  1. 创建（或者说构造）一个全新的对象；
  2. 这个新对象会被执行[[Prototype]]连接；
  3. 这个新对象会**绑定到**函数调用的`this`；
  4. 如果函数没有返回其他对象，那么`new`表达式中的函数调用会**自动返回**这个新对象。



### 2.3 优先级

如果某个调用位置可以应用多条规则该怎么办？

默认绑定的优先级是四条规则中最低的。

1.隐式Vs.显式，**显式优先级高于隐式**。🌰：

```javascript
function foo() {
  console.log( this.a );
}
var obj1 = {
  a: 2,
  foo: foo
};
var obj2 = {
  a: 3,
  foo: foo
};
obj1.foo(); // 2
obj2.foo(); // 3

obj1.foo.call( obj2 ); // 3
obj2.foo.call( obj1 ); // 2
```

2.newVs.隐式，**new优先级高于隐式**。🌰：

```javascript
function foo(something) {
  this.a = something;
}

var obj1 = {
  foo: foo
};
var obj2 = {};

// 隐式
obj1.foo( 2 );
console.log( obj1.a ); // 2

// 显式
obj1.foo.call( obj2, 3 );
console.log( obj2.a ); // 3

// new
var bar = new obj1.foo( 4 ); // this指向新创建的对象
console.log( obj1.a ); // 2
console.log( bar.a ); // 4
```

3.newVs.显式

new和call/apply无法一起使用，因此无法通过`new foo.call( obj1 )`来直接进行测试。=> 通过**硬绑定**来测试

`Function.prototype.bind`创建并返回一个新的包装函数，这个函数会忽略它当前的**`this`**绑定（无论绑定的对象是什么），并把我们提供的对象绑定到`this`上。=>**看上去**硬绑定（显式绑定的一种）似乎比new绑定的优先级更高。

🌰：

```javascript
function foo(something) {
  this.a = something;
}
var obj1 = {};

var bar = foo.bind( obj1 ); // 一个新的包装函数，把this绑定到obj1
bar( 2 );
console.log( obj1.a ); // 2

var baz = new bar( 3 );
console.log( obj1.a ); // 2
console.log( baz.a ); // 3
```

`bar`被硬绑定到`obj1`上，但`new bar(3)`并没有把`obj1.a`修改为3；相反，`new`修改了硬绑定调用`bar(...)`中的**`this`**。

使用`new`绑定，得到了一个名字为baz的新对象，并且`baz.a`的值是3。（跟顺序有关？？this被覆盖？？）

回顾”裸“辅助函数`bind`：

```javascript
function bind(fn, obj) { // 简单的辅助绑定函数
  return function () {
    return fn.apply( obj, arguments );
  }
}
```

**看起来**在辅助函数中`new`操作符的调用无法修改`this`绑定。