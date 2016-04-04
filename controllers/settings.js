/**
 * Created with movewithin.
 * User: niravshah
 * Date: 2016-04-04
 * Time: 10:34 AM
 * To change this template use Tools | Templates.
 */
module.exports = function HomePageSettingsModule(pb) {
    //pb dependencies
    var util = pb.util;
    var PluginService = pb.PluginService;
    var SUB_NAV_KEY = 'mwtheme_home_page_settings';
    /**
     * Settings for the display of home page content in the Portfolio theme
     * @class HomePageSettings
     * @author Blake Callens <blake@pencilblue.org>
     */

    function HomePageSettings() {}
    util.inherits(HomePageSettings, pb.BaseAdminController);
    HomePageSettings.prototype.render = function(cb) {
        var self = this;
        var opts = {
            where: {
                settings_type: 'home_page'
            }
        };
        self.siteQueryService.q('mwtheme_settings', opts, function(err, homePageSettings) {
            var tabs = [            {
                active: 'active',
                href: '#hero',
                icon: 'home',
                title: self.ls.get('SETTINGS_HERO')
            },
            {
                href: '#history',
                icon: 'picture-o',
                title: self.ls.get('SETTINGS_HISTORY')
            },
            {
                href: '#features',
                icon: 'th',
                title: self.ls.get('SETTINGS_FEATURES')
            }];
            if(homePageSettings.length > 0) {
                homePageSettings = homePageSettings[0];
            } else {
                homePageSettings = {
                    site: self.site
                };
            }
            var mservice = new pb.MediaService(self.site, true);
            mservice.get(function(err, media) {
                if(homePageSettings.page_media) {
                    var pageMedia = [];
                    for(i = 0; i < homePageSettings.page_media.length; i++) {
                        for(j = 0; j < media.length; j++) {
                            if(pb.DAO.areIdsEqual(media[j][pb.DAO.getIdField()], homePageSettings.page_media[i])) {
                                pageMedia.push(media[j]);
                                media.splice(j, 1);
                                break;
                            }
                        }
                    }
                    homePageSettings.page_media = pageMedia;
                }
                var objects = {
                    navigation: pb.AdminNavigation.get(self.session, ['plugins', 'manage'], self.ls, self.site),
                    pills: self.getAdminPills(SUB_NAV_KEY, self.ls, null),
                    media: media,
                    homePageSettings: homePageSettings,
                    tabs:tabs
                };
                self.ts.registerLocal('angular_script', '');
                self.ts.registerLocal('angular_objects', new pb.TemplateValue(pb.ClientJs.getAngularObjects(objects), false));
                self.ts.load('admin/mw_settings', function(err, result) {
                    cb({
                        content: result
                    });
                });
            });
        });
    };
    HomePageSettings.getSubNavItems = function(key, ls, data) {
        return [{
            name: 'content_settings',
            title: ls.get('PLUGINS'),
            icon: 'chevron-left',
            href: '/admin/plugins'
        }];
    };
    HomePageSettings.getRoutes = function(cb) {
        var routes = [{
            method: 'get',
            path: '/admin/plugins/mw_theme/settings',
            auth_required: true,
            inactive_site_access: true,
            access_level: pb.SecurityService.ACCESS_EDITOR,
            content_type: 'text/html'
        }, {
            method: 'get',
            path: '/admin/themes/mw_theme/settings',
            auth_required: true,
            inactive_site_access: true,
            access_level: pb.SecurityService.ACCESS_EDITOR,
            content_type: 'text/html'
        }];
        cb(null, routes);
    };
    //register admin sub-nav    
    pb.AdminSubnavService.registerFor(SUB_NAV_KEY, HomePageSettings.getSubNavItems);
    //exports
    return HomePageSettings;
};