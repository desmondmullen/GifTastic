# GifTastic

***GifTastic gif portfolio* is a tool for searching Giphy.com and saving searches and favorites to make your own portfolio.**

**Please note:** Instead of *clicking* to start and stop gif animations as instructed in the assignment, I chose to have the app run the animations on mouse *hover*. I believe this approach feels more familiar, natural, and intuitive to users.


# Features
In addition to the basic function of the assignment, this app does the following:

### REALLY COOL BITS:
* Favorites: Any gif can be favorited by clicking the empty heart glyphicon (which toggles to a "full" heart). Favorites are recalled by clicking the Favorites button at the left-most of the saved-search buttons.
* Saved-Search Buttons: Users can add their own buttons for saved searches. The really cool bit is that these buttons *can be deleted* by clicking on them while pressing `Option` (on Mac) or `Alt` (on PC), allowing users to truly customize their portfolios.
* Search without having to create a Saved-Search button. This is very useful for just browsing.
* Favorites *and* Saved-Search Buttons are saved in cookies allowing them to persist even after closing the window and/or quitting the browser.

### STILL PRETTY COOL BITS:
* Fully functional and responsive on mobiles using touchstart event handlers (required for iOS, optional for Android which can handle both click and touchstart). The desktop-only 'delete button' feature is not enabled on mobile.
* "Show more for this search..." button at bottom of page loads 10 more gifs at a time based on the last search parameters
* All searches include a maximum rating parameter (default is PG).
* Every gif "card" displays the title and rating of the gif. Every gif's ID is embedded in a data-id attribute in the card for use when saving and/or recalling as a favorite.