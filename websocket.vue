
<script>
var timer = ''
var start = false
// import API from '@/api/example'
import { mapGetters } from 'vuex'
import { Token } from './token'
import API from '@/api/robot'
import { Message } from 'element-ui'
import { MessageBox } from 'element-ui'
export default {
  components: {
    Token
  },
  data() {
    return {
      menuList: ['常用语', '客户信息'],
      number: 0,
      num: 0,
      index: 0,
      width: 414,
      nowResize: 1740,
      open: true,
      userId: '',
      allMessageContent: [],
      messageContent: [],
      isOnline: true,
      Shield: false,
      blankId: false,
      isOpen: false,
      // 当前用户是否委托机器人接管
      isAuto: false,
      // 是否开启语音
      newsNotice: 0,
      allow: true,
      // 是否在线
      liveStatus: 0,
      userInfo: {
        name: '',
        sex: '',
        age: '',
        mobile: '',
        wechat: '',
        qq: '',
        email: '',
        address: ''
      },
      reply: '',
      // 对话设置
      dialogVisible: false,
      // 创建常用语分组
      dialogVisible2: false,
      dialogVisible3: false,
      dialogVisible4: false,
      dialogVisible5: false,
      dialogVisible6: false,
      dialogVisible7: false,
      drap: false,
      keyword: '',
      // 常用语列表
      usualGroup: [],
      nowGroupIndex: 0,
      nowUsualIndex: 0,
      usualGroupForm: {
        groupName: '',
        projectId: window.projectId
      },
      usualContentForm: {
        context: '',
        projectId: window.projectId
      }
    }
  },
  computed: {
    ...mapGetters([
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  watch: {

  },
  created() {
    this.initWebpack()
  },
  methods: {
    initWebpack() { // 初始化websocket
      const that = this
      var protocol = window.location.protocol
      var domain = window.location.host
      if (domain.indexOf('192.168.1.222') > -1) {
        domain = '192.168.0.25'
      }
      var wsuri = this.$ws + that.token
      if (protocol === 'http:') {
        wsuri = 'ws://' + domain + wsuri
      } else {
        wsuri = 'wss://' + domain + wsuri
      }
      that.websock = new WebSocket(wsuri)// 这里面的that都指向vue
      that.websock.onopen = that.websocketopen
      that.websock.onmessage = that.websocketonmessage
      that.websock.onclose = that.websocketclose
      that.websock.onerror = that.websocketerror
    },
    websocketopen() { // 打开
      console.log('WebSocket连接成功')
      this.isOpen = true
    },
    websocketonmessage(e) { // 数据接收
      this.isOpen = true
      const that = this
      var data = JSON.parse(e.data)
      if (data.messageType === 1) {
        // 历史用户
        if (data.data.length === 0) {
          that.$notify.info({
            title: '提示',
            message: '暂时无人接入',
            offset: 80,
            duration: 1000
          })
        } else {
          // 全部消息和信息
          // 转换时间为时分的格式
          for (const i in data.data) {
            data.data[i].createTime = that.timeChaneg(data.data[i].createTime)
            // 历史用户不记录新消息
            data.data[i]['newMessage'] = 0
            // 切出一个用户展示的ID属性
            data.data[i]['userIdStr'] = data.data[i].userId.substr(0, 9)
          }
          that.allMessageContent = data.data
          // 历史用户默认接入第一条
          // 区分当前是第几个用户/当前的用户ID/历史会话的消息
          that.userId = that.allMessageContent[0].userId
          // 当前用户的信息
          that.userInfo = that.allMessageContent[0]
          that.changeUser(that.userInfo)
          that.index = 1
          // that.isForbiddenIp()
        }
      } else if (data.messageType === 4) {
        const value = data.bean
        if (that.userId === value.userId) {
          that.isOnline = false
        }
        for (const i in that.allMessageContent) {
          if (value.userId === that.allMessageContent[i].userId) {
            // 单独赋值页面不会更新 下线用户添加一条不显示的消息
            that.allMessageContent[i].histories.push({
              talkingTo: '1',
              talkingContent: '该用户已下线',
              cmd: 5,
              out: true
            })
            that.messageContent = that.allMessageContent[i].histories
            const all = that.allMessageContent
            that.allMessageContent = []
            that.allMessageContent = all
          }
        }
      } else if (data.messageType === 5) {
        const value = data
        that.isAuto = value.robotStatus
        console.log(that.isAuto)
      } else {
        const value = data.bean
        console.log(value)
        // 时间转换为时分
        value.createTime = that.timeChaneg(value.createTime)
        var flag = true
        for (const i in that.allMessageContent) {
          if (value.userId === that.allMessageContent[i].userId) { // 是否为已经存在的用户
            flag = false // 已存在
            console.log('老用户')
            if (value.histories && value.histories.length > 0) {
              // 判断是覆盖还是单条
              console.log('覆盖')
              that.allMessageContent[i].createTime = value.createTime // 不能直接覆盖,会丢失历史消息
              that.allMessageContent[i].histories = value.histories
              if (that.userId === value.userId) {
                that.messageContent = that.allMessageContent[i].histories
              }
            } else {
              // 单条
              console.log('单条')
              // 单独赋值页面不会更新
              const num = that.allMessageContent[i]['newMessage'] + 1
              that.allMessageContent[i].createTime = value.createTime // 不能直接覆盖,会丢失历史消息
              that.allMessageContent[i].histories = that.allMessageContent[i].histories.concat(value.message)
              that.allMessageContent[i]['newMessage'] = num
              if (that.userId === value.userId) {
                that.messageContent = that.allMessageContent[i].histories
              }
              // 新消息置顶
              var all = JSON.parse(JSON.stringify(that.allMessageContent))
              var one = all.splice(i, 1) // 返回值为被删除的数据组成的数组
              all.unshift(one[0])
              that.allMessageContent = []
              that.allMessageContent = all
              clearInterval(timer)
              if (that.allow) {
                const audioT = that.$refs.audioT
                audioT.play()
              }
              timer = setInterval(function() {
                if (start) {
                  document.title = '您有新消息：' + value.message[0].talkingContent
                  start = false
                } else {
                  document.title = '【　　　　】'
                  start = true
                }
              }, 1000)
            }
          }
        }
        // 不存在列表
        if (flag) {
          console.log('新用户')
          clearInterval(timer)
          if (that.allow) {
            const audioL = that.$refs.audioL
            audioL.play()
          }
          timer = setInterval(function() {
            if (start) {
              document.title = '有新的用户接入'
              start = false
            } else {
              document.title = '【　　　　】'
              start = true
            }
          }, 1000)
          value['newMessage'] = 1
          value['userIdStr'] = value.userId.substr(0, 9)
          that.allMessageContent.unshift(value)
          if (that.allMessageContent.length === 1) {
            // 如果装入一条信息后长度为1 则说明没有历史接入用户
            that.userId = value.userId
            // 当前用户消息盒子 用来发送给子组件
            that.messageContent = value.histories
            // 当前用户的信息
            that.userInfo = value
            that.index = 1
          }
        }
      }
      // console.log(data)
    },
    websocketclose() { // 关闭
      const that = this
      that.isOpen = false
      console.log('WebSocket关闭')
    },
    websocketerror() { // 失败
      console.log('WebSocket连接失败')
    },
    websockSend(params) {
      this.websock.send(params)
    }
  },
  mounted() {
    // 发起请求示例
    // const params = {
    //   data: '1'
    // }
    // API.example(params).then(function(res) {
    // })
    this.initBefor()
    this.CanvasResize()
    window.onfocus = function() {
      clearInterval(timer)
      document.title = '51LA智能客服'
    }
  },
  destroyed() {
    window.onresize = ''
    if (this.isOpen) {
      this.websock.close()
    }
    window.onfocus = ''
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  ul,li{
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .token-container {
    position: fixed;
    height: calc(100% - 60px);
    background-color: #F2F2F2;
    box-sizing: border-box;
    width: 100%;
    display: flex;
    .token-left{
      min-width: 322px;
      border-right: 1px solid #DBDBDB;
      -webkit-user-select: none;
      user-select: none;
      height: 100%;
      .no-user{
        display: flex;
        flex-direction: column;
        margin-top: 60px;
      }
      .title{
        height: 45px;
        line-height: 45px;
        display: flex;
        justify-content: space-between;
        padding: 0 24px;
        font-size: 16px;
        color: #333;
        box-sizing: border-box;
        border-bottom: 1px solid #DBDBDB;
        position: relative;
        .svg-icon{
          margin-left: 12px;
          cursor: pointer;
          &:hover{
            color: #3A96FF;
          }
        }
        .online{
          // position: absolute;
          font-size: 14px;
          color: #17C821;
          cursor: pointer;
        }
        .outline{
          font-size: 14px;
          color: #FE3F3B;
          cursor: pointer;
        }
        .token-set{
          display: flex;
          cursor: pointer;
          .set-line{
            width: 126px;
            height: 30px;
            line-height: 30px;
            margin: auto;
            padding-left: 10px;
            padding-right: 11px;
            font-size: 14px;
            color: #666;
            background: #fff;
            display: flex;
            justify-content: space-between;
            .svg-icon{
              display: block;
              margin: auto 0;
              width: 0.123rem;
              height: 0.067rem;
            }
          }
        }
      }
      .drap{
        width: 126px;
        background: #fff;
        color: #666;
        position: absolute;
        top: 40px;
        left: 143px;
        font-size: 14px;
        padding-left: 10px;
        letter-spacing: 0;
        padding-bottom: 12px;
        z-index: 1;
        .drap-box{
          .drap-item{
            height: 14px;
            line-height: 1;
            cursor: pointer;
            &:hover{
              color: #3A96FF;
            }
            margin-top: 12px;
          }
        }
      }
      .tokenTo-box{
        height: calc(100% - 45px);
        overflow: auto;
        &::-webkit-scrollbar-track-piece {
          background: #F2F2F2;
        }
        &::-webkit-scrollbar{ 
          width: 0.08rem;
          height: 1.26rem;
          background-color: #FFF; 
        } 
        /*定义滑块 内阴影+圆角*/ 
        &::-webkit-scrollbar-thumb 
        {
          border-radius: 20px;
          background-color: #DBDBDB;
        }
      }
      .tokenTo{
        height: 68px;
        padding: 12px 20px;
        display: flex;
        border-bottom: 1px solid #DBDBDB;
        position: relative;
        &:hover{
          background: #E7E7E7;
        }
        &.checked{
          background: #E7E7E7;
        }
        cursor: pointer;
        .tokenTo-left{
          width: 40px;
          height: 40px;
          background: #fff;
          margin-right: 10px;
          border-radius: 50%;
          display: flex;
          .svg-icon{
            width: 22px;
            height: 22px;
            display: block;
            margin: auto;
          }
        }
        .tip-icon{
          width: 20px;
          height: 20px;
          display: inline-block;
          color: #fff;
          text-align: center;
          line-height: 20px;
          background: #FE3F3B;
          border-radius: 50%;
          position: absolute;
          left: 44px;
          top: 6px;
          &.small{
            width: 16px;
            height: 16px;
            line-height: 16px;
            left: 48px;
            top: 7px;
          }
        }
        .tokenTo-right{
          margin-top: 3px;
          width: 171px;
          .top{
            font-size: 16px;
            color: #333333;
            letter-spacing: 0;
            display: flex;
            margin-bottom: 3px;
          }
          .bottom{
            font-size: 14px;
            color: #999999;
            letter-spacing: 0;
            display: flex;
            justify-content: space-between;
          }
        }
      }
    }
    .token-center{
      background: #fff;
      transition: width 0.2s ease;
    }
    .token-right{
      min-width: 322px;
      border-left: 1px solid #DBDBDB;
      -webkit-user-select: none;
      user-select: none;
      position: relative;
      .menu-list{
        position: absolute;
        left: 50%;
        margin-left: -80px;
        top: 12px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        color: #333;
        width: 160px;
        li{
          margin: auto 0;
          font-size: 16px;
          line-height: 22px;
          height: 31px;
          box-sizing: border-box;
          text-align: center;
          cursor: pointer;
          &:hover{
            color: #3A96FF;
          }
          &.checked{
            color: #3A96FF;
            &::after{
              display: block;
              position: relative;
              margin: 0 auto;
              top: 9px;
              content: '';
              width: calc(100% - 11px);
              height: 2px;
              background: #3A96FF;
            }
          }
        }
      }
      .content-box{
        position: absolute;
        top: 48px;
        width: 100%;
        height: calc(100% - 45px);
      }
      .box{
        padding: 14px 0px 18px 28px;
        border-bottom: 1px solid #DBDBDB;
        &:last-child{
          border-bottom: none;         
        }
      }
      .message-box{
        ul>li{
          display: flex;
          font-size: 14px;
          line-height: 22px;
          color: #666666;
          letter-spacing: 0;
          margin-bottom: 6px;
          &:last-child{
            margin-bottom: 0;
          }
          span:first-child{
            min-width: 76px;
          }
        }
      }
      .user-box{
        .user-box-title{
          display: flex;
          justify-content: space-between;
          height: 30px;
          line-height: 30px;
          margin-bottom: 6px;
        }
        .blank{
          width: 84px;
          height: 30px;
          background: #FFFFFF;
          border: 1px solid #DBDBDB;
          border-radius: 2px;
          text-align: center;
          font-size: 14px;
          cursor: pointer;
        }
        ul>li{
          display: flex;
          font-size: 14px;
          line-height: 22px;
          color: #666666;
          letter-spacing: 0;
          margin-bottom: 6px;
          &:last-child{
            margin-bottom: 0;
          }
          span:first-child{
            width: 76px;
            display: inline-block;
          }
          input{
            background: none;
            outline: none;
            border: none;
            font-size: 14px;
            color: #666666;
            letter-spacing: 0; 
            &:focus{
              border-bottom: 1px solid #666;
            }     
          }
        }
      }
      .usual-box{
        height: 100%;
        .usual-box-title{
          display: flex;
          justify-content: space-between;
          height: 30px;
          line-height: 30px;
          margin-bottom: 6px;
          span{
            font-size: 14px;
            color: #3A96FF;
            letter-spacing: 0;
            cursor: pointer;
          }
        }
        .usual-search{
          input{
            width: 271px;
            height: 30px;
            margin: auto;
            background: #FFFFFF;
            border: 1px solid #E3E6E9;
            border-radius: 2px;
            padding-left: 10px;
            font-size: 14px;
            margin-bottom: 30px;
          }
        }
        .usual-list-box{
          height: calc(100% - 80px);
          overflow: auto;
          padding-right: 30px;
          &::-webkit-scrollbar-track-piece {
            background: #F2F2F2;
          }
          &::-webkit-scrollbar{ 
            width: 0.08rem;
            height: 1.26rem;
            background-color: #FFF; 
          } 
          /*定义滑块 内阴影+圆角*/ 
          &::-webkit-scrollbar-thumb 
          {
            border-radius: 20px;
            background-color: #DBDBDB;
          }
        }
        .usual-list{
          margin-bottom: 30px;
          .usual-list-title{
            display: flex;
            justify-content: space-between;
            color: #666;
            margin-bottom: 22px;
            align-items: center;
            .svg-icon{
              cursor: pointer;
            }
            .usual-list-title-left{
              cursor: pointer;
            }
            .usual-list-title-left,.usual-list-title-right{
              display: flex;
              align-items: center;
            }
            .files{
              width: 24px;
              height: 24px;
              margin-right: 8px;
            }
            .icon-title{
              font-size: 14px;
              color: #666666;
              letter-spacing: 0;
              line-height: 14px;
              font-weight: 700;
              margin-right: 8px;
            }
            .telescopic{
              width: 10px;
            }
          }
          .usual-list-content{
            display: flex;
            justify-content: space-between;
            color: #666;
            margin-bottom: 17px;
            font-size: 14px;
            padding-left: 26px;
          }
          .usual-list-content-right{
            span{
              .svg-icon{
                color: #666666;
                width: 18px;
                height: 18px;
                margin-left: 12px;
                cursor: pointer;
              }
            }
          }
          .usual-list-content-left{
            cursor: pointer;
            display: flex;
            align-items: center;
          }
        }
      }
    }
  }
  .dialog-item{
    padding-left: 23px;
    .item-title{
      line-height: 1;
      margin-bottom: 16px;
    }
  }
</style>
