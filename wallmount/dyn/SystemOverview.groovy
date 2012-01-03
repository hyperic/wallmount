// This template creates a system overview similar to HQ Health view
def b = new JsonGroovyBuilder()
def l = b{

    name = 'SystemOverview'
    theme = 'Basic'
    util.addSize(b,800,600)

    // table window with 1min, 5min and 15 spinners.
    // JVM free memory, System used swap and System
    // free memory as ellipse label
    items(){
        title = 'HQ Server'
        util.addDimensions(b,10,10,300,400)
        type = 'table'

        // 3 rows, 2 columns
        def _cells = []
        
        // row 1
        def _row1 = []
        _row1 << [items: [c.getWidget([widget:'hyperic.widget.Spinner'] + api.getSystemMetrics([category:"system_sysloadavg", name:"1min"]).first())]]
        _row1 << [items: [c.getWidget([widget:'hyperic.widget.EllipseLabel'] + api.getSystemMetrics([category:"system_jvm", name:"Free"]).first())]]        
        _cells << _row1

        // row 2
        def _row2 = []
        _row2 << [items: [c.getWidget([widget:'hyperic.widget.Spinner'] + api.getSystemMetrics([category:"system_sysloadavg", name:"5min"]).first())]]
        _row2 << [items: [c.getWidget([widget:'hyperic.widget.EllipseLabel'] + api.getSystemMetrics([category:"system_sysswap", name:"Used"]).first())]]        
        _cells << _row2

        // row 3
        def _row3 = []
        _row3 << [items: [c.getWidget([widget:'hyperic.widget.Spinner'] + api.getSystemMetrics([category:"system_sysloadavg", name:"15min"]).first())]]
        _row3 << [items: [c.getWidget([widget:'hyperic.widget.EllipseLabel'] + api.getSystemMetrics([category:"system_sysmem", name:"Free"]).first())]]        
        _cells << _row3

        table() {
            cells = _cells
        }        
    }
        
}
l
