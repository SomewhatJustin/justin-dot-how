module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("main.css")
  eleventyConfig.addPassthroughCopy("drinks.css")
  eleventyConfig.setTemplateFormats(["md", "html", "jpeg", "ttf"])
}