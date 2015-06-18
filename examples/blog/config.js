(function () {
    'use strict';

    function truncate(value) {
        if (!value) {
            return '';
        }

        return value.length > 50 ? value.substr(0, 50) + '...' : value;
    }

    function configureApp(nga, fieldViewConfiguration, components, routes, restful, autoload) {
        restful.addFullRequestInterceptor(function (url, params, headers, data) {
            headers['X-From'] = 'react-admin';

            return {
                headers: headers
            };
        });

        // Add custom component
        var SendEmail = React.createClass({
            render: function () {
                return <a className='btn btn-default' href='#/stats'>Show stats</a>;
            }
        });
        autoload('SendEmail', SendEmail);

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
                     .template(<SendEmail post="entry"></SendEmail>)
            ]);

        post.views['DeleteView']
            .title('Delete post "{ entry.values.title }"');

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
                    .targetEntity(post)
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

        // customize menu
        admin.menu(nga.menu()
                .addChild(nga.menu(post).icon('<span class="glyphicon glyphicon-file"></span>')) // customize the entity menu icon
                .addChild(nga.menu(comment).icon('<strong style="font-size:1.3em;line-height:1em">✉</strong>')) // you can even use utf-8 symbols!
                .addChild(nga.menu(tag).icon('<span class="glyphicon glyphicon-tags"></span>'))
                .addChild(nga.menu().title('Other')
                    .addChild(nga.menu().title('Stats').icon('').link('/stats'))
                )
            );

        // Add custom route
        var ViewActions = components.ViewActions;
        var Route = ReactRouter.Route;
        var Stats = React.createClass({
            render: function () {
                return <div>
                    <ViewActions buttons={['back']} />
                    <h1>Stats</h1>
                    <p className='lead'>You can add custom pages, too</p>
                </div>;
            }
        });

        routes.props.children.push(<Route name="stats" path="/stats" handler={Stats} />);

        return admin;
    }

    React.render(<ReactAdmin configureApp={configureApp} />, document.getElementById('my-app'));
}());
