console.log("3dStartLoaded")
odoo.define('OdooCad', function (require) {
'use strict';

var core = require('web.core');
var rpc = require('web.rpc');

var QWeb = core.qweb;
var Class = require('web.Class');

var OdooCad = Class.extend({
    events: {
    },
    init: function (divElement) {
        if(divElement == undefined){
            this.main_div = $('#main_3d')
        } else {
            this.main_div = divElement
        }

        var renderer = new THREE.WebGLRenderer();
        renderer.setSize( window.innerWidth, window.innerHeight );
        this.main_div[0].appendChild( renderer.domElement );

        var scene = new THREE.Scene();

        var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 10000 );

        var controls = new THREE.OrbitControls( camera );
				var geometry = new THREE.CylinderBufferGeometry( 0, 10, 30, 4, 1 );
				var material = new THREE.MeshPhongMaterial( { color: 0xffffff, flatShading: true } );
				for ( var i = 0; i < 500; i ++ ) {
					var mesh = new THREE.Mesh( geometry, material );
					mesh.position.x = ( Math.random() - 0.5 ) * 1000;
					mesh.position.y = ( Math.random() - 0.5 ) * 1000;
					mesh.position.z = ( Math.random() - 0.5 ) * 1000;
					mesh.updateMatrix();
					mesh.matrixAutoUpdate = false;
					scene.add( mesh );
                }
				var light = new THREE.DirectionalLight( 0xffffff );
				light.position.set( 1, 1, 1 );
				scene.add( light );
				var light = new THREE.DirectionalLight( 0x002288 );
				light.position.set( - 1, - 1, - 1 );
				scene.add( light );
				var light = new THREE.AmbientLight( 0x222222 );
				scene.add( light );
        //controls.update() must be called after any manual changes to the camera's transform
        camera.position.set( 0, 20, 100 );
        controls.update();

        function animate() {

            requestAnimationFrame( animate );

            // required if controls.enableDamping or controls.autoRotate are set to true
            controls.update();

            renderer.render( scene, camera );

        }
        animate();
        
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
    className: 'o_pie_chart',
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