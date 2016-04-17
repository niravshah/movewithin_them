module.exports = function(pb) {
    //PB dependencies
    var util = pb.util;
    var BaseController = pb.BaseController;
    // Instantiate the controller & extend from the base controller
    var MwAdminPage = function() {};
    util.inherits(MwAdminPage, pb.BaseController);
    
    MwAdminPage.prototype.init = function(props, cb) {
        var self = this;
        pb.BaseController.prototype.init.call(self, props, function() {
            self.siteQueryService = new pb.SiteQueryService({
                site: self.site
            });
            cb();
        });
    };    
    
    
    // Define the content to be rendered
    MwAdminPage.prototype.render = function(cb) {
        var self = this;
        var opts = {where: {settings_type: 'home_page'}};
        self.siteQueryService.q('mwtheme_settings', opts, function(err, settings) {
            var objects = {
                logo: settings[0].logo,
                homePageSettings: {callouts: [{}, {}, {}], site:self.site}
            };
            self.ts.registerLocal('angular_script', '');
            self.ts.registerLocal('angular_objects', new pb.TemplateValue(pb.ClientJs.getAngularObjects(objects), false));
            self.ts.load('admin/mw_config', function(err, result) {
                if(util.isError(err)) {
                    throw err;
                }
                cb({
                    content: result
                });
            });
        });
    };
    // Define the routes for the controller
    MwAdminPage.getRoutes = function(cb) {
        var routes = [{
            method: 'get',
            path: "/mwadmin",
            auth_required: true,
            access_level: pb.SecurityService.ACCESS_WRITER,
            content_type: 'text/html'
        }];
        cb(null, routes);
    };
    //return the prototype
    return MwAdminPage;
};