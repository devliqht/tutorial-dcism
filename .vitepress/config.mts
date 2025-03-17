import { defineConfig } from 'vitepress'

export default defineConfig({
  title: "Tutorial",
  description: "A tutorial website for hosting web applications using the dicsm.org web server.",
  head: [
    ['link', { rel: 'icon', href: '/logo_light.svg' }]
  ],
  themeConfig: {
    logo: {
      light: '/logo.svg',
      dark: '/logo_light.svg',
    },
    outline: {
      level: [2, 4], 
      label: 'On this page',
    },
    lastUpdated: {
      text: 'Updated at',
      formatOptions: {
        dateStyle: 'full',
        timeStyle: 'medium'
      }
    },
    nav: [

    ],
    search: {
      provider: 'local',
    },
    sidebar: [
      {
        text: 'Home',
        items: [
          { text: 'Getting Started', link: '/' },
          { text: 'Subdomains', link: '/subdomains' },
          { text: 'Built-in Tools', link: '/tools' },
          { text: 'Databases', link: '/databases' },
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

    socialLinks: [
      { icon: 'github', link: 'https://github.com/devliqht/tutorial-dcism' }
    ],
    editLink: {
      pattern: 'https://github.com/devliqht/tutorial-dcism/edit/main/:path',
      text: 'Edit this page on GitHub'
    }
  },
  markdown: {
    image: {
      lazyLoading: true
    }
  }
})
