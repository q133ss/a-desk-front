<script>
/* eslint-disable */
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import appConfig from "@/app.config";
import {getEntities, submitEntityForm, getEntity, editEntityForm} from "@/services";

/**
 * Basic-table component
 */
export default {
  page: {
    title: "Юридические лица",
    meta: [{ name: "description", content: appConfig.description }]
  },
  components: { Layout, PageHeader },
  data() {
    return {
      title: "Юридические лица",
      items: [
        {
          text: "Главная",
          href: "/"
        },
        {
          text: "Юридические лица",
          active: true
        }
      ],
      entities: null,

      entity_name: null,
      full_name: null,
      inn: null,
      kpp: null,
      ogrn: null,
      ur_address: null,
      phone: null,
      with_nds: null,

      //edit vars
      id: null,

      editEntityName: null,
      editFullName: null,
      editInn: null,
      editKpp: null,
      editOgrn: null,
      editUrAddress: null,
      editPhone: null,
      editWithNds: null,
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
        const response = await submitEntityForm(
            this.entity_name,
            this.full_name,
            this.inn,
            this.kpp,
            this.ogrn,
            this.ur_address,
            this.phone,
            this.with_nds,
        );

        // Успешное обновление
        this.showSuccessAlert = true;
        this.successMessage = 'Юридическое лицо добавлено';
        this.showErrorAlert = false;

        this.entities = await getEntities();

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
            this.id,
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
  },
  async created() {
    try {
      // Выполняем запрос и сохраняем данные пользователя
      const entities = await getEntities();
      this.entities = entities;

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
          <b-button v-b-modal.modal-standard variant="primary">Добавить юр.лицо</b-button>
        </div>


        <div class="col-sm-6 col-md-4 col-xl-3">
          <div class="my-4 text-center">
            <b-modal id="modal-standard" title="Пригласить пользователя в систему" title-class="font-18">
              <form class="form-horizontal" role="form">
                <div class="mb-4">
                  <label class="form-label">Название юр. лица</label>
                  <div class="position-relative" id="datepicker4">
                    <input type="text" class="form-control" placeholder="ООО Фирма" v-model="entity_name">
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label">Полное название юр. лица</label>
                  <div class="position-relative">
                    <input type="text" class="form-control" placeholder="Общество с ограниченной ответственностью Фирма" v-model="full_name">
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label class="form-label">ИНН</label>
                      <div class="position-relative">
                        <input type="text" class="form-control" v-model="inn">
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label class="form-label">КПП</label>
                      <div class="position-relative">
                        <input type="text" class="form-control" v-model="kpp">
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label class="form-label">ОГРН</label>
                      <div class="position-relative">
                        <input type="text" class="form-control" v-model="ogrn">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label">Юр. адрес</label>
                  <div class="position-relative">
                    <input type="text" class="form-control" v-model="ur_address">
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label">Телефон</label>
                  <div class="position-relative">
                    <input type="text" class="form-control" v-mask="'+7(###)###-##-##'" v-model="phone">
                  </div>
                </div>

                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" v-model="with_nds" value="true" id="defaultCheck1" />
                  <label class="form-check-label" for="defaultCheck1">Юридическое лицо работает с НДС</label>
                </div>

              </form>

              <p>
                <strong>Юридические лица</strong> позволят вам перенести в систему полную структуру вашего бизнеса. Позднее вы сможете получать данные и отчеты как по всему бизнесу в целом, так и по отдельным юридическим лицам.
                <br><br>
                <strong>Реквизиты используются</strong> при выставлении счетов. Если они заполнены, сервис сможет автоматически подставить их в счет. Иначе придется указывать их вручную.
              </p>

              <template #modal-footer>
                <b-button variant="secondary" @click="$bvModal.hide('modal-standard')">Отмена</b-button>
                <b-button variant="primary" @click="submitForm">Добавить</b-button>
              </template>

            </b-modal>
          </div>
        </div>

<!--        Edit form -->

        <div class="col-sm-6 col-md-4 col-xl-3">
          <div class="my-4 text-center">

            <!-- Модалка для редактирования -->
            <b-modal id="modal-edit" title="Редактировать юридическое лицо" title-class="font-18" :class="{ 'loading-cursor': loading }">
              <form class="form-horizontal" role="form">
                <div class="mb-4">
                  <label class="form-label">Название юр. лица</label>
                  <div class="position-relative" id="datepicker4">
                    <input type="text" class="form-control" placeholder="ООО Фирма" v-model="editEntityName">
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label">Полное название юр. лица</label>
                  <div class="position-relative">
                    <input type="text" class="form-control" placeholder="Общество с ограниченной ответственностью Фирма" v-model="editFullName">
                  </div>
                </div>

                <div class="row">
                  <div class="col-md-4">
                    <div class="form-group">
                      <label class="form-label">ИНН</label>
                      <div class="position-relative">
                        <input type="text" class="form-control" v-model="editInn">
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label class="form-label">КПП</label>
                      <div class="position-relative">
                        <input type="text" class="form-control" v-model="editKpp">
                      </div>
                    </div>
                  </div>
                  <div class="col-md-4">
                    <div class="form-group">
                      <label class="form-label">ОГРН</label>
                      <div class="position-relative">
                        <input type="text" class="form-control" v-model="editOgrn">
                      </div>
                    </div>
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label">Юр. адрес</label>
                  <div class="position-relative">
                    <input type="text" class="form-control" v-model="editUrAddress">
                  </div>
                </div>

                <div class="mb-4">
                  <label class="form-label">Телефон</label>
                  <div class="position-relative">
                    <input type="text" class="form-control" v-mask="'+7(###)###-##-##'" v-model="editPhone">
                  </div>
                </div>

                <div class="form-check mb-3">
                  <input class="form-check-input" type="checkbox" v-model="editWithNds" value="true" id="editCheck1" />
                  <label class="form-check-label" for="editCheck1">Юридическое лицо работает с НДС</label>
                </div>
              </form>

              <p>
                <strong>Юридические лица</strong> позволят вам перенести в систему полную структуру вашего бизнеса...
              </p>

              <template #modal-footer>
                <b-button variant="secondary" @click="$bvModal.hide('modal-edit')">Отмена</b-button>
                <b-button variant="primary" @click="submitEditForm">Сохранить</b-button>
              </template>
            </b-modal>
          </div>
        </div>

<!--        /Edit form -->

        <div class="card">
          <div class="card-body">
            <div class="table-responsive">
              <table class="table mb-0">
                <thead>
                <tr>
                  <th>#</th>
                  <th>Юридическое лицо</th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="entity in entities" :key="entity.id" style="cursor: pointer" @click="openEdit(entity.id)">
                  <th scope="row">{{ entity.id }}</th>
                  <td>{{ entity.entity_name }}</td>
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