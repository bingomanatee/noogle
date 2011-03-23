var provider = require('./../model/<%- name %>');

module.exports = {
  <% actions.forEach(function(a, i){ %>
    <%- a %> : function(req, res, next) {
      // console.log('controller: "<%- name %>", action "<%- a %>"');
      <% switch (a){ 
       case 'index': %>
       /*
        * action:  GET /<%- name %>s
        */
       try{
       res.render(provider.all());
       } catch (err){
         next(err);
       }
       <% break;
       
       case 'show': %>
       /*
        * action:  GET /<%- name %>s/:id
        */
       provider.get(req.params.id, function(err, <%- name %>){
         if (err) {
          next(err);
         } else {
          res.render(<%- name %>);
         }
       });
       <% break;
       
       case 'delete':  %>
       /* 
        * responds to /<%- name %>s/:id/delete
        */
       provider.get(req.params.id, function(err, <%- name %>){
         if (err) {
          next(err);
         } else {
         res.render(<%- name %>);
         }
       });
       <% break;
       
       case 'destroy': %>
       /* 
        * action: GET /<%- name %>s/:id/destroy
        */
       provider.get(req.params.id, function(err, <%- name %>){
         if (err) {
          next(err);          
         } else {
         provider.delete(req.params.id, function(){
          res.render(<%- name %>);
       });
         }
       });
       <% break;
       
       case 'add':   %>
       /* 
        * 
        * action: GET /<%- name %>s/:id/add
        * recieved by action 'create'
        */
         res.render();
       <% break;
              
       case 'create':  %>
       /**
        * 
        * action:  POST /<%- name %>s/:id/create
        * recieves response from add. 
        * note - the code below assumes that your form has fields
        * with names like "<%- name %>[foo]".
        * If your form does not use array notation for field names,
        * replace req.body.<%- name %> with req.body.
        */
        provider.add(req.body.<%- name %>, function(err, <%- name %>){
         res.render();
         });
         
       <% break;
       
       case 'edit':  %>
       /* 
        * action: /GET /<%- name %>s/:id/edit
        * received by action 'update'
        */
       provider.get(req.params.id, function(err, <%- name %>){
         if (err) {
          next(err);
          } else {
         res.render(<%- name %>);            
          }
       });
       <% break;
       
       case 'update':  %>
       /**
        * 
        * action:  PUT: /<%- name %>s/:id/ 
        * action:  POST: /<%- name %>s/:id/update
        * 
        * note - the code below assumes that your form has fields
        * with names like "<%- name %>[foo]".
        * If your form does not use array notation for field names,
        * replace req.body.<%- name %> with req.body.
        */
        provider.update(req.body.<%- name %>, function(err, <%- name %>){
          if (err){
            next (err);
          } else {
         res.render(<%- name %>);
          }
         });
         
       <% break;
       
      } %>
    }<%- i < actions.length - 1 ? ',' : '' %> // end <%- a %>
<%  })%>
}
