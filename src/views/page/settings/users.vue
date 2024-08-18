<script>
/* eslint-disable */
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import {getUsers, getPermissions, submitUserForm, getUsersByStatus} from "@/services";

/**
 * Basic-table component
 */
export default {
  page: {
    title: "Пользователи",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Пользователи",
      items: [
        {
          text: "Главная",
          href: "/"
        },
        {
          text: "Пользователи",
          active: true
        }
      ],
      users: null,
      permissions: null,
      email: '',
      phone: '',
      selectedRole: null,
      selectedPermissions: [],

      isActive: null,

      showSuccessAlert: false,
      showErrorAlert: false,
      errorMessage: '',
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await submitUserForm(
            this.email,
            this.phone,
            this.selectedRole,
            this.selectedPermissions
        );

        // Успешное обновление
        this.showSuccessAlert = true;
        this.showErrorAlert = false;

        this.users = await getUsers();

      } catch (error) {
        // Ошибка обновления
        this.showErrorAlert = true;
        this.errorMessage = error.message || 'Произошла ошибка при обновлении данных.';
        this.showSuccessAlert = false;
      }
      this.$bvModal.hide('modal-standard');
    },
    setActive(value) {
      this.isActive = value;
      this.getUsers(value ? 1 : 0);
    },
    async getUsers(status) {
      this.users = await getUsersByStatus(status);
    }
  },
  async created() {
    try {
      // Выполняем запрос и сохраняем данные пользователя
      const users = await getUsers();
      this.users = users;

      const permissions = await getPermissions();
      this.permissions = permissions;

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
      <div class="col-lg-12">

        <b-alert v-if="showSuccessAlert" show dismissible variant="success">
          Приглашение отправлено
        </b-alert>

        <b-alert v-if="showErrorAlert" show dismissible variant="danger">
          {{ errorMessage }}
        </b-alert>

        <div>
          <b-button v-b-modal.modal-standard variant="primary">Пригласить пользователя</b-button>
          <div class="btn-group btn-group-toggle ml-1">
            <label class="btn"
                   :class="{ 'btn-outline-primary': isActive === true, 'btn-default': isActive === false }"
                   @click="setActive(true)"
            >
              <input type="radio" name="options" value="true" checked="">
              Активные
            </label>
            <label class="btn"
                   :class="{ 'btn-outline-primary': isActive === false, 'btn-default': isActive === true }"
                   @click="setActive(false)"
            >
              <input type="radio" name="options" value="false">
              Не активированные
            </label>

          </div>
        </div>


        <div class="col-sm-6 col-md-4 col-xl-3">
          <div class="my-4 text-center">
            <b-modal id="modal-standard" title="Пригласить пользователя в систему" title-class="font-18">
              <form class="form-horizontal" role="form">
                <div class="mb-4">
                  <label class="form-label">Адрес электронной почты</label>
                  <div class="position-relative" id="datepicker4">
                    <input type="text" class="form-control" v-model="email">
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label">Телефон</label>
                  <div class="position-relative">
                    <input type="text" class="form-control" v-mask="'+7(###)###-##-##'" v-model="phone">
                  </div>
                </div>

                <div>
                  <div class="form-check mb-3">
                    <input class="form-check-input" type="radio" name="formRadios" id="formRadios1" checked="" value="1" v-model="selectedRole">
                    <label class="form-check-label" for="formRadios1">
                      Владелец аккаунта
                    </label>
                    <p>
                      Пользователь, обладающий всеми правами администратора, включая возможность управлять другими владельцами аккаунта
                    </p>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="formRadios" id="formRadios2" value="2" v-model="selectedRole">
                    <label class="form-check-label" for="formRadios2">
                      Администратор
                    </label>
                    <p>
                      Пользователь, обладающий полным доступом ко всем деньгам, проектам и отчетам, настройкам бизнеса, и управлению правами других пользователей (кроме владельцев аккаунта)
                    </p>
                  </div>

                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="formRadios" value="3" id="formRadios3" v-model="selectedRole">
                    <label class="form-check-label" for="formRadios3">
                      Ограниченный доступ
                    </label>
                    <p>
                      Пользователь с индивидуальными правами доступа, установленными администратором или владельцем аккаунта.
                    </p>
                  </div>


                  <div v-if="selectedRole === '3'">
                    <div v-for="permission in permissions" :key="permission.id" class="form-check mb-3">
                      <input
                          class="form-check-input"
                          type="checkbox"
                          :id="'formCheck' + permission.id"
                          v-model="selectedPermissions"
                          :value="permission.id"
                      >
                      <label class="form-check-label" :for="'formCheck' + permission.id">
                        {{ permission.name }}
                      </label>
                    </div>
                  </div>

                </div>

              </form>

              <template #modal-footer>
                <b-button variant="secondary" @click="$bvModal.hide('modal-standard')">Отмена</b-button>
                <b-button variant="primary" @click="submitForm">Отправить приглашение</b-button>
              </template>

            </b-modal>
          </div>
        </div>

        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table mb-0">
                <thead>
                <tr>
                  <th>#</th>
                  <th>Имя</th>
                  <th>Электронная почта</th>
                  <th>Статус</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="user in users" :key="user.id">
                  <th scope="row">{{ user.id }}</th>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.logged_in == 0 ? 'Не активирован' : 'Активирован' }}</td>
                </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end row -->
  </Layout>
</template>