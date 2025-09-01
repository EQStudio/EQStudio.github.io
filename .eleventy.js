const fg = require("fast-glob");
const path = require("path");

// top of file
const fs = require("fs");


module.exports = function(eleventyConfig) {
  // Static passthrough
  eleventyConfig.addPassthroughCopy({"src/assets": "assets"});

  eleventyConfig.addFilter("galleryFromCaptions", function (slug, exclude = []) {
    const capPath = path.join("src/assets/galleries", slug, "captions.json");
    try {
      const arr = JSON.parse(fs.readFileSync(capPath, "utf8")); // [{file,title,subtitle}]
      const omit = new Set(exclude);
      return arr
        .filter(x => x.file && !omit.has(x.file))
        .map(x => ({
          src: "/" + path.posix.join("assets/galleries", slug, x.file),
          title: x.title || "",
          subtitle: x.subtitle || "",
          file: x.file
        }));
    } catch {
      return [];
    }
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
      output: "docs"
    },
    templateFormats: ["njk","md","html"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk"
  };
};
