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

  // Passthrough copy for robots.txt
  eleventyConfig.addPassthroughCopy("robots.txt");

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
  eleventyConfig.addCollection("photos", function () {
    const photoFolder = "./photography";
    const photoEntries = fs
      .readdirSync(photoFolder)
      .filter((fileName) => !fileName.endsWith("index.html"))
      .map((fileName) => {
        const sourcePath = path.join(photoFolder, fileName);
        const stats = fs.statSync(sourcePath);
        return {
          name: fileName,
          path: path.posix.join("photography", fileName),
          modifiedAt: stats.mtimeMs
        };
      })
      .sort((a, b) => b.modifiedAt - a.modifiedAt);

    return photoEntries.map(({ name, path }) => ({ name, path }));
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

  // ISO date filter for sitemap
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return dateObj.toISOString().split('T')[0];
  });
};
