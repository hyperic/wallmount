<html>

  <head>
    <meta http-equiv="content-script-type" content="text/javascript">
    <title>Wallmount Player - ${useLayout}</title>
    <style type="text/css">
      @import "../public/js/dijit/themes/claro/claro.css";
      @import "../public/js/dojo/resources/dojo.css";
      @import "../public/js/dojox/layout/resources/ExpandoPane.css";
      @import "../public/js/dojox/layout/resources/ResizeHandle.css"; 
      @import "../public/js/dojox/layout/resources/FloatingPane.css";
      @import "../public/js/hyperic/data/resources/hypericicons.css";
      @import "../public/css/player.css";
    </style>
  
    <script type="text/javascript"
            src="../public/js/dojo/dojo.js"
            djConfig="parseOnLoad: true, isDebug: true"
            gfxRenderer: 'canvas'></script>
          
    <script type="text/javascript">
      dojo.require("hyperic.wallmount.base");
      dojo.require("hyperic.wallmount.Player");
      dojo.require("hyperic.data.MetricStore");
      
      function init(){
        hyperic.wallmount.base.metricStore = new hyperic.data.MetricStore(
            {url: "/hqu/wallmount/metricstore/getMetrics.hqu",
             idToBaseUrl: false}
        );
        
        hyperic.wallmount.base.metricStore.sync(true);
        
        var url = "/hqu/wallmount/wallmount/getLayout.hqu?layout=${useLayout}";
        hyperic.wallmount.Player.loadLayout(url,true);
                
      }

      dojo.addOnLoad(init);
    </script>
        
  </head>

  
  <body class="claro">
  
    <div id="wallmountpane"></div>
  
  </body>

</html>