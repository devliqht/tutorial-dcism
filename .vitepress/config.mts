import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "DCISM.org Tutorial",
  description: "A tutorial website for hosting web applications using the dicsm.org web server.",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [

    ],

    sidebar: [
      {
        text: 'Home',
        items: [
          { text: 'Getting Started', link: '/' },
        ],
        collapsed: false,
      },
      {
        text: 'Hosting',
        items: [
          { text: 'Static Sites', link: '/static' },
          { text: 'PHP Server', link: '/php' },
          { text: 'Node.js Applications', link: '/node' },
        ],
        collapsed: false,
      }
    ],

    docFooter: {
      prev: false,
      next: false,
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/vuejs/vitepress' }
    ]
  }
})
