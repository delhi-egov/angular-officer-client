var infoHolder = require('./holders/info_holder');
var backendClient = require('./helpers/backend_client');
var authenticationInterceptor = require('./interceptors/authentication_interceptor');

var userService = require('./services/user_service');
var taskService = require('./services/task_service');
var applicationService = require('./services/application_service');

module.exports = {
    infoHolder: infoHolder,
    backendClient: backendClient,
    authenticationInterceptor: authenticationInterceptor,
    userService: userService,
    taskService: taskService,
    applicationService: applicationService
};
