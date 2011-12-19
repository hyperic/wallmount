<%= hquStylesheets() %>

<style type="text/css">
.tableTitleWrapper {
  width: 140px;
}
</style>

<div>

  <div style="width: 410px; margin-left:0px; margin-right:10px;margin-top:10px;float:left;display:block;overflow-x: hidden; overflow-y: auto;">

    <div><%= linkTo('Launch Designer',[action:'designer']) %></div>
    <div id="Layouts_SingleData">
      <%= dojoTable(id:'singledatatable', title:'Single Layouts',
                    refresh:60, url:urlFor(action:'getSingleTemplates'),
                    schema:singleLayoutsSchema, numRows:15) %>
    </div>
  </div>

  <div style="width: 410px; margin-left:10px; margin-right:0px;margin-top:10px;float:left;display:block;overflow-x: hidden; overflow-y: auto;">

    <div><%= linkTo('Launch Multi Layout Designer',[action:'multidesigner']) %></div>
    <div id="Layouts_MultiData">
      <%= dojoTable(id:'multidatatable', title:'Multi Layouts',
                    refresh:60, url:urlFor(action:'getMultiTemplates'),
                    schema:multiLayoutsSchema, numRows:15) %>
    </div>
  </div>

</div>
