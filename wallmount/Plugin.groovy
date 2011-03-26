import org.hyperic.hq.hqu.rendit.HQUPlugin

import WallmountController
import ImageController

class Plugin extends HQUPlugin {
	Plugin() {
        addMastheadView(true, '/wallmount/index.hqu', 'Wall Mount Visualizer', 'tracker')
    }         
}

