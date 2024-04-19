package com.tadazly.gdt;

import android.app.Application;
import android.util.Log;

import com.qq.gdt.action.ActionUtils;
import com.qq.gdt.action.ChannelType;
import com.qq.gdt.action.GDTAction;
import com.qq.gdt.action.PrivateController;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaArgs;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONException;
import org.json.JSONObject;

public class GDTActionCordovaPlugin extends CordovaPlugin {
    public final static String LOG_TAG = "plugin.GDTAction";
    private static String GDT_USER_ACTION_SET_ID;
    private static String GDT_APP_SECRET_KEY;

    // 标记是否初始化过Sdk
    private static boolean hasInitSdk = false;

    @Override
    protected void pluginInitialize() {
        super.pluginInitialize();
        GDT_USER_ACTION_SET_ID = webView.getPreferences().getString("GDT_USER_ACTION_SET_ID", "");
        GDT_APP_SECRET_KEY = webView.getPreferences().getString("GDT_APP_SECRET_KEY", "");
        Log.d(LOG_TAG, "GDTAction pluginInitialize");
    }

    @Override
    public boolean execute(String action, CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        Log.d(LOG_TAG, "GDTAction " + action);
        if (action.equals("init")) {
            return this.init(args, callbackContext);
        }

        if (!hasInitSdk) {
            Log.e(LOG_TAG, "GDTAction not Init !");
            callbackContext.error("GDTAction not Init ! Please Call init First !");
            return false;
        }

        if (action.equals("setUserUniqueId")) {
            return this.setUserUniqueId(args, callbackContext);
        } else if (action.equals("logAction")) {
            return this.logAction(args, callbackContext);
        } else if (action.equals("onStartApp")) {
            return this.onStartApp(args, callbackContext);
        } else if (action.equals("onRegister")) {
            return this.onRegister(args, callbackContext);
        } else if (action.equals("onLogin")) {
            return this.onLogin(args, callbackContext);
        } else if (action.equals("onBindAccount")) {
            return this.onBindAccount(args, callbackContext);
        } else if (action.equals("onQuestFinish")) {
            return this.onQuestFinish(args, callbackContext);
        } else if (action.equals("onCreateRole")) {
            return this.onCreateRole(args, callbackContext);
        } else if (action.equals("onUpdateLevel")) {
            return this.onUpdateLevel(args, callbackContext);
        } else if (action.equals("onShare")) {
            return this.onShare(args, callbackContext);
        } else if (action.equals("onRateApp")) {
            return this.onRateApp(args, callbackContext);
        } else if (action.equals("onViewContent")) {
            return this.onViewContent(args, callbackContext);
        } else if (action.equals("onAddToCart")) {
            return this.onAddToCart(args, callbackContext);
        } else if (action.equals("onCheckout")) {
            return this.onCheckout(args, callbackContext);
        } else if (action.equals("onPurchase")) {
            return this.onPurchase(args, callbackContext);
        } else if (action.equals("onAddPaymentChannel")) {
            return this.onAddPaymentChannel(args, callbackContext);
        }
        return false;
    }

    private boolean init(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        if (hasInitSdk) {
            callbackContext.success();
            return true;
        }
        String userActionSetID = GDT_USER_ACTION_SET_ID;
        String appSecretKey = GDT_APP_SECRET_KEY;
        String channelType = "CHANNEL_TENCENT";
        String channelId = null;
        JSONObject initParams = args.getJSONObject(0);
        if (initParams == null) {
            initParams = new JSONObject();
        }
        if (initParams.has("userActionSetID")) {
            userActionSetID = initParams.getString("userActionSetID");
        }
        if (initParams.has("appSecretKey")) {
            appSecretKey = initParams.getString("appSecretKey");
        }
        if (initParams.has("channel")) {
            channelType = initParams.getString("channel");
        }
        if (initParams.has("channelId")) {
            channelId = initParams.getString("channelId");
        }
        ChannelType channel;
        try {
            channel = ChannelType.valueOf(channelType);
            // 使用 type 做一些操作
        } catch (IllegalArgumentException e) {
            Log.e(LOG_TAG, "GDTAction init Error: Wrong channel, switch to ChannelType.CHANNEL_TENCENT !");
            channel = ChannelType.CHANNEL_TENCENT;
        }
        try {
            Application app = cordova.getActivity().getApplication();
            GDTAction.init(app, userActionSetID, appSecretKey, channel, channelId);
            if (initParams.has("anidEnable")) {
                boolean anidEnable = initParams.getBoolean("anidEnable");
                GDTAction.setAnidEnable(anidEnable);
            }
            if (initParams.has("imei")) {
                String imei = initParams.getString("imei");
                GDTAction.setPrivateController(new PrivateController() {
                    @Override
                    public boolean isCanUsePhoneState() {
                        return false;
                    }

                    @Override
                    public String getDevImei() {
                        return imei;
                    }
                });
            }
            GDTAction.start();
            hasInitSdk = true;
            callbackContext.success();
        } catch (Exception e) {
            Log.e(LOG_TAG, e.toString());
            Log.e(LOG_TAG, "GDTAction init Error: Failed to init !");
            callbackContext.error(e.toString());
        }
        return true;
    }

    private boolean setUserUniqueId(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String uid = args.getString(0);
        GDTAction.setUserUniqueId(uid);
        callbackContext.success();
        return true;
    }

    private boolean logAction(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String actionType = args.getString(0);
        JSONObject actionParam = args.getJSONObject(1);
        if (actionType != null && actionType.length() > 0) {
            GDTAction.logAction(actionType, actionParam);
            callbackContext.success();
        } else {
            callbackContext.error("actionType 不能为空");
        }
        return true;
    }

    private boolean onRegister(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String method = args.getString(0);
        boolean success = args.getBoolean(1);
        ActionUtils.onRegister(method, success);
        callbackContext.success();
        return true;
    }

    private boolean onLogin(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String method = args.getString(0);
        boolean success = args.getBoolean(1);
        ActionUtils.onLogin(method, success);
        callbackContext.success();
        return true;
    }

    private boolean onBindAccount(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String method = args.getString(0);
        boolean success = args.getBoolean(1);
        ActionUtils.onBindAccount(method, success);
        callbackContext.success();
        return true;
    }

    private boolean onQuestFinish(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String id = args.getString(0);
        String type = args.getString(1);
        String name = args.getString(2);
        int number = args.getInt(3);
        String desc = args.getString(4);
        boolean success = args.getBoolean(5);
        ActionUtils.onQuestFinish(id, type, name, number, desc, success);
        callbackContext.success();
        return true;
    }

    private boolean onCreateRole(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String role = args.getString(0);
        ActionUtils.onCreateRole(role);
        callbackContext.success();
        return true;
    }

    private boolean onUpdateLevel(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        int level = args.getInt(0);
        ActionUtils.onUpdateLevel(level);
        callbackContext.success();
        return true;
    }

    private boolean onShare(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String channel = args.getString(0);
        boolean success = args.getBoolean(1);
        ActionUtils.onShare(channel, success);
        callbackContext.success();
        return true;
    }

    private boolean onRateApp(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        float value = (float) args.getDouble(0);
        ActionUtils.onRateApp(value);
        callbackContext.success();
        return true;
    }

    private boolean onViewContent(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String type = args.getString(0);
        String name = args.getString(1);
        String id = args.getString(2);
        ActionUtils.onViewContent(type, name, id);
        callbackContext.success();
        return true;
    }

    private boolean onAddToCart(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String type = args.getString(0);
        String name = args.getString(1);
        String id = args.getString(2);
        int number = args.getInt(3);
        boolean success = args.getBoolean(4);
        ActionUtils.onAddToCart(type, name, id, number, success);
        callbackContext.success();
        return true;
    }

    private boolean onCheckout(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String type = args.getString(0);
        String name = args.getString(1);
        String id = args.getString(2);
        int number = args.getInt(3);
        boolean isVirtualCurrency = args.getBoolean(4);
        String virtualCurrencyType = args.getString(5);
        String currency = args.getString(6);
        boolean success = args.getBoolean(7);
        ActionUtils.onCheckout(type, name, id, number, isVirtualCurrency, virtualCurrencyType, currency, success);
        callbackContext.success();
        return true;
    }

    private boolean onPurchase(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String type = args.getString(0);
        String name = args.getString(1);
        String id = args.getString(2);
        int number = args.getInt(3);
        String channel = args.getString(4);
        String currency = args.getString(5);
        int value = args.getInt(6);
        boolean success = args.getBoolean(7);
        ActionUtils.onPurchase(type, name, id, number, channel, currency, value, success);
        callbackContext.success();
        return true;
    }

    private boolean onAddPaymentChannel(CordovaArgs args, CallbackContext callbackContext) throws JSONException {
        String channel = args.getString(0);
        boolean success = args.getBoolean(1);
        ActionUtils.onAddPaymentChannel(channel, success);
        callbackContext.success();
        return true;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
    }
}