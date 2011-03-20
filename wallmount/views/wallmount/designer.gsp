<html>

  <head>
    <title>Wallmount Dashboard Designer</title>
    <style type="text/css">    
      @import "../public/js/dijit/themes/claro/claro.css";
      @import "../public/js/dojo/resources/dojo.css";
      @import "../public/js/dojox/grid/resources/Grid.css";
      @import "../public/js/dojox/grid/resources/tundraGrid.css";
      @import "../public/js/dojox/layout/resources/ExpandoPane.css";
      @import "../public/js/dojox/layout/resources/ResizeHandle.css"; 
      @import "../public/js/dojox/layout/resources/FloatingPane.css";
      @import "../public/js/dojox/widget/Toaster/Toaster.css";
      @import "../public/js/hyperic/layout/resources/MoveablePane.css";
      @import "../public/js/hyperic/data/resources/hypericicons.css";
      @import "../public/css/designer.css";
    </style>
  
    <script type="text/javascript"
            src="../public/js/dojo/dojo.js"
            djConfig="parseOnLoad: true, isDebug: true, locale: 'en'",
            gfxRenderer: 'canvas'></script>
          
    <script type="text/javascript">
      dojo.require("hyperic.wallmount.base");
      dojo.require("hyperic.wallmount.Designer");
      dojo.require("hyperic.wallmount.Registry");
      
      function init(){
          dojo.subscribe("/hyperic/layout/new", function(data){
              console.log("i got", data);
              var url = "/hqu/wallmount/wallmount/getLayout.hqu?layout=" + data[0];
              hyperic.wallmount.Designer.loadLayout(url);
          });
      }    
      dojo.addOnLoad(init);      
    </script>
    
  </head>

  <body class="claro">
  
    <div dojoType="dojox.widget.Toaster" id="toastMessenger" 
         positionDirection="br-up" duration="3000" 
         messageTopic="userMessageTopic"></div>   
  
  
    <div dojoType="hyperic.wallmount.Registry"
         id="registry"
         jsId="hyperic.wallmount.Registry._registry"
         plugins="[
             {plugin: 'hyperic.widget.Tank', attach:[{type:'metric'}], properties:{width:100,height:150}},
             {plugin: 'hyperic.widget.ProgressTube', attach:[{type:'metric'}], properties:{width:200,height:100}},
             {plugin: 'hyperic.widget.EllipseLabel', attach:[{type:'metric'}], properties:{size:160}},
             {plugin: 'hyperic.widget.HorizontalArrowPipe', attach:[{type:'metric'}], properties:{width:150,height:60}},
             {plugin: 'hyperic.widget.VerticalArrowPipe', attach:[{type:'metric'}], properties:{width:60,height:150}},
             {plugin: 'hyperic.widget.Spinner', attach:[{type:'metric'}], defaults:[{type:'metric', filter:'name', include:'Load Average 5 Minutes'}], properties:{size:120}},
             {plugin: 'hyperic.widget.AvailText', attach:[{type:'resourcetype'}], defaults:[{type:'metric', filter:'name', include:'availability'}], properties:{size:90}},
             {plugin: 'hyperic.widget.AvailIcon', attach:[{type:'resourcetype'}], defaults:[{type:'resourcetype', filter:'eid', include:'*'}], properties:{size:80}},
             {plugin: 'hyperic.widget.label.Label', attach:[{type:'metric'},{type:'resourcetype'}], properties:{width:200,height:80}},
             {plugin: 'hyperic.widget.chart.Chart', attach:[{type:'metric'}], properties:{width:200,height:120}}
         ]"></div>
    <div id="main"
         dojoType="dijit.layout.BorderContainer"
         liveSplitters="true"
         design="sidebar">
      <div id="header"
           dojoType="dijit.MenuBar"
           region="top">
           
        <div dojoType="dijit.PopupMenuBarItem"
             id="file">
          <span>File</span>
          <div dojoType="dijit.Menu" id="fileMenu">
            <div dojoType="dijit.MenuItem"
                 id="fileMenuOpen" 
                 onClick="hyperic.wallmount.LayoutUtil.selectLayoutDialog();">Open...</div>
            <div dojoType="dijit.MenuItem"
                 id="fileMenuSave"
                 onClick="hyperic.wallmount.LayoutUtil.saveCurrentLayout();">Save</div>
            <div dojoType="dijit.MenuItem"
                 id="fileMenuSaveAs"
                 onClick="hyperic.wallmount.LayoutUtil.saveLayoutDialog();">Save As...</div>
          </div>
        </div>
        <div dojoType="dijit.PopupMenuBarItem" id="window">
          <span>Window</span>
          <div dojoType="dijit.Menu" id="windowMenu">
            <div dojoType="dijit.MenuItem"
                 id="newWindow"
                 onClick="hyperic.wallmount.WindowUtil.newEmptyWindow();">New Window</div>
            <div dojoType="dijit.MenuItem"
                 id="newWindow2"
                 onClick="hyperic.wallmount.WindowUtil.newSingleItemFloater();">New Single Floater</div>
          </div>
        </div>
        <div dojoType="dijit.PopupMenuBarItem" id="settings">
          <span>Settings</span>
          <div dojoType="dijit.Menu" id="settingsMenu">
            <div dojoType="dijit.MenuItem"
                 id="settingsDashboardSize"
                 onClick="hyperic.wallmount.LayoutUtil.dashboardSizeDialog();">Dashboard Size...</div>
            <div dojoType="dijit.MenuItem"
                 id="settingsTest"
                 onClick="hyperic.wallmount.WindowUtil.newLayoutTestWindow();">Test this configuration</div>
          </div>
        </div>        
        <div class="dijitmenuitem dijitinline">|</div>
        <div dojoType="hyperic.layout.LayoutName" id="layoutName"></div>
      </div>
            
      <div dojoType="dojox.layout.ExpandoPane" 
           splitter="true" 
           title="Toolbar" 
           region="right" 
           id="rightPane" 
           maxWidth="375" 
           style="width:375px" 
           easeIn="dojo.fx.easing.backOut" 
           easeOut="dojo.fx.easing.backInOut">
                
        <div dojoType="dijit.layout.SplitContainer"
             orientation="vertical"
             sizerWidth="5"
             activeSizing="true"
             style="border: 1px solid #bfbfbf; float: left; ">
             
          <div dojoType="dijit.layout.AccordionContainer"
               id="rightAccordion"
               style="height:300px;"
               attachParent="true">
               
            <div dojoType="dojox.data.JsonRestStore" 
                 jsId="metricStore" 
                 target="/hqu/wallmount/resourcetree/resourcetree.hqu?path=/platform"
                 allowNoTrailingSlash="true" 
                 labelAttribute="name"></div>
               
            <div dojoType="dijit.layout.ContentPane"
                 title="Metrics & Resources">
                   
              <div dojoType="dijit.tree.ForestStoreModel" 
                   jsId="metricModel"
                   store="metricStore"
                   query="{}"
                   deferItemLoadingUntilExpand="true"
                   childrenAttrs="children"></div>
              <div dojoType="hyperic.data.ResourceTree"
                   id="metricTree"
                   dndController="hyperic.data.TreeDndSource"
                   label="Platforms"
                   persist="false"
                   deferItemLoadingUntilExpand="true" 
                   model="metricModel" 
                   labelAttr="name"></div>

              
            </div>
            
          </div>

          <div dojoType="dijit.layout.AccordionContainer"
               id="rightAccordion2" 
               style="height:200px;"
               attachParent="true">
            <div dojoType="hyperic.layout.PropertiesPane" 
                 style="height:300px;"
                 attachParent="true"
                 widgetsInTemplate="true"
                 title="Properties"></div>
          </div>
        
        </div>
        
      </div>
      
      <div dojoType="dijit.layout.ContentPane"
           region="center"
           splitter="false">
         <div id="wallmountpane"></div>
      </div>
      
    </div>
  

  </body>

</html>