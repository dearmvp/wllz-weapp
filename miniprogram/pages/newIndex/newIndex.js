// pages/newIndex/newIndex.js
const giftOutService = require('../../alicloud/services/giftOut')
const giftReceiveService = require('../../alicloud/services/giftReceive')
const bookService = require('../../alicloud/services/book')
const noticeService = require('../../alicloud/services/notice')

const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        currentUser: app.userInfo,
        giftList: [],
        scrollTop: 0,
        swiperList: [],
        list: [{
            icon: 'cicon-skip-next',
            num: '收礼'
        }, {
            icon: 'cicon-skip-previous',
            num: '送礼'
        }],
        isIcon: {
            down: 'text-red text-xxl cicon-close',
            top: 'cicon-eject',
            up: 'text-red text-sl cicon-quill-o'
        },
        navCur: '',
        totalGift: {
            receiveTotal: '',
            outTotal: ''
        },
        pageNo: 0,
        giftBooks: [],
        showBookAction: false,
        bookActions: [{
                name: '编辑',
            },
            {
                name: '删除',
                subname: '该礼簿所有来往记录都将被删除',
            },
        ],
        bookActionDetail: {},
        overlayshow: false,
        uiFixedToolsShow: false,
        active: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.loadNotice()
        if (!app.needRefreshTotal) {
            this.getGiftTotal()
            this.loadDataGive(1)
            this.setData({
                navCur: '送礼',
                active: 0
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
        // 是否需要刷新统计数据
        if (app.needRefreshTotal) {
            let navCur = "送礼"
            let active = 0
            let index_load_flag = wx.getStorageSync("index_load_flag")
            if (index_load_flag != '') {
                navCur = index_load_flag
                active = index_load_flag == '送礼' ? 0 : 1
                wx.removeStorageSync("index_load_flag")
            }

            this.getGiftTotal()

            this.setData({
                navCur: navCur,
                active: active
            })

            if (navCur == "收礼") {
                this.loadDataBook(1)
            } else {
                this.loadDataGive(1)
            }

            app.needRefreshTotal = false
        }
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
        if (this.data.navCur == '送礼') {
            this.loadDataGive(this.data.pageNo + 1)
        }
        if (this.data.navCur == '收礼') {
            this.loadDataBook(this.data.pageNo + 1)
        }


    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    // 监听用户滑动页面事件。
    onPageScroll(e) {
        // 注意：请只在需要的时候才在 page 中定义此方法，不要定义空方法。以减少不必要的事件派发对渲染层-逻辑层通信的影响。
        // 注意：请避免在 onPageScroll 中过于频繁的执行 setData 等引起逻辑层-渲染层通信的操作。尤其是每次传输大量数据，会影响通信耗时。
        // https://developers.weixin.qq.com/miniprogram/dev/reference/api/Page.html#onPageScroll-Object-object
        this.setData({
            scrollTop: e.scrollTop
        })
    },
    async getGiftTotal() {
        const {
            data: rTotal
        } = await giftReceiveService.computedTotalGiftReceive()
        const {
            data: oTotal
        } = await giftOutService.computedTotalGiftOut()
        this.setData({
            totalGift: {
                receiveTotal: rTotal || 0,
                outTotal: oTotal || 0
            }
        })
    },
    tabChange(e) {
        let name = e.detail.data.name;
        this.setData({
            navCur: name
        })

        if (name == '送礼') {
            this.loadDataGive(1)
        }

        if (name == '收礼') {
            this.loadDataBook(1)
        }
    },
    tapToolShow(e) {
        if (e.detail) {
            this.setData({
                overlayshow: true
            });
        } else {
            this.setData({
                overlayshow: false
            });
        }

    },
    tapToolsBar(e) {
        if (e.detail.item.num == '送礼') {
            this.onGiveAdd();

        }
        if (e.detail.item.num == '收礼') {
            this.onReceiveAdd();
        }
    },
    onClickHide() {
        this.setData({
            overlayshow: false,
            uiFixedToolsShow: false
        });
    },
    async loadDataGive(page) {
        if (page == 1) {
            this.setData({
                giftList: []
            })
        }
        const res = await giftOutService.getGiftOutPage({
            page: page,
            limit: 20
        })
        if (res.success) {
            this.setData({
                giftList: this.data.giftList.concat(res.data),
                pageNo: page
            });
        }
    },


    // 添加收礼
    onReceiveAdd() {
        wx.navigateTo({
            url: '/pages/giftReceive/edit/index',
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
                refresh: () => {
                    this.loadData(1)
                },
            }
        });
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
            // events: {
            //     refresh: () => {
            //         this.loadData(1)
            //     },
            // },
            success: function (res) {
                // 通过 eventChannel 向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    book: e.currentTarget.dataset.book
                })
            }
        });
    },
    // 长按礼簿
    onBookLongPress(e) {
        this.setData({
            showBookAction: true,
            bookActionDetail: e.currentTarget.dataset.book
        });
    },
    // 长按礼簿-关闭
    onCloseBookAction() {
        this.setData({
            showBookAction: false
        });
    },
    // 长按礼簿-动作
    onSelectBookAction(event) {
        const that = this
        switch (event.detail.name) {
            case '删除':
                wx.showModal({
                    title: '删除礼簿？',
                    content: '该礼簿所有来往记录都将被删除，确定删除？',
                    async success(result) {
                        if (result.confirm) {
                            const res = await bookService.deleteBook({
                                _id: that.data.bookActionDetail._id
                            })
                            if (res.success) {
                                that.loadData(1)
                                wx.showToast({
                                    title: '删除成功',
                                })
                            }
                        }
                    }
                })
                break;
            case '编辑':
                wx.navigateTo({
                    url: `/pages/book/edit/index`,
                    success: function (res) {
                        // 通过 eventChannel 向被打开页面传送数据
                        res.eventChannel.emit('acceptDataFromOpenerPage', that.data.bookActionDetail)
                    },
                    events: {
                        refresh: () => {
                            this.loadData(1)
                        },
                    }
                });
                break;
            default:
                break;
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

    //跳转送礼详情
    onGiftClick(e) {
        wx.navigateTo({
            url: '/pages/giftOut/edit/index',
            // events: {
            //     refresh: () => {
            //         this.loadData(1)
            //     },
            // },
            success: function (res) {
                // 通过 eventChannel 向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    ...e.currentTarget.dataset.gift,
                    friendName: e.currentTarget.dataset.gift.friendInfo.name,
                })
            }
        });
    },

    //添加送礼
    onGiveAdd() {
        wx.navigateTo({
            url: '/pages/giftOut/edit/index',
            events: {
                refresh: () => {
                    this.loadData(1)
                },
            }
        });
    },

    // 公告信息
    async loadNotice() {
        const res = await noticeService.getNotice()
        console.log(res.data);
        if (res.success) {
            this.setData({
                swiperList: res.data
            });
        }
    },

    swiperTap(e) {
        wx.navigateTo({
            url: '/pages/contact/contact',
            success: function (res) {
                // 通过 eventChannel 向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    url: e.detail.url
                })
            }
        });
    },
})