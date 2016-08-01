module.exports = function($state, backendClient, authInfo, taskInfo, appConfig) {
    return {
        selectTask: function(controller, task) {
            taskInfo.task = task;
            var parts = taskInfo.task.processInstance.split('/');
            var processInstanceId = parts[parts.length - 1];
            taskInfo.task.processInstanceId = processInstanceId;
            controller.variables = task.variables;
        },
        getTasks: function(controller) {
            var promise = new Promise(function(resolve, reject) {
                controller.fetchError = undefined;
                backendClient.getTasksForUser(authInfo.user)
                .then(function(response) {
                    controller.userTasks = response.data;
                    resolve(response.data);
                }, function(response) {
                    controller.fetchError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        getTasksForApplication: function(controller, applicationId) {
            var promise = new Promise(function(resolve, reject) {
                controller.fetchError = undefined;
                backendClient.getTasksForUser(authInfo.user, applicationId)
                .then(function(response) {
                    controller.userTasks = response.data;
                    resolve(response.data);
                }, function(response) {
                    controller.fetchError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        getQueuedTasks: function(controller) {
            var promise = new Promise(function(resolve, reject) {
                controller.fetchError = undefined;
                backendClient.getQueuedTasksForUser(authInfo.user)
                .then(function(response) {
                    controller.queuedTasks = response.data;
                    resolve(response.data);
                }, function(response) {
                    controller.fetchError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        getQueuedTasksForApplication: function(controller, applicationId) {
            var promise = new Promise(function(resolve, reject) {
                controller.fetchError = undefined;
                backendClient.getQueuedTasksForUser(authInfo.user, applicationId)
                .then(function(response) {
                    controller.queuedTasks = response.data;
                    resolve(response.data);
                }, function(response) {
                    controller.fetchError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        getComments: function(controller) {
            var promise = new Promise(function(resolve, reject) {
                controller.fetchError = undefined;
                backendClient.getCommentsForTask(taskInfo.task.id)
                .then(function(response) {
                    controller.comments = response.data;
                    resolve(response.data);
                }, function(response) {
                    controller.fetchError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        addComment: function(controller, comment) {
            var promise = new Promise(function(resolve, reject) {
                controller.postError = undefined;
                backendClient.addCommentToTask(taskInfo.task.id, comment)
                .then(function(response) {
                    if(controller.comments === undefined) {
                        controller.comments = [];
                    }
                    controller.comments.push(response.data);
                    resolve(response.data);
                }, function(response) {
                    controller.postError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        addData: function(controller, name, data) {
            var promise = new Promise(function(resolve, reject) {
                controller.postError = undefined;
                var variables = [
                    {
                        name: name,
                        value: data
                    }
                ];
                backendClient.addVariablesToProcessInstance(taskInfo.task.processInstanceId, variables)
                .then(function(response) {
                    controller.variables.push(response.data[0]);
                    resolve(response.data);
                }, function(response) {
                    controller.postError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        completeTask: function(controller) {
            var promise = new Promise(function(resolve, reject) {
                controller.completeMessage = undefined;
                backendClient.completeTask(taskInfo.task.id, [])
                .then(function(response) {
                    controller.completeMessage = 'Marked task completed successfully';
                    resolve(response.data);
                }, function(response) {
                    controller.completeMessage = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        claimTask: function(controller) {
            var promise = new Promise(function(resolve, reject) {
                var that = this;
                controller.claimError = undefined;
                backendClient.claimTask(taskInfo.task.id, authInfo.user.id)
                .then(function(response) {
                    that.getTasks(controller);
                    that.getQueuedTasks(controller);
                    resolve(response.data);
                }, function(response) {
                    controller.claimError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        assignTask: function(controller, user) {
            var promise = new Promise(function(resolve, reject) {
                var that = this;
                controller.assignError = undefined;
                backendClient.claimTask(taskInfo.task.id, user.id)
                .then(function(response) {
                    that.getTasks(controller);
                    that.getQueuedTasks(controller);
                    resolve(response.data);
                }, function(response) {
                    controller.assignError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        getUsers: function(controller, firstNameLike, lastNameLike, memberOfGroup) {
            var promise = new Promise(function(resolve, reject) {
                controller.getUsersError = undefined;
                backendClient.getUsers(firstNameLike, lastNameLike, memberOfGroup)
                .then(function(response) {
                    controller.users = response.data;
                    resolve(response.data);
                }, function(response) {
                    controller.getUsersError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        }
    };
};
