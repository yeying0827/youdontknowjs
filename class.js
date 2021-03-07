// 传统的JavaScript类 - Vehicle
function Vehicle() {
  this.engines = 1;
}
Vehicle.prototype.ignition = function () {
  console.log( "..." );
}
Vehicle.prototype.drive = function () {
  this.ignition();
  console.log( "xxx" );
}

function Car() {
  var car = new Vehicle();
  car.wheels = 4; // 对car进行定制
  var vehDrive = car.drive; // 保存Vehicle.drive的特殊引用
  car.drive = function () { // 重写drive
    vehDrive.call( this );
    console.log( "qqq" );
  }
  return car;
}

var myCar = new Car();
myCar.drive();
// ...
// xxx
// qqq