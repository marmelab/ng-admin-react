var React = require('react');

export default function (name, nga, admin, truncate) {

  var post = admin.getEntity(name); // the API endpoint for posts will be http://localhost:3000/posts/:id

  post.views['DashboardView'] // customize the dashboard panel for this entity
      .title('Recent posts')
      .order(1) // display the post panel first in the dashboard
      .limit(5) // limit the panel to the 5 latest posts
      .fields([nga.field('title').isDetailLink(true).map(truncate)]); // fields() called with arguments add fields to the view

  post.views['ListView']
      .title('All posts') // default title is '[Entity_name] list'
      .description('List of posts with infinite pagination') // description appears under the title
      .infinitePagination(true) // load pages as the user scrolls
      .fields([
          nga.field('id').label('ID'), // The default displayed name is the camelCase field name. label() overrides id
          nga.field('title'), // the default list field type is 'string', and displays as a string
          nga.field('published_at', 'date'), // Date field type allows date formatting
          nga.field('views', 'number'),
          nga.field('category', 'choice')
             .choices([ // List the choice as object literals
                 { label: 'Tech', value: 'tech' },
                 { label: 'Lifestyle', value: 'lifestyle' }
             ]),
          nga.field('tags', 'reference_many') // a Reference is a particular type of field that references another entity
              .targetEntity(admin.getEntity('tags'))
              .targetField(nga.field('name')) // the field to be displayed in this list
      ])
      .listActions(['show', 'edit', 'delete']);

  post.views['CreateView']
      .fields([
          nga.field('title') // the default edit field type is 'string', and displays as a text input
              .attributes({ placeholder: 'the post title' }) // you can add custom attributes, too
              .validation({ required: true, minlength: 3, maxlength: 100 }), // add validation rules for fields
          nga.field('teaser', 'text'), // text field type translates to a textarea
          nga.field('body', 'wysiwyg'), // overriding the type allows rich text editing for the body
          nga.field('published_at', 'date') // Date field type translates to a datepicker
      ]);

  var subCategories = [
      { category: 'tech', label: 'Computers', value: 'computers' },
      { category: 'tech', label: 'Gadgets', value: 'gadgets' },
      { category: 'lifestyle', label: 'Travel', value: 'travel' },
      { category: 'lifestyle', label: 'Fitness', value: 'fitness' }
  ];

  post.views['EditView']
      .title('Edit post "{ entry.values.title }"') // title() accepts a template string, which has access to the entry
      .actions(['list', 'show', 'delete']) // choose which buttons appear in the top action bar. Show is disabled by default
      .fields([
          post.views['CreateView'].fields(), // fields() without arguments returns the list of fields. That way you can reuse fields from another view to avoid repetition
          nga.field('category', 'choice') // a choice field is rendered as a dropdown in the edition view
             .choices([ // List the choice as object literals
                 { label: 'Tech', value: 'tech' },
                 { label: 'Lifestyle', value: 'lifestyle' }
             ]),
          nga.field('subcategory', 'choice')
             .choices(function(entry) { // choices also accepts a function to return a list of choices based on the current entry
                 return subCategories.filter(function (c) {
                     return c.category === entry.values.category;
                 });
             }),
          nga.field('tags', 'reference_many') // ReferenceMany translates to a select multiple
              .targetEntity(admin.getEntity('tags'))
              .targetField(nga.field('name'))
              .cssClasses('col-sm-4'), // customize look and feel through CSS classes
          nga.field('pictures', 'json'),
          nga.field('views', 'number')
              .cssClasses('col-sm-4'),
          nga.field('comments', 'referenced_list') // display list of related comments
              .targetEntity(admin.getEntity('comments'))
              .targetReferenceField('post_id')
              .targetFields([
                  nga.field('id'),
                  nga.field('body').label('Comment')
              ])
      ]);

  post.views['ShowView'] // a showView displays one entry in full page - allows to display more data than in a a list
      .fields([
          nga.field('id'),
          post.views['EditView'].fields(), // reuse fields from another view in another order
          nga.field('custom_action', 'template')
             .label('')
             .template(<SendEmail post="entry"></SendEmail>)
      ]);

  post.views['DeleteView']
      .title('Delete post "{ entry.values.title }"');

  return post;
}
