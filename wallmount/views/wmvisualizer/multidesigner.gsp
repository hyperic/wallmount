<html>

  <head>
    <title>Wallmount Multi Designer</title>
    
    <link rel="stylesheet" type="text/css" title="Basic"
          href="../public/js/hyperic/wallmount/resources/MultiDesignerCombined.css" />
      
    <script type="text/javascript"
            src="../public/js/dojo/dojo.js"
            djConfig="parseOnLoad: true, isDebug: false, locale: 'en'",
            gfxRenderer: 'canvas'></script>
          
    <script type="text/javascript">

      dojo.addOnLoad(function(){
          dojo.subscribe("/hyperic/layout/new", function(data){
              var url = "/hqu/wmvisualizer/wmvisualizer/getMultiLayoutCombi.hqu?layout=" + data[0];
              hyperic.wallmount.MultiDesigner.loadLayout(url);
          });
          
          <% for (l in layouts) { %>
              srclayouts.insertNodes(false, ['${l}']);         
          <% } %>
      }); 
                    
    </script>
    
  </head>

  <body class="claro">

    <div dojoType="dojox.widget.Toaster" id="toastMessenger" 
         positionDirection="br-up" duration="3000" 
         messageTopic="userMessageTopic"></div>   

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
                 onClick="hyperic.wallmount.LayoutUtil.selectMultiLayoutDialog();">Open...</div>
            <div dojoType="dijit.MenuItem"
                 id="fileMenuSave"
                 onClick="hyperic.wallmount.LayoutUtil.saveCurrentMultiLayout();">Save</div>
            <div dojoType="dijit.MenuItem"
                 id="fileMenuSaveAs"
                 onClick="hyperic.wallmount.LayoutUtil.saveMultiLayoutDialog();">Save As...</div>
          </div>
        </div>
        <div class="dijitmenuitem dijitinline">|</div>
        <div dojoType="hyperic.layout.MultiLayoutName" id="layoutName"></div>
      </div>
            
      <div dojoType="dijit.layout.ContentPane"
           region="center"
           splitter="false">
         <div id="wallmountpane">
         
           <div>
             <label for="duration">Duration:</label>
             <select dojoType="dijit.form.Select" 
                   id="duration"
                   dojoAttachPoint="duration"
                   class="textbox">
                   <option value="5000">5 seconds</option>
                   <option value="10000">10 seconds</option>
                   <option value="20000">20 seconds</option>
                   <option value="30000">30 seconds</option>
                   <option value="60000">1 minute</option>
                   <option value="120000">2 minutes</option>
             </select>

             <label for="transition">Transition:</label>
             <select dojoType="dijit.form.Select" 
                   id="transition"
                   dojoAttachPoint="transition"
                   class="textbox">
                   <option value="swap">Swap</option>
                   <option value="fade">Fade</option>
                   <option value="crossFade">Cross Fade</option>
                   <option value="pan">Pan</option>
                   <option value="panDown">Pan Down</option>
                   <option value="panRight">Pan Right</option>
                   <option value="panUp">Pan Up</option>
                   <option value="panLeft">Pan Left</option>
                   <option value="slideDown">Slide Down</option>
                   <option value="slideRight">Slide Right</option>
                   <option value="slideUp">Slide Up</option>
                   <option value="slideLeft">Slide Left</option>
             </select>

           </div>
         
           <div>
             <div style="float: left; margin: 5px;">
               <h3>Layout sources</h3>
               <div dojoType="hyperic.dnd.MoveOnlySource" jsId="srclayouts" class="container"></div>
             </div>

             <div style="float: left; margin: 5px;">
               <h3>Layout targets</h3>
               <div dojoType="hyperic.dnd.MoveOnlySource" jsId="targetlayouts" class="container"></div>
             </div>
           </div>
         
         </div>
      </div>
      
    </div>

  </body>

</html>