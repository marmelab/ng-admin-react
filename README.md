# React-admin [![Build Status](https://travis-ci.org/marmelab/react-admin.svg?branch=master)](https://travis-ci.org/marmelab/react-admin)

Add a ReactJS admin GUI to any RESTful API. Based on [ng-admin](https://github.com/marmelab/ng-admin).

[![Screencast](http://marmelab.com/ng-admin/images/screencast.png)](https://vimeo.com/118697682)

## Status

Development is pre-beta but is progressing fast. React-admin will be backwards compatible with ng-admin, which means that the API for describing an admin will be the same:

```js
var ad = AdminDescription;
var app = ad.application('ng-admin backend demo') // application main title
    .baseApiUrl('http://localhost:3000/'); // main API endpoint

// define all entities at the top to allow references between them
var post = ad.entity('posts') // the API endpoint for posts will be http://localhost:3000/posts/:id
    .identifier(ad.field('id')); // you can optionally customize the identifier used in the api ('id' by default)

// set the application entities
app.addEntity(post);

// customize entities and views

post.menuView()
    .icon('<span class="glyphicon glyphicon-file"></span>'); // customize the entity menu icon

post.dashboardView() // customize the dashboard panel for this entity
    .title('Recent posts')
    .order(1) // display the post panel first in the dashboard
    .limit(5) // limit the panel to the 5 latest posts
    .fields([ad.field('title').isDetailLink(true).map(truncate)]); // fields() called with arguments add fields to the view

post.listView()
    .title('All posts') // default title is "[Entity_name] list"
    .description('List of posts with infinite pagination') // description appears under the title
    .infinitePagination(true) // load pages as the user scrolls
    .fields([
        ad.field('id').label('ID'), // The default displayed name is the camelCase field name. label() overrides id
        ad.field('title'), // the default list field type is "string", and displays as a string
        ad.field('published_at', 'date'), // Date field type allows date formatting
        ad.field('views', 'number'),
        ad.field('tags', 'reference_many') // a Reference is a particular type of field that references another entity
            .targetEntity(tag) // the tag entity is defined later in this file
            .targetField(ad.field('name')) // the field to be displayed in this list
    ])
    .listActions(['show', 'edit', 'delete']);

post.creationView()
    .fields([
        ad.field('title') // the default edit field type is "string", and displays as a text input
            .attributes({ placeholder: 'the post title' }) // you can add custom attributes, too
            .validation({ required: true, minlength: 3, maxlength: 100 }), // add validation rules for fields
        ad.field('teaser', 'text'), // text field type translates to a textarea
        ad.field('body', 'wysiwyg'), // overriding the type allows rich text editing for the body
        ad.field('published_at', 'date') // Date field type translates to a datepicker
    ]);

post.editionView()
    .title('Edit post "{{ entry.values.title }}"') // title() accepts a template string, which has access to the entry
    .actions(['list', 'show', 'delete']) // choose which buttons appear in the top action bar. Show is disabled by default
    .fields([
        post.creationView().fields(), // fields() without arguments returns the list of fields. That way you can reuse fields from another view to avoid repetition
        ad.field('tags', 'reference_many') // reference_many translates to a select multiple
            .targetEntity(tag)
            .targetField(ad.field('name'))
            .cssClasses('col-sm-4'), // customize look and feel through CSS classes
        ad.field('views', 'number')
            .cssClasses('col-sm-4'),
        ad.field('comments', 'referenced_list') // display list of related comments
            .targetEntity(comment)
            .targetReferenceField('post_id')
            .targetFields([
                ad.field('id'),
                ad.field('body').label('Comment')
            ])
    ]);

post.showView() // a showView displays one entry in full page - allows to display more data than in a a list
    .fields([
        ad.field('id'),
        post.editionView().fields(), // reuse fields from another view in another order
        ad.field('custom_action', 'template')
            .template('<other-page-link></other-link-link>')
    ]);
```

## Running blog backend admin demo locally

### Using browser package

``` sh
make install-blog
make run-blog
```

The application is now available at `http://localhost:8080/`.

### Using server package

``` sh
cd examples/blog
make install
make run
```

The application is now available at `http://localhost:8088/`.

## Rebuilding the Compiled JS and CSS Files

Concatenate and minify the app with:

```sh
make build
```

All build files will then be updated and minified, ready for production.

## Testing

react-admin has unit tests (powered by jest) and end to end tests (powered by protractor).
Launch the entire tests suite by calling:

```sh
make test
```

Run only unit tests suite:

```sh
make test-unit
```

Run only one unit test by calling, for example:

```
./test-unit-single.sh __tests__/autoloaderTest.js
```
