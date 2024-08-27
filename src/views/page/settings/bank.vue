<script>
/* eslint-disable */
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import DatePicker from "vue2-datepicker";
import {
  getEntities,
  submitEntityForm,
  getEntity,
  editEntityForm,
  getCurrency,
  getAccountArticles,
  getAccountGroups,
  getAccounts,
  submitBankAccountsForm,
  addGroup,
  getAccountById,
  submitBankAccountsEditForm,
  getEntityAccounts
} from "@/services";
import ru from 'vue2-datepicker/locale/ru';

/**
 * Basic-table component
 */
export default {
  page: {
    title: "Банковские счета",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader, DatePicker },

  data() {
    return {
      title: "Банковские счета",
      items: [
        {
          text: "Главная",
          href: "/"
        },
        {
          text: "Банковские счета",
          active: true
        }
      ],
      accounts: null,
      selectedAccounts: [],
      ru,

      type: 0,

      name: null,
      group_id: null,
      groups: null,
      entity_id: null,
      entities: null,
      currencies: null,
      currency_id: null,
      bank: null,
      bik: null,
      ks: null,
      number: null,
      articles: null,
      commission_article_id: null,
      return_clause_id: null,
      initial_amount: null,
      date: null,

      showInitial: false,
      showEq: false,

      loading: false,

      showSuccessAlert: false,
      successMessage: '',
      showErrorAlert: false,
      errorMessage: '',

      group_name: null,

      dateFormat: "YYYY-MM-DD",

      // edit fields
      editName: null,
      editGroupId: null,
      editEntityId: null,
      editCurrencyId: null,
      editBank: null,
      editBik: null,
      editKs: null,
      editNumber: null,
      editCommissionArticleId: null,
      editReturnClauseId: null,
      editInitialAmount: null,
      editDate: null,
      editShowInitial: false,
      editShowEq: false,
      editType: null,

      editId: null,

      isActive: null,

      tableType: 0,

      entityAccounts: null,

      test: [],
    };
  },
  methods: {
    hideContent(type) {
      if (type === 0) {
        this.showInitial = !this.showInitial;
      } else {
        this.showEq = !this.showEq;
      }
    },
    hideEditContent(type) {
      if (type === 0) {
        this.editShowInitial = !this.editShowInitial;
      } else {
        this.editShowEq = !this.editShowEq;
      }
    },
    isSelected(id) {
      return this.selectedAccounts.includes(id);
    },
    toggleAll() {
      if (this.selectedAccounts.length === this.accounts.length) {
        this.selectedAccounts = [];
      } else {
        this.selectedAccounts = this.accounts.map(account => account.id);
      }
    },

    formatDate(date) {
      // Форматируем дату в формат "YYYY-MM-DD"
      if (!date) return null;
      // Преобразуем дату в формат "YYYY-MM-DD"
      return date.toISOString().split('T')[0];
    },
    async _addGroup() {
      try {
        const response = await addGroup(
            this.group_name
        );
        // Успешное обновление
        this.showSuccessAlert = true;
        this.successMessage = 'Группа добавлена';
        this.showErrorAlert = false;

        this.groups = await getAccountGroups();

      } catch (error) {
        // Ошибка обновления
        this.showErrorAlert = true;
        this.errorMessage = error.message || 'Произошла ошибка при обновлении данных.';
        this.showSuccessAlert = false;
      }
      this.$bvModal.hide('modal-group');
    },

    async submitForm() {
      try {
        const date = this.formatDate(this.date);
        const response = await submitBankAccountsForm(
            this.name,
            this.group_id,
            this.entity_id,
            this.currency_id,
            this.bank,
            this.bik,
            this.ks,
            this.number,
            this.commission_article_id,
            this.return_clause_id,
            this.initial_amount,
            date,
        );

        // Успешное обновление
        this.showSuccessAlert = true;
        this.successMessage = 'Счет добавлен';
        this.showErrorAlert = false;

        this.accounts = await getAccounts();

      } catch (error) {
        // Ошибка обновления
        this.showErrorAlert = true;
        this.errorMessage = error.message || 'Произошла ошибка при обновлении данных.';
        this.showSuccessAlert = false;
      }
      this.$bvModal.hide('modal-standard');
    },


    async openEdit(id) {
      try {
        this.loading = true;
        // Получаем данные сущности
        const entity = await getEntity(id);

        this.id = id;
        // Заполняем поля формы
        this.editEntityName = entity.entity_name;
        this.editFullName = entity.full_name;
        this.editInn = entity.inn;
        this.editKpp = entity.kpp;
        this.editOgrn = entity.ogrn;
        this.editUrAddress = entity.ur_address;
        this.editPhone = entity.phone;
        this.editWithNds = !!entity.with_nds; // Приводим к булевому значению

        // Открываем модалку после заполнения данных
        this.$bvModal.show('modal-edit');
      } catch (error) {
        console.error('Ошибка при получении данных:', error);
      } finally {
        this.loading = false; // Отключаем состояние загрузки после завершения
      }
    },
    async submitEditForm() {
      this.loading = true; // Включаем состояние загрузки

      try {
        // Отправляем данные на сервер
        const response = await editEntityForm(
            this.editId,
            this.editEntityName,
            this.editFullName,
            this.editInn,
            this.editKpp,
            this.editOgrn,
            this.editUrAddress,
            this.editPhone,
            this.editWithNds,
        );

        // Успешное обновление
        this.successMessage = 'Данные успешно обновлены!';
        this.showSuccessAlert = true;
        this.showErrorAlert = false;

        // Обновляем список сущностей
        this.entities = await getEntities();

        // Закрываем модалку после успешного сохранения
        this.$bvModal.hide('modal-edit');
      } catch (error) {
        // Обработка ошибки
        this.showErrorAlert = true;
        this.errorMessage = error.message || 'Произошла ошибка при обновлении данных.';
        this.showSuccessAlert = false;
      } finally {
        this.loading = false; // Отключаем состояние загрузки после завершения
      }
    },

    async editForm(id) {
      // Предположим, что данные счета можно получить через API
      const account = await getAccountById(id); // Метод получения данных счета по ID

      this.editId = id;
      // Устанавливаем значения переменных для редактирования
      this.editName = account.name;
      this.editGroupId = account.group_id;
      this.editEntityId = account.entity_id;
      this.editCurrencyId = account.currency_id;
      this.editBank = account.bank;
      this.editBik = account.bik;
      this.editKs = account.ks;
      this.editNumber = account.number;
      this.editCommissionArticleId = account.commission_article_id;
      this.editReturnClauseId = account.return_clause_id;
      this.editInitialAmount = account.initial_amount;
      this.editDate = account.date;
      this.editShowInitial = account.show_initial;
      this.editShowEq = account.show_eq;
      this.editType = account.type;

      // Открываем модалку редактирования
      this.$bvModal.show('modal-edit');
    },

    setActive(value) {
      this.isActive = value;
      this.tableType = value ? 1 : 2;
      //this.getUsers(value ? 1 : 0);
    },

    async updateForm() {
      try {
        const date = this.formatDate(this.date);
        const response = await submitBankAccountsEditForm(
            this.editId,
            this.editName,
            this.editGroupId,
            this.editEntityId,
            this.editCurrencyId,
            this.editBank,
            this.editBik,
            this.editKs,
            this.editNumber,
            this.editCommissionArticleId,
            this.editReturnClauseId,
            this.editInitialAmount,
            this.editDate,
            this.editShowInitial,
            this.editShowEq,
            this.editType,
            date,
        );

        // Успешное обновление
        this.showSuccessAlert = true;
        this.successMessage = 'Счет обновлен';
        this.showErrorAlert = false;

        this.accounts = await getAccounts();

      } catch (error) {
        // Ошибка обновления
        this.showErrorAlert = true;
        this.errorMessage = error.message || 'Произошла ошибка при обновлении данных.';
        this.showSuccessAlert = false;
      }
      this.$bvModal.hide('modal-edit');
    },
  },
  async created() {
    try {
      // Выполняем запрос и сохраняем данные пользователя
      const accounts = await getAccounts();
      this.accounts = accounts;

      this.groups = await getAccountGroups();
      this.group_id = this.groups.length > 0 ? this.groups[0].id : null;

      this.entities = await getEntities();
      this.entity_id = this.entities.length > 0 ? this.entities[0].id : null;

      this.currencies = await getCurrency();
      this.currency_id = this.currencies.length > 0 ? this.currencies[0].id : null;

      this.articles = await getAccountArticles();

      this.entityAccounts = await getEntityAccounts();
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
          {{ successMessage }}
        </b-alert>

        <b-alert v-if="showErrorAlert" show dismissible variant="danger">
          {{ errorMessage }}
        </b-alert>

        <div>
          <b-button v-b-modal.modal-standard variant="primary">Добавить вручную</b-button>

          <div class="btn-group btn-group-toggle ml-1">
            <label class="btn"
                   :class="{ 'btn-outline-primary': isActive === true, 'btn-default': isActive === false }"
                   @click="setActive(true)"
            >
              <input type="radio" name="options" value="true" checked="">
              По юр.лицам
            </label>
            <label class="btn"
                   :class="{ 'btn-outline-primary': isActive === false, 'btn-default': isActive === true }"
                   @click="setActive(false)"
            >
              <input type="radio" name="options" value="false">
              По группам
            </label>

          </div>

        </div>

        <div class="col-sm-6 col-md-4 col-xl-3">
          <div class="my-4 text-center">
            <b-modal id="modal-standard" title="Пригласить пользователя в систему" title-class="font-18">
              <form class="form-horizontal" role="form">

                <div class="d-flex align-items-center justify-content-between mb-4">
                  <div class="form-check me-3">
                    <input class="form-check-input" type="radio" name="paymentOption" id="bankAccount" value="0" v-model="type" placeholder="Рублевой счет в Сбербанке">
                    <label class="form-check-label" for="bankAccount">
                      Название счета
                    </label>
                  </div>

                  <div class="form-check me-3">
                    <input class="form-check-input" type="radio" name="paymentOption" id="cash" value="1" v-model="type">
                    <label class="form-check-label" for="cash">
                      Наличные или касса
                    </label>
                  </div>
                  <div class="form-check">
                    <input class="form-check-input" type="radio" name="paymentOption" id="fund" value="2" v-model="type">
                    <label class="form-check-label" for="fund">
                      Фонд
                    </label>
                  </div>
                </div>


                <div class="row">
                  <div class="mb-4 col-md-6">
                    <label class="form-label">Название счета*</label>
                    <div class="position-relative" id="datepicker4">
                      <input type="text" class="form-control" placeholder="Рублевой счет в Сбербанке" v-model="name">
                    </div>
                  </div>

                  <div class="mb-4 col-md-6">
                    <label class="form-label">Группа счетов*</label>
                    <button class="btn btn-link" v-b-modal.modal-group type="button">Добавить</button>
                    <div class="position-relative">
                      <select class="form-control" v-model="group_id">
                        <option v-for="group in groups" :key="group.id" :value="group.id">
                          {{ group.name }}
                        </option>
                        <option value="">Без группы</option>
                      </select>
                    </div>
                  </div>

                  <div class="mb-4 col-md-6">
                    <label class="form-label">Юр. лицо*</label>
                    <div class="position-relative">
                      <select class="form-control" v-model="entity_id">
                        <option v-for="entity in entities" :key="entity.id" :value="entity.id">
                          {{ entity.entity_name }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="mb-4 col-md-6" v-show="type == 0">
                    <label class="form-label">Банк</label>
                    <div class="position-relative">
                      <input type="text" class="form-control" placeholder="" v-model="bank">
                    </div>
                  </div>

                  <div class="mb-4 col-md-6" v-show="type == 0">
                    <label class="form-label">Бик</label>
                    <div class="position-relative">
                      <input type="text" class="form-control" placeholder="" v-model="bik">
                    </div>
                  </div>

                  <div class="mb-4 col-md-6" v-show="type == 0">
                    <label class="form-label">К/С</label>
                    <div class="position-relative">
                      <input type="text" class="form-control" placeholder="" v-model="ks">
                    </div>
                  </div>

                  <div class="mb-4 col-md-6" v-show="type == 0">
                    <label class="form-label">Номер счета</label>
                    <div class="position-relative">
                      <input type="text" class="form-control" placeholder="" v-model="number">
                    </div>
                  </div>

                  <div class="mb-4 col-md-6">
                    <label class="form-label">Валюта счета</label>
                    <div class="position-relative">
                      <select class="form-control" v-model="currency_id">
                        <option v-for="currency in currencies" :key="currency.id" :value="currency.id">
                          {{ currency.currency }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>

                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" :checked="showInitial"  @change="hideContent(0)" id="defaultCheck1" />
                  <label class="form-check-label" for="defaultCheck1">Указать начальный остаток счета</label>
                </div>

                <div class="row" v-if="showInitial">
                  <div class="mb-4 col-md-6">
                    <label class="form-label">Начальный остаток</label>
                    <div class="position-relative">
                      <input type="text" class="form-control" placeholder="" v-model="initial_amount">
                    </div>
                  </div>

                  <div class="mb-4 col-md-6">
                    <label>Дата</label>
                    <br />
                    <date-picker v-model="date" :first-day-of-week="1" :lang="ru" confirm :format="dateFormat"></date-picker>
                  </div>
                </div>

                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" @change="hideContent(1)" id="defaultCheck2" />
                  <label class="form-check-label" for="defaultCheck2">К этому счету подключен эквайринг</label>
                </div>

                <div class="row" v-if="showEq">
                  <div class="mb-4 col-md-6">
                    <label class="form-label">Статья комиссии</label>
                    <div class="position-relative">
                      <select class="form-control" v-model="commission_article_id">
                        <option v-for="article in articles" :key="article.id" :value="article.id">
                          {{ article.name }}
                        </option>
                      </select>
                    </div>
                  </div>

                  <div class="mb-4 col-md-6">
                    <label class="form-label">Статья возврата</label>
                    <div class="position-relative">
                      <select class="form-control" v-model="return_clause_id">
                        <option v-for="article in articles" :key="article.id" :value="article.id">
                          {{ article.name }}
                        </option>
                      </select>
                    </div>
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

<!--        Add group -->
          <div class="my-4 text-center">
            <b-modal id="modal-group" title="Добавить группу" title-class="font-18">

              <div class="mb-4 col-md-6">
                <label class="form-label">Название</label>
                <div class="position-relative">
                  <input type="text" class="form-control" placeholder="" v-model="group_name">
                </div>
              </div>

              <button type="button" class="btn btn-primary" @click="_addGroup()">Добавить</button>

            </b-modal>
          </div>
<!--        /Add group -->

<!--        Edit form -->

        <b-modal id="modal-edit" title="Редактировать счет" title-class="font-18">
          <form class="form-horizontal" role="form">
            <div class="d-flex align-items-center justify-content-between mb-4">
              <div class="form-check me-3">
                <input class="form-check-input" type="radio" name="paymentOptionEdit" id="bankAccountEdit" value="0" v-model="editType">
                <label class="form-check-label" for="bankAccountEdit">
                  Название счета
                </label>
              </div>

              <div class="form-check me-3">
                <input class="form-check-input" type="radio" name="paymentOptionEdit" id="cashEdit" value="1" v-model="editType">
                <label class="form-check-label" for="cashEdit">
                  Наличные или касса
                </label>
              </div>

              <div class="form-check">
                <input class="form-check-input" type="radio" name="paymentOptionEdit" id="fundEdit" value="2" v-model="editType">
                <label class="form-check-label" for="fundEdit">
                  Фонд
                </label>
              </div>
            </div>

            <div class="row">
              <div class="mb-4 col-md-6">
                <label class="form-label">Название счета*</label>
                <div class="position-relative">
                  <input type="text" class="form-control" placeholder="Рублевой счет в Сбербанке" v-model="editName">
                </div>
              </div>

              <div class="mb-4 col-md-6">
                <label class="form-label">Группа счетов*</label>
                <button class="btn btn-link" v-b-modal.modal-group type="button">Добавить</button>
                <div class="position-relative">
                  <select class="form-control" v-model="editGroupId">
                    <option v-for="group in groups" :key="group.id" :value="group.id">
                      {{ group.name }}
                    </option>
                    <option value="">Без группы</option>
                  </select>
                </div>
              </div>

              <div class="mb-4 col-md-6">
                <label class="form-label">Юр. лицо*</label>
                <div class="position-relative">
                  <select class="form-control" v-model="editEntityId">
                    <option v-for="entity in entities" :key="entity.id" :value="entity.id">
                      {{ entity.entity_name }}
                    </option>
                  </select>
                </div>
              </div>

              <!-- Отображаем все поля -->
              <div class="mb-4 col-md-6">
                <label class="form-label">Банк</label>
                <div class="position-relative">
                  <input type="text" class="form-control" placeholder="" v-model="editBank">
                </div>
              </div>

              <div class="mb-4 col-md-6">
                <label class="form-label">Бик</label>
                <div class="position-relative">
                  <input type="text" class="form-control" placeholder="" v-model="editBik">
                </div>
              </div>

              <div class="mb-4 col-md-6">
                <label class="form-label">К/С</label>
                <div class="position-relative">
                  <input type="text" class="form-control" placeholder="" v-model="editKs">
                </div>
              </div>

              <div class="mb-4 col-md-6">
                <label class="form-label">Номер счета</label>
                <div class="position-relative">
                  <input type="text" class="form-control" placeholder="" v-model="editNumber">
                </div>
              </div>

              <div class="mb-4 col-md-6">
                <label class="form-label">Валюта счета</label>
                <div class="position-relative">
                  <select class="form-control" v-model="editCurrencyId">
                    <option v-for="currency in currencies" :key="currency.id" :value="currency.id">
                      {{ currency.currency }}
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div class="form-check mb-3">
              <input class="form-check-input" type="checkbox" :checked="editShowInitial" @change="hideEditContent(0)" id="defaultCheck1Edit" />
              <label class="form-check-label" for="defaultCheck1Edit">Указать начальный остаток счета</label>
            </div>

            <div class="row" v-if="editShowInitial">
              <div class="mb-4 col-md-6">
                <label class="form-label">Начальный остаток</label>
                <div class="position-relative">
                  <input type="text" class="form-control" placeholder="" v-model="editInitialAmount">
                </div>
              </div>

              <div class="mb-4 col-md-6">
                <label>Дата</label>
                <br />
                <date-picker v-model="editDate" :first-day-of-week="1" :lang="ru" confirm :format="dateFormat"></date-picker>
              </div>
            </div>

            <div class="form-check mb-3">
              <input class="form-check-input" type="checkbox" :checked="editShowEq" @change="hideEditContent(1)" id="defaultCheck2Edit" />
              <label class="form-check-label" for="defaultCheck2Edit">К этому счету подключен эквайринг</label>
            </div>

            <div class="row" v-if="editShowEq">
              <div class="mb-4 col-md-6">
                <label class="form-label">Статья комиссии</label>
                <div class="position-relative">
                  <select class="form-control" v-model="editCommissionArticleId">
                    <option v-for="article in articles" :key="article.id" :value="article.id">
                      {{ article.name }}
                    </option>
                  </select>
                </div>
              </div>

              <div class="mb-4 col-md-6">
                <label class="form-label">Статья возврата</label>
                <div class="position-relative">
                  <select class="form-control" v-model="editReturnClauseId">
                    <option v-for="article in articles" :key="article.id" :value="article.id">
                      {{ article.name }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
          </form>

          <template #modal-footer>
            <b-button variant="secondary" @click="$bvModal.hide('modal-edit')">Отмена</b-button>
            <b-button variant="primary" @click="updateForm">Сохранить изменения</b-button>
          </template>
        </b-modal>

        <!--        /Edit form -->

        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table mb-0" v-if="tableType == 0">
                <thead>
                <tr>
                  <th><input type="checkbox" @click="toggleAll"></th>
                  <th>#</th>
                  <th>Название</th>
                  <th>Состояние</th>
                  <th>Реквизиты</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="account in accounts" :key="account.id" style="cursor: pointer" :class="{ 'table-active': isSelected(account.id) }">
                  <td><input type="checkbox" :value="account.id" v-model="selectedAccounts"></td>
                  <th scope="row">{{ account.id }}</th>
                  <td @click="editForm(account.id)">{{ account.name }}</td>
                  <td @click="editForm(account.id)">{{ account.status }}</td>
                  <td @click="editForm(account.id)">{{ account.details }}</td>
                </tr>
                </tbody>
              </table>

<!--              /// //// / -->

              <table v-if="tableType == 1">
                <thead>
                <tr>


                </tr>
                </thead>
                <tbody>
                <div v-for="(category, categoryName) in accounts" :key="categoryName">
                  <!-- Выводим название категории -->
                  <h3>{{ categoryName }}</h3>

                  <!-- Таблица с записями под каждой категорией -->
<!--                  <table class="table">-->
<!--                    <tr v-for="account in category" :key="account.id" style="cursor: pointer" :class="{ 'table-active': isSelected(account.id) }">-->
<!--                      <td><input type="checkbox" :value="account.id" v-model="selectedAccounts"></td>-->
<!--                      <th scope="row">{{ account.id }}</th>-->
<!--                      <td @click="editForm(account.id)">{{ account.name }}</td>-->
<!--                      <td @click="editForm(account.id)">{{ account.bank }}</td>-->
<!--                      <td @click="editForm(account.id)">{{ account.currency }}</td>-->
<!--                    </tr>-->
<!--                  </table>-->
                </div>
                </tbody>
              </table>


<!--              2222-->

              <table class="table mb-0" v-if="tableType == 1">
                <thead>
                <tr>
                  <th><input type="checkbox" @click="toggleAll"></th>
                  <th>#</th>
                  <th>Название</th>
                  <th>Состояние</th>
                  <th>Реквизиты</th>
                </tr>
                </thead>
                <tbody>
                <!-- Внешний цикл для категорий -->
                <tr v-for="(accounts, category) in entityAccounts" :key="category">
                  <!-- Отображаем категорию как заголовок -->
                  <td colspan="5" class="font-weight-bold">{{ category }}</td>
                </tr>
                <!-- Вложенный цикл для записей внутри категории -->
                <tr v-for="account in accounts" :key="account.id" style="cursor: pointer" :class="{ 'table-active': isSelected(account.id) }">
                  <td><input type="checkbox" :value="account.id" v-model="selectedAccounts"></td>
                  <th scope="row">{{ account.id }}</th>
                  <td @click="editForm(account.id)">{{ account.name }}</td>
                  <td @click="editForm(account.id)">{{ account.status }}</td>
                  <td @click="editForm(account.id)">{{ account.details }}</td>
                </tr>
                </tbody>
              </table>

<!--              2222-->

<!--              ///////// -->

            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- end row -->
  </Layout>
</template>