const {DateTime} = require("luxon")
module.exports = {
  // Set a default layout for everything in the src folder and below.
  layout: "layouts/post.liquid",
  permalink: "{{ page.fileSlug }}/index.html",
  eleventyComputed: {
    dateString: ({page}) => DateTime.fromJSDate(page.date, {zone: 'utc'}).toLocaleString(DateTime.DATE_FULL)
  }
};
