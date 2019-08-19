const { getProjects } = require("./data/projects")
const { getPosts } = require("./data/blog")

module.exports = {
  exportPathMap: async function() {
    const pathMap = {
      "/": { page: "/" },
      "/projects": { page: "/index", query: { section: 2 } },
      "/blog": { page: "/blog" },
      "/resume": { page: "/resume" },
      "/about": {
        page: "/post",
        query: { id: "600070f0-79bb-4c98-80f5-c982f46f36bc" },
      },
    }

    let projects = await getProjects()

    projects.map(project => {
      pathMap[`/project/${project.slug.current}`] = {
        page: "/project",
        query: { id: project._id },
      }
    })

    let posts = await getPosts()

    posts.map(post => {
      pathMap[`/post/${post.slug.current}`] = {
        page: "/post",
        query: { id: post._id },
      }
    })

    return pathMap
  },
}
