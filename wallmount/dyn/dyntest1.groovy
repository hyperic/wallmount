// layout setup
name = 'dyntest1'
theme = 'Basic'      
util.addSize(b,800,600)

// windows
items(){
    title = 'All Platforms'
    util.addDimensions(b,10,10,150,200)
    // some kind of helper to resize, position windows  
    type = 'multi'
    
    api.findPlatforms().each{ v ->
        // components in a window
        items(){
            util.addAvailIcon(b,v)       
        }
    }
    api.findPlatforms().each{ v ->
        // components in a window
        items(){
            util.addAvailIcon(b,v)       
        }
    }
}
items(){
    title = 'All Platforms'
    util.addDimensions(b,170,10,150,200)
    // some kind of helper to resize, position windows
    type = 'multi'
    
    api.findPlatforms().each{ v ->
        // components in a window
        items(){
            util.addAvailIcon(b,v)
        }
    }
    api.findPlatforms().each{ v ->
        // components in a window
        items(){
            util.addAvailIcon(b,v)
        }
    }
}
