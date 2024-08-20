#import "GDTActionCordovaPlugin.h"
#import "GDTAction.h"
#import "GDTAction_convenience.h"

@implementation GDTActionCordovaPlugin

- (void)init:(CDVInvokedUrlCommand *_Nonnull)command
{
    NSObject *obj = [command.arguments objectAtIndex:0];
    NSString *userActionSetID = [obj valueForKey:@"userActionSetID"];
    NSString *appSecretKey = [obj valueForKey:@"appSecretKey"];
    if (!userActionSetID) userActionSetID = [[self.commandDelegate settings] objectForKey:@"GDT_USER_ACTION_SET_ID"];
    if (!appSecretKey) appSecretKey = [[self.commandDelegate settings] objectForKey:@"GDT_APP_SECRET_KEY"];

    [GDTAction init:userActionSetID secretKey:appSecretKey];
    [GDTAction start];

    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

/** ios 无此接口 */
- (void)setUserUniqueId:(CDVInvokedUrlCommand *_Nonnull)command
{
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)logAction:(CDVInvokedUrlCommand *_Nonnull)command
{
    NSString *actionName = [[command.arguments objectAtIndex:0] stringValue];
    NSString *actionParam = [command.arguments objectAtIndex:1];
    
    [GDTAction logAction:actionName actionParam:actionParam];

    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)onRegister:(CDVInvokedUrlCommand *_Nonnull)command
{
    NSString *method = [[command.arguments objectAtIndex:0] stringValue];
    BOOL success = [[command.arguments objectAtIndex:1] boolValue];

    [GDTAction reportRegisterActionWithMethod:method isSuccess:success];
    
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)onLogin:(CDVInvokedUrlCommand *_Nonnull)command
{
    NSString *method = [[command.arguments objectAtIndex:0] stringValue];
    BOOL success = [[command.arguments objectAtIndex:1] boolValue];

    [GDTAction reportLoginActionWithMethod:method isSuccess:success];
    
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)onBindAccount:(CDVInvokedUrlCommand *_Nonnull)command
{
    NSString *method = [[command.arguments objectAtIndex:0] stringValue];
    BOOL success = [[command.arguments objectAtIndex:1] boolValue];

    [GDTAction reportBindSocialAccountActionWithType:method isSuccess:success];
    
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)onQuestFinish:(CDVInvokedUrlCommand *_Nonnull)command
{   
    NSString *id = [[command.arguments objectAtIndex:0] stringValue];
    NSString *type = [[command.arguments objectAtIndex:1] stringValue];
    NSString *name = [[command.arguments objectAtIndex:2] stringValue];
    NSUInteger number = [[command.arguments objectAtIndex:3] unsignedIntegerValue];
    NSString *desc = [[command.arguments objectAtIndex:4] stringValue];
    BOOL success = [[command.arguments objectAtIndex:5] boolValue];

    [GDTAction reportFinishQuestActionWithQuestID:id questType:type questName:name questNumer:number description:desc isSuccess:success];
    
    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}
- (void)onCreateRole:(CDVInvokedUrlCommand *_Nonnull)command
{
    NSString *role = [[command.arguments objectAtIndex:0] stringValue];

    [GDTAction reportCreateRoleActionWithRole:role];

    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)onUpdateLevel:(CDVInvokedUrlCommand *_Nonnull)command
{
    NSUInteger level = [[command.arguments objectAtIndex:0] unsignedIntegerValue];

    [GDTAction reportUpgradeLevelActionWithLevel:level];

    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)onShare:(CDVInvokedUrlCommand *_Nonnull)command
{
    NSString *channel = [[command.arguments objectAtIndex:0] stringValue];
    BOOL success = [[command.arguments objectAtIndex:1] boolValue];
    
    [GDTAction reportShareActionWithChannel:channel isSuccess:success];

    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)onRateApp:(CDVInvokedUrlCommand *_Nonnull)command
{
    NSUInteger value = [[command.arguments objectAtIndex:0] unsignedIntegerValue];

    [GDTAction reportRateActionWithRate:value];

    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)onViewContent:(CDVInvokedUrlCommand *_Nonnull)command
{
    NSString *type = [[command.arguments objectAtIndex:0] stringValue];
    NSString *name = [[command.arguments objectAtIndex:1] stringValue];
    NSString *id = [[command.arguments objectAtIndex:2] stringValue];

    [GDTAction reportViewContentActionWithContentType:type contentName:name contentID:id];

    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)onAddToCart:(CDVInvokedUrlCommand *_Nonnull)command
{
    NSString *type = [[command.arguments objectAtIndex:0] stringValue];
    NSString *name = [[command.arguments objectAtIndex:1] stringValue];
    NSString *id = [[command.arguments objectAtIndex:2] stringValue];
    NSUInteger number = [[command.arguments objectAtIndex:3] unsignedIntegerValue];
    BOOL success = [[command.arguments objectAtIndex:4] boolValue];

    [GDTAction reportAddingToCartActionWithContentType:type contentName:name contentID:id contentNumber:number isSuccess:success];

    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)onCheckout:(CDVInvokedUrlCommand *_Nonnull)command
{
    NSString *type = [[command.arguments objectAtIndex:0] stringValue];
    NSString *name = [[command.arguments objectAtIndex:1] stringValue];
    NSString *id = [[command.arguments objectAtIndex:2] stringValue];
    NSUInteger number = [[command.arguments objectAtIndex:3] unsignedIntegerValue];
    BOOL isVirtualCurrency = [[command.arguments objectAtIndex:4] boolValue];
    NSString *virtualCurrencyType = [[command.arguments objectAtIndex:5] stringValue];
    NSString *currency = [[command.arguments objectAtIndex:6] stringValue];
    BOOL success = [[command.arguments objectAtIndex:7] boolValue];

    [GDTAction reportCheckoutActionWithContentType:type contentName:name contentID:id contentNumber:number isVirtualCurrency:isVirtualCurrency virtualCurrencyType:virtualCurrencyType realCurrencyType:currency isSuccess:success];

    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)onPurchase:(CDVInvokedUrlCommand *_Nonnull)command
{
    NSString *type = [[command.arguments objectAtIndex:0] stringValue];
    NSString *name = [[command.arguments objectAtIndex:1] stringValue];
    NSString *id = [[command.arguments objectAtIndex:2] stringValue];
    NSUInteger number = [[command.arguments objectAtIndex:3] unsignedIntegerValue];
    NSString *channel = [[command.arguments objectAtIndex:4] stringValue];
    NSString *currency = [[command.arguments objectAtIndex:5] stringValue];
    NSUInteger value = [[command.arguments objectAtIndex:6] unsignedIntegerValue];
    BOOL success = [[command.arguments objectAtIndex:7] boolValue];
    
    [GDTAction reportPurchaseActionWithContentType:type contentName:name contentID:id contentNumber:number paymentChannel:channel realCurrency:currency currencyAmount:value isSuccess:success];

    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

- (void)onAddPaymentChannel:(CDVInvokedUrlCommand *_Nonnull)command
{
    NSString *channel = [[command.arguments objectAtIndex:0] stringValue];
    BOOL success = [[command.arguments objectAtIndex:1] boolValue];
    
    [GDTAction reportAddPaymentChannelActionWithChannel:channel isSuccess:success];

    CDVPluginResult *result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
    [self.commandDelegate sendPluginResult:result callbackId:command.callbackId];
}

@end