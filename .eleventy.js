const fs = require('fs');
const path = require('path');

module.exports = function (eleventyConfig) {
  // Passthrough copies for CSS files
  eleventyConfig.addPassthroughCopy("main.css");
  eleventyConfig.addPassthroughCopy("drinks.css");

  // Passthrough copy for the photography folder
  eleventyConfig.addPassthroughCopy("photography");

  // Add a custom collection to list photos in the 'photography' folder
  eleventyConfig.addCollection("photos", function() {
    const photoFolder = "./photography";
    return fs.readdirSync(photoFolder)
    .filter(fileName => !fileName.endsWith('.html'))
    .map(fileName => ({
      name: fileName,
      path: path.join(photoFolder, fileName)
    }));
  });

  // Set template formats
  eleventyConfig.setTemplateFormats(["md", "html"]);

  // Note: 'jpeg', 'jpg', and 'ttf' do not need to be included as template formats
  // unless they contain template content, which is uncommon.
};
