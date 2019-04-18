<template>
  <div class="container">
    <div class="cart">
      <div class="page-title-normal">
        <h2 class="page-title-h2"><span>我的购物车</span></h2>
      </div>
      <div class="item-list-wrap">
        <div class="cart-item">
          <div class="cart-item-head">
            <ul>
              <li>商品</li>
              <li>价格</li>
              <li>数量</li>
              <li>总价</li>
              <li>操作</li>
            </ul>
          </div>
          <ul class="cart-item-list">
            <li v-for="item in cartList">
              <div class="cart-tab-1">
                <div class="cart-item-check">
                  <a href="javascipt:;" class="checkbox-btn item-check-btn" v-bind:class="{'check':item.checked=='1'}" @click="editCart('checked',item)">
                    <svg class="icon icon-ok">
                      <use xlink:href="#icon-ok"></use>
                    </svg>
                  </a>
                </div>
                <div class="cart-item-pic">
                  <img v-lazy="'/static/'+item.productImage + '.jpg'" v-bind:alt="item.productName">
                </div>
                <div class="cart-item-title">
                  <div class="item-name">{{item.productName}}</div>
                </div>
              </div>
              <div class="cart-tab-2">
                <div class="item-price">{{item.salePrice|currency}}</div>
              </div>
              <div class="cart-tab-3">
                <div class="item-quantity">
                  <div class="select-self select-self-open">
                    <div class="select-self-area">
                      <button class="input-sub" @click="editCart('minu',item)">-</button>
                      <input class="select-ipt" type="number" v-model="item.productNum">
                      <button class="input-add" @click="editCart('add',item)">+</button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="cart-tab-4">
                <div class="item-price-total">{{(item.productNum*item.salePrice)|currency}}</div>
              </div>
              <div class="cart-tab-5">
                <div class="cart-item-opration">
                  <a href="javascript:;" class="item-edit-btn" @click="delCartConfirm(item)">
                    <svg class="icon icon-del">
                      <use xlink:href="#icon-del"></use>
                    </svg>
                  </a>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import axios from 'axios'
    import MHeader from '@/components/m-header'
    import MNav from '@/components/m-nav'
    import MFooter from '@/components/m-footer'
    import Modal from '@/components/Modal'
    export default{
      data() {
        return {
          cartList: [{
            checked: '0',
            productImage: '1',
            productName: '1',
            productNum: 10,
            salePrice: 200
          },{
            checked: '0',
            productImage: '2',
            productName: '2',
            productNum: 10,
            salePrice: 200
          },{
            checked: '0',
            productImage: '3',
            productName: '3',
            productNum: 10,
            salePrice: 200
          }]
        }
      },
      methods: {

      },
      filters: {
        currency(val) {
          return '¥' + val
        }
      },
      components: {
        MHeader,
        MNav,
        MFooter,
        Modal
      }
    }
</script>

<style>
  @import '../assets/css/checkout.css';

  .input-sub, .input-add{
    width: 50px;
    border: 0;
    color: #605F5F;
    text-align: center;
    font-size: 16px;
    background: #f0f0f0;
  }
  .item-quantity .select-self-area{
    background:none;
  }
  .item-quantity .select-self-area .select-ipt{
    padding:0 3px;
    width: 50px;
    min-width: 50px;
    text-align: center;
    height: 100%;
  }
</style>
