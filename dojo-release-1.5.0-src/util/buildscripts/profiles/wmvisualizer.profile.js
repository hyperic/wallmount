dependencies = {
    layers: [
        {
            name: "dojo.js",
            dependencies: [
                "hyperic.wallmount.base",
                "hyperic.wallmount.Designer",
                "hyperic.wallmount.MultiDesigner",
                "hyperic.wallmount.Player",
                "hyperic.wallmount.MultiPlayer",
                "hyperic.widget.base"
            ]
        }
    ],

    prefixes: [
        [ "dijit", "../dijit" ],
        [ "dojox", "../dojox" ],
        [ "hyperic", "../hyperic" ]
    ]
}
