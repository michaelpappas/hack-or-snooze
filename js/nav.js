"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  evt.preventDefault();
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  evt.preventDefault();
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Shows the story submission form when you click submit on nav bar. */

function showStoryForm() {
  putStoriesOnPage();
  $("#story-form").show();
}

$navSubmit.on("click", showStoryForm);

/** Shows the current user's favorite stories when you click favorites on nav bar. */

function showFavorites() {
  viewingOwnStories = false;
  $storyForm.hide();
  $allStoriesList.empty();

  for (let story of storyList.stories) {
    if (includesFavorite(story.storyId)) {
      const $story = generateStoryMarkup(story);
      $allStoriesList.append($story);
    }
  }
}

$navFavorites.on("click", showFavorites);

/** Shows default stories on homepage when you click on Hack or Snooze on nav bar. */

function resetPage() {
  viewingOwnStories = false;
  $storyForm.hide();
  putStoriesOnPage();
}

$navAll.on("click", resetPage);

/** Shows only own stories on page. */

function showMyStories() {
  viewingOwnStories = true;
  $allStoriesList.empty();
  $storyForm.hide();
  addOwnStories();
}

$navMyStories.on("click", showMyStories);
