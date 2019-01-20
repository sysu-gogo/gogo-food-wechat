// components/food/menu-list.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    type: {
      type: String
    },
    value: {
      type: Object
    },
    current_category: {
      type: Number,
      observer(newVal, oldVal, changedPath) {
        if (this.data.type === 'category') {
          for (var i = 0; i < this.data.value.length; i++) {
            if (this.data.value[i].id === newVal) {
              this.setData({
                top: this.data.value[i].rectTop - this.data.value[0].rectTop
              })
              return;
            }
          }
        }
      }
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    active_category: -1,
    top: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    /**
     * 滚动
     */
    onScroll: function (e) {
      // 现在的位置

      if (this.data.type === 'category') {
        const category = this.data.value;
        const top = e.detail.scrollTop + category[0].rectTop;
        const len = category.length;
        for (var i = 0; i < len - 1; i++) {
          // 找到了正确的分类位置
          // 前提：分类数组已经排好序了
          if (top >= category[i].rectTop && top < category[i + 1].rectTop) {
            // category[i] 就是当前的分类了
            if (this.data.active_category !== category[i].id) {
              // 通知外层的分类列表组件
              this.triggerEvent('categoryLocByScroll', {
                category_id: category[i].id
              }, {
                  bubbles: true
                });

              // 本地登记的 active_category 更新
              this.setData({
                active_category: category[i].id
              });
            }
            return;
          }
        }
      }
    },
    onScrolltoupper() {
      this.triggerEvent('scrolltoupper', {}, {});
    }
  },
  lifetimes: {
    // 初始化菜品列表
    created() {
      const $this = this;
      if ($this.data.type === 'category') {
        // TODO: 菜品排序
      }
    },
    ready() {
      const $this = this;

      if (this.data.type === 'category') {
        // 更新分类的位置
        wx.createSelectorQuery().in(this).selectAll('.category-title').boundingClientRect(function (rects) {
          rects.forEach(function (rect, i) {
            $this.data.value[i].rectTop = rect.top;
          });

          $this.setData({
            active_category: rects[0] ? rects[0].dataset.categoryId : -1,
            value: $this.data.value
          });
        }).exec()
      }
    }
  },
})