/////////////////////////////////////////////////
var user_manager = {
  // Classes
  Collections: {},
  Models: {},
  Views: {},
  // Instances
  collections: {},
  models: {},
  views: {},
  eventAggregator : global.eventAggregator,
  init: function (json) {
    this.views.main = new this.Views.Main({
      el : json.el,
      users : global.collections.Users,
      mode    : json.mode,
      organization : json.organization
    });
    this.views.main.render()
  }
};
/////////////////////////////////////////////////
// MAIN
/////////////////////////////////////////////////
user_manager.Views.Main = Backbone.View.extend({
    initialize : function(json) {
        _.bindAll(this, 'render');
        ////////////////////////////
        this.users = json.users;
        this.mode = json.mode;
        this.organization = json.organization;
        this.infos = {
          "init" : "Search for a person in CreaKtive by name or email address, or enter an email address to invite someone new.",
          "email" : "? We don’t know that person. Add a name and click “Send” and we’ll add a virtual member and send them an invite email. They'll automatically receive access to the board once they sign up and confirm their email address.",
          "noResult" : "No results"
        };
      this.membersgroup= {
        "init" : "Members"
      };
        // Templates
        this.template = JST["user_manager_template"];
      },

      events : {
        "keyup .search_members" : "search",
        "click .displaygroup" : "displaygroup",
        "click .addToGroup" : "addToGroup",
        "click .delFromGroup" : "delFromGroup"
      },

  addToGroup : function(e){
    e.preventDefault();
    var _this = this;
    var user_id_ = e.target.getAttribute('data-id-user');
    var org_users = this.organization.get('users') || [];
    var already_exist = _.findWhere(org_users, {id : user_id_});
    if(already_exist == undefined){
      org_users.push(user_id_);
      this.organization.save({
        users : org_users
      }, {
        success : function(){
         // _this.render();
          $(_this.el).foundation('reveal', 'close');
        }
      });
    }else{
      swal("Oups!", "User already in group !", "warning");
    }

  },

  delFromGroup : function(e){
    e.preventDefault();
    var user_id_ = e.target.getAttribute('data-id-user');
    //Pas cette daube : reprendre le meme principe que pour l'ajout ;-)
    this.user.remove({ id : user_id_ });
    this.render();
  },

    search: function(e){
        e.preventDefault();
        var el_result = $('#user_manager_search_result');
        var el_info = $('#user_manager_search_info');
        el_result.html('');
        el_info.html('');
        var research = e.target.value;
        var research_size = research.length;
        var matched = new Backbone.Collection();
        this.users.each(function(c){
          if(research_size>0){
            if(research.toLowerCase() == c.get('username').substr(0,research_size).toLowerCase() ||
                research.toLowerCase() == c.get('email').substr(0,research_size).toLowerCase()){
                matched.add(c);
                el_result.append("<tr><td><img width='30' title='"+c.get('username')+"' src='"+c.get('avatar')+"'></td><td>"+c.get('username')+"</td><td><a data-id-user='"+c.get('id')+"' href='#' class='button tiny radius success addToGroup' style='margin:0px'><b data-id-user='"+c.get('id')+"'>+</b></a></td></tr>")
            }
          }
        });
        if(matched.length == 0){
          if(api.isValidEmailAddress(research)) el_info.html("<b>"+research+"</b>"+this.infos.email+"<br><a href='#' class='button invite small expand radius success'>Send <img title='Send email' src='/images/icones/Sent-Mail-32.png'/></a>");
          else el_info.html(this.infos.noResult);
        }
    },

  displayGroup : function() {
    var el_displayUser = $('#user_manager_displayGroup');
    el_displayUser.html('');
    if (this.users.length == 0) {
        el_displayUser.append("No Users in this group")
      } else {
        _.each(this.organization.users, function(c){
          el_displayUser.append("<tr><td><img width='30' title='" + c.get('username') + "' src='" + c.get('avatar') + "'></td><td>" + c.get('username') + "</td><td><a data-id-user='" + c.get('id') + "' href='#' class='button tiny radius alert delFromGroup' style='margin:0px'><b data-id-user='" + c.get('id') + "'>+</b></a></td></tr>")
        });
    }
  },

    render : function(){
      ///////////////////////
      // init
      $(this.el).empty();
      $(this.el).append(this.template({
        organization : this.organization.toJSON(),
        info : this.infos.init,
        membersGroup : this.membersgroup.init,
      }));

      //this.displayGroup();

      return this;
    }
});
