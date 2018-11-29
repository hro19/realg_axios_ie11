new Vue({
  el: '#ticket',
  data: function () {
    return {
      alls: [],
      querys: {
        shop_id: 0,
        content_code: 'saishuuhei',
        event_start_date: '2019/01/01',
        event_end_date: '2019/12/31',
      }
    }
  },


  created: function () {
    this.getShopId(location.pathname);
    this.getEventStartDate();
    this.getPosts();
  },


  methods: {

    //pathnameをみて、開催地を判断　rest api用のquery値をセットする
    getShopId: function (pathname) {
      if (pathname.indexOf('tokyo') != -1) {
        this.querys.shop_id = 92,
          this.querys.content_code = 'saishuuhei'
      } else if (pathname.indexOf('osaka') != -1) {
        this.querys.shop_id = 108,
          this.querys.content_code = 'saishuu_os'
      }
    },

    //本日の日付をevent_start_dateにセットする
    getEventStartDate: function () {
      var _today = new Date();
      var _m = ('00' + (_today.getMonth() + 1)).slice(-2);
      var _d = ('00' + _today.getDate()).slice(-2);
      _sd = _today.getFullYear() + '/' + _m + '/' + _d;
      //console.log(_sd);
      this.querys.event_start_date = _sd;
      // this.querys.event_start_date = '2019/01/12';
    },

    //rest apiからjson値を取得（axiosは非同期処理であることに注意）
    getPosts: function () {
      var _this = this;

      axios.get('https://www.0553.jp/scrap/api/event_with_period?shop_id=' + _this.querys.shop_id + '&content_code=' + _this.querys.content_code + '&event_start_date=' + _this.querys.event_start_date + '&event_end_date=' + _this.querys.event_end_date)
        .then(function (response) {
          _this.alls = response.data.contents[0];
        })
        .catch(function (error) {
          window.alert(error);
        });
    },
  },


  computed: {
    //日程表だけ
    dates: function () {
      return this.alls.date;
    }
  }
})