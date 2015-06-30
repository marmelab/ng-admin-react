export function hasEntityAndView(entityName) {
    try {
        const view = this.getView(entityName);

        return view.enabled;
    } catch (e) {
        return false;
    }
}

export function getView(entityName) {
    entityName = entityName || this.context.router.getCurrentParams().entity;

    return this.props.configuration.getViewByEntityAndType(entityName, this.viewName);
}
