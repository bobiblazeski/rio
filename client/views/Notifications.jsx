var Notifications = module.exports = React.createClass({
   render : function(){
       return (
           <div className="notifications">
               <div className="notification">
                   <span className="icon-sync"></span>
                   <div className="meta">
                       <div className="title-notification">Trying to connect</div>
                       <div className="description">There seems to be a connection issue</div>
                   </div>
               </div>
           </div>
       );
   }
});