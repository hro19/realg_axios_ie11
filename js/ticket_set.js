var slugs = { // slugによりapi情報を取得
  osaka: { // 吉本_大阪
    shop_id: 108,
    content_code: "gyaku19_os",
    event_start_date: "2019/3/8",
    event_end_date: "2019/5/12",
  },
  yokohama: { // 最終兵器_横浜
    shop_id: 101,
    content_code: "saishuuhei",
    event_start_date: "2019/2/1",
    event_end_date: "2019/2/24",
  },
  sapporo: { // 最終兵器_札幌
    shop_id: 97,
    content_code: "saishuuhei",
    event_start_date: "2019/2/2",
    event_end_date: "2019/3/3",
  },
  nagoya: { // 吉本_名古屋
    shop_id: 93,
    content_code: "gyakuten19",
    event_start_date: "2019/3/15",
    event_end_date: "2019/4/21",
  },
  kagawa: { // 吉本_香川
    shop_id: 113,
    content_code: "gyakuten19",
    event_start_date: "2019/5/11",
    event_end_date: "2019/5/12",
  },
}

var vm = new Vue({
  el: '#slick_app',
  data: function () {
    return {
      //デバイスサイズ横幅
      width: window.innerWidth,
      //本日の日付
      today: "",
      //全てのjsonデータを格納
      alls: [],
      //slickを１回だけ発動させるためのフラグ
      isSlicked: false,
      //日程のクローズアップ情報格納
      closeup: {},
      //日程のクローズアップの年月日
      closeupDay: "",
      //slicksliderの現在のアクティブなindex番号
      slickActiveIndex: 0,
      //slicksliderの現在のアクティブな月
      slickActiveMonth: 0,
      //urlの第二スラッグを取得
      keySlug: "",
      //apiエントリポイントURLを構築するのに使う（example.com/ticket/〇〇←このスラッグ）
      apiEntryPoint: "",
      //地方情報（apiエンドポイントURLを構築するのに使う）
      slugs: slugs
    }
  },
  created: function () {
    this.today = this.formatDate(new Date())

    //リサイズに応じてデバイスサイズを測定
    window.addEventListener('resize', this.wid, false)

    //url情報、チケットapiエンドポイントとなるkeyを取得
    this.keySlug = window.location.pathname.split("/")[2];
  },
  methods: {
    //json情報の取得（非同期処理）
    getPosts: function () {
      var _this = this;
      axios.get(_this.apiEntryPoint)
        .then(function (response) {
          _this.alls = response.data.contents[0];
        })
        .catch(function (error) {
          window.alert(error);
        });
    },

    eggActive: function (name) {
      //ture/false のチェックをしたいのでここではreturnを使う
      return this.closeupDay === name;
    },

    //クローズアップされている日程詳細をセット
    closeUpSet: function (date, d_index) {
      this.closeup = date
      this.closeupDay = d_index
      //this.closeupMonth = this.formatDate(new Date(d_index), 'MM');
    },

    //クローズアップされている日付をセット
    closeUpSetFirst: function () {
      this.closeup = Object.values(this.dates)[0]
      this.closeupDay = Object.keys(this.dates)[0]
      //this.closeupMonth = this.formatDate(new Date(Object.keys(this.dates)[0]), 'MM');
    },

    //日にち取得
    // @param  {Date}   date
    // @param  {String} [format]
    // @return {String}
    formatDate: function (date, format) {
      if (!format) format = 'YYYY/MM/DD';
      format = format.replace(/YYYY/g, date.getFullYear());
      format = format.replace(/MM/g, ('0' + (date.getMonth() + 1)).slice(-2));
      format = format.replace(/DD/g, ('0' + date.getDate()).slice(-2));
      return format;
    },

    //デバイスサイズ計算
    wid: function () {
      // resizeのたびにこいつが発火するので、ここでやりたいことをやる
      this.width = window.innerWidth;
    },

    goNextMouse: function () {
      var targetNextM = Number(this.slickActiveMonth) + 1
      targetNextM = (targetNextM > 12) ? 1 : targetNextM;
      //console.log(this.slickActiveMonth)
      //console.log(targetNextM)
      var hairetuIndex = this.monthlists.findIndex(function (x) {
        return (x === targetNextM)
      });
      if (hairetuIndex == -1) { hairetuIndex = this.slickActiveIndex }
      //console.log(hairetuIndex);

      //slickGoToが行き過ぎないように
      //レスポンシブに対応 7 : 4
      if (this.width >= 768) {
        if (hairetuIndex > this.monthlists.length - 7) {
          hairetuIndex = this.monthlists.length - 7
        }
      } else {
        if (hairetuIndex > this.monthlists.length - 4) {
          hairetuIndex = this.monthlists.length - 4
        }
      }
      console.log(hairetuIndex);

      $('.multiple-item').slick('slickGoTo', hairetuIndex);
    },
    goPrevMouse: function () {
      var targetPrevM = Number(this.slickActiveMonth) - 1
      targetPrevM = (targetPrevM > 12) ? 1 : targetPrevM;
      //console.log(this.slickActiveMonth)
      //console.log(targetPrevM)
      var hairetuIndex = this.monthlists.findIndex(function (x) {
        return (x === targetPrevM)
      });
      //console.log(hairetuIndex);

      $('.multiple-item').slick('slickGoTo', hairetuIndex);
    }
  },

  computed: {
    //allsの中から日程表だけ
    dates: function () {
      return this.alls.date;
    },

    monthlists: function () {
      if (!this.dates) {
        return [];
      }
      var _this07 = this
      var indexArray = []

      for (var key in this.dates) {
        var targetM = _this07.formatDate(new Date(key), 'MM');
        indexArray.push(Number(targetM))
      }
      return indexArray
    },
  },
  watch: {
    //ticketAPIのエンドポイント構築
    keySlug: function () {
      var todayDate = new Date(this.today);
      var eventStartDate = new Date(this.slugs[this.keySlug].event_start_date);
      //console.log(todayDate)
      //console.log(eventStartDate)
      var da = (eventStartDate > todayDate) ? this.slugs[this.keySlug].event_start_date : this.today;
      //console.log(da)
      var basicUrl = 'https://www.0553.jp/scrap/api/event_with_period'
      this.apiEntryPoint = basicUrl + '?shop_id=' + this.slugs[this.keySlug].shop_id + '&content_code=' + this.slugs[this.keySlug].content_code + '&event_start_date=' + da + '&event_end_date=' + this.slugs[this.keySlug].event_end_date
    },
    apiEntryPoint: function () {
      this.getPosts();
    },
    slickActiveIndex: function () {
      this.slickActiveMonth = this.monthlists[this.slickActiveIndex]
    },
    monthlists: function () {
      this.slickActiveMonth = this.monthlists[this.slickActiveIndex]
    }
  },

  filters: {
    //曜日
    showDay: function (t) {
      var [y, m, d] = t.split('/');
      var p = y < 45 ? '20' : '19';
      var _y = +p + y;
      var _m = +m - 1;
      var _d = +d;
      return '(' + '日月火水木金土'.charAt(new Date(_y, _m, _d).getDay()) + ')';
    },

    //月/日
    MonthDay: function (t) {
      var [y, m, d] = t.split('/');
      return m + '/' + d;
    },

    //年月日
    yearMonthDay: function (t) {
      var [y, m, d] = t.split('/');
      return y + '年' + m + '月' + d + '日';
    },

    //販売状況
    statusCheck: function (num) {
      var message = (num === 2) ? "× 売り切れ" : "○ 購入可能";
      return message;
    },

  },

  updated: function () {
    this.$nextTick(function () {
      if (!this.isSlicked) {
        //slickスライダー条件設定
        $('.multiple-item').slick({
          speed: 150,
          infinite: false,
          slidesToShow: 7,
          slidesToScroll: 1,
          responsive: [{
            breakpoint: 768,
            settings: {
              slidesToShow: 4,
              slidesToScroll: 1,
            }
          }
          ]
        });
      }
      //slick発動後フラグをtrueにする
      this.isSlicked = true

      //初回のレンダリングの時だけ発動する
      if (Object.keys(this.closeup).length === 0) {
        this.closeUpSetFirst()
      }
    })
  }
})


//slick,vue.jsの組み合わせ　参考サイト
// http://haito.hatenablog.com/entry/2018/02/16/105136

//日付の比較とチェックをする方法
//https://www.sejuku.net/blog/23115


//issue
//次の月ボタン　都市を超す場合は想定をしていない


$('.multiple-item').on('afterChange', function (event, slick, currentSlide) {
  //console.log(slick);
  vm.slickActiveIndex = currentSlide
});