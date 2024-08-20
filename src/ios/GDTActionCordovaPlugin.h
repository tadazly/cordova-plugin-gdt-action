#import <Cordova/CDV.h>

@interface GDTActionCordovaPlugin : CDVPlugin

@property (nonatomic, strong, nullable) NSString *IDFA;

- (void)init:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)setUserUniqueId:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)logAction:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)onRegister:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)onLogin:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)onBindAccount:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)onQuestFinish:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)onCreateRole:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)onUpdateLevel:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)onShare:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)onRateApp:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)onViewContent:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)onAddToCart:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)onCheckout:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)onPurchase:(CDVInvokedUrlCommand *_Nonnull)command;
- (void)onAddPaymentChannel:(CDVInvokedUrlCommand *_Nonnull)command;

@end
