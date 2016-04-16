//dependencies
var path = require('path');
var _ = require('underscore');
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
        
        /*TopMenu.getTopMenu(self.session, self.localizationService, function(themeSettings, navigationObject, accountButtonsObject) {
            console.log("TOPMENU", themeSettings, navigationObject, accountButtonsObject);
        });*/
        
        
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
                            auth:pb.security.isAuthenticated(self.session),
                            writer:pb.security.isAuthorized(self.session, {authenticated: true, admin_level: pb.SecurityService.ACCESS_WRITER}),
                            locations:_.countBy(lstngs, "location"),
                            departments:_.countBy(lstngs, "department"),
                            roles:_.countBy(lstngs, "role"),
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