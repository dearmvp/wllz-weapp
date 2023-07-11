// pages/share/share.js
const app = getApp()
const userService = require('../../alicloud/services/user')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    swiperList: [
      {
          img: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big84000.jpg',
          url: '/pages/document/system/system',
          type: 'navigateTo' //直接跳转类型
      },
      {
          img: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big37006.jpg',
          url: '/pages/custom/home',
          type: 'switchTab' //直接跳转类型
      },
      {
          img: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big39000.jpg',
          type: 'eve' //事件方式
      },
      {
          img: 'https://ossweb-img.qq.com/images/lol/web201310/skin/big10001.jpg',
          type: 'eve'
      },
  ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    //获取分享人信息
    if (options.shareUserId) {
      userService.updateUserScore({
        shareUserId: options.shareUserId
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})