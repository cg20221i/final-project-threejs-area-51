const optionsColors = [
  {
    color: "66533C",
  },
  {
    color: "173A2F",
  },
  {
    color: "153944",
  },
  {
    color: "27548D",
  },
  {
    color: "438AAC",
  },
  {
    color: "702963",
  },
  {
    color: "E4D00A",
  },
  {
    color: "e30022",
  },
  {
    color: "e5e8e8",
  },
  {
    color: "e30022",
  },
  {
    color: "000000",
  },
  {
    color: "767676",
  },
  {
    color: "505050",
  },
];

const parts = [
  {
    part: "Cube.211_0",
  },
  {
    part: "Cube.211_1",
  },
  {
    part: "Cube.211_2",
  },
  {
    part: "Cube.211_3",
  },
  {
    part: "Cube.211_4",
    try: "try",
  },
];

var activeOption = "Cube.211_1";
const TRAY = document.getElementById("js-tray-slide");

const canvas = document.querySelector("#canvaz");

var theModel;
const MODEL_PATH = "assets/Chicken/Chicken.gltf";
// const MODEL_PATH = "/src/assets/Medieval.gltf";

const BACKGROUND_COLOR = 0xf1f1f1;

const scene = new THREE.Scene();

scene.background = new THREE.Color(BACKGROUND_COLOR);
// scene.fog = new THREE.Fog(BACKGROUND_COLOR, 20, 100);
scene.position.set(0, 0, 0);

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

var cameraFar = 30;

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

renderer.shadowMap.enabled = true;
renderer.setPixelRatio(window.devicePixelRatio);

document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  1000
);
camera.position.z = cameraFar;
camera.position.x = 0;
camera.position.y = 10;

const canvaz = document.createElement("canvas");
canvaz.width = 1;
canvaz.height = 32;

const context = canvaz.getContext("2d");
const gradient = context.createLinearGradient(0, 0, 0, 32);
gradient.addColorStop(0.0, "#014a84");
gradient.addColorStop(0.5, "#0561a0");
gradient.addColorStop(1.0, "#437ab6");
context.fillStyle = gradient;
context.fillRect(0, 0, 32, 32);

const sky = new THREE.Mesh(
  new THREE.SphereGeometry(200),
  new THREE.MeshBasicMaterial({
    map: new THREE.CanvasTexture(canvaz),
    side: THREE.BackSide,
  })
);
scene.add(sky);

const INITIAL_MTL = new THREE.MeshPhongMaterial({
  color: 0xf1f1f1,
  shininess: 10,
});

const INITIAL_MAP = [
  { childID: "Cube.211_0", mtl: INITIAL_MTL },
  { childID: "Cube.211_1", mtl: INITIAL_MTL },
  { childID: "Cube.211_2", mtl: INITIAL_MTL },
  { childID: "Cube.211_3", mtl: INITIAL_MTL },
  { childID: "Cube.211_4", mtl: INITIAL_MTL },
];

//test mtl+obj
// const INITIAL_MTL2 = new THREE.MeshPhongMaterial( { color: 0xf1f1f1, shininess: 5 } );

// const INITIAL_MAP2 = [
//   {childID: "Pillow_Cube.008", mtl: INITIAL_MTL2},
//   {childID: "Mattress_Cube.004", mtl: INITIAL_MTL2},
//   {childID: "Mattress_Cube.004", mtl: INITIAL_MTL2},

// ];

// const mtlLoader = new THREE.MTLLoader()
// mtlLoader.load(
//     'assets/BedTwin.mtl',
//     (materials) => {
//         materials.preload()

//         const objLoader = new THREE.OBJLoader()
//         objLoader.setMaterials(materials)
//         objLoader.load(
//             'assets/BedTwin.obj',
//             (object) => {
//                 scene.add(object)
//                 console.log(object);
//                 object.scale.set(5,5,5);
//                 object.position.set(0, 0,0);

//                 // for (let obj of INITIAL_MAP2) {
//                 //   initColor(object, obj.childID, obj.mtl);
//                 // }
//                 object.traverse((o) => {
//                   if (o.isMesh) {
//                     o.castShadow = true;
//                     o.receiveShadow = true;
//                   }
//                 });
//             },
//             (xhr) => {
//                 console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
//             },
//             (error) => {
//                 console.log('An error happened')
//             }
//         )
//     },
//     (xhr) => {
//         console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
//     },
//     (error) => {
//         console.log('An error happened')
//     }
// )

//trying tree
// var loader1 = new THREE.GLTFLoader();
// var theModel2;

// loader1.load(
//   "Nature/BirchTree_4.gltf",
//   function (gltf) {
//     theModel2 = gltf.scene;
//     theModel2.scale.set(10, 10, 10);
//     theModel2.position.set(-50, 0, -5);
//     console.log(theModel2);
//     theModel2.getObjectByName('Cube.008_0').material.color.setHex(0x964b00);
//     theModel2.getObjectByName('Cube.008_1').material.color.setHex(0x3D550C);


//     theModel2.traverse((o) => {
//       if (o.isMesh) {
//         o.castShadow = true;
//         o.receiveShadow = true;
//       }
//     });

//     scene.add(theModel2);
    
//   },
//   undefined,
//   function (error) {
//     console.error(error);
//   }
// );

// Init the object loader.
var loader = new THREE.GLTFLoader();

loader.load(
  MODEL_PATH,
  function (gltf) {
    theModel = gltf.scene;
    console.log(theModel);
    //console.log(theModel.nameID);
    for (let object of INITIAL_MAP) {
      initColor(theModel, object.childID, object.mtl);
    }
    // theModel.getObjectByName('Cube.211_0').material.color.setHex(options.Chicken_Main);

    //Cast Shadows
    theModel.traverse((o) => {
      if (o.isMesh) {
        o.castShadow = true;
        o.receiveShadow = true;
      }
    });
    theModel.position.set(0,10,0);
    // Set the models initial scale
    theModel.scale.set(5, 5, 5);
    // Offset the y position a bit
    // theModel.position.y = Math.PI;

    // Add the model to the scene
    scene.add(theModel);
  },
  undefined,
  function (error) {
    console.error(error);
  }
);

// Function - Add the textures to the models
function initColor(parent, type, mtl) {
  parent.traverse((o) => {
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

var dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
dirLight.position.set(-20, 100, 7);
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
var pointLight2 = new THREE.PointLight(0xc4c4c4, 1.5);
pointLight2.position.set(500, 100, 0);
scene.add(pointLight2);

const sphereSize2 = 10;
const pointLightHelper2 = new THREE.PointLightHelper(pointLight2, sphereSize2);
scene.add(pointLightHelper2);

//point light 3
var pointLight3 = new THREE.PointLight(0xc4c4c4, 1.5);
pointLight3.position.set(0, 100, -700);
scene.add(pointLight3);

const sphereSize3 = 1;
const pointLightHelper3 = new THREE.PointLightHelper(pointLight3, sphereSize3);
scene.add(pointLightHelper3);

//point light 4
var pointLight4 = new THREE.PointLight(0xc4c4c4, 1.5);
pointLight4.position.set(-500, 300, 0);
scene.add(pointLight4);

const sphereSize4 = 10;
const pointLightHelper4 = new THREE.PointLightHelper(pointLight4, sphereSize4);
scene.add(pointLightHelper4);

var hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.5);
hemiLight.position.set(0, 100, 0);
// Add hemisphere light to scene
scene.add(hemiLight);

//floor
var grass = new THREE.TextureLoader().load('texture/SEAMLESS GRASS TEXTURE.jpg');
var soil = new THREE.TextureLoader().load('texture/Dirty One.jpg');
var floorGeometry = new THREE.BoxGeometry(500, 500, 19);
var floorMaterial = new THREE.MeshPhongMaterial({
  color: "#3cdf63",
  // depthWrite: false,
  shininess: 1,
  // map: grass
});

var floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -0.5 * Math.PI;
floor.receiveShadow = true;
floor.position.set(0, 0, 0);
scene.add(floor);

var controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.maxPolarAngle = Math.PI;
controls.minPolarAngle = -Math.PI;
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

//make div for color selections

function buildColors(optionsColors) {
  for (let [i, color] of optionsColors.entries()) {
    let swatch = document.createElement("div");
    swatch.classList.add(
      "tray__swatch",
      "h-[50px]",
      "w-[50px]",
      "flex-1",
      "hover:border-2",
      "border-cyan-900"
    );

    swatch.style.background = "#" + color.color;

    swatch.setAttribute("data-key", i);
    TRAY.append(swatch);
  }
}

buildColors(optionsColors);

// Select Option
const option1 = document.querySelector(".option1");
option1.addEventListener("click", (event) => {
  activeOption = option1.dataset.id;
  console.log(activeOption);
});

const option2 = document.querySelector(".option2");
option2.addEventListener("click", (event) => {
  activeOption = option2.dataset.id;
  console.log(activeOption);
});

const option3 = document.querySelector(".option3");
option3.addEventListener("click", (event) => {
  activeOption = option3.dataset.id;
  console.log(activeOption);
});

const option4 = document.querySelector(".option4");
option4.addEventListener("click", (event) => {
  activeOption = option4.dataset.id;
  console.log(activeOption);
});

const option5 = document.querySelector(".option5");
option5.addEventListener("click", (event) => {
  activeOption = option5.dataset.id;
  console.log(activeOption);
});

console.log(activeOption);

//add eventlistener to div wirh .tray__swatch class
const swatches = document.querySelectorAll(".tray__swatch");

for (const swatch of swatches) {
  swatch.addEventListener("click", selectSwatch);
}

function selectSwatch(e) {
  let chosenColor = optionsColors[parseInt(e.target.dataset.key)];
  let new_mtl;
  console.log("Pressed");
  // let key = e.target.dataset.key;
  // console.log(key);
  // console.log(chosenColor);

  new_mtl = new THREE.MeshPhongMaterial({
    color: parseInt("0x" + chosenColor.color),
    shininess: chosenColor.shininess ? chosenColor.shininess : 5,
  });

  setMaterial(theModel, activeOption, new_mtl);
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

// theModel.getObjectByName('Cube.211_0').material.color.setHex(options.Chicken_Main);
