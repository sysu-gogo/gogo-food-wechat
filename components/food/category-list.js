// components/food/category-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    category: {
      type: Array,
      value: []
    },
    active_category: {
      type: Number,
      value: -1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 滚动到指定的分类
     */
    scrollToCategory: function(e) {
      const cid = e.currentTarget.dataset.categoryId;
      this.triggerEvent('scrollFoodListToCategory', {
        category_id: cid
      }, {})
    }
  }
})