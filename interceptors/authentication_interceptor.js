module.exports = function($q, $location, $injector) {
    return {
            response: function(response) {
                return response || $q.when(response);
            },
            responseError: function(rejection) {
	        if (rejection.status === 401) {
	            $injector.get('$state').go('user.login');
	        }
                return $q.reject(rejection);
            }
        };
};

//http://stackoverflow.com/questions/20230691/injecting-state-ui-router-into-http-interceptor-causes-circular-dependency
