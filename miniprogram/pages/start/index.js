// pages/start/index.js
const app = getApp()
const userService = require('../../alicloud/services/user')

Page({
  /**
   * 页面的初始数据
   */
  data: {
    netError: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
		 //获取分享人信息
		 if (options.shareUserId) {
			 userService.updateUserScore({
					shareUserId:options.shareUserId
			})
		 }
	},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {},
  /**
   * 初始化用户数据
   */
  async initUserInfo() {
    const res = await userService.getUserInfo()
    if (res.success) {
      app.userInfo = res.data
    } else {
      console.log(res)
      this.setData({
        netError: true
      })
    }
  },
  /**
   * 初始化用户数据范围
   */
  async initUserDataScope() {
    app.userDataScope = await userService.getUserDataScope()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  async onShow(options) {
    if (!app.userInfo || !app.userDataScope) {
      await this.initUserInfo()
      await this.initUserDataScope()
    }

    setTimeout(() => {
      if (!this.data.netError) {
        wx.switchTab({
          url: '/pages/newIndex/newIndex'
        });
        //app.refreshTotal();
      }
    }, 1500)
  },
  onRetry() {
    this.setData({
        netError: true,
      });
    // 小程序重启
    wx.reLaunch({
      url: "/pages/start/index",
    });
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {},

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {},
})