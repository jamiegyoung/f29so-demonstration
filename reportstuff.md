# Main Processes

The below processes are the main processes of the system that will be described in this report. This level of detail we believe will provide a better technical understanding of the system and the methods it uses to achieve these processes.

## Processes

### What happens when you first open the website?

When the website is first opened, the server checks the cookies of the user and determines whether the user is logged in or not. If the user is logged in, the server will serve the home page to the user and the content it provides. If the user is not logged in, the server will redirect them to the login page and they will be able to log in / register.

### How does the server handle login and registration?

When the user logs in with either google or facebook, the server receives a id and provider from the social media provider. The server will then check the 'Credentials' table in the database to see if they exist already. If the user is not registered, the server will create new credentials and associate the provider and provider's user id with our WALLS user id. If the credentials exist, the server then checks the 'User' table to see if they finished registering an account. If they have, the server will set their cookies and redirect them to the home page. If they have not, the server will redirect them to the registration page. On the registration page the user must enter an email and username, these are validated both by the font-end and server side. When the user submits a valid registration form (email and username), the server will create a new user in the user table, associate it with the credentials, set the cookies and redirect them to the home page.

### Once logged in the first thing the user will see is the home page, it is important to understand how the homepage is constructed.

The first check the website makes is the route, as '/home' does not match '/login' or '/registration' the website loads the application frame. As the application frame is being loaded, the next check the website makes is whether the user is logged in, this is independent to the server check and is just another layer of security. If the user is not logged in, it stores the user information in the user state handled by redux and then the website will redirect them to the login page.  The first component within the application frame that is loaded is the navbar, this requires some of the user's information to be displayed as shown below:

The navbar gets the user's information using the api route '/api/v1/user' and that user information (name, join date, contributions) is then displayed in the navbar. The sidebar is then loaded which checks the current location in the website (e.g '/home' or '/profile') in order to display the correct current page. Finally, the website looks at the route and matches either '/' or '/home' which both load the home component. The home component is relatively simple, just containing the feed component. The feed component makes a call to the api route '/api/v1/get-feed' which returns a list of the WALLS that have been created in descending order of last edited. The feed then maps over the list of WALLS and generates WallPost components for each WALL. Each WallPost component takes the details of the wall it is displaying including a thumbnail from the list and presents them to the user. Each WallPost contains a link to the wall (to edit it) in the form of a contribute button, a like button and a dropdown menu which allows for more actions to be performed on the wall (e.g delete, report, share, etc).

### When opening a profile page, it is good to understand how it is constructed.

In a similar manner to the home page, routes are matched and different components load making api requests if required. The profile page has three tabs: 'WALLS', 'FOLLOWING', and 'LIKES', and that it always loads on the 'WALLS' tab. Therefore, an api request to '/get-user-walls' is made to generate the WallPost components for the 'WALLS' tab which should only contains that user's posts. In a similar fashion, if the 'following' tab is opened it will generate components for each follower using the route '/get-user-following' and the same with the likes tab. Specific functionalities for the profile page are the 'create wall' button, the 'follow'/'unfollow' buttons with the 'is following' indication, and the 'Delete User' button. The 'Create Wall' button is only displayed if the profile page that is open is the currently logged in user's profile page as seen below:

The 'follow'/'unfollow' buttons and 'is following' indication are only displayed if the profile page that is open is not the currently logged in user's profile page as seen below:

The 'Delete User' button is only displayed if the currently logged in user is an admin, as seen below:

The 'Delete User' button also has confirmation functionality, where after being clicked, the administrator will be asked to confirm the deletion of the user and can only do so after 5 seconds.

What exactly is happening when a user edits a pixel?
When / How is the thumbnail generated?
What is happening during registration / login
What is happening when you follow someone
What is happening when you like a post
How does the website show the history of a pixel
What is happening when you view someone else's profile
What is happening when an admin delete a user
What is happening when an admin delete a post
What happens when a user reports a post
What happens when you open the home page
What happens when you first open the website