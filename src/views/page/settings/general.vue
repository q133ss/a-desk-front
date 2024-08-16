<script>
/* eslint-disable */
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import { getMe, getCurrency, getTimezones , updateGeneralSettings} from "@/services";

/**
 * Form-element component
 */
export default {
  page: {
    title: "Общие настройки",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Общие настройки",
      items: [
        {
          text: "Главная",
          href: "/"
        },
        {
          text: "Общие настройки",
          active: true
        }
      ],
      status: "not_accepted",
      checkCustom: "not_accepted",
      checked: true,
      userData: null,
      companyName: null,
      subdomain: null,
      currencies: null,
      selectedCurrency: "",
      timezones: null,
      selectedTimezone: "",
      dateFormats: [
        'd.m.Y',
        'm.d.Y',
        'd/m/Y',
        'm/d/Y'
      ],
      selectedDateFormat: "",

      timeFormats: [
        'H:i',
        'h:i A'
      ],
      selectedTimeFormat: "",

      showSuccessAlert: false,
      showErrorAlert: false,
      errorMessage: ''
    };
  },
  methods: {
    async save() {
      // Получите значения из ваших переменных
      const company_name = this.companyName;
      const subdomain = this.subdomain;
      const currency_id = parseInt(this.selectedCurrency, 10);
      const timezone_id = parseInt(this.selectedTimezone, 10);
      const date_format = this.selectedDateFormat;
      const time_format = this.selectedTimeFormat;

      try {
        const response = await updateGeneralSettings(company_name, subdomain, currency_id, timezone_id, date_format, time_format);

        this.showSuccessAlert = true;
        this.showErrorAlert = false;

      } catch (error) {
        this.showErrorAlert = true;
        this.errorMessage = error.message || 'Произошла ошибка при обновлении данных.';
        this.showSuccessAlert = false;
      }
    }
  },
  async created() {
    try {
      // Выполняем запрос и сохраняем данные пользователя
      const data = await getMe();
      this.userData = data;

      this.companyName = data.company_name;
      this.subdomain = data.subdomain;

      const currencies = await getCurrency();
      this.currencies = currencies;
      this.selectedCurrency = data.currency_id;

      const timezones = await getTimezones();
      this.timezones = timezones;
      this.selectedTimezone = data.timezone_id;

      this.selectedDateFormat = data.date_format;
      this.selectedTimeFormat = data.time_format;

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
                      label="Название компании"
                      label-for="text"
                  >
                    <b-form-input for="text" v-model="companyName"></b-form-input>
                  </b-form-group>

                  <b-form-group
                      id="example-search"
                      label-cols-sm="2"
                      label-cols-lg="2"
                      label="Поддомен"
                      label-for="search"
                  >
                    <b-form-input
                        id="search"
                        v-model="subdomain"
                        type="search"
                        name="search"
                    ></b-form-input>
                  </b-form-group>

                  <div class="form-group row">
                    <label class="col-md-2 col-form-label">Валюта</label>
                    <div class="col-md-10">
                      <select class="form-control" v-model="selectedCurrency">

                        <option v-for="currency in currencies" :key="currency.id" :value="currency.id">
                          {{ currency.currency.toUpperCase() }}
                        </option>

                      </select>
                    </div>
                  </div>

                  <div class="form-group row">
                    <label class="col-md-2 col-form-label">Часовой пояс</label>
                    <div class="col-md-10">
                      <select class="form-control" v-model="selectedTimezone">

                        <option v-for="timezone in timezones" :key="timezone.id" :value="timezone.id">
                          {{ timezone.name }}
                        </option>

                      </select>
                    </div>
                  </div>

                  <div class="form-group row">
                    <label class="col-md-2 col-form-label">Формат даты</label>
                    <div class="col-md-10">
                      <select class="form-control" v-model="selectedDateFormat">

                        <option v-for="dateFormat in dateFormats" :key="dateFormat" :value="dateFormat">
                          {{ dateFormat }}
                        </option>

                      </select>
                    </div>
                  </div>

                  <div class="form-group row">
                    <label class="col-md-2 col-form-label">Формат времени</label>
                    <div class="col-md-10">
                      <select class="form-control" v-model="selectedTimeFormat">

                        <option v-for="timeFormat in timeFormats" :key="timeFormat" :value="timeFormat">
                          {{ timeFormat }}
                        </option>

                      </select>
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