/* eslint-disable */
import axios from 'axios';

const host_url = 'http://localhost/api';

// Метод для GET запросов
async function getRequest(endpoint, params = {}, requireAuth = false) {
    try {
        // Объект с заголовками
        let headers = {};

        // Если запрос требует авторизации, добавляем токен в заголовок
        if (requireAuth) {
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        // Отправляем GET запрос с параметрами и заголовками
        const response = await axios.get(`${host_url}${endpoint}`, {
            params,
            headers
        });

        return response.data;
    } catch (error) {
        handleError(error);
    }
}

// Метод для POST запросов
async function postRequest(endpoint, data = {}, requireAuth = false) {
    try {
        let headers = {};

        if (requireAuth) {
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        // Передаем заголовки как часть объекта конфигурации запроса
        const response = await axios.post(`${host_url}${endpoint}`, data, { headers });
        return response.data;
    } catch (error) {
        handleError(error);
    }
}

async function patchRequest(endpoint, data = {}, requireAuth = false) {
    try {
        let headers = {};

        if (requireAuth) {
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        // Передаем заголовки как часть объекта конфигурации запроса
        const response = await axios.patch(`${host_url}${endpoint}`, data, { headers });
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

// Получить текущего юзера
async function getMe() {
    return await getRequest('/me', {}, true);
}

async function getCurrency() {
    return await getRequest('/currency', {}, true);
}

async function getTimezones() {
    return await getRequest('/timezones', {}, true);
}

async function updateGeneralSettings(company_name, subdomain, currency_id, timezone_id, date_format, time_format) {
    const data = {
        company_name,
        subdomain,
        currency_id,
        timezone_id,
        date_format,
        time_format
    };
    return await postRequest('/general/settings', data, true);
}

async function updateProfile(avatar, email, name, phone, show_pennies, show_description) {
    // Создайте объект FormData
    const formData = new FormData();

    // Добавьте данные в FormData
    if (avatar) {
        formData.append('avatar', avatar);
    }
    formData.append('email', email);
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('show_pennies', show_pennies);
    formData.append('show_description', show_description);

    // Выполните запрос с formData
    try {
        const token = localStorage.getItem('token');
        const response = await axios.post(host_url+'/profile', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Произошла ошибка при обновлении данных.');
    }
}

async function getUsers() {
    return await getRequest('/users', {}, true);
}

async function getPermissions() {
    return await getRequest('/permissions', {}, true);
}

async function submitUserForm(email, phone, selectedRole, selectedPermissions) {
    let role_id = selectedRole;
    let permissions = selectedPermissions;
    const data = {
        email,
        phone,
        role_id,
        permissions
    };
    return await postRequest('/users', data, true);
}

async function getUsersByStatus(status) {
    return await getRequest('/users?active='+status, {}, true);
}

async function getEntities() {
    return await getRequest('/entity', {}, true);
}

export async function submitEntityForm(entity_name, full_name, inn, kpp, ogrn, ur_address, phone, with_nds){
    const data = {
        entity_name,
        full_name,
        inn,
        kpp,
        ogrn,
        ur_address,
        phone,
        with_nds
    };
    return await postRequest('/entity', data, true);
}

export async function getEntity(id){
    return await getRequest('/entity/'+id, {}, true);
}

export async function editEntityForm(id, entity_name, full_name, inn, kpp, ogrn, ur_address, phone, with_nds){
    const data = {
        entity_name,
        full_name,
        inn,
        kpp,
        ogrn,
        ur_address,
        phone,
        with_nds
    };
    return await patchRequest('/entity/'+id, data, true);
}

export {
    getRequest,
    postRequest,
    login,
    getMe,
    getCurrency,
    getTimezones,
    updateGeneralSettings,
    updateProfile,
    getUsers,
    getPermissions,
    submitUserForm,
    getUsersByStatus,
    getEntities
};