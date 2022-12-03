const optionsColors = [
  {
      color: '66533C'
  },
  {
      color: '173A2F'
  },
  {
      color: '153944'
  },
  {
      color: '27548D'
  },
  {
      color: '438AAC'
  },
  {
    color: '201837'
  },
  {
    color: '7453c0',
  },
  {
    color: '66cccc'
  }
]

const TRAY = document.getElementById('js-tray-slide');

const canvas = document.querySelector('#webgl');

var theModel;
const MODEL_PATH = "/src/assets/Iphone-8/scene.gltf";

const BACKGROUND_COLOR = 0xf1f1f1;

const scene = new THREE.Scene();

scene.background = new THREE.Color(BACKGROUND_COLOR );
scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

var cameraFar = 20;

const renderer = new THREE.WebGLRenderer({canvas, antialias: true});

renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio); 

document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera( 75, sizes.width / sizes.height, 0.1, 1000);
camera.position.z = cameraFar;
camera.position.x = 0;
camera.position.y = 10;


const INITIAL_MTL = new THREE.MeshPhongMaterial( { color: 0xf1f1f1, shininess: 10 } );

const INITIAL_MAP = [
  {childID: "Object_12", mtl: INITIAL_MTL},
];


// Init the object loader
var loader = new THREE.GLTFLoader();

  loader.load(MODEL_PATH, function(gltf) {
  theModel = gltf.scene;
  console.log(theModel);
  // theModel.getObjectByName('Object_12').material.color.setHex(0x173A2F); 

  theModel.traverse((o) => {
    if (o.isMesh) {
      o.castShadow = true;
      o.receiveShadow = true;
    }
  });

  // Set the models initial scale   
  theModel.scale.set(1,1,1);
  // Offset the y position a bit
  theModel.position.y = Math.PI;

  for (let object of INITIAL_MAP) {
    initColor(theModel, object.childID, object.mtl);
  }
  // Add the model to the scene
  scene.add(theModel);
}, undefined, function(error) {
console.error(error)
});

function initColor(parent, type, mtl) {
  parent.traverse(o => {
      if (o.isMesh) {
          if (o.name.includes(type)) {
              o.material = mtl;
              o.nameID = type; // Set a new property to identify this object
          }
      }
  });
}

// Add lights
var ambLight = new THREE.AmbientLight(0x404040, 1);
scene.add(ambLight);

var dirLight = new THREE.DirectionalLight( 0xffffff, 1);
dirLight.position.set( -8, 10, 20);
dirLight.castShadow = true;
scene.add(dirLight);

// const dirHelper = new THREE.DirectionalLightHelper(dirLight, 3)
// scene.add(dirLight, dirHelper);

//point light 1
// var pointLight = new THREE.PointLight(0xffffff, 1.5);
// pointLight.position.set(2, 50, 500);
// scene.add(pointLight);

// const sphereSize = 10;
// const pointLightHelper = new THREE.PointLightHelper( pointLight, sphereSize );
// scene.add( pointLightHelper );

//point light 2
var pointLight2 = new THREE.PointLight(0xc4c4c4,1.5);
pointLight2.position.set(500, 100, 0);
scene.add(pointLight2);

const sphereSize2 = 10;
const pointLightHelper2 = new THREE.PointLightHelper( pointLight2, sphereSize2 );
scene.add( pointLightHelper2 );

//point light 3
var pointLight3 = new THREE.PointLight(0xc4c4c4,1.5);
pointLight3.position.set(0, 100, -500);
scene.add(pointLight3);

const sphereSize3 = 1;
const pointLightHelper3 = new THREE.PointLightHelper( pointLight3, sphereSize3 );
scene.add( pointLightHelper3 );

//point light 4
var pointLight4 = new THREE.PointLight(0xc4c4c4,1.5);
pointLight4.position.set(-500, 300, 0);
scene.add(pointLight4);

const sphereSize4 = 10;
const pointLightHelper4 = new THREE.PointLightHelper( pointLight4, sphereSize4 );
scene.add( pointLightHelper4 );

var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );
  hemiLight.position.set( 0, 50, 0 );
// Add hemisphere light to scene   
scene.add( hemiLight );



//floor
var floorGeometry = new THREE.PlaneGeometry(500,500,32);
var floorMaterial = new THREE.MeshPhongMaterial({
color:  '#52595D',
depthWrite: false,
shininess: 0
});

var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x =  -0.5 * Math.PI;
floor.receiveShadow = true;
floor.position.y = -2;
scene.add(floor);


var controls = new THREE.OrbitControls( camera, renderer.domElement );
controls.maxPolarAngle = Math.PI;
controls.minPolarAngle = - Math.PI;
controls.enableDamping = true;
controls.enablePan = false;
controls.dampingFactor = 0.1;
controls.autoRotate = true; // Toggle this if you'd like the chair to automatically rotate
controls.autoRotateSpeed = false; // 30

function animate() {
  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);

  if (resizeRendererToDisplaySize(renderer)) {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
  }
}

animate();

function resizeRendererToDisplaySize(renderer) {
  const canvas = renderer.domElement;
  var width = sizes.width;
  var height = sizes.height;
  var canvasPixelWidth = canvas.width / window.devicePixelRatio;
  var canvasPixelHeight = canvas.height / window.devicePixelRatio;
  
  const needResize = canvasPixelWidth !== width || canvasPixelHeight !== height;
  if (needResize) {
      
      renderer.setSize(width, height, false);
  }
  return needResize;
}


function buildColors(optionsColors) {
  for (let [i, color] of optionsColors.entries()) {
    let swatch = document.createElement('div');
    swatch.classList.add("tray__swatch","h-12", "w-12", "flex-1", "hover:border-2", "border-cyan-900");

      swatch.style.background = "#" + color.color;
      
    swatch.setAttribute('data-key', i);
    TRAY.append(swatch);
  }
}

buildColors(optionsColors);

//add eventlistener to div with .tray__swatch class
const swatches = document.querySelectorAll(".tray__swatch");

for (const swatch of swatches) {
  swatch.addEventListener('click', selectSwatch);
}

function selectSwatch(e) {
  let chosenColor = optionsColors[parseInt(e.target.dataset.key)];
  let new_mtl;

   new_mtl = new THREE.MeshPhongMaterial({
       color: parseInt('0x' + chosenColor.color),
       shininess: chosenColor.shininess ? chosenColor.shininess : 5
       
     });
 
 setMaterial(theModel, 'Object_12', new_mtl);
}

function setMaterial(parent, parts, mtl) {
  parent.traverse((model) => {
   if (model.isMesh && model.nameID != null) {
     if (model.nameID == parts) {
          model.material = mtl;
       }
   }
 });
}