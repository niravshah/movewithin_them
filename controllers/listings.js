module.exports = function(pb) {
    //PB dependencies
    var util = pb.util;
    var BaseController = pb.BaseController;
    // Instantiate the controller & extend from the base controller
    var LandingPage = function() {};
    util.inherits(LandingPage, pb.BaseController);
    // Define the content to be rendered
    LandingPage.prototype.render = function(cb) {
        var self = this;
        var cos = new pb.CustomObjectService();
        cos.loadTypeByName('mw_listing', function(err, contactType) {
            if(util.isError(err)) {
                console.log("ERROR!! Couldnt find type:mw_listing")
            } else {
                cos.findByType(contactType, function(err, objs) {
                    self.ts.registerLocal('angular', function(flag, cb) {
                        var objects = {
                            listings: objs
                        };
                        var angularData = pb.ClientJs.getAngularController(objects, ['ngSanitize']);
                        cb(null, angularData);
                    });
                    self.ts.load('listings', function(err, result) {
                        if(util.isError(err)) {
                            throw err;
                        }
                        cb({
                            content: result
                        });
                    });
                })
            }
        });
    };
    
    // Define the routes for the controller
    LandingPage.getRoutes = function(cb) {
        var routes = [{
            method: 'get',
            path: "/jobs",
            auth_required: false,
            content_type: 'text/html'
        }];
        cb(null, routes);
    };
    //return the prototype
    return LandingPage;
};