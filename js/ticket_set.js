var vm = new Vue({
  el: '#test1',
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
      //日程のクローズアップの月
      closeupMonth: "",
      //urlの第二スラッグを取得
      keySlug: "",
      //apiエントリポイントURLを構築するのに使う
      apiEntryPoint: "",
      //地方情報（apiエンドポイントURLを構築するのに使う）
      slugs: { // slugによりapi情報を取得
        osaka: { // 最終兵器_大阪
          shop_id: 108,
          content_code: "saishuu_os",
          event_start_date: "2019/1/11",
          event_end_date: "2019/3/3",
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

      //axios.get('https://www.0553.jp/scrap/api/event_with_period?shop_id=92&content_code=saishuuhei&event_start_date=' + _this.today + '&event_end_date=2019/2/3')
      //axios.get('https://www.0553.jp/scrap/api/event_with_period?shop_id=108&content_code=gyaku19_os&event_start_date=' + _this.today + '&event_end_date=2019/5/12')
      axios.get(_this.apiEntryPoint)
        .then(function (response) {
          _this.alls = response.data.contents[0];
        })
        .catch(function (error) {
          window.alert(error);
        });
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

    //月取得
    //pickMonth: function (day) {
    //console.log(this.formatDate(new Date(day), 'MM'))
    //this.closeupMonth = this.formatDate(new Date(day), 'MM');
    //},

    //デバイスサイズ計算
    wid: function () {
      // resizeのたびにこいつが発火するので、ここでやりたいことをやる
      this.width = window.innerWidth;
    },

    goNextMouse: function () {
      var _this02 = this
      //console.log("hit");
      var targetNextM = Number(this.closeupMonth) + 1
      targetNextM = (targetNextM > 12) ? 1 : targetNextM;
      targetNextM = ("00" + targetNextM).slice(-2);

      var hairetuIndex = 0
      Object.keys(this.dates).some(function (key) {
        //console.log(hairetuIndex);
        var palMouse = _this02.formatDate(new Date(key), 'MM')
        if (palMouse.indexOf(targetNextM) != -1) {
          //_this02.closeupDay = key
          //_this02.closeupMonth = palMouse
          return true;
          //console.log(key);
        }
        //console.log(targetNextM);
        hairetuIndex++
      })
      var kazoe = Object.keys(this.dates).length;
      //レスポンシブに対応
      var sai = (this.width >= 768) ? 7 : 3;

      //slickGoToが行き過ぎないように
      hairetuIndex = ((kazoe - sai) < hairetuIndex) ? kazoe - sai : hairetuIndex;
      //console.log(kazoe)
      //console.log(hairetuIndex)
      $('.multiple-item').slick('slickGoTo', hairetuIndex);
      this.closeupMonth = targetNextM
    },
    goPrevMouse: function () {
      var _this03 = this
      //console.log("hit");
      var targetPrevM = Number(this.closeupMonth) - 1
      targetPrevM = (targetPrevM === 0) ? 12 : targetPrevM;
      targetPrevM = ("00" + targetPrevM).slice(-2);
      //console.log(targetPrevM)

      var hairetuIndex = 0
      Object.keys(this.dates).some(function (key) {
        //console.log(hairetuIndex);
        var palMouse = _this03.formatDate(new Date(key), 'MM')
        if (palMouse.indexOf(targetPrevM) != -1) {
          //_this03.closeupDay = key
          //_this03.closeupMonth = palMouse
          return true;
          //console.log(key);
        }
        //console.log(targetPrevM);
        hairetuIndex++
      })
      var kazoe = Object.keys(this.dates).length;
      //レスポンシブに対応
      var sai = (this.width >= 768) ? 7 : 3;

      //slickGoToが行き過ぎないように
      hairetuIndex = (kazoe === hairetuIndex) ? 0 : hairetuIndex;
      //console.log(kazoe)
      //console.log(hairetuIndex)
      $('.multiple-item').slick('slickGoTo', hairetuIndex);
      this.closeupMonth = targetPrevM
    }
  },

  computed: {
    //allsの中から日程表だけ
    dates: function () {
      return this.alls.date;
    },
    monthfirsts: function () {
      if (!this.dates) {
        return [];
      }
      var _this07 = this
      var datesArray = Object.keys(this.dates);
      var monthArray = {}

      datesArray.forEach(function (key, i) {
        var targetM = _this07.formatDate(new Date(key), 'MM');
        if (targetM in monthArray === false) {
          monthArray[targetM] = i
        }
      })
      return monthArray
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
    }
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
              slidesToShow: 3,
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