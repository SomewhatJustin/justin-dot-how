const fs = require("fs")
const path = require("path")
const { format } = require("date-fns")
const Image = require("@11ty/eleventy-img")
const photoMetadata = require("./_data/photo-metadata.json")

module.exports = function (eleventyConfig) {
  // Passthrough copies for CSS files
  eleventyConfig.addPassthroughCopy("main.css")
  eleventyConfig.addPassthroughCopy("drinks.css")
  eleventyConfig.addPassthroughCopy({ "node_modules/photoswipe/dist": "assets/photoswipe" })

  // Passthrough copy for the assets folder
  eleventyConfig.addPassthroughCopy("assets")

  // Passthrough copy for robots.txt
  eleventyConfig.addPassthroughCopy("robots.txt")

  // Define the 'post' collection explicitly, excluding the index file
  eleventyConfig.addCollection("post", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("./blog/**/*.md")
      .filter((item) => {
        // Exclude the index file from the collection
        return !item.inputPath.endsWith("/index.md")
      })
      .sort((a, b) => {
        // Sort by date, newest first
        return b.date - a.date
      })
  })

  // Add a custom collection to list photos in the 'photography' folder
  eleventyConfig.addCollection("photos", async function () {
    const photoFolder = "./photography"
    const photoEntries = fs
      .readdirSync(photoFolder)
      .filter((fileName) => !fileName.endsWith("index.html"))
      .filter((fileName) => /\.(avif|gif|jpe?g|png|webp)$/i.test(fileName))
      .filter((fileName) => !photoMetadata[fileName]?.excluded)
      .map((fileName) => {
        const sourcePath = path.join(photoFolder, fileName)
        const stats = fs.statSync(sourcePath)
        return {
          name: fileName,
          path: path.posix.join("photography", fileName),
          modifiedAt: stats.mtimeMs,
        }
      })
      .sort((a, b) => b.modifiedAt - a.modifiedAt)

    return Promise.all(
      photoEntries.map(async ({ name, path: photoPath }) => {
        const metadata = await Image(photoPath, {
          widths: [360, 720, 1200, 1800],
          formats: ["webp", "jpeg"],
          outputDir: "_site/img/photography/",
          urlPath: "/img/photography/",
        })
        const jpeg = metadata.jpeg
        const webp = metadata.webp
        const fallback = jpeg[0]
        const full = jpeg[jpeg.length - 1]

        return {
          name,
          caption: photoMetadata[name]?.caption || "",
          thumbnail: {
            src: fallback.url,
            width: fallback.width,
            height: fallback.height,
          },
          thumbnailSources: [
            {
              type: "image/webp",
              srcset: webp.map((entry) => entry.srcset).join(", "),
            },
            {
              type: "image/jpeg",
              srcset: jpeg.map((entry) => entry.srcset).join(", "),
            },
          ],
          full: {
            src: full.url,
            width: full.width,
            height: full.height,
          },
        }
      }),
    )
  })

  // Set template formats
  eleventyConfig.setTemplateFormats(["md", "html"])

  // Note: 'jpeg', 'jpg', and 'ttf' do not need to be included as template formats
  // unless they contain template content, which is uncommon.

  // Add shortcode for current year
  eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`)

  // Date formatting filter
  eleventyConfig.addFilter("date", (dateObj, dateFormat) => {
    return format(dateObj, dateFormat)
  })

  // ISO date filter for sitemap
  eleventyConfig.addFilter("isoDate", (dateObj) => {
    return dateObj.toISOString().split("T")[0]
  })
}
