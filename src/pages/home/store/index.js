export default {
  // 启用命名空间, 如果不启用，那么提交的时候，可以随意指定任意子模块中的对象，不利于后期维护。
  // 因为这个对象是哪个子模块中的，会一头雾水。所以，为了后期维护，非常有必要开启命名空间!
  namespaced: true,
  // 数据
  state: {
    showLoading: false, // 是否显示加载动画
    activeKey: 'list', // 标签页显示哪个标签，list && chart
    list: [], // 账单数据列表
    choose_date: '' // 日期选项选中的月份
  },
  // 同步操作, mutations 有一个自带参数 state
  mutations: {
    setShowLoading (state, show) {
      state.showLoading = show
    },
    setActiveKey (state, activeKey) {
      state.activeKey = activeKey
    },
    setChooseDate (state, date) {
      state.choose_date = date
    },
    setList (state, list) {
      state.list = list
    }
  },
  // 异步操作, actions 有一个自带参数 store, 包含了所有的对象，具体可以打印查看。
  actions:{
    /**
     * 初始化获取需要的数据
     * 注意：这里的传值，只能有一个，所以需要包装成一个对象来传值。
     * @param: axios 因为需要异步处理，所以直接把 this.$axios 传进来就行了，不推荐使用原始 js 文件导入的方式来调用。
     * @param: rootStore 全局的 this.$store 用于发送数据到其他的 vuex 对象中。
     * */
    async getInitData (store, { axios, rootStore } ) {
      let [ list, categories ] = await Promise.all([
        // 账单列表
        axios.get('/api/v1/list?_sort=id&_order=desc'),
        // 图标列表
        axios.get('/api/v1/categories')
      ]);
      // 上面已经变成同步操作了，所以这里可以提交数据。
      store.commit('setList', list.data);
      // 全局 store 提交数据到 add 组件中去。
      rootStore.commit('add/setCategories', categories.data);
      // 关闭加载动画。
      store.commit('setShowLoading', false);
    },
    /**
     * 获取最新的账单列表
     * @param: axios
     * */
    async getBillDetail (store, axios) {
      let { data } = await axios.get('/api/v1/list?_sort=id&_order=desc');
      store.commit('setList', data);
      store.commit('setShowLoading', false);
    },
    /**
     * 删除一条记录
     * */
    delBillRecord (store, { axios, id }) {
      axios.delete('/api/v1/list/'+id)
        .then(() => {
          store.dispatch('getBillDetail', axios)
        })
        .catch(err => {
          console.log(err);
          store.commit('setShowLoading', false);
        })
    }
  },
  // 数据加工。getters 有两个自带参数，一个是 state, 一个是自身这个对象。
  getters:{
    // 过滤账目列表数据
    getRecordList (state) {
      // 根据选定的日期过滤出要显示的账单列表
      return state.list.filter(o => o.date.includes(state.choose_date))
    },
    // 根据过滤好的账目列表，计算出收入和支出金额
    // 因为 getter 计算过的值会被缓存起来，所以多次引用，也只会计算一次。直到依赖的值发生改变才会被重新计算。
    getTotalPrice (state, getters) {
      let income = 0;
      let expense = 0;
      getters.getRecordList.forEach(item => {
        if (item.type === 'income') {
          income += item.price
        } else {
          expense += item.price
        }
      });
      return [income, expense]
    },
    // 获取图表数据
    getChartProps (state, getters) {
      const incomeData = getters.getRecordList.filter(o => o.type==='income').map(res => ({name: res.event, value: res.price}));
      const expenseData = getters.getRecordList.filter(o => o.type==='expense').map(res => ({name: res.event, value: res.price}));
      const incomeProps = {
        tip: {
          title: '收入项',
          show: true
        },
        radius: '90%',
        data: incomeData
      };
      const expenseProps = {
        tip: {
          title: '支出项',
          show: true
        },
        radius: '90%',
        data: expenseData
      };
      return [ incomeProps, expenseProps ]
    }
  }
}
