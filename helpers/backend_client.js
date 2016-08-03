module.exports = function($http, Upload) {
    return {
        login: function(username, password) {
            var config = {
                headers: {
                    "Authorization" : "Basic " + window.btoa(username + ":" + password)
                }
            };
            return $http.post('/api/user/login', {}, config);
        },
        logout: function() {
            return $http.post('/api/user/logout', {});
        },
        me: function() {
            return $http.get('/api/user/me');
        },
        queryTasks: function(query) {
            return $http.post('/api/query/tasks', query);
        },
        getTasksForUser: function(user, applicationId) {
            var query = {
                assignee: user.username,
                includeTaskLocalVariables: true,
                includeProcessVariables: true
            };
            if(applicationId) {
                query.processInstanceBusinessKey = applicationId;
            }
            return this.queryTasks(query);
        },
        getQueuedTasksForUser: function(user, applicationId) {
            var query = {
                candidateUser: user.username,
                includeTaskLocalVariables: true,
                includeProcessVariables: true
            };
            if(applicationId) {
                query.processInstanceBusinessKey = applicationId;
            }
            return this.queryTasks(query);
        },
        getTasksForApplication: function(applicationId) {
            var query = {
                processInstanceBusinessKey: applicationId,
                includeTaskLocalVariables: true,
                includeProcessVariables: true
            };
            return $http.post('/api/query/tasks', query);
        },
        getCommentsForTask: function(taskId) {
            return $http.get('/api/runtime/tasks/' + taskId + '/comments');
        },
        getVariablesForTask: function(taskId) {
            return $http.get('/api/runtime/tasks/' + taskId + '/variables');
        },
        addCommentToTask: function(taskId, comment) {
            return $http.post('/api/runtime/tasks/' + taskId + '/comments', {
                message : comment,
                saveProcessInstanceId : true
            });
        },
        addVariablesToProcessInstance: function(processInstanceId, variables) {
            return $http.put('/api/runtime/process-instances/' + 'processInstanceId' + '/variables', variables);
        },
        attachForm: function(processInstanceId, type, data) {
            return $http.post('/api/data/attachForm', {
                processInstanceId: processInstanceId,
                type: type,
                data: data
            });
        },
        attachDocument: function(processInstanceId, type, file) {
            return Upload.upload({
                url: '/api/data/attachDocument',
                data: {
                    file: file,
                    form: JSON.stringify({
                        processInstanceId: processInstanceId,
                        type: type
                    })
                }
            });
        },
        completeTask: function(taskId, variables) {
            return $http.post('/api/runtime/tasks/' + taskId, {
                action : 'complete',
                variables : variables
            });
        },
        claimTask: function(taskId, assignee) {
            return $http.post('/api/runtime/tasks/' + taskId, {
                action : 'claim',
                assignee : assignee
            });
        },
        getUsers: function(firstNameLike, lastNameLike, memberOfGroup) {
            var query;
            if(firstNameLike) {
                if(!query) {
                    query = '?firstNameLike=' + firstNameLike;
                }
                else {
                    query = query + '&firstNameLike=' + firstNameLike;
                }
            }
            if(lastNameLike) {
                if(!query) {
                    query = '?lastNameLike=' + lastNameLike;
                }
                else {
                    query = query + '&lastNameLike=' + lastNameLike;
                }
            }
            if(memberOfGroup) {
                if(!query) {
                    query = '?memberOfGroup=' + memberOfGroup;
                }
                else {
                    query = query + '&memberOfGroup=' + memberOfGroup;
                }
            }
            var url = '/api/identity/users';
            if(query) {
                url = url + query;
            }
            return $http.get(url);
        }
    };
};
