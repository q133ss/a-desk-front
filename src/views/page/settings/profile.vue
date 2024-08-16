<script>
/* eslint-disable */
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import { getMe, updateProfile } from "@/services";

/**
 * Form-element component
 */
export default {
  page: {
    title: "Профиль",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Профиль",
      items: [
        {
          text: "Главная",
          href: "/"
        },
        {
          text: "Профиль",
          active: true
        }
      ],
      status: "not_accepted",
      checkCustom: "not_accepted",
      checked: true,
      userData: null,

      avatar: null,
      selectedAvatar: null,
      email: null,
      name: null,
      phone: null,
      apikey: "f113f8cabe074392af7d7d78ee03d52b6315a1d138f44c8b9131a3a87addba6e",
      show_pennies: null,
      show_description: null,

      showSuccessAlert: false,
      showErrorAlert: false,
      errorMessage: ''
    };
  },
  methods: {
    async save() {
      try {
        // Передайте данные в updateProfile
        const response = await updateProfile(
            this.selectedAvatar,
            this.email,
            this.name,
            this.phone,
            this.show_pennies,
            this.show_description
        );

        // Успешное обновление
        this.showSuccessAlert = true;
        this.showErrorAlert = false;
        console.log('Profile updated successfully:', response);

      } catch (error) {
        // Ошибка обновления
        this.showErrorAlert = true;
        this.errorMessage = error.message || 'Произошла ошибка при обновлении данных.';
        this.showSuccessAlert = false;
      }
    },
    handleFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedAvatar = file;
      }
    },
  },
  async created() {
    try {
      // Выполняем запрос и сохраняем данные пользователя
      const data = await getMe();
      this.userData = data;

      this.avatar = data.avatar ? data.avatar.src : '';
      this.email = data.email;
      this.name = data.name;
      this.phone = data.phone;
      this.show_pennies = data.show_pennies;
      this.show_description = data.show_description;

      this.companyName = data.company_name;
      this.subdomain = data.subdomain;

    } catch (error) {
      console.error("Ошибка при получении данных пользователя:", error.message);
    }
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="row">
      <div class="col-12">
        <div class="card">
          <div class="card-body">
            <div class="row">
              <div class="col-12">

                <b-alert v-if="showSuccessAlert" show dismissible variant="success">
                  Данные успешно обновлены!
                </b-alert>

                <b-alert v-if="showErrorAlert" show dismissible variant="danger">
                  {{ errorMessage }}
                </b-alert>

                <form class="form-horizontal" role="form">
                    <b-form-group
                        id="example text"
                        label-cols-sm="2"
                        label-cols-lg="2"
                        label="Аватар"
                        label-for="customFile"
                    >
                    <div class="custom-file">
                      <input id="customFile" @change="handleFileChange" type="file" class="custom-file-input" />
                      <label class="custom-file-label" for="customFile">Выбрать файл</label>
                    </div>
                  </b-form-group>

                  <img :src="userData.avatar.src" alt="">

                  <b-form-group
                      id="example text"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Электронная почта"
                      label-for="text"
                  >
                    <b-form-input for="text" v-model="email"></b-form-input>
                  </b-form-group>

                  <b-form-group
                      id="example-search"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Имя и фамилия"
                      label-for="search"
                  >
                    <b-form-input
                        id="search"
                        v-model="name"
                        type="text"
                        name="search"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                      id="example-search"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Телефонный номер"
                      label-for="search"
                  >
                    <b-form-input
                        id="search"
                        v-model="phone"
                        type="text"
                        name="search"
                    ></b-form-input>
                  </b-form-group>

                  <b-form-group
                      id="example-search"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Ключ доступа к API"
                      label-for="search"
                  >
                    <b-form-input
                        id="search"
                        v-model="apikey"
                        type="text"
                        disabled
                        name="search"
                    ></b-form-input>
                  </b-form-group>

                  <div>
                    <label class="col-form-label">Настройки отображения</label>
                    <div class="form-check mb-3">
                      <input
                          class="form-check-input"
                          type="checkbox"
                          id="defaultCheck1"

                          v-model="show_pennies"
                          true-value="1"
                          false-value="0"
                      />
                      <label class="form-check-label" for="defaultCheck1">Показывать копейки в суммах</label>
                    </div>

                    <div class="form-check mb-3">
                      <input
                          class="form-check-input"
                          type="checkbox"
                          id="defaultCheck1"
                          v-model="show_description"
                          true-value="1"
                          false-value="0"
                      />
                      <label class="form-check-label" for="defaultCheck1">Показывать описания разделов</label>
                    </div>
                  </div>


                  <button type="button" class="btn btn-primary" @click="save">Сохранить</button>

                </form>
              </div>
            </div>
            <!-- end row -->
          </div>
        </div>
        <!-- end card -->
      </div>
      <!-- end col -->
    </div>
  </Layout>
</template>