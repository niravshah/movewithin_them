module.exports = function(pb) {
    var util = pb.util;
    var BaseController = pb.BaseController;
    var ListingController = function() {};
    util.inherits(ListingController, pb.BaseController);
    
    ListingController.prototype.render = function(cb) {
        var self = this;
        var cos = new pb.CustomObjectService();
        
        cos.loadById(self.pathVars.jobid, function(err, listing) {
            if(util.isError(err) || listing == null) {
                console.log("ERROR!!",err, listing);
                throw(err);
            }
            
            self.ts.registerLocal('angular', function(flag, cb) {
                var objects = {
                    listing: listing
                };
                var angularData = pb.ClientJs.getAngularController(objects, ['ngSanitize']);
                cb(null, angularData);
            });
            self.ts.load('listing', function(err, result) {
                if(util.isError(err)) {
                    throw err;
                }
                cb({
                    content: result
                });
            });                      
         
        });
    };
    
    
    ListingController.getRoutes = function(cb) {
        var routes = [{
            method: 'get',
            path: "/jobs/:jobid",
            auth_required: false,
            content_type: 'text/html'
        }];
        cb(null, routes);
    };
    //return the prototype
    return ListingController;
};