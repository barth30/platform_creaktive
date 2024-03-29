var User = {
  // Enforce model schema in the case of schemaless databases
  schema: true,
  // autoPK : false,

  attributes: {
    // id : { type : "string", primaryKey : true, required : true},
    
    username      : { type: 'string', unique: true },
    first_name    : { type: 'string'},
    last_name     : { type: 'string'},
    avatar        : { type: 'string', defaultsTo : "images/default_profile.png"},
    email         : { type: 'email',  unique: true },
    passports     : { collection : 'Passport', via : 'user' },
    organizations : { collection : "Organization", via : "users"},
    permissions   : { collection : "Permission", via : "user"},
    contributions : { collection : "Contribution", via : "user"},
    projects      : { collection : "Project", via : "user"},
    role          : { type : "string", required: true, defaultsTo : "user"}
  }
};

module.exports = User;
