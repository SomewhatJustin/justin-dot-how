const fs = require('fs');
const path = require('path');
const { format } = require('date-fns');

module.exports = function (eleventyConfig) {
  // Passthrough copies for CSS files
  eleventyConfig.addPassthroughCopy("main.css");
  eleventyConfig.addPassthroughCopy("drinks.css");

  // Passthrough copy for the photography folder - REMOVED
  // eleventyConfig.addPassthroughCopy("photography"); 

  // Passthrough copy image files from the photography folder
  eleventyConfig.addPassthroughCopy("photography/**/*.{jpg,jpeg,png,gif,webp}");

  // Passthrough copy for the assets folder
  eleventyConfig.addPassthroughCopy("assets");

  // Define the 'post' collection explicitly, excluding the index file
  eleventyConfig.addCollection("post", function(collectionApi) {
    return collectionApi.getFilteredByGlob("./blog/**/*.md")
      .filter(item => {
        // Exclude the index file from the collection
        return !item.inputPath.endsWith('/index.md');
      })
      .sort((a, b) => {
        // Sort by date, newest first
        return b.date - a.date;
      });
  });

  // Add a custom collection to list photos in the 'photography' folder
  eleventyConfig.addCollection("photos", function() {
    const photoFolder = "./photography";
    return fs.readdirSync(photoFolder)
    .filter(fileName => !fileName.endsWith('index.html'))
    .map(fileName => ({
      name: fileName,
      path: path.join(photoFolder, fileName)
    }));
  });

  // Set template formats
  eleventyConfig.setTemplateFormats(["md", "html"]);

  // Note: 'jpeg', 'jpg', and 'ttf' do not need to be included as template formats
  // unless they contain template content, which is uncommon.

  // Add shortcode for current year
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

  // Date formatting filter
  eleventyConfig.addFilter("date", (dateObj, dateFormat) => {
    return format(dateObj, dateFormat);
  });
};
