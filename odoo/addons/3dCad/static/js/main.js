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

var prepareStructure = function(data, parent){
        let fOut = [];
        for (var data_ix in data){
            var group = data[data_ix];
            if (parent){
                group.location[0] += parent.location[0];
                group.location[1] += parent.location[1];
                group.location[2] += parent.location[2];
                group.rotation[0] += parent.rotation[0];
                group.rotation[1] += parent.rotation[1];
                group.rotation[2] += parent.rotation[2];
            }


            for (var object_ix in group.objects){
                var object = group.objects[object_ix];
                //console.log(object.file + ' ' + parseInt(object.location[0],10) + ' ' + parseInt(object.location[1], 10) + ' ' + parseInt(object.location[2],10))
                if (parent){
                    object.location[0] += group.location[0];
                    object.location[1] += group.location[1];
                    object.location[2] += group.location[2];
                    object.rotation[0] += group.rotation[0];
                    object.rotation[1] += group.rotation[1];
                    object.rotation[2] += group.rotation[2];
                }
                let r = Math.random().toString(36).substring(10);
                fOut.push({
                    unique_name: r,
                    file: '/3dCad/static/data/' + object.file,
                    p_x: parseInt(object.location[0] ,10),
                    p_y: parseInt(object.location[1], 10),
                    p_z: parseInt(object.location[2], 10),
                    r_x: parseInt(object.rotation[0], 10),
                    r_y: parseInt(object.rotation[1], 10),
                    r_z: parseInt(object.rotation[2], 10),                   
                });
            }
            let tempOut=prepareStructure(group.groups, group);
            if (tempOut.length>0){
                Array.prototype.push.apply(fOut, tempOut);
            }
        }
        return fOut;
}

var load_stl = function (data, loader, scene){
        let bbox = new THREE.Box3();
        dataList.forEach(function(dataObject) {
            loader.load(dataObject.file , dataObject, function ( geometry ) {
                var innerGeometry = geometry;
                dataList.forEach(function(dataObjectInner) {
                    if (innerGeometry.creationData.unique_name===dataObjectInner.unique_name){
                        var p_x = dataObjectInner.p_x;
                        var p_y = dataObjectInner.p_y;
                        var p_z = dataObjectInner.p_z;
                        var r_x = dataObjectInner.r_x;
                        var r_y = dataObjectInner.r_y;
                        var r_z = dataObjectInner.r_z;
                        console.log(dataObjectInner.file + ' ' + parseInt(r_x,10) + ' ' + parseInt(r_y, 10) + ' ' + parseInt(r_z,10));
                        var material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
                        var mesh = new THREE.Mesh( innerGeometry, material );
                        mesh.position.set( p_x, p_y, p_z);
                        mesh.rotation.set( r_x * 3.14 /180, r_y * 3.14 /180, r_z* 3.14 /180 );
                        mesh.scale.set(1, 1, 1);
                        mesh.castShadow = true;
                        mesh.receiveShadow = true;
                        mesh.geometry.computeBoundingBox();
                        bbox.union(mesh.geometry.boundingBox);
                        scene.add(mesh)
                        var bBox_new = new FOUR.BoundingBox("Main Mesh", );
                        bBox_new.update(bbox);
                        camera.zoomToFit(bBox_new, true);
                    }
                });
            })
        });
        return bbox;
    }

var load_table = function(scene, camera){
    // load data structure
        $.ajax({
          type: "GET",
          url: '/3dCad/static/data/json/freecad.json',
          data: {},
          dataType: 'json',
          success: function(response){
            let data = response;
            var loader = new THREE.STLLoader();
            load_stl(data['groups'], loader, scene, camera);
          },
          error: function(){
            console.log('errore')
          }
        });
}
var createTestFour = function(divElement){

        var domElement = createDiv(divElement, 'viewport');
        domElement.width=800;
        domElement.height=400;
        var scene = new THREE.Scene();

        // camera
        var camera = new FOUR.TargetCamera(50, domElement.width / domElement.height, 0.1, 100);
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

        lights[0].position.set(0, 1800, 0);
        lights[1].position.set(1000, 1800, 1000);
        lights[2].position.set(-1000, -1800, -1000);

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
        
        // custom load geometry
        load_table(cloud, camera);
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