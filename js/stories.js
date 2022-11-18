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

  const icon = includesFavorite(storyId)
    ? `<span><i class="bi bi-star-fill"></i></span>`
    : `<span><i class="bi bi-star"></i></span>`;

  return $(`
      <li id="${story.storyId}">
        ${currentUser ? icon : ""} <a href="${
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

  const $newStoryHTML = generateStoryMarkup(newStory);
  $allStoriesList.prepend($newStoryHTML);
}

$storyForm.on("submit", addStoryToPage);

function toggleFavorite(evt) {
  console.log(evt.target);

  const $storyId = $(evt.target).closest("li").attr("id");
  const story = storyList.stories.find((story) => story.storyId === $storyId);
  if (includesFavorite($storyId)) {
    currentUser.removeFavorite(story);
    $(evt.target).toggleClass("bi-star-fill bi-star");
  } else {
    currentUser.addFavorite(story);
    $(evt.target).toggleClass("bi-star-fill bi-star");
  }
}
$allStoriesList.on("click", "i", toggleFavorite);

function includesFavorite(id) {
  return currentUser.favorites.some((favorite) => favorite.storyId === id);
}
