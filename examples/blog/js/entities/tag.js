var React = require('react');

export default function (name, nga, admin) {

  var tag = admin.getEntity(name)
      .readOnly(); // a readOnly entity has disabled creation, edition, and deletion views

  tag.views['DashboardView']
      .title('Recent tags')
      .order(3)
      .limit(10)
      .fields([
          nga.field('id'),
          nga.field('name'),
          nga.field('published', 'boolean').label('Is published ?')
      ]);

  tag.views['ListView']
      .infinitePagination(false) // by default, the list view uses infinite pagination. Set to false to use regulat pagination
      .fields([
          nga.field('id', 'number').label('ID'),
          nga.field('name'),
          nga.field('published', 'boolean').cssClasses(function (entry) { // add custom CSS classes to inputs and columns
              if (entry.values.published) {
                  return 'bg-success text-center';
              }
              return 'bg-warning text-center';
          }),
          nga.field('custom', 'template')
              .label('Upper name')
              .template(function (entity) {
                  return entity.values.name.toUpperCase();
              })
      ])
      .listActions(['show', 'edit']);

  tag.views['ShowView']
      .fields([
          nga.field('name'),
          nga.field('published', 'boolean')
      ]);

  tag.views['EditView']
      .fields([
          nga.field('name'),
          nga.field('published', 'boolean')
      ]);

  tag.views['CreateView']
      .fields([
          nga.field('name'),
          nga.field('published', 'boolean')
      ]);

  return tag;
}
