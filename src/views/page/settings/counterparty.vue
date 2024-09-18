<script>
/* eslint-disable */
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import { getCounterparties, submitCounterpartyForm, getCounterparty, updateCounterparty } from "@/services";

/**
 * Counterparty-table component
 */
export default {
  page: {
    title: "Контрагенты",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Контрагенты",
      items: [
        {
          text: "Главная",
          href: "/"
        },
        {
          text: "Контрагенты",
          active: true
        }
      ],
      counterparties: null,

      counterparty_name: null,

      //edit vars
      id: null,

      editCounterpartyName: null,
      editUserId: null,
      // /edit vars

      loading: false,

      showSuccessAlert: false,
      successMessage: '',
      showErrorAlert: false,
      errorMessage: '',
    };
  },
  methods: {
    async submitForm() {
      try {
        const response = await submitCounterpartyForm(
            this.counterparty_name,
            this.user_id,
        );

        // Успешное добавление
        this.showSuccessAlert = true;
        this.successMessage = 'Контрагент добавлен';
        this.showErrorAlert = false;

        this.counterparties = await getCounterparties();

      } catch (error) {
        // Ошибка при добавлении
        this.showErrorAlert = true;
        this.errorMessage = error.message || 'Произошла ошибка при добавлении контрагента.';
        this.showSuccessAlert = false;
      }
      this.$bvModal.hide('modal-standard');
      this.counterparty_name = "";
    },
    async openEdit(id) {
      try {
        this.loading = true;
        // Получаем данные контрагента
        const counterparty = await getCounterparty(id);

        this.id = id;
        // Заполняем поля формы
        this.editCounterpartyName = counterparty.name;
        this.editUserId = counterparty.user_id;

        // Открываем модалку после заполнения данных
        this.$bvModal.show('modal-edit');
      } catch (error) {
        console.error('Ошибка при получении данных контрагента:', error);
      } finally {
        this.loading = false;
      }
    },
    async submitEditForm() {
      this.loading = true;

      try {
        // Отправляем данные на сервер
        const response = await updateCounterparty(
            this.id,
            this.editCounterpartyName
        );

        // Успешное обновление
        this.successMessage = 'Данные контрагента успешно обновлены!';
        this.showSuccessAlert = true;
        this.showErrorAlert = false;

        // Обновляем список контрагентов
        this.counterparties = await getCounterparties();

        // Закрываем модалку после сохранения
        this.$bvModal.hide('modal-edit');
        this.editCounterpartyName = "";
      } catch (error) {
        this.showErrorAlert = true;
        this.errorMessage = error.message || 'Произошла ошибка при обновлении контрагента.';
        this.showSuccessAlert = false;
      } finally {
        this.loading = false;
      }
    },
  },
  async created() {
    try {
      const counterparties = await getCounterparties();
      this.counterparties = counterparties;
    } catch (error) {
      console.error("Ошибка при получении данных контрагентов:", error.message);
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
          {{ successMessage }}
        </b-alert>

        <b-alert v-if="showErrorAlert" show dismissible variant="danger">
          {{ errorMessage }}
        </b-alert>

        <div>
          <b-button v-b-modal.modal-standard variant="primary">Добавить контрагента</b-button>
        </div>

        <div class="col-sm-6 col-md-4 col-xl-3">
          <div class="my-4 text-center">
            <b-modal id="modal-standard" title="Добавить контрагента" title-class="font-18">
              <form class="form-horizontal" role="form">
                <div class="mb-4">
                  <label class="form-label">Название контрагента</label>
                  <div class="position-relative">
                    <input type="text" class="form-control" placeholder="ООО Контрагент" v-model="counterparty_name">
                  </div>
                </div>
              </form>

              <template #modal-footer>
                <b-button variant="secondary" @click="$bvModal.hide('modal-standard')">Отмена</b-button>
                <b-button variant="primary" @click="submitForm">Добавить</b-button>
              </template>

            </b-modal>
          </div>
        </div>

        <!-- Edit form -->
        <div class="col-sm-6 col-md-4 col-xl-3">
          <div class="my-4 text-center">

            <!-- Модалка для редактирования -->
            <b-modal id="modal-edit" title="Редактировать контрагента" title-class="font-18" :class="{ 'loading-cursor': loading }">
              <form class="form-horizontal" role="form">
                <div class="mb-4">
                  <label class="form-label">Название контрагента</label>
                  <div class="position-relative">
                    <input type="text" class="form-control" placeholder="ООО Контрагент" v-model="editCounterpartyName">
                  </div>
                </div>
              </form>

              <template #modal-footer>
                <b-button variant="secondary" @click="$bvModal.hide('modal-edit')">Отмена</b-button>
                <b-button variant="primary" @click="submitEditForm">Сохранить</b-button>
              </template>
            </b-modal>
          </div>
        </div>

        <!-- /Edit form -->

        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table mb-0">
                <thead>
                <tr>
                  <th>#</th>
                  <th>Контрагент</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="counterparty in counterparties" :key="counterparty.id" style="cursor: pointer" @click="openEdit(counterparty.id)">
                  <th scope="row">{{ counterparty.id }}</th>
                  <td>{{ counterparty.name }}</td>
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
