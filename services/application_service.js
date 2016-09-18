module.exports = function($state, backendClient, authInfo, applicationInfo) {
	return {
		getHistoricalProcess: function(applicationId) {
			backendClient.getHistoricalApplication(applicationId)
			.then(function(response) {
					if(response.data) {
                    	applicationInfo.application = response.data[0];
                    	resolve(response.data[0]);
                	}
                	else {
                		reject("No application with given application id found");
                	}
                }, function(response) {
                    controller.getApplicationError = response.message;
                    reject(response.message);
                });
		}
	}
}