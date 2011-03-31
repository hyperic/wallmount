<html>

  <head>
    <meta http-equiv="content-script-type" content="text/javascript">
    <title>Wallmount Player - ${useLayout}</title>

    <link rel="stylesheet" type="text/css"
          href="../public/js/hyperic/wallmount/resources/PlayerCombined.css" />
      
    <script type="text/javascript"
            src="../public/js/dojo/dojo.js"
            djConfig="parseOnLoad: true, isDebug: false, locale: 'en'"
            gfxRenderer: 'canvas'></script>
          
    <script type="text/javascript"
            src="../public/js/dojo/wmvisualizer.js"></script>
            
    <script type="text/javascript">
      
      dojo.addOnLoad(function(){
        hyperic.wallmount.base.metricStore = new hyperic.data.MetricStore(
            {url: "/hqu/wmvisualizer/metricstore/getMetrics.hqu",
             idToBaseUrl: false}
        );
        
        hyperic.wallmount.base.metricStore.sync(true);
        
        var url = "/hqu/wmvisualizer/wallmount/getLayout.hqu?layout=${useLayout}";
        hyperic.wallmount.Player.loadLayout(url,true);
      }); 
      
    </script>
        
  </head>

  
  <body class="claro">
  
    <div id="wallmountpane"></div>
  
  </body>

</html>