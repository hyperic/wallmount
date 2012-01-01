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

/**
 * Class to store static constants used throughout wallmount.
 */
class StatUtil {

    /**
     * Structure which defines parameters for system metrics.
     */
    static final def sysMetricMap = [
        [id: "/system/sysloadavg", name: "System Load Average", childs:[
                [name: "System Load 1min", scope: "system/sysloadavg/", track: "loadAvg1"],
                [name: "System Load 5min", scope: "system/sysloadavg/", track: "loadAvg5"],
                [name: "System Load 15min", scope: "system/sysloadavg/", track: "loadAvg15"]
            ]
        ],
        [id: "/system/syscpu", name: "System CPU", childs:[
                [name: "System CPU User", scope: "system/syscpu/", track: "sysUserCpu", format: "percent"],
                [name: "System CPU System", scope: "system/syscpu/", track: "sysSysCpu", format: "percent"],
                [name: "System CPU Nice", scope: "system/syscpu/", track: "sysNiceCpu", format: "percent"],
                [name: "System CPU Idle", scope: "system/syscpu/", track: "sysIdleCpu", format: "percent"],
                [name: "System CPU Wait", scope: "system/syscpu/", track: "sysWaitCpu", format: "percent"]
            ]
        ],
        [id: "/system/hq", name: "Hyperic Stats", childs:[
                [name: "HQ Num of Platforms", scope: "system/hq/", track: "numPlatforms"],
                [name: "HQ Num of Cpus", scope: "system/hq/", track: "numCpus"],
                [name: "HQ Num of Agents", scope: "system/hq/", track: "numAgents"],
                [name: "HQ Num of Active Agents", scope: "system/hq/", track: "numActiveAgents"],
                [name: "HQ Num of Servers", scope: "system/hq/", track: "numServers"],
                [name: "HQ Num of Services", scope: "system/hq/", track: "numServices"],
                [name: "HQ Num of Applications", scope: "system/hq/", track: "numApplications"],
                [name: "HQ Num of Roles", scope: "system/hq/", track: "numRoles"],
                [name: "HQ Num of Users", scope: "system/hq/", track: "numUsers"],
                [name: "HQ Num of Alert Definitions", scope: "system/hq/", track: "numAlertDefs"],
                [name: "HQ Num of Resources", scope: "system/hq/", track: "numResources"],
                [name: "HQ Num of Resource Types", scope: "system/hq/", track: "numResourceTypes"],
                [name: "HQ Num of Groups", scope: "system/hq/", track: "numGroups"],
                [name: "HQ Num of Escalations", scope: "system/hq/", track: "numEsc"],
                [name: "HQ Num of Active Escalations", scope: "system/hq/", track: "numActiveEsc"],
                [name: "HQ Metrics Received Per Minute", scope: "system/hq/", track: "metricsPerMinute"]
            ]
        ],
        [id: "/system/sysmem", name: "System Memory", childs:[
                [name: "System Total Memory", scope: "system/sysmem/", track: "totalMem", format: "B"],
                [name: "System Used Memory", scope: "system/sysmem/", track: "usedMem", format: "B"],
                [name: "System Free Memory", scope: "system/sysmem/", track: "freeMem", format: "B"]
            ]
        ],
        [id: "/system/sysswap", name: "System Swap", childs:[
                [name: "System Total Swap", scope: "system/sysswap/", track: "totalSwap", format: "B"],
                [name: "System Used Swap", scope: "system/sysswap/", track: "usedSwap", format: "B"],
                [name: "System Free Swap", scope: "system/sysswap/", track: "freeSwap", format: "B"]
            ]
        ],
        [id: "/system/proc", name: "System Process Stats", childs:[
                [name: "System Process Open FDs", scope: "system/proc/", track: "procOpenFds"],
                [name: "System Process Mem Size", scope: "system/proc/", track: "procMemSize", format: "B"],
                [name: "System Process Mem Resident", scope: "system/proc/", track: "procMemRes", format: "B"],
                [name: "System Process Shared", scope: "system/proc/", track: "procMemShare", format: "B"]
            ]
        ],
        [id: "/system/jvm", name: "JVM Stats", childs:[
                [name: "JVM Total Memory", scope: "system/jvm/", track: "jvmTotalMem", format: "B"],
                [name: "JVM Free Memory", scope: "system/jvm/", track: "jvmFreeMem", format: "B"],
                [name: "JVM Max Memory", scope: "system/jvm/", track: "jvmMaxMem", format: "B"]
            ]
        ]
    ]

    /**
     * Defaults for hyperic.widget.label.Label widget.
     */
    static final def defsLabel = [
        width:100, height: 50, color: "green", 
        titlePosition: "top", ranges:[],
        type: "hyperic.widget.label.Label"
    ]
    
        
}