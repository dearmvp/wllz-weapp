// pages/giftReceive/edit/index.js
const giftReceiveService = require('../../../alicloud/services/giftReceive')
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        _id: '',
        friendId: '',
        friendName: '',
        bookId: '',
        bookName: '',
        money: '',
        remarks: '',
        isDisabled: false,
    },
    async onSave() {
        if (!this.data.friendName) {
            wx.showToast({
                title: '请填写姓名',
                mask: true,
                icon: 'none',
            })
            return;
        }

        if (!this.data.money) {
            wx.showToast({
                title: '请填写礼金',
                mask: true,
                icon: 'none',
            })
            return;
        }

        this.setData({
            isDisabled: true
        })
        let that = this
        const eventChannel = this.getOpenerEventChannel()
        if (this.data._id) {
            const res = await giftReceiveService.updateGiftReceive(this.data)
            if (res.success) {
                wx.setStorageSync("index_load_flag", "收礼")
                wx.setStorageSync("friend_load_flag", true)
                wx.showToast({
                    title: '修改成功',
                })
                eventChannel.emit('refresh')
                app.needRefreshTotal = true
                setTimeout(() => {
                    wx.navigateBack()
                }, 1000);
            }
        } else {
            const res = await giftReceiveService.addGiftReceive(this.data)
            if (res.success) {
                wx.setStorageSync("index_load_flag", "收礼")
                wx.setStorageSync("friend_load_flag", true)
                wx.showModal({
                    title: '提示',
                    content: '添加成功,是否继续添加？',
                    success(res) {
                        if (res.confirm) {
                            eventChannel.emit('refresh')
                            app.needRefreshTotal = true
                            that.setData({
                                friendId: '',
                                friendName: '',
                                money: '',
                                remarks: '',
                                isDisabled: false,
                            })
                        } else if (res.cancel) {
                            eventChannel.emit('refresh')
                            app.needRefreshTotal = true
                            setTimeout(() => {
                                wx.navigateBack()
                            }, 500);
                        }
                    }
                })

            }
        }
    },
    async onDelete() {
        let delData = this.data
        const eventChannel = this.getOpenerEventChannel()
        wx.showModal({
            title: '删除来往记录？',
            content: '此操作无法恢复，确定删除？',
            async success(res) {
                if (res.confirm) {
                    const result = await giftReceiveService.deleteGiftReceive(delData)
                    if (result.success) {
                        wx.setStorageSync("friend_load_flag", true)
                        wx.showToast({
                            title: '删除成功',
                        })
                        eventChannel.emit('refresh')
                        app.needRefreshTotal = true
                        setTimeout(() => {
                            wx.navigateBack()
                        }, 1000);
                    }
                }
            }
        })
    },
    showFriendSelect() {
        let that = this
        wx.navigateTo({
            url: '/pages/friend/select/index',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                dialogResult: function (data) {
                    that.setData({
                        friendId: data._id,
                        friendName: data.name,
                    })
                },
            }
        });
    },
    showBookSelect() {
        let that = this
        wx.navigateTo({
            url: '/pages/book/select/index',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                dialogResult: function (data) {
                    that.setData({
                        bookId: data._id,
                        bookName: data.title,
                    })
                },
            }
        });
    },
    showCalendar() {
        let that = this
        wx.navigateTo({
            url: `/pages/calendar/index?date=${this.data.date.value}`,
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                handleCalendarDateChange: function (data) {
                    that.setData({
                        date: data
                    })
                },
            }
        });
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.on('acceptDataFromOpenerPage', (data) => {
            this.setData({
                ...data,
            })
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {},

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