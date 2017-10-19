<h2 class="generic-text-container generic-text-container--t-margin generic-text-container--large-font">Other Posts</h2>
<div class="row row--gutters-medium">
<% for (var i = posts.length - 4; i > posts.length - 7; i--) { %>
<div class="row__small-4 row__small-4--b-margin">
  <a href="/posts/<%= posts[i]._id %>">
    <div class="older-post card">
      <img class="older-post__image" src="<%= posts[i].image %>" />
      <div class="older-post__text">
        <% for (var j = posts[i].tags.length - 1; j < posts[i].tags.length; j++) { %>
          <a class="older-post__tag" href="/tags/<%= posts[i].tags[j] %>"><%= posts[i].tags[j] %></a>
        <% } %>
        <h3 class="older-post__title"><%= posts[i].title %></h3>
        <% var monthNames = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "November", "December"
          ];

          var month = monthNames[posts[i].postDate.getMonth()];
          var day = posts[i].postDate.getDate();
          var year = posts[i].postDate.getFullYear();
        %>
        <p class="older-post__date"><%= month + ' ' + day + ', ' + year %></p>
      </div>
    </div>
  </a>
</div>
<% } %>
</div>
<%# Button will load another six posts then move to the end of the list
to allow for more to be loaded until end %>
<button class="button button--b-margin button--b-radius">Load More</button>
