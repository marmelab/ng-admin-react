import Notification from '../Services/Notification';

export function hasEntityAndView(entityName) {
    try {
        const view = this.getView(entityName);

        if (!view.enabled) {
            console.error(`${this.viewName} is disable for "${entityName}" entity.`);

            return false;
        }

        return true;
    } catch (e) {
        if (console) {
            console.error(e);
        }

        return false;
    }
}

export function getView(entityName) {
    entityName = entityName || this.context.router.getCurrentParams().entity;
    const entity = this.props.configuration.getEntity(entityName);

    if (!entity.views.hasOwnProperty(this.viewName)) {
        throw new Error(`${this.viewName} does not exists.`);
    }

    return entity.views[this.viewName];
}

export function onFailure(error, requestType='read') {
    if (console) {
        console.error(error);
    }

    // error comes form Restful request OR error comes from remote API
    const message = error.message || error.status + ' - ' + error.statusText;
    const action = 'read' === requestType ? 'fetching' : 'pushing';

    Notification.log(`Error while ${action} data: ${message}.`, {
        addnCls: 'humane-flatty-error'
    });
}
