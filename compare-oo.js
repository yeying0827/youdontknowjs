/* 面向对象风格 */
function Foo(who) {
	this.me = who;
}
Foo.prototype.identify = function () {
	return "I am " + this.me;
};

function Bar(who) {
	Foo.call(this, who);
}
Bar.prototype = Object.create( Foo.prototype );

Bar.prototype.speak = function () {
	alert( "Hello, " + this.identify() + "." );
};

var b1 = new Bar( "b1" );
var b2 = new Bar( "b2" );

b1.speak();
b2.speak();


////////// 更简洁的设计
function Controller() {
	this.errors = [];
}
Controller.prototype.showDialog = function (title, msg) {
	// 给用户显式标题和消息
};
Controller.prototype.success = function (msg) {
	this.showDialog( "Success", msg );
};
Controller.prototype.failure = function (err) {
	this.errors.push( err );
	this.showDialog( "Error", err );
};

// 子类
function LoginController() {
	Controller.call( this );
}
LoginController.prototype = Object.create( Controller.prototype ); // 子类关联到父类
LoginController.prototype.getUser = function () {
	return document.getElementById( "login_username" ).value;
};
LoginController.prototype.getPassword = function () {
	return document.getElementById( "login_password" ).value;
}
LoginController.prototype.validateEntry = function (user, pw) {
	user = user || this.getUser();
	pw = pw || this.getPassword();
	if (!(user && pw)) {
		return this.failure( "Please enter a username & password" );
	} else if (pw.length < 5) {
		return this.failure( "Password must be 5+ characters!" );
	}
	// 执行到此处说明通过验证
	return true;
};
LoginController.prototype.failure = function (err) { // 重写基础的failure
	// "super"调用
	Controller.failure.call( this, "Login invalid: " + err );
};

// 子类
function AuthController(login) {
	// 合成
	this.login = login;
} 
AuthController.prototype = Object.create( Controller.prototype ); // 子类关联到父类
AuthController.prototype.server = function (url, data) {
	return $.ajax({
		url: url,
		data: data
	});
};
AuthController.prototype.checkAuth = function () {
	var user = this.login.getUser();
	var pw = this.login.getPassword();

	if(this.login.validateEntry(user, pw)) {
		this.server( "/check-auth", {
			user: user,
			pw: pw
		} )
		.then( this.success.bind(this) )
		.fail( this.failure.bind(this) );
	}
};
AuthController.prototype.success = function () { // 重写基础的success
	// "super"调用
	Controller.prototype.success.call( this, "Authenticated!" );
};
AuthController.prototype.failure = function (err) { // 重写基础的failure
	// "super"调用
	Controller.prototype.failure.call( this, "Auth Failed: " + err );
};

var auth = new AuthController(
		// 除了继承，还需要合成
		new LoginController()
	);
auth.checkAuth();