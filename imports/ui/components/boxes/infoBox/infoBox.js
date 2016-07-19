import './infoBox.html'
import './infoBox.css'
import { Template } from 'meteor/templating'

import './nodeInfo/nodeInfo.js'
import './edgeInfo/edgeInfo.js'
import '../../boxes/commentBox/commentBox.js'
import '../../boxes/nodeMerge/nodeMerge.js'
import './nodeNeighborhood/nodeNeighborhood.js'

import { $ } from 'meteor/jquery'

import { Session } from 'meteor/session';
import { Nodes, Edges } from '../../../../api/collections.js'

Template.infoBox.rendered = function() {
  $("#infoBox").hide()
}

Template.infoBox.helpers({
  networkInstance : function(){
    return Template.instance().data.network
  },
  isNode  : function() {
    return Session.get( 'currentType' ) == "node"
  },
  currentSelection: function() {
      var item = getCurrentSelection()
      return item
  },
  hasNeighbors: function() {
    let network = Template.instance().data.network.get()
    let node = getCurrentSelection()
    if(node.data) return network.nodes().filter("[id='"+node.data.id+"']").neighborhood().length
  },
  target : function() {
    var network = Template.instance().data.network.get()
    if( Session.get( 'currentId' ) && Session.get( 'currentType' ) && Session.get('pathTargetNodeId') ){
      var targetNode = network.nodes().filter("[id='"+Session.get('pathTargetNodeId')+"']")
      return targetNode.data()
    }
  },
  pathToTarget: function() {
    var network = Template.instance().data.network.get()
    if( Session.get( 'currentId' ) && Session.get( 'currentType' ) && Session.get('pathTargetNodeId') ){
      var sourceNode = network.nodes().filter("[id='"+Session.get('currentId')+"']")
      var targetNode = network.nodes().filter("[id='"+Session.get('pathTargetNodeId')+"']")
      var path = network.elements().dijkstra(sourceNode).pathTo(targetNode)
      return path.nodes().map(function(d){ return d.data() })
    }
  }
})

Template.infoBox.events = {
    'click #closeInfoBox': function( ) {
        var network = Template.instance().data.network.get()
        network.deselectAll()
    },
    'click #toggle-node-neighborhood': function( ) {
        $('#node-neighborhood').toggle()
    },
    'click #toggle-commentBox': function( ) {
        $("#commentBox").toggle()
    },
    'click #toggle-targetSearch': function( ) {
        $("#targetSearch").toggle()
    },

}

// get current node
var getCurrentSelection = function() {
  var id = Session.get( 'currentId' ),
      type = Session.get( 'currentType' ),
      item = {}
  if(id && type) {
    if ( type == 'node' ) {
        item = Nodes.findOne( id )
    } else if ( type == 'edge' ) {
        item = Edges.findOne( id )
    }
  }
  return item
}
