module.exports = function($state, backendClient, authInfo, applicationInfo) {
	return {
		getHistoricalProcess: function(applicationId) {
			var promise = new Promise(function(resolve, reject) {
				backendClient.getHistoricalApplication(applicationId)
				.then(function(response) {
					if(response.data.data) {
						applicationInfo.application = response.data.data[0];
						resolve(response.data.data[0]);
					}
					else {
						controller.getApplicationError = "No application with given application id found";
						reject("No application with given application id found");
					}
				}, function(response) {
					controller.getApplicationError = response.message;
					reject(response.message);
				});
			});
			return promise;
		}
	}
}