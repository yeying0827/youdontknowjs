/* 对象关联风格 */
Foo = {
	init: function (who) {
		this.me = who;
	},
	identify: function () {
		return "I am " + this.me;
	}
};
Bar = Object.create( Foo );
Bar.speak = function () {
	alert( "Hello, " + this.identify() + "." );
};
var b1 = Object.create( Bar );
b1.init( "b1" );
var b2 = Object.create( Bar );
b2.init( "b2" );

b1.speak();
b2.speak();



////////// 更简洁的设计
var LoginController = {
	errors: [],
	getUser: function () {
		return document.getElementById( "login_username" ).value;
	},
	getPassword: function () {
		return document.getElementById( "login_password" ).value;
	},
	validateEntry: function (user, pw) {
		user = user || this.getUser();
		pw = pw || this.getPassword();
		if (!(user && pw)) {
			return this.failure( "Please enter a username & password" );
		} else if (pw.length < 5) {
			return this.failure( "Password must be 5+ characters!" );
		}
		// 执行到此处说明通过验证
		return true;
	},
	showDialog: function (title, msg) {
		// 给用户显式标题和消息
	},
	failure: function (err) {
		this.errors.push( err );
		this.showDialog( "Error", "Login invalid: " + err );
	}
};

// 让AuthController委托LoginController
var AuthController = Object.create( LoginController );
AuthController.errors = [];
AuthController.checkAuth = function () {
	var user = this.getUser();
	var pw = this.getPassword();

	if(this.validateEntry(user, pw)) {
		this.server( "/check-auth", {
			user: user,
			pw: pw
		} )
		.then( this.accepted.bind(this) )
		.fail( this.rejected.bind(this) );
	}
};
AuthController.server = function (url, data) {
	return $.ajax({
		url: url,
		data: data
	});
};
AuthController.accepted = function () {
	this.showDialog( "Success", "Authenticated!" );
};
AuthController.rejected = function (err) {
	this.failure( "Auth Failed: " + err );
};

AuthController.checkAuth();