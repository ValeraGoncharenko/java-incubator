import * as axios from 'axios';

const API_LOCALHOST = 'http://localhost:9000/api';
const API_SERVER = 'http://185.255.135.104:9000/api/';
const API_URL = API_SERVER;

const loginEndPointURL = API_URL + 'auth/login';
const LOGOUT_END_POINT_URL = API_URL + 'auth/logout/';

const CREATE_NEW_USER_ENDPOINT = API_URL + 'users/create';
const CREATE_NEW_USER_CREDENTIALS_ENDPOINT = API_URL + 'credentials/create';

const allprojectsEndPointURL = API_URL + 'projects/projects-all';
const newProjectEndPointURL = API_URL + 'projects/createProject';
const paginatableProjectEndPointURL = API_URL + 'projects/watch/';
const UPDATE_PROJECT_ENDPOINT_URL = API_URL + 'projects/update/';
const PROJECTS_COUNT_ENDPOINT_URL = API_URL + 'projects/countProjects/';
const DELETE_PROJECT_ENDPOINT_URL = API_URL + 'projects/delete/';             //'/delete/{projectId}'


const getTasksEndPointURL = API_URL + 'tasks/page/';
const TASKS_COUNT_END_POINT = API_URL + 'tasks/count/';
const NEW_TASK_END_POINT = API_URL + 'tasks/create/';
const UPDATE_TASK_END_POINT = API_URL + 'tasks/update/';
const DELETE_TASK_END_POINT = API_URL + 'tasks/delete/';


const GET_ALL_USERS_END_POINT = API_URL + 'users/users-all';
const USERS_COUNT_END_POINT = API_URL + 'users/count';
const GET_PAGINATION_END_POINT = API_URL + 'users/page/';

// MESSAGES_CONTROLLER_PREFIX = API_PREFIX + "/messages";
const CREATE_NEW_MESSAGE_END_POINT = API_URL + 'messages/create/';
const DELETE_MESSAGE_END_POINT = API_URL + 'messages/delete/';
const MESSAGES_COUNT_MESSAGE_END_POINT = API_URL + 'messages/count/';
const READ_MESSAGE_END_POINT = API_URL + 'messages/read/';
const UPDATE_MESSAGE_END_POINT = API_URL + 'messages/update/';
const ALL_MESSAGES_FOR_USER_END_POINT = API_URL + 'messages/all-messages-for-user/';
const DELETE_ALL_MESSAGES_FOR_USER = API_URL + 'messages/delete-all-messages-for-user/';
const SET_MESSAGES_AS_READ = API_URL + 'messages/messages-as-read/';

export const loginAPI = {
    doLogin(formData) {
        return axios.post(loginEndPointURL, {
            "login": formData.login,
            "password": formData.password
        }).then(response => {
            localStorage.setItem('sessionId', response.data.sessionId);
            return response.data;
        })
    },
    doLogout() {
        let sessionId = localStorage.getItem('sessionId');
        return axios.get(LOGOUT_END_POINT_URL + sessionId).then(response => {

            console.log(response);
        })
    }
};

export const CreateNewUser = {
    createNewUser(newUser) {
        return axios({
            method: 'POST',
            url: CREATE_NEW_USER_ENDPOINT,
            data: newUser
        }).then(function (response) {
            console.log(response);
        })
            .catch(function (error) {
                console.log(error);
            })
    },
    createNewCredentials(newCredentials) {
        return axios({
            method: 'POST',
            url: CREATE_NEW_USER_CREDENTIALS_ENDPOINT,
            data: newCredentials
        }).then(function (response) {
            console.log(response);
        })
            .catch(function (error) {
                console.log(error);
            })
    },

};


export const ProjectsAPI = {
    getAllProjects() {
        let sessionId = localStorage.getItem('sessionId');
        return axios.get(allprojectsEndPointURL, {headers: {sessionId: sessionId}}).then(response => {
            return response.data;
        });
    },

    getProjectsNumber() {
        let sessionId = localStorage.getItem('sessionId');
        return axios.get(PROJECTS_COUNT_ENDPOINT_URL, {headers: {sessionId: sessionId}}).then(response => {
            return response.data;
        });
    },

    createProject(newProject) {
        let sessionId = localStorage.getItem('sessionId');
        return axios({
            method: 'POST',
            url: newProjectEndPointURL,
            headers: {sessionId: sessionId},
            data: newProject
        }).then(function (response) {
            console.log(response);
        })
            .catch(function (error) {
                console.log(error);
            })
    },

    getProjectsWithPagination(currentPage, numberForPage) {
        let sessionId = localStorage.getItem('sessionId');
        return axios.get(paginatableProjectEndPointURL + currentPage + "/" + numberForPage, {headers: {sessionId: sessionId}}).then(response => {
            return response.data;
        });
    },

    updateProject(project) {
        let sessionId = localStorage.getItem('sessionId');
        return axios.patch(UPDATE_PROJECT_ENDPOINT_URL, {headers: {sessionId: sessionId}}, {data: project}).then(response => {
            console.log(response);
            return response.data;
        })
            .catch(function (error) {
                console.log(error);
            });
    },
    deleteProject(projectId) {
        let sessionId = localStorage.getItem('sessionId');
        return axios.delete(DELETE_PROJECT_ENDPOINT_URL + projectId, {headers: {sessionId: sessionId}}).then(response => {
            console.log(response);
            return response.data;
        })
            .catch(function (error) {
                console.log(error);
            });
    }
};


export const TasksAPI = {

    getTasks(page, size) {
        let sessionId = localStorage.getItem('sessionId');
        return axios.get(getTasksEndPointURL + page + "/" + size, {headers: {sessionId: sessionId}}).then(response => {
            return response.data;
        });
    },
    getNumberOfTasks() {
        let sessionId = localStorage.getItem('sessionId');
        return axios.get(TASKS_COUNT_END_POINT, {headers: {sessionId: sessionId}}).then(response => {
            return response.data;
        })
    },
    createTask(newTask) {
        let sessionId = localStorage.getItem('sessionId');
        return axios({
            method: 'POST',
            url: NEW_TASK_END_POINT,
            headers: {sessionId: sessionId},
            data: newTask
        }).then(function (response) {
            console.log(response);
        })
            .catch(function (error) {
                console.log(error);
            })
    },
    updateTask(task) {
        let sessionId = localStorage.getItem('sessionId');
        return axios.patch(UPDATE_TASK_END_POINT, {headers: {sessionId: sessionId}}, {data: task}).then(response => {
            console.log(response);
            return response.data;
        })
            .catch(function (error) {
                console.log(error);
            });
    },
    deleteTask(taskId) {
        let sessionId = localStorage.getItem('sessionId');
        return axios.delete(DELETE_TASK_END_POINT + taskId, {headers: {sessionId: sessionId}}).then(response => {
            console.log(response);
            return response.data;
        })
            .catch(function (error) {
                console.log(error);
            });
    }
};


export const Usersapi = {

    getNumberOfUsers() {
        let sessionId = localStorage.getItem('sessionId');
        return axios.get(USERS_COUNT_END_POINT, {headers: {sessionId: sessionId}}).then(response => {
            return response.data;
        })
    },
    getPaginationUsers(page, size) {
        let sessionId = localStorage.getItem('sessionId');
        return axios.get(GET_PAGINATION_END_POINT + page + "/" + size, {headers: {sessionId: sessionId}}).then(response => {

            return response.data;
        })
    },
    getAllUsers() {
        let sessionId = localStorage.getItem('sessionId');
        return axios.get(GET_ALL_USERS_END_POINT, {headers: {sessionId: sessionId}}).then(response => {
            return response.data;
        })
    },

};
export const MessageAPI = {
    // private long id;
    // private String author;
    // private String recipient;
    // private String text;
    // private long createDate;
    // private long editDate;
    // private long readDate;
    // private boolean edited;
    // private boolean read;

    createNewMessage(newMessage) {
        let sessionId = localStorage.getItem('sessionId');
        return axios({
            method: 'POST',
            url: CREATE_NEW_MESSAGE_END_POINT,
            headers: {sessionId: sessionId},
            data: newMessage
        }).then(function (response) {
            console.log(response);
        })
            .catch(function (error) {
                console.log(error);
            })
    },
    deleteMessage(idMessage) {
        let sessionId = localStorage.getItem('sessionId');
        return axios({
            method: 'DELETE',
            url: DELETE_MESSAGE_END_POINT + idMessage,
            headers: {sessionId: sessionId},
        }).then(function (response) {
            console.log(response);
        })
            .catch(function (error) {
                console.log(error);
            })
    },
    deleteAllMessagesForUser(email) {
        let sessionId = localStorage.getItem('sessionId');
        return axios({
            method: 'DELETE',
            url: DELETE_ALL_MESSAGES_FOR_USER + email,
            headers: {sessionId: sessionId},
        }).then(function (response) {
            console.log(response);
        })
            .catch(function (error) {
                console.log(error);
            })
    },
    readMessage(idMessage) {
        let sessionId = localStorage.getItem('sessionId');
        return axios({
            method: 'get',
            url: READ_MESSAGE_END_POINT + idMessage,
            headers: {sessionId: sessionId},
        }).then(function (response) {
            console.log(response);
            return response.data
        })
            .catch(function (error) {
                console.log(error);
            })
    },
    countMessages() {
        let sessionId = localStorage.getItem('sessionId');
        return axios({
            method: 'GET',
            url: MESSAGES_COUNT_MESSAGE_END_POINT,
            headers: {sessionId: sessionId},
        }).then(function (response) {
            console.log(response);
            return response.data;
        })
            .catch(function (error) {
                console.log(error);
            })
    },
    updateMessage(message) {
        let sessionId = localStorage.getItem('sessionId');
        return axios.patch(
            UPDATE_MESSAGE_END_POINT,
            {headers: {sessionId: sessionId}},
            {data: message}).then(response => {
            console.log(response);
            return response.data;
        })
            .catch(function (error) {
                console.log(error);
            });
    },
    setMessagesAsRead(messages) {
        let sessionId = localStorage.getItem('sessionId');
        return axios.patch(
            SET_MESSAGES_AS_READ,
            {headers: {sessionId: sessionId}},
            {data: messages}).then(response => {
            console.log(response);
            return response.data;
        })
            .catch(function (error) {
                console.log(error);
            });
    },
    readAllMessagesForUser(email) {
        let sessionId = localStorage.getItem('sessionId');
        return axios({
            method: 'get',
            url: ALL_MESSAGES_FOR_USER_END_POINT + email,
            headers: {sessionId: sessionId},
        }).then(function (response) {
            console.log(response);
            return response.data
        })
            .catch(function (error) {
                console.log(error);
            })
    },


}

