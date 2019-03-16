/* Copyright M.Boscolo mattteo.boscolo@omniasolutions.eu, 2019 - All rights reserved */
odoo.define('OdooCad', function (require) {
'use strict';
var Class = require('web.Class');
//var compass = require('OdooCad.compass');

//var OrbitControls = require('OrbitControlsCube.js')(THREE)


//https://stackoverflow.com/questions/31021252/orientation-cube-in-three-js
//https://github.com/mattdesl/three-orbit-controls/blob/master/test.js
//https://github.com/elmarquez/four 

var createDiv = function(parent, id){
    var out = document.createElement("div");    
    out.id = id;
    parent.appendChild(out);
    return out
}

var createTestFour = function(divElement){

        var domElement = createDiv(divElement, 'viewport');
        domElement.width=800;
        domElement.height=400;
        var scene = new THREE.Scene();

        // camera
        var camera = new FOUR.TargetCamera(50, domElement.width / domElement.height, 0.1, 1000);
        camera.position.set(0, -50, 0);
        camera.up = new THREE.Vector3(0, 0, 1);
        scene.add(camera);

        // lights
        var ambientLight = new THREE.AmbientLight(0x000000);
        scene.add(ambientLight);

        var lights = [];
        lights[0] = new THREE.PointLight(0xffffff, 1, 0);
        lights[1] = new THREE.PointLight(0xffffff, 1, 0);
        lights[2] = new THREE.PointLight(0xffffff, 1, 0);

        lights[0].position.set(0, 180, 0);
        lights[1].position.set(100, 180, 100);
        lights[2].position.set(-100, -180, -100);

        scene.add(lights[0]);
        scene.add(lights[1]);
        scene.add(lights[2]);

        // add some geometry for demonstration purposes
        var cloud = new THREE.Object3D();
        var geometry, material = new THREE.MeshPhongMaterial({
            color: 'blue',
            emissive: 0x072534,
            side: THREE.DoubleSide,
            flatShading: THREE.FlatShading
        });
        geometry = new THREE.BoxGeometry(10, 10, 10);
        var mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.floor(0);
        mesh.position.y = Math.floor(0);
        mesh.position.z = Math.floor(30);
        cloud.add(mesh);

        var geometry, material = new THREE.MeshPhongMaterial({
            color: 'green',
            emissive: 0x072534,
            side: THREE.DoubleSide,
            flatShading: THREE.FlatShading
        });
        geometry = new THREE.BoxGeometry(10, 10, 10);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.floor(0);
        mesh.position.y = Math.floor(30);
        mesh.position.z = Math.floor(0);
        cloud.add(mesh);

        var geometry, material = new THREE.MeshPhongMaterial({
            color: 'red',
            emissive: 0x072534,
            side: THREE.DoubleSide,
            flatShading: THREE.FlatShading
        });       
        geometry = new THREE.BoxGeometry(10, 10, 10);
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = Math.floor(30);
        mesh.position.y = Math.floor(0);
        mesh.position.z = Math.floor(0);
        cloud.add(mesh);        
        scene.add(cloud);

        var axisHelper = new THREE.AxesHelper(20);
        scene.add(axisHelper);

        // viewport and controller
        var viewport = new FOUR.Viewport3D({
            camera: camera,
            backgroundColor:new THREE.Color('skyblue'),
            continuousUpdate: true,
            domElement: domElement,
            scene: scene,
            inDomElement: true,
        });
        
        var multi = new FOUR.MultiController({viewport: viewport});
        var rotate = new FOUR.RotateController({viewport: viewport});
        var pan = new FOUR.PanController({viewport: viewport});
        var zoom = new FOUR.ZoomController({viewport: viewport});
        multi.addController(rotate, 'rotate');
        multi.addController(pan, 'pan');
        multi.addController(zoom, 'zoom');
        viewport.addController(multi, 'multi');
        viewport.setActiveController('multi');

        // viewcube
        var viewcubeElement =  createDiv(divElement, 'viewcube');
        $(viewcubeElement).css({top: -150,
                                position:'relative',
                                height: 150,
                                width: 150});
        var viewcube = domElement.viewcube = window.viewcube = new FOUR.Viewcube({
            width: 150,
            height: 150,
            domElement: viewcubeElement,
            display: {
                compass: true,
                cube: true,
                labels: true,
                sceneAxis: true,
                normal:true,
                axis:true,
            },
            viewport: viewport,
        });
        viewcube.enable();

        viewcube.addEventListener(FOUR.EVENT.CAMERA_CHANGE, function (vals) {
            console.log("Main:FOUR.EVENT.CAMERA_CHANGE")
            rotate.updateFromEuler(vals.targetEuler, vals.endQuaternation);
            viewcube.updateOrientation(); //this also perform a render
            viewport.render();
        });

        multi.addEventListener(FOUR.EVENT.RENDER, function (vals) {
            console.log("Main:FOUR.EVENT.CAMERA_CHANGE")
            viewcube.updateOrientation();
        });
        viewcube.update();
        viewcube.updateOrientation(); //this also perform a render
        viewport.update();
        viewport.render();
        
    }

var OdooCad = Class.extend({
    events: {
    },
    init: function (divElement) {
        if(divElement == undefined){
            this.main_div = $('#main_3d')
        } else {
            this.main_div = divElement
        }
        //createTest(this.main_div);
        createTestFour(this.main_div[0]);
    },
});

return OdooCad;

});

console.log("3dEndLoaded");
odoo.define('OdooCadWidget', function (require) {
'use strict';
console.log("Start Create Widget")
var Widget = require('web.Widget');
var widgetRegistry = require('web.widget_registry');
var OdooCad = require('OdooCad');

var OdooCadWidget = Widget.extend({
    template: 'threejs_main_view_widget',
    xmlDependencies: ['/3dCad/static/xml/templates.xml'],
    events: {
    },
    init: function (parent, value) {
        this._super(parent);
        //  
    },
    
    start: function(){this.odooCad = new OdooCad(this.$el);      },
});
widgetRegistry.add('OdooCadWidget', OdooCadWidget);

return OdooCadWidget;

});
console.log("End Create Widget")