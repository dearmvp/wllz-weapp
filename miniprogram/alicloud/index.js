import MPServerless from '@alicloud/mpserverless-sdk'

// liji_dev 开发环境
export const mpserverless = new MPServerless(wx, {
  appId: 'wx58d47707b1a499b6',
  spaceId: 'mp-e675fa18-24ba-41e9-9543-bdff2eaacf7d',
  clientSecret: '1linfqEZL0U+DfY7DjJeiA==',
  endpoint: 'https://api.next.bspapp.com'
});