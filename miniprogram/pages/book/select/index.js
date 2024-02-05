// pages/book/select/index.js
const bookService = require('../../../alicloud/services/book')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageNo: 0,
        giftBooks: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.loadDataBook(1)
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

    },
    // 加载数据
    async loadDataBook(page) {
        if (page == 1) {
            this.setData({
                giftBooks: []
            })
        }
        const that = this
        const res = await bookService.getBookPage({
            page: page,
            limit: 10
        })
        if (res.success) {
            const resList = that.computeTotal(res.data)
            that.setData({
                giftBooks: this.data.giftBooks.concat(resList),
                pageNo: page
            });
        }
    },

    // 计算礼簿收礼金额
    computeTotal(datas) {
        return datas.map(i => {
            i.giftCount = i.giftList.length || 0
            i.giftTotal = 0
            for (let item of i.giftList) {
                i.giftTotal += Number(item.money)
            }
            return i
        })
    },
    // 选中礼薄
    onSelectedBook(e) {
        const eventChannel = this.getOpenerEventChannel()
        eventChannel.emit('dialogResult', e.currentTarget.dataset.book);
        wx.navigateBack()
    },

    // 添加礼簿
    onAddBook() {
        wx.navigateTo({
            url: '/pages/book/edit/index',
            events: {
                refresh: () => {
                    this.loadData(1)
                },
            }
        });
    },
    // 点击礼簿
    onBookClick(e) {
        wx.navigateTo({
            url: '/pages/book/details/index',
            events: {
                refresh: () => {
                    this.loadData(1)
                },
            },
            success: function (res) {
                // 通过 eventChannel 向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    book: e.currentTarget.dataset.book
                })
            }
        });
    },
})