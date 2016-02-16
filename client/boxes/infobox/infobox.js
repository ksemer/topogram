Template.infobox.rendered = function() {
  $("#infoBox").css('visibility', 'hidden');
};

Template.infobox.helpers( {
    comments: function() {
        var type = Session.get( 'currentType' ) || 'node',
            id = Session.get( 'currentId' ) || 'node-000';
        var comments = Comments.find( {
            'id': id,
            'type': type
        } ).fetch();
        return comments
    },

    currentSelection: function() {
        var item = getCurrentSelection();
        return item.data;
    },
    currentNeighborhood: function() {
      var network = Template.instance().view.parentView._templateInstance.network.get();
      if(Session.get( 'currentId' ) && Session.get( 'currentType' )) {
        var selected = getCurrentSelection();
        var neighborhood = network.nodes().filter("[id='"+selected.data.id+"']").neighborhood()
        console.log(neighborhood);
        return neighborhood.nodes().map(function(d){ return d.data() });
      }
      else return
    }
} )

Template.infobox.events = {
    'click #closeInfoBox': function( event, template ) {
        var network = template.view.parentView._templateInstance.network.get()
        network.unFocus();
        $( "#infoBox" ).css( 'visibility', 'hidden' );
    }
};
