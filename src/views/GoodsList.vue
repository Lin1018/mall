<template>
  <div>
    <m-header></m-header>
    <m-nav>
      <span slot="Goods">Goods</span>
    </m-nav>
    <div class="accessory-result-page accessory-page">
      <div class="container">
        <div class="filter-nav">
          <span class="sortby">价格排序:</span>
          <a href="javascript:void(0)" class="default cur">默认</a>
          <a href="javascript:void(0)" class="price" :class="{'sort-up': !sortFlag}" @click="sortGoods">升/降序<svg class="icon icon-arrow-short"><use xlink:href="#icon-arrow-short"></use></svg></a>
          <a href="javascript:void(0)" class="filterby stopPop" @click="showFilterPop">筛选</a>
        </div>
        <div class="accessory-result">
          <!-- filter -->
          <div class="filter stopPop" id="filter" :class="{'filterby-show': filterBy}">
            <dl class="filter-price">
              <dt>价格:</dt>
              <dd><a href="javascript:void(0)" :class="{'cur':priceChecked=='all'}" @click="setPriceFilter('all')">全部</a></dd>
              <dd v-for="(item, index) in priceFilter">
                <a href="javascript:void(0)" :class="{'cur':priceChecked==index}" @click="setPriceFilter(index)">{{item.startPrice}} - {{item.endPrice}}</a>
              </dd>
            </dl>
          </div>

          <div class="accessory-list-wrap">
            <div class="accessory-list col-4">
              <ul>
                <li v-for="item in goodsList">
                  <div class="pic">
                    <a href="#"><img v-lazy="'/static/' + item.productImage"></a>
                  </div>
                  <div class="main">
                    <div class="name">{{item.productName}}</div>
                    <div class="price">{{item.salePrice}}</div>
                    <div class="btn-area">
                      <a href="javascript:;" class="btn btn--m" @click="addCart(item.productId)">加入购物车</a>
                    </div>
                  </div>
                </li>
              </ul>

              <div class="load-more" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="0">
                <img src="static/loading-svg/loading-spinning-bubbles.svg" alt="加载中..." v-show="loading" width="80" height="80">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="md-overlay" v-show="overLayFlag" @click="closePop"></div>
    <modal :mdShow="mdShow" @close="closeModal">
      <p class="message" slot="message">
        请先登录，再进行该操作！
      </p>
      <div slot="btnGroup">
        <a class="btn btn-m" @click="closeModal">关闭</a>
      </div>
    </modal>
    <modal :mdShow="mdShowCart" @close="closeModal">
      <p slot="message">
        <svg class="icon-status-ok">
          <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#icon-status-ok"></use>
        </svg>
        <span>加入购物车成功!</span>
      </p>
      <div slot="btnGroup">
        <a class="btn btn--m" href="javascript:;" @click="closeModal">继续购物</a>
        <router-link class="btn btn--m btn--red" href="javascript:;" to="/cart">查看购物车</router-link>
      </div>
    </modal>
    <m-footer></m-footer>
  </div>
</template>
<script>
  import MHeader from 'src/components/m-header' 
  import MFooter from 'src/components/m-footer'
  import MNav from 'src/components/m-nav'
  import Modal from 'src/components/Modal'
  import axios from 'axios'
  export default{
    data() {
      return {
        sortFlag: true,
        page: 1,
        pageSize: 8,
        priceChecked: 'all',
        busy: true,
        loading: false,
        filterBy: false,
        overLayFlag: false,
        goodsList: [],
        mdShow: false,
        mdShowCart: false,
        priceFilter: [
          {
            startPrice: '0.00',
            endPrice: '500.00'
          },
          {
            startPrice: '500.00',
            endPrice: '1000.00'
          },
          {
            startPrice: '1000.00',
            endPrice: '2000.00'
          }
        ]
      }
    },
    mounted() {
      this.getGoodsList()
    },
    methods: {
      closeModal() {
        this.mdShow = false
        this.mdShowCart = false
      },
      getGoodsList(flag) { 
        this.loading = true
        axios({
          method: 'get',
          url: '/api/goods/list',
          params: {
            page: this.page,
            pageSize: this.pageSize,
            sort: this.sortFlag ? 1 : -1,
            priceLevel: this.priceChecked
          }
        }).then(res => {
          this.loading = false
          if (res.status == 200) {
            if (flag) {
              this.goodsList = this.goodsList.concat(res.data.result.list)

              if (res.data.result.list.length < 8) {
                this.busy = true
              } else {
                this.busy = false
              }
            } else {
              this.goodsList = res.data.result.list
              this.busy = false
            }
          }
        }).catch(err => {
          console.log(err)
        })
      },
      sortGoods() {
        this.sortFlag = !this.sortFlag
        this.page = 1
        this.getGoodsList()
      },
      setPriceFilter(index) {
        this.priceChecked = index
        this.page = 1
        this.getGoodsList()
      },
      showFilterPop() {
        this.filterBy = true
        this.overLayFlag = true
      },
      closePop() {
        this.filterBy = false
        this.overLayFlag = false
      },
      // 上拉加载
      loadMore() {
        this.busy = true
        setTimeout(() => {
          this.page ++
          this.getGoodsList(true)
        }, 1000)
      },
      addCart(productId) {
        axios.post('/api/goods/addCart', {
          productId: productId
        }).then(res => {
          if (res.data.status == 0) {
            this.mdShowCart = true
          } else {
            this.mdShow = true
          }
        }).catch(err => {
          console.log(err)
        })
      }
    },
    components: {
      MHeader,
      MFooter,
      MNav,
      Modal
    }
  }
</script>

<style>
  @import '../assets/css/base.css';
  @import '../assets/css/product.css';
</style>