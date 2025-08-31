const fg = require("fast-glob");
const path = require("path");

// top of file
const fs = require("fs");


module.exports = function(eleventyConfig) {
  // Static passthrough
  eleventyConfig.addPassthroughCopy({"src/assets": "assets"});

  // Filter to list gallery images by slug
  eleventyConfig.addFilter("galleryImages", function(slug) {
    const pattern = `src/assets/galleries/${slug}/*.{jpg,jpeg,png,gif,webp}`;
    const files = fg.sync(pattern).sort();
    // Map to site URLs
    return files.map(f => "/" + f.replace(/^src\//, ""));
  });

  // Collections for painting & installation (ordered by 'order' in front matter)
  eleventyConfig.addCollection("painting", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/painting/*.md").sort((a,b)=> (a.data.order||99)-(b.data.order||99));
  });
  eleventyConfig.addCollection("installation", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/installation/*.md").sort((a,b)=> (a.data.order||99)-(b.data.order||99));
  });

  eleventyConfig.addFilter("imageMeta", function (slug) {
    const p = path.join("src/assets/galleries", slug, "captions.json");
    try {
      const arr = JSON.parse(fs.readFileSync(p, "utf8"));
      // { "file.jpg": {title, subtitle} }
      return Object.fromEntries(arr.map(x => [x.file, x]));
    } catch {
      return {};
    }
  });

  eleventyConfig.addFilter("basename", p => path.basename(p));

  // Directory settings
  return {
    dir: {
      input: "src",
      includes: "_includes",
      layouts: "_layouts",
      data: "_data",
      output: "_site"
    },
    templateFormats: ["njk","md","html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
