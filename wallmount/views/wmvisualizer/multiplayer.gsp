<html>

  <head>
    <meta http-equiv="content-script-type" content="text/javascript">
    <title>Wallmount Player - ${useLayout}</title>

    <link rel="stylesheet" type="text/css" title="Basic"
          href="../public/js/hyperic/wallmount/resources/PlayerCombined.css" />

    <link rel="alternate stylesheet" type="text/css" title="Night"
          href="../public/js/hyperic/wallmount/resources/PlayerCombinedNight.css" />

    <link rel="alternate stylesheet" type="text/css" title="Matrix"
          href="../public/js/hyperic/wallmount/resources/PlayerCombinedMatrix.css" />
      
    <script type="text/javascript"
            src="../public/js/dojo/dojo.js"
            djConfig="parseOnLoad: true, isDebug: false, locale: 'en'"
            gfxRenderer: 'canvas'></script>
          
    <script type="text/javascript">
      
      dojo.addOnLoad(function(){
        hyperic.wallmount.base.metricStore = new hyperic.data.MetricStore(
            {url: "/hqu/wmvisualizer/metricstore/getMetrics.hqu",
             idToBaseUrl: false}
        );
        
        hyperic.wallmount.base.metricStore.sync(true);
        
        var urls = [];
        <% for (l in layouts) { %>
        urls.push("/hqu/wmvisualizer/wmvisualizer/getLayout.hqu?layout=${l}");
        <% } %>
        
        var url = "/hqu/wmvisualizer/wmvisualizer/getMultiLayout.hqu?layout=${useLayout}";
        hyperic.wallmount.Player.loadLayouts(urls,true);
      }); 
      
    </script>
        
  </head>

  
  <body class="claro">
    <div dojoType="dojox.widget.AutoRotator"
         id="rotatorpane"
         jsId="rotator"
         autoStart="true"
         style="z-index:50;width:${width};height:${height};overflow:hidden;"
         duration="${duration}"
         transition="${transition}">

        <% for (i=0;i<layouts.size();i++) { %>
        <div id="wallmountpane${i}" style="position:absolute;"></div>
        <% } %>
    </div>    
  </body>

</html>