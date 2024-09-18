<template>
  <Layout>
    <PageHeader :title="title" :items="items" />

    <div class="business-directions">
      <b-alert v-if="showSuccessAlert" show dismissible variant="success">
        {{ successMessage }}
      </b-alert>

      <b-alert v-if="showErrorAlert" show dismissible variant="danger">
        {{ errorMessage }}
      </b-alert>

      <div class="business-list">
        <draggable
            v-model="businessDirections"
            :move="checkMove"
            @end="onDragEnd"
            group="business"
        >
          <div
              v-for="direction in businessDirections"
              :key="direction.id"
              class="business-item"
          >
            <p>{{ direction.name }}</p>
            <div v-if="direction.children">
              <draggable
                  v-model="direction.children"
                  :move="checkMove"
                  @end="onDragEnd"
                  group="business"
              >
                <div
                    v-for="child in direction.children"
                    :key="child.id"
                    class="business-item child"
                >
                  <p>{{ child.name }}</p>
                </div>
              </draggable>
            </div>
          </div>
        </draggable>
      </div>
    </div>
  </Layout>
</template>

<script>
import Layout from "../../layouts/main";
import PageHeader from "@/components/page-header";
import {
  getBusinessDirections,
  updateBusinessDirectionOrder,
} from "@/services"; // Методы из сервиса
import draggable from 'vuedraggable';

export default {
  components: { Layout, PageHeader, draggable },
  data() {
    return {
      title: "Направления бизнеса",
      items: [
        { text: "Главная", href: "/" },
        { text: "Направления бизнеса", active: true },
      ],
      businessDirections: [], // Здесь будут храниться направления бизнеса
      showSuccessAlert: false,
      successMessage: "",
      showErrorAlert: false,
      errorMessage: "",
    };
  },
  methods: {
    async fetchBusinessDirections() {
      try {
        const response = await getBusinessDirections();
        this.businessDirections = response; // Загружаем иерархию
      } catch (error) {
        console.error("Ошибка при получении данных:", error.message);
      }
    },
    checkMove(evt) {
      // Разрешаем перемещение, если элемент может быть перемещен в целевую группу
      const { relatedContext } = evt;
      const targetGroup = relatedContext.element; // Группа, в которую перемещается элемент

      // Проверяем, разрешено ли перемещение в целевую группу
      return this.isMoveAllowed(targetGroup);
    },
    isMoveAllowed(targetGroup) {
      // Логика проверки, разрешено ли перемещение в указанную группу
      // Например, можно разрешить перемещение, если группа не содержит дочерних элементов
      if (targetGroup) {
        // Проверка, есть ли у группы дочерние элементы
        return !targetGroup.children || targetGroup.children.length === 0;
      }
      return true;
    },
    async onDragEnd(evt) {
      const sortedItems = this.flattenBusinessDirections(this.businessDirections);
      // Проверка на перемещение в новую группу
      const newParentId = evt.to.dataset.parentId || null;

      if (newParentId) {
        const itemToMove = sortedItems.find(item => item.id === evt.item.dataset.id);
        itemToMove.parent_id = newParentId;
        // Обновляем позицию и родителя элемента
        sortedItems.forEach((item, index) => {
          item.position = index;
        });
      }

      try {
        await updateBusinessDirectionOrder(sortedItems);
        this.showSuccessAlert = true;
        this.successMessage = "Сортировка успешно обновлена";
      } catch (error) {
        this.showErrorAlert = true;
        this.errorMessage = "Ошибка при обновлении сортировки";
      }
    },
    flattenBusinessDirections(directions, parentId = null) {
      // Преобразование вложенной структуры в плоскую для отправки на сервер
      let flattened = [];
      directions.forEach((direction, index) => {
        flattened.push({
          id: direction.id,
          parent_id: parentId,
          position: index,
        });
        if (direction.children) {
          flattened = flattened.concat(this.flattenBusinessDirections(direction.children, direction.id));
        }
      });
      return flattened;
    },
  },
  async created() {
    await this.fetchBusinessDirections();
  },
};
</script>

<style scoped>
.business-list {
  width: 100%;
  margin: 0 auto;
}

.business-item {
  padding: 10px;
  margin: 5px 0;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 4px;
  cursor: move;
}

.child {
  margin-left: 20px;
}
</style>
