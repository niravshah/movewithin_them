var Cookies = require('cookies');
module.exports = function(pb) {
   //pb dependencies
    var util            = pb.util;
    var BaseController  = pb.BaseController;
    var SecurityService = pb.SecurityService;
    
    /**
     * Logs a user out of the system
     * @class LogoutController
     * @constructor
     * @extends {BaseController}
     */
    function LogoutController(){}
    util.inherits(LogoutController, BaseController);

    LogoutController.prototype.render = function(cb) {
        var self = this;
        pb.session.end(this.session, function(err, result){

            //clear the cookie
            var cookies      = new Cookies(self.req, self.res);
            var cookie       = pb.SessionHandler.getSessionCookie(self.session);
            cookie.expires   = new Date();
            cookie.overwrite = true;
            cookies.set(pb.SessionHandler.COOKIE_NAME, null, cookie);

            //send redirect
            self.redirect(self.getRedirect(), cb);
        });
    };
    
    /**
     * Determines how to redirect the user once the session is destroyed.  If 
     * the user has elevated privileges he/she is redirected to the admin login.  
     * If it is a regular user they are redirected back to the referring URL.  
     * Finally, if niether of those hold true they are redirected back to the 
     * home page.
     * @method getRedirect
     * @return {String} The URL string to redirect to
     */
    LogoutController.prototype.getRedirect = function() {
        
        
        //check for a valid referer
        var redirect = this.req.headers.referer;
        if (!util.isNullOrUndefined(redirect)) {
            return redirect;
        }
        
        //when all else fails, go to the home page
        return '/';
    };
    
    // Define the routes for the controller
    LogoutController.getRoutes = function(cb) {
        var routes = [{
            method: 'get',
            path: "/logout",
            auth_required: false,
            content_type: 'text/html'
        }];
        cb(null, routes);
    };
    //return the prototype
    return LogoutController;
};