# cordova-plugin-gdt-action

Cordova app 用 广点通转化 SDK

## Part I. 接入前准备

首先，请大致阅读一下 [广点通转化 Android SDK 开发指引](https://datanexus.qq.com/doc/develop/guider/sdk/android/init)，对这个插件做了什么有个印象。

获取密钥的步骤，可以[参考附录](#附录获取密钥)

### 1.1 环境要求
#### Android
- Android 4.0（API level 14）或更高版本
#### 插件附带
- GDTActionSDK.min.1.8.9.aar

#### Ios
- Ios 11.0 或更高版本
#### 插件附带
- GDTActionSDK 2.1.0

### 1.2 混淆配置 `请手动设置，插件未实现自动配置`
如果您开启了混淆，请加入下面的配置。
```
-dontwarn com.qq.gdt.action.**
-keep class com.qq.gdt.action.** {*;}
-keep public class com.tencent.turingfd.sdk.**

-keepclasseswithmembers class * {
    native <methods>;
}
```

### 1.3 权限说明
#### Android
依赖权限如下：
权限名称|使用目的
--|--
INTERNET|允许联网
ACCESS_NETWORK_STATE|检测联网方式，区分设备当前网络是2G、3G、4G还是WiFi
READ_PHONE_STATE|获取设备标识，标识用户
WRITE_EXTERNAL_STORAGE|文件读取权限

插件将在`AndroidManifest.xml`中添加如下配置：
```xml
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.READ_PHONE_STATE" />
<uses-permission android:name="android.permission.WRITE_EXTERNAL_STORAGE" />
```

## Part II. cordova-plugin-gdt-action 使用说明

首先，为了初始化广点通SDK，需要获取 `userActionSetId（数据源ID）` 和 `appSecretKey`，在安装插件时传入。
获取密钥的步骤，可以[参考附录](#附录获取密钥)。

### 2.1 安装插件
- 通过npm安装
``` shell
cordova plugin add cordova-plugin-gdt-action --variable GDT_USER_ACTION_SET_ID=XXX --variable GDT_APP_SECRET_KEY=XXX
```

- 通过git链接安装
``` shell
cordova plugin add https://github.com/tadazly/cordova-plugin-gdt-action.git --variable GDT_USER_ACTION_SET_ID=XXX --variable GDT_APP_SECRET_KEY=XXX
```

- 本地调试
``` shell
cordova plugin add /Your/path/to/cordova-plugin-gdt-action --variable GDT_USER_ACTION_SET_ID=XXX --variable GDT_APP_SECRET_KEY=XXX --link
```

- 移除插件
``` shell
cordova plugin rm cordova-plugin-gdt-action --variable GDT_USER_ACTION_SET_ID=XXX --variable GDT_APP_SECRET_KEY=XXX
```

## 2.2 使用插件
Quick Example:
``` typeScript
async function startApp() {
    if (await GDTAction.init()) {
        // ... 为确保激活、启动行为的准确上报，请务必在App启动后必定执行的地方调用onStartApp
        GDTAction.onStartApp();
        
        // ... 用户登陆成功后
        GDTAction.setUserUniqueId(userId);
        GDTAction.onLogin('qq', true);

        // ... 用户下单后
        GDTAction.onCheckout(...args)
        // ... 用户支付完成后
        GDTAction.onPurchase(...args)
    }
}
```

### 2.2.1 初始化
``` typeScript
GDTAction.init = (param?:initParameters) => Promise<boolean>;
```
- 调用位置：GDTAction.init 初始化方法，请在用户同意隐私协议以后尽早调用。
- 调用顺序：GDTAction.init 初始化方法，必须在 GDTAction.logAction 行为上报方法的调用之前成功调用，否则 GDTAction.logAction 不会上报行为。
- 启动参数可以不传，将使用安装插件时的默认参数。
> 启动参数 initParameters \
    · userActionSetID 行为数据源ID（选填，传入与安装插件时不同的参数时使用）\
    · appSecretKey（选填，传入与安装插件时不同的参数时使用）\
    · channel 渠道（选填，默认 ChannelType.CHANNEL_TENCENT）\
    · channelId 自定义渠道ID（选填，默认 null）\
    · anidEnable ANID采集开关（选填，默认 true）\
    . imei 隐私信息控制开关（选填，默认开启，如要关闭可填写自定义imei字符串，sdk将使用您传入的imei）

``` typeScript
GDTAction.init().then(success => {
    if (success) {
        console.log('初始化成功')
    } else {
        console.warn('初始化失败')
    }
})
```

### 2.2.2 设置软id
设置用户软 ID，可以和数据源进行关联。（可选）
``` typeScript
GDTAction.setUserUniqueId = (uid: string) => void;
```

### 2.2.3 上报启动应用行为
调用下面的代码来上报 START_APP（应用启动）行为。
``` typeScript
GDTAction.onStartApp = (isOldUser?: boolean) => void;
```
也可以使用通用行为上报接口。
``` typeScript
GDTAction.logAction(GDTAction.ActionType.START_APP); // 传入的actionType参数必须是ActionType.START_APP
```

广告主在调用上报 START_APP 行为时，SDK 会自主判断此次行为是否为激活行为。\
若广告主需要自主控制上报激活启动行为时，可以将 isOldUser 设置为 true，SDK会默认此次行为为老客户的应用启动行为。
> 预置行为\
· TICKET（心跳）\
· ENTER_FOREGROUND（APP进入前台）\
· ENTER_BACKGROUND（APP退到后台）\
· PAUSE（暂停页面）\
· RESUME（恢复页面）\
以上 5 种行为无需您手动上报。

### 2.2.4 行为上报
在 App 内发生转化行为时，可以调用预定义上报方法或通用上报方法上报行为数据，传入行为类型名称和行为参数。每个预定义上报方法包含若干个行为参数（优化广告投放所需参数）。\
建议优先使用预定义上报方法，若预定义上报方法无法满足上报需求时，则使用通用上报方法。

#### 预定义上报方法
方法名|参数|建议调用时机
--|--|--
onRegister(method: string, success: boolean)|@param method 注册方式，可以是任意可唯一标识注册方式的值；如注册方式为手机号：method = "Mobile" QQ号注册：method = "QQ"等<br>@param success 是否注册成功|注册完成时
onLogin(method: string, success: boolean)|@param method 同onRegister方法<br>@param success 是否登录成功|登录完成时
onBindAccount(method: string, success: boolean)|@param method 同onRegister方法<br>@param success 是否绑定成功|绑定账号时
onQuestFinish(id: string, type: string, name: string, num: number, desc: string, success: boolean)|@param id 事件标识符<br>@param type 事件类型<br>@param name 事件名称<br>@param number 第几个任务/事件<br>@param desc 事件描述<br>@param success 事件是否完成|完成关键事件（如新手教学）时
onCreateRole(role: string)|@param role 游戏角色名称|创建游戏角色时
onUpdateLevel(level: number)|@param level 升级后的等级|游戏升级时
onShare(channel: string, success: boolean)|@param channel 可用于区分分享渠道的任意字符串，例如分享到微信朋友圈 channel = "WeChatCircle"<br>@param success 是否分享成功|分享时
onRateApp(value: number)|@param value 用户给出的评分值|用户对App评分时
onViewContent(type: string, name: string, id: number)|@param type 内容/商品类型，如"装备"、"皮肤"等<br>@param name 内容/商品名称<br>@param id 内容/商品的标识符|查看内容/商品详情时
onAddToCart(type: string, name: string, id: string, num: number, success: boolean)|@param type 商品类型如“装备”、“皮肤”<br>@param name 商品名称<br>@param id 商品标识符<br>@param number 商品数量<br>@param success 加入购物车是否成功|加入购物车时
onCheckout(type: string, name: string, id: string, num: number, isVirtualCurrency: boolean, virtualCurrencyType: string, currency: string, success: boolean)|@param type 商品类型如"装备"、"皮肤"<br>@param name 商品名称<br>@param id 商品标识符<br>@param number 商品数量<br>@param isVirtualCurrency 是否使用虚拟货币<br>@param virtualCurrencyType 虚拟货币类型，如"钻石"、"金币"等<br>@param currencyType 真实货币类型，ISO 4217代码，如："CNY"<br>@param success 提交购买/下单是否成功|提交购买/下单时
onPurchase(type: string, name: string, id: string, num: number, channel: string, currency: string, value: number, success: boolean)|@param type 商品类型如"装备"、"皮肤"<br>@param name 商品名称<br>@param id 商品标识符<br>@param number 商品数量<br>@param channel 支付渠道名，如支付宝、微信等<br>@param currency 真实货币类型，ISO 4217代码，如："CNY"<br>@param value 本次支付的真实货币的金额，单位分<br>@param success 支付是否成功|用户支付时
onAddPaymentChannel(channel: string, success: boolean)|@param channel 支付渠道名，如支付宝、微信等<br>@param success 添加支付渠道是否成功|添加支付渠道时

#### 通用上报方法
``` typeScript
GDTAction.logAction = (actionType: ActionType | string, actionParam?: any) => void;
```
- 行为类型（ActionType｜string）
    可以在这里查看全量 [行为枚举值](https://datanexus.qq.com/doc/develop/guider/interface/enum) 。

- 行为参数（object）
    + 行为参数是 "Key-Value" 类型；Key 只可以为String类型，只能包含字母、数字和下划线，必须以字母开头，长度不能超过255； Value 可以是 String/Number/Boolean/JSONArray 其中一种，当 Value 为 JSONArray 时，它的元素只能为 String/Number/Boolean 中的一种，且所有元素必须是同一个类型。
    + 广告主在调用上报 START_APP 行为时，SDK 会自主判断此次行为是否为激活行为。若广告主需要自主控制上报激活启动行为时，可以在 ActionParam 中设置 audience_type 的 Key，Value 为1。当带有该标识的启动行为上报时，我们会默认此次行为为老客户的应用启动行为。
    + 广告主在上报时需要做自定义去重时可以在 ActionParam 中设置 outer_action_id 的 Key，value 为任意自定义如订单号的字符串作为自定义去重 id ，系统会根据该id进行去重。
    + 当用户需要指定上报用户次日留存指标时，可以在上报 START_APP 行为时，在 ActionParam 中设置 length_of_stay 的 key ，值为1，系统会指定该次上报为留存数据。

#### 接口类型声明
所有提供的接口都可以在[类型声明文件中查看](./types/index.d.ts)

## 2.3 上报结果确认
SDK会以info级别的日志输出上报的结果，日志的TAG为`gdt_action`。以下为常见的日志输出：

如果数据上报失败，会有`LogAction failed xxxx`的日志输出
如果数据上报成功，会有`LogAction success xxxx`的日志输出

## 附录：获取密钥

如果还没有获取 **userActionSetId** 和 **appSecretKey** ，若app已经上传投放，可以参考如下步骤生成密钥，不需要新建数据源。

1. 在 **投放管理平台** 找到 **转化归因** 入口

    <image src="figures/投放管理平台-转换归因.png" width="700" />

2. 新建应用转化

    <image src="figures/投放管理平台-新建应用转化.png" width="1000" />

3. 选择 **首次数据接入** => **SDK接入**

    <image src="figures/投放管理平台-首次数据接入.png" width="500" />

4. 若不清楚 **应用ID**，可以点击 **暂无应用ID右边的❓** 跳转 **应用管理** 界面查看

    <image src="figures/投放管理平台-跳转应用管理.png" width="600" />

    <image src="figures/应用管理-appid.png" width="600" />

5. 填写 **应用ID** 后，点击右边的 **获取密钥** 即可查看所需参数

    **数据源ID、APP Secret** 和 **应用ID** 是一一对应的，创建好密钥后，后续也可以在 [**数据源接入**](https://datanexus.qq.com/web/datasource) 界面查看。

    <image src="figures/投放管理平台-获取密钥1.png" width="600" />

    <image src="figures/投放管理平台-获取密钥2.png" width="400" />

    <image src="figures/投放管理平台-获取密钥3.png" width="600" />