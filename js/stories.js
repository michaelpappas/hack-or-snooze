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

  const includesFavorite = currentUser.favorites.some(
    (favorite) => favorite.storyId === storyId
  );

  const icon = includesFavorite
    ? `<i onclick ="empty(this)" class="bi bi-star-fill"></i>`
    : `<i onclick ="fill(this)" class="bi bi-star"></i>`;

  if (currentUser) {
    return $(`
      <li id="${story.storyId}">
        ${icon} <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  } else {
    return $(`
      <li id="${story.storyId}">
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
  }
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

// function toggleFavorite(evt) {
//   console.log(evt.target);
//   const filled = "bi bi-star-filled";
//   const empty = "bi bi-star";
//   const currentClass = $(evt.target).attr("class");

//   $(evt.target).toggleClass("bi-star-filled bi-star");

//   // // .attr('class', newClass)
//   // if (currentClass === empty) {
//   //   // this story is not favorited
//   //   $(evt.target).attr("class", filled);
//   // } else {
//   //   // this story is favorited
//   //   $(evt.target).attr("class", empty);
//   // }
//   // // $(evt.target).toggle("bi-star-filled bi-star");
// }

// $allStoriesList.on("click", "i", toggleFavorite);

function fill(x) {
  $(x).attr("class", "bi bi-star-filled");
}

function empty(x) {
  $(x).attr("class", "bi bi-star");
}
