/* eslint-disable */
import axios from 'axios';

const host_url = 'http://localhost/api';

// Метод для GET запросов
async function getRequest(endpoint, params = {}) {
    try {
        const response = await axios.get(`${host_url}${endpoint}`, { params });
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

// Метод для POST запросов
async function postRequest(endpoint, data = {}) {
    try {
        const response = await axios.post(`${host_url}${endpoint}`, data);
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

// Метод для обработки ошибок
function handleError(error) {
    if (error.response) {
        // Сервер вернул ответ, отличный от 2xx
        const errorMessage = error.response.data.message || 'Ошибка валидации';
        const errorDetails = error.response.data.errors || null;
        throw { message: errorMessage, details: errorDetails };
    } else if (error.request) {
        // Запрос был отправлен, но ответа не получено
        throw new Error('Ответ от сервера не получен');
    } else {
        // Что-то случилось при настройке запроса
        throw new Error('Ошибка запроса');
    }
}

// Метод для логина
async function login(email, password) {
    try {
        const response = await postRequest('/login', { email, password });

        // Сохраняем токен и пользователя в локальное хранилище
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);

        return response;
    } catch (error) {
        // Передаем ошибку дальше
        throw error;
    }
}

export { getRequest, postRequest, login };
