// This template creates a system overview similar to HQ Health view
def b = new JsonGroovyBuilder()
def l = b{

    def labelPrefs1 = [width:180, height: 80]
    def labelPrefs2 = [width:130, height: 80]

    name = 'SystemOverview'
    theme = 'Basic'
    util.addSize(b,800,600)

    // table window with 1min, 5min and 15 spinners.
    // JVM free memory, System used swap and System
    // free memory as ellipse label
    items(){
        title = "HQ Server"
        util.addDimensions(b,10,10,300,400)
        type = 'table'

        // 3 rows, 2 columns
        def _cells = []

        def sNames = [
            ["system_sysloadavg","1min","system_jvm","Free"],
            ["system_sysloadavg","5min","system_sysswap","Used"],
            ["system_sysloadavg","15min","system_sysmem","Free"]
        ]
        
        sNames.each{
            def row = []
            row << [items: [c.getWidget([widget:'hyperic.widget.Spinner'] + api.getSystemMetrics([category:it.getAt(0), name:it.getAt(1)]).first())]]
            row << [items: [c.getWidget([widget:'hyperic.widget.EllipseLabel'] + api.getSystemMetrics([category:it.getAt(2), name:it.getAt(3)]).first())]]
            _cells << row
        }

        table() {
            cells = _cells
        }        
    }

    // window with num of platforms, servers, services
    // and active escalations
    items(){
        title = "System Base Numbers"
        util.addDimensions(b,10,420,300,300)
        type = 'multi'

        def sNames = [
            ["system_hq","Platforms"],
            ["system_hq","Servers"],
            ["system_hq","Services"],
            ["system_hq","Active Escalations"]
        ]

        sNames.each{ i ->
            items() {

                def w = c.getWidget([widget:'hyperic.widget.label.Label'] +
                        labelPrefs2 +
                        api.getSystemMetrics([category:i.getAt(0), name:i.getAt(1)]).first())

                w.title = w.title.replaceAll("HQ Num of ","")

                util.addObject(b, w)
                
            }
        }

    }

    // window with num of agents and
    // active agents
    items(){
        title = "Agents Overview"
        util.addDimensions(b,800,10,200,400)
        type = 'multi'

        def sNames = [
            ["system_hq","of Agents"],
            ["system_hq","of Active Agents"]
        ]

        sNames.each{ i ->
            items() {

                def w = c.getWidget([widget:'hyperic.widget.label.Label'] +
                        labelPrefs1 +
                        api.getSystemMetrics([category:i.getAt(0), name:i.getAt(1)]).first())

                w.title = w.title.replaceAll("HQ Num of ","")

                util.addObject(b, w)
            }
        }
    }

    // platforms overview
    items(){
        title = "Platforms Overview"
        util.addDimensions(b,350,420,650,300)
        type = 'multi'

        items = []
        api.getPlatformPrototypes([viewable:true]).each{ r ->
            items() {
                util.addObject(b, c.getWidget([widget:'hyperic.widget.AvailIcon'] + r + [size:100]))
            }
        }

    }

    // arrow

    items(){
        title = ""
        util.addDimensions(b,310,100,400,100)
        type = 'single'

    def sNames = [
            ["system_hq","Metrics Received"]
        ]

        def arrowPrefs = [reverse:true, width:485, height:65, arrowCount:4, maxRange:2000]

        sNames.each{ i ->
            items() {
                util.addObject(b,
                    c.getWidget([widget:'hyperic.widget.HorizontalArrowPipe'] +
                        arrowPrefs +
                        api.getSystemMetrics([category:i.getAt(0), name:i.getAt(1)]).first()
                    )
                )
            }
        }
    }


        
}
l
