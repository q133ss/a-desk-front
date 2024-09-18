<script>
/* eslint-disable */
import { required, email } from "vuelidate/lib/validators";
import { login } from "@/services";

export default {
  data() {
    return {
      email: "admin@email.net",
      password: "password",
      submitted: false,
      tryingToLogIn: false,
      authError: null,  // для хранения сообщения об ошибке
    };
  },
  validations: {
    email: { required, email },
    password: { required }
  },
  methods: {
    async tryToLogIn() {
      this.submitted = true;
      this.$v.$touch();

      if (this.$v.$invalid) {
        return;
      }

      this.tryingToLogIn = true;
      this.authError = null;

      const { email, password } = this;

      try {
        const response = await login(email, password);
        this.tryingToLogIn = false;
        this.$router.push(this.$route.query.redirectFrom || { name: "home" });
      } catch (error) {
        this.tryingToLogIn = false;

        // Проверяем, есть ли одинаковое сообщение в основной ошибке и в ошибках валидации
        if (error.details) {
          // Предполагаем, что детали ошибки содержат ключи полей, например `password`, и что сообщение для всех одинаково
          const firstErrorKey = Object.keys(error.details)[0];
          const errorMessage = error.details[firstErrorKey][0];

          // Устанавливаем authError только с уникальным сообщением
          this.authError = errorMessage || error.message;
        } else {
          this.authError = error.message || "Ошибка авторизации";
        }
      }
    }
  }
};
</script>

<template>
  <div>
    <div class="home-btn d-none d-sm-block">
      <a href="/">
        <i class="mdi mdi-home-variant h2 text-white"></i>
      </a>
    </div>
    <div>
      <div class="container-fluid p-0">
        <div class="row no-gutters">
          <div class="col-lg-4">
            <div class="authentication-page-content p-4 d-flex align-items-center min-vh-100">
              <div class="w-100">
                <div class="row justify-content-center">
                  <div class="col-lg-9">
                    <div>
                      <div class="text-center">
                        <div>
                          <a href="/" class="logo">
                            <img src="@/assets/images/logo-dark.png" height="20" alt="logo" />
                          </a>
                        </div>

                        <h4 class="font-size-18 mt-4">Вход в аккаунт</h4>
                      </div>

                      <b-alert
                          variant="danger"
                          class="mt-3"
                          v-if="authError"
                          show
                          dismissible
                      >
                        {{ authError }}
                      </b-alert>

                      <div class="p-2 mt-5">
                        <form class="form-horizontal" @submit.prevent="tryToLogIn">
                          <div class="form-group auth-form-group-custom mb-4">
                            <i class="ri-mail-line auti-custom-input-icon"></i>
                            <label for="email">Email</label>
                            <input
                              type="email"
                              v-model="email"
                              class="form-control"
                              id="email"
                              placeholder="Enter email"
                              :class="{ 'is-invalid': submitted && $v.email.$error }"
                            />
                            <div v-if="submitted && $v.email.$error" class="invalid-feedback">
                              <span v-if="!$v.email.required">Введите email.</span>
                              <span v-if="!$v.email.email">Неверный формат email.</span>
                            </div>
                          </div>

                          <div class="form-group auth-form-group-custom mb-4">
                            <i class="ri-lock-2-line auti-custom-input-icon"></i>
                            <label for="userpassword">Пароль</label>
                            <input
                              v-model="password"
                              type="password"
                              class="form-control"
                              id="userpassword"
                              placeholder="Enter password"
                              :class="{ 'is-invalid': submitted && $v.password.$error }"
                            />
                            <div
                              v-if="submitted && !$v.password.required"
                              class="invalid-feedback"
                            >Введите пароль.</div>
                          </div>

                          <div class="custom-control custom-checkbox">
                            <input
                              type="checkbox"
                              class="custom-control-input"
                              id="customControlInline"
                            />
                            <label
                              class="custom-control-label"
                              for="customControlInline"
                            >Запомнить меня</label>
                          </div>

                          <div class="mt-4 text-center">
                            <button
                              class="btn btn-primary w-md waves-effect waves-light"
                              type="submit"
                            >Войти</button>
                          </div>

                          <div class="mt-4 text-center">
                            <router-link tag="a" to="/forgot-password" class="text-muted">
                              <i class="mdi mdi-lock mr-1"></i> Забыли пароль?
                            </router-link>
                          </div>
                        </form>
                      </div>

                      <div class="mt-5 text-center">
                        <p>
                          Нет аккаунта?
                          <router-link
                            tag="a"
                            to="/register"
                            class="font-weight-medium text-primary"
                          >Регистрация</router-link>
                        </p>
                        <p>
                          © 2024 Nazox. Crafted with
                          <i class="mdi mdi-heart text-danger"></i> by Themesdesign
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="col-lg-8">
            <div class="authentication-bg">
              <div class="bg-overlay"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
