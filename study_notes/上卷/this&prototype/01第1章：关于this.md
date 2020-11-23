## 第1章 关于this

一个很特别的关键字，被自动定义在所有函数的作用域中。



### 1.1 为什么要用this

🌰：

```javascript
function identify() {
  return this.name.toUpperCase();
}

function speak() {
  var greeting = 'Hello, I\'m ' + identify.call( this );
  console.log( greeting );
}

var me = {
  name: 'Kyle'
};

var you = {
  name: 'Reader'
};

identify.call( me );
identify.call( you );

speak.call( me );
speak.call( you );
```

1. 可以在不同的上下文对象（me和you）中重复使用函数，不用针对每个对象编写不同版本的函数
2. 不需要显式传入一个上下文对象（this隐式”传递“一个对象引用 => 可以将API设计得更加简洁并且易于复用）

函数可以自动引用**合适**的上下文对象很重要！



### 1.2 误解

一些关于`this`的错误认识。

两种常见的错误解释：

1. 指向自身

   从英语的语法角度推断

   那为什么需要从函数内部引用函数自身呢？常见原因：递归或者写一个在第一次被调用后自己解除绑定的事件处理器。

   🌰：**统计函数调用次数**

   ```javascript
   function foo(num) {
     console.log( "foo: " + num );
     // 记录foo被调用的次数
     this.count ++;
   }
   
   foo.count = 0;
   
   var i = 0;
   for(i=0; i<10; i++) {
     if(i > 5) {
       foo( i );
     }
   }
   
   // foo被调用了多少次
   console.log( foo.count ); // 0
   ```

   函数内部代码`this.count`中的`this`并不是指向那个函数对象

   解决这个问题的常见办法：

   * 创建另一个带有count属性的对象（没有从`this`的含义和工作原理出发，使用了词法作用域）

     ```javascript
     function foo(num) {
       console.log( "foo: " + num );
       // 记录foo被调用的次数
       data.count ++;
     }
     
     var data = {
       count: 0
     }
     
     // ...
     
     console.log( data.count );
     ```

   * 通过一个指向函数对象的词法标识符（变量）来引用它（具名函数才可以）（完全依赖于变量foo的词法作用域）

     ```javascript
     function foo(num) {
       // ...
       foo.count ++;
     }
     
     // ...
     ```

     匿名函数可以使用`arguments.callee`来引用当前正在运行的函数对象（已被弃用）

   * 强制`this`指向foo函数对象

     ```javascript
     foo.call( foo, i );
     ```

2. 指向函数的作用域

   在某种情况下看上去是正确的（？）。

   `this`在任何情况下都不指向函数的词法作用域。作用域”对象“无法通过JavaScript代码访问，它存在于JavaScript引擎内部。

   一个错误示例：

   ```javascript
   function foo() {
     var a = 2;
     this.bar();
   }
   
   function bar() {
     console.log( this.a );
   }
   
   foo(); // ReferenceError: a is not defined
   ```

   把`this`和词法作用域的查找混合使用



### 1.3 `this`到底是什么

`this`是在运行时进行绑定的，取决于函数调用时的各种条件，取决于函数的调用方式。

当一个函数被调用时，会创建一个活动记录（也称执行上下文）。这个记录会**包含**函数在哪里被调用（调用栈）、函数的调用方式、传入的参数等信息。`this`就是**这个记录的一个属性**，会在函数执行的过程中用到。

```
activityRecord: {
	callStack: [],
	way: '',
	arguments: [],
	this: {} // ?
}
```

如何寻找函数的调用位置（？）函数在执行过程中如何绑定this（？）



### 1.4 小结

`this`实际上是在函数被调用时发生的绑定，它指向什么完全取决于函数在哪里被调用。