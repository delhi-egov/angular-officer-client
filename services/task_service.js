module.exports = function($state, backendClient, authInfo, taskInfo) {
    return {
        selectTask: function(controller, task) {
            taskInfo.task = task;
        },
        getTasks: function(controller) {
            var promise = new Promise(function(resolve, reject) {
                controller.tasksFetchError = undefined;
                backendClient.getTasksForUser(authInfo.user)
                .then(function(response) {
                    controller.userTasks = response.data.data;
                    resolve(response.data.data);
                }, function(response) {
                    controller.tasksFetchError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        getTasksForApplication: function(controller, applicationId) {
            var promise = new Promise(function(resolve, reject) {
                controller.tasksForApplicationFetchError = undefined;
                backendClient.getTasksForUser(authInfo.user, applicationId)
                .then(function(response) {
                    controller.userTasks = response.data.data;
                    resolve(response.data.data);
                }, function(response) {
                    controller.tasksForApplicationFetchError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        getQueuedTasks: function(controller) {
            var promise = new Promise(function(resolve, reject) {
                controller.queuedFetchError = undefined;
                backendClient.getQueuedTasksForUser(authInfo.user)
                .then(function(response) {
                    controller.queuedTasks = response.data.data;
                    resolve(response.data.data);
                }, function(response) {
                    controller.queuedFetchError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        getQueuedTasksForApplication: function(controller, applicationId) {
            var promise = new Promise(function(resolve, reject) {
                controller.queuedForApplicationFetchError = undefined;
                backendClient.getQueuedTasksForUser(authInfo.user, applicationId)
                .then(function(response) {
                    controller.queuedTasks = response.data.data;
                    resolve(response.data.data);
                }, function(response) {
                    controller.queuedForApplicationFetchError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        getComments: function(controller) {
            var promise = new Promise(function(resolve, reject) {
                controller.commentsFetchError = undefined;
                backendClient.getCommentsForTask(taskInfo.task.id)
                .then(function(response) {
                    controller.comments = response.data;
                    resolve(response.data);
                }, function(response) {
                    controller.commentsFetchError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        getVariables: function(controller) {
	    var that = this;
            var promise = new Promise(function(resolve, reject) {
                controller.variablesFetchError = undefined;
                backendClient.getVariablesForTask(taskInfo.task.id)
                .then(function(response) {
                    controller.variables = that.convertVariablesToMap(response.data);
                    taskInfo.task.variables = controller.variables;
                    resolve(response.data);
                }, function(response) {
                    controller.variablesFetchError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        addComment: function(controller, comment) {
            var promise = new Promise(function(resolve, reject) {
                controller.commentPostError = undefined;
                backendClient.addCommentToTask(taskInfo.task.id, comment)
                .then(function(response) {
                    if(controller.comments === undefined) {
                        controller.comments = [];
                    }
                    controller.comments.push(response.data);
                    resolve(response.data);
                }, function(response) {
                    controller.commentPostError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        attachForm: function(controller, type, data) {
	    var that = this;
            var promise = new Promise(function(resolve, reject) {
                controller.formPostError = undefined;
                backendClient.attachForm(taskInfo.task.processInstanceId, type, data)
                .then(function(response) {
                    that.getVariables(controller)
                    .then(function(response) {
                        resolve(response.data);
                    });
                }, function(response) {
                    controller.formPostError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        attachDocument: function(controller, type, file) {
	    var that = this;
            var promise = new Promise(function(resolve, reject) {
                controller.documentPostError = undefined;
                backendClient.attachDocument(taskInfo.task.processInstanceId, type, file)
                .then(function(response) {
                    that.getVariables(controller)
                    .then(function(response) {
                        resolve(response.data);
                    });
                }, function(response) {
                    controller.documentPostError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        completeTask: function(controller) {
            var that = this;
            var promise = new Promise(function(resolve, reject) {
                controller.completeError = undefined;
                backendClient.completeTask(taskInfo.task.id, [])
                .then(function(response) {
                    taskInfo.task.complete = true;
                    resolve(response.data);
                }, function(response) {
                    controller.completeError = response.message;
                    reject(response.message);
                });
            });
            return promise;
        },
        claimTask: function(controller) {
            var promise = new Promise(function(resolve, reject) {
                var that = this;
                controller.claimError = undefined;
                backendClient.claimTask(taskInfo.task.id, authInfo.user.username)
                .then(function(response) {
                    taskInfo.task.assignee = authInfo.user.username;
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
                    taskInfo.task.assignee = user.id;
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
        },
        initTaskController: function(controller) {
            //controller.variables = this.convertVariablesToMap(taskInfo.task.variables);
        },
        convertVariablesToMap: function(variables) {
            var mappedVariables = {};
            variables.forEach(function(item, index, array) {
		if(item.type === 'map') {
		    mappedVariables[item.name] = JSON.parse(item.value);
		}
		else {
                    mappedVariables[item.name] = item.value;
		}
            });
            return mappedVariables;
        },
        addVariables: function(controller, variables) {
            backendClient.addVariablesToProcessInstance(taskInfo.task.processInstanceId, variables);
        }
    };
};
