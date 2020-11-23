// 仅从bar模块导入hello
import hello from "bar";

var hungry = "hippo";

function awesome() {
	console.log( hello( hungry ).toUpperCase();
}

export awesome;
