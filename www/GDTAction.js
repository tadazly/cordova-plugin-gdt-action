var exec = require('cordova/exec');

module.exports = {
    ChannelType: {
        CHANNEL_UNKNOWN: 'CHANNEL_UNKNOWN',
        CHANNEL_NATURAL: 'CHANNEL_NATURAL',
        CHANNEL_TENCENT: 'CHANNEL_TENCENT',
        CHANNEL_BYTEDANCE: 'CHANNEL_BYTEDANCE',
        CHANNEL_KUAISHOU: 'CHANNEL_KUAISHOU',
        CHANNEL_ALIBABA: 'CHANNEL_ALIBABA',
        CHANNEL_BAIDU: 'CHANNEL_BAIDU',
        CHANNEL_OTHERS: 'CHANNEL_OTHERS',
    },

    ActionType: {
        START_APP: "START_APP",
        PAGE_VIEW: "PAGE_VIEW",
        REGISTER: "REGISTER",
        VIEW_CONTENT: "VIEW_CONTENT",
        CONSULT: "CONSULT",
        ADD_TO_CART: "ADD_TO_CART",
        PURCHASE: "PURCHASE",
        SEARCH: "SEARCH",
        ADD_TO_WISHLIST: "ADD_TO_WISHLIST",
        INITIATE_CHECKOUT: "INITIATE_CHECKOUT",
        COMPLETE_ORDER: "COMPLETE_ORDER",
        DOWNLOAD_APP: "DOWNLOAD_APP",
        RATE: "RATE",
        RESERVATION: "RESERVATION",
        SHARE: "SHARE",
        APPLY: "APPLY",
        CLAIM_OFFER: "CLAIM_OFFER",
        NAVIGATE: "NAVIGATE",
        PRODUCT_RECOMMEND: "PRODUCT_RECOMMEND",
    },
    
    execAsync(func, param) {
        var args = Array.prototype.slice.call(arguments);
        return new Promise(function(resolve) {
            args.unshift('GDTAction');
            args.unshift(function() {
                resolve(false);
            });
            args.unshift(function() {
                resolve(true);
            });
            exec.apply(this, args);
        });
    },

    init(param) {
        return this.execAsync('init', [param]);
    },

    setUserUniqueId(uid) {
        return this.execAsync('setUserUniqueId', [uid]);
    },

    logAction(actionType, actionParam) {
        return this.execAsync('logAction', [actionType, actionParam]);
    },

    onStartApp(isOldUser) {
        if (isOldUser) {
            return this.logAction(this.ActionType.START_APP, {audience_type: 1});
        } else {
            return this.logAction(this.ActionType.START_APP);
        }
    },

    onRegister(method, success) {
        return this.execAsync('onRegister', [method, success]);
    },
    
    onLogin(method, success) {
        return this.execAsync('onLogin', [method, success]);
    },

    onBindAccount(method, success) {
        return this.execAsync('onBindAccount', [method, success]);
    },

    onQuestFinish(id, type, name, num, desc, success) {
        return this.execAsync('onQuestFinish', [id, type, name, num, desc, success]);
    },

    onCreateRole(role) {
        return this.execAsync('onCreateRole', [role]);
    },

    onUpdateLevel(level) {
        return this.execAsync('onUpdateLevel', [level]);
    },

    onShare(channel, success) {
        return this.execAsync('onShare', [channel, success]);
    },

    onRateApp(value) {
        return this.execAsync('onRateApp', [value]);
    },

    onViewContent(type, name, id) {
        return this.execAsync('onViewContent', [type, name, id]);
    },

    onAddToCart(type, name, id, num, success) {
        return this.execAsync('onAddToCart', [type, name, id, num, success]);
    },

    onCheckout(type, name, id, num, isVirtualCurrency, virtualCurrencyType, currency, success) {
        return this.execAsync('onCheckout', [type, name, id, num, isVirtualCurrency, virtualCurrencyType, currency, success]);
    },

    onPurchase(type, name, id, num, channel, currency, value, success) {
        return this.execAsync('onPurchase', [type, name, id, num, channel, currency, value, success]);
    },

    onAddPaymentChannel(channel, success) {
        return this.execAsync('onAddPaymentChannel', [channel, success]);
    },
}