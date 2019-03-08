/* Copyright G. Hemingway, 2015 - All rights reserved */
"use strict";

import BrowserView          from './views/browser';
import CADView              from './views/cad';
const queryString =         require('query-string');

/*************************************************************************/

module.exports = Backbone.Router.extend({
    routes: {
        '':                             '_landing',
        'browse':                       '_browse',
        'login':                        '_login',
        'register':                     '_register',
        ':modelID':                     '_model',
        '*path':                        '_default'
    },
    initialize: function(options) {
        this.app = options.app;
    },

    _landing: function() {
        console.log('Landing path');
    },

    _browse: function() {

        ReactDOM.render(<BrowserView
            router={this}
            user={this.app.state.user}
            token={this.app.state.token}
            config={this.app.config}
            services={this.app.services}
            socket={this.app.socket}
        />, document.getElementById('primary-view'));
        
    },


    _register: function() {

            this.navigate('browse', { trigger: true });
    },

    _model: function(modelID, query) {
        query = queryString.parse(query);
        let self = this;
        // Render the root CAD view
        ReactDOM.render(<CADView
            manager={this.app.cadManager}
            viewContainerId='primary-view'
            root3DObject={this.app._root3DObject}
        />, document.getElementById('primary-view'), function () {
            // Dispatch setModel to the CADManager
            self.app.cadManager.dispatchEvent({
                type: 'setModel',
                path: modelID,
                baseURL: self.app.services.api_endpoint + self.app.services.version,
                modelType: query.type
            });
        });
    },

    /************** Default Route ************************/

    _default: function(path) {
        console.log('Landed on default path ' + path);
    }
});