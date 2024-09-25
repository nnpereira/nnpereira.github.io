const { DateTime } = require("luxon");
const pluginSEO = require("eleventy-plugin-seo");

module.exports = function(eleventyConfig) {
  eleventyConfig.setTemplateFormats([
    // Templates:
    "html",
    "njk",
    "md",
    // Static Assets:
    "css",
    "jpeg",
    "jpg",
    "png",
    "svg",
    "woff",
    "woff2"
  ]);

  // Ensure correct passthrough for CSS and other assets
  eleventyConfig.addPassthroughCopy("src/styles.css");

  const seo = require("./src/seo.json");
  eleventyConfig.addPlugin(pluginSEO, seo);

  // Filter for formatting dates
  eleventyConfig.addFilter("htmlDateString", dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: "utc" }).toFormat("yyyy-LL-dd");
  });

  // Disable ghostMode in Browsersync
  eleventyConfig.setBrowserSyncConfig({ ghostMode: false });

  // Add a collection for all posts (optional)
  eleventyConfig.addCollection("posts", function(collection) {
    const coll = collection.getAll().filter(item => item.data.type === "post")

    // Sort in reverse chronological order (make sure your date is stored correctly)
    coll.sort((a, b) => new Date(b.date) - new Date(a.date));
  
    // Add prevPost and nextPost for navigation
    for (let i = 0; i < coll.length; i++) {
      const prevPost = coll[i - 1];
      const nextPost = coll[i + 1];
  
      coll[i].data["prevPost"] = prevPost;
      coll[i].data["nextPost"] = nextPost;
    }
  
    return coll;
  });



  

// Add a collection for tags
eleventyConfig.addCollection("tagList", collection => {
  const tagsObject = {};
  collection.getAll().forEach(item => {
    if (!item.data.tags) return;
    item.data.tags
      .filter(tag => !['post', 'all'].includes(tag))
      .forEach(tag => {
        if (typeof tagsObject[tag] === 'undefined') {
          tagsObject[tag] = 1;
        } else {
          tagsObject[tag] += 1;
        }
      });
  });

  const tagList = [];
  Object.keys(tagsObject).forEach(tag => {
    tagList.push({ tagName: tag, tagCount: tagsObject[tag] });
  });
  return tagList.sort((a, b) => b.tagCount - a.tagCount);
});

  return {
    pathPrefix: "/nnpereira/",
    dir: {
      input: "src",
      includes: "_includes",
      output: "build"
    }
  };
};
