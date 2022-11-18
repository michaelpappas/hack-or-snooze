"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  const storyId = story.storyId; // "c6d65c21-7a70-4f29-affa-c764b3308e07"

  const favIconHTML = includesFavorite(storyId)
    ? `<i class="bi bi-star-fill fav"></i>`
    : `<i class="bi bi-star fav"></i>`;

  const deleteIconHTML = viewingOwnStories
    ? `<i class="bi bi-trash del"></i>`
    : "";

  return $(`
      <li id="${story.storyId}">
        ${deleteIconHTML}${currentUser ? favIconHTML : ""} <a href="${
    story.url
  }" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

/** take the submit form information and adds a new story to the page
 * clears form
 * hides form
 */
async function addStoryToPage(evt) {
  evt.preventDefault();

  const newStory = await storyList.addStory(currentUser, {
    title: $storyTitle.val(),
    author: $authorName.val(),
    url: $storyUrl.val(),
  });

  $storyForm.hide();
  $storyForm.trigger("reset");

  viewingOwnStories = false;
  const $newStoryHTML = generateStoryMarkup(newStory);
  resetPage();
  $allStoriesList.prepend($newStoryHTML);
  checkForRememberedUser();
}

$storyForm.on("submit", addStoryToPage);

/** When the star next to the story is clicked on, updates current user's favorite stories
 *  in the server and the current page.
 */

async function toggleFavorite(evt) {
  const storyId = $(evt.target).closest("li").attr("id");
  // MAKE THIS INTO A STATIC METHOD INSTEAD
  const story = await Story.getStory(storyId);
  console.log(story);
  if (includesFavorite(storyId)) {
    currentUser.updateFavorite(story, "DELETE");
    $(evt.target).toggleClass("bi-star-fill bi-star");
  } else {
    currentUser.updateFavorite(story, "POST");
    $(evt.target).toggleClass("bi-star-fill bi-star");
  }

  return;
}

$allStoriesList.on("click", "i.fav", toggleFavorite);

function addOwnStories() {
  for (let story of storyList.stories) {
    if (isMyStory(story.storyId)) {
      const $story = generateStoryMarkup(story);
      $allStoriesList.append($story);
    }
  }
}

/**  */
async function deleteStory(evt) {
  const storyId = $(evt.target).closest("li").attr("id");
  await axios({
    url: `${BASE_URL}/stories/${storyId}`,
    method: "DELETE",
    data: {
      token: currentUser.loginToken,
    },
  });
  // const deletedStory = storyList.stories.find(
  //   (story) => story.storyId === storyId
  // );

  $allStoriesList.empty();

  debugger;

  addOwnStories();
}

$allStoriesList.on("click", "i.del", deleteStory);

/** Checks if story ID is in current user's favorites*/

function includesFavorite(id) {
  if (currentUser)
    return currentUser.favorites.some((favorite) => favorite.storyId === id);
}

/** Checks if story with input story Id belongs to current user */
function isMyStory(id) {
  return currentUser.ownStories.some((story) => story.storyId === id);
}
