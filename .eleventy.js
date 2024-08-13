module.exports = function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("main.css")
  eleventyConfig.setTemplateFormats(["md", "html", "jpeg", "ttf"])
}
