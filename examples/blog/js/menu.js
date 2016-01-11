
export default function (nga, admin) {

  return nga.menu()
      // customize the entity menu icon
      .addChild(nga.menu(admin.getEntity('posts')).icon('<span class="glyphicon glyphicon-file"></span>'))
      // you can even use utf-8 symbols!
      .addChild(nga.menu(admin.getEntity('comments')).icon('<strong style="font-size:1.3em;line-height:1em">✉</strong>'))
      .addChild(nga.menu(admin.getEntity('tags')).icon('<span class="glyphicon glyphicon-tags"></span>'))
      .addChild(nga.menu().title('Other')
          .addChild(nga.menu().title('Stats').icon('').link('/stats'))
      )

}
