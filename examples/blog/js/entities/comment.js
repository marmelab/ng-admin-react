var React = require('react');
import { truncate } from '../utils';

export default function (nga, admin) {

  // define all entities at the top to allow references between them
  var comment = admin.getEntity('comments')
      .baseApiUrl('http://localhost:3000/') // The base API endpoint can be customized by entity
      .identifier(nga.field('id')); // you can optionally customize the identifier used in the api ('id' by default)

  comment.views['DashboardView']
      .title('Last comments')
      .order(2) // display the comment panel second in the dashboard
      .perPage(5)
      .fields([
          nga.field('id'),
          nga.field('body').label('Comment').map(truncate),
          nga.field(null, 'template') // template fields don't need a name in dashboard view
               .label('Edition')
               .template(function() {
                  return <Link to="edit" params={{entity: "comments", id: this.props.entry.identifierValue}}>Edit</Link>;
              }) // you can use custom directives, too
      ]);

  comment.views['ListView']
      .title('Comments')
      .perPage(10) // limit the number of elements displayed per page. Default is 30.
      .fields([
          nga.field('created_at', 'date').label('Posted'),
          nga.field('body').isDetailLink(true).map(truncate),
          nga.field('post_id', 'reference')
              .label('Post')
              .map(truncate)
              .targetEntity(admin.getEntity('posts'))
              .targetField(nga.field('title').map(truncate)),
          nga.field('author'),
          nga.field('note', 'choices')
             .choices([
                 { label: 'Usefull', value: 'usefull' },
                 { label: 'Useless', value: 'useless' }
             ])
      ])
      .filters([
          nga.field('q', 'string').label('').attributes({'placeholder': 'Global Search'}),
          nga.field('created_at', 'date')
              .label('Posted')
              .attributes({'placeholder': 'Filter by date'})
              .format('yyyy-MM-dd'),
          nga.field('today', 'boolean').map(function () {
              var now = new Date(),
                  year = now.getFullYear(),
                  month = now.getMonth() + 1,
                  day = now.getDate();
              month = month < 10 ? '0' + month : month;
              day = day < 10 ? '0' + day : day;
              return {
                  created_at: [year, month, day].join('-') // ?created_at=... will be appended to the API call
              };
          }),
          nga.field('post_id', 'reference')
              .label('Post')
              .targetEntity(admin.getEntity('posts'))
              .targetField(nga.field('title'))
      ])
      .listActions(['edit', 'delete']);

  comment.views['CreateView']
      .fields([
          nga.field('created_at', 'date')
              .label('Posted')
              .defaultValue(new Date()), // preset fields in creation view with defaultValue
          nga.field('author'),
          nga.field('body', 'wysiwyg'),
          nga.field('post_id', 'reference')
              .label('Post')
              .map(truncate)
              .targetEntity(admin.getEntity('posts'))
              .targetField(nga.field('title'))
      ]);

  comment.views['EditView']
      .fields([
          comment.views['CreateView'].fields(),
          nga.field('note', 'choices')
             .choices([
                 { label: 'Usefull', value: 'usefull' },
                 { label: 'Useless', value: 'useless' }
             ])
      ]);
      // .fields([nga.field(null, 'template')
      //     .label('')
      //     .template('<post-link entry="entry"></post-link>') // template() can take a function or a string
      // ]);

  comment.views['DeleteView']
      .title('Deletion confirmation'); // customize the deletion confirmation message

  return comment;
}
