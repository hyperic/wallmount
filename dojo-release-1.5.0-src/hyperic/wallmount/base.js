/**
 * NOTE: This copyright does *not* cover user programs that use HQ
 * program services by normal system calls through the application
 * program interfaces provided as part of the Hyperic Plug-in Development
 * Kit or the Hyperic Client Development Kit - this is merely considered
 * normal use of the program, and does *not* fall under the heading of
 *  "derived work".
 *
 *  Copyright (C) [2011], VMware, Inc.
 *  This file is part of HQ.
 *
 *  HQ is free software; you can redistribute it and/or modify
 *  it under the terms version 2 of the GNU General Public License as
 *  published by the Free Software Foundation. This program is distributed
 *  in the hope that it will be useful, but WITHOUT ANY WARRANTY; without
 *  even the implied warranty of MERCHANTABILITY or FITNESS FOR A
 *  PARTICULAR PURPOSE. See the GNU General Public License for more
 *  details.
 *
 *  You should have received a copy of the GNU General Public License
 *  along with this program; if not, write to the Free Software
 *  Foundation, Inc., 59 Temple Place, Suite 330, Boston, MA 02111-1307
 *  USA.
 *
 */

dojo.provide("hyperic.wallmount.base");

hyperic.wallmount.base.metricStore = null;
dojo.require("dijit.dijit");
dojo.require("dijit.Menu");
dojo.require("dijit.MenuItem");
dojo.require("dijit.PopupMenuItem");
dojo.require("dijit.MenuBar");
dojo.require("dijit.MenuBarItem");
dojo.require("dijit.PopupMenuBarItem");
dojo.require("dijit.MenuSeparator");
dojo.require("dijit.ColorPalette");
dojo.require("hyperic.data.ResourceTree"); 
dojo.require("hyperic.layout.MoveablePane");
dojo.require("hyperic.data.TreeDndSource");
dojo.require("hyperic.dnd.Source");
dojo.require("hyperic.dnd.SingleSource");
dojo.require("hyperic.layout.PropertiesPane");
dojo.require("dijit.Tree");
dojo.require("dijit.tree.TreeStoreModel");
dojo.require("dijit.tree.dndSource");
dojo.require("dijit.layout.AccordionContainer");
dojo.require("dojox.layout.ExpandoPane");
dojo.require("dijit.layout.ContentPane");
dojo.require("dojox.layout.FloatingPane");
dojo.require("dijit.layout.SplitContainer");
dojo.require("dijit.layout.BorderContainer");
dojo.require("dojo.dnd.move");
dojo.require("dojo.dnd.Source");
dojo.require("dojo.data.ItemFileWriteStore");
dojo.require("dojox.data.JsonRestStore");
dojo.require("dijit.InlineEditBox");
dojo.require("dijit.ProgressBar");
dojo.require("dijit.Calendar");
dojo.require("dojox.form.Manager");
dojo.require("dijit.form.Button");
dojo.require("dijit.form.NumberSpinner");
dojo.require("hyperic.wallmount.Registry");
dojo.require("dojo.parser");

