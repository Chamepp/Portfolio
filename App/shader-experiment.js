// Three JS Template
window.addEventListener('load', init, false);

function init() {
	createWorld();
	createLights();
	// createGrid();
	createPrimitive();
	// createGUI();
	//---
	animation();
}
//--------------------------------------------------------------------
var scene, camera, renderer, container;
var _width, _height;
var mat;

function createWorld() {
	_width = window.innerWidth;
	_height = window.innerHeight;
	//---
	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0x000000, 5, 15);
	scene.background = new THREE.Color("rgb(255, 255, 255)");
	//---
	camera = new THREE.PerspectiveCamera(35, _width / _height, 1, 1000);
	camera.position.set(0, 0, 10);
	//---
	renderer = new THREE.WebGLRenderer({
		antialias: true,
		alpha: true
	});
	renderer.setSize(_width, _height);
	renderer.shadowMap.enabled = true;
	//---
	document.getElementById("shader").appendChild(renderer.domElement);
	//---
	window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
	_width = window.innerWidth;
	_height = window.innerHeight;
	renderer.setSize(_width, _height);
	camera.aspect = _width / _height;
	camera.updateProjectionMatrix();
	console.log('- resize -');
}
//--------------------------------------------------------------------
var _ambientLights, _lights;

function createLights() {
	//_ambientLights = new THREE.AmbientLight(0xFFFFFF, 1);
	_ambientLights = new THREE.HemisphereLight(0xFFFFFF, 0x000000, 1.4);
	_lights = new THREE.PointLight(0xFFFFFF, .5);
	_lights.position.set(20, 20, 20);
	//scene.add(_lights);
	scene.add(_ambientLights);
}
//--------------------------------------------------------------------
var uniforms = {
	time: {
		type: "f",
		value: 1.0
	},
	pointscale: {
		type: "f",
		value: 1.0
	},
	decay: {
		type: "f",
		value: 2.0
	},
	complex: {
		type: "f",
		value: 2.0
	},
	waves: {
		type: "f",
		value: 3.0
	},
	eqcolor: {
		type: "f",
		value: 3.0
	},
	fragment: {
		type: 'i',
		value: false
	},
	dnoise: {
		type: 'f',
		value: 0.0
	},
	qnoise: {
		type: 'f',
		value: 4.0
	},
	r_color: {
		type: 'f',
		value: 0.0
	},
	g_color: {
		type: 'f',
		value: 0.0
	},
	b_color: {
		type: 'f',
		value: 0.0
	}
}

var options = {
	perlin: {
		vel: 0.002,
		speed: 0.00015,
		perlins: 1.0,
		decay: 0.25,
		complex: 0.0,
		waves: 10.0,
		eqcolor: 3.0,
		fragment: false,
		redhell: true
	},
	rgb: {
		r_color: 10.0,
		g_color: 4.0,
		b_color: 1.32
	},
	cam: {
		zoom: 4.6
	}
}

function createGUI() {
	var gui = new dat.GUI();
	//gui.close();

	var configGUI = gui.addFolder('Setup');
	configGUI.add(options.perlin, 'speed', 0.0, 0.001);
	configGUI.add(options.cam, 'zoom', 0, 30);
	configGUI.open();

	var perlinGUI = gui.addFolder('Perlin');
	perlinGUI.add(options.perlin, 'decay', 0.0, 1.0).name('Decay').listen();
	//perlinGUI.add(options.perlin, 'complex', 0.0, 100.0).name('Complex').listen();
	perlinGUI.add(options.perlin, 'waves', 0.0, 10.0).name('Waves').listen();
	perlinGUI.open();

	var colorGUI = gui.addFolder('Color');
	colorGUI.add(options.perlin, 'eqcolor', 3.0, 50.0).name('Color').listen();
	colorGUI.add(options.rgb, 'r_color', 0.0, 10.0).name('Red').listen();
	colorGUI.add(options.rgb, 'g_color', 0.0, 10.0).name('Green').listen();
	colorGUI.add(options.rgb, 'b_color', 0.0, 10.0).name('Blue').listen();
	colorGUI.open();

}
var primitiveElement = function () {
	this.mesh = new THREE.Object3D();
	var geo = new THREE.IcosahedronGeometry(1, 6);
	//var mat = new THREE.MeshPhongMaterial({color:0xFF0000, flatShading:true});
	mat = new THREE.ShaderMaterial({
		wireframe: false,
		uniforms: uniforms,
		vertexShader: document.getElementById('vertexShader').textContent,
		fragmentShader: document.getElementById('fragmentShader').textContent
	});
	var mesh = new THREE.Mesh(geo, mat);
	//---
	this.mesh.add(mesh);
}
var _primitive;

function createPrimitive() {
	_primitive = new primitiveElement();
	_primitive.mesh.scale.set(1, 1, 1);
	scene.add(_primitive.mesh);
}

function createGrid() {
	var gridHelper = new THREE.GridHelper(20, 20);
	gridHelper.position.y = -1;
	scene.add(gridHelper);
}
//--------------------------------------------------------------------
var start = Date.now();

function animation() {
	requestAnimationFrame(animation);

	var time = Date.now() * 0.003;

	TweenMax.to(camera.position, 1, {
		z: options.cam.zoom + 5
	});

	_primitive.mesh.rotation.y += 0.001;
	mat.uniforms['time'].value = options.perlin.speed * (Date.now() - start);
	mat.uniforms['pointscale'].value = options.perlin.perlins;
	mat.uniforms['decay'].value = options.perlin.decay;
	mat.uniforms['complex'].value = options.perlin.complex;
	mat.uniforms['waves'].value = options.perlin.waves;
	mat.uniforms['eqcolor'].value = options.perlin.eqcolor;
	mat.uniforms['r_color'].value = options.rgb.r_color;
	mat.uniforms['g_color'].value = options.rgb.g_color;
	mat.uniforms['b_color'].value = options.rgb.b_color;
	mat.uniforms['fragment'].value = options.perlin.fragment;
	//---
	renderer.render(scene, camera);
}
