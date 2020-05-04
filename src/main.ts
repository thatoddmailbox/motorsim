import "main.styl";

import { BoxGeometry, Mesh, MeshBasicMaterial, Scene, PerspectiveCamera, WebGLRenderer } from "three";

var canvas = document.querySelector("canvas") as HTMLCanvasElement;
var canvasWidth = canvas.width;
var canvasHeight = canvas.height;

const scene = new Scene();
const camera = new PerspectiveCamera(75, canvasWidth / canvasHeight, 0.1, 1000);

const renderer = new WebGLRenderer({
	canvas: canvas
});

var geometry = new BoxGeometry();
var material = new MeshBasicMaterial( { color: 0x00ff00 } );
var cube = new Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5 + (0.0001);

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	camera.position.y += 0.001;
}
animate();