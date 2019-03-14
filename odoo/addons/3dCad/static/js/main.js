/* Copyright M.Boscolo mattteo.boscolo@omniasolutions.eu, 2019 - All rights reserved */
odoo.define('OdooCad', function (require) {
'use strict';
var Class = require('web.Class');
//var compass = require('OdooCad.compass');

//var OrbitControls = require('OrbitControlsCube.js')(THREE)


//https://stackoverflow.com/questions/31021252/orientation-cube-in-three-js
//https://github.com/mattdesl/three-orbit-controls/blob/master/test.js
https://github.com/elmarquez/four 

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
        var count = 1000, cloud = new THREE.Object3D();
        var geometry, material = new THREE.MeshPhongMaterial({
            color: 0x156289,
            emissive: 0x072534,
            side: THREE.DoubleSide,
            flatShading: THREE.FlatShading
        }), mesh;
        for (var i = 0; i < count; i++) {
            geometry = new THREE.BoxGeometry(1, 1, 1);
            mesh = new THREE.Mesh(geometry, material);
            mesh.position.x = Math.floor(Math.random() * 100);
            mesh.position.y = Math.floor(Math.random() * 100);
            mesh.position.z = Math.floor(Math.random() * 100);
            cloud.add(mesh);
        }
        cloud.position.set(-50, -50, -50);
        scene.add(cloud);

        var axisHelper = new THREE.AxesHelper(20);
        scene.add(axisHelper);

        // viewport and controller
        var viewport = new FOUR.Viewport3D({
            camera: camera,
            continuousUpdate: true,
            domElement: domElement,
            scene: scene,
            inDomElement: true,
        });
        var orbit = new FOUR.RotateController({viewport: viewport});
        viewport.addController(orbit, 'orbit');
        viewport.setActiveController('orbit');
        viewport.update();
        viewport.render();

        // viewcube
        var viewcubeElement = createDiv(divElement, 'viewcube');
        $(viewcubeElement).css({top: -150,  position:'relative'});
        var viewcube = domElement.viewcube = new FOUR.Viewcube({
            width: 150,
            height: 150,
            domElement: viewcubeElement,
            display: {
                compass: true,
                cube: true,
                labels: true,
                sceneAxis: true,
            },
            viewport: viewport
        });
        viewcube.enable();
        orbit.addEventListener('update', function () {
            viewcube.updateOrientation();
        });

        document.addEventListener('keyup', function (event) {
            // 1 - 0
            if (event.keyCode === 49) {
                console.log('top');
                viewcube.setView(0);
            } else if (event.keyCode === 50) {
                console.log('front');
                viewcube.setView(1);
            } else if (event.keyCode === 51) {
                console.log('right');
                viewcube.setView(2);
            } else if (event.keyCode === 52) {
                console.log('back');
                viewcube.setView(3);
            } else if (event.keyCode === 53) {
                console.log('left');
                viewcube.setView(4);
            } else if (event.keyCode === 54) {
                console.log('bottom');
                viewcube.setView(5);
            } else if (event.keyCode === 55) {
                console.log('top front edge');
                viewcube.setView(6);
            } else if (event.keyCode === 56) {
                console.log('top right edge');
                viewcube.setView(7);
            } else if (event.keyCode === 57) {
                console.log('top back edge');
                viewcube.setView(8);
            } else if (event.keyCode === 48) {
                console.log('top left edge');
                viewcube.setView(9);
            }

            // Q, W, E, R
            else if (event.keyCode === 81) {
                console.log('front right edge');
                viewcube.setView(10);
            } else if (event.keyCode === 87) {
                console.log('back right edge');
                viewcube.setView(11);
            } else if (event.keyCode === 69) {
                console.log('back left edge');
                viewcube.setView(12);
            } else if (event.keyCode === 82) {
                console.log('front left edge');
                viewcube.setView(13);
            }

            // T, Y, U, I
            else if (event.keyCode === 84) {
                console.log('bottom front edge');
                viewcube.setView(14);
            } else if (event.keyCode === 89) {
                console.log('bottom right edge');
                viewcube.setView(15);
            } else if (event.keyCode === 85) {
                console.log('bottom back edge');
                viewcube.setView(16);
            } else if (event.keyCode === 73) {
                console.log('bottom left edge');
                viewcube.setView(17);
            }

            // A, S, D, F
            else if (event.keyCode === 65) {
                console.log('top front right corner');
                viewcube.setView(18);
            } else if (event.keyCode === 83) {
                console.log('top back right corner');
                viewcube.setView(19);
            } else if (event.keyCode === 68) {
                console.log('top back left corner');
                viewcube.setView(20);
            } else if (event.keyCode === 70) {
                console.log('top front left corner');
                viewcube.setView(21);
            }

            // G, H, J, K
            else if (event.keyCode === 71) {
                console.log('bottom front right corner');
                viewcube.setView(22);
            } else if (event.keyCode === 72) {
                console.log('bottom back right corner');
                viewcube.setView(23);
            } else if (event.keyCode === 74) {
                console.log('bottom back left corner');
                viewcube.setView(24);
            } else if (event.keyCode === 75) {
                console.log('bottom front left corner');
                viewcube.setView(25);
            }


        }, false);
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
    'addElement' : function(elementObj){
        this._scene.add(elementObj)
    },
    'removeElement': function(id){
        this._scene.remove(scene.getObjectByName(id));
    },
    'hideElement': function(id){
        var objToHide = scene.getObjectByName(id);
        objToHide.visible = False;
    },
    'showElement': function(id){
        var objToHide = scene.getObjectByName(id);
        objToHide.visible = True
    },
    'addToSelection': function(id){
        this._selected.append(id)
    },
    'removeSelection': function(id){
        for( var i = 0; i < this._selected.length; i++){ 
            if ( this._selected[i] === id) {
                this._selected.splice(i, 1); }
            }
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