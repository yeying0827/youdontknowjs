/*var obj = {
	id: "awesome",
	cool: function coolFn(argument) {
		var self = this;
		console.log( 1, self );
		console.log( self.id );
	}
}

obj.cool();
setTimeout( obj.cool, 100 );*/

var obj2 = {
	count: 0,
	cool: function coolFn() {
		// var self = this;
		// console.log( 2, this );

		if(this.count < 1) {
			setTimeout( function timer() {
				this.count ++;
				// console.log( 3, self );
				// console.log( self.count );
				console.log( "awesome?" );
			}/*.bind( this )*/, 100 );
		}
	}
};

obj2.cool();