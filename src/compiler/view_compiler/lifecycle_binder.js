'use strict';"use strict";
var o = require('../output/output_ast');
var constants_1 = require('./constants');
var lifecycle_hooks_1 = require('angular2/src/core/metadata/lifecycle_hooks');
var STATE_IS_NEVER_CHECKED = o.THIS_EXPR.prop('cdState').identical(constants_1.ChangeDetectorStateEnum.NeverChecked);
var NOT_THROW_ON_CHANGES = o.not(constants_1.DetectChangesVars.throwOnChange);
function bindDirectiveDetectChangesLifecycleCallbacks(directiveAst, directiveInstance, compileElement) {
    var view = compileElement.view;
    var detectChangesInInputsMethod = view.detectChangesInInputsMethod;
    var lifecycleHooks = directiveAst.directive.lifecycleHooks;
    if (lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.OnChanges) !== -1 && directiveAst.inputs.length > 0) {
        detectChangesInInputsMethod.addStmt(new o.IfStmt(constants_1.DetectChangesVars.changes.notIdentical(o.NULL_EXPR), [directiveInstance.callMethod('ngOnChanges', [constants_1.DetectChangesVars.changes]).toStmt()]));
    }
    if (lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.OnInit) !== -1) {
        detectChangesInInputsMethod.addStmt(new o.IfStmt(STATE_IS_NEVER_CHECKED.and(NOT_THROW_ON_CHANGES), [directiveInstance.callMethod('ngOnInit', []).toStmt()]));
    }
    if (lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.DoCheck) !== -1) {
        detectChangesInInputsMethod.addStmt(new o.IfStmt(NOT_THROW_ON_CHANGES, [directiveInstance.callMethod('ngDoCheck', []).toStmt()]));
    }
}
exports.bindDirectiveDetectChangesLifecycleCallbacks = bindDirectiveDetectChangesLifecycleCallbacks;
function bindDirectiveAfterContentLifecycleCallbacks(directiveMeta, directiveInstance, compileElement) {
    var view = compileElement.view;
    var lifecycleHooks = directiveMeta.lifecycleHooks;
    var afterContentLifecycleCallbacksMethod = view.afterContentLifecycleCallbacksMethod;
    afterContentLifecycleCallbacksMethod.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
    if (lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.AfterContentInit) !== -1) {
        afterContentLifecycleCallbacksMethod.addStmt(new o.IfStmt(STATE_IS_NEVER_CHECKED, [directiveInstance.callMethod('ngAfterContentInit', []).toStmt()]));
    }
    if (lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.AfterContentChecked) !== -1) {
        afterContentLifecycleCallbacksMethod.addStmt(directiveInstance.callMethod('ngAfterContentChecked', []).toStmt());
    }
}
exports.bindDirectiveAfterContentLifecycleCallbacks = bindDirectiveAfterContentLifecycleCallbacks;
function bindDirectiveAfterViewLifecycleCallbacks(directiveMeta, directiveInstance, compileElement) {
    var view = compileElement.view;
    var lifecycleHooks = directiveMeta.lifecycleHooks;
    var afterViewLifecycleCallbacksMethod = view.afterViewLifecycleCallbacksMethod;
    afterViewLifecycleCallbacksMethod.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
    if (lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.AfterViewInit) !== -1) {
        afterViewLifecycleCallbacksMethod.addStmt(new o.IfStmt(STATE_IS_NEVER_CHECKED, [directiveInstance.callMethod('ngAfterViewInit', []).toStmt()]));
    }
    if (lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.AfterViewChecked) !== -1) {
        afterViewLifecycleCallbacksMethod.addStmt(directiveInstance.callMethod('ngAfterViewChecked', []).toStmt());
    }
}
exports.bindDirectiveAfterViewLifecycleCallbacks = bindDirectiveAfterViewLifecycleCallbacks;
function bindDirectiveDestroyLifecycleCallbacks(directiveMeta, directiveInstance, compileElement) {
    var onDestroyMethod = compileElement.view.destroyMethod;
    onDestroyMethod.resetDebugInfo(compileElement.nodeIndex, compileElement.sourceAst);
    if (directiveMeta.lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.OnDestroy) !== -1) {
        onDestroyMethod.addStmt(directiveInstance.callMethod('ngOnDestroy', []).toStmt());
    }
}
exports.bindDirectiveDestroyLifecycleCallbacks = bindDirectiveDestroyLifecycleCallbacks;
function bindPipeDestroyLifecycleCallbacks(pipeMeta, pipeInstance, view) {
    var onDestroyMethod = view.destroyMethod;
    if (pipeMeta.lifecycleHooks.indexOf(lifecycle_hooks_1.LifecycleHooks.OnDestroy) !== -1) {
        onDestroyMethod.addStmt(pipeInstance.callMethod('ngOnDestroy', []).toStmt());
    }
}
exports.bindPipeDestroyLifecycleCallbacks = bindPipeDestroyLifecycleCallbacks;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGlmZWN5Y2xlX2JpbmRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgteGxIbVlwOGMudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci92aWV3X2NvbXBpbGVyL2xpZmVjeWNsZV9iaW5kZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBLElBQVksQ0FBQyxXQUFNLHNCQUFzQixDQUFDLENBQUE7QUFDMUMsMEJBQXlELGFBQWEsQ0FBQyxDQUFBO0FBQ3ZFLGdDQUE2Qiw0Q0FBNEMsQ0FBQyxDQUFBO0FBTzFFLElBQUksc0JBQXNCLEdBQ3RCLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxtQ0FBdUIsQ0FBQyxZQUFZLENBQUMsQ0FBQztBQUNoRixJQUFJLG9CQUFvQixHQUFHLENBQUMsQ0FBQyxHQUFHLENBQUMsNkJBQWlCLENBQUMsYUFBYSxDQUFDLENBQUM7QUFFbEUsc0RBQ0ksWUFBMEIsRUFBRSxpQkFBK0IsRUFBRSxjQUE4QjtJQUM3RixJQUFJLElBQUksR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDO0lBQy9CLElBQUksMkJBQTJCLEdBQUcsSUFBSSxDQUFDLDJCQUEyQixDQUFDO0lBQ25FLElBQUksY0FBYyxHQUFHLFlBQVksQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDO0lBQzNELEVBQUUsQ0FBQyxDQUFDLGNBQWMsQ0FBQyxPQUFPLENBQUMsZ0NBQWMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsSUFBSSxZQUFZLENBQUMsTUFBTSxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQzlGLDJCQUEyQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQzVDLDZCQUFpQixDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxFQUNuRCxDQUFDLGlC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QUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDckUsZUFBZSxDQUFDLE9BQU8sQ0FBQyxZQUFZLENBQUMsVUFBVSxDQUFDLGFBQWEsRUFBRSxFQUFFLENBQUMsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDO0lBQy9FLENBQUM7QUFDSCxDQUFDO0FBTmUseUNBQWlDLG9DQU1oRCxDQUFBIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbyBmcm9tICcuLi9vdXRwdXQvb3V0cHV0X2FzdCc7XG5pbXBvcnQge0RldGVjdENoYW5nZXNWYXJzLCBDaGFuZ2VEZXRlY3RvclN0YXRlRW51bX0gZnJvbSAnLi9jb25zdGFudHMnO1xuaW1wb3J0IHtMaWZlY3ljbGVIb29rc30gZnJvbSAnYW5ndWxhcjIvc3JjL2NvcmUvbWV0YWRhdGEvbGlmZWN5Y2xlX2hvb2tzJztcblxuaW1wb3J0IHtDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsIENvbXBpbGVQaXBlTWV0YWRhdGF9IGZyb20gJy4uL2NvbXBpbGVfbWV0YWRhdGEnO1xuaW1wb3J0IHtEaXJlY3RpdmVBc3R9IGZyb20gJy4uL3RlbXBsYXRlX2FzdCc7XG5pbXBvcnQge0NvbXBpbGVFbGVtZW50fSBmcm9tICcuL2NvbXBpbGVfZWxlbWVudCc7XG5pbXBvcnQge0NvbXBpbGVWaWV3fSBmcm9tICcuL2NvbXBpbGVfdmlldyc7XG5cbnZhciBTVEFURV9JU19ORVZFUl9DSEVDS0VEID1cbiAgICBvLlRISVNfRVhQUi5wcm9wKCdjZFN0YXRlJykuaWRlbnRpY2FsKENoYW5nZURldGVjdG9yU3RhdGVFbnVtLk5ldmVyQ2hlY2tlZCk7XG52YXIgTk9UX1RIUk9XX09OX0NIQU5HRVMgPSBvLm5vdChEZXRlY3RDaGFuZ2VzVmFycy50aHJvd09uQ2hhbmdlKTtcblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmREaXJlY3RpdmVEZXRlY3RDaGFuZ2VzTGlmZWN5Y2xlQ2FsbGJhY2tzKFxuICAgIGRpcmVjdGl2ZUFzdDogRGlyZWN0aXZlQXN0LCBkaXJlY3RpdmVJbnN0YW5jZTogby5FeHByZXNzaW9uLCBjb21waWxlRWxlbWVudDogQ29tcGlsZUVsZW1lbnQpIHtcbiAgdmFyIHZpZXcgPSBjb21waWxlRWxlbWVudC52aWV3O1xuICB2YXIgZGV0ZWN0Q2hhbmdlc0luSW5wdXRzTWV0aG9kID0gdmlldy5kZXRlY3RDaGFuZ2VzSW5JbnB1dHNNZXRob2Q7XG4gIHZhciBsaWZlY3ljbGVIb29rcyA9IGRpcmVjdGl2ZUFzdC5kaXJlY3RpdmUubGlmZWN5Y2xlSG9va3M7XG4gIGlmIChsaWZlY3ljbGVIb29rcy5pbmRleE9mKExpZmVjeWNsZUhvb2tzLk9uQ2hhbmdlcykgIT09IC0xICYmIGRpcmVjdGl2ZUFzdC5pbnB1dHMubGVuZ3RoID4gMCkge1xuICAgIGRldGVjdENoYW5nZXNJbklucHV0c01ldGhvZC5hZGRTdG10KG5ldyBvLklmU3RtdChcbiAgICAgICAgRGV0ZWN0Q2hhbmdlc1ZhcnMuY2hhbmdlcy5ub3RJZGVudGljYWwoby5OVUxMX0VYUFIpLFxuICAgICAgICBbZGlyZWN0aXZlSW5zdGFuY2UuY2FsbE1ldGhvZCgnbmdPbkNoYW5nZXMnLCBbRGV0ZWN0Q2hhbmdlc1ZhcnMuY2hhbmdlc10pLnRvU3RtdCgpXSkpO1xuICB9XG4gIGlmIChsaWZlY3ljbGVIb29rcy5pbmRleE9mKExpZmVjeWNsZUhvb2tzLk9uSW5pdCkgIT09IC0xKSB7XG4gICAgZGV0ZWN0Q2hhbmdlc0luSW5wdXRzTWV0aG9kLmFkZFN0bXQoXG4gICAgICAgIG5ldyBvLklmU3RtdChTVEFURV9JU19ORVZFUl9DSEVDS0VELmFuZChOT1RfVEhST1dfT05fQ0hBTkdFUyksXG4gICAgICAgICAgICAgICAgICAgICBbZGlyZWN0aXZlSW5zdGFuY2UuY2FsbE1ldGhvZCgnbmdPbkluaXQnLCBbXSkudG9TdG10KCldKSk7XG4gIH1cbiAgaWYgKGxpZmVjeWNsZUhvb2tzLmluZGV4T2YoTGlmZWN5Y2xlSG9va3MuRG9DaGVjaykgIT09IC0xKSB7XG4gICAgZGV0ZWN0Q2hhbmdlc0luSW5wdXRzTWV0aG9kLmFkZFN0bXQobmV3IG8uSWZTdG10KFxuICAgICAgICBOT1RfVEhST1dfT05fQ0hBTkdFUywgW2RpcmVjdGl2ZUluc3RhbmNlLmNhbGxNZXRob2QoJ25nRG9DaGVjaycsIFtdKS50b1N0bXQoKV0pKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gYmluZERpcmVjdGl2ZUFmdGVyQ29udGVudExpZmVjeWNsZUNhbGxiYWNrcyhkaXJlY3RpdmVNZXRhOiBDb21waWxlRGlyZWN0aXZlTWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmVJbnN0YW5jZTogby5FeHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsZUVsZW1lbnQ6IENvbXBpbGVFbGVtZW50KSB7XG4gIHZhciB2aWV3ID0gY29tcGlsZUVsZW1lbnQudmlldztcbiAgdmFyIGxpZmVjeWNsZUhvb2tzID0gZGlyZWN0aXZlTWV0YS5saWZlY3ljbGVIb29rcztcbiAgdmFyIGFmdGVyQ29udGVudExpZmVjeWNsZUNhbGxiYWNrc01ldGhvZCA9IHZpZXcuYWZ0ZXJDb250ZW50TGlmZWN5Y2xlQ2FsbGJhY2tzTWV0aG9kO1xuICBhZnRlckNvbnRlbnRMaWZlY3ljbGVDYWxsYmFja3NNZXRob2QucmVzZXREZWJ1Z0luZm8oY29tcGlsZUVsZW1lbnQubm9kZUluZGV4LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgY29tcGlsZUVsZW1lbnQuc291cmNlQXN0KTtcbiAgaWYgKGxpZmVjeWNsZUhvb2tzLmluZGV4T2YoTGlmZWN5Y2xlSG9va3MuQWZ0ZXJDb250ZW50SW5pdCkgIT09IC0xKSB7XG4gICAgYWZ0ZXJDb250ZW50TGlmZWN5Y2xlQ2FsbGJhY2tzTWV0aG9kLmFkZFN0bXQobmV3IG8uSWZTdG10KFxuICAgICAgICBTVEFURV9JU19ORVZFUl9DSEVDS0VELCBbZGlyZWN0aXZlSW5zdGFuY2UuY2FsbE1ldGhvZCgnbmdBZnRlckNvbnRlbnRJbml0JywgW10pLnRvU3RtdCgpXSkpO1xuICB9XG4gIGlmIChsaWZlY3ljbGVIb29rcy5pbmRleE9mKExpZmVjeWNsZUhvb2tzLkFmdGVyQ29udGVudENoZWNrZWQpICE9PSAtMSkge1xuICAgIGFmdGVyQ29udGVudExpZmVjeWNsZUNhbGxiYWNrc01ldGhvZC5hZGRTdG10KFxuICAgICAgICBkaXJlY3RpdmVJbnN0YW5jZS5jYWxsTWV0aG9kKCduZ0FmdGVyQ29udGVudENoZWNrZWQnLCBbXSkudG9TdG10KCkpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kRGlyZWN0aXZlQWZ0ZXJWaWV3TGlmZWN5Y2xlQ2FsbGJhY2tzKGRpcmVjdGl2ZU1ldGE6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRpcmVjdGl2ZUluc3RhbmNlOiBvLkV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlRWxlbWVudDogQ29tcGlsZUVsZW1lbnQpIHtcbiAgdmFyIHZpZXcgPSBjb21waWxlRWxlbWVudC52aWV3O1xuICB2YXIgbGlmZWN5Y2xlSG9va3MgPSBkaXJlY3RpdmVNZXRhLmxpZmVjeWNsZUhvb2tzO1xuICB2YXIgYWZ0ZXJWaWV3TGlmZWN5Y2xlQ2FsbGJhY2tzTWV0aG9kID0gdmlldy5hZnRlclZpZXdMaWZlY3ljbGVDYWxsYmFja3NNZXRob2Q7XG4gIGFmdGVyVmlld0xpZmVjeWNsZUNhbGxiYWNrc01ldGhvZC5yZXNldERlYnVnSW5mbyhjb21waWxlRWxlbWVudC5ub2RlSW5kZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb21waWxlRWxlbWVudC5zb3VyY2VBc3QpO1xuICBpZiAobGlmZWN5Y2xlSG9va3MuaW5kZXhPZihMaWZlY3ljbGVIb29rcy5BZnRlclZpZXdJbml0KSAhPT0gLTEpIHtcbiAgICBhZnRlclZpZXdMaWZlY3ljbGVDYWxsYmFja3NNZXRob2QuYWRkU3RtdChuZXcgby5JZlN0bXQoXG4gICAgICAgIFNUQVRFX0lTX05FVkVSX0NIRUNLRUQsIFtkaXJlY3RpdmVJbnN0YW5jZS5jYWxsTWV0aG9kKCduZ0FmdGVyVmlld0luaXQnLCBbXSkudG9TdG10KCldKSk7XG4gIH1cbiAgaWYgKGxpZmVjeWNsZUhvb2tzLmluZGV4T2YoTGlmZWN5Y2xlSG9va3MuQWZ0ZXJWaWV3Q2hlY2tlZCkgIT09IC0xKSB7XG4gICAgYWZ0ZXJWaWV3TGlmZWN5Y2xlQ2FsbGJhY2tzTWV0aG9kLmFkZFN0bXQoXG4gICAgICAgIGRpcmVjdGl2ZUluc3RhbmNlLmNhbGxNZXRob2QoJ25nQWZ0ZXJWaWV3Q2hlY2tlZCcsIFtdKS50b1N0bXQoKSk7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJpbmREaXJlY3RpdmVEZXN0cm95TGlmZWN5Y2xlQ2FsbGJhY2tzKGRpcmVjdGl2ZU1ldGE6IENvbXBpbGVEaXJlY3RpdmVNZXRhZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkaXJlY3RpdmVJbnN0YW5jZTogby5FeHByZXNzaW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbXBpbGVFbGVtZW50OiBDb21waWxlRWxlbWVudCkge1xuICB2YXIgb25EZXN0cm95TWV0aG9kID0gY29tcGlsZUVsZW1lbnQudmlldy5kZXN0cm95TWV0aG9kO1xuICBvbkRlc3Ryb3lNZXRob2QucmVzZXREZWJ1Z0luZm8oY29tcGlsZUVsZW1lbnQubm9kZUluZGV4LCBjb21waWxlRWxlbWVudC5zb3VyY2VBc3QpO1xuICBpZiAoZGlyZWN0aXZlTWV0YS5saWZlY3ljbGVIb29rcy5pbmRleE9mKExpZmVjeWNsZUhvb2tzLk9uRGVzdHJveSkgIT09IC0xKSB7XG4gICAgb25EZXN0cm95TWV0aG9kLmFkZFN0bXQoZGlyZWN0aXZlSW5zdGFuY2UuY2FsbE1ldGhvZCgnbmdPbkRlc3Ryb3knLCBbXSkudG9TdG10KCkpO1xuICB9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBiaW5kUGlwZURlc3Ryb3lMaWZlY3ljbGVDYWxsYmFja3MocGlwZU1ldGE6IENvbXBpbGVQaXBlTWV0YWRhdGEsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBpcGVJbnN0YW5jZTogby5FeHByZXNzaW9uLCB2aWV3OiBDb21waWxlVmlldykge1xuICB2YXIgb25EZXN0cm95TWV0aG9kID0gdmlldy5kZXN0cm95TWV0aG9kO1xuICBpZiAocGlwZU1ldGEubGlmZWN5Y2xlSG9va3MuaW5kZXhPZihMaWZlY3ljbGVIb29rcy5PbkRlc3Ryb3kpICE9PSAtMSkge1xuICAgIG9uRGVzdHJveU1ldGhvZC5hZGRTdG10KHBpcGVJbnN0YW5jZS5jYWxsTWV0aG9kKCduZ09uRGVzdHJveScsIFtdKS50b1N0bXQoKSk7XG4gIH1cbn1cbiJdfQ==