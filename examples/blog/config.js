(function () {
    'use strict';

    function truncate(value) {
        if (!value) {
            return '';
        }

        return value.length > 50 ? value.substr(0, 50) + '...' : value;
    }

    var MyApp = React.createClass({
        getInitialState: function () {
            return {configuration: null};
        },
        componentDidMount: function () {
            var nga = new this.refs.admin.state.factory();
            var admin = nga.application('rest-admin backend demo') // application main title
                .baseApiUrl('http://localhost:3000/'); // main API endpoint

            // define all entities at the top to allow references between them
            var post = nga.entity('posts'); // the API endpoint for posts will be http://localhost:3000/posts/:id

            var comment = nga.entity('comments')
                .baseApiUrl('http://localhost:3000/') // The base API endpoint can be customized by entity
                .identifier(nga.field('id')); // you can optionally customize the identifier used in the api ('id' by default)

            var tag = nga.entity('tags')
                .readOnly(); // a readOnly entity has disabled creation, edition, and deletion views

            // set the application entities
            admin
                .addEntity(post)
                .addEntity(tag)
                .addEntity(comment);

            // customize entities and views
            post.views["MenuView"]
                .icon('<span class="glyphicon glyphicon-file"></span>'); // customize the entity menu icon

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
                    nga.field('tags', 'reference_many') // a Reference is a particular type of field that references another entity
                        .targetEntity(tag) // the tag entity is defined later in this file
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

            post.views['EditView']
                .title('Edit post "{{ entry.values.title }}"') // title() accepts a template string, which has access to the entry
                .actions(['list', 'show', 'delete']) // choose which buttons appear in the top action bar. Show is disabled by default
                .fields([
                    post.views['CreateView'].fields(), // fields() without arguments returns the list of fields. That way you can reuse fields from another view to avoid repetition
                    nga.field('tags', 'reference_many') // ReferenceMany translates to a select multiple
                        .targetEntity(tag)
                        .targetField(nga.field('name'))
                        .cssClasses('col-sm-4'), // customize look and feel through CSS classes
                    nga.field('pictures', 'json'),
                    nga.field('views', 'number')
                        .cssClasses('col-sm-4'),
                    nga.field('comments', 'referenced_list') // display list of related comments
                        .targetEntity(comment)
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
                        .template('<send-email post="entry"></send-email>')
                ]);

            comment.views['MenuView']
                .order(2) // set the menu position in the sidebar
                .icon('<strong style="font-size:1.3em;line-height:1em">✉</strong>'); // you can even use utf-8 symbols!

            comment.views['DashboardView']
                .title('Last comments')
                .order(2) // display the comment panel second in the dashboard
                .perPage(5)
                .fields([
                    nga.field('id'),
                    nga.field('body').label('Comment').map(truncate),
                    nga.field(null, 'template') // template fields don't need a name in dashboard view
                        .label('')
                        .template('<post-link entry="entry"></post-link>') // you can use custom directives, too
                ]);

            comment.views['ListView']
                .title('Comments')
                .perPage(10) // limit the number of elements displayed per page. Default is 30.
                .fields([
                    nga.field('created_at', 'date')
                        .label('Posted')
                        .order(1),
                    nga.field('body').map(truncate).order(3),
                    nga.field('post_id', 'reference')
                        .label('Post')
                        .map(truncate)
                        .targetEntity(post)
                        .targetField(nga.field('title').map(truncate))
                        .order(4),
                    nga.field('author').order(2)
                ])
                .filters([
                    nga.field('q', 'string').label('').attributes({'placeholder': 'Global Search'}),
                    nga.field('created_at', 'date')
                        .label('Posted')
                        .attributes({'placeholder': 'Filter by date'})
                        .format('yyyy-MM-dd'),
                    nga.field('today', 'boolean').map(function() {
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
                        .targetEntity(post)
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
                        .targetEntity(post)
                        .targetField(nga.field('title'))
                ]);

            comment.views['EditView']
                .fields(comment.views['CreateView'].fields())
                .fields([nga.field(null, 'template')
                    .label('')
                    .template('<post-link entry="entry"></post-link>') // template() can take a function or a string
                ]);

            comment.views['DeleteView']
                .title('Deletion confirmation'); // customize the deletion confirmation message

            tag.views['MenuView']
                .order(3)
                .icon('<span class="glyphicon glyphicon-tags"></span>');

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
                            entity.name.toUpperCase();
                        })
                ])
                .listActions(['show']);

            tag.views['ShowView']
                .fields([
                    nga.field('name'),
                    nga.field('published', 'boolean')
                ]);

            this.setState({
                configuration: admin
            });
        },
        render: function () {
            return React.createElement(ReactAdmin, {configuration: this.state.configuration, ref: 'admin'});
        }
    });

    React.render(
        React.createElement(MyApp),
        document.body
    );
}());
