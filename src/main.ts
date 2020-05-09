import "main.styl";
import "@fortawesome/fontawesome-free/css/all.min.css";

import App from "App.ts";

var canvas = document.querySelector("canvas") as HTMLCanvasElement;

var app = new App(canvas);

function animate() {
	requestAnimationFrame(animate);

	app.update();
	app.draw();
}
animate();