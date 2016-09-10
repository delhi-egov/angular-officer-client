module.exports = function($state, backendClient, authInfo) {
    return {
        //Does login of user
        //Stores user data in authInfo
        //Set loginError on controller object in case of error
        //Takes user to either verify or home page
        login: function(controller, credentials) {
            controller.loginError = undefined;
            backendClient.login(credentials.username, credentials.password)
            .then(function(response) {
                authInfo.user = response.data;
                $state.go('dashboard');
            },function(response) {
                controller.loginError = "Incorrect credentials";
            });
        },
        //Does logout of user
        //Clears user data in authInfo
        //Set logoutError on controller object in case of error
        //Takes the user to the login page
        logout: function(controller) {
            controller.logoutError = undefined;
            backendClient.logout()
            .then(function(response) {
                authInfo.user = {};
                $state.go('user.login');
            },function(response) {
                controller.logoutError = response.message;
            });
        },
        //Gets logged in user's information
        //Calls the callback methods with the response/error data
        me: function(controller) {
            var promise = new Promise(function(resolve, reject) {
                backendClient.me()
                .then(function(response) {
                    authInfo.user = response.data;
                    resolve(response.data);
                },function(response) {
                    reject(response.message);
                });
            });
            return promise;
        }
    };
};
