import { isPresent, isBlank } from 'angular2/src/facade/lang';
import { ListWrapper } from 'angular2/src/facade/collection';
import * as o from '../output/output_ast';
import { Identifiers } from '../identifiers';
import { getPropertyInView } from './util';
class ViewQueryValues {
    constructor(view, values) {
        this.view = view;
        this.values = values;
    }
}
export class CompileQuery {
    constructor(meta, queryList, ownerDirectiveExpression, view) {
        this.meta = meta;
        this.queryList = queryList;
        this.ownerDirectiveExpression = ownerDirectiveExpression;
        this.view = view;
        this._values = new ViewQueryValues(view, []);
    }
    addValue(value, view) {
        var currentView = view;
        var elPath = [];
        while (isPresent(currentView) && currentView !== this.view) {
            var parentEl = currentView.declarationElement;
            elPath.unshift(parentEl);
            currentView = parentEl.view;
        }
        var queryListForDirtyExpr = getPropertyInView(this.queryList, view, this.view);
        var viewValues = this._values;
        elPath.forEach((el) => {
            var last = viewValues.values.length > 0 ? viewValues.values[viewValues.values.length - 1] : null;
            if (last instanceof ViewQueryValues && last.view === el.embeddedView) {
                viewValues = last;
            }
            else {
                var newViewValues = new ViewQueryValues(el.embeddedView, []);
                viewValues.values.push(newViewValues);
                viewValues = newViewValues;
            }
        });
        viewValues.values.push(value);
        if (elPath.length > 0) {
            view.dirtyParentQueriesMethod.addStmt(queryListForDirtyExpr.callMethod('setDirty', []).toStmt());
        }
    }
    afterChildren(targetMethod) {
        var values = createQueryValues(this._values);
        var updateStmts = [this.queryList.callMethod('reset', [o.literalArr(values)]).toStmt()];
        if (isPresent(this.ownerDirectiveExpression)) {
            var valueExpr = this.meta.first ? this.queryList.prop('first') : this.queryList;
            updateStmts.push(this.ownerDirectiveExpression.prop(this.meta.propertyName).set(valueExpr).toStmt());
        }
        if (!this.meta.first) {
            updateStmts.push(this.queryList.callMethod('notifyOnChanges', []).toStmt());
        }
        targetMethod.addStmt(new o.IfStmt(this.queryList.prop('dirty'), updateStmts));
    }
}
function createQueryValues(viewValues) {
    return ListWrapper.flatten(viewValues.values.map((entry) => {
        if (entry instanceof ViewQueryValues) {
            return mapNestedViews(entry.view.declarationElement.appElement, entry.view, createQueryValues(entry));
        }
        else {
            return entry;
        }
    }));
}
function mapNestedViews(declarationAppElement, view, expressions) {
    var adjustedExpressions = expressions.map((expr) => {
        return o.replaceVarInExpression(o.THIS_EXPR.name, o.variable('nestedView'), expr);
    });
    return declarationAppElement.callMethod('mapNestedViews', [
        o.variable(view.className),
        o.fn([new o.FnParam('nestedView', view.classType)], [new o.ReturnStatement(o.literalArr(adjustedExpressions))])
    ]);
}
export function createQueryList(query, directiveInstance, propertyName, compileView) {
    compileView.fields.push(new o.ClassField(propertyName, o.importType(Identifiers.QueryList), [o.StmtModifier.Private]));
    var expr = o.THIS_EXPR.prop(propertyName);
    compileView.createMethod.addStmt(o.THIS_EXPR.prop(propertyName)
        .set(o.importExpr(Identifiers.QueryList).instantiate([]))
        .toStmt());
    return expr;
}
export function addQueryToTokenMap(map, query) {
    query.meta.selectors.forEach((selector) => {
        var entry = map.get(selector);
        if (isBlank(entry)) {
            entry = [];
            map.add(selector, entry);
        }
        entry.push(query);
    });
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tcGlsZV9xdWVyeS5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImRpZmZpbmdfcGx1Z2luX3dyYXBwZXItb3V0cHV0X3BhdGgtRWdRYThIN1UudG1wL2FuZ3VsYXIyL3NyYy9jb21waWxlci92aWV3X2NvbXBpbGVyL2NvbXBpbGVfcXVlcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ik9BQU8sRUFBQyxTQUFTLEVBQUUsT0FBTyxFQUFDLE1BQU0sMEJBQTBCO09BQ3BELEVBQUMsV0FBVyxFQUFDLE1BQU0sZ0NBQWdDO09BRW5ELEtBQUssQ0FBQyxNQUFNLHNCQUFzQjtPQUNsQyxFQUFDLFdBQVcsRUFBQyxNQUFNLGdCQUFnQjtPQVduQyxFQUFDLGlCQUFpQixFQUFDLE1BQU0sUUFBUTtBQUV4QztJQUNFLFlBQW1CLElBQWlCLEVBQVMsTUFBNkM7UUFBdkUsU0FBSSxHQUFKLElBQUksQ0FBYTtRQUFTLFdBQU0sR0FBTixNQUFNLENBQXVDO0lBQUcsQ0FBQztBQUNoRyxDQUFDO0FBRUQ7SUFHRSxZQUFtQixJQUEwQixFQUFTLFNBQXVCLEVBQzFELHdCQUFzQyxFQUFTLElBQWlCO1FBRGhFLFNBQUksR0FBSixJQUFJLENBQXNCO1FBQVMsY0FBUyxHQUFULFNBQVMsQ0FBYztRQUMxRCw2QkFBd0IsR0FBeEIsd0JBQXdCLENBQWM7UUFBUyxTQUFJLEdBQUosSUFBSSxDQUFhO1FBQ2pGLElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxlQUFlLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQy9DLENBQUM7SUFFRCxRQUFRLENBQUMsS0FBbUIsRUFBRSxJQUFpQjtRQUM3QyxJQUFJLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDdkIsSUFBSSxNQUFNLEdBQXFCLEVBQUUsQ0FBQztRQUNsQyxPQUFPLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxXQUFXLEtBQUssSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzNELElBQUksUUFBUSxHQUFHLFdBQVcsQ0FBQyxrQkFBa0IsQ0FBQztZQUM5QyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDO1lBQ3pCLFdBQVcsR0FBRyxRQUFRLENBQUMsSUFBSSxDQUFDO1FBQzlCLENBQUM7UUFDRCxJQUFJLHFCQUFxQixHQUFHLGlCQUFpQixDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUUvRSxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzlCLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxFQUFFO1lBQ2hCLElBQUksSUFBSSxHQUNKLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQztZQUMxRixFQUFFLENBQUMsQ0FBQyxJQUFJLFlBQVksZUFBZSxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssRUFBRSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7Z0JBQ3JFLFVBQVUsR0FBRyxJQUFJLENBQUM7WUFDcEIsQ0FBQztZQUFDLElBQUksQ0FBQyxDQUFDO2dCQUNOLElBQUksYUFBYSxHQUFHLElBQUksZUFBZSxDQUFDLEVBQUUsQ0FBQyxZQUFZLEVBQUUsRUFBRSxDQUFDLENBQUM7Z0JBQzdELFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO2dCQUN0QyxVQUFVLEdBQUcsYUFBYSxDQUFDO1lBQzdCLENBQUM7UUFDSCxDQUFDLENBQUMsQ0FBQztRQUNILFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBRTlCLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUN0QixJQUFJLENBQUMsd0JBQXdCLENBQUMsT0FBTyxDQUNqQyxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsVUFBVSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDakUsQ0FBQztJQUNILENBQUM7SUFFRCxhQUFhLENBQUMsWUFBMkI7UUFDdkMsSUFBSSxNQUFNLEdBQUcsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQzdDLElBQUksV0FBVyxHQUFHLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUN4RixFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLHdCQUF3QixDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzdDLElBQUksU0FBUyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUM7WUFDaEYsV0FBVyxDQUFDLElBQUksQ0FDWixJQUFJLENBQUMsd0JBQXdCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsWUFBWSxDQUFDLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUM7UUFDMUYsQ0FBQztRQUNELEVBQUUsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLFdBQVcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxVQUFVLENBQUMsaUJBQWlCLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUM5RSxDQUFDO1FBQ0QsWUFBWSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEVBQUUsV0FBVyxDQUFDLENBQUMsQ0FBQztJQUNoRixDQUFDO0FBQ0gsQ0FBQztBQUVELDJCQUEyQixVQUEyQjtJQUNwRCxNQUFNLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEtBQUs7UUFDckQsRUFBRSxDQUFDLENBQUMsS0FBSyxZQUFZLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDckMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLGtCQUFrQixDQUFDLFVBQVUsRUFBRSxLQUFLLENBQUMsSUFBSSxFQUNwRCxpQkFBaUIsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFBQyxJQUFJLENBQUMsQ0FBQztZQUNOLE1BQU0sQ0FBZSxLQUFLLENBQUM7UUFDN0IsQ0FBQztJQUNILENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDTixDQUFDO0FBRUQsd0JBQXdCLHFCQUFtQyxFQUFFLElBQWlCLEVBQ3RELFdBQTJCO0lBQ2pELElBQUksbUJBQW1CLEdBQW1CLFdBQVcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJO1FBQzdELE1BQU0sQ0FBQyxDQUFDLENBQUMsc0JBQXNCLENBQUMsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxZQUFZLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNwRixDQUFDLENBQUMsQ0FBQztJQUNILE1BQU0sQ0FBQyxxQkFBcUIsQ0FBQyxVQUFVLENBQUMsZ0JBQWdCLEVBQUU7UUFDeEQsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDO1FBQzFCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUMsWUFBWSxFQUFFLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUM3QyxDQUFDLElBQUksQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQ2pFLENBQUMsQ0FBQztBQUNMLENBQUM7QUFFRCxnQ0FBZ0MsS0FBMkIsRUFBRSxpQkFBK0IsRUFDNUQsWUFBb0IsRUFBRSxXQUF3QjtJQUM1RSxXQUFXLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxVQUFVLENBQUMsWUFBWSxFQUFFLENBQUMsQ0FBQyxVQUFVLENBQUMsV0FBVyxDQUFDLFNBQVMsQ0FBQyxFQUNqRCxDQUFDLENBQUMsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLElBQUksSUFBSSxHQUFHLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDO0lBQzFDLFdBQVcsQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFlBQVksQ0FBQztTQUN6QixHQUFHLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsU0FBUyxDQUFDLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1NBQ3hELE1BQU0sRUFBRSxDQUFDLENBQUM7SUFDaEQsTUFBTSxDQUFDLElBQUksQ0FBQztBQUNkLENBQUM7QUFFRCxtQ0FBbUMsR0FBb0MsRUFBRSxLQUFtQjtJQUMxRixLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxRQUFRO1FBQ3BDLElBQUksS0FBSyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDOUIsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNuQixLQUFLLEdBQUcsRUFBRSxDQUFDO1lBQ1gsR0FBRyxDQUFDLEdBQUcsQ0FBQyxRQUFRLEVBQUUsS0FBSyxDQUFDLENBQUM7UUFDM0IsQ0FBQztRQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDcEIsQ0FBQyxDQUFDLENBQUM7QUFDTCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtpc1ByZXNlbnQsIGlzQmxhbmt9IGZyb20gJ2FuZ3VsYXIyL3NyYy9mYWNhZGUvbGFuZyc7XG5pbXBvcnQge0xpc3RXcmFwcGVyfSBmcm9tICdhbmd1bGFyMi9zcmMvZmFjYWRlL2NvbGxlY3Rpb24nO1xuXG5pbXBvcnQgKiBhcyBvIGZyb20gJy4uL291dHB1dC9vdXRwdXRfYXN0JztcbmltcG9ydCB7SWRlbnRpZmllcnN9IGZyb20gJy4uL2lkZW50aWZpZXJzJztcblxuaW1wb3J0IHtcbiAgQ29tcGlsZVF1ZXJ5TWV0YWRhdGEsXG4gIENvbXBpbGVJZGVudGlmaWVyTWV0YWRhdGEsXG4gIENvbXBpbGVUb2tlbk1hcFxufSBmcm9tICcuLi9jb21waWxlX21ldGFkYXRhJztcblxuaW1wb3J0IHtDb21waWxlVmlld30gZnJvbSAnLi9jb21waWxlX3ZpZXcnO1xuaW1wb3J0IHtDb21waWxlRWxlbWVudH0gZnJvbSAnLi9jb21waWxlX2VsZW1lbnQnO1xuaW1wb3J0IHtDb21waWxlTWV0aG9kfSBmcm9tICcuL2NvbXBpbGVfbWV0aG9kJztcbmltcG9ydCB7Z2V0UHJvcGVydHlJblZpZXd9IGZyb20gJy4vdXRpbCc7XG5cbmNsYXNzIFZpZXdRdWVyeVZhbHVlcyB7XG4gIGNvbnN0cnVjdG9yKHB1YmxpYyB2aWV3OiBDb21waWxlVmlldywgcHVibGljIHZhbHVlczogQXJyYXk8by5FeHByZXNzaW9uIHwgVmlld1F1ZXJ5VmFsdWVzPikge31cbn1cblxuZXhwb3J0IGNsYXNzIENvbXBpbGVRdWVyeSB7XG4gIHByaXZhdGUgX3ZhbHVlczogVmlld1F1ZXJ5VmFsdWVzO1xuXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtZXRhOiBDb21waWxlUXVlcnlNZXRhZGF0YSwgcHVibGljIHF1ZXJ5TGlzdDogby5FeHByZXNzaW9uLFxuICAgICAgICAgICAgICBwdWJsaWMgb3duZXJEaXJlY3RpdmVFeHByZXNzaW9uOiBvLkV4cHJlc3Npb24sIHB1YmxpYyB2aWV3OiBDb21waWxlVmlldykge1xuICAgIHRoaXMuX3ZhbHVlcyA9IG5ldyBWaWV3UXVlcnlWYWx1ZXModmlldywgW10pO1xuICB9XG5cbiAgYWRkVmFsdWUodmFsdWU6IG8uRXhwcmVzc2lvbiwgdmlldzogQ29tcGlsZVZpZXcpIHtcbiAgICB2YXIgY3VycmVudFZpZXcgPSB2aWV3O1xuICAgIHZhciBlbFBhdGg6IENvbXBpbGVFbGVtZW50W10gPSBbXTtcbiAgICB3aGlsZSAoaXNQcmVzZW50KGN1cnJlbnRWaWV3KSAmJiBjdXJyZW50VmlldyAhPT0gdGhpcy52aWV3KSB7XG4gICAgICB2YXIgcGFyZW50RWwgPSBjdXJyZW50Vmlldy5kZWNsYXJhdGlvbkVsZW1lbnQ7XG4gICAgICBlbFBhdGgudW5zaGlmdChwYXJlbnRFbCk7XG4gICAgICBjdXJyZW50VmlldyA9IHBhcmVudEVsLnZpZXc7XG4gICAgfVxuICAgIHZhciBxdWVyeUxpc3RGb3JEaXJ0eUV4cHIgPSBnZXRQcm9wZXJ0eUluVmlldyh0aGlzLnF1ZXJ5TGlzdCwgdmlldywgdGhpcy52aWV3KTtcblxuICAgIHZhciB2aWV3VmFsdWVzID0gdGhpcy5fdmFsdWVzO1xuICAgIGVsUGF0aC5mb3JFYWNoKChlbCkgPT4ge1xuICAgICAgdmFyIGxhc3QgPVxuICAgICAgICAgIHZpZXdWYWx1ZXMudmFsdWVzLmxlbmd0aCA+IDAgPyB2aWV3VmFsdWVzLnZhbHVlc1t2aWV3VmFsdWVzLnZhbHVlcy5sZW5ndGggLSAxXSA6IG51bGw7XG4gICAgICBpZiAobGFzdCBpbnN0YW5jZW9mIFZpZXdRdWVyeVZhbHVlcyAmJiBsYXN0LnZpZXcgPT09IGVsLmVtYmVkZGVkVmlldykge1xuICAgICAgICB2aWV3VmFsdWVzID0gbGFzdDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHZhciBuZXdWaWV3VmFsdWVzID0gbmV3IFZpZXdRdWVyeVZhbHVlcyhlbC5lbWJlZGRlZFZpZXcsIFtdKTtcbiAgICAgICAgdmlld1ZhbHVlcy52YWx1ZXMucHVzaChuZXdWaWV3VmFsdWVzKTtcbiAgICAgICAgdmlld1ZhbHVlcyA9IG5ld1ZpZXdWYWx1ZXM7XG4gICAgICB9XG4gICAgfSk7XG4gICAgdmlld1ZhbHVlcy52YWx1ZXMucHVzaCh2YWx1ZSk7XG5cbiAgICBpZiAoZWxQYXRoLmxlbmd0aCA+IDApIHtcbiAgICAgIHZpZXcuZGlydHlQYXJlbnRRdWVyaWVzTWV0aG9kLmFkZFN0bXQoXG4gICAgICAgICAgcXVlcnlMaXN0Rm9yRGlydHlFeHByLmNhbGxNZXRob2QoJ3NldERpcnR5JywgW10pLnRvU3RtdCgpKTtcbiAgICB9XG4gIH1cblxuICBhZnRlckNoaWxkcmVuKHRhcmdldE1ldGhvZDogQ29tcGlsZU1ldGhvZCkge1xuICAgIHZhciB2YWx1ZXMgPSBjcmVhdGVRdWVyeVZhbHVlcyh0aGlzLl92YWx1ZXMpO1xuICAgIHZhciB1cGRhdGVTdG10cyA9IFt0aGlzLnF1ZXJ5TGlzdC5jYWxsTWV0aG9kKCdyZXNldCcsIFtvLmxpdGVyYWxBcnIodmFsdWVzKV0pLnRvU3RtdCgpXTtcbiAgICBpZiAoaXNQcmVzZW50KHRoaXMub3duZXJEaXJlY3RpdmVFeHByZXNzaW9uKSkge1xuICAgICAgdmFyIHZhbHVlRXhwciA9IHRoaXMubWV0YS5maXJzdCA/IHRoaXMucXVlcnlMaXN0LnByb3AoJ2ZpcnN0JykgOiB0aGlzLnF1ZXJ5TGlzdDtcbiAgICAgIHVwZGF0ZVN0bXRzLnB1c2goXG4gICAgICAgICAgdGhpcy5vd25lckRpcmVjdGl2ZUV4cHJlc3Npb24ucHJvcCh0aGlzLm1ldGEucHJvcGVydHlOYW1lKS5zZXQodmFsdWVFeHByKS50b1N0bXQoKSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5tZXRhLmZpcnN0KSB7XG4gICAgICB1cGRhdGVTdG10cy5wdXNoKHRoaXMucXVlcnlMaXN0LmNhbGxNZXRob2QoJ25vdGlmeU9uQ2hhbmdlcycsIFtdKS50b1N0bXQoKSk7XG4gICAgfVxuICAgIHRhcmdldE1ldGhvZC5hZGRTdG10KG5ldyBvLklmU3RtdCh0aGlzLnF1ZXJ5TGlzdC5wcm9wKCdkaXJ0eScpLCB1cGRhdGVTdG10cykpO1xuICB9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVF1ZXJ5VmFsdWVzKHZpZXdWYWx1ZXM6IFZpZXdRdWVyeVZhbHVlcyk6IG8uRXhwcmVzc2lvbltdIHtcbiAgcmV0dXJuIExpc3RXcmFwcGVyLmZsYXR0ZW4odmlld1ZhbHVlcy52YWx1ZXMubWFwKChlbnRyeSkgPT4ge1xuICAgIGlmIChlbnRyeSBpbnN0YW5jZW9mIFZpZXdRdWVyeVZhbHVlcykge1xuICAgICAgcmV0dXJuIG1hcE5lc3RlZFZpZXdzKGVudHJ5LnZpZXcuZGVjbGFyYXRpb25FbGVtZW50LmFwcEVsZW1lbnQsIGVudHJ5LnZpZXcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3JlYXRlUXVlcnlWYWx1ZXMoZW50cnkpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIDxvLkV4cHJlc3Npb24+ZW50cnk7XG4gICAgfVxuICB9KSk7XG59XG5cbmZ1bmN0aW9uIG1hcE5lc3RlZFZpZXdzKGRlY2xhcmF0aW9uQXBwRWxlbWVudDogby5FeHByZXNzaW9uLCB2aWV3OiBDb21waWxlVmlldyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV4cHJlc3Npb25zOiBvLkV4cHJlc3Npb25bXSk6IG8uRXhwcmVzc2lvbiB7XG4gIHZhciBhZGp1c3RlZEV4cHJlc3Npb25zOiBvLkV4cHJlc3Npb25bXSA9IGV4cHJlc3Npb25zLm1hcCgoZXhwcikgPT4ge1xuICAgIHJldHVybiBvLnJlcGxhY2VWYXJJbkV4cHJlc3Npb24oby5USElTX0VYUFIubmFtZSwgby52YXJpYWJsZSgnbmVzdGVkVmlldycpLCBleHByKTtcbiAgfSk7XG4gIHJldHVybiBkZWNsYXJhdGlvbkFwcEVsZW1lbnQuY2FsbE1ldGhvZCgnbWFwTmVzdGVkVmlld3MnLCBbXG4gICAgby52YXJpYWJsZSh2aWV3LmNsYXNzTmFtZSksXG4gICAgby5mbihbbmV3IG8uRm5QYXJhbSgnbmVzdGVkVmlldycsIHZpZXcuY2xhc3NUeXBlKV0sXG4gICAgICAgICBbbmV3IG8uUmV0dXJuU3RhdGVtZW50KG8ubGl0ZXJhbEFycihhZGp1c3RlZEV4cHJlc3Npb25zKSldKVxuICBdKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZVF1ZXJ5TGlzdChxdWVyeTogQ29tcGlsZVF1ZXJ5TWV0YWRhdGEsIGRpcmVjdGl2ZUluc3RhbmNlOiBvLkV4cHJlc3Npb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHByb3BlcnR5TmFtZTogc3RyaW5nLCBjb21waWxlVmlldzogQ29tcGlsZVZpZXcpOiBvLkV4cHJlc3Npb24ge1xuICBjb21waWxlVmlldy5maWVsZHMucHVzaChuZXcgby5DbGFzc0ZpZWxkKHByb3BlcnR5TmFtZSwgby5pbXBvcnRUeXBlKElkZW50aWZpZXJzLlF1ZXJ5TGlzdCksXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW28uU3RtdE1vZGlmaWVyLlByaXZhdGVdKSk7XG4gIHZhciBleHByID0gby5USElTX0VYUFIucHJvcChwcm9wZXJ0eU5hbWUpO1xuICBjb21waWxlVmlldy5jcmVhdGVNZXRob2QuYWRkU3RtdChvLlRISVNfRVhQUi5wcm9wKHByb3BlcnR5TmFtZSlcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5zZXQoby5pbXBvcnRFeHByKElkZW50aWZpZXJzLlF1ZXJ5TGlzdCkuaW5zdGFudGlhdGUoW10pKVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLnRvU3RtdCgpKTtcbiAgcmV0dXJuIGV4cHI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhZGRRdWVyeVRvVG9rZW5NYXAobWFwOiBDb21waWxlVG9rZW5NYXA8Q29tcGlsZVF1ZXJ5W10+LCBxdWVyeTogQ29tcGlsZVF1ZXJ5KSB7XG4gIHF1ZXJ5Lm1ldGEuc2VsZWN0b3JzLmZvckVhY2goKHNlbGVjdG9yKSA9PiB7XG4gICAgdmFyIGVudHJ5ID0gbWFwLmdldChzZWxlY3Rvcik7XG4gICAgaWYgKGlzQmxhbmsoZW50cnkpKSB7XG4gICAgICBlbnRyeSA9IFtdO1xuICAgICAgbWFwLmFkZChzZWxlY3RvciwgZW50cnkpO1xuICAgIH1cbiAgICBlbnRyeS5wdXNoKHF1ZXJ5KTtcbiAgfSk7XG59XG4iXX0=