module.exports = function(pb) {

  //PB dependencies
  var util           = pb.util;
  var BaseController = pb.BaseController;

  // Instantiate the controller & extend from the base controller
  var LandingPage = function(){};
  util.inherits(LandingPage, pb.BaseController);

  // Define the content to be rendered
  LandingPage.prototype.render = function(cb) {
    var output = {
        content_type: 'text/html',
        code: 200
    };
    this.ts.load('new_listing', function(error, result) {
        output.content = result;
        cb(output);
    });
  };

  // Define the routes for the controller
  LandingPage.getRoutes = function(cb) {
    var routes = [{
        method: 'get',
        path: "/jobs/new",
        auth_required: true,
        access_level: pb.SecurityService.ACCESS_WRITER,
        content_type: 'text/html'
    }];
    cb(null, routes);
  };

  //return the prototype
  return LandingPage;
};