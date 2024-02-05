// pages/friend/details/index.js
const friendService = require('../../../alicloud/services/friend')
const app = getApp()
Page({
    data: {
        friend: {},
        giftList: [],
        happyCount: 0,
        happyTotal: 0,
        sadCount: 0,
        sadTotal: 0,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.loadData()
    },

    async loadData() {
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', async (data) => {
            this.setData({
                ...data,
            })

            const res = await friendService.getFriendGifts({
                _id: this.data.friend._id
            })

            if (res.success) {
                const {
                    giftOutList,
                    giftReceiveList
                } = res.data

                giftReceiveList.map(i => { // 收礼金额总计
                    this.data.happyTotal += i.money
                })
                giftOutList.map(i => { // 送礼金额总计
                    this.data.sadTotal += i.money
                })
                this.setData({
                    sadCount: giftOutList.length, // 送礼次数
                    sadTotal: this.data.sadTotal,
                    happyCount: giftReceiveList.length, // 收礼次数
                    happyTotal: this.data.happyTotal,
                    giftList: giftOutList.concat(giftReceiveList),
                });
            }
        })
    },
    // 编辑按钮
    onEditClick() {
        wx.navigateTo({
            url: `/pages/friend/edit/index?friendId=${this.data.friend._id}`,
            events: {
                refresh: () => {
                    // TODO 当前页数据不会刷新
                    const eventChannel = this.getOpenerEventChannel()
                    eventChannel.emit('refresh')
                },
            },
        });
    },
    //跳转送礼详情
    onGiftClick(e) {
        let that = this;
        if (e.currentTarget.dataset.gift.title) {
            wx.navigateTo({
                url: '/pages/giftOut/edit/index',
                success: function (res) {
                    wx.setStorageSync("friend_data", that.data.friend)
                    // 通过 eventChannel 向被打开页面传送数据
                    res.eventChannel.emit('acceptDataFromOpenerPage', {
                        ...e.currentTarget.dataset.gift,
                        friendName: that.data.friend.name,
                    })
                }
            });
        } else {
            console.log("收礼");
        }

    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},

    /**
     * 生命周期函数--监听页面显示
     */
    async onShow() {
        let friend_data = wx.getStorageSync("friend_data")
        if (friend_data && app.needRefreshTotal) {
            const res = await friendService.getFriendGifts({
                _id: friend_data._id
            })

            if (res.success) {
                const {
                    giftOutList,
                    giftReceiveList
                } = res.data

                giftReceiveList.map(i => { // 收礼金额总计
                    this.data.happyTotal += i.money
                })
                giftOutList.map(i => { // 送礼金额总计
                    this.data.sadTotal += i.money
                })
                this.setData({
                    friend: {
                        name: res.data.name
                    },
                    sadCount: giftOutList.length, // 送礼次数
                    sadTotal: this.data.sadTotal,
                    happyCount: giftReceiveList.length, // 收礼次数
                    happyTotal: this.data.happyTotal,
                    giftList: giftOutList.concat(giftReceiveList),
                });
            }
            wx.removeStorageSync("friend_data")
        }

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {},

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {},
})