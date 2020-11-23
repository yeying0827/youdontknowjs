## 附录：this词法

ES6中有一个主题用非常重要的方式将this**同**词法作用域联系起来了。

一个特殊的语法形式用于**函数声明**，叫作箭头函数。

这里称作“胖箭头”的写法通常被当作**单调乏味且冗长**的function关键字的简写。

箭头函数除了在声明函数时少敲几次键盘以外，还有更重要的作用。

🌰：

```javascript
var obj = {
  id: "awesome",
  cool: function coolFn() {
    console.log( this.id );
  }
}
obj.cool(); // awesome
setTimeout( obj.cool, 100 ); // not awesome
```

cool()函数丢失了同`this`之间的绑定。解决这个问题的最常用方法是`var self = this;`(bind，其他？)

```javascript
var obj2 = {
	count: 0,
	cool: function coolFn() {
		var self = this;

		if(self.count < 1) {
			setTimeout( function timer() {
				self.count ++;
				console.log( "awesome?" );
			}, 100 );
		}
	}
};

obj2.cool(); // awesome?
```

使用了词法作用域。self只是一个**可以通过**词法作用域和闭包**进行引用的标识符**，不关心`this`绑定的过程中发生了什么。

箭头函数：帮助减少重复的场景。在涉及`this`绑定时的行为和普通函数的行为完全不一致。它**放弃了**所有普通`this`绑定的规则，取而代之的是用当前词法作用域**覆盖**了`this`本来的值。

=> 箭头函数并非同所属的this进行了解绑，而只是“继承“了cool()函数的this绑定。

=> 混淆了this绑定规则和词法作用域规则（？）

箭头函数是匿名而非具名的。（匿名的缺点查看[第三章](./03第3章：函数作用域和块作用域.md)3.3.1）

解决这个”问题“的另一个更合适的办法是正确使用和包含this机制

.bind

```javascript
setTimeout( obj.cool.bind(obj), 100 ); 
```









1) var self = this;

2) arrow function

3) .bind(...)

