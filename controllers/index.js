/*
 Copyright (C) 2015  PencilBlue, LLC

 This program is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 This program is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
//dependencies
var path = require('path');
module.exports = function IndexModule(pb) {
    //pb dependencies
    var util = pb.util;
    var PluginService = pb.PluginService;
    var TopMenu = pb.TopMenuService;
    var MediaLoader = pb.MediaLoader;
    /**
     * Index The home page controller of the portfolio theme.
     * @class Index
     * @author Blake Callens <blake@pencilblue.org>
     * @copyright 2014 PencilBlue, LLC.  All Rights Reserved
     */

    function Index() {}
    util.inherits(Index, pb.BaseController);
    Index.prototype.init = function(props, cb) {
        var self = this;
        pb.BaseController.prototype.init.call(self, props, function() {
            self.siteQueryService = new pb.SiteQueryService({
                site: self.site
            });
            cb();
        });
    };
    /**
     * This is the function that will be called by the system's RequestHandler.  It
     * will map the incoming route to the ones below and then instantiate this
     * prototype.  The request handler will then proceed to call this function.
     * Its callback should contain everything needed in order to provide a response.
     *
     * @param cb The callback.  It does not require a an error parameter.  All
     * errors should be handled by the controller and format the appropriate
     *  response.  The system will attempt to catch any catastrophic errors but
     *  makes no guarantees.
     */
    Index.prototype.render = function(cb) {
        var self = this;
        var content = {
            content_type: "text/html",
            code: 200
        };
        var options = {
            currUrl: this.req.url,
            site: self.site
        };
        self.ts.registerLocal('page_name', "MoveWithin");
        
        var opts = {where: {settings_type: 'home_page'}};
        self.siteQueryService.q('mwtheme_settings', opts, function(err, settings) {
            
            var cos = new pb.CustomObjectService();              
            cos.loadTypeByName('mw_listing', function(err, contactType) {
                if(util.isError(err)) {
                    console.log("ERROR!! Couldnt find type:mw_listing")
                } else {
                    cos.findByType(contactType, function(err, lstngs) {                      
                        
                        var objects = {
                            logo: settings[0].logo,
                            listings: lstngs
                        };          
                        self.ts.registerLocal('angular_script', '');
                        self.ts.registerLocal('angular_objects', new pb.TemplateValue(pb.ClientJs.getAngularObjects(objects), false));
                        self.ts.load('mw_index', function(err, result) {
                            if(util.isError(err)) {throw err;}
                            cb({content: result});
                        });
                    })
                }
            });

        });
    };
    /**
     * Provides the routes that are to be handled by an instance of this prototype.
     * The route provides a definition of path, permissions, authentication, and
     * expected content type.
     * Method is optional
     * Path is required
     * Permissions are optional
     * Access levels are optional
     * Content type is optional
     *
     * @param cb A callback of the form: cb(error, array of objects)
     */
    Index.getRoutes = function(cb) {
        var routes = [{
            method: 'get',
            path: '/',
            auth_required: false,
            content_type: 'text/html'
        }];
        cb(null, routes);
    };
    //exports
    return Index;
};