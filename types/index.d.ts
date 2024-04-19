declare namespace TapSDK {
    /** 行为渠道 */
    enum ChannelType {
        CHANNEL_UNKNOWN = 'CHANNEL_UNKNOWN',
        CHANNEL_NATURAL = 'CHANNEL_NATURAL',
        CHANNEL_TENCENT = 'CHANNEL_TENCENT',
        CHANNEL_BYTEDANCE = 'CHANNEL_BYTEDANCE',
        CHANNEL_KUAISHOU = 'CHANNEL_KUAISHOU',
        CHANNEL_ALIBABA = 'CHANNEL_ALIBABA',
        CHANNEL_BAIDU = 'CHANNEL_BAIDU',
        CHANNEL_OTHERS = 'CHANNEL_OTHERS',
    }

    /** 标准行为类型 */
    enum ActionType {
        START_APP = "START_APP",
        PAGE_VIEW = "PAGE_VIEW",
        REGISTER = "REGISTER",
        VIEW_CONTENT = "VIEW_CONTENT",
        CONSULT = "CONSULT",
        ADD_TO_CART = "ADD_TO_CART",
        PURCHASE = "PURCHASE",
        SEARCH = "SEARCH",
        ADD_TO_WISHLIST = "ADD_TO_WISHLIST",
        INITIATE_CHECKOUT = "INITIATE_CHECKOUT",
        COMPLETE_ORDER = "COMPLETE_ORDER",
        DOWNLOAD_APP = "DOWNLOAD_APP",
        RATE = "RATE",
        RESERVATION = "RESERVATION",
        SHARE = "SHARE",
        APPLY = "APPLY",
        CLAIM_OFFER = "CLAIM_OFFER",
        NAVIGATE = "NAVIGATE",
        PRODUCT_RECOMMEND = "PRODUCT_RECOMMEND",
    }

    /** 初始化参数 */
    type initParameters = {
        /** 行为数据源ID（选填，传入与安装插件时不同的参数时使用） */
        userActionSetID?: string,
        /** secret_key（选填，传入与安装插件时不同的参数时使用） */
        appSecretKey?: string,
        /** 渠道（选填，默认 ChannelType.CHANNEL_TENCENT） */
        channel?: ChannelType,
        /** 自定义渠道ID（选填，默认 null） */
        channelId?: string,
        /** ANID采集开关（选填，默认 true） */
        anidEnable?: boolean,
        /** 隐私信息控制开关（选填，默认开启，如要关闭可填写自定义imei字符串，sdk将使用您传入的imei） */
        imei?: string,
    }

    /**
     * 初始化并启动SDK
     * @param param 自定义初始化参数，不填则全部使用默认值
     * @return 初始化是否成功
     */
    function init(param?:initParameters): Promise<boolean>;

    /**
     * 设置用户软 ID，可以和数据源进行关联。（可选）
     * @param uid 
     */
    function setUserUniqueId(uid: string);

    /**
     * 通用行为上报方法 \
     * 建议优先使用预定义上报方法，若预定义上报方法无法满足上报需求时，则使用通用上报方法。
     * @param actionType 行为类型名， 行为类型，分为两类，一类是在 DataNexus 上定义的标准行为类型，具体见ActionType；另一类是您自己自定义的行为类型，可以传入一个字符串类型的参数，要求：这个字符串只能包含字母、数字和下划线，必须以字母开头，长度不能超过64；系统支持的actionName如 https://datanexus.qq.com/doc/develop/guider/interface/enum
     * @param actionParam 行为参数，行为参数是"Key-Value"类型，Key只可以为String类型，只能包含字母、数字和下划线，必须以字母开头，长度不能超过64，且不得以amsreserved开头（SDK内置参数将以它开头）； Value 可以是 string/number/boolean/object 其中一种，当 Value 为 object 时，它的元素只能为 string/number/boolean 中的一种，且所有元素必须是同一个类型。
     */
    function logAction(actionType: ActionType | string, actionParam?: any);

    /**
     * 应用启动 \
     * 广告主在调用上报 START_APP 行为时，SDK 会自主判断此次行为是否为激活行为。若广告主需要自主控制上报激活启动行为时，可以将 isOldUser 设置为 true，我们会默认此次行为为老客户的应用启动行为。
     * @param isOldUser 是否是老客户，默认false
     */
    function onStartApp(isOldUser?: boolean);

    /**
     * 注册完成时
     * @param method 注册方式，可以是任意可唯一标识注册方式的值；如注册方式为手机号：method = "Mobile" QQ号注册：method = "QQ"等
     * @param success 是否注册成功
     */
    function onRegister(method: string, success: boolean);

    /**
     * 登录完成时
     * @param method 可以是任意可唯一标识注册方式的值；如注册方式为手机号：method = "Mobile" QQ号注册：method = "QQ"等
     * @param success 是否登录成功
     */
    function onLogin(method: string, success: boolean);

    /**
     * 绑定账号时
     * @param method 可以是任意可唯一标识注册方式的值；如注册方式为手机号：method = "Mobile" QQ号注册：method = "QQ"等
     * @param success 是否绑定成功
     */
    function onBindAccount(method: string, success: boolean);

    /**
     * 完成关键事件（如新手教学）时
     * @param id 事件标识符
     * @param type 事件类型
     * @param name 事件名称
     * @param num 第几个任务/事件
     * @param desc 事件描述
     * @param success 事件是否完成
     */
    function onQuestFinish(id: string, type: string, name: string, num: number, desc: string, success: boolean);

    /**
     * 创建游戏角色时
     * @param role 游戏角色名称
     */
    function onCreateRole(role: string);

    /**
     * 游戏升级时
     * @param level 升级后的等级
     */
    function onUpdateLevel(level: number);

    /**
     * 分享时
     * @param channel 可用于区分分享渠道的任意字符串，例如分享到微信朋友圈 channel = "WeChatCircle"
     * @param success 是否分享成功
     */
    function onShare(channel: string, success: boolean);

    /**
     * 用户对App评分时
     * @param value 用户给出的评分值
     */
    function onRateApp(value: number);

    /**
     * 查看内容/商品详情时
     * @param type 内容/商品类型，如"装备"、"皮肤"等
     * @param name 内容/商品名称
     * @param id 内容/商品的标识符
     */
    function onViewContent(type: string, name: string, id: number);

    /**
     * 加入购物车时
     * @param type 商品类型如“装备”、“皮肤”
     * @param name 商品名称
     * @param id 商品标识符
     * @param num 商品数量
     * @param success 加入购物车是否成功
     */
    function onAddToCart(type: string, name: string, id: string, num: number, success: boolean);

    /**
     * 提交购买/下单时
     * @param type 商品类型如"装备"、"皮肤"
     * @param name 商品名称
     * @param id 商品标识符
     * @param num 商品数量
     * @param isVirtualCurrency 是否使用虚拟货币
     * @param virtualCurrencyType 虚拟货币类型，如"钻石"、"金币"等
     * @param currency 真实货币类型，ISO 4217代码，如："CNY"
     * @param success 提交购买/下单是否成功
     */
    function onCheckout(type: string, name: string, id: string, num: number, isVirtualCurrency: boolean, virtualCurrencyType: string, currency: string, success: boolean);

    /**
     * 用户支付时
     * @param type 商品类型如"装备"、"皮肤"
     * @param name 商品名称
     * @param id 商品标识符
     * @param num 商品数量
     * @param channel 支付渠道名，如支付宝、微信等
     * @param currency 真实货币类型，ISO 4217代码，如："CNY"
     * @param value 本次支付的真实货币的金额，单位分
     * @param success 支付是否成功
     */
    function onPurchase(type: string, name: string, id: string, num: number, channel: string, currency: string, value: number, success: boolean);

    /**
     * 添加支付渠道时
     * @param channel 支付渠道名，如支付宝、微信等
     * @param success 添加支付渠道是否成功
     */
    function onAddPaymentChannel(channel: string, success: boolean);
}