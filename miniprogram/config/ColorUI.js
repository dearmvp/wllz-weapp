//框架核心配置
import ColorUI from '../mp-cu/main'
export const colorUI = new ColorUI({
    config: {
        theme: 'auto',
        main: 'red',
        text: 1,
        footer: false,
        share: false,
        shareTitle: '往来礼账记录您的每笔人情账',
        homePath: '/pages/start/index',
        tabBar: [{
            title: '礼薄',
            icon: 'cicon-home-o',
            curIcon: 'cicon-home',
            url: '/pages/index/index',
            type: 'tab'
        },
        {
            title: '送礼',
            icon: 'cicon-redpacket-o',
            curIcon: 'cicon-redpacket',
            url: '/pages/giftOut/index',
            type: 'tab'
        },
        {
            title: '亲友',
            icon: 'cicon-accounts-o',
            curIcon: 'cicon-accounts',
            url: '/pages/friend/index',
            type: 'tab'
        },
        {
            title: '我的',
            icon: 'cicon-my-o',
            curIcon: 'cicon-my',
            url: '/pages/mine/index',
            type: 'tab'
        }],
    }
})